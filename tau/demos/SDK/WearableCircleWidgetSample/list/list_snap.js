(function() {
	var page = document.getElementById("snaplistTest"),
		snapList = document.getElementById("snapList"),
		snapListWidget,
		marqueeDOMs,
		selectedMarqueeWidget = null, i;

	function touchStartHandler() {
		if (selectedMarqueeWidget) {
			selectedMarqueeWidget.reset();
		}
	};

	function selectedHandler(e) {
		selectedMarqueeWidget = tau.widget.Marquee(e.target.querySelector(".ui-marquee"));
		selectedMarqueeWidget.start();
	};

	function makeMarquees() {
		marqueeDOMs = document.getElementsByClassName("ui-marquee");
		for (i=0; i < marqueeDOMs.length; i++) {
			tau.widget.Marquee(marqueeDOMs[i], {delay: 0, autoRun: false});
		}
	};

	function destroyMarquees() {
		for (i=0; i < marqueeDOMs.length; i++) {
			tau.widget.Marquee(marqueeDOMs[i]).destroy();
		}
	};

	page.addEventListener( "pageshow", function() {
		makeMarquees();
		snapListWidget = new tau.widget.SnapListview(snapList);
		document.addEventListener("touchstart", touchStartHandler);
		document.addEventListener("selected", selectedHandler);
	});

	page.addEventListener( "pagehide", function() {
		destroyMarquees();
		snapListWidget.destroy();
		document.removeEventListener("touchstart", touchStartHandler);
		document.removeEventListener("selected", selectedHandler);
	});
}());
