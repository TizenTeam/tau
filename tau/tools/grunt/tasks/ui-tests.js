/* eslint global-require: 0 */
var resemble = require("node-resemble-js"),
	async = require("async"),
	xml2js = require("xml2js"),
	fs = require("fs"),
	path = require("path");

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
						target: "http://localhost:9001/tests/UI-tests/test.html?" + Date.now()
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

	grunt.registerTask("ui-tests-report", "Generate UI tests report in junit format", function (profile) {
		var tests = require(path.join(__dirname, "..", "..", "..", "tests", "UI-tests", "app", profile, "_screenshots.json")),
			done = this.async(),
			builder = new xml2js.Builder(),
			testcase = [],
			count = 0,
			errorsCount = 0,
			resultObject = {
				testsuites: {
					$: {
						errors: 0,
						failures: 0,
						name: "UI",
						tests: 0
					},
					testsuite: [
						{
							$: {
								errors: 0,
								failures: 0,
								name: "UI/" + profile,
								tests: 0,
								disabled: 0,
								hostname: "",
								id: "",
								package: "",
								skipped: 0,
								timestamp: Date.now()
							}
						}
					]
				}
			};

		fs.mkdir(path.join(__dirname, "..", "..", "..", "tests", "UI-tests", "diff"), function () {
			fs.mkdir(path.join(__dirname, "..", "..", "..", "tests", "UI-tests", "diff", profile), function () {

				resemble.outputSettings({
					errorColor: {
						red: 255,
						green: 0,
						blue: 0
					},
					errorType: "floatDifferenceIntensity",
					transparency: 1,
					largeImageThreshold: 0,
					useCrossOrigin: false
				});

				async.eachSeries(tests, function (test, cb) {
					resemble(path.join(__dirname, "..", "..", "..", "tests", "UI-tests", "images", profile, test.name + ".png"))
						.compareTo(path.join(__dirname, "..", "..", "..", "tests", "UI-tests", "result", profile, test.name + ".png"))
						.onComplete(function (result) {
							var tc = {
									$: {
										assertions: 1,
										classname: profile + "." + test.name,
										name: test.name
									}
								},
								value = parseFloat(result.misMatchPercentage);

							result.getDiffImage().pack().pipe(fs.createWriteStream(path.join(__dirname, "..", "..", "..", "tests", "UI-tests", "diff", profile, test.name + ".png")));

							if (value > 0) {
								if (test.pass) {
									tc.error = [{
										$: {
											message: "Not match, current diff: " + value + "%"
										}
									}];
									grunt.log.error("[error] Run test: " + test.name + " result, difference pixels: " + value + "%");
									errorsCount++;
								} else {
									tc["system-out"] = ["Not match, current diff: " + value + "%"];
									grunt.log.warn("[quarantine] Run test: " + test.name + " result, difference pixels: " + value + "%");
								}
							} else {
								grunt.log.ok("[ok] Run test: " + test.name + " result, difference pixels: " + value + "%");
							}

							count++;
							testcase.push(tc);
							cb();
						});
				}, function () {
					var xml;

					resultObject.testsuites.testsuite[0].testcase = testcase;
					resultObject.testsuites.testsuite[0].$.tests = count;
					resultObject.testsuites.testsuite[0].$.errors = errorsCount;
					resultObject.testsuites.$.tests = count;
					resultObject.testsuites.$.errors = errorsCount;
					xml = builder.buildObject(resultObject);

					fs.mkdir(path.join(__dirname, "..", "..", "..", "report"), function () {
						fs.mkdir(path.join(__dirname, "..", "..", "..", "report", "test"), function () {
							fs.mkdir(path.join(__dirname, "..", "..", "..", "report", "test", "UI"), function () {
								fs.mkdir(path.join(__dirname, "..", "..", "..", "report", "test", "UI", profile), function () {
									fs.writeFile(path.join(__dirname, "..", "..", "..", "report", "test", "UI", profile, "TESTS.xml"), xml, function () {
										done();
									});
								});
							});
						});
					});
				});
			});
		});
	});

	grunt.registerTask("ui-tests", "Runner of UI tests", function () {
		var test = grunt.option("test"),
			profile = grunt.option("profile"),
			tauDebug = grunt.option("tau-debug");

		if (test) {
			args.push("--test=" + test);
		}

		if (profile) {
			args.push("--profile=" + profile);
		}

		if (tauDebug) {
			args.push("--tau-debug=1");
		}

		grunt.config.merge({
			run: {
				uiTests: {
					args: args
				}
			}
		});

		grunt.task.run("build", "run:uiTests", "connect:uiTests");
	});

	grunt.registerTask("ui-tests-junit", "Runner of UI tests", function () {
		var test = grunt.option("test"),
			profile = grunt.option("profile");

		args.push("--only-accepted=1");

		if (test) {
			args.push("--test=" + test);
		}

		if (profile) {
			args.push("--profile=" + profile);
		}

		grunt.config.merge({
			run: {
				uiTests: {
					args: args
				}
			}
		});

		grunt.config.merge({
			clean: {
				"ui-test": {
					expand: true,
					src: ["report", "temp", "tests/UI-tests/result", "tests/UI-tests/diff"]
				}
			}
		});

		grunt.task.run("build", "clean:ui-test", "run:uiTests", "ui-tests-report:mobile", "ui-tests-report:wearable");
	});
};