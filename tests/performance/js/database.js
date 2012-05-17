var Alfred = require("alfred");

Alfred.open("db", function (err, db) {
	if ( err ) {
		throw err;
	}

	var result = db.define("TestResult");
	result.property("name", "string", {
		optional: false
	});
	result.property("time", Number, {
		optional: false
	});
	result.property("result", "object", {
		optional: false
	});
	result.index( "name", function( result ) {
		return result.name;
	});


	var newresult = result.new( {
		name: "ScrollTest",
		time: Date.now(),
		result: {
			frame: 10,
			result: false
		}
	});

	newresult.save( function (err) {
		if (err) {
			console.log( err );
		}
	});

	result.find( {
		name: {
			$eq:"ScrollTest"
		}
	}).all( function (r) {
		console.log(r);
	});



});
