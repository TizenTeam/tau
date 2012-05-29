var Recorder = function ( logger ) {
	if ( !logger ) {
		throw "RemoteLogger required.";
	}
	var self = this;

	self.logger = logger;

	self.injectLogger = function ( callback ) {
		self.logger.remoteEval( "\embed(mousecapture)", callback );
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
