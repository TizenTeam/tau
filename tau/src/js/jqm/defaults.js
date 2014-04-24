/*global window, define */
/*jslint plusplus: true, nomen: true */
/**
 * #jQuery Mobile mapping class
 * @class ns.jqm
 */
(function (window, document, ns, $) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../jqm"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.jqm.defaults = {
				/**
				* Proxy colors library from ns namespace to jQM namespace
				* @method init
				* @member ns.jqm
				* @static
				*/
				init: function () {
					if ($) {

						$.mobile = $.mobile || {};
						// Version of the jQuery Mobile Framework
						//$.mobile.version: __version__;

						// Namespace used framework-wide for data-attrs. Default is no namespace
						$.mobile.ns = "";

						// Define the url parameter used for referencing widget-generated sub-pages.
						// Translates to to example.html&ui-page=subpageIdentifier
						// hash segment before &ui-page= is used to make Ajax request
						$.mobile.subPageUrlKey = "ui-page";

						// Class assigned to page currently in view; and during transitions
						$.mobile.activePageClass = "ui-page-active";

						// Class used for "active" button state; from CSS framework
						$.mobile.activeBtnClass = "ui-btn-active";

						// Class used for "focus" form element state; from CSS framework
						$.mobile.focusClass = "ui-focus";

						// Automatically handle clicks and form submissions through Ajax; when same-domain
						$.mobile.ajaxEnabled = true;

						// Automatically load and show pages based on location.hash
						$.mobile.hashListeningEnabled = true;

						// disable to prevent jquery from bothering with links
						$.mobile.linkBindingEnabled = true;

						// Set default page transition - 'none' for no transitions
						$.mobile.defaultPageTransition = "fade";

						// Set maximum window width for transitions to apply - 'false' for no limit
						$.mobile.maxTransitionWidth = false;

						// Minimum scroll distance that will be remembered when returning to a page
						$.mobile.minScrollBack = 250;

						// DEPRECATED = the following property is no longer in use; but defined until 2.0 to prevent conflicts
						$.mobile.touchOverflowEnabled = false;

						// Set default dialog transition - 'none' for no transitions
						$.mobile.defaultDialogTransition = "pop";

						// Error response message - appears when an Ajax page request fails
						$.mobile.pageLoadErrorMessage = "Error Loading Page";

						// For error messages; which theme does the box uses?
						$.mobile.pageLoadErrorMessageTheme = "e";

						// replace calls to window.history.back with phonegaps navigation helper
						// where it is provided on the window object
						$.mobile.phonegapNavigationEnabled = false;

						//automatically initialize the DOM when it's ready
						$.mobile.autoInitializePage = true;

						$.mobile.pushStateEnabled = true;

						// allows users to opt in to ignoring content by marking a parent element as
						// data-ignored
						$.mobile.ignoreContentEnabled = false;

						// turn of binding to the native orientationchange due to android orientation behavior
						$.mobile.orientationChangeEnabled = true;

						$.mobile.tizen = $.mobile.tizen || {};
						$.mobile.tizen.enableHWKeyHandler = true;
					}
				}
			};
			document.addEventListener("mobileinit", function () {
				ns.jqm.defaults.init();
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.colors;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, ns.jqm.jQuery));
