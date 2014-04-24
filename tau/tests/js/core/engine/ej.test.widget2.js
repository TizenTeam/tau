(function (window, ej) {
	"use strict";
	ej.test.widget2 = (function (){
		var parentWidget = ej.test.widget1,
			parentPrototype = parentWidget.prototype,
			testWidget = function () {};

		testWidget.prototype = new ej.test.widget1();

		testWidget.prototype._build = function (element) {
			parentPrototype._build.apply(this, arguments);
			element.classList.add("test-class-build2");
			return element;
		};

		testWidget.prototype._destroy = function (element) {
			parentPrototype._destroy.apply(this, arguments);

			element = element || this.element;
			element.classList.remove("test-class-build2");
		};

		testWidget.prototype.apiCall = function (a) {
			return a+a+a;
		};

		ej.engine.defineWidget(
			"Test2",
			"div.test-widget-by-definition2",
			[],
			testWidget
		);

		return testWidget;
	}());
}(window, window.ej));
