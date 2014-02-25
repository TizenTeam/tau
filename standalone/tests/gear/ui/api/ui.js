module("API gear.ui", {
	});

	test ( "API gear.ui" , function () {
		var widget;
		equal(typeof gear, 'object', 'Class gear exists');
		equal(typeof gear.ui, 'object', 'Class gear.ui exists');
		equal(typeof gear.ui.noConflict, 'function', 'Class gear.ui.noConflict exists');
	});