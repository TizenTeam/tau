module.exports = function (grunt) {
//	use strict;
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	});

	grunt.registerTask('test', 'Style test using phantomjs.', function (_file, test, type) {
		var done = this.async(),
			phantom = require('node-phantom'),
			_grunt = grunt;

		phantom.create(function (err, ph) {
			return ph.createPage(function (err, page) {
				var fs = require('fs'),
					colors = require('colors'),
					file = __dirname + '/' + _file,
					structure,
					showfull = false,
					compareObjects = function (o1, o2, tab) {
						var equal = true,
							i,
							log = '',
							logs = [],
							result,
							ecount = 0,
							gcount = 0,
							ocount = 1,
							scount = 0;

						if (o1 === undefined || o2 === undefined) {
							return { value: false, log: [((tab + '  ERROR object is null').red) + "\n"], objectscount: 1, stylescount: 0, errorscount: 1, goodscount: 0 };
						}
						log += (tab + o1.tag + (o1.id ? '#' + o1.id : '') + (o1.class ? '.' + o1.class : '')).italic.green + "\n";
						if (o1.tag !== o2.tag) {
							equal = false;
							log += (tab + '  ERROR tag').red + "\n";
							log += tab + '    expected: ' + (o1.tag || ('/empty/'.grey)) + "\n";
							log += tab + '          is: ' + (o2.tag || ('/empty/'.grey)) + "\n";
							ecount += 1;
						} else {
							gcount += 1;
						}
						if (o1.id !== o2.id) {
							equal = false;
							log += (tab + '  WARNING id').red + "\n";
							log += tab + '    expected: ' + (o1.id || ('/empty/'.grey)) + "\n";
							log += tab + '          is: ' + (o2.id || ('/empty/'.grey)) + "\n";
						}
						if (o1.class !== o2.class) {
							equal = false;
							log += (tab + '  ERROR class').red + "\n";
							log += tab + '    expected: ' + (o1.class || ('/empty/'.grey)) + "\n";
							log += tab + '          is: ' + (o2.class || ('/empty/'.grey)) + "\n";
							ecount += 1;
						} else {
							gcount += 1;
						}
						for (i in o1.style) {
							if (o1.style[i] !== o2.style[i]) {
								equal = false;
								log += (tab + '  ERROR style ' + i).red + "\n";
								log += tab + '    expected: ' + (o1.style[i] || ('/empty/'.grey)) + "\n";
								log += tab + '          is: ' + (o2.style[i] || ('/empty/'.grey)) + "\n";
								ecount += 1;
							} else {
								gcount += 1;
							}
							scount += 1;
						}
						if (log) {
							logs.push(log);
						}
						for (i = 0; i < o1.childs.length; i += 1) {
							result = compareObjects(o1.childs[i], o2.childs[i], tab + '  ');
							if (result.value === false) {
								equal = false;
							}
							if (result.log.length) {
								logs = logs.concat(result.log);
							}
							ocount += result.objectscount;
							scount += result.stylescount;
							gcount += result.goodscount;
							ecount += result.errorscount;
						}
						return { value: equal, log: logs, objectscount: ocount, stylescount: scount, errorscount: ecount, goodscount: gcount };
					};

				function evaluateWithArgs(fn) {
					return "function() { return (" + fn.toString() + ").apply(this, " + JSON.stringify(Array.prototype.slice.call(arguments, 1)) + ");}";
				}

				function getStructure(test, rootDir) {
					var $test = $('#' + test),
						async = $test.attr('data-test-async'),
						result,
						event = {},
						convertHTMLtoJSONInfo = function (root) {
							var result = {}, i, $children,
								styles = ['background-color', 'background-image', 'background-repeat', 'background-position-x', 'background-position-y', 'color', 'font-family', 'font-size', 'font-weight', 'width', 'height', 'display', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top-color', 'border-top-style', 'border-top-width', 'border-right-color', 'border-right-width', 'border-right-style', 'border-bottom-style', 'border-bottom-color', 'border-bottom-width', 'border-left-color',  'border-left-style',  'border-left-width', 'position', 'top', 'left', 'right', 'bottom', 'box-shadow', 'min-height', 'max-height', 'line-height', 'text-overflow', 'overflow', 'white-space', 'text-align', 'box-sizing', 'font-style', 'text-decoration', 'cursor', 'filter', 'opacity', 'z-index', 'overflow-scrolling', 'transform', 'visibility', 'float', 'vertical-align', 'border-top-right-radius', 'border-top-left-radius', 'border-bottom-left-radius', 'border-bottom-right-radius', 'list-style-type', 'list-style-position', 'list-style-image', 'zoom', '-webkit-box-shadow', '-webkit-transform', 'counter-reset'];

							result.tag = root.get(0).tagName;
							result.class = root.get(0).className;
							result.id = root.get(0).id;
							result.style = {};
							for (i = 0; i < styles.length; i += 1) {
								if (styles[i] === 'background-image') {
									result.style[styles[i]] = (root.css(styles[i])).replace(rootDir, '');
								} else {
									result.style[styles[i]] = root.css(styles[i]);
								}
							}
							result.childs = [];
							$children = root.children();
							for (i = 0; i < $children.length; i += 1) {
								result.childs[i] = convertHTMLtoJSONInfo($children.eq(i));
							}
							return result;
						};
					if (async) {
						$test.bind('runtest', function () {
							var event = {},
								result;
							result = convertHTMLtoJSONInfo($test.parent());
							event.test = test;
							event.name = 'resulttest';
							event.object = result;
							window.callPhantom({event: event});
							$test.trigger('aftertest');
						});
						$test.trigger('beforetest');
						return null;
					} 
					$test.trigger('beforetest');
					result = convertHTMLtoJSONInfo($test.parent());
					event.test = test;
					event.name = 'resulttest';
					event.object = result;
					window.callPhantom({event: event});
					$test.trigger('aftertest');
					return null;
				}

				page.open(file, function (err, status) {
					if (status !== 'success') {
						console.log(('Unable to read file with HTML structure ' + file).red);
					} else {
						page.includeJs(__dirname + "/lib/phantom.fix.js", function() {
							
							var tests, i, f, expected, object, result;
							page.onConsoleMessage = function (msg, lineNum, sourceId) {
								console.log(('CONSOLE: '.bold + msg + (lineNum && sourceId ? ' (from line #' + lineNum + ' in "' + sourceId + '")' : '')).red);
							};
							page.onError = function (msg, trace) {
								var msgStack = ['ERROR: '.red ];
								if (msg) {
									msgStack.push('TRACE:');
									msg[1].forEach(function (t) {
										msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
									});
								}
								console.error(msgStack.join('\n'));
							}
							page.onResourceError = function (resourceError) {
								console.log(('Unable to load resource (URL:' + resourceError.url + ')').red);
								console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
							}
							if (!test) {
								_tests = page.evaluate(function () {
									var tests = [], _tests, test, i;
										_tests = $('[data-test]');
									for (i = 0; i < _tests.length; i+= 1) {
										test = {
											id: _tests.eq(i).attr('id'),
											name: _tests.eq(i).attr('data-test')
										};
										tests[i] = test;
									}
									return tests;
								}, runTests);
							} else {
								showfull = true;
								runTests(null, [{id: test}]);
							}
							
							function runTests(err, tests) {
							function runTest(testNumber) { 
								test = tests[testNumber].id;
								console.log (('Started test ' + test + ' ( ' + (testNumber+1) + ' / ' + tests.length + ' ) ').bold.underline);
								page.onCallback = function(data) {
									if (type == 'save') {
										grunt.util.spawn({
											cmd : "git",
											args : [ "log", "-1" ]
										}, function (err, result) {
											if (err) {
												grunt.log.error(err);
												return done(false);
											}
											data.event.object.info = result.stdout;
											fs.writeFile('tests/' + data.event.test + '.json', JSON.stringify(data.event.object), function(err) {
												if (err) {
													console.log(err.red);
												} else {
													console.log("The file was saved!".green);
												}
												done(result);
												ph.exit();
											}); 
										});
									} else {
										fs.readFile('tests/' + data.event.test + '.json', 'utf8', function (err, fdata) {
											if (err) {
												return console.log(err);
											}
											expected = JSON.parse(fdata);
											object = data.event.object;
											result = compareObjects( expected, object, '');
											if (showfull) {
												var max = result.log.length;
												for (var i =0 ; i<max; i+= 1) {
													console.log(result.log[i].slice(0, -1));
												}
												console.log('');
												console.log('Test saved from version');
												console.log((expected.info || '').grey);
												console.log('');
											}
											if (result.value == false) {
												console.log('Number of tests: '+ (result.errorscount + result.goodscount) + ', good: ' + result.goodscount + ', errors: ' + result.errorscount);
												console.log('  ERROR '.red + ' objects checked: ' + result.objectscount + '    styles checked: ' + result.stylescount + ' ' + (max < result.log.length ? ' (shown ' + max + ' / ' + result.log.length + ')' : ''));
											} else {
												console.log('Number of tests: '+ (result.errorscount + result.goodscount) + ', good: ' + result.goodscount + ', errors: ' + result.errorscount);
												console.log('  OK'.green + '     objects checked: ' + result.objectscount + '    styles checked: ' + result.stylescount);
											}
											console.log(' ');
											if (testNumber < tests.length-1) {
												runTest(testNumber+1);
											}
											else {
												ph.exit();
											}
										});
									}
									
								}
								page.evaluate(evaluateWithArgs(getStructure, test, fs.realpathSync('../..')));
							}
							runTest(0);
							}
						});
						}
					});
				});
			});
		});
	grunt.registerTask('default', ['test'] );
};
