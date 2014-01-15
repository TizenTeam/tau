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

	var popupHashKey = "&popup=";

	$.micro.navigator.rule.popup = {
		filter: $.micro.selectors.popup,
		
		defaults: {
			transition: undefined
		},

		open: function( to, options ) {
			var $toPage = $(to),
				state = {},
				url = $.micro.path.getLocation(),
				hasActivePopup, url, id, popupKey;

			id = $toPage.attr("id");
			popupKey = popupHashKey + id;

			if ( id && !options.fromHashChange ) {

				hasActivePopup = url.indexOf( popupHashKey ) > -1;
				if ( url.indexOf("#") === -1 ) {
					popupKey = "#" + popupKey;
				}

				state = $.extend({}, options, {
					url: id
				});

				if( hasActivePopup ) {
					this._closeActivePopup();
				}

				$.micro.navigator[ !hasActivePopup ? "pushHistory" : "replaceHistory" ]( state, "", popupKey );
			}

			$toPage.popup().popup("open");
		},

		onHashChange: function(/* url, state */) {
			var activePopup = $.micro.pageContainer
				.find( $.micro.selectors.popup )
				.filter( ".ui-popup-active" );

			if (activePopup.length) {
				this._closeActivePopup(activePopup);
				return true;
			}
			
			return false;
		},

		_closeActivePopup: function(activePopup) {
			activePopup = activePopup ||
				$.micro.pageContainer
					.find( $.micro.selectors.popup )
					.filter( ".ui-popup-active" );
			if(activePopup.length) {
				activePopup.popup().popup("close");
			}
		}
	};

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");
