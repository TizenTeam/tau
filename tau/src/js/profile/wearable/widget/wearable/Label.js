/*global window, define */
/*jslint nomen: true */
/**
 * @class ns.widget.wearable.Label
 */
/** !!DRAFT!! **/
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Label = function () {
					this.options = {};
					this.options.value = "";
				};

			Label.prototype = new BaseWidget();

			Label.classes = {
				uiLabel: 'ui-label'
			};

			Label.prototype._build = function (element) {
				return element;
			};

			Label.prototype._setValue = function (value) {
				this.options.value = value;
				this.element.setAttribute("data-value", value);
				this.element.innerHTML = value;
			};

			Label.prototype._getValue = function () {
				return this.options.value;
			};

			ns.widget.wearable.Label = Label;
			engine.defineWidget(
				"Label",
				"[data-role=label]",
				[],
				Label
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.Label;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
