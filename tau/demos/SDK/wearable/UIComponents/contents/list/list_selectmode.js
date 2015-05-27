/*global tau */
/*jslint unparam: true */
(function() {
	var page = document.getElementById("selectModePage"),
		listview = document.querySelector('#selectModePage .ui-listview'),
		list = listview.getElementsByTagName("li"),
		listLength = list.length,
		selectWrapper = document.querySelector(".select-mode"),
		selectBtn = document.getElementById("select-btn"),
		selectBtnText =  document.getElementById("select-btn-text"),
		selectAll = document.getElementById("select-all"),
		deselectAll = document.getElementById("deselect-all"),
		elPageIndicator = document.getElementById("pageIndicator"),
		pageIndicator,
		drawerViewSwitcher = page.querySelector("#drawerViewSwitcher"),
		views = page.querySelectorAll(".ui-view"),
		drawerElement = page.querySelector("#rightDrawer"),
		handler = document.getElementById("handler"),
		viewSwitcherComponent,
		rotaryHandlerBound,
		selectCount,
		drawerHelper,
		i,
		addFunction,
		fnSelectAll,
		fnDeselectAll,
		fnPopup,
		fnPopupClose,
		fnBackKey;

	function textRefresh() {
		selectBtnText.innerHTML =
			selectCount < 10 ? "0" + selectCount : selectCount;
	}

	function modeShow() {
		selectWrapper.classList.remove("open");
		handler.style.display = "block";
		selectWrapper.classList.add("show-btn");
		textRefresh();
	}

	function modeHide() {
		selectWrapper.classList.remove("open");
		handler.style.display = "none";
		selectWrapper.classList.remove("show-btn");
		selectCount = 0;
	}

	addFunction = function(event){
		var target = event.target;
		if ( !target.classList.contains("select")) {
			target.classList.add("select");
			selectCount++;
			modeShow();
		} else {
			target.classList.remove("select");
			selectCount--;
			if (selectCount <= 0) {
				modeHide();
			} else {
				textRefresh();
			}
		}
	};

	fnSelectAll = function(){
		for (i = 0; i < listLength; i++) {
			list[i].classList.add("select");
		}
		selectCount = listLength;
		modeShow();
	};

	fnDeselectAll = function(){
		for (i = 0; i < listLength; i++) {
			list[i].classList.remove("select");
		}
		modeHide();
	};

	fnPopup = function() {
		selectWrapper.classList.add("open");
		event.preventDefault();
		event.stopPropagation();
	};

	fnPopupClose = function() {
		selectWrapper.classList.remove("open");
	};

	fnBackKey = function() {
		var drawer = tau.widget.Drawer(drawerElement),
			classList = selectWrapper.classList;
		if( event.keyName === "back" && drawer.getState() === "closed" && classList.contains("show-btn")) {
			if (classList.contains("open")) {
				classList.remove("open");
			} else {
				fnDeselectAll();
			}
			event.preventDefault();
			event.stopPropagation();
		}
	};

	function rotaryHandler(event) {
		var direction = event.detail.direction,
			activeIndex = viewSwitcherComponent.getActiveIndex();

		if (tau.widget.Drawer(drawerElement).getState() === "opened") {
			event.stopPropagation();
			if(direction === "CW") {
				// right
				if (activeIndex < views.length - 1) {
					viewSwitcherComponent.setActiveIndex(activeIndex + 1);
				}
			} else {
				// left
				if (activeIndex > 0) {
					viewSwitcherComponent.setActiveIndex(activeIndex - 1);
				}
			}
		}
	}

	page.addEventListener("pageshow", function(ev) {
		listview.addEventListener('click', addFunction, false);
		selectAll.addEventListener("click", fnSelectAll, false);
		deselectAll.addEventListener("click", fnDeselectAll, false);
		selectBtn.addEventListener("click", fnPopup, false);
		selectWrapper.addEventListener("click", fnPopupClose, false);
		modeHide();
	}, false);

	page.addEventListener("pagehide", function(ev) {
		listview.removeEventListener('click', addFunction, false);
		selectAll.removeEventListener("click", fnSelectAll, false);
		deselectAll.removeEventListener("click", fnDeselectAll, false);
		document.removeEventListener('tizenhwkey', fnBackKey);
		document.removeEventListener("rotarydetent", rotaryHandlerBound);
		modeHide();
		drawerHelper.destroy();
	}, false);

	page.addEventListener( "pagebeforeshow", function() {
		/**********  pageIndicator **********/
		pageIndicator =  tau.widget.PageIndicator(elPageIndicator, { numberOfPages: 3 });
		pageIndicator.setActive(0);

		viewSwitcherComponent = tau.widget.ViewSwitcher(drawerViewSwitcher);

		/********** drawer ******************/
		drawerHelper = tau.helper.DrawerMoreStyle.create(drawerElement, {
			handler: ".drawer-handler"
		});
		document.addEventListener('tizenhwkey', fnBackKey);
		rotaryHandlerBound = rotaryHandler.bind(this);
		document.addEventListener("rotarydetent", rotaryHandlerBound);
		drawerViewSwitcher.addEventListener("viewchange", function(event) {
			var index = event.detail.index;
			if (index < 0 || index > views.length - 1) {
				return;
			}
			pageIndicator.setActive(event.detail.index);
		}, false);
	});
}());