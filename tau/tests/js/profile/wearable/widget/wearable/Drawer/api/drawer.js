module("tau.widget.Drawer", {});

test("API" , function () {
	var widget;
	equal(typeof tau, 'object', 'Class tau exists');
	equal(typeof tau.widget, 'object', 'Class tau.widget exists');
	equal(typeof tau.widget.wearable, 'object', 'Class tau.widget.wearable exists');
	equal(typeof tau.widget.wearable.Drawer, 'function', 'Class tau.widget.wearable.Drawer exists');
	widget = new tau.widget.wearable.Drawer();

	equal(typeof widget.configure, 'function', 'Method Drawer.configure exists');
	equal(typeof widget.build, 'function', 'Method Drawer.build exists');
	equal(typeof widget.init, 'function', 'Method Drawer.init exists');
	equal(typeof widget.bindEvents, 'function', 'Method Drawer.bindEvents exists');
	equal(typeof widget.destroy, 'function', 'Method Drawer.destroy exists');
	equal(typeof widget.disable, 'function', 'Method Drawer.disable exists');
	equal(typeof widget.enable, 'function', 'Method Drawer.enable exists');
	equal(typeof widget.refresh, 'function', 'Method Drawer.refresh exists');
	equal(typeof widget.option, 'function', 'Method Drawer.option exists');

	equal(typeof widget._checkSideEdge, 'function', 'Method Drawer._checkSideEdge exists');
	equal(typeof widget._translate, 'function', 'Method Drawer._translate exists');
	equal(typeof widget._setActive, 'function', 'Method Drawer._setActive exists');
	equal(typeof widget.transition, 'function', 'Method Drawer.transition exists');
	equal(typeof widget.setDragHandler, 'function', 'Method Drawer.setDragHandler exists');
	equal(typeof widget.open, 'function', 'Method Drawer.open exists');
	equal(typeof widget.close, 'function', 'Method Drawer.close exists');
	equal(typeof widget.getState, 'function', 'Method Drawer.getState exists');
});