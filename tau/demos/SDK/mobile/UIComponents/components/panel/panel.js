(function() {
	var page = document.querySelector("#panelPage"),
		panelChanger = page.querySelector("#panelChanger"),
		panelChangerComponent,
		navigation = page.querySelector("#navigation"),
		navigationComponent,
		navigated = false;

	page.addEventListener("pagebeforeshow", function(){
		var activePanel = page.querySelector(".ui-panel-active");
		panelChangerComponent = tau.widget.PanelChanger(panelChanger);
		navigationComponent = tau.widget.Navigation(navigation);
		navigationComponent.push(activePanel.id);
	});
	panelChanger.addEventListener("panelchange", function(event) {
		var toPanel = event.detail.toPanel,
			direction = event.detail.direction,
			id = toPanel.id;

		if (id) {
			if (direction === "forward") {
				navigationComponent.push(id);
			} else {
				if (navigated === false) {
					navigationComponent.pop();
				} else {
					navigated = false;
				}
			}
		} else {
			console.warn("You should insert id value in the each panels")
		}
	});
	navigation.addEventListener("navigate", function(event) {
		var id = event.detail.id;
		navigated = true;
		panelChangerComponent.changePanel("#" + id, "slide-reverse", "back");
	});
})();