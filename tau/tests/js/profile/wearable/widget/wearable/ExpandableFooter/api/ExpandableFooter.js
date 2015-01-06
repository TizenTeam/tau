module("tau.widget.ExpandableFooter", {});

test("API" , function () {
	var widget;
	equal(typeof tau, 'object', 'Class tau exists');
	equal(typeof tau.widget, 'object', 'Class tau.widget exists');
	equal(typeof tau.widget.wearable, 'object', 'Class tau.widget.wearable exists');
	equal(typeof tau.widget.wearable.ExpandableFooter, 'function', 'Class tau.widget.wearable.ExpandableFooter exists');
	widget = new tau.widget.wearable.ExpandableFooter();

	equal(typeof widget.configure, 'function', 'Method ExpandableFooter.configure exists');
	equal(typeof widget.build, 'function', 'Method ExpandableFooter.build exists');
	equal(typeof widget.init, 'function', 'Method ExpandableFooter.init exists');
	equal(typeof widget.bindEvents, 'function', 'Method ExpandableFooter.bindEvents exists');
	equal(typeof widget.destroy, 'function', 'Method ExpandableFooter.destroy exists');
	equal(typeof widget.disable, 'function', 'Method ExpandableFooter.disable exists');
	equal(typeof widget.enable, 'function', 'Method ExpandableFooter.enable exists');
	equal(typeof widget.refresh, 'function', 'Method ExpandableFooter.refresh exists');
	equal(typeof widget.option, 'function', 'Method ExpandableFooter.option exists');
});