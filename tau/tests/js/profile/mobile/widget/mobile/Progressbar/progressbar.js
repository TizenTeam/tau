/*
 * Unit Test: Progressbar
 *
 * Kamil Stepczuk <k.stepczuk@samsung.com>
 */

module("profile/mobile/widget/mobile/Progressbar");

/**
 * Unit test widget api
 * @param widget
 */
var apiProgressBar = function (widget) {
	var getWidth = function (widget) {
		return ej.engine.instanceWidget(widget).value();
		},
		i,
		value;
	ok(widget.classList.contains("ui-progressbar"), "API: Create");
	for (i = 5; i--;) {
		value = Math.floor(Math.random() * 100);
		equal(ej.engine.instanceWidget(widget).value(value), true, "API: set value " + value);
		equal(getWidth(widget), value, "API: get value " + value);
	}
};

/**
 * Unit test Aria
 * @param widget
 */
var ariaProgressBar = function (widget) {
	ej.engine.instanceWidget(widget).value(22);
	equal(widget.getAttribute("aria-valuenow"), 22, "ARIA: aria-valuenow");
	equal(widget.getAttribute("aria-valuemax"), 100, "ARIA: aria-valuemax");
	equal(widget.getAttribute("aria-valuemin"), 0, "ARIA: aria-valuemin");
	equal(widget.getAttribute("role"), "ProgressBar", "ARIA: role");

};

/**
 * Unit test events
 * @param widget
 */
var eventsProgressBar = function (widget) {
	var change = false,
		complete = false;

	widget.addEventListener("change", function () {
		change = true;
	});
	widget.addEventListener("complete", function () {
		complete = true;
	});
	ej.engine.instanceWidget(widget).value(100);

	ok(change, "Event change called");
	ok(complete, "Event complete called");

};

/**
 * Unit test css
 * @param widget
 */
var cssProgressBar = function (widget) {
	var cssClass = {
		uiProgressbar: "ui-progressbar",
		uiProgressbarBg: "ui-progressbar-bg",
		uiProgressbarValue: "ui-progressbar-value"
	};
	ok(widget.classList.contains(cssClass.uiProgressbar), "CSS " + cssClass.uiProgressbar + " added");
	ok(widget.firstChild.classList.contains(cssClass.uiProgressbarBg), "CSS " + cssClass.uiProgressbar + " added");
	ok(widget.firstChild.firstChild.classList.contains(cssClass.uiProgressbarValue), "CSS " + cssClass.uiProgressbar + " added");

};


var element = document.getElementById("progressbar");
test("API", function () {
	ej.engine.instanceWidget(element, 'ProgressBar');
	apiProgressBar(element);
});

test("Events", function () {
	ej.engine.instanceWidget(element, 'ProgressBar');

	eventsProgressBar(element);
});

test("Aria", function () {
	ej.engine.instanceWidget(element, 'ProgressBar');
	ariaProgressBar(element);
});

test("CSS", function () {
	ej.engine.instanceWidget(element, 'ProgressBar');
	cssProgressBar(element);
});