var fs = require("fs"),
	path = require("path"),
	deviceMap = {
		"SM-R380": "wearable",
		"SM-R381": "wearable",
		"SM-R750": "wearable",
		"SM-R750A": "wearable",
		"SM-V700": "wearable",
		"SM-Z130H": "mobile",
		"SM-Z300H": "mobile",
		"device-1": "mobile",
		"device-2": "mobile",
		"<unknown>": "tv",
		"Wearable-B2": "wearable"
	},
	deviceNames = {
		"SM-R380": "gear2",
		"SM-R381": "gear2",
		"SM-R750": "gearS",
		"SM-R750A": "gearS",
		"SM-V700": "gear2",
		"SM-Z130H": "kiran",
		"SM-Z300H": "z3",
		"device-1": "redwood",
		"device-2": "redwood",
		"<unknown>": "tv",
		"Wearable-B2": "gear"
	},
	devicesIds = {};

module.exports = function (grunt) {
	"use strict";

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
				var portRegexp = /([0-9A-Za-z.:]+)[ \t]+(device|online|offline)[ \t]+([^ ]+)/mi,
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

	function prepareWGT(dir, appId, profile, done) {
		exec("tools/tizen-sdk/bin/web-build " + dir + " -e .gitignore .build* .project .settings .sdk_delta.info *.wgt", function () {
			exec("tools/tizen-sdk/bin/web-signing " + appId + "/.buildResult -n -p default:tools/" + (profile === "tv" ? "tv-" : "") + "profiles.xml", function () {
				exec("tools/tizen-sdk/bin/web-packaging -n -o " + appId + ".wgt " + dir + "/.buildResult/", function () {
					done();
				});
			});
		});
	}

	function build(dir, profile, done) {
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
							prepareWGT(dir, appId, profile, done);
						});
					});
				});
			} else {
				grunt.log.error("config.xml not exists");
				done(1);
			}
		});
	}

	function screenshot(device, profile, app, name, done) {
		var deviceParam = device ? " -s " + device + " " : "";
		exec("sdb" + deviceParam + " root on", function () {
			exec("sdb" + deviceParam + " shell xwd -root -out /tmp/screen.xwd", function () {
				var dir = app + "/../result/" + name;
				exec("sdb" + deviceParam + " pull /tmp/screen.xwd " + dir + ".xwd", function () {
					exec("convert -resize 257 -crop 257x457+0+15 " + dir + ".xwd " + dir + ".png", function () {
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
			url = "http://" + host + ":" + port + "/inspector.html?page=1";
		exec("chromium-browser --no-first-run --activate-on-launch  --no-default-browser-check --allow-file-access-from-files " +
			"--disable-web-security  --disable-translate--proxy-auto-detect --proxy-bypass-list=127.0.0.1  --app=" + url,
			function () {
				done();
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


	grunt.registerMultiTask("multitau", "", function () {
		var options = this.options(),
			profile = options["profile"],
			async = require("async"),
			debug = grunt.option("tau-debug"),
			noRun = grunt.option("no-run"),
			app = options.app || "MediaQuriesUtilDemo",
			src = options["src"],
			dest = options["dest"],
			done = this.async();
		if (src.substr(-1) !== "/") {
			src += "/";
		}
		grunt.log.ok("delete " + dest);
		fs.lstat(dest, function (error, stats) {
			if (stats && stats.isSymbolicLink()) {
				fs.unlinkSync(dest);
			} else {
				unlinkRecursiveSync(dest);
			}
			async.series([
				function(callback) {
					if (profile === "tv") {
						fixTV(callback);
					} else {
						callback();
					}
				},
				function (callback) {
					mkdirRecursiveSync(dest);
					grunt.log.ok("copy " + src + profile + " -> " + dest);
					copyRecursiveSync(src, dest);
					callback();
				}
			], getDeviceList.bind(null, profile,
				function (devices, count) {
					if (count) {
						build(app, profile, function (error) {
							var tasks = [];
							if (error) {
								grunt.log.error("Error on building");
								done();
							} else {
								if (!noRun) {
									devices[profile].forEach(function (device) {
										console.log(__dirname);
										var screenshots = require('../../../' + app + 'screenshots.json');
										tasks.push(run.bind(null, device, app, debug));
										screenshots.forEach(function(screenshotItem) {
											tasks.push(function (next) {
												setTimeout(function () {
													screenshot(device, profile, app, screenshotItem.name, next);
												}, screenshotItem.time);
											});
										});
									});
									async.series(tasks, done);
								} else {
									done();
								}
							}
						});
					} else {
						done();
					}
				}
			));
		});
	});
};
