exports.create = function ( rconn ) {
	var self = this;

	self.ws = undefined;
	self.rconn = rconn;

	self.requestList = function list( server, callback ) {
		function parse( chunk ) {
			var i, list = [];
			var data = JSON.parse( chunk );
			for ( i in data ) {
				if ( data[i].hasOwnProperty( 'webSocketDebuggerUrl' ) ) {
					list.push( data[i] );
				}
			}

			if ( callback != null ) {
				callback( list );
			}
		};

		var http = require('http'),
			url = require('url'),
			addr = url.parse( server );
			http.get( {
				host: addr.hostname,
				port: addr.port,
				path: addr.path
			}, function ( res ) {
				res.on('data', function( chunk ) {
					parse( chunk );
				});
			});
	};

	self.onopen = function onopen( e ) {
		console.log( e );
	};

	self.onclose = function onclose( e ) {
		console.log( e );
	};

	self.onerror = function onerror( e ) {
		console.log( e );
	};

	if ( global.verbose ) {
		self.onmessage = function onmessage( e ) {
			console.log( e.yellow );
			if ( self.rconn ) {
				self.rconn.notify( e );
			}
		};
		self.send = function send( msg ) {
			if ( self.ws ) {
				if ( typeof( msg ) == "object" ) {
					msg = JSON.stringify( msg );
				}
				console.log( msg.yellow );
				return self.ws.send( msg );
			} else {
				return false;
			}
		};
	} else {
		self.onmessage = function onmessage( e ) {
			if ( self.rconn ) {
				self.rconn.notify( e );
			} else {
				console.log( e );
			}
		};
		self.send = function send( msg ) {
			if ( self.ws ) {
				if ( typeof( msg ) == "object" ) {
					msg = JSON.stringify( msg );
				}
				return self.ws.send( msg );
			} else {
				return false;
			}
		};
	}

	self.connect = function connect( remote, callback ) {
		if ( remote === undefined ) {
			throw "remote address is required.";
		}

		try {
			var WebSocket = require("ws");
			this.ws = new WebSocket( remote );
			this.onopen = function ( e ) {
				if ( callback != null ) {
					callback( e );
				}
			};
			this.ws.on( "open", this.onopen );
			this.ws.on( "message", this.onmessage );
			this.ws.on( "close", this.onclose );
			this.ws.on( "error", this.onerror );
		} catch ( exception ) {
			console.log( exception );
		}
	};


	return this;
};
