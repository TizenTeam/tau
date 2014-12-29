(function() {
	var page = document.getElementById("snaplistTest"),
		snapList = document.getElementById("snapList"),
		snapListWidget;
	
	function scrollEndHandler () {
		console.log("scroll end");
	};

	page.addEventListener( "pageshow", function() {
		snapListWidget = new tau.widget.SnapListview(snapList);
		document.addEventListener("scrollend", scrollEndHandler);
	});

	page.addEventListener( "pagehide", function() {
		snapListWidget.destroy();
		document.removeEventListener("scrollend", scrollEndHandler);
	});
}());
