#!/usr/bin/env node

require("colors");

function argvError( reason ) {
	console.log( reason );
	process.exit();
};

var argv = require("argsparser").parse();
if ( argv["--silence"] ) {
	global.cout = false;
} else {
	global.cout = true;
}

if ( argv["--verbose"] ) {
	global.verbose = true;
} else {
	global.verbose = false;
}

global.T = {};

var logger = require("./js/remotelogger.js");
T.logger = logger;
T.connect = global.conn.connect;
T.requestList = global.conn.requestList;

require("./js/bridge.js");
require("./js/loader.js");
T.browser = require("./js/browser.js");

function runTestCases( argv ) {
	var i = 1;
	for ( i = 1; i < argv.length; i++ ) {
		var str = "var tc = " + require("fs").readFileSync( argv[i] ).toString();
		eval( str );
		T.run( tc );
	}
};

var tcArg = argv[ process.argv[0] ];
if ( typeof( tcArg ) == "object" ) {
	runTestCases( tcArg );
} else {
	argvError( "no testcase file specified" );
}

