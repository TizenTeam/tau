(function (window, ej){
	"use strict";
	ej.test = {};
	ej.test.widget1 = (function () {
		var testWidget = function () {},
			Widget = ej.widget.BaseWidget,
			engine = ej.engine;

		engine.defineWidget(
			"Test1",
			"div.test-widget",
			[
				"apiCall",
				"getInstance",
				"getElement",
				"getId"
			],
			testWidget
	);

		testWidget.prototype = new Widget();

		testWidget.prototype._build = function (element) {
			return element;
		};
		testWidget.prototype._init = function (element) {};
		testWidget.prototype._bindEvents = function (element) {};
		testWidget.prototype._destroy = function () {};
		testWidget.prototype.apiCall = function (a) {
			return a+a;
		};
		testWidget.prototype.getInstance = function () {
			return this;
		};
		testWidget.prototype.getElement = function () {
			return this.element;
		};
		testWidget.prototype.getId = function () {
			return this.id;
		};
		testWidget.prototype._veryPrivateMethod = function () {};

		return testWidget;
	}());
}(window, window.ej));