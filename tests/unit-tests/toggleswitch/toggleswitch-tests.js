$(document).ready( function () {
	module( "Toggle Switch" );
	test( "Create", function () {
		ok( $("#ts-auto").data("checked"), "should created by auto-intialization" );
		$("#ts-self").toggleswitch();
		ok( $("#ts-self").data("checked"), "should created by call '.toggleswitch()'" );
	});

	test( "Options", function () {
		var ts = $("#ts-self"),
			text = [],
			on = "Enable",
			off = "Disable";

		$("#ts-self").toggleswitch( {
			texton: on,
			textoff: off,
			checked: false
		});
		deepEqual( [ on, off, false ],
			[ ts.toggleswitch("option", "texton"),
				ts.toggleswitch("option", "textoff"),
				ts.toggleswitch("option", "checked") ],
			"should set on/off text by option val" );

		text.push( ts.next().find(".ui-toggleswitch-on .ui-toggleswitch-text").text() );
		text.push( ts.next().find(".ui-toggleswitch-off .ui-toggleswitch-text").text() );

		deepEqual( text, [ on, off ], "should display on/off text correctly" );
	});

	test( "Events", function () {
		var ts = $("#ts-self").toggleswitch(),
			before = ts.toggleswitch( "option", "checked" );

		ts.bind("changed", function() {
			ok( true, "should trigger changed event");
			notEqual( before, ts.toggleswitch( "option", "checked" ), "should change value" );
		});

		ts.next().children().first().click();

		expect(2);

		before = ts.toggleswitch( "option", "checked" );
		ts.toggleswitch( "option", "checked", !before );

		expect(4);
	});

});
