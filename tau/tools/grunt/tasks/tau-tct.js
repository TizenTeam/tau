/*global module, process, require*/
/*
 * TAU TCT package automatic making module.
 */
module.exports = function (grunt) {
	var shell = require("shelljs"),
		path = require("path"),
		// @todo: how to set proper directory by default?
		DOWNLOAD_PATH = path.join(process.env.HOME, "Downloads"),
		relativePath = path.relative("./", DOWNLOAD_PATH || "");

	grunt.registerTask("prepare", "Prepare", function (profile) {
		if (!profile) {
			profile = "mobile"
		}
		grunt.task.run("test-runner-prepare:" + profile);
	});

	grunt.registerTask("fake-tct", "Make fake .tct file in Downloads", function () {
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
				files: [path.join(relativePath, "*.tct")],
				tasks: [
					"copy:tct",
					"serialTctWgt",
					"serialExecTctWgt",
					"tctPackaging",
					"copyTctPackagesToTctMgr",
					"tctUpdatePackagesInfo",
					"clean:tct"
				]
			},
			wearablePackaging: {
				files: [path.join(relativePath, "*.tct")],
				tasks: [
					"copy:tct",
					"serialTctWgt",
					"serialExecTctWgt",
					"tctPackaging",
					"copyTctPackagesToTctMgr",
					"tctUpdatePackagesInfo",
					"clean:tct"
				]
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
			tests: {
				files: [
					{
						expand: true,
						cwd: "tests",
						src: ["js/**", "libs/**"],
						dest: "tests/tau-runner/tests/"
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
			},
			runnerWearableTCT: {
				files: [
					{
						expand: true,
						cwd: path.join("tests"),
						src: ["tct-runner/**"],
						dest: path.join("tct-packages", "0"),
						dot: true
					}
				]
			}
		},
		exec: {
			wgt: {
				command: "cd demos && grunt prepare-app --app=../tests/tau-runner/ --tizen-3-0=true --profile=wearable --no-run=true && cd ..",
				stdout: true
			}
		},
		clean: {
			tct: {
				options: {
					force: true
				},
				src: [
					path.join(relativePath, "tests-*.xml"),
					path.join(relativePath, "*.tct"),
					"tests/tau-runner/xml/*.xml"
				]
			},
			legacy: {
				src: [
					"tests/tau-runner/xml/*.xml",
					"tests/tct-package/*.zip"
				]
			},
			tempTctWgts: {
				src: [
					"tests/tct-packages"
				]
			}
		}
	});

	grunt.loadTasks("demos/tools/app/tasks");

	grunt.registerTask("copyTctWgt", "copy tct wgts", function (number) {
		grunt.config.merge({
			copy: {
				runnerWearableTCT: {
					files: [{
						expand: true,
						cwd: path.join("tests"),
						src: ["tau-runner/**"],
						dest: path.join("tests", "tct-packages", number)
					}]
				}
			}
		});
		grunt.task.run("copy:runnerWearableTCT");
	});

	grunt.registerTask("updateTestIndex", "update index of current test", function (index) {
		grunt.file.write("tests/tct-packages/" + index + "/tau-runner/currentTestIndex.js", "var CURRENT_ITERATION = " + (index - 1) + ";");
	});

	grunt.registerTask("serialTctWgt", "serial make tct wgts", function () {
		var xmls = grunt.file.expand("tests/tau-runner/xml/tests-*.xml"),
			len = xmls.length,
			i;

		for (i = 1; i <= len; i++) {
			grunt.task.run("copyTctWgt:" + i);
			grunt.task.run("updateTestIndex:" + i);
		}
	});

	grunt.registerTask("serialExecTctWgt", "serial make tct wgts", function () {
		var xmls = grunt.file.expand("tests/tau-runner/xml/tests-*.xml"),
			len = xmls.length,
			i;

		for (i = 1; i <= len; i++) {
			shell.exec("cd demos && grunt prepare-app --app=../tests/tct-packages/" + i + "/tau-runner/" +
				" --tizen-3-0=true --profile=wearable --no-run=true --dest-dir=../tests/tct-packages/" + i + "/ && cd ..");
		}
	});

	grunt.registerTask("tctPackaging", "tct packaging", function () {
		var xmls = grunt.file.expand("tests/tau-runner/xml/tests-*.xml"),
			len = xmls.length,
			i;

		for (i = 1; i <= len; i++) {
			shell.exec("cd tests && ./tct-paker.sh -n " + i);
		}
	});

	grunt.registerTask("tctUpdatePackagesInfo", "tct packaging", function () {
		// create tct test plan
		shell.exec("/opt/tools/shell/tct-plan-generator -o /opt/tct/tizen_web_3.0/packages/pkg_infos/wearable_pkg_info.xml --tizen-version tizen_web_3.0 -m '*.zip' --profile wearable");
	});

	grunt.registerTask("copyTctPackagesToTctMgr", "tct packaging", function () {
		// create tct test plan
		shell.exec("cp tests/tct-package/*.zip /opt/tct/tizen_web_3.0/packages/wearable");
	});

	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-exec");

	grunt.registerTask("tau-tct:mobile", ["prepare:mobile", "copy:tests", "fake-tct", "connect:tct", "watch:mobilePackaging"]);
	grunt.registerTask("tau-tct:wearable", ["prepare:wearable", "copy:tests", "fake-tct", "connect:tct", "watch:wearablePackaging"]);
	grunt.registerTask("tau-tct", ["tau-tct:wearable"]);
};