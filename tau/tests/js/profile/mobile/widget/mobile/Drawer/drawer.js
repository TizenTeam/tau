$().ready(function() {
	module("drawer", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test ( "Drawer" , function () {
		var drawerLeft = document.getElementById("drawer-left"),
			drawerRight = document.getElementById("drawer-right"),
			drawerLeftPosition = drawerLeft.getAttribute("data-position"),
			drawerRightPosition = drawerRight.getAttribute("data-position"),
			leftWidget = ej.engine.instanceWidget(drawerLeft, "Drawer"),
			rightWidget = ej.engine.instanceWidget(drawerRight, "Drawer");

		ok(drawerLeft.classList.contains("ui-drawer"), 'Drawer has ui-drawer class');
		ok(drawerLeft.classList.contains("ui-drawer-" + drawerLeftPosition), "Drawer has ui-drawer-" + drawerLeftPosition + " class");
		equal(typeof leftWidget.options.swipeStartAreaRatio, "number", "Property Drawer.options.swipeStartAreaRatio exists");
		equal(typeof leftWidget._onSwipe, "function", "Method Drawer.onSwipe exists");

		// test swipe event handler of drawer
		leftWidget._swiped = true;
		$("#drawer-left").trigger("swiperight");
		ok(drawerLeft.classList.contains("ui-drawer-open"), "Drawer can be opened by swipe");

		ok(drawerRight.classList.contains("ui-drawer"), 'Drawer has ui-drawer class');
		ok(drawerRight.classList.contains("ui-drawer-" + drawerRightPosition), "Drawer has ui-drawer-" + drawerRightPosition + " class");
		equal(typeof rightWidget.options.swipeStartAreaRatio, "number", "Property Drawer.options.swipeStartAreaRatio exists");
		equal(typeof rightWidget._onSwipe, "function", "Method Drawer.onSwipe exists");

		// test swipe event handler of drawer
		rightWidget._swiped = true;
		$("#drawer-right").trigger("swipeleft");
		ok(drawerRight.classList.contains("ui-drawer-open"), "Drawer can be opened by swipe");
	});
});
