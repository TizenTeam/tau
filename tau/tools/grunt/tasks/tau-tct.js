/*
 * TAU TCT package automatic making module.
 */

module.exports = function(grunt) {
	var DOWNLOAD_PATH = process.env.TCT,
		shell = require("shelljs"),
		path = require("path"),
		relativePath = path.relative("./", DOWNLOAD_PATH || "");


	grunt.registerTask("prepare", "Prepare", function(profile) {
		if (!profile) {
			profile = "mobile"
		}
		grunt.task.run("test-runner-prepare:" + profile);
	});

	grunt.registerTask("fake-tct", "Make fake .tct file in Downloads", function() {
		grunt.file.write(path.join(DOWNLOAD_PATH, "fake.tct"), "dummy content");
	});

	grunt.config.merge({

		connect: {
			tct: {
				options: {
					port: 9000,
					open: {
						target: "http://localhost:9000/tests/tau-runner/generate.html?0"
					}
				}
			}
		},
		watch: {
			mobilePackaging: {
				files: [ path.join(relativePath, "*.tct")],
				tasks: ["copy:tct", "exec", "tctPackaging", "copy:mobileTCT", "clean:tct"]
			},
			wearablePackaging: {
				files: [ path.join(relativePath, "*.tct")],
				tasks: ["copy:tct", "exec", "tctPackaging", "copy:wearableTCT", "clean:tct"]
			}
		},
		copy: {
			tct: {
				files: [
					{
						expand: true,
						cwd: relativePath + "/",
						src: ["tests-*.xml"],
						dest: "tests/tau-runner/xml/"
					}
				]
			},
			mobileTCT: {
				files: [
					{
						expand: true,
						cwd: path.join("tests", "tct-package"),
						src: ["*.zip"],
						dest: path.join("dist", "mobile", "tct")
					}
				]
			},
			wearableTCT: {
				files: [
					{
						expand: true,
						cwd: path.join("tests", "tct-package"),
						src: ["*.zip"],
						dest: path.join("dist", "wearable", "tct")
					}
				]
			}
		},
		exec: {
			wgt: {
				command: "cd tests/tau-runner/ && zip -r tau-runner.wgt *",
				stdout: true
			}
		},
		clean: {
			tct: {
				options: {
					force: true
				},
				src: [path.join(relativePath, "tests-*.xml"), path.join(relativePath, "*.tct"), "tests/tau-runner/xml/*.xml"]
			},
			legacy: {
				src: ["tests/tau-runner/xml/*.xml", "tests/tct-package/*.zip"]
			}
		}
	});

	grunt.registerTask("tctPackaging", "tct packaging", function() {
		var i, len,
			xmls = grunt.file.expand("**/tests-*.xml");

		len = xmls.length;
		for(i = 0; i < len; i++) {
			shell.exec("cd tests && ./tct-paker.sh -n " + i);
		}
	});

	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-exec");
	grunt.registerTask("tau-tct:mobile", ["prepare:mobile", "fake-tct", "connect:tct", "watch:mobilePackaging"]);
	grunt.registerTask("tau-tct:wearable", ["prepare:wearable", "fake-tct", "connect:tct", "watch:wearablePackaging"]);
	grunt.registerTask("tau-tct", ["tau-tct:wearable"]);
};