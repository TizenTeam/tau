/*jslint nomen: true, plusplus: true */
/*global module, require, __dirname, mu */
module.exports = function (grunt) {
	"use strict";

	var path = require("path"),
		mu = require("mu2"),
		fs = require("fs"),
		m = require("marked"),
		sep = path.sep,
		stream = require("stream"),
		extraMarked = require(__dirname + sep + "guide-tokenizer.js");

	// marked options
	extraMarked.enhance(m);
	m.setOptions({
		renderer: new m.Renderer(),
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: true,
		smartLists: false,
		smartypants: false
	});

	function convert(inFile, onDone, onError) {
		fs.readFile(inFile, {flag: "r", encoding: "utf8"}, function (err, data) {
			if (err) {
				onError(err);
			}
			m(data, function (merr, content) {
				if (merr) {
					onError(merr);
				}
				onDone(content);
			});
		});
	}

	function copyResources(grunt, sourceDir, src, dst, onDone, onError) {
		var i = src.length,
			destination;

		grunt.log.writeln("Copy resources:");
		try {
			while (--i >= 0) {
				destination = src[i].replace(sourceDir, dst);
				grunt.file.copy(src[i], destination);
				grunt.log.writeln("copying " + src[i] + " => " + destination);
			}
			onDone(true);
		} catch (err) {
			grunt.log.error(err);
			onDone(false);
		}

	}

	grunt.registerTask("developer-guide", "", function () {
		var opts = this.options(),
			files = [],
			res = [],
			src = opts.sourceDir,
			dest = opts.destinationDir,
			done = this.async(),
			resources = opts.sourceResources.map(function (item) {
				return src + sep + item;
			}),
			markdownFiles = opts.sourceMarkdown.map(function (item) {
				return src + sep + item;
			});

		mu.root = __dirname + "/guide-templates";

		files = grunt.file.expand(markdownFiles);
		res = grunt.file.expand(resources);

		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}

		grunt.log.writeln("Generating html:");
		files.forEach(function (item) {
			var fileName,
				fullFileName,
				destination,
				buffer = "";
			if (grunt.file.isFile(item)) {
				fullFileName = path.basename(item);
				fileName = path.basename(fullFileName, "md");
				destination = item.replace(src, dest).replace(fullFileName, fileName + "html");

				grunt.log.writeln("converting " + item + " => " + destination);
				convert(item, function (data) {
					if (fs.existsSync(destination)) {
						fs.unlinkSync(destination);
					}

					mu.compileAndRender("guide.html", {content: data}).on("error", function (err) {
						grunt.log.error(err);
						done(false);
					}).on("data", function (data) {
						buffer += data.toString();
					}).on("end", function () {
						grunt.file.write(destination, buffer);
						if (files.indexOf(item) === files.length - 1) {
							copyResources(grunt, src, res, dest, function () {
								done(true);
							}, function () {
								done(false);
							});
						}
					});
				}, function (err) {
					grunt.log.error(err);
					done(false);
				});
			}
		});
	});
};
