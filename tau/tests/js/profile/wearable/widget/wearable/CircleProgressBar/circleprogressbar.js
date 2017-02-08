/* global module, test, ok, equal, tau */
module("CircleProgressBar tests", {
	teardown: function () {
		tau.engine._clearBindings();
	}
});

test("simple CircleProgressbar test", 3, function () {
	var progressBar = document.getElementById("circleprogress"),
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar),
		progressContainer = progressBar.previousElementSibling;

	ok(progressContainer.classList.contains("ui-progressbar"), "container of CircleProgressBar has ui-progressbar classname");
	equal(progressBarWidget.option("size"), "medium", "Default size of CircleProgressBar is medium");
	equal(progressBarWidget.value(), progressBar.getAttribute("value") / progressBar.getAttribute("max") * 100, "Value of CircleProgressBar is equal with percent value from defined values")

	progressBarWidget.destroy();
});

test("CircleProgressbar with options", 2, function () {
	var progressBar = document.getElementById("circleprogress"),
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {thickness: 30, size: "full", containerClassName: "ui-test-class"}),
		progressContainer = progressBar.previousElementSibling;

	equal(progressBarWidget.option("size"), "full", "Progress Size is defined full");
	ok(progressContainer.classList.contains("ui-test-class"), "Custom classname of container is defined");

	progressBarWidget.destroy();
});

test("value method of CircleProgressbar", 5, function () {
	var progressBar = document.getElementById("circleprogress"),
		progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "full"});

	equal(progressBarWidget.value(), 20, "progress value check");
	progressBarWidget.value(50);
	equal(progressBarWidget.value(), 50, "progress value check");
	progressBarWidget.value(100);
	equal(progressBarWidget.value(), 100, "progress value check");
	progressBarWidget.value(150);
	equal(progressBarWidget.value(), 100, "progress value(with over-value) check");
	progressBarWidget.value(-20);
	equal(progressBarWidget.value(), 0, "progress value(with over-value) check");
	progressBarWidget.destroy();
});
