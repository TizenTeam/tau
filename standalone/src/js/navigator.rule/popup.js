/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"../ns",
	"../core",
	"../helper",
	"../var/selectors",
	"../utils/path.js",
	"../navigator",
	"../widget/popup"], function( jQuery, ns ) {
//>>excludeEnd("microBuildExclude");

(function( $, ns, undefined ) {

	ns.navigator = ns.navigator || {};
	ns.navigator.rule = ns.navigator.rule || {};

	var popupHashKey = "popup=true",
		popupHashKeyReg = /([&|\?]popup=true)/,
		$document = ns.$document;

	ns.navigator.rule.popup = {
		filter: ns.selectors.popup,

		option: function() {
			return {
				transition: ns.defaults.popupTransition,
				container: undefined,
				volatileRecord: true
			};
		},

		open: function( to, options ) {
			var $to = $(to),
				documentUrl = ns.path.getLocation().replace( popupHashKeyReg, "" ),
				activePage = ns.pageContainer.pagecontainer("getActivePage"),
				url, popupKey, $container;

			popupKey = popupHashKey;

			if ( !options.fromHashChange ) {
				url = ns.path.addHashSearchParams( documentUrl, popupKey );
				ns.navigator.history.replace( options, "", url );
			}

			if( $(to).is( "[data-external=true]" ) ) {
				$container = options.container ?
								$(activePage).find(options.container).first() :
								$(activePage);
				$container.append($to);
				$to.one( "popuphide", function() {
					$to.remove();
				});
			}

			if(this._hasActivePopup()) {
				$document.one( "popuphide", function() {
					$to.popup(options).popup("open", options);
				} );
				this._closeActivePopup();
			} else {
				$to.popup(options).popup("open", options);
			}

		},

		onHashChange: function(/* url, state */) {
			var activePopup = ns.pageContainer.find( ".ui-popup-active" );

			if (activePopup.length) {
				this._closeActivePopup(activePopup);
				return true;
			}

			return false;
		},

		_closeActivePopup: function(activePopup) {
			activePopup = activePopup ||
				ns.pageContainer.find( ".ui-popup-active" );
			if(activePopup.length) {
				activePopup.popup().popup("close");
			}
		},

		_hasActivePopup: function() {
			return ns.pageContainer.find( ".ui-popup-active" ).length > 0;
		}
	};

})( jQuery, ns );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
