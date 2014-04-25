/*global require, phantom, console, window, setTimeout */
/*jslint plusplus: true */
(function (phantom, require) {
	"use strict";
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
			args = phantom.args,
			injected = args[0].replace(/\"/gi, "").trim().split(","),
			input = args[1].replace(/\"/gi, "").trim(),
			output = args[2].replace(/\"/gi, "").trim(),
			timeout = 20,
			eventsHandled = [];

		info("source file: " + input);
		info("build output file: " + output);

		page.onInitialized = function () {
			var i,
				l;
			for (i = 0, l = injected.length; i < l; ++i) {
				info("injecting: " + injected[i]);
				page.injectJs(injected[i]);
			}
			page.evaluate(function () {
				var handleBound = function () {
						window.callPhantom({event: "bound"});
						document.removeEventListener("bound", handleBound, true);
					},
					handleChangePage = function () {
						window.callPhantom({event: "pagechange"});
						document.removeEventListener("pagechange", handleBound, true);
					};
				document.addEventListener("bound", handleBound, true);
				document.addEventListener("pagechange", handleChangePage, true);
			});
		};

		page.onCallback = function (data) {
			if (data.event) {
				eventsHandled.push(data.event);
			} else if (data.message) {
				info(data.message);
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
			page.evaluateAsync(function () {
				if (!window.tau && !window.ej) {
					window.callPhantom({message: "TAU framework not found in page"});
				} else {
					window.callPhantom({message: "TAU framework exists"});
				}
			});

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

		page.open(input + "#build");
	}

	if (phantom.args.length === 3) {
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

