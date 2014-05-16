(function (window, ej) {
	"use strict";
	ej.test = ej.test || {};
	ej.test.widget3 = (function (){
		var testWidget = function () {};

		ej.engine.defineWidget(
			"Test12",
			"[data-role='test-1'],[data-role='test-2']",
			[],
			testWidget
		);

		ej.engine.defineWidget(
			"Test3",
			"[data-role='test-3']",
			[],
			testWidget
		);

		testWidget.prototype = new ej.widget.BaseWidget();

		testWidget.prototype._build = function (element) {

			element.setAttribute("data-built", "true");
			element.classList.add("test-class-build");
			return element;
		};
		testWidget.prototype._init = function (element) {
			var child = document.createElement("span");
			child.classList.add("test-child");
			element.classList.add("test-class-init");
			element.appendChild(child);
		};
		testWidget.prototype._bindEvents = function (element) {
			element.addEventListener("test-event", function (evt) {
				var data = evt.detail.testData;
				ej.event.trigger(element, "test-event-bounce", {"testData": data*data});
			}, false);
		};
		testWidget.prototype._destroy = function (element) {
			element = element || this.element;
			element.classList.remove("test-class-build");
		};
		testWidget.prototype.apiCall = function (a) {
			return a+a;
		};

		return testWidget;
	}());
}(window, window.ej));