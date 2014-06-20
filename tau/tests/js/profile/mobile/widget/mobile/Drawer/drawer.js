$().ready(function() {
	module("drawer", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test ( "Drawer" , function () {
		var drawer = document.getElementById("drawer"),
			drawerPosition = drawer.getAttribute("data-position");

		ok(drawer.classList.contains("ui-drawer"), 'Drawer has ui-drawer class');
		ok(drawer.classList.contains("ui-drawer-" + drawerPosition), "Drawer has ui-drawer-" + drawerPosition + " class");
	});
});
