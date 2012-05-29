module.exports = function(grunt) {

  grunt.registerMultiTask( "qunit", "run QUnit test(node-qunit)", function() {
	var done = this.async();
    var testrunner = require("qunit");
	testrunner.run(this.data, function() {
		done(true);
	});
  });
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
	qunit: {
      libs: {
	     code: "./js/remotelogger.js",
		 deps: [
		    "./js/connector.js",
			"./js/dispatcher.js",
			"./js/filehandler.js",
			"./js/remoteconnector.js",
			"./js/remotelogger.js",
			"./js/recorder.js",
			"./js/player.js"
         ],
		 tests: [
		    "./tests/filehandler.js",
			"./tests/dispatcher.js",
			"./tests/remoteconnector.js",
			"./tests/remotelogger.js"
	     ]
	  },
	  recorder: {
		 deps: [
		    "./js/connector.js",
			"./js/dispatcher.js",
			"./js/filehandler.js",
			"./js/remoteconnector.js",
			"./js/remotelogger.js",
			"./js/recorder.js",
			"./js/player.js"
         ],
		 code: "./js/recorder.js",
		 tests: "./tests/recorder.js"
	  },
	  player: {
		 deps: [
		    "./js/connector.js",
			"./js/dispatcher.js",
			"./js/filehandler.js",
			"./js/remoteconnector.js",
			"./js/remotelogger.js",
			"./js/recorder.js",
			"./js/player.js"
         ],
		 code: "./js/player.js",
		 tests: "./tests/player.js"
	  }
	},
    lint: {
	  tests: ['tests/**/*.js'],
      src: ['js/**/*.js'],
	  monitor: ['monitor/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
		evil: true
      },
	  tests: {
         globals: {
           Connector: true,
		   RemoteConnector: true,
		   RemoteLogger: true,
		   FileHandler: true,
		   Dispatcher: true,
		   Recorder: true,
		   Player: true,
           expect: true,
           stop: true,
		   start: true,
		   module: true,
		   QUnit: true,
		   test: true,
		   equal: true,
		   ok: true,
		   deepEqual: true,
		   asyncTest: true,
		   exports: true,
		   raises: true
		 }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'embed lint qunit');

};
