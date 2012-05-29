var module = QUnit.module;

module("Dispatcher");
test( "Dispatcher function test", function () {
	(function () {
		var check = 0;
		var dispatcher = new Dispatcher( {
			send : function( msg ) {
				equal( msg.id, check, "should generate unique id for each request" );
				equal( msg.method, "Console.enable", "should be able to send request with given method name" );
				equal( msg.params, undefined, "should be able to send request without params" );
			}
		});
		dispatcher.request( "Console.enable" );

		check = 1;
		var method = "DOM.getAttributes";
		var params = {
			nodeId : "foo"
		};
		dispatcher.conn = {
			send : function( msg ) {
				equal( msg.id, check );
				equal( msg.method, method );

				deepEqual( msg.params, params, "should be able to send request with given params" );
			}
		};
		dispatcher.request( method, params );

		check = 2;
		var Cb = function () {};
		dispatcher.conn = {
			send : function( msg ) {
				dispatcher.response( msg.id );
			}
		};
//		raises( function () {
//			dispatcher.request( method, function () {
//				throw new Cb();
//			});
//		}, Cb, "should be able to call callback method for response" );
	}());
});
