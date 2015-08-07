(function(){
	var page = document.getElementById("progressbar-demo"),
		progressBar = document.getElementById("progressbar"),
		progressBar2 = document.getElementById("progressbar2"),
		progressBar3 = document.getElementById("progressbar3"),
		progressBarWidget,
		progressBarWidget2,
		progressBarWidget3,
		pageShowHandler,
		pageHideHandler,
		timeout1,
		timeout2,
		timeout3,
		timeout4;

	pageShowHandler = function () {
		progressBarWidget = new tau.widget.Progress(progressBar);
		progressBarWidget2 = new tau.widget.Progress(progressBar2);
		progressBarWidget3 = new tau.widget.Progress(progressBar3);

		timeout1 = setTimeout(function() {
			progressBarWidget.value(100);
		}, 1000);

		timeout2 = setTimeout(function() {
			progressBarWidget2.value(50);
			progressBarWidget3.value(70);
		}, 2000);

		timeout3 = setTimeout(function() {
			progressBarWidget2.value(70);
			progressBarWidget3.value(30);
		}, 300);

		timeout4 = setTimeout(function() {
			progressBarWidget2.value(100);
			progressBarWidget3.value(100);
		}, 4000);
	};

	pageHideHandler = function () {
		clearTimeout(timeout1);
		clearTimeout(timeout2);
		clearTimeout(timeout3);
		clearTimeout(timeout4);
	}

	page.addEventListener("pageshow", pageShowHandler, false);
	page.addEventListener("pagehide", pageHideHandler, false);
}());
