(function (ns) {
	'use strict';
	module("profile/mobile/widget/mobile/GridList", {
		});

	test ( "API ns.widget.GridList" , function () {
		var widget, GridList;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.GridList, 'function', 'Class ns.widget.mobile.GridList exists');

		widget = ns.engine.instanceWidget(document.getElementById("gridlist"), "GridList");
		GridList = ns.widget.mobile.GridList;

		equal(typeof widget.configure, 'function', 'Method GridList.configure exists');
		equal(typeof widget.build, 'function', 'Method GridList.build exists');
		equal(typeof widget.init, 'function', 'Method GridList.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method GridList.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method GridList.destroy exists');
		equal(typeof widget.disable, 'function', 'Method GridList.disable exists');
		equal(typeof widget.enable, 'function', 'Method GridList.enable exists');
		equal(typeof widget.refresh, 'function', 'Method GridList.refresh exists');
		equal(typeof widget.option, 'function', 'Method GridList.option exists');
		equal(typeof widget.addItem, 'function', 'Method GridList.addItem exists');
		equal(typeof widget.removeItem, 'function', 'Method GridList.removeItem exists');

		equal(typeof GridList.classes, 'object', 'Property GridList.classes exists');
		equal(typeof GridList.classes.GRIDLIST, 'string', 'Property GridList.classes.selectWrapper exists');
		equal(typeof GridList.classes.ITEM, 'string', 'Property GridList.classes.optionGroup exists');
		equal(typeof GridList.classes.HELPER, 'string', 'Property GridList.classes.placeHolder exists');
		equal(typeof GridList.classes.HOLDER, 'string', 'Property GridList.classes.optionList exists');
		equal(typeof GridList.classes.LABEL, 'string', 'Property GridList.classes.selected exists');
		equal(typeof GridList.classes.LABEL_IN, 'string', 'Property GridList.classes.active exists');
		equal(typeof GridList.classes.LABEL_OUT, 'string', 'Property GridList.classes.filter exists');
		equal(typeof GridList.classes.HANDLER, 'string', 'Property GridList.classes.filterHidden exists');
	});
}(tau));
