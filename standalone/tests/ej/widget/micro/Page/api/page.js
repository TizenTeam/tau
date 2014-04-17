module("api.ej.widget.Page", {
	});

	test ( "API ej.widget.Page" , function () {
		var widget;
		equal(typeof ej, 'object', 'Class ej exists');
		equal(typeof ej.widget, 'object', 'Class ej.widget exists');
		equal(typeof ej.widget.micro, 'object', 'Class ej.widget.micro exists');
		equal(typeof ej.widget.micro.Page, 'function', 'Class ej.widget.micro.Page exists');
		widget = new ej.widget.micro.Page();

		equal(typeof widget.configure, 'function', 'Method page.configure exists');
		equal(typeof widget._getCreateOptions, 'function', 'Method page._getCreateOptions exists');
		equal(typeof widget.build, 'function', 'Method page.build exists');
		equal(typeof widget.init, 'function', 'Method page.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method page.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method page.destroy exists');
		equal(typeof widget.disable, 'function', 'Method page.disable exists');
		equal(typeof widget.enable, 'function', 'Method page.enable exists');
		equal(typeof widget.refresh, 'function', 'Method page.refresh exists');
		equal(typeof widget.option, 'function', 'Method page.option exists');

		equal(typeof widget._build, 'function', 'Method page._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method page._bindEvents exists');
		equal(typeof widget._destroy, 'function', 'Method page._destroy exists');
		equal(typeof widget._destroy, 'function', 'Method page._destroy exists');
	});