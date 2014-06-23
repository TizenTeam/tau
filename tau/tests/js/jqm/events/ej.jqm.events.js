module("ej events mapping", {
	});

	asyncTest('pagebeforechange parameters', 1, function () {
		$(document).on( "pagebeforechange", function( e, data ) {
			ok( data, "popup", 'parameters test' );
			start();
		});
		ej.engine.run();
	});