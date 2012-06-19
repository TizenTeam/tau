/*
 * Unit Test: Notification
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("Notification");

	var unit_notification = function ( widget, type ) {
		var notification,
			elem = ".ui-" + type,
			text;

		/* Create */
		widget.notification();

		notification = widget.children( elem );
		ok( notification, "Create" );

		/* Show */
		widget.notification("show");

		notification = widget.children( elem );
		ok( notification.hasClass("show"), "API: show" );

		/* Hide */
		widget.notification("hide");

		notification = widget.children( elem );
		ok( notification.hasClass("hide"), "API: hide" );

		/* hide when click */
		widget.notification("show");
		notification = widget.children( elem );
		notification.trigger("vmouseup");

		notification = widget.children( elem );
		ok( notification.hasClass("hide"), "Hide when click the notification" );

		text = notification.children("p");
		console.log(text);

		if ( type === "smallpopup" ) {
			ok( $( text[0] ).hasClass( "ui-smallpopup-text-bg" ), "Text" );
		} else {
			ok( $( text[0] ).hasClass( "ui-ticker-text1-bg" ), "Top Text" );
			ok( $( text[1] ).hasClass( "ui-ticker-text2-bg" ), "Bottom Text" );
		}
	};

	test( "smallpopup", function () {
		unit_notification( $("#smallpopup"), "smallpopup" );
	});

	test( "tickernoti", function () {
		unit_notification( $("#tickernoti"), "ticker" );
	});
}( jQuery ));
