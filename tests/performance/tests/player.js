var module = QUnit.module;

module("Player");
test( "Player Injection", function () {
	var mockConnector = {
		conn: undefined
	};

	var remoteConnector = new RemoteConnector( mockConnector );
	var remoteLogger = new RemoteLogger( remoteConnector );
	mockConnector.conn = remoteConnector;
	var player = new Player( remoteLogger );

	mockConnector.send = function ( msg ) {
		equal( msg.method, "Runtime.evaluate", "should evaluate injector function" );
		var src = msg.params.expression;
		var tcMousePlayer = null;
		eval( src );
		ok( tcMousePlayer, "should injected function constructed.");

		var mockmsg = {
			"id" : msg.id,
			"result" : {
				"result" : {
					"value" : "true"
				}
			}
		};
		this.conn.notify( mockmsg );
	};

	player.injectPlayer( function () {
		ok( true, "should player injected." );
	});
	expect( 3 );
});

test( "Play", function () {
	var mockConnector = {};
	var remoteConnector = new RemoteConnector( mockConnector );
	var remoteLogger = new RemoteLogger( remoteConnector );
	mockConnector.conn = remoteConnector;
	var player = new Player( remoteLogger );
//	mockConnector.send = function ( msg ) {
//		equal( msg.method, "Runtime.

});
