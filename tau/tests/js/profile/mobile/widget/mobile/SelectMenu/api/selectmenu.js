(function (ns) {
	'use strict';
	module("api.ns.widget.selectmenu", {
		});

	test ( "API ns.widget.selectmenu" , function () {
		var widget, SelectMenu;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.SelectMenu, 'function', 'Class ns.widget.mobile.selectmenu exists');

		widget = ns.engine.instanceWidget(document.getElementById("select"), "SelectMenu");
		SelectMenu = ns.widget.mobile.SelectMenu;

		equal(typeof widget.configure, 'function', 'Method selectmenu.configure exists');
		equal(typeof widget._getCreateOptions, 'function', 'Method selectmenu._getCreateOptions exists');
		equal(typeof widget.build, 'function', 'Method selectmenu.build exists');
		equal(typeof widget.init, 'function', 'Method selectmenu.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method selectmenu.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method selectmenu.destroy exists');
		equal(typeof widget.disable, 'function', 'Method selectmenu.disable exists');
		equal(typeof widget.enable, 'function', 'Method selectmenu.enable exists');
		equal(typeof widget.refresh, 'function', 'Method selectmenu.refresh exists');
		equal(typeof widget.open, 'function', 'Method selectmenu.open exists');
		equal(typeof widget.close, 'function', 'Method selectmenu.close exists');
		equal(typeof widget.option, 'function', 'Method selectmenu.option exists');

		equal(typeof SelectMenu.classes, 'object', 'Property selectmenu.classes exists');
		equal(typeof SelectMenu.classes.selectWrapper, 'string', 'Property selectmenu.classes.selectWrapper exists');
		equal(typeof SelectMenu.classes.optionGroup, 'string', 'Property selectmenu.classes.optionGroup exists');
		equal(typeof SelectMenu.classes.placeHolder, 'string', 'Property selectmenu.classes.placeHolder exists');
		equal(typeof SelectMenu.classes.optionList, 'string', 'Property selectmenu.classes.optionList exists');
		equal(typeof SelectMenu.classes.selected, 'string', 'Property selectmenu.classes.selected exists');
		equal(typeof SelectMenu.classes.active, 'string', 'Property selectmenu.classes.active exists');
		equal(typeof SelectMenu.classes.filter, 'string', 'Property selectmenu.classes.filter exists');
		equal(typeof SelectMenu.classes.filterHidden, 'string', 'Property selectmenu.classes.filterHidden exists');
		equal(typeof SelectMenu.classes.label, 'string', 'Property selectmenu.classes.label exists');
		equal(typeof SelectMenu.classes.disabled, 'string', 'Property selectmenu.classes.disabled exists');
		equal(typeof SelectMenu.classes.inline, 'string', 'Property selectmenu.classes.inline exists');
		equal(typeof SelectMenu.classes.native, 'string', 'Property selectmenu.classes.native exists');

		equal(typeof widget._build, 'function', 'Method selectmenu._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method selectmenu._bindEvents exists');
	});
}(tau));
