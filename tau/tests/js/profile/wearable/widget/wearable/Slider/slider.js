/* global module, test, ok, equal, tau */
module("Slider tests (circular)", {
	setup: function () {
		tau.support.shape.circle = true;
	},
	teardown: function () {
		tau.engine._clearBindings();
		tau.support.shape.circle = false;
	}
});

test("simple Slider test", 3, function () {
	var progressBar = document.getElementById("slider"),
		sliderWidget = new tau.widget.Slider(progressBar),
		sliderContainer = progressBar.previousElementSibling;

	ok(sliderContainer.classList.contains("ui-progressbar"), "container of Slider has ui-progressbar classname");
	equal(sliderWidget.option("size"), "full", "Default size of Slider is full");
	equal(sliderWidget.value(), progressBar.getAttribute("value"), "Value of Slider is equal with percent value from defined values");

	sliderWidget.destroy();

});

test("Slider with options", 2, function () {
	var progressBar = document.getElementById("slider"),
		progressBarWidget = new tau.widget.Slider(progressBar, {thickness: 30, size: "full", containerClassName: "ui-test-class"}),
		progressContainer = progressBar.previousElementSibling;

	equal(progressBarWidget.option("size"), "full", "Progress Size is defined full");
	ok(progressContainer.classList.contains("ui-test-class"), "Custom classname of container is defined");

	progressBarWidget.destroy();
});

test("value method of Slider", 5, function () {
	var progressBar = document.getElementById("slider"),
		slider = new tau.widget.Slider(progressBar, {size: "full"});

	equal(slider.value(), 50, "progress value check");
	slider.value(50);
	equal(slider.value(), 50, "progress value check");
	slider.value(100);
	equal(slider.value(), 100, "progress value check");
	slider.value(150);
	equal(slider.value(), 100, "progress value(with over-value) check");
	slider.value(-20);
	equal(slider.value(), 0, "progress value(with over-value) check");
	slider.destroy();
});
