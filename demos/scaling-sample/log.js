$( window ).load( function () {
	( function writeLog() {
		var log = $("#log"),
			viewport = $('head').find('meta[name="viewport"]'),
			htmlFontSize = $('html').css('font-size');

		function item(text) {
			return $("<li></li>").text(text);
		}
		log.append( item( "viewport content: " + viewport.attr("content") ) );
		log.append( item( "html fontsize: " + htmlFontSize) );
	} () );

	( function addLink() {
		var link = $("#link"),
			links = {
				device_width: "index.device_width.html",
				fixed_width:  "index.fixed_width.html",
				screen_width: "index.screen_width.html"
			};
			for ( idx in links ) {
				link.append('<li><a href="' + links[idx] + '" rel="external">' + idx + '</a>' );
			}
		link.listview('refresh');
	} () );
} );

