$(document).ready(function() {
	var Runner = function( ) {
			var self = this,
				currentModule,
				currentTest,
				assertCount,
				currentTestPath,
				currentRun = {
					modules: [],
					total: 0,
					passed: 0,
					failed: 0,
					start: new Date(),
					time: 0
				};

			function pushTestModule(run, moduleName) {
				var i,
					l,
					modules = run.modules,
					module = {
						name: moduleName,
						tests: [],
						total: 0,
						passed: 0,
						failed: 0,
						start: new Date(),
						time: 0,
						stdout: [],
						stderr: []
					};

				// Avoid duplicates, if module exists, return it
				// It's important for generating tcresult files by runner.js
				// Splited modules for file, generated one file instead few tcresult files
				for (i = 0, l = modules.length; i < l; i++) {
					if (modules[i].name === moduleName) {
						return modules[i];
					}
				}

				modules.push(module);
				return module;
			}

			$.extend( self, {
				frame: window.frames[ "testFrame" ],
				testTimeout: 20 * 1000,
				$frameElem: $( "#testFrame" ),
				assertionResultPrefix: "assertion result for test:",
				onTimeout: QUnit.start,

				onFrameLoad: function() {
					// establish a timeout for a given suite in case of async tests hanging
					self.testTimer = setTimeout( self.onTimeout, self.testTimeout );

					// it might be a redirect with query params for push state
					// tests skip this call and expect another
					if( !self.frame.QUnit ) {
						self.$frameElem.one( "load", self.onFrameLoad );
						return;
					}

					// when the QUnit object reports done in the iframe
					// run the onFrameDone method
					self.frame.QUnit.done = self.onFrameDone;
					self.frame.QUnit.testDone = self.onTestDone;
					self.frame.QUnit.log = self.onLog;
					self.frame.QUnit.begin = self.onBegin;
					self.frame.QUnit.moduleStart = self.onModuleStart;
					self.frame.QUnit.moduleDone = self.onModuleDone;
					self.frame.QUnit.testStart = self.onTestStart;
				},
				onBegin: function() {
					currentRun = {
						modules: [],
						total: 0,
						passed: 0,
						failed: 0,
						start: new Date(),
						time: 0
					};
				},
				onModuleStart: function( data ) {
					currentModule = pushTestModule(currentRun, currentTestPath);
				},
				onTestStart : function( data ) {
					if (!currentModule) {
						currentModule = pushTestModule(currentRun, currentTestPath);
					}

					assertCount = 0;
					currentTest = {
						name: data.name,
						failedAssertions: [],
						total: 0,
						passed: 0,
						failed: 0,
						start: new Date(),
						time: 0
					};

					currentModule.tests.push(currentTest);
				},
				onLog: function( data ){
					assertCount++;
					//if (!data.result) {
					currentTest.failedAssertions.push(data);
					currentModule.stdout.push('[' + currentModule.name + ', ' + currentTest.name + ', ' + assertCount + '] ' + data.message);
					//}
				},
				onTestDone: function( result ) {

					currentTest.time = (new Date()).getTime() - currentTest.start.getTime();  // ms
					currentTest.total = result.total;
					currentTest.passed = result.passed;
					currentTest.failed = result.failed;

					currentTest = null;

					QUnit.ok( !(result.failed > 0), result.name );
					self.recordAssertions( result.total - result.failed, result.name );
				},

				onModuleDone: function( result ) {
					currentModule = null;
				},

				// @TODO fixme: Arguments of this function are fake, only first
				// is passed.
				onFrameDone: function( failed, passed, total, runtime ){
					// make result object
					var details = { };
					details.failed = failed;
					details.passed = passed;
					details.total = total;
					details.time = runtime;

					// make sure we don't time out the tests
					clearTimeout( self.testTimer );

					// TODO decipher actual cause of multiple test results firing twice
					// clear the done call to prevent early completion of other test cases
					self.frame.QUnit.done = $.noop;
					self.frame.QUnit.testDone = $.noop;

					// hide the extra assertions made to propogate the count
					// to the suite level test
					self.hideAssertionResults();

					if (currentModule) {
						// FIXME: this is wrong, check arguments variable
						pushTestModule(currentRun, currentModule.name);

						currentModule = null;
					}

					generateReport( details, UnitTCRunner.getTestResult(), false );
				},

				getTestResult: function() {
					return currentRun;
				},

				getCurrentTest: function() {
					return currentTest;
				},

				recordAssertions: function( count, parentTest ) {
					for( var i = 0; i < count; i++ ) {
						ok( true, self.assertionResultPrefix + parentTest );
					}
				},

				hideAssertionResults: function() {
					$( "li:not([id]):contains('" + self.assertionResultPrefix + "')" ).hide();
				},

				exec: function( data ) {
					var template = self.$frameElem.attr( "data-src"),
						it_min, it_max;

					var iteration = parseInt(location.search.replace('?',''), 10) || 0;

					if (location.search != '') {
						CURRENT_ITERATION = iteration;
					}

					it_min = CURRENT_ITERATION * TESTS_PER_ITERATION;
					it_max = (CURRENT_ITERATION + 1) * TESTS_PER_ITERATION - 1;

					$.each( data, function(i, dir) {

						if (i >= it_min && i <= it_max) {
							console.log(i, it_min, it_max, i >= it_min && i <= it_max);
							QUnit.asyncTest( dir, function() {
								currentTestPath = dir;
								self.dir = dir;
								self.$frameElem = $('#testFrame');
								self.$frameElem.one( "load", self.onFrameLoad );
								self.$frameElem.attr( "src", template.replace("{{testfile}}", dir) );
							});
						}
					});

					// having defined all suite level tests let QUnit run
					setTimeout(QUnit.start, 2000);
				}
			});
		};
	var generateXML = function() {
		var xmlData = [];
		var xmlEncode = function(text) {
			var baseEntities = {
				'"' : '&quot;',
				'\'': '&apos;',
				'<' : '&lt;',
				'>' : '&gt;',
				'&' : '&amp;'
			};
			return ('' + text).replace(/[<>&\"\']/g, function(chr) {
				return baseEntities[chr] || chr;
			});
		};
		var Writer = function(en, run) {
			this.setHead = function() {
				xmlData.push('<?' + 'xml version="1.0" encoding="UTF-8"' + '?>\n');
				xmlData.push('<?xml-stylesheet type="text/xsl"  href="testresult.xsl"?>');
			};
			this.start = function() {
				xmlData.push('<test_definition name="http://tempuri.org" type="" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="test_definition.xsd">');
			};
			this.end = function() {
				xmlData.push('</test_definition>');
			};
			this.elementStart = function( name , attribute ) {
				var elementString = '<' + name ;
				if( !attribute ) {
					elementString += '>';
				} else {
					for (var aname in attribute ) {
						elementString + ' ' + xmlEncode(aname) + '="' + xmlEncode(attribute[aname]) + '"' ;
					}
				}
				xmlData.push( elementString );
			};
			this.elementEnd = function( name ) {
				xmlData.push( '</' + name + '>' );
			};
			this.setenvironment = function( en ) {
				this.elementStart( 'environment', {
					device_id: "",
					device_model: "SDK, Target",
					device_name: "Tizen",
					host: navigator.userAgent,
					os_version:"2.2",
					resolution: "",
					screen_size: $(window).height() + " x " + $(window).width()
				} );
				this.elementEnd( 'environment' );
			};
			this.setHead();
			this.start();
			this.end();
		};
	};
	//Generate XML
	var generateReport = function(results, run, end) {


		var pad = function(n) {
			return n < 10 ? '0' + n : n;
		};

		var toISODateString = function(d) {
			return d.getUTCFullYear() + '-' +
				pad(d.getUTCMonth() + 1)+'-' +
				pad(d.getUTCDate()) + 'T' +
				pad(d.getUTCHours()) + ':' +
				pad(d.getUTCMinutes()) + ':' +
				pad(d.getUTCSeconds()) + 'Z';
		};
		var subid = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}
		var makeuid = function() {
			var i = 0, id = "";
			for( i = 0 ; i < 5 ; i++ ) {
				id += subid();
			}
			return id;
		};

		var convertMillisToSeconds = function(ms) {
			return Math.round(ms * 1000) / 1000000;
		};

		var xmlEncode = function(text) {
			var baseEntities = {
				'"' : '&quot;',
				'\'': '&apos;',
				'<' : '&lt;',
				'>' : '&gt;',
				'&' : '&amp;'
			};
			return ('' + text).replace(/[<>&\"\']/g, function(chr) {
				return baseEntities[chr] || chr;
			});
		};

		var XmlWriter = function(settings) {
			settings = settings || {};

			var data = [], stack = [], lineBreakAt;

			var addLineBreak = function(name) {
				if (lineBreakAt[name] && data[data.length - 1] !== '\n') {
					data.push('\n');
				}
			};

			lineBreakAt = (function(items) {
				var i, map = {};
				items = items || [];

				i = items.length;
				while (i--) {
					map[items[i]] = {};
				}
				return map;
			})(settings.linebreak_at);

			this.start = function(name, attrs, empty) {
				if (!empty) {
					stack.push(name);
				}

				data.push('<' + name);

				for (var aname in attrs) {
					data.push(' ' + xmlEncode(aname) + '="' + xmlEncode(attrs[aname]) + '"');
				}

				data.push(empty ? ' />' : '>');
				addLineBreak(name);
			};

			this.end = function() {
				var name = stack.pop();
				addLineBreak(name);
				data.push('</' + name + '>');
				addLineBreak(name);
			};

			this.text = function(text) {
				data.push(xmlEncode(text));
			};

			this.cdata = function(text) {
				data.push('<![CDATA[' + text + ']]>');
			};

			this.comment = function(text) {
				data.push('<!--' + text + '-->');
			};
			this.pi = function(name, text) {
				data.push('<?' + name + (text ? ' ' + text : '') + '?>\n');
			};

			this.doctype = function(text) {
				data.push('<!DOCTYPE' + text + '>\n');
			};

			this.getString = function() {
				while (stack.length) {
					this.end();  // internally calls `stack.pop();`
				}
				return data.join('').replace(/\n$/, '');
			};

			this.reset = function() {
				data.length = 0;
				stack.length = 0;
			};

			// Start by writing the XML declaration
			this.pi(settings.xmldecl || 'xml version="1.0" encoding="UTF-8"');
		};

		// Generate JUnit XML report!
		var m, mLen, module, t, tLen, test, a, aLen, assertion, isEmptyElement,
			rn, trn, currentTest,
			xmlWriter = new XmlWriter({
				linebreak_at: ['environment', 'summary', 'suite', 'set', 'testcase', 'description']
			});
		if(!end) {
			currentTest = QUnit.config.current.testName;
		}

		xmlWriter.pi ( 'xml-stylesheet type="text/xsl" href="./testcase.xsl"' );
		xmlWriter.start('test_definition', {
			name: "http://tempuri.org",
			type: "",
			'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
			'xsi:noNamespaceSchemaLocation' : "test_definition.xsd"
		});

		xmlWriter.start('environment', {
			device_id: "",
			device_model: "SDK & Target",
			device_name: "Tizen",
			host: navigator.userAgent,
			os_version:"2.2",
			resolution: "",
			screen_size: $(window).height() + " x " + $(window).width()
		} );
		xmlWriter.start('other');
		xmlWriter.cdata('Tizen Web UI FW UnitTest');
		xmlWriter.end();
		xmlWriter.end(); //environment

		xmlWriter.start('summary' ,{
			test_plan_name : 'Tizen Web UI FW Unit TC'
		} );
		xmlWriter.start( 'start_at' );
		xmlWriter.cdata( run.start );
		xmlWriter.end(); //start_at
		xmlWriter.start( 'end_at' );
		xmlWriter.cdata( new Date() );
		xmlWriter.end(); //start_at
		xmlWriter.end(); // summary

		xmlWriter.start('suite', {
			id: 'suite123456',
			category: 'Web UI Framework',
			name: 'tct-webuifw-tests',
			tests: results.total
		});

		for (m = 0, mLen = run.modules.length; m < mLen; m++) {
			module = run.modules[m];

			if (!end) {
				if (m !== run.modules.length - 1) {
					continue;
				}
			}
			/*if( !end ) {
				if( currentTest.toLowerCase() != module.name.toLowerCase() ) {
					continue;
				}
			}*/

			xmlWriter.start( 'set', {
				name: module.name + '_' + m,
				launcher: "WRTLauncher " + (m > 0 ? '-r' : '-a')
			});
			for (t = 0, tLen = module.tests.length; t < tLen; t++) {
				test = module.tests[t];
				for (a = 0, aLen = test.failedAssertions.length; a < aLen; a++) {
					rn = makeuid();
					assertion = test.failedAssertions[a];
					message = assertion.message;
					if ( assertion.message === undefined || !assertion.message) {
					}
					xmlWriter.start('testcase', {
						component: module.name,
						execution_type: "auto",
						id: module.name + '_' + m + '_' + t + '_' + a,
						purpose:  assertion.checktype + ' ' + (assertion.message) ? '-' + assertion.message : ''
					});
					xmlWriter.start( 'description' );
					xmlWriter.start( 'test_script_entry' );
					xmlWriter.cdata( module.name );
					xmlWriter.end();
					xmlWriter.end(); // description
					xmlWriter.end(); // testcase
				}
			}

			xmlWriter.end(); // set
		}

		xmlWriter.end(); //suite
		xmlWriter.end(); //test_definition
		// Invoke the user-defined callback
		QUnit.jUnitReport({
			results: results,
			xml: xmlWriter.getString(),
			end: end
		});
	};



	QUnit.jUnitReport = function(data) {
		var console = window.console;

		if( !data.end ) {
			QUnit.start();
		} else {
			if (console) {
				console.clear();
				console.log(data.xml);
				var blob = new Blob([data.xml], {type: "text/xml;charset=utf-8"});
				saveAs(blob, "tests-p" + CURRENT_ITERATION + ".xml");
			}
		}
	};
	// prevent qunit from starting the test suite until all tests are defined
	QUnit.begin = function( ){
		this.config.autostart = false;
	};

	QUnit.done = function( details ) {
		// All Test is done
		generateReport( details, UnitTCRunner.getTestResult(), true);
	}
	// get the test directories
	var UnitTCRunner = new Runner();
	UnitTCRunner.exec(TESTS);
});
