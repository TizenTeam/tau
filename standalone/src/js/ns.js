//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"require",
	"jquery"
], function( require, $ ) {
//>>excludeEnd("microBuildExclude");

function ensureNS( name ) {
	var obj = window;

	name = name.split( "." );
	$.each(name, function( idx, name ) {
		if( typeof obj[name] === "undefined" ) {
			obj[name] = {};
		}

		obj = obj[name];
	});

	return obj;
}

var namespace = "tau",

	ns = ensureNS( namespace );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
return ns;
});
//>>excludeEnd("microBuildExclude");
