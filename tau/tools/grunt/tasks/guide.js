/*jslint nomen: true, plusplus: true */
/*global module, require, __dirname, mu, console */
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		mu = require("mu2"),
		fs = require("fs"),
		m = require("marked"),
		sep = path.sep,
		customParser = require(__dirname + sep + "guide-custom-parser.js");

	// marked options
	m.setOptions({
		renderer: new m.Renderer(),
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: false,
		smartLists: false,
		smartypants: false
	});

	function convertMarkdown(inFile, onDone, onError) {
		fs.readFile(inFile, {flag: "r", encoding: "utf8"}, function (fileError, data) {
			if (fileError) {
				onError(fileError);
			}
			customParser.parse(data, function (customContent) {
				m(customContent, function (markedError, content) {
					if (markedError) {
						onError(markedError);
					}
					onDone(content);
				});
			}, function (customParserError) {
				onError(customParserError);
			});
		});
	}

	function copyResources(grunt, sourceDir, src, dst, done) {
		var i = src.length,
			destination;

		grunt.log.writeln("Copy resources:");
		try {
			while (--i >= 0) {
				destination = src[i].replace(sourceDir, dst);
				grunt.file.copy(src[i], destination);
				grunt.log.writeln("copying " + src[i] + " => " + destination);
			}
			done(true);
		} catch (err) {
			grunt.log.error(err);
			done(false);
		}

	}

	function processDocument(file, destination, extraParams, success, fail) {
		var buffer = "";
		convertMarkdown(file, function (data) {
			if (fs.existsSync(destination)) {
				fs.unlinkSync(destination);
			}

			mu.compileAndRender("guide.html",
				{
					content: data,
					relativePathPrefix: extraParams.relativePathPrefix
				}
			).on("error", function (err) {
				grunt.log.error(err);
				fail(file);
			}).on("data", function (data) {
				buffer += data.toString();
			}).on("end", function () {
				grunt.file.write(destination, buffer);
				success(file);
			});
		}, function (err) {
			grunt.log.error(err);
			fail(file);
		});
	}

	grunt.registerTask("developer-guide", "", function () {
		var opts = this.options(),
			files = [],
			res = [],
			src = opts.sourceDir,
			dest = opts.destinationDir,
			done = this.async(),
			doneFiles = 0,
			file,
			fileName,
			fullFileName,
			destination,
			relativePathPrefix = "/",
			i,
			resources = opts.sourceResources.map(function (item) {
				return src + sep + item;
			}),
			markdownFiles = opts.sourceMarkdown.map(function (item) {
				return src + sep + item;
			}),
			success = function () {
				if (files.length === ++doneFiles) {
					copyResources(grunt, src, res, dest, done);
				}
			},
			fail = function (file) {
				grunt.log.error("convertion of " + file + " failed!");
				done(false);
			};

		mu.root = __dirname + "/guide-templates";

		files = grunt.file.expand(markdownFiles);
		res = grunt.file.expand(resources);

		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}

		grunt.log.writeln("Generating html:");
		i = files.length;
		while (--i >= 0) {
			file = files[i];
			if (grunt.file.isFile(file)) {
				fullFileName = path.basename(file);
				fileName = path.basename(fullFileName, "md");
				relativePathPrefix = file.replace(src, "").replace(fullFileName, "");
				destination = file.replace(src, dest).replace(fullFileName, fileName + "html");

				grunt.log.writeln("converting " + file + " => " + destination);
				processDocument(file, destination, {relativePathPrefix: relativePathPrefix}, success, fail);
			}
		}
	});
};
