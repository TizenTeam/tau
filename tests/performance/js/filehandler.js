( function () {
	var self = this;
	var fs = require("fs");

	self.cout = undefined;
	self.isOpen = false;
	self.filename = undefined;

	/**
	 * filename	
	 * params: { callback:function, cout:boolean }
	 */
	self.open = function open( filename, params ) {
		if ( self.isOpen ) {
			return;
		}
		var flg = params.flag,
			cb = params.callback;
			self.filename = filename;

		self.cout = params.console;

		self.stream = fs.createWriteStream( filename, {
			flags: flg ? flg : "a+",
			encoding: 'utf8',
		});

		self.stream.once( 'open', function () {
			self.isOpen = true;
			if ( cb ) {
				cb();
			}
		});

		self.stream.once( "error", function (exception) {
			console.log( "Error on : " + filename );
			console.log( exception );
		});
	};

	self.close = function close( callback ) {
		if ( !self.isOpen ) {
			return;
		}

		self.stream.once( 'close', function () {
			self.isOpen = false;
			if ( callback ) {
				callback();
			}
		});

		self.stream.destroy();
	};

	self.write = function write( str ) {
		if ( self.isOpen ) {
			if ( self.cout ) {
				console.log( "Console(" + filename + "):" + str );
			}
			self.stream.write( str );
		}
	};

	self.writeLine = function writeLine( str ) {
		self.write( str + '\n' );
	};

	exports.open = self.open;
	exports.close = self.close;
	exports.write = self.write;
	exports.writeLine = self.writeLine;
}());
