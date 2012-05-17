function Player( logger ) {
	if ( !logger ) {
		throw "RemoteLogger required." ;
	}
	var self = this;

	self.logger = logger;

	self.injectPlayer = function ( callback ) {
		self.logger.remoteEval( "\embed(mouseplayer)", callback );
	};

	self.init = function ( filename, callback ) {
		if ( !filename ) {
			throw "unable to resolve filename";
		}

		var fs = require("fs");
		var tc = fs.readFileSync( filename ).toString();
		self.logger.remoteEval( "tcMousePlayer.addQueue(" + tc + ");", function( result, error ) {
			console.log("init result...");
			console.log(result);
			if ( callback ) {
				callback();
			}
		});

	};

	self.start = function ( callback ) {
		self.logger.remoteEval( "tcMousePlayer.start()", callback );
	};

}

module.exports = Player;
