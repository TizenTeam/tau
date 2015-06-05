(function (ns) {
	'use strict';
	module("profile/mobile/widget/mobile/Page", {
		});

	test ( "API ns.widget.Page" , function () {
		var widget;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.Page, 'function', 'Class ns.widget.mobile.Page exists');
		widget = new ns.widget.mobile.Page();

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

		equal(typeof widget.options, 'object', 'Property page.options exists');
		equal(typeof widget.options.theme, 'string', 'Property page.options.theme exists');
		equal(typeof widget.options.domCache, 'boolean', 'Property page.options.domCache exists');
		equal(typeof widget.options.headerTheme, 'string', 'Property page.options.headerTheme exists');
		equal(typeof widget.options.footerTheme, 'string', 'Property page.options.footerTheme exists');

		equal(typeof widget.backBtnText, 'string', 'Property page.backBtnText exists');
		equal(typeof widget.backBtnTheme, 'object', 'Property page.backBtnTheme exists');

		equal(typeof widget._build, 'function', 'Method page._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method page._bindEvents exists');
		equal(typeof widget._destroy, 'function', 'Method page._destroy exists');
	});
}(ej));