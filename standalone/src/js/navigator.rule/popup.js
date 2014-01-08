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
		popupHashKeyReg = /([&|\?]popup=true)/;

	$.micro.navigator.rule.popup = {
		filter: $.micro.selectors.popup,

		defaults: {
			transition: undefined,
			container: undefined,
			volatileRecord: true
		},

		open: function( to, options ) {
			var $to = $(to),
				state = {},
				documentUrl = $.micro.path.getLocation().replace( popupHashKeyReg, "" ),
				activePage = $.micro.pageContainer.pagecontainer("getActivePage"),
				url, popupKey, $container;

			url = $to.data( "url" );
			popupKey = popupHashKey;

			this._closeActivePopup();

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

			$to.popup().popup("open");
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
		}
	};

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
