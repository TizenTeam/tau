(function () {

	var self = this;

	self.rconn = require("./remoteconnector.js");
	var started = false;
	var session = false;
	self.timelineMonitors = [];
	self.consoleMonitors = [];

	var handleLog = function ( params ) {
		self.lastMessage = params.message;
		self.log( params.message.text );
	};

	var handleRepeat = function ( params ) {
		self.log( self.lastMessage );
	};

	var handleEvent = function ( params ) {
		self.timeline( params.record );
	};

	function FileConsoleMonitor ( filename, type ) {
		var file = require("./filehandler.js");

		file.open( filename );

		// to remove condition check on runtime, 
		// do messy job at declaration
		if ( type == "object" ) {
			this.notify = function ( msg ) {
				msg = JSON.stringify( msg );
				file.writeLine( msg );
			};
		} else {
			this.notify = function ( msg ) {
				file.writeLine( msg );
			};
		}

		this.close = function () {
			file.close();
		};
	};

	self.remoteEval = function ( expr, callback ) {
		self.command( "Runtime.evaluate", {
			"expression" : expr,
			"returnByValue" : callback != undefined,
		}, callback );
	};

	self.remoteCallFunction = function ( objId, methodName, argv, callback ) {
		self.command( "Runtime.callFunctionOn", {
			"objectId": objId,
			"functionDeclaration": methodName,
			"arguments": argv,
			"returnByValue": callback ? true : false
		}, callback );
	};

	self.command = rconn.command;

	self.start = function start( filename ) {
		if ( started ) {
			return;
		}

		started = true;
		if ( filename ) {
			self.fileLogMonitor = new FileConsoleMonitor( filename );
			self.addConsoleMonitor( self.fileLogMonitor );
		}
		if ( global.cout ) {
			self.consoleLog = {
				notify: function (msg) {
					console.log( msg.white );
				}
			};
			self.addConsoleMonitor( self.consoleLog );
		}

		self.rconn.addProcedure( "Console.messageAdded", handleLog );
		self.rconn.addProcedure( "Console.messageRepeatCountUpdated", handleRepeat );
		self.rconn.command( "Console.enable" );
	};

	self.stop = function stop() {
		if ( !started ) {
			return;
		}
		started = false;

		self.rconn.removeProcedure( "Console.messageAdded", handleLog );
		self.rconn.removeProcedure( "Console.messageRepeatCountUpdated", handleRepeat );
		self.rconn.command( "Console.disable" );
		if ( self.fileLogMonitor ) {
			self.removeConsoleMonitor( self.fileLogMonitor );
			self.fileLogMonitor.close();
			self.fileLogMonitor = null;
		}
		if ( global.cout ) {
			self.removeConsoleMonitor( self.consoleLog );
			self.consoleLog = null;
		}
	};

	self.log = function log( log ) {
		for ( var i = 0; i < self.consoleMonitors.length; i++ ) {
			self.consoleMonitors[i].notify( log );
		}
	};

	self.addConsoleMonitor = function ( monitor ) {
		self.consoleMonitors.push( monitor );
	};

	self.removeConsoleMonitor = function ( monitor ) {
		var idx = self.consoleMonitors.indexOf( monitor );
		if ( idx > -1 ) {
			self.consoleMonitors.splice( idx, 1 );
		}
	};

	self.timeline = function timeline( event ) {
		for ( var i = 0; i < self.timelineMonitors.length; i++ ) {
			self.timelineMonitors[i].notify( event );
		}
	};

	self.startSession = function ( filename ) {
		if ( session ) {
			return;
		}

		session = true;
		if ( filename ) {
			self.fileTimelineMonitor = new FileConsoleMonitor( filename, "object" );
			self.addTimelineMonitor( self.fileTimelineMonitor );
		}

		self.rconn.addProcedure( "Timeline.eventRecorded", handleEvent );
		self.rconn.command( "Timeline.start" );
	};

	self.stopSession = function () {
		if ( !session ) {
			return;
		}
		session = false;
		self.rconn.command( "Timeline.stop" );
		self.rconn.removeProcedure( "Timeline.eventRecorded", handleEvent );
		if ( self.fileTimelineMonitor ) {
			self.removeTimelineMonitor( self.fileTimelineMonitor );
			self.fileTimelineMonitor.close();
			self.fileTimelineMonitor = null;
		}
	};

	self.addTimelineMonitor = function ( monitor ) {
		self.timelineMonitors.push( monitor );
	};

	self.removeTimelineMonitor = function ( monitor ) {
		var idx = self.timelineMonitors.indexOf( monitor );
		if ( idx > -1 ) {
			self.timelineMonitors.splice( idx, 1 );
		}
	};

	exports.remoteEval = self.remoteEval;
	exports.remoteCallFunction = self.remoteCallFunction;
	exports.start = self.start;
	exports.stop = self.stop;
	exports.addConsoleMonitor = self.addConsoleMonitor;
	exports.removeConsoleMonitor = self.removeConsoleMonitor;
	exports.startSession = self.startSession;
	exports.stopSession = self.stopSession;
	exports.addTimelineMonitor = self.addTimelineMonitor;
	exports.removeTimelineMonitor = self.removeTimelineMonitor;

}());

