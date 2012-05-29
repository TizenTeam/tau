/********************************************************
 * GENERATED FROM : ./js/recorder.embed.js                                  
 * CHANGES IN HERE WILL NOT REFLECTS TO ORIGINAL FILE. 
 ********************************************************/
var Recorder = function ( logger ) {
	if ( !logger ) {
		throw "RemoteLogger required.";
	}
	var self = this;

	self.logger = logger;

	self.injectLogger = function ( callback ) {
		self.logger.remoteEval( "( function () {\n"+"tcMouseCapture = {\n"+"data : [],\n"+"capture : function ( event ) {\n"+"var log = {\n"+"timeStamp : event.timeStamp,\n"+"type : event.type,\n"+"clientX : event.clientX,\n"+"clientY : event.clientY,\n"+"screenX : event.screenX,\n"+"screenY : event.screenY,\n"+"x : event.x,\n"+"y : event.y\n"+"};\n"+"tcMouseCapture.data.push( log );\n"+"},\n"+"\n"+"target : ['mousemove', 'mousedown', 'mouseup', 'click', 'mouseover', 'mouseout' ],\n"+"\n"+"start : function () {\n"+"tcMouseCapture.data.splice( 0, tcMouseCapture.data.length );\n"+"for ( var i in tcMouseCapture.target ) {\n"+"document.addEventListener( tcMouseCapture.target[i], tcMouseCapture.capture );\n"+"}\n"+"\n"+"return true;\n"+"},\n"+"\n"+"stop : function () {\n"+"for ( var i in tcMouseCapture.target ) {\n"+"document.removeEventListener( tcMouseCapture.target[i], tcMouseCapture.capture );\n"+"}\n"+"\n"+"return true;\n"+"},\n"+"\n"+"dump : function () {\n"+"return JSON.stringify(tcMouseCapture.data);\n"+"}\n"+"};\n"+"}());\n"+"", callback );
	};

	self.startRecording = function () {
		self.logger.remoteEval( "tcMouseCapture.start();", function ( result, error ) {
			console.log( "Event record started." );
		});
	};

	self.stopRecording = function () {
		self.logger.remoteEval( "tcMouseCapture.stop();", function ( result, error ) {
			console.log( "Event record stopped." );
		});
	};

	self.retrieveData = function ( filename ) {
		if ( !filename ) {
			filename = "TC-" + new Date().getTime() + ".json";
		}
		var fileHandler = new FileHandler();
		fileHandler.open( filename, {
			callback: function () {
				self.logger.remoteEval( "tcMouseCapture.dump();", function ( result ) {
					fileHandler.write( result.result.value );
					fileHandler.close();
				});
			},
			console: false,
		});
	};
};

if ( global ) {
	global.Recorder = Recorder;
}
