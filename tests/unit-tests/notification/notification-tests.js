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
			text,
			tapped = false,
			param;

		/* Bind tapped event */
		widget.bind( "tapped", function ( e, m ) {
			tapped = true;
			param = m;
		});

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

		/* Trigger click event */
		widget.notification("show");
		notification = widget.children( elem );
		notification.trigger("vmouseup");

		ok( tapped, "Event: tapped" );

		/* Check Parameters */
		equal( param, widget.jqmData("param"), "Parameter: data-param" );

		if ( type === "smallpopup" ) {
			text = notification.children( elem + "-text-bg");
			equal( text.text(), widget.jqmData("text1"), "Parameter: data-text1" );
		} else {
			text = notification.children( elem + "-text1-bg");
			equal( text.text(), widget.jqmData("text1"), "Parameter: data-text1" );

			text = notification.children( elem + "-text2-bg");
			equal( text.text(), widget.jqmData("text2"), "Parameter: data-text2" );
		}
	};

	test( "smallpopup", function () {
		unit_notification( $("#smallpopup"), "smallpopup" );
	});

	test( "tickernoti", function () {
		unit_notification( $("#tickernoti"), "ticker" );
	});
}( jQuery ));
