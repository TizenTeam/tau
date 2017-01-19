#!/usr/bin/env node

var cmd = require("node-cmd"),
	moment = require("moment"),
	fs = require("fs"),
	FILE_CHANGELOG = "../packaging/changelog",
	FILE_SPEC = "../packaging/web-ui-fw.spec",
	FILE_PACKAGEJSON = "./package.json";

console.log("Running git describe --abbrev=0 --tags");
cmd.get(
	"git config user.email",
	function (gitAccount) {
		gitAccount = gitAccount.trim();
		cmd.get(
			"git config user.name",
			function (userName) {
				userName = userName.trim();
				cmd.get(
					"git describe --abbrev=0 --tags",
					function (latestTag) {
						var tauVersion = process.env.bamboo_deploy_release;

						console.log("Running git log --pretty=oneline --no-merges " + latestTag.trim() + "..HEAD | sed -e 's/\[OAPTAU-[0-9]*\]//g' | sed -e 's/^\S* /- /g'")
						cmd.get(
							"git log --pretty=oneline --no-merges " + latestTag.trim() + "..HEAD | sed -e 's/\\\ ?[OAPTAU-[0-9]*\\\]//g' | sed -e 's/^\\\S* /- /g'",
							function (logLines) {
								var now = moment().format("ddd MMM D YYYY");
								logLines = "* " + now + " " + userName + " <" + gitAccount + "> " + tauVersion + "\n" + logLines.replace(/-/g, "\t-");
								console.log(logLines);
								fs.readFile(FILE_CHANGELOG, function(err, data) {
									if (err) {
										console.error(err);
										process.exit(1);
									}
									logLines = data.toString().replace("%changelog", "%changelog\n" + logLines);
									fs.writeFile(FILE_CHANGELOG, logLines, function (err, data) {
										if (err) {
											console.error(err);
											process.exit(1);
										}
										console.log("Changelog was updated");
										fs.readFile(FILE_SPEC, function (err, data) {
											if (err) {
												console.error(err);
												process.exit(1);
											}
											data = data.toString().replace(/^Version:.*$/gm, "Version:    " + tauVersion);
											console.log(data);
											fs.writeFile(FILE_SPEC, data, function (err, data) {
												if (err) {
													console.error(err);
													process.exit(1);
												}
												console.log("specfile was updated");
												fs.readFile(FILE_PACKAGEJSON, function (err, package) {
													if (err) {
														console.error(err);
														process.exit(1);
													}
													package = package.toString().replace(/"version":.*$/gm, "\"version\": \"" + tauVersion + "\", ");
													fs.writeFile(FILE_PACKAGEJSON, package, function (err, data) {
														if (err) {
															console.error(err);
															process.exit(1);
														}
														console.log("package.json was updated");
														cmd.get(
															"git add " + FILE_CHANGELOG + " " + FILE_SPEC + " " + FILE_PACKAGEJSON,
															function () {
																var logMessage = "TAU " + tauVersion + " release";
																console.log("Files added to git");
																cmd.get(
																	"git commit -s -m '" + logMessage + "'",
																	function () {
																		console.log("Files commited");
																		cmd.get(
																			"git push origin HEAD:refs/for/devel/tizen_3.0",
																			function () {
																				console.log("Commit pushed");
																				cmd.get(
																					"git log --format='%H' -n 1",
																					function (commitId) {
																						commitId = commitId.trim();
																						cmd.get(
																							"ssh -p 29418 165.213.149.170 gerrit set-reviewers -a t.lukawski@samsung.com " + commitId,
																							function (data) {
																								console.log("ssh -p 29418 165.213.149.170 gerrit set-reviewers -a t.lukawski@samsung.com " + commitId);
																								console.log(data);
																								console.log("Reviers added");
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
					});
			});
	});