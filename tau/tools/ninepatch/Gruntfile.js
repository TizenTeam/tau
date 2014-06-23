module.exports = function(grunt) {
	"use strict";

	var themes = grunt.file.readJSON("../../themes.json"),
		path = require("path"),

		themePath = path.join( "..", "..", themes.path),

		srcNinepatchImage = "nine-patch",
		distNinepatchImage = "nine-patch",
		ninePatchLess = "9-patch.less";

	grunt.initConfig({

		ninepatch: (function( ) {
				var rtn = {},
				devices = themes.device,
				deviceName,
				device,
				theme,
				i,
				len;
	
			for ( deviceName in devices ) {
				if ( devices.hasOwnProperty( deviceName ) ) {
					device = devices[ deviceName ];
	
					for ( i=0, len=device.length; i < len; i++ ) {
						theme = device[i];
	
						rtn[ deviceName + "-" + theme.name ] = {
							options: {
								out: path.join( themePath, theme.path, ninePatchLess )
							},
							files: [{
									src: [path.join( themePath, theme.path, srcNinepatchImage, "**/*.9.png" )],
									dest: path.join( themePath, theme.path, theme.images, distNinepatchImage )
							}]
						};
					}
					
				}
			}
	
			return rtn;
		}()),

		watch : {

			options: {
				livereload: 1337,
				interrupt: true
			},

			ninepatch: {
				files : [ path.join( themePath, "**/*.9.png" ) ],
				tasks : [ "ninepatch" ]
			}

		}
	});

	// load the project's default tasks
	grunt.loadTasks( "tasks");
	grunt.loadNpmTasks( "grunt-contrib-watch" );

	grunt.registerTask("default", [ "ninepatch" ]);
};
