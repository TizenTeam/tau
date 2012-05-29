if ( global.conn ) {
	return global.conn;
}

( function () {
	var self = this,
		conn = require("./connector.js").create( self ),
		dispatcher = require("./dispatcher.js"),
		handlers = [];


	self.connect = function () {
		conn.connect.apply( conn, arguments );
	};

	self.requestList = function () {
		conn.requestList.apply( conn, arguments );
	};

	self.command = function command( methodName, params, callback ) {
		conn.send( dispatcher.request( methodName, params, callback ) );
	};

	self.addProcedure = function addProcedure( methodName, method ) {
		var methods;
		if ( methodName in handlers ) {
			methods = handlers[methodName];
		} else {
			methods = handlers[methodName] = [];
		}

		methods.push( method );
	};

	self.getProcedure = function getProcedure( methodName ) {
		return function ( params ) {
			var methods = handlers[methodName];
			if ( methods ) {
				for ( var i = 0; i < methods.length; i++ ) {
					methods[i]( params );
				}
			}
		}
	};

	self.removeProcedure = function removeProcedure( methodName, method ) {
		var methods;

		if ( handlers[methodName] ) {
			methods = handlers[methodName];
		} else {
			return;
		}

		if ( method ) {
			methods.splice( methods.indexOf( method ), 1 );
		} else {
			delete handlers[methodName];
		}
	};

	self.notify = function notify( msg ) {
		var data = ( typeof( msg ) == "string" ) ? JSON.parse( msg ) : msg;
		if ( "id" in data ) {
			dispatcher.response( data.id, data.result, data.error );
		} else {
			var method = self.getProcedure( data.method );
			method( data.params );
		}
	};

	exports.connect = self.connect;
	exports.requestList = self.requestList;
	exports.command = self.command;
	exports.addProcedure = self.addProcedure;
	exports.getProcedure = self.getProcedure;
	exports.removeProcedure = self.removeProcedure;
	exports.notify = self.notify;

	if ( global ) {
		global.conn = exports;
	}
}());
