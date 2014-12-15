/*global module, console, require, __dirname, process */
(function () {
	"use strict";

	var os = require('os'),
		path = require("path"),
		grunt = require("grunt"),
		file = grunt.file,
		spawn = require("child_process").spawn,
		_ = require("underscore"),
		envConfiguration = {
			sdkPath: null,
			//sdbPath: null,
			tempPath: '/tmp/_tizen_tools',
			devices: []
		},
		LISTEN_FREQUENCY = 50,
		Tizen,
		SDB_DEVICES_REGEX = /^([A-Za-z0-9\-_]+)\s+(\w+)\s+([0-9a-z\-_]+)$/mi,
		SDB_INSTALL_FAIL_REGEX = /processing result : ([A-Z_\-]+) \[([0-9]+)\] failed/im,
		SDB_PACKAGE_REGEX = /pkg_type\[wgt\] pkgid\[([A-Za-z0-9\-_]+)\] key\[start\] val\[(ok|install|update)\]$/im,
		SDB_INSTALL_ICON = /pkg_type\[wgt\] pkgid\[([A-Za-z0-9\-_]+)\] key\[icon_path\] val\[([a-zA-Z0-9\/\-_\.]+)\]$/im;

	function getDeviceList(doneCallback) {
		var sdb = spawn("sdb", ["devices"]);
		sdb.stdout.on("data", function (data) {
			var deviceMatches;

			data = data.toString().split(os.EOL);

			data.forEach(function (line) {
				deviceMatches = line.match(SDB_DEVICES_REGEX);
				// Save only devices (that are not offline etc).
				if(deviceMatches && deviceMatches[2] && deviceMatches[2] === 'device') {
					grunt.log.debug("Adding device " + deviceMatches[1] + "\t" + deviceMatches[2] + "\t" + deviceMatches[3]);
					envConfiguration.devices.push({
						name: deviceMatches[3],
						uid: deviceMatches[1]
					});
				} else if (deviceMatches) {
					grunt.log.debug("Ignoring device " + deviceMatches[1] + "\t" + deviceMatches[2] + "\t" + deviceMatches[3]);
				}
			});
		});
		sdb.stdout.on("close", function () {
			if (envConfiguration.devices.length === 0) {
				grunt.fail.fatal("No target devices found");
			}

			grunt.verbose.writeln("Found devices [" + envConfiguration.devices.length + "]:\n" + (envConfiguration.devices.map(function (device) {
				return " - [" + device.name + "] " + device.uid;
			}).join("\n")));

			if (doneCallback) {
				// Do async
				process.nextTick(doneCallback);
			}
		});

		sdb.on("error", function(e) {
			grunt.log.error("Something went wrong: " + e);
		});
	}

	function runApp(target, targetName, applicationId, successCallback, failureCallback) {
		var sdb,
			sdbArgs = ["-s", target, "shell", "wrt-launcher", "-s", applicationId];

		grunt.verbose.debug("[" + targetName + "] Spawning 'sdb " + sdbArgs.join(" ") + "'");
		//sdb = spawn("sdb", ["-s", target, "shell", shellCommand]);
		sdb = spawn("sdb", sdbArgs);
		sdb.stdout.on("data", function (data) {
			var cleanData;
			data = data.toString();
			grunt.verbose.debug("[" + targetName + "] SDB run output ["+ data.length + "]:\n" + data);

			// Physical device returns from run method two times we need to handle only the case when we get "result" as data
			if (data.indexOf("result:") > -1) {

				cleanData = data.replace("result: ", "").trim();

				if (cleanData === "launched") {
					grunt.verbose.ok("[" + targetName + "] Application " + applicationId + " has been launched");

					if (typeof successCallback === "function") {
						process.nextTick(function () {
							successCallback(applicationId, target, targetName);
						});
					}
				} else {
					grunt.verbose.error("[" + targetName + "] Failed to run " + applicationId);

					if (typeof failureCallback === "function") {
						process.nextTick(function () {
							failureCallback(applicationId, target, targetName, cleanData);
						});
					}
				}
			}
		});

		sdb.stderr.on("data", function (data) {
			grunt.verbose.debug("[stderr][" + targetName + "] SDB run output ["+ data.length + "]:\n" + data);
		});

		sdb.on("error", function (e) {
			grunt.log.error("[" + targetName + "] Error occurred during checking for running apps. " + e);
		});
	}

	function installApp(target, targetName, wgtFilePath, successCallback, failureCallback) {
		var sdb,
			wgtExists = file.exists(wgtFilePath),
			errorFound = null,
			packageId = null,
			applicationId = null;

		if (!wgtExists) {
			if (typeof failureCallback === "function") {
				process.nextTick(function () {
					failureCallback(target, targetName, applicationId, wgtFilePath, "Given .wgt file [" + wgtFilePath + "] doesn't exists");
				});
				return 1;
			}

			grunt.verbose.error("WGT file doesn't exist in given path [" + wgtFilePath + "]\n" +
				"Failure handler is not set");
		}

		grunt.verbose.writeln("[" + targetName + "] Installing " + wgtFilePath);
		grunt.verbose.debug("[" + targetName + "] Spawning \"sdb -s " + target + " install " + wgtFilePath);
		sdb = spawn("sdb", ["-s", target, "install", wgtFilePath]);
		sdb.stdout.on("data", function (data) {
			var errorMatches,
				packageMatches,
				iconMatches;

			data = data.toString();

			grunt.verbose.debug("[" + targetName + "] SDB install output ["+ data.length + "]:\n" + data);
			packageMatches = data.match(SDB_PACKAGE_REGEX);
			if (packageMatches) {
				packageId = packageMatches[1];
			}

			iconMatches = data.match(SDB_INSTALL_ICON);
			if (iconMatches) {
				applicationId = iconMatches[2].substring(iconMatches[2].lastIndexOf('/') + 1, iconMatches[2].lastIndexOf('.'));
			}

			errorMatches = data.match(SDB_INSTALL_FAIL_REGEX);
			if (errorMatches) {
				errorFound = errorMatches[1];
			}
		});

		sdb.stderr.on("data", function (data) {
			grunt.verbose.debug("[stderr][" + targetName + "] SDB install output ["+ data.length + "]:\n" + data);
		});

		sdb.on("error", function (e) {
			grunt.verbose.error("Error occurred during installation " + e);

			if (typeof failureCallback === "function") {
				process.nextTick(function () {
					failureCallback(target, targetName, applicationId, wgtFilePath, "Error occurred during installation " + e);
				});
			}
		});

		sdb.on("close", function (code, signal) {
			if (!errorFound) {
				grunt.verbose.ok("[" + targetName + "] Application from [" + wgtFilePath + "] has been installed");

				if (typeof successCallback === "function") {
					process.nextTick(function () {
						successCallback(target, targetName, applicationId, wgtFilePath);
					});
				}
			} else {
				grunt.log.error("[" + targetName + "] Installation failed " + errorFound);

				if (typeof failureCallback === "function") {
					process.nextTick(function () {
						failureCallback(target, targetName, applicationId, wgtFilePath, "Installation failed " + errorFound);
					});
				}
			}
		});
	}

	/**
	 *
	 * @param target
	 * @param targetName
	 * @param applicationId
	 * @param {function(target, targetName, applicationId)} runningCallback
	 * @param {function(target, targetName, applicationId, applicationStatus)} stoppedCallback
	 */
	function isRunning(target, targetName, applicationId, runningCallback, stoppedCallback) {
		var sdb,
			sdbArgs = ['-s', target, 'shell', 'wrt-launcher', '--is-running', applicationId];

		grunt.verbose.debug("[" + targetName + "] Spawning \"sdb " + sdbArgs.join(" ") + "\"");
		sdb = spawn("sdb", sdbArgs);

		sdb.stdout.on("data", function (data) {
			var cleanData;
			data = data.toString();
			grunt.verbose.debug("[" + targetName + "] SDB is-running output ["+ data.length + "]:\n" + data);

			// Physical device returns from run method two times we need to handle only the case when we get "result" as data
			if (data.indexOf("result:") > -1) {

				cleanData = data.replace("result: ", "").trim();

				if (cleanData === "running") {
					process.nextTick(function () {
						runningCallback(target, targetName, applicationId);
					});
				} else {
					process.nextTick(function () {
						stoppedCallback(target, targetName, applicationId, cleanData);
					});
				}
			}
		});

		sdb.stderr.on("data", function (data) {
			grunt.verbose.debug("[stderr][" + targetName + "] SDB is-running output ["+ data.length + "]:\n" + data);
		});

		sdb.on("error", function (e) {
			grunt.log.error("[" + targetName + "] Error occurred during checking for running apps. " + e);
		});

		sdb.on("close", function (code, signal) {
			if (code === 1) {
				grunt.log.error("Problem while spawning SDB");
			}
		});
	}

	function pullFile(target, targetName, remotePath, localPath, outputToString, successCallback, failureCallback) {
		var sdb,
			sdbArgs,
			remoteFile;

		if (!remotePath) {
			grunt.log.error("remotePath argument must be given");
			return 1;
		}

		remoteFile = remotePath.split(path.sep).pop();

		if (!localPath) {
			localPath = envConfiguration.tempPath + path.sep + target;
			grunt.verbose.debug("localPath not given, " + localPath + " used instead");
			if (!file.exists(localPath)) {
				file.mkdir(localPath);
				grunt.verbose.debug(localPath + " was created");
			}
		}

		sdbArgs = ['-s', target, 'pull', remotePath, localPath];

		grunt.verbose.debug("[" + targetName + "] Spawning \"sdb " + sdbArgs.join(" ") + "\"");
		sdb = spawn("sdb", sdbArgs);

		sdb.stdout.on("data", function (data) {
			data = data.toString();
			grunt.verbose.debug("[" + targetName + "] SDB pull output ["+ data.length + "]:\n" + data);
		});

		sdb.stderr.on("data", function (data) {
			grunt.verbose.debug("[stderr][" + targetName + "] SDB pull output ["+ data.length + "]:\n" + data);
		});

		sdb.on("error", function (e) {
			grunt.log.error("[" + targetName + "] Error occurred during checking for running apps. " + e);
		});

		sdb.on("close", function (code, signal) {
			var fileContent = null,
				localFile = localPath + path.sep + remoteFile;

			if (code === 1) {
				grunt.log.error("[" + targetName + "] Problem while spawning SDB pull");
				if (typeof failureCallback === "function") {
					process.nextTick(function () {
						failureCallback(target, targetName, "Problem during pulling");
					});
				}
			} else {
				if (outputToString) {
					fileContent = grunt.file.read(localFile);
				}

				if (typeof successCallback === "function") {
					//process.nextTick(function () {

					setTimeout(function () {
						successCallback(target, targetName, fileContent, localFile);
					}, 10);

					//});
				}

			}
		});
	}

	function listenToExitStillRunning(exitCallback, target, targetName, applicationId) {
		setTimeout(function () {
			listenToExit(target, targetName, applicationId, exitCallback);
		}, LISTEN_FREQUENCY);
	}

	function listenToExitStopped(exitCallback, target, targetName, applicationId) {
		process.nextTick(function () {
			exitCallback(target, targetName, applicationId);
		});
	}

	/**
	 *
	 * @param {string} target Device UID
	 * @param {string} targetName Device Name
	 * @param {string} applicationId
	 * @param {function(target, targetName, applicationId)} exitCallback
	 * @returns {number}
	 */
	function listenToExit(target, targetName, applicationId, exitCallback) {
		if (!exitCallback || typeof exitCallback !== 'function') {
			grunt.log.error("Exit callback for listenToExit must be set!");
			return 1;
		}

		isRunning(target, targetName, applicationId,
			listenToExitStillRunning.bind(null, exitCallback),
			listenToExitStopped.bind(null, exitCallback)
		);
	}

	Tizen = {
		/**
		 * Initialization method for the Tizen helper. Gets devices in case they are missing inside configuration
		 * @param [config]
		 * @param [doneCallback] Pass the doneCallback in case you do not give the config for that object
		 * @returns {Tizen}
		 */
		init: function (config, doneCallback) {
			if (config) {
				this.configure(config);
			}

			// If devices were not set find
			if (envConfiguration.devices.length === 0) {
				getDeviceList(doneCallback);
			} else {
				doneCallback();
			}

			return this;
		},
		/**
		 * Sets configuration for the current execution.
		 * @param config
		 */
		configure: function (config) {
			_.each(config, function (value, key) {
				envConfiguration[key] = value;
			});
		},
		build: function(applicationPath) {

		},
		install: function (wgtFilePath, successCallback, failureCallback) {
			var devices = envConfiguration.devices,
				deviceCount = devices.length,
				successCount = 0,
				failureCount = 0;

			function successOrFailure(applicationId, wgtFilePath){
				if(successCount + failureCount === deviceCount && successCount > 0 && typeof successCallback === "function") {
					successCallback(applicationId, wgtFilePath, "Application was successfully installed " + successCount + " time" + (successCount > 1 ? 's' : ''));
				}

				if(successCount + failureCount === deviceCount && failureCount > 0 && typeof failureCallback === "function") {
					failureCallback(applicationId, wgtFilePath, "Application failed to install " + failureCount + " time" + (failureCount > 1 ? 's' : ''));
				}
			}

			function success(target, targetName, applicationId, wgtFilePath) {
				grunt.verbose.debug("[" + targetName + "] Application [" + applicationId + "] successful installed from .wgt file: " + wgtFilePath);
				successCount++;
				successOrFailure(applicationId, wgtFilePath);
			}

			function failure(target, targetName, applicationId, wgtFilePath, message) {
				grunt.verbose.debug("[" + targetName + "] Application [" + applicationId + "] failed to install from .wgt file: " + wgtFilePath);
				grunt.verbose.debug("[" + targetName + "] " + message);
				failureCount++;
				successOrFailure(applicationId, wgtFilePath);
			}

			devices.forEach(function (device) {
				installApp(device.uid, device.name, wgtFilePath, success, failure);
			});
		},
		uninstall: function () {
			throw "Not yet implemented";
		},
		run: function (applicationId, exitCallback) {
			var self = this,
				devices = envConfiguration.devices;

			devices.forEach(function (device) {
				if (typeof exitCallback === "function") {
					runApp(device.uid, device.name, applicationId, function (applicationId, target, targetName) {
						self.onExit(applicationId, exitCallback, target, targetName);
					});
				} else {
					runApp(device.uid, device.name, applicationId);
				}
			});
		},
		kill: function () {
			throw "Not yet implemented";
		},
		getRunningApps: function (applicationId, runningCallback, stoppedCallback) {
			var devices = envConfiguration.devices;

			devices.forEach(function (device) {
				isRunning(device.uid, device.name, applicationId, runningCallback, stoppedCallback);
			});
		},
		pull: function (remotePath, localPath, outputToString, successCallback, failureCallback, target, targetName) {
			var devices = envConfiguration.devices;

			if (target) {
				pullFile(target, targetName, remotePath, localPath, outputToString, successCallback, failureCallback);
			} else {
				devices.forEach(function (device) {
					pullFile(device.uid, device.name, remotePath, localPath, outputToString, successCallback, failureCallback);
				});
			}
		},
		push: function () {
			throw "Not yet implemented";
		},
		/**
		 *
		 * @param applicationId
		 * @param exitCallback
		 * @param {string} [target]
		 * @param {string} [targetName]
		 */
		onExit: function (applicationId, exitCallback, target, targetName) {
			var devices = envConfiguration.devices;

			if (target) {
				listenToExit(target, targetName, applicationId, exitCallback);
			} else {
				devices.forEach(function (device) {
					listenToExit(device.uid, device.name, applicationId, exitCallback);
				});
			}
		}
	};

	module.exports = Tizen;
}());