/*global tau */
(function(){
	var page = document.querySelector("#bottomButtonWithMorePage"),
		drawer = page.querySelector("#moreoptionsDrawer"),
		selector = page.querySelector("#selector"),
		selectorComponent;

	page.addEventListener( "pagebeforeshow", function() {
		if (tau.support.shape.circle) {
			tau.engine.instanceWidget(drawer, "DrawerMoreStyle", {handler: ".drawer-handler"});
			selectorComponent = tau.widget.Selector(selector);
			selectorComponent.disable();
		}
	});

	page.addEventListener( "pagebehide", function() {
		if (tau.support.shape.circle) {

		}
	});

	drawer.addEventListener("draweropen", function() {
		selectorComponent.enable();
	});

	drawer.addEventListener("drawerclose", function() {
		selectorComponent.disable();
	});

	/*
	 * When user click the indicator of Selector, drawer will close.
	 */
	selector.addEventListener("click", function(event) {
		var target = event.target,
			drawerComponent = tau.widget.Drawer(drawer);

		if (tau.support.shape.circle) {
			// 'ui-selector-indicator' is default indicator class name of Selector component
			if (target.classList.contains("ui-selector-indicator")) {
				drawerComponent.close();
			}
		}
	});
}());
