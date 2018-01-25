module("core/widget/core/PageContainer", {
	});

	test ( "API ns.widget.core.PageContainer" , function () {
		var widget;
		equal(typeof tau, 'object', 'Class tau exists');
		equal(typeof tau.widget, 'object', 'Class tau.widget exists');
		equal(typeof tau.widget.core, 'object', 'Class tau.widget.core exists');
		equal(typeof tau.widget.core.PageContainer, 'function', 'Class tau.widget.core.PageContainer exists');
		widget = new tau.widget.core.PageContainer();

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