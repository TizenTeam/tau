module.exports = function (grunt) {
	var args = ["prepare-app", "--app=../tests/UI-tests/app"];

	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-run");

	grunt.config.merge({
		connect: {
			uiTests: {
				options: {
					port: 9001,
					open: {
						target: "http://localhost:9001/tests/UI-tests/test.html?" + Date.now() + "#mobile"
					},
					keepalive: true
				}
			}
		},
		run: {
			uiTests: {
				options: {
					cwd: "demos/"
				},
				cmd: "grunt",
				args: args
			}
		}
	});
	grunt.registerTask("ui-tests", "Runner of UI tests", function () {
		var test = grunt.option("test");

		if (test) {
			args.push("--test=" + test);
			grunt.config.merge({run: {
				uiTests: {
					args: args
				}
			}});
		}

		grunt.task.run("build", "run:uiTests", "connect:uiTests");
	});
};