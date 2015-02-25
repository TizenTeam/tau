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
		handlers = [].slice.call(document.getElementsByClassName("drawer-handler")),
		drawerSectionChanger = document.getElementById("drawerSectionChanger"),
		drawerElements = [],
		handler = document.getElementById("handler"),
		selectCount,
		i,
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
		},
		fnSelectAll = function(){
			for (i = 0; i < listLength; i++) {
				list[i].classList.add("select");
			}
			selectCount = listLength;
			modeShow();
		},
		fnDeselectAll = function(){
			for (i = 0; i < listLength; i++) {
				list[i].classList.remove("select");
			}
			modeHide();
		},
		fnPopup = function() {
			selectWrapper.classList.add("open");
			event.preventDefault();
			event.stopPropagation();
		},
		fnPopupClose = function() {
			selectWrapper.classList.remove("open");
		}

	function modeShow() {
		selectWrapper.classList.remove("open");
		handler.style.display = "block";
		selectWrapper.classList.add("show-btn");
		textRefresh();
	}
	function textRefresh() {
		selectBtnText.innerHTML =
			selectCount < 10 ? "0" + selectCount : selectCount;
	}
	function modeHide() {
		selectWrapper.classList.remove("open");
		handler.style.display = "none";
		selectWrapper.classList.remove("show-btn");
		selectCount = 0;
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
		modeHide();
	}, false);

	document.addEventListener( 'tizenhwkey', function( ev ) {
		if( ev.keyName === "back" ) {
			if (selectWrapper.classList.contains("open")) {
				selectWrapper.classList.remove("open");
				ev.preventDefault();
				ev.stopPropagation();
			} else if (selectWrapper.classList.contains("show-btn")) {
				fnDeselectAll();
				ev.preventDefault();
				ev.stopPropagation();
			}
		}
	} );

/***************************** drawer **********************************/
	page.addEventListener( "pagebeforeshow", function() {
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

		/**********  pageIndicator **********/
		pageIndicator =  tau.widget.PageIndicator(elPageIndicator, { numberOfPages: 3 });
		pageIndicator.setActive(0);

		drawerSectionChanger.addEventListener("sectionchange", function(e){
			pageIndicator.setActive(e.detail.active);
		}, false);
	});
}());