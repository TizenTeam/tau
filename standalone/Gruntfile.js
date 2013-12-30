module.exports = function(grunt) {
	"use strict";
	
	var utils = grunt.util._,
		path = require("path"),
		dist = "dist" + path.sep,
		name = "tizen.b2",
		themesPath = dist + path.sep + "themes",
		themes = {
			"default" : "src/css/themes/black",
			"black" : "src/css/themes/black",
		},
		files = {
			css: {
				lessSuffix: ".less",
				unminifiedSuffix: ".css",
				minifiedSuffix: ".min.css",

				getCssFiles: function( ) {
					var list = [],
						css = files.css,
						key, value;
					for(key in themes) {
						value = themes[key];
						list.push({
							src: path.join(value, name) + css.lessSuffix,
							dest: path.join( themesPath, key, name ) + css.unminifiedSuffix
						});
					}
					return list;
				},

				getMinifiedCSSFiles : function( ) {
					var list = [],
						css = files.css,
						key, value;
					
					for(key in themes) {
						list.push({
							src: path.join( themesPath, key, name ) + css.unminifiedSuffix,
							dest: path.join( themesPath, key, name ) + css.minifiedSuffix
						});
					}
					return list;
				}
			},

			images: {
				folder: "images",

				getImagesFolder: function() {
					var list = [],
						key, value;
					for(key in themes) {
						value = themes[key];
						list.push({
							expand: true,
							cwd: path.join( value, files.images.folder ),
							src: "**",
							dest: path.join( themesPath, key, files.images.folder )
						});
					}
					return list;
				}
			}

		};

	grunt.initConfig({
		less : {
			style : {
				files : files.css.getCssFiles()
			}
		},
		cssmin: {
			options: {
				keepSpecialComments: 0
			},
			minify: {
				files: files.css.getMinifiedCSSFiles()
			}
		},
		copy: {
			images: {
				files: files.images.getImagesFolder()
			}
		},
		watch : {
			css : {
				files : [ "src/css/**/*" ],
				tasks : [ "less" ],
				options: {
					// Start a live reload server on the default port 35729
					livereload: true,
					interrupt: true,
				}
			}
		}

	});

	grunt.loadNpmTasks( "grunt-contrib-clean" );
	grunt.loadNpmTasks( "grunt-contrib-copy" );
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks( "grunt-contrib-requirejs" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks( "grunt-contrib-cssmin" );
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("css", [ "less", "cssmin", "copy" ]);

	grunt.registerTask("default", [ "css" ]);
};
