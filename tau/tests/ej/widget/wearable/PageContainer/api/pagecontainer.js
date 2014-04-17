module("api.ns.widget.wearable.Page", {
	});

	test ( "API ns.widget.wearable.Page" , function () {
		var widget;
		equal(typeof ej, 'object', 'Class ej exists');
		equal(typeof ej.widget, 'object', 'Class ej.widget exists');
		equal(typeof ej.widget.wearable, 'object', 'Class ej.widget.wearable exists');
		equal(typeof ej.widget.wearable.PageContainer, 'function', 'Class ej.widget.wearable.PageContainer exists');
		widget = new ej.widget.wearable.PageContainer();

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

	});