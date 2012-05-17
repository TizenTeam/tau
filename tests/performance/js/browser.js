( function () {
	var dport = 9222,
		self = this,
		runtime = null;

	self.conn = require("./remoteconnector.js");

	self.launch = function ( url, callback, rdport ) {
		if ( self.runtime ) {
			console.log( "Chrome already started." );
			return;
		}
		if ( rdport ) {
			dport = rdport;
		}

		self.runtime = require("child_process").spawn("google-chrome", ['--remote-debugging-port=' + dport, url ? url : "about:blank"] );
		self.runtime.on( 'exit', function () {
			self.runtime = null;
		});

		if ( callback ) {
			// since there is no event emiiter on spawned process,
			// give little sec by manually
			setTimeout( callback, 2000 );
		}
	};

	self.kill = function ( cb ) {
		if ( self.runtime ) {
			self.runtime.kill( 'SIGKILL' );
		} else {
			console.log( "Nothing to kill." );
		}
	};

	self.clearBrowser = function ( type, cb, err ) {
		self.conn.command( "Network.canClearBrowser" + type, function ( result, error ) {
			if ( error || result.result == false ) {
				cb( null, error ? error : "Unsupported operation" );
			} else {
				self.conn.command( "Network.clearBrowser" + type, cb );
			}
		});
	};

	self.clearBrowserCache = function ( cb, err ) {
		self.clearBrowser( "Cache", cb, err );
	};

	self.clearBrowserCookies = function ( cb, err ) {
		self.clearBrowser( "Cookies", cb, err );
	};

	self.open = function ( url, cb ) {
		self.conn.command( "Page.navigate", {
			"url" : url }, cb );
	};

	exports.launch = self.launch;
	exports.kill = self.kill;
	exports.clearBrowserCache = self.clearBrowserCache;
	exports.clearBrowserCookies = self.clearBrowserCookies;
	exports.open = self.open;
}());
