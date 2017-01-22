#!/usr/bin/env node

var exec = require("child_process").exec,
	async = require("async"),
	moment = require("moment"),
	fs = require("fs"),
	env = process.env,
	FILE_CHANGELOG = "../packaging/changelog",
	FILE_SPEC = "../packaging/web-ui-fw.spec",
	FILE_PACKAGEJSON = "./package.json",
	gitAccount = "",
	userName = "",
	lastTag = "",
	tauVersion = env.VERSION || env.bamboo_deploy_release || env.bamboo_jira_version,
	commitMessage = "TAU " + tauVersion + " release",
	commitId = "",
cmd = {
	/**
	 * Run chain of commands and callbacks
	 */
	chain: function () {
		var args = [].slice.call(arguments);
		// @TODO run chain of commands with callbacks
		async.eachSeries(args, function (item, callback) {
			var command = "",
				processFunction = null;

			// if only string is in array then it is command without callback
			if (typeof item === "string") {
				command = item;
			// if only function is in array then it is function to call, not operation
			} else if (typeof item === "function") {
				processFunction = item;
			// if item is Array
			} else if (item instanceof Array) {
				// if first item is string then it is command
				if (typeof item[0] === "string") {
					command = item[0];
				// if first item is function, then it is command template function
				} else if (typeof item[0] === "function") {
					command = item[0]();
				}

				// if second item is function, then it is callback for command
				if (typeof item[1] === "function") {
					processFunction = item[1];
				}
			}

			// if command exists then run it
			if (command) {
				console.log("Runnig: " + command);
				exec(
					command,
					function (err, data, stderr) {
						// when command return code different from 0 then display it and finish
						if (err) {
							console.error("exec error: " + err);
							process.exit(err);
						}
						// if stderr is not empty then display it
						if (stderr) {
							console.error(stderr);
						}
						// if process callback is defined then process it with stdout
						if (processFunction) {
							processFunction(data, callback);
						} else {
							// otherwise got to next operation
							callback();
						}
					}
				);
			} else {
				// if process callback is defined without command then run it
				if (processFunction) {
					processFunction(callback);
				} else {
					// otherwise got to next operation
					callback();
				}
			}
		});
	}
};

/**
 * Async helper for read file, modify content and  write to the same file
 * @param {string} fileName NAme of file
 * @param {Function} operation Function with one string parameter and return string to save
 * @param {Function} callback Callback inform that operation was end (async)
 */
function modifyFile(fileName, operation, callback) {
	fs.readFile(fileName, function (err, data) {
		var saveData = "";

		// on errors display it and finish working
		if (err) {
			console.error(err);
			process.exit(1);
		}
		// prepare data to save
		saveData = operation(data.toString());
		// write to file
		fs.writeFile(FILE_CHANGELOG, saveData, function (err) {
			// on errors display it and finish working
			if (err) {
				console.error(err);
				process.exit(1);
			}
			// go to next step
			callback();
		});
	});
}

cmd.chain(
	// check that version is set
	function (callback) {
		if (!tauVersion) {
			console.error("Version is not set, use one of environment variables VERSION, bamboo_deploy_release, env.bamboo_jira_version");
			process.exit(1);
		}
	},
	// get user email form git
	["git config user.email",
		function (result, callback) {
			gitAccount = result.trim();
			callback();
		}],
	// get user name form git
	["git config user.name",
		function (result, callback) {
			userName = result.trim();
			callback();
		}],
	// get last tag
	["git describe --abbrev=0 --tags",
		function (result, callback) {
			lastTag = result.trim();
			callback();
		}],
	// get last changes
	[
		function () {
			return "git log --pretty=oneline --no-merges " + lastTag + "..HEAD | sed -e 's/ *\\\[OAPTAU-[0-9]*\\\]//g' | sed -e 's/^\\\S* /- /g'"
		},
		function (logLines, callback) {
			var now = moment().format("ddd MMM D YYYY");

			logLines = "* " + now + " " + userName + " <" + gitAccount + "> " + tauVersion + "\n" + logLines.replace(/-/g, "\t-");
			console.log(logLines);
			// save changes to changelog
			modifyFile(FILE_CHANGELOG, function (data) {
				return data.replace("%changelog", "%changelog\n" + logLines);
			}, callback);
		}
	],
	// Version up in filespec
	function (callback) {
		modifyFile(FILE_SPEC, function (data) {
			return data.replace(/^Version:.*$/gm, "Version:    " + tauVersion);
		}, callback);
	},
	// Version up in package.json
	function (callback) {
		modifyFile(FILE_PACKAGEJSON, function (data) {
			return data.replace(/^Version:.*$/gm, "Version:    " + tauVersion);
		}, callback);
	},
	// add files to git
	[function () {
		return "git add " + FILE_CHANGELOG + " " + FILE_SPEC + " " + FILE_PACKAGEJSON;
	}],
	// create commit
	[function () {
		return "git commit -s -m '" + commitMessage + "'"
	}],
	// send to gerrit
	"git push origin HEAD:refs/for/devel/tizen_3.0",
	["git log --format='%H' -n 1",
		function (result, callback) {
			commitId = result.trim();
			callback();
		}],
	// add reviewers
	[function () {
		return "ssh -p 29418 165.213.149.170 gerrit set-reviewers -a t.lukawski@samsung.com " + commitId;
	}]
);