( function () {
	self = this;
	self.id = 0;
	self.cbqueue = {};

	exports.request = function request( method, params, callback ) {
		var cb,
			msg = {
			"id": self.id,
			"method": method
		};

		if ( params ) { // with both or one of either params and callback
			if ( typeof( params ) == "function" ) { // without param
				cb = params;
			} else if ( typeof( params ) == "object" ) {
				msg.params = params;
				if ( callback ) {
					cb = callback;
				}
			}
		}
		if ( cb ) {
			self.cbqueue[ self.id ] = cb;
		}

		self.id++;
		return msg;
	};

	exports.response = function response( id, result, error ) {
		var method = self.cbqueue[id];
		if ( method ) {
			method( result, error );
			delete self.cbqueue[id];
		}
	};
}());
