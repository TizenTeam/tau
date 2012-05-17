var module = QUnit.module;

module("Remote Logger");

test( "Basic", function () {
	var mockConnector = {};
	mockConnector.conn = undefined;
	mockConnector.send = function ( msg ) {};
	mockConnector.onmessage = function ( msg ) {
		this.conn.notify( msg );
	};

	var remoteConnector = new RemoteConnector( mockConnector );
	var remoteLogger = new RemoteLogger( remoteConnector );
	mockConnector.conn = remoteConnector;

	mockConnector.send = function ( msg ) {
		equal( msg.method, "Console.enable", "should be able to start console" );
	};
	remoteLogger.start();
	var origLog = remoteLogger.log;
	remoteLogger.log = function ( log ) {
		equal( log, "this is test string...", "should receive notification" );
	};
	mockConnector.onmessage( JSON.stringify( {
		"method" : "Console.messageAdded",
		"params" : {
			"message" : "this is test string..."
		}
	}));
	mockConnector.send = function ( msg ) {
		equal( msg.method, "Console.disable", "should be able to stop console" );
	};
	remoteLogger.stop();
	remoteLogger.log = origLog;
});

test( "Remote Runtime", function () {
	var mockConnector = {};
	mockConnector.conn = new RemoteConnector( mockConnector );
	var remoteLogger = new RemoteLogger( mockConnector.conn );
	mockConnector.send = function ( msg ) {
		equal( msg.params.expression, "foo(bar);", "should evaluate expressions remotely" );
	};
	remoteLogger.remoteEval( "foo(bar);" );
	mockConnector.send = function ( msg ) {
		equal( msg.params.objectId, "window", "should call function remotely" );
		equal( msg.params.functionDeclaration, "prompt" );
		deepEqual( msg.params["arguments"], ["foo","bar"] );
	};
	remoteLogger.remoteCallFunction( "window", "prompt", [
		"foo",
		"bar" ]);
	expect( 4 );
});

asyncTest( "Timeline", function () {
	var mockConnector = {
		conn : undefined,
		send : function ( msg ) {},
		onmessage : function ( msg ) {
			this.conn.notify( msg );
		}
	};

	var remoteConnector = new RemoteConnector( mockConnector );
	var remoteLogger = new RemoteLogger( remoteConnector );
	mockConnector.conn = remoteConnector;
	var origTimeline = remoteLogger.timeline;
	remoteLogger.timeline = function ( event ) {
		deepEqual( {
			"paint" : "work"
		}, event, "should receive timeline event" );
	};

	mockConnector.send = function ( msg ) {
		equal( "Timeline.start", msg.method, "should start timeline" );
	};

	remoteLogger.startSession("test.txt");
	setTimeout( function () {
		mockConnector.onmessage( JSON.stringify( {
		"method" : "Timeline.eventRecorded",
		"params" : {
			"record" : {
				"paint" : "work"
			}
		}
		}));
		mockConnector.send = function ( msg ) {
			equal( "Timeline.stop", msg.method, "should stop timeline" );
		};
		remoteLogger.stopSession();
		setTimeout( function () {
			expect(3);
			remoteLogger.timeline = origTimeline;
			start();
		}, 500);
	}, 100 );
});

asyncTest( "Monitoring", function () {
	var mockConnector = {
		conn : undefined,
		send : function ( msg ) {},
		onmessage : function ( msg ) {
			this.conn.notify( msg );
		}
	};

	var MockMonitor = function () {
		this.cnt = 0;
		this.notify = function ( param ) {
			this.cnt++;
			if ( this.cnt > 3 ) {
				ok( true, "should monitor timeline changes" );
			}
		};
	};
	var mockTimeline = {
		"method" : "Timeline.eventRecorded",
		"params" : {
			"record" : {
				"x" : 0,
				"y" : 0,
				"w" : 10,
				"h" : 10
			}
		}
	};
	var remoteConnector = new RemoteConnector( mockConnector );
	var remoteLogger = new RemoteLogger( remoteConnector );
	mockConnector.conn = remoteConnector;
	remoteLogger.addTimelineMonitor( new MockMonitor() );
	remoteLogger.startSession( "test2.json" );
	setTimeout( function () {
		mockConnector.onmessage( JSON.stringify( mockTimeline ) );
		mockConnector.onmessage( JSON.stringify( mockTimeline ) );
		mockConnector.onmessage( JSON.stringify( mockTimeline ) );
		mockConnector.onmessage( JSON.stringify( mockTimeline ) );
	}, 500 );
	setTimeout( function () {
		remoteLogger.stopSession();
		start();
	}, 600 );
});
