//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
define([
	"jquery",
	"./tizen.micro.core",
	"./utils/path"], function( jQuery ) {
//>>excludeEnd("microBuildExclude");

(function( $, window, undefined ) {

	$.extend($.micro, {

		$window: $(window),
		$document: $(window.document),

		getClosestBaseUrl: function( ele )	{
			// Find the closest page and extract out its url.
			var url = $( ele ).closest( ".ui-page" ).data( "url" ),
				base = $.micro.path.documentBase.hrefNoHash;

			if ( !$.micro.dynamicBaseEnabled || !url || !$.micro.path.isPath( url ) ) {
				url = base;
			}

			return $.micro.path.makeUrlAbsolute( url, base );
		}


	});

})( jQuery, this );

//>>excludeStart("microBuildExclude", pragmas.microBuildExclude);
});
//>>excludeEnd("microBuildExclude");