var module = QUnit.module;

module("File Handler");

asyncTest( "Open and Close", function () {
	var fileHandler = new FileHandler();

	fileHandler.open( "test.txt", {
		callback: function () {
			ok( true, "should open file with given filename" );
			ok( fileHandler.isOpen, "should apply open status to flag" );
			fileHandler.close( function () {
				ok( true, "should not open file when is already open" );
				ok( !fileHandler.isOpen, "should apply close status to flag");
			});
		},
		console: true,
		flag: "w"
	});

	setTimeout( function () {
		start();
	}, 200 );
});

asyncTest( "Write", function () {
	var fileHandler = new FileHandler();
	fileHandler.open( "test.txt", {
		flag: "w",
		callback: function () {
			fileHandler.write("Hello");
			fileHandler.close( function () {
				var fs = require("fs");
				fs.readFile( "test.txt", function( err, data ) {
					equal( data, "Hello", "should write string to file" );
				});
			});
		}
	});

	setTimeout( function () {
		start();
	}, 500);
});

