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
		drawerSectionChanger = document.getElementById("drawerSectionChanger"),
		drawerElement = page.querySelector("#rightDrawer"),
		selectCount,
		drawerHelper,
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
		},
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
		document.removeEventListener('tizenhwkey', fnBackKey);
		modeHide();
	}, false);

	page.addEventListener( "pagebeforeshow", function() {
		tau.widget.SectionChanger(drawerSectionChanger, {
			circular: false,
			orientation: "horizontal",
			useBouncingEffect: false
		});

		/********** drawer ******************/
		drawerHelper = tau.helper.DrawerMoreStyle.create(drawerElement, {
			handler: ".drawer-handler"
		});

		document.addEventListener('tizenhwkey', fnBackKey);

		/**********  pageIndicator **********/
		pageIndicator =  tau.widget.PageIndicator(elPageIndicator, { numberOfPages: 3 });
		pageIndicator.setActive(0);

		drawerSectionChanger.addEventListener("sectionchange", function(e){
			pageIndicator.setActive(e.detail.active);
		}, false);
	});
}());