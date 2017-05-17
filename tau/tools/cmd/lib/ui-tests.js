/*global module:false, require:false*/
var TIME_TICK = 1000,
	fs = require("fs"),
	path = require("path"),
	cmd = require("./cmd"),
	xml2js = require("xml2js"),
	child = require("child_process"),
	deviceMap = require("../../../demos/tools/app/data/deviceMap.js"),
	deviceTypes = require("../../../demos/tools/app/data/deviceTypes.js"),

	requestFileName = "test-request.txt",
	responseFileName = "test-response.txt",
	remoteFolder = "/opt/usr/home/owner/media/Downloads",
	requestFullFileName = path.join(remoteFolder, requestFileName),
	localResponseFullFileName,

	screenshots = [],
	profile,
	type,
	app,
	globalAppId,
	localRequestFile = null,
	deviceParam,

	tempFolder = null,

	uiTests = {},
	i = 0,
	doneCallback,
	end = 30,
	deviceSizes = {
		mobile: "720x1280",
		wearable: "360x360"
	};

function exec(command, callback, options) {
	options = options || {};
	//console.log.subhead(command);
	child.exec(command, options, function (error, stdout, stderr) {
		if (stderr) {
			console.error(stderr);
		}
		if (stdout) {
			console.log(stdout);
		}
		callback(error, stdout, stderr);
	});
}

function done() {
	console.log(":done");
	// clear temp dir
	fs.rmdir(tempFolder, function (error) {
		if (error) {
			console.log(error);
		}
		console.log("Success done");
		doneCallback();
	});
}

function removeLocalRequestFile(file, onSuccess, onError) {
	console.log(":removeLocalRequestFile");
	fs.unlink(file, function (error) {
		if (error) {
			onError();
		} else {
			onSuccess();
		}
	});
}
function removeLocalResponseFile(file, onSuccess, onError) {
	console.log(":removeLocalResponseFile");
	fs.unlink(file, function (error) {
		if (error) {
			onError();
		} else {
			onSuccess();
		}
	});
}

function takeScreenshot(pageName, onDone) {
	console.log(":takeScreenshot", pageName);

	pageName = pageName.replace(".html", "");

	var screenshotItem = screenshots.filter(function (item) {
		return item.name === pageName;
	});

	screenshotItem = screenshotItem[0];
	if (screenshotItem) {
		screenshot(profile, type, app, screenshotItem, onDone);
	}
}

function next(done) {
	// end of watching
	if (i >= end) {
		done();
	} else {
		setTimeout(tick.bind(null, done), TIME_TICK);
	}
}

function removeRemoteRequest(onSuccess) {
	console.log(":removeRemoteRequest");
	exec(`sdb ${deviceParam} root on`, function (error, stdout, stderr) {
		if (error) {
			console.log("error: " + error);
		}
		exec(`sdb ${deviceParam} shell 'rm ${requestFullFileName}'`, function (error, stdout, stderr) {
			if (error) {
				console.log("error: " + error);
			}
			exec(`sdb ${deviceParam} root off`, function (error, stdout, stderr) {
				if (error) {
					console.log("error: " + error);
				}
				onSuccess();
			});
		});
	});
}

function setLongLife(onSuccess) {
	exec(
		`sdb ${deviceParam} root on`,
		function (error, stdout, stderr) {
			if (error) {
				console.log("error: " + error);
			}
			exec(
				`sdb ${deviceParam} shell vconftool set -t int db/setting/lcd_backlight_normal 6000 -f`,
				function (error, stdout, stderr) {
					if (error) {
						console.log("error: " + error);
					}
					exec(
						`sdb ${deviceParam} root off`,
						function (error, stdout, stderr) {
							if (error) {
								console.log("error: " + error);
							}
							onSuccess();
						});
				});
		});
}

function sendResponse(onSuccess) {
	console.log(":sendResponse");
	exec(
		`sdb ${deviceParam} push ${localResponseFullFileName} ${remoteFolder}`,
		function (error, stdout, stderr) {
			if (error) {
				console.log("error: " + error);
			} else {

			}
			removeRemoteRequest(onSuccess);
		});
}

function prepareResponse(data, onSuccess) {
	console.log(":prepareResponse");
	localResponseFullFileName = path.join(tempFolder, responseFileName);

	fs.writeFile(localResponseFullFileName, data, "utf8", function (error) {
		if (error) {
			// if file not exists
			console.log("error", error);
		} else {
			sendResponse(onSuccess);
		}
	});
}


function parseData(data, onSuccess) {
	console.log("data: ", data);

	var onDone = function () {
		console.log("onDone");
		prepareResponse(`done(${param})`, onSuccess);
	};

	var matched = data.match(/^[^:]+/gi),
		cmd,
		param;

	if (matched) {
		cmd = matched[0];
		param = data.replace(cmd + ":", "");
	}

	if (cmd) {
		switch (cmd) {
			case "take-screenshot" :
				takeScreenshot(param, onDone);
				break;
			default :
				onDone();
				break;
		}
	} else {
		onDone();
	}

}

function tick(done) {
	console.log(":tick", i);

	exec(
		`sdb ${deviceParam} pull ${requestFullFileName} ${tempFolder}`,
		function (error, stdout, stderr) {
			i++;

			if (error) {
				next(done);
			} else {
				// check file content
				localRequestFile = path.join(tempFolder, requestFileName);

				fs.readFile(localRequestFile, "utf8", function (error, data) {
					console.log("(fs.readFile)");
					if (error) {
						// if file not exists
						console.log("error", error);
						next(done);
					} else if (data === "") {
						// wait for full data
						console.log("uncompleted data");
						next(done);
					} else {
						parseData(data, function () {

							console.log("Received: " + data);

							if (data.indexOf("end!") === 0) {
								i = end;
							} else {
								i = 0;
							}

							// remove request file from temporary dir;
							removeLocalRequestFile(localRequestFile,
								function () {
									console.log("onSuccess remove local request file");
									removeLocalResponseFile(localResponseFullFileName,
										function () {
											next(done);
										},
										function () {
											console.log("removeLocalResponseFile: error");
										}
									);
								},
								function () {
									console.log("onError");
								}
							);
						});
					}
				});

				if (stderr) {
					//console.log("stderror: " + stderr);
				}
			}

		}
	);
}


function screenshotTizen3(profile, type, app, screen, done) {
	console.log(":screenshotTizen3");

	exec("sdb" + deviceParam + " root on &", function () {
		console.log("root on");
		exec("sdb" + deviceParam + " shell enlightenment_info -reslist", function (error, result) {
			console.log("shell enlightenment_info -reslist");
			var regexp = new RegExp("^.*" + globalAppId + ".*$", "gm"),
				match = result.match(regexp)[0],
				PID = match.split(/\s+/)[2];

			exec("sdb" + deviceParam + " shell enlightenment_info -topvwins", function (error, result) {
				console.log("shell enlightenment_info -topvwins");
				var regexp = new RegExp("^.*\\\s" + PID + "\\\s.*$", "gm"),
					matches = result.match(regexp),
					match = "",
					winID;

				if (matches) {
					match = matches[0];
					winID = match.split(/\s+/)[2];
					exec("sdb" + deviceParam + " shell 'cd /opt/usr/media;enlightenment_info -dump_topvwins'", function (error, result) {
						console.log("shell 'cd /opt/usr/media;enlightenment_info -dump_topvwins'");
						var dir = app + "/../../result/" + profile + "/" + type + "/" + screen.name,
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
				} else {
					console.log("Device issue: app window is not available! App PID(" + PID + ")");
					exec("sdb" + deviceParam + " root off", function () {
						// wait for next tick
					});
				}

			});
		});
	});
}


function screenshotTizen2(profile, type, app, screen, done) {
	console.log(":screenshotTizen2");

	exec("sdb" + deviceParam + " root on &", function () {
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

function screenshot(profile, type, app, screen, done) {
	// check tizen version
	if (globalAppId) {
		// if not exists than run tizen 3 commands
		screenshotTizen3(profile, type, app, screen, done);
	} else {
		screenshotTizen2(profile, type, app, screen, done);
	}
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
								devices[deviceMap[match[3]]].push({
									id: match[1],
									name: match[3],
								});
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

function getDevice(done) {
	getDeviceList(profile,
		function (devices, count) {
			if (count) {
				devices[profile].forEach(function (device) {
					deviceTypes[profile].forEach(function (info) {
						if (info.device === device.name && info.type === type) {
							deviceParam = " -s " + device.id + " ";
						}
					});
				});
				console.log("device", deviceParam);
			}
			done();
		});
}

uiTests.config = function (config, done) {
	screenshots = config.screenshots;
	profile = config.profile;
	type = config.type;
	app = config.app;
	fs.readFile(app + "/config.xml", function (err, data) {
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

			globalAppId = appId;
			getDevice(done);
		});
	});
};

uiTests.run = function (callback) {
	i = 0;
	doneCallback = callback;
	setLongLife(function () {
		fs.mkdir(__dirname + "/../../../temp", function (error) {
			if (error) {
				console.log("(fs.mkdtemp) " + error);
			}
			fs.mkdtemp(__dirname + "/../../../temp/ui-tests-", function (error, folder) {
				if (error) {
					console.log("(fs.mkdtemp) " + error);
					return;
				}
				tempFolder = folder;
				setTimeout(tick.bind(null, done), TIME_TICK);
			});
		});
	});
};

module.exports = uiTests;
