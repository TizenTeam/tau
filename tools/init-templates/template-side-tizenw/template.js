/*
 * grunt-init-commonjs
 * https://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';
// Basic template description.
exports.description = 'Create a commonjs module, including Nodeunit unit tests.';
// Template-specific notes to be displayed before question prompts.
exports.notes = '';
// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {
	init.process(  [


  ], function(err, props) {
	//randomize string
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
		stringLength = 10,
			randomString = Array.apply(null, new Array(stringLength)).map(function () {
				return possible[Math.floor(Math.random() * possible.length)];
		}).join(''),
		optionName = grunt.option("name"),
		optionPath = grunt.option("path"),
		files;

		//if path and name are set then
		//move to path, create directory, then process.chdir
		if (optionPath !== undefined) {
		  process.chdir(optionPath);
		}
		else {
		optionPath = process.cwd().replace(/\\/g,'/');
		}

		if (optionName !== undefined) {
		  props.name = optionName;
		  grunt.file.mkdir(optionName);
		  process.chdir(optionPath + "/" + optionName);
		} //extract name form directory name
		else {
		  props.name = process.cwd().replace(/\\/g,'/').split('/');
		  props.name = props.name.pop();
		}

		//general
		props.licenses = [];

		//README.md
		props.js_safe_name = "rachael";
		props.git_user = "rachael";
		props.git_repo = "rachael";
		props.author_name = "rachael";
		props.description = [];
		props.tizenId = randomString;

		//package.json
		props.description = "rachael",
		props.version = '0.0.1',
		props.repository = "",
		props.homepage = "www",
		props.bugs = "",
		props.author_name = "",
		props.author_email = "",
		props.author_url = "",
		props.node_version = "",
		props.main = "Gruntfile.js",

		props.devDependencies = {
		"grunt": "~0.4.1",
		"load-grunt-tasks": "0.2.x",
		"require-xml": "0.0.1",
		"grunt-contrib-clean": "0.5.x",
		"grunt-tizen": "https://github.com/rafalgalka/grunt-tizen/tarball/develop",
		"grunt-shell": "~0.5.0",
		"grunt-contrib-copy": "~0.4.1",
		"grunt-string-replace": "~0.2.4",
		"grunt-contrib-symlink": "~0.1.1",
		"colors": "~0.6.2"
		};
		//creating empty structure
		grunt.file.mkdir("src");
		grunt.file.mkdir("src/css");
		grunt.file.mkdir("src/images");
		grunt.file.mkdir("src/js");

		// Files to copy (and process).
		files = init.filesToCopy(props);

		init.copyAndProcess(files, props, {noProcess: ['src/css/**', 'src/images/**', 'src/js/**']});

		// Generate package.json file.
		init.writePackageJSON('package.json', props);

		// All done!
		done();
  });

};
