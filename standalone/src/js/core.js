/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./ns" ], function( jQuery, ns ) {
//>>excludeEnd("microBuildExclude");

(function( $, ns, window, undefined ) {

	ns.defaults = ns.defaults || {};

	$.extend(ns.defaults, {
		autoInitializePage: true,
		
		// transition
		pageTransition: "none",
		popupTransition: "none"

	});

})( jQuery, ns, this );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
