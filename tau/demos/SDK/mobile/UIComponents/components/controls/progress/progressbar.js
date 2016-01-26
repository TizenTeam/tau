(function(tau){
	var page = document.getElementById("progressbar-demo"),
		progressBar = document.getElementById("progressbar"),
		progressBar2 = document.getElementById("progressbar2"),
		progressBar3 = document.getElementById("progressbar3"),
		progressBarWidget,
		progressBarWidget2,
		progressBarWidget3,
		pageBeforeShowHandler;

	pageBeforeShowHandler = function () {
		progressBarWidget = new tau.widget.Progress(progressBar);
		progressBarWidget2 = new tau.widget.Progress(progressBar2);
		progressBarWidget3 = new tau.widget.Progress(progressBar3);

		setTimeout(function() {
			progressBarWidget.value(100);
		}, 1000);
		setTimeout(function() {
			progressBarWidget2.value(50);
			progressBarWidget3.value(70);
		}, 2000);
		setTimeout(function() {
			progressBarWidget2.value(70);
			progressBarWidget3.value(30);
		}, 300);
		setTimeout(function() {
			progressBarWidget2.value(100);
			progressBarWidget3.value(100);
		}, 4000);
	};

	page.addEventListener("pagebeforeshow", pageBeforeShowHandler);
}(window.tau));
