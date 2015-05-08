/*global tau */
/*jslint unparam: true */
(function(){
	var page = document.querySelector("#moreoptionsPage"),
		popup = page.querySelector("#moreoptionsPopup"),
		drawer = page.querySelector("#moreoptionsDrawer"),
		handler = page.querySelector(".ui-more"),
		elPageIndicator = page.querySelector("#pageIndicator"),
		views = page.querySelectorAll(".ui-view"),
		viewSwitcherElement = page.querySelector("#viewSwitcher"),
		drawerMore,
		viewSwitcher,
		rotaryHandlerBound,
		clickHandlerBound;

	function rotaryHandler(event) {
		var direction = event.detail.direction,
			activeIndex = viewSwitcher.getActiveIndex();

		event.stopPropagation();
		if(direction === "CW") {
			// right
			if (activeIndex < views.length - 1) {
				viewSwitcher.setActiveIndex(activeIndex + 1);
			}
		} else {
			// left
			if (activeIndex > 0) {
				viewSwitcher.setActiveIndex(activeIndex - 1);
			}
		}
	}
	function clickHandler(event) {
		tau.openPopup(popup);
	}
	page.addEventListener( "pagebeforeshow", function() {
		var pageIndicator = tau.widget.PageIndicator(elPageIndicator, { numberOfPages: views.length });

		if (tau.support.shape.circle) {
			drawerMore = tau.helper.DrawerMoreStyle.create(drawer, {
				handler: ".ui-more"
			});
			viewSwitcher = tau.widget.ViewSwitcher(viewSwitcherElement);
			pageIndicator.setActive(viewSwitcher.getActiveIndex());
			rotaryHandlerBound = rotaryHandler.bind(this);
			document.addEventListener("rotarydetent", rotaryHandlerBound);
		} else {
			// Shape is square
			clickHandlerBound = clickHandler.bind(null);
			handler.addEventListener("click", clickHandlerBound);
		}

		viewSwitcherElement.addEventListener("viewchange", function(event) {
			var index = event.detail.index;
			if (index < 0 || index > views.length - 1) {
				return;
			}
			pageIndicator.setActive(index);
		}, false);
	});
	page.addEventListener( "pagebeforehide", function() {
		if (tau.support.shape.circle) {
			document.removeEventListener("rotarydetent", rotaryHandlerBound);
			handler.removeEventListener("click", clickHandlerBound);
			viewSwitcher.destroy();
			drawerMore.destroy();
		}
	});
}());
