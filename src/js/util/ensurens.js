/*
* Module Name : util/ensurens
* Copyright (c) 2010 - 2013 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Make namespace for modules
//>>label: Ensurens
//>>group: Tizen:Utilities

define( [
	'license/MIT' 
	], function ( ) {

//>>excludeEnd("jqmBuildExclude");

// Ensure that the given namespace is defined. If not, define it to be an empty object.
// This is kinda like the mkdir -p command.
(function (window) {
		window.ensureNS = (function () {
		var internalCache = {};
		return function ensureNS (ns) { // name just for debugging purposes
			var nsArr = ns.split(".").reverse(),
				nsSoFar = "",
				buffer = "",
				leaf = "",
				l = nsArr.length;
			while(--l >= 0) {
				leaf = nsArr[l];
				nsSoFar = nsSoFar + (nsSoFar.length > 0 ? "." : "") + leaf;
				if (!internalCache[nsSoFar]) {
					internalCache[nsSoFar] = true;
					buffer += "!window." + nsSoFar + ' && (window.' + nsSoFar + " = {});\n";
				}
			}
			buffer.length && (new Function(buffer))();
		};
	})();
})(this);

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
} );
//>>excludeEnd("jqmBuildExclude");
