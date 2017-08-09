/*global window, define*/
/*jslint nomen: true */

(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/widget/BaseWidget",
			"../wearable"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget(),

				WIDGET_CLASS = "ui-date-picker",

				WIDGET_SELECTOR = "." + WIDGET_CLASS;

			function DatePicker() {
			}

			prototype._build = function (element) {
				return element;
			};

			DatePicker.prototype = prototype;
			DatePicker.prototype.constructor = DatePicker;

			ns.widget.wearable.DatePicker = DatePicker;

			ns.engine.defineWidget(
				"DatePicker",
				WIDGET_SELECTOR,
				[],
				DatePicker,
				""
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return DatePicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, window.tau));
