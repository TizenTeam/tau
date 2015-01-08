(function(){
	var handlers = [].slice.call(document.getElementsByClassName("drawer-handler")),
			page = document.getElementById("drawerPage"),
			sectionChanger = document.getElementById("sectionChanger"),
			drawerSectionChanger = document.getElementById("drawerSectionChanger"),
			drawerElements = [],
			rightClose = document.getElementById("rightClose"),
			leftClose = document.getElementById("leftClose");

	page.addEventListener( "pagebeforeshow", function() {
		tau.widget.SectionChanger(sectionChanger, {
			circular: false,
			orientation: "horizontal",
			useBouncingEffect: false
		});
		tau.widget.SectionChanger(drawerSectionChanger, {
			circular: false,
			orientation: "horizontal",
			useBouncingEffect: false
		});

		handlers.forEach(function(handler) {
			var drawerElement = document.querySelector(handler.getAttribute("href")),
					drawer = tau.widget.Drawer(drawerElement);
			drawer.setDragHandler(handler);
			tau.event.on(handler, "touchstart touchend", function(e){
				if(drawer.getState().search(/settling/) === 0) {
					return;
				}
				switch (e.type) {
					case "touchstart":
						// open drawer
						drawer.transition(60);
						e.preventDefault();
						e.stopPropagation();
						break;
					case "touchend":
						drawer.close();
						break;
				}
			}, false);
			drawerElements.push(drawer);
		});
		if (leftClose) {
			leftClose.addEventListener("click",function() {
				var drawerElement = tau.util.selectors.getClosestByClass(this, "ui-drawer"),
						drawer = tau.widget.Drawer(drawerElement);
				drawer.close();
			});
		}
		if (rightClose) {
			rightClose.addEventListener("click",function() {
				var drawerElement = tau.util.selectors.getClosestByClass(this, "ui-drawer"),
						drawer = tau.widget.Drawer(drawerElement);
				drawer.close();
			});
		}

	});
})();


