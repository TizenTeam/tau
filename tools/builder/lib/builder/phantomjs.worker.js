/*global require, phantom, console, window, setTimeout */
/*jslint plusplus: true */
(function (phantom, require) {
	"use strict";
	var NUMBER_OF_REQUIRED_ARGUMENTS = 4;

	function info(msg) {
		console.log("INFO: " + msg);
	}

	function err(msg) {
		console.error("ERROR: " + msg);
	}

	function warn(msg) {
		console.warning("WARNING: " + msg);
	}

	function run() {
		var fs = require("fs"),
			page = require("webpage").create(),
			system = require("system"),
			config = require("./config.js"),
			args = phantom.args,
			injected = args[0].replace(/\"/gi, "").trim().split(","),
			input = args[1].replace(/\"/gi, "").trim(),
			output = args[2].replace(/\"/gi, "").trim(),
			os = args[3].replace(/\"/gi, "").trim(),
			timeout = 20,
			eventsHandled = [];

		info("source file: " + input);
		info("build output file: " + output);

		page.onConsoleMessage = function(msg, lineNum, sourceId) {
			console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
		};

		page.onInitialized = function () {
			var i,
				l,
				injectedFile;

			for (i = 0, l = injected.length; i < l; ++i) {
				injectedFile = injected[i].replace("\\\\", "\\");
				info("injecting: " + injectedFile);
				page.injectJs(injectedFile);
			}
			page.evaluate(function () {
				var handleBound = function () {
						window.callPhantom({event: "bound"});
						document.removeEventListener("bound", handleBound, true);
					},
					handleChangePage = function () {
						window.callPhantom({event: "pagechange"});
						document.removeEventListener("pagechange", handleChangePage, true);
					};
				document.addEventListener("bound", handleBound, true);
				document.addEventListener("pagechange", handleChangePage, true);
			});
		};

		page.onCallback = function (data) {
			if (data.event) {
				eventsHandled.push(data.event);
			} else if (data.message) {
				if(data.type === 'error') {
					err(data.message);
				} else {
					info(data.message);
				}
			} else if (data.control === 'exit') {
				phantom.exit(data.statusCode || 1);
			}

			if (eventsHandled.length === 2) {
				info("writing content to file: " + output);
				try {
					fs.write(output, page.content);
				} catch (e) {
					err("could not write to file, reason: " + e.message);
					phantom.exit(1);
					return;
				}
				info("file saved");
				phantom.exit(0);
			}
		};

		page.onLoadFinished = function (status) {
			var i,
				scripts;

			function testTau() {
				if (!window.tau && !window.ej) {
					window.callPhantom({
						message: "TAU framework not found in page",
						type: "error"
					});
					window.callPhantom({
						control: 'exit',
						statusCode: 1
					});
				} else {
					window.callPhantom({message: "TAU framework exists"});

					if (window.tau.getConfig('autoBuildOnPageChange') === false) {
						window.callPhantom({
							message: "PhanomJS: Not all widgets will be built because TAU config.autoBuildOnPageChange is set to false",
							type: "warning"
						});
						window.callPhantom({
							control: 'exit',
							statusCode: 0
						});
					}
				}
			}

			scripts = page.evaluate(function () {
				return [].slice.call(document.scripts)
							.map(function (script) {
								return script.src;
							})
						.filter(function (str) {
								return !!str;
							});
			});

			// load and run js scripts
			if (os === "win") {
				for (i = 0; i < scripts.length; i++) {
					page.injectJs(scripts[i]);
				}
			}

			// test TAU existance;
			page.evaluateJavaScript(testTau);

			if (status === "fail") {
				err("unable to open source file");
				phantom.exit(1);
			}

			info("document loaded, waiting for build process to finish...");
			setTimeout(function () {
				err("build timeout (TAU triggered: " + eventsHandled.length + " events)");
				phantom.exit(1);
			}, timeout * 1000);
		};

		page.onConsoleMessage = info;
		page.settings.webSecurityEnabled = false;
		page.open(input + "#build");
	}

	if (phantom.args.length === NUMBER_OF_REQUIRED_ARGUMENTS) {
		try {
			run();
		} catch (e) {
			err(e.message);
			phantom.exit(1);
		}
	} else {
		err("Missing parameters");
		phantom.exit(1);
	}
}(phantom, require));

