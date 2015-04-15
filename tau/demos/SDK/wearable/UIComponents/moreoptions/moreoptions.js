(function(){
	var page = document.querySelector("#moreoptionsPage"),
		popup = page.querySelector("#moreoptionsPopup"),
		drawer = page.querySelector("#moreoptionsDrawer"),
		handler = page.querySelector(".ui-more"),
		elPageIndicator = page.querySelector("#pageIndicator"),
		views = page.querySelectorAll(".ui-view"),
		viewSwitcherElement = page.querySelector("#viewSwitcher"),
		viewSwitcher,
		rotaryHandlerBound;

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
	page.addEventListener( "pagebeforeshow", function() {
		var popupWidget,
			pageIndicator = tau.widget.PageIndicator(elPageIndicator, { numberOfPages: 5 });

		pageIndicator.setActive(1);

		if (tau.support.shape.circle) {
			tau.helper.DrawerMoreStyle.create(drawer, {
				handler: ".ui-more"
			});
			viewSwitcher = tau.widget.ViewSwitcher(viewSwitcherElement);
			rotaryHandlerBound = rotaryHandler.bind(this);
			document.addEventListener("rotarydetent", rotaryHandlerBound);
		} else {
			// Shape is square
			popupWidget = tau.widget.Popup(popup);
			tau.event.on(handler, "click", function(e){
				popupWidget.open();
			}, false);
		}

		viewSwitcherElement.addEventListener("viewchange", function(event) {
			var index = event.detail.index;
			if (index < 0 || index > views.length - 1) {
				return;
			}
			pageIndicator.setActive(event.detail.index);
		}, false);
	});
	page.addEventListener( "pagebeforehide", function() {
		document.removeEventListener("rotarydetent", rotaryHandlerBound);
	});
})();