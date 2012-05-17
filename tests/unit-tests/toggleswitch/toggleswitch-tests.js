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
			on = "Enabled",
			off = "Disbled";

		$("#ts-self").toggleswitch( {
			onText: on,
			offText: off,
			checked: false
		});

		deepEqual( [ on, off, false ],
			[ ts.jqmData("onText"), ts.jqmData("offText"), ts.jqmData("checked") ],
			"should set on/off text by option val" );
		ts.next().find("a:odd").each( function (i, e) {
			text.push( $(e).text().trim() );
		}).end().find("a:lt(4):even").each( function (i, e) {
			text.push( $(e).text().trim() );
		});

		deepEqual( text, [ on, on, off, off ], "should display on/off text correctly" );
	});

	test( "Events", function () {
		var ts = $("#ts-self").toggleswitch().data("toggleswitch"),
			before = ts.options.checked;

		$("#ts-self").bind("changed", function() {
			ok( true, "should trigger changed event");
			notEqual( before, ts.options.checked, "should change value" );
		});

		$("#ts-self").next().click();
		expect(2);
	});

});
