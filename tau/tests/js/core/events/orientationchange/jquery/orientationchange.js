$().ready(function() {
	module("events.orientationchange", {});
	asyncTest ("orientationchange event", 2, function () {
		setTimeout(function() {
			start();
		}, 10);
		$(window).on( "orientationchange", function( event ) {
			ok(true, 'orientationchange event called');
			equal(event.orientation, 'landscape', 'event.orientation is set');
		});
		$(window).orientationchange();
	});
});