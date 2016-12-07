/* global define */
define([
	"tests/libs/jquery",
	"tests/js/core/util/DOM/css/css",
	"src/js/core/util/DOM/css",
	"../../../../helpers"
],
	function ($, testCSS, utilDOM, helpers) {
		helpers.removeTAUStyle(document);
		testCSS(utilDOM);
	});