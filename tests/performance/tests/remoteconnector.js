var module = QUnit.module;
module("Remote Connector");
test( "basic", function () {
	var Console = {
		messageAdded : function( params ) {
			return params.message;
		}
	};

	var testjson = JSON.stringify( {
		"method": "Console.messageAdded",
		"params": {
			"message": "TEST"
		}
	} );

	var methodName = "Console.enable";
	var remoteConnector = new RemoteConnector( {
		send: function(msg) {
			equal( msg.method, methodName, "should be able to send request" );
		}
	});
	remoteConnector.command( methodName );
	remoteConnector.addProcedure( "Console.messageAdded", function ( params ) {
		equal( params.message, "Test add procedure", "should be abel to add procedure" );
	});
	var mockNotify = {
		"method" : "Console.messageAdded",
		"params" : {
			"message" : "Test add procedure"
		}
	};
	remoteConnector.notify( mockNotify );
	remoteConnector.removeProcedure( "Console.messageAdded" );
	remoteConnector.notify( mockNotify );
	expect( 2 );
	remoteConnector.addProcedure( mockNotify.method, function ( params ) {
		equal( params.message, mockNotify.params.message );
	});
	var mockFunction = function ( params ) {
		equal( params.message, mockNotify.params.message, "should call all added procedures" );
	};
	remoteConnector.addProcedure( mockNotify.method, mockFunction );
	remoteConnector.notify( mockNotify );
	expect( 4 );
	remoteConnector.removeProcedure( mockNotify.method, mockFunction );
	remoteConnector.notify( mockNotify );
	expect( 5 );
});
