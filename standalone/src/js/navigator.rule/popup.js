//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"../core",
	"../helper",
	"../var/selectors",
	"../utils/path.js",
	"../navigator",
	"../widget/popup"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

	$.micro.navigator = $.micro.navigator || {};
	$.micro.navigator.rule = $.micro.navigator.rule || {};

	var popupHashKey = "popup=true",
		popupHashKeyReg = /([&|\?]popup=true)/,
		$document = $.micro.$document;

	$.micro.navigator.rule.popup = {
		filter: $.micro.selectors.popup,

		option: function() {
			return {
				transition: $.micro.defaults.popupTransition,
				container: undefined,
				volatileRecord: true
			};
		},

		open: function( to, options ) {
			var $to = $(to),
				state = {},
				documentUrl = $.micro.path.getLocation().replace( popupHashKeyReg, "" ),
				activePage = $.micro.pageContainer.pagecontainer("getActivePage"),
				url, popupKey, $container;

			url = $to.data( "url" );
			popupKey = popupHashKey;

			if ( url && !options.fromHashChange ) {

				state = $.extend({}, options, {
					url: url
				});

				url = $.micro.path.addHashSearchParams( documentUrl, popupKey );
				$.micro.navigator.history.replace( state, "", url );
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
			var activePopup = $.micro.pageContainer.find( ".ui-popup-active" );

			if (activePopup.length) {
				this._closeActivePopup(activePopup);
				return true;
			}

			return false;
		},

		_closeActivePopup: function(activePopup) {
			activePopup = activePopup ||
				$.micro.pageContainer.find( ".ui-popup-active" );
			if(activePopup.length) {
				activePopup.popup().popup("close");
			}
		},

		_hasActivePopup: function() {
			return $.micro.pageContainer.find( ".ui-popup-active" ).length > 0;
		}
	};

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
