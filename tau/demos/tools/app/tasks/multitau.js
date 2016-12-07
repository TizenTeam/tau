/*global module:false, require:false*/
module.exports = function (grunt) {
	"use strict";

	var fs = require("fs"),
		path = require("path"),
		deviceMap = require("../data/deviceMap"),
		deviceNames = require("../data/deviceNames"),
		devicesIds = {},
		globalAppId = '';

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
		var child = require("child_process");

		options = options || {};
		grunt.log.subhead(command);
		child.exec(command, options, function (error, stdout, stderr) {
			if (stderr) {
				grunt.log.error(stderr);
			}
			if (stdout) {
				grunt.log.debug(stdout);
			}
			callback(error, stdout, stderr);
		});
	}

	function getDeviceList(profile, done) {
		exec("sdb devices", function (error, stdout) {
			var devices = {
					wearable: [],
					mobile: [],
					tv: []
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
					exec("tools/tizen-sdk/bin/web-signing " + dir + ".buildResult -n -p Developer:tools/" + (profile === "tv" ? "tv-" : "") + "profiles.xml", function () {
						exec("tools/tizen-sdk/bin/web-packaging -n -o " + path.join(destDir, appId) + ".wgt " + dir + "/.buildResult/", function () {
							done();
						});
					});
				});
			});
		});
	}

	function build(dir, profile, done, destDir) {
		var config,
			appId,
			packageId;

		fs.exists(dir + "/config.xml", function (exists) {
			if (exists) {
				fs.readFile(dir + "/config.xml", function (err, data) {
					var parseString = require("xml2js").parseString;
					parseString(data, function (err, result) {
						config = result;
						appId = result.widget["tizen:application"][0].$.id;
						packageId = result.widget["tizen:application"][0].$.package;
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

	function screenshot_tizen_3_0(device, profile, app, appId, screen, done) {
		var deviceParam = device ? " -s " + device + " " : "";
		exec("sdb" + deviceParam + " root on", function () {
			exec("sdb" + deviceParam + " shell enlightenment_info -reslist", function (error, result) {
				var regexp = new RegExp("^.*" + appId + ".*$", "gm"),
					match = result.match(regexp)[0],
					PID = match.split(/\s+/)[2];

				exec("sdb" + deviceParam + " shell enlightenment_info -topvwins", function (error, result) {
					var regexp = new RegExp("^.*\\\s" + PID + "\\\s.*$", "gm"),
						match = result.match(regexp)[0],
						winID = match.split(/\s+/)[2];

					exec("sdb" + deviceParam + " shell 'cd /opt/usr/media;enlightenment_info -dump_topvwins'", function (error, result) {
						var dir = app + "/../result/" + screen.name,
							resultDir = result.replace("directory: ", "").replace(/[\r\n]/gm, "");

						exec("sdb" + deviceParam + " pull " + resultDir + "/" + winID + ".png " + dir + ".png", function () {
							var width = screen.width || 257,
								height = screen.height || 457;

							exec("convert -resize " + width + "x" + height + "\\! " + dir + ".png " + dir + ".png", function () {
								//fs.unlink(dir + ".xwd", function () {
								exec("sdb" + deviceParam + " root off", function () {
									done();
								});
								//});
							});
						});
					});

				});

			});
		});
	}


	function screenshot(device, profile, app, screen, done) {
		var deviceParam = device ? " -s " + device + " " : "";
		exec("sdb" + deviceParam + " root on", function () {
			exec("sdb" + deviceParam + " shell xwd -root -out /tmp/screen.xwd", function () {
				var dir = app + "/../result/" + screen.name;
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

	function run_tizen_3_0(device, dir, debug, done) {
		var config,
			appId,
			packageId,
			deviceParam = device ? " -s " + device + " " : "";

		fs.readFile(dir + "/config.xml", function (err, data) {
			var parseString = require("xml2js").parseString;
			parseString(data, function (err, result) {
				config = result;
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


	function run(device, dir, debug, done) {
		var config,
			appId,
			packageId,
			deviceParam = device ? " -s " + device + " " : "";

		fs.readFile(dir + "/config.xml", function (err, data) {
			var parseString = require("xml2js").parseString;
			parseString(data, function (err, result) {
				config = result;
				appId = result.widget["tizen:application"][0].$.id;
				globalAppId = appId;
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

	function fixTV(done) {
		exec("git apply -v  demos/tools/59cc85fc.diff", function () {
			exec("grunt build", function () {
				exec("git checkout -- ../src/js/core/router/Router.js", function () {
					done();
				});
			}, {
				cwd: ".."
			});
		}, {
			cwd: ".."
		});
	}

	function writeTestName(app, name, callback) {
		fs.writeFile(app + "/test.txt", name || "", function (err) {
			if (err) {
				return console.log(err);
			}

			callback();
		});
	}

	grunt.registerMultiTask("multitau", "", function () {
		var options = this.options(),
			profile = options["profile"],
			testToRun = grunt.option("test"),
			async = require("async"),
			debug = grunt.option("tau-debug"),
			noCopy = grunt.option("no-copy-tau") || 0,
			noRun = grunt.option("no-run"),
			tizen_3_0 = grunt.option("tizen-3-0"),
			app = options.app || "MediaQuriesUtilDemo",
			src = options["src"],
			dest = options["dest"],
			destDir = options["dest-dir"],
			done = this.async();

		if (src.substr(-1) !== "/") {
			src += "/";
		}
		grunt.log.ok("delete " + dest);
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
					if (profile === "tv") {
						fixTV(callback);
					} else {
						callback();
					}
				},
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
											if (tizen_3_0) {
												tasks.push(run_tizen_3_0.bind(null, device, app, debug));
											} else {
												tasks.push(run.bind(null, device, app, debug));
											}
											fs.exists(app + 'screenshots.json', function (exists) {
												if (exists) {
													var screenshots = require('../../../' + app + 'screenshots.json'),
														firstTime = 10000;
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
															if (tizen_3_0) {
																screenshot_tizen_3_0(device, profile, app, globalAppId, screenshotItem, function () {
																	setTimeout(function () {
																		next();
																	}, screenshotItem.time - (Date.now() - startTime));
																});
															} else {
																screenshot(device, profile, app, screenshotItem, function () {
																	setTimeout(function () {
																		next();
																	}, screenshotItem.time - (Date.now() - startTime));
																});
															}
														}.bind(null, screenshotItem));
													});
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
};
