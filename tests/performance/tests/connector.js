var module = QUnit.module;
module("Remote Debugger Connector");
asyncTest( "Connection", function () {
	setTimeout( function () {
		Connector.requestList( "http://localhost:9222/json", function ( data ) {
			ok( data.length > 0, "should retrieve more than one list" );
			ok( data[0].hasOwnProperty( 'webSocketDebuggerUrl' ), "should retrieve websocket address" );
			Connector.connect( data[0].webSocketDebuggerUrl, function ( data ) {
				ok( true, "should open websocket" );
				expect(3);
			});
		});
		start();
	}, 1000 );
});
asyncTest( "Send", function () {
	setTimeout( function () {
		var enable = {
			"id" : 0,
			"method" : "Console.enable"
		};
		Connector.send( enable );
		ok(true);
	}, 2000 );
});
