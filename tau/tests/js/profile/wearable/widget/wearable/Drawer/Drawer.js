test ( "Drawer" , function () {
	var handlers = [].slice.call(document.getElementsByClassName("drawer-handler"));


	handlers.forEach(function (handler) {
		var drawerElement = document.querySelector(handler.getAttribute("href")),
			drawer = tau.widget.Drawer(drawerElement),
			handlerData = tau.util.DOM.getData(handler),
			drawerData = tau.util.DOM.getData(drawerElement),
			hrefValue = handler.getAttribute("href");
		drawer.setDragHandler(handler);
		function checkState(state){
			equal(drawer.getState(), state, "Drawer operated to state");
			if (state === "opened") {
				drawer.close();
			}
		}
		ok(handler.getAttribute("href"), 'Drawer handler had "href" attribute');
		equal(typeof handlerData, "object", "Drawer handler had data-* attribute");
		if (handlerData.rel) {
			equal(handlerData.rel, "drawer", "Drawer handler had the 'rel' value");
			// Drawer was opened by handler click event.
			tau.event.trigger(document.querySelector(hrefValue),"click");
			setTimeout(checkState.bind(null, "opened"), 200);
		}

		equal(typeof drawerData, "object", "Drawer had data-* attribute");
		if (drawerData["drawer-target"]) {
			equal(document.querySelector(drawerData["drawer-target"]), drawerElement.parentNode, "Drawer appended to target Element");
		}
		if (drawerData.position) {
			if (drawerData.position === "right") {
				ok(drawerElement.classList.contains("ui-drawer-right"), "Drawer was set to position by data-position attribute");
				tau.event.trigger(document.querySelector(hrefValue), "swipe", {direction:"left"});
				setTimeout(checkState.bind(null, "opened"), 200);
			} else {
				ok(drawerElement.classList.contains("ui-drawer-left"), "Drawer was set to position by data-position attribute");
				tau.event.trigger(document.querySelector(hrefValue), "swipe", {direction:"right"});
				setTimeout(checkState.bind(null, "opened"), 200);
			}
		}
		if (drawerData.enable) {
			ok(drawerData.enable, "Drawer was set enable");
		}
		if (drawerData["drag-edge"]) {
			ok(parseInt(drawerData["drag-edge"]) <= 1 && parseInt(drawerData["drag-edge"]) > 0, "Drawer edge was set correctly");
		}
	});

});
