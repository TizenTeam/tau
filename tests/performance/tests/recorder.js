var module = QUnit.module;
module( "Event Recorder" );
( function () {


	asyncTest( "Logger Injection", function () {
		var mockConnector = {};
		mockConnector.conn = undefined;
		mockConnector.send = function ( msg ) {
			console.log( msg );
		};
		mockConnector.onmessage = function ( msg ) {
			this.conn.notify( msg );
		};

		var remoteConnector = new RemoteConnector( mockConnector );
		var remoteLogger = new RemoteLogger( remoteConnector );
		mockConnector.conn = remoteConnector;
		var recorder = new Recorder( remoteLogger );
		mockConnector.send = function ( msg ) {
			equal( "Runtime.evaluate", msg.method, "should inject record function" );
			var src = msg.params.expression;
			var tcMouseCapture = null;
			eval(src);
			ok( tcMouseCapture, "should injected function constructed" );
		};
		recorder.injectLogger();
		setTimeout( function () {
			start();
		}, 100);
	});

	test( "Record", function () {
		var mockConnector = {};
		mockConnector.conn = undefined;
		mockConnector.send = function ( msg ) {
			console.log( msg );
		};
		mockConnector.onmessage = function ( msg ) {
			this.conn.notify( msg );
		};

		var remoteConnector = new RemoteConnector( mockConnector );
		var remoteLogger = new RemoteLogger( remoteConnector );
		mockConnector.conn = remoteConnector;
		var recorder = new Recorder( remoteLogger );
		mockConnector.send = function ( msg ) {
			equal( "tcMouseCapture.start();", msg.params.expression, "should start record" );
		};
		recorder.startRecording();
		mockConnector.send = function ( msg ) {
			equal( "tcMouseCapture.stop();", msg.params.expression, "should stop record" );
		};
		recorder.stopRecording();
		expect(2);
	});

	test( "Dump Captured Record", function () {
		var mockConnector = {};
		mockConnector.conn = undefined;
		mockConnector.send = function ( msg ) {
			console.log( msg );
		};
		mockConnector.onmessage = function ( msg ) {
			this.conn.notify( msg );
		};

		var remoteConnector = new RemoteConnector( mockConnector );
		var remoteLogger = new RemoteLogger( remoteConnector );
		mockConnector.conn = remoteConnector;
		var recorder = new Recorder( remoteLogger );
		mockConnector.send = function ( msg ) {
			equal( "tcMouseCapture.dump();", msg.params.expression, "should send dump request." );
			var resp = {
				"id" : msg.id,
				"result": {
					"result" : {
						"value" : {
							"foo" : "bar"
						}
					}
				}
			};

			mockConnector.onmessage( resp );
		};
		global.origFileHandler = global.FileHandler;
		global.FileHandler = function () { // hook filehandler
			this.open = function ( filename, params ) {
				equal( "test.txt", filename, "should specify filename for dump" );
				if ( params.callback ) {
					params.callback();
				}
			};
			this.write = function ( obj ) {
				deepEqual( {"foo":"bar"}, {"foo":"bar"}, "should write dump into file" );
			};
			this.close = function () {
				ok( true, "should close file after write" );
			};
		};
		recorder.retrieveData("test.txt");
		expect(4);
		global.FileHandler = global.origFileHandler;
	});
}());
