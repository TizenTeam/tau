module("API ej.widget.micro", {
	});

	test ( "API ej.widget.micro" , function () {
		var widget;
		equal(typeof ej, 'object', 'Class ej exists');
		equal(typeof ej.widget, 'object', 'Class ej.widget exists');
		equal(typeof ej.widget.micro, 'object', 'Class ej.widget.micro exists');
	});