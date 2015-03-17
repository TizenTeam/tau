(function() {
	var page = document.getElementById("navigation-bar"),
		navigation = document.getElementById("navigation"),
		addBtn = document.getElementById("addBtn"),
		naviWidget;

	function push() {
		naviWidget.push("test");
	}

	page.addEventListener("pageshow", function() {
		naviWidget = new tau.widget.Navigation(navigation);
		naviWidget.push("test");

		addBtn.addEventListener("click", push);
	});

	page.addEventListener("pagehide", function(){
		naviWidget.destroy();
	});
})();
