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

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm ' +
  'install_. After that, you may execute project tasks with _grunt_. For ' +
  'more information about installing and configuring Grunt, please see ' +
  'the Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {
  init.process(  [//{type: 'grunt'},
    // Prompt for these values.
    // init.prompt('name')

  ], function(err, props) {
      // randomize string
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
          stringLength = 10,
          randomString = Array.apply(null, new Array(stringLength)).map(function () {
              return possible[Math.floor(Math.random() * possible.length)];
          }).join(''),
          path = require('path'),
          optionName = grunt.option("name"),
          optionPath = grunt.option("path"),
          files,
          prop;

      // if path is set then move to path
      if (optionPath !== undefined) {
         process.chdir(optionPath);
      }

      // if name is set create folder
      if (optionName !== undefined) {
         props.name = optionName;
         grunt.file.mkdir(optionName);
         process.chdir("./"+props.name);
      } // extract name from directory name
      else {
         props.name = process.cwd().replace(/\\/g,'/').split('/');
         props.name = props.name.pop();
      }

      // general
      props.licenses = [];

      // README.md
      props.js_safe_name = "mock";
      props.git_user = "mock";
      props.git_repo = "mock";
      props.author_name = "mock";
      props.description = [];
      props.tizenId = randomString;

      // package.json
      props.description = "mock",
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

      // creating empty structure
      grunt.file.mkdir("src");
      grunt.file.mkdir("src/css");
      grunt.file.mkdir("src/images");
      grunt.file.mkdir("src/js");
      grunt.file.mkdir("templates");
      grunt.file.mkdir("build");

      // Files to copy (and process).
      files = init.filesToCopy(props);
      // @FIX: quick hack - unfortunatelly process.cwd() does not evaluate every time, but once, eons ago.
      init.destpath = path.join.bind(path, process.cwd());
      init.copyAndProcess(files, props, {noProcess: ['icon.png', 'libs/**', 'src/css/**', 'src/images/**', 'src/js/**']});

      // Generate package.json file.
      init.writePackageJSON('package.json', props);

      // All done!
      done();
  });

};
