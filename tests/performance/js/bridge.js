( function ( T ) {
	T.generateKey = function () {
		var timestamp = new Date().getTime() % 1000000;
		var key = "TC" + ("" + (1000000 + timestamp)).substring(1);
		return key;
	};

	T.init = function ( cb ) {
		var keyPrefix = T.generateKey();
		var injection = T.stringify( function () {
				if ( window.TC ) {
					return;
				}
				window.TC = {};

				var TC = window.TC;

				TC.pool = {};
				TC.poolCnt = 0;

				TC.key = undefined;

				TC.onTestContext = function ( fn, cb ) {
					var str = "" + fn;
					var key = TC.key + (TC.poolCnt++);
					TC.pool[key] = {
						callback: cb,
						fn: str
					};

					// send signal
					console.log( key );
				};

				TC.requestObject = function ( objname, cb ) {
					var fn = ("" + function () {
						return objname;
					}).replace("objname", objname );
					TC.onTestContext( fn, cb );
				};

				TC.pick = function ( key ) {
					return TC.pool[key].fn;
				};

				TC.notify = function ( key, result ) {
					var origin = TC.pool[key];
					if ( origin.callback ) {
						origin.callback( result );
					}
					delete TC.pool[key];
				};
			}).replace("undefined", T.stringify(keyPrefix) );

		T.onAppContext( injection, function () {

			function TextContextMonitor() {
				this.notify = function ( str ) {
					if ( str.substr( 0, keyPrefix.length ) == keyPrefix ) {
						var fn = T.stringify( function () {
							return TC.pick( key );
						} ).replace( "key", T.stringify(str) );
						T.onAppContext( fn, function ( result ) {
							var val = eval( "(" + result.value + "());" );
							var remote = T.stringify( function () {
								TC.notify( key, val );
							} ).replace( "key", T.stringify( str ) ).replace( "val", T.stringify( val ) );
							T.onAppContext( remote );
						});
					}
				};
			};

			var monitor = new TextContextMonitor();
			T.logger.addConsoleMonitor( monitor );

			T.release = function () {
				T.logger.removeConsoleMonitor( monitor );
			};

			if ( cb ) {
				cb();
			}
		});
	};

	T.onAppContext = function ( fn, cb ) {
		var str = "" + fn;
		T.logger.remoteEval( "( " + str + "());", function ( result, fail ) {
			if ( fail ) {
				throw "Error:" + fail;
			} else {
				if ( cb ) {
					cb( result.result  );
				}
			}
		});
	};

	T.stringify = function ( object ) {
		switch ( typeof ( object ) ) {
		case 'function':
			return "" + object;
		case 'object':
			return JSON.stringify( object );
		case 'string':
			return '"' + object + '"';
		default:
			return object;
		}
	};

	T.pushObject = function ( name, property, cb ) {
		var str = "TC." + name + " = " + T.stringify( property );
		T.onAppContext( str, cb );
	}

	T.requestObject = function ( name, cb ) {
		var fn = T.stringify( function () {
			return name;
		}).replace("name", name);
		T.onAppContext( fn, cb );
	};

}( T ));
