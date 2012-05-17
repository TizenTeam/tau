{
	"name": "Sample Test",
	"setUp": function ( T ) {
		T.browser.launch( "about:blank", function () {
			T.requestList( "http://localhost:12345/json", function (list) {
				T.connect( list[0].webSocketDebuggerUrl, function () {
					T.logger.start();
					T.browser.clearBrowserCache();
					T.browser.open( "http://localhost/demos/tizen-gray" );
					T.init( function ( e ) {
						setTimeout( T.next, 3000 );
					});
				});
			});
		}, 12345 );

		//start browser
		//open page
	},
	"testSomething": function( T ) {
		global.echoOnTest = function ( num ) {
			if ( num > 1000 ) {
				console.log( "Done in " + (Date.now() - global.startTime) );
				T.next();
			}
			num++;
			T.onAppContext( T.stringify( function () {
				echoOnApp( num );
			}).replace("num", num));
		};
		T.onAppContext( function () {
			window.echoOnApp = function ( str ) {
				TC.onTestContext( (function () {
					echoOnTest( "str" );
				} + "").replace( "str", str) );
			};
		});
		global.startTime = Date.now();
		global.echoOnTest( 0 );
	},
	"tearDown": function ( T ) {
		T.browser.kill();
		T.done();
	}
}
