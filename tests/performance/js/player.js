/********************************************************
 * GENERATED FROM : ./js/player.embed.js                                  
 * CHANGES IN HERE WILL NOT REFLECTS TO ORIGINAL FILE. 
 ********************************************************/
function Player( logger ) {
	if ( !logger ) {
		throw "RemoteLogger required." ;
	}
	var self = this;

	self.logger = logger;

	self.injectPlayer = function ( callback ) {
		self.logger.remoteEval( "( function () {\n"+"tcMousePlayer = {\n"+"queue : [],\n"+"\n"+"invokeEvent : function ( record ) {\n"+"var elem = document.elementFromPoint( record.clientX, record.clientY );\n"+"if ( elem ) {\n"+"var e = document.createEvent( 'MouseEvents' );\n"+"e.initMouseEvent( record.type, true, true );\n"+"for ( var i in record ) {\n"+"e[i] = record[i];\n"+"}\n"+"elem.dispatchEvent( e );\n"+"}\n"+"},\n"+"\n"+"addQueue : function ( queue ) {\n"+"console.log( 'receiving queues...' );\n"+"if ( 'length' in queue ) {\n"+"for ( var i = 0; i < queue.length; i++ ) {\n"+"tcMousePlayer.queue.push( queue[i] );\n"+"}\n"+"} else {\n"+"tcMousePlayer.queue.push( queue );\n"+"}\n"+"console.log( 'queues added...' );\n"+"},\n"+"\n"+"start : function () {\n"+"var idx = 0;\n"+"if ( tcMousePlayer.queue.length > 1 ) {\n"+"tcMousePlayer.invokeLater( 0,\n"+"tcMousePlayer.queue[1].timeStamp - tcMousePlayer.queue[0].timeStamp );\n"+"} else {\n"+"tcMousePlayer.invokeEvent( tcMousePlayer.queue[0] );\n"+"}\n"+"},\n"+"\n"+"invokeLater : function ( idx, time ) {\n"+"setTimeout( function () {\n"+"var queue = tcMousePlayer.queue;\n"+"var record = queue[idx];\n"+"\n"+"tcMousePlayer.invokeEvent( record );\n"+"\n"+"idx++;\n"+"if ( idx < queue.length ) {\n"+"tcMousePlayer.invokeLater( idx,\n"+"queue[idx].timeStamp - record.timeStamp );\n"+"}\n"+"}, time );\n"+"}\n"+"};\n"+"}());\n"+"", callback );
	};

	self.init = function ( filename, callback ) {
		if ( !filename ) {
			throw "unable to resolve filename";
		}
		// THIS IS TEMPORARY IMPLEMENTATION
		// node.js depedencies should be removed
		var fs = require("fs");
		var tc = fs.readFileSync( filename ).toString();
		self.logger.remoteEval( "tcMousePlayer.addQueue(" + tc + ");", function( result, error ) {
			console.log("init result...");
			console.log(result);
			if ( callback ) {
				callback();
			}
		});
//		self.logger.remoteEval( "tcMousePlayer", function (result, error) {
//			var objId = result.result.objectId;
//			self.logger.remoteCallFunction( objId,
//				"addQueue", [ tc ], function ( result, error ) {
//					console.log( result );
//					console.log( error );
//					console.log( "Test case file injected." );
//			});
//		});

	};

	self.start = function ( callback ) {
		console.log("request start");
		self.logger.remoteEval( "tcMousePlayer.start()", callback );
	};

}

if ( global ) {
	global.Player = Player;
}
