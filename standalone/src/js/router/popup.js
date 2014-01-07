//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./../tizen.micro.core",
	"./../tizen.micro.helper",
	"./../var/selectors",
	"./../utils/path.js",
	"./../tizen.micro.router",
	"./../widget/tizen.micro.popup"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, undefined ) {

	$.micro.router = $.micro.router || {};
	$.micro.router.rule = $.micro.router.rule || {};

	var popupHashKey = "&popup=";

	$.micro.router.rule.popup = {
		filter: $.micro.selectors.popup,
		
		defaults: {
			transition: undefined
		},

		open: function( to, options ) {
			var $toPage = $(to),
				state = {},
				url = $.micro.path.getLocation(),
				hasActivePopup, url, id, popupKey;

			id = to.attr("id");
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

				$.micro.router[ !hasActivePopup ? "pushHistory" : "replaceHistory" ]( state, "", popupKey );
			}

			$toPage.popup().popup("open");
			$.micro.pageContainer.one("pagehide", this._closeActivePopup);
		},

		onHashChange: function(/* url, state */) {
			this._closeActivePopup();
		},

		_closeActivePopup: function() {
			$.micro.pageContainer
				.find( $.micro.selectors.popup )
				.filter( ".ui-popup-active" )
				.popup()
				.popup("close");
		}
	};

})( jQuery );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");