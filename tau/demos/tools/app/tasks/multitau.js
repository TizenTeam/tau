/*global module:false, require:false*/
var fs = require("fs"),
	path = require("path"),
	deviceMap = require("../data/deviceMap"),
	deviceNames = require("../data/deviceNames"),
	xml2js = require("xml2js"),
	child = require("child_process"),
	async = require("async"),
	deviceSizes = {
		mobile: "720x1280",
		wearable: "360x360"
	};

module.exports = function (grunt) {
	"use strict";

	var devicesIds = {},
		globalAppId = "";

	/**
	 * Look ma, it"s cp -R.
	 * @param {string} src The path to the thing to copy.
	 * @param {string} dest The path to the new copy.
	 */
	function copyRecursiveSync(src, dest) {
		var exists = fs.existsSync(src),
			stats = exists && fs.statSync(src),
			isDirectory = exists && stats.isDirectory();

		if (exists && isDirectory) {
			fs.mkdirSync(dest);
			fs.readdirSync(src).forEach(function (childItemName) {
				copyRecursiveSync(path.join(src, childItemName),
					path.join(dest, childItemName));
			});
		} else {
			fs.linkSync(src, dest);
		}
	}

	function unlinkRecursiveSync(src) {
		var exists = fs.existsSync(src),
			stats = exists && fs.statSync(src),
			isDirectory = exists && stats.isDirectory();

		if (exists) {
			if (isDirectory) {
				fs.readdirSync(src).forEach(function (childItemName) {
					unlinkRecursiveSync(path.join(src, childItemName));
				});
				fs.rmdirSync(src);
			} else {
				fs.unlinkSync(src);
			}
		}
	}

	function mkdirRecursiveSync(dir) {
		var dirs = dir.split(path.sep),
			currentDir = dirs.shift();

		if (!currentDir) {
			// we have absolute pathm -rf
			currentDir = path.sep;
		}
		dirs.forEach(function (dirName) {
			if (!fs.existsSync(currentDir)) {
				fs.mkdirSync(currentDir);
			}
			currentDir += path.sep + dirName;
		});
	}

	function exec(command, callback, options) {
		options = options || {};
		grunt.log.subhead(command);
		child.exec(command, options, function (error, stdout, stderr) {
			if (stderr) {
				grunt.log.error(stderr);
			}
			if (stdout) {
				grunt.log.ok(stdout);
			}
			callback(error, stdout, stderr);
		});
	}

	function getDeviceList(profile, done) {
		exec("sdb devices", function (error, stdout) {
			var devices = {
					wearable: [],
					mobile: []
				},
				count = 0;

			stdout.split("\n").forEach(function (line) {
				var portRegexp = /([0-9A-Za-z.:-]+)[ \t]+(device|online|offline)[ \t]+([^ ]+)/mi,
					match = portRegexp.exec(line);

				if (match) {
					if (match[2] === "offline") {
						grunt.log.warn("Offline device " + match[3]);
					} else {
						if (deviceMap[match[3]] === profile) {
							if (match[2] === "offline") {
								grunt.log.warn("Offline device " + match[3]);
							} else {
								if (devices[deviceMap[match[3]]]) {
									devices[deviceMap[match[3]]].push(match[1]);
									devicesIds[match[1]] = deviceNames[match[3]];
								} else {
									grunt.log.warn("Unrecognized device " + match[3]);
								}
								count++;
							}
						}
					}
				}
			});
			done(devices, count);
		});
	}

	function prepareWGT(dir, appId, profile, done, destDir) {
		destDir = destDir || "";

		exec("tools/tizen-sdk/bin/web-build " + dir + " -e .gitignore .build* .settings .sdk_delta.info *.wgt .idea", function () {
			exec("mkdir " + dir + ".buildResult", function () {
				exec("cp " + dir + ".project " + dir + ".buildResult/", function () {
					exec("tools/tizen-sdk/bin/web-signing " + dir + ".buildResult -n -p Developer:tools/profiles.xml", function () {
						exec("tools/tizen-sdk/bin/web-packaging -n -o " + path.join(destDir, appId) + ".wgt " + dir + "/.buildResult/", function () {
							done();
						});
					});
				});
			});
		});
	}

	function build(dir, profile, done, destDir) {
		fs.exists(dir + "/config.xml", function (exists) {
			if (exists) {
				fs.readFile(dir + "/config.xml", function (err, data) {
					if (err) {
						grunt.log.error(err);
					}

					xml2js.parseString(data, function (err, result) {
						var appId;

						if (err) {
							grunt.log.error(err);
						}

						appId = result.widget["tizen:application"][0].$.id;

						fs.unlink(appId + ".wgt", function () {
							prepareWGT(dir, appId, profile, done, destDir);
						});
					});
				});
			} else {
				grunt.log.error("config.xml not exists");
				done(1);
			}
		});
	}

	function screenshotTizen3(device, profile, app, screen, done) {
		var deviceParam = device ? " -s " + device + " " : "";

		exec("sdb" + deviceParam + " root on", function () {
			exec("sdb" + deviceParam + " shell enlightenment_info -reslist", function (error, result) {
				var regexp = new RegExp("^.*" + globalAppId + ".*$", "gm"),
					match = result.match(regexp)[0],
					PID = match.split(/\s+/)[2];

				exec("sdb" + deviceParam + " shell enlightenment_info -topvwins", function (error, result) {
					var regexp = new RegExp("^.*\\\s" + PID + "\\\s.*$", "gm"),
						match = result.match(regexp)[0],
						winID = match.split(/\s+/)[2];

					exec("sdb" + deviceParam + " shell 'cd /opt/usr/media;enlightenment_info -dump_topvwins'", function (error, result) {
						var dir = app + "/../../result/" + profile + "/" + screen.name,
							resultDir = result.replace("directory: ", "").replace(/[\r\n]/gm, "");

						exec("sdb" + deviceParam + " pull " + resultDir + "/" + winID + ".png " + dir + "_raw.png", function () {
							var width = screen.width || 257,
								height = screen.height || 457;

							exec("convert " + dir + "_raw.png -crop " + deviceSizes[profile] + " " + dir + "_crop.png", function () {
								fs.exists(dir + "_crop-0.png", function (exists) {
									var filename = dir + (exists ? "_crop-0.png" : "_crop.png");

									exec("convert " + filename + " -resize " + width + "x" + height + "\\! " + dir + ".png", function () {
										exec("sdb" + deviceParam + " root off", function () {
											fs.unlink(filename, function () {
												fs.unlink(dir + "_crop-1.png", function () {
													fs.unlink(dir + "_raw.png", function () {
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
				});
			});
		});
	}


	function screenshotTizen2(device, profile, app, screen, done) {
		var deviceParam = device ? " -s " + device + " " : "";

		exec("sdb" + deviceParam + " root on", function () {
			exec("sdb" + deviceParam + " shell xwd -root -out /tmp/screen.xwd", function () {
				var dir = app + "/../../result/" + profile + "/" + screen.name;

				exec("sdb" + deviceParam + " pull /tmp/screen.xwd " + dir + ".xwd", function () {
					var width = screen.width || 257,
						height = screen.height || 457;

					exec("convert -resize " + width + "x" + height + "\\! " + dir + ".xwd " + dir + ".png", function () {
						fs.unlink(dir + ".xwd", function () {
							done();
						});
					});
				});
			});
		});
	}

	function screenshot(device, profile, app, screen, done) {
		// check tizen version
		if (globalAppId) {
			// if not exists than run tizen 3 commands
			screenshotTizen3(device, profile, app, screen, done);
		} else {
			screenshotTizen2(device, profile, app, screen, done);
		}
	}

	function openDebuger(device, port, done) {
		var ip = /^([0-9.]+):/.exec(device),
			host = (ip && ip[1]) || "localhost",
			url = "http://" + host + ":" + port + "/";

		exec("chromium-browser --no-first-run --activate-on-launch  --no-default-browser-check --allow-file-access-from-files " +
			"--disable-web-security  --disable-translate--proxy-auto-detect --proxy-bypass-list=127.0.0.1  --app=" + url,
			function () {
				done();
			});
	}

	function runTizen3(device, dir, debug, done) {
		var deviceParam = device ? " -s " + device + " " : "";

		fs.readFile(dir + "/config.xml", function (err, data) {
			if (err) {
				grunt.log.error(err);
			}

			xml2js.parseString(data, function (err, result) {
				var appId,
					packageId;

				if (err) {
					grunt.log.error(err);
				}

				appId = result.widget["tizen:application"][0].$.id;
				packageId = result.widget["tizen:application"][0].$.package;

				globalAppId = appId;

				exec("sdb" + deviceParam + " shell app_launcher -k " + appId, function () {
					exec("sdb" + deviceParam + " shell pkgcmd -un " + packageId, function () {
						exec("sdb" + deviceParam + " install " + appId + ".wgt", function () {
							exec("sdb" + deviceParam + " shell app_launcher " + (debug ? "-w" : "") + " -s " + appId, function (error, stdout) {
								var portRegexp = /port: ([0-9]+)/,
									match = portRegexp.exec(stdout);

								if (debug) {
									if (device.indexOf(":") > -1) {
										openDebuger(device, match[1], done);
									} else {
										exec("sdb" + deviceParam + " forward tcp:" + match[1] + " tcp:" + match[1], function () {
											openDebuger(device, match[1], done);
										});
									}
								} else {
									done();
								}
							});
						});
					});
				});
			});
		});
	}


	function runTizen2(device, dir, debug, done) {
		var deviceParam = device ? " -s " + device + " " : "";

		fs.readFile(dir + "/config.xml", function (err, data) {
			if (err) {
				grunt.log.error(err);
			}

			xml2js.parseString(data, function (err, result) {
				var appId,
					packageId;

				if (err) {
					grunt.log.error(err);
				}

				appId = result.widget["tizen:application"][0].$.id;
				packageId = result.widget["tizen:application"][0].$.package;
				exec("sdb" + deviceParam + " shell wrt-launcher -k " + appId, function () {
					exec("sdb" + deviceParam + " uninstall " + packageId, function () {
						exec("sdb" + deviceParam + " install " + appId + ".wgt", function () {
							exec("sdb" + deviceParam + " shell wrt-launcher " + (debug ? "-d" : "") + " -s " + appId, function (error, stdout) {
								var portRegexp = /port: ([0-9]+)/,
									match = portRegexp.exec(stdout);

								if (debug) {
									if (device.indexOf(":") > -1) {
										openDebuger(device, match[1], done);
									} else {
										exec("sdb" + deviceParam + " forward tcp:" + match[1] + " tcp:" + match[1], function () {
											openDebuger(device, match[1], done);
										});
									}
								} else {
									done();
								}
							});
						});
					});
				});
			});
		});
	}

	function run(device, dir, debug, done) {
		// add device id
		var deviceParam = device ? " -s " + device + " " : "";
		// check that wrt-launcher exists

		exec("sdb" + deviceParam + " shell wrt-launcher", function (errorcode, stdout) {
			if (stdout.indexOf("command not found") > -1) {
				// if not exists than run tizen 3 commands
				runTizen3(device, dir, debug, done);
			} else {
				runTizen2(device, dir, debug, done);
			}
		});
	}

	function writeTestName(app, name, callback) {
		grunt.log.subhead("Test to run: " + name);
		fs.writeFile(app + "/test.txt", name || "", function (err) {
			if (err) {
				return grunt.log.error(err);
			}

			callback();
		});
	}

	grunt.registerMultiTask("multitau", "", function () {
		var options = this.options(),
			profile = options["profile"],
			testToRun = grunt.option("test"),
			debug = grunt.option("tau-debug"),
			noCopy = grunt.option("no-copy-tau") || 0,
			noRun = grunt.option("no-run"),
			app = options.app || "MediaQuriesUtilDemo",
			src = options["src"],
			dest = options["dest"],
			destDir = options["dest-dir"],
			done = this.async();

		if (src.substr(-1) !== "/") {
			src += "/";
		}
		grunt.log.ok("delete " + dest);

		if (testToRun) {
			grunt.log.ok("test to run:" + testToRun);
		}

		fs.lstat(dest, function (error, stats) {
			if (!noCopy) {
				if (stats && stats.isSymbolicLink()) {
					fs.unlinkSync(dest);
				} else {
					unlinkRecursiveSync(dest);
				}
			}
			async.series([
				function (callback) {
					if (!noCopy) {
						mkdirRecursiveSync(dest);
						grunt.log.ok("copy " + src + profile + " -> " + dest);
						copyRecursiveSync(src, dest);
					}
					callback();
				}
			], getDeviceList.bind(null, profile,
				function (devices, count) {
					if (count) {
						writeTestName(app, testToRun, function () {
							build(app, profile, function (error) {
								var tasks = [];

								if (error) {
									grunt.log.error("Error on building");
									done();
								} else {
									if (!noRun) {
										devices[profile].forEach(function (device) {
											tasks.push(run.bind(null, device, app, debug));

											// UI Tests
											/*
											fs.exists(app + "screenshots.json", function (exists) {
												if (exists) {
													var screenshots = require("../../../" + app + "screenshots.json"),
														firstTime = 5000;

													tasks.push(function (next) {
														setTimeout(function () {
															next();
														}, firstTime);
													});
													if (testToRun) {
														screenshots = screenshots.filter(function (item) {
															return item.name === testToRun;
														});
													}
													screenshots.forEach(function (screenshotItem) {
														tasks.push(function (screenshotItem, next) {
															var startTime = Date.now();

															screenshot(device, profile, app, screenshotItem, function () {
																setTimeout(function () {
																	next();
																}, screenshotItem.time - (Date.now() - startTime));
															});
														}.bind(null, screenshotItem));
													});
												}
												async.series(tasks, done);
											});
											*/

											// UI Tests
											fs.exists(app + "screenshots.json", function (exists) {
												if (exists) {
													var	loopTimeout = 1000,
														nextLoop = function () {
															setTimeout(function () {
																checkStatus();
																tasks.push(nextLoop);
															}, loopTimeout);
														};

													tasks.push(nextLoop);
												}
												async.series(tasks, done);
											});
										});
									} else {
										done();
									}
								}
							}, destDir);
						});
					} else {
						done();
					}
				}
			));
		});
	});
}
;
