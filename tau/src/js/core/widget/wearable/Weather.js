/*global window, define */
/*jslint nomen: true, plusplus: true */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../wearable",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Weather = function () {
					this.options = {};
					this.options.value = "none";
				};

			Weather.prototype = new BaseWidget();

			Weather.classes = {
				uiWeather: 'ui-weather',
				iconPrefix: 'ui-weather-icon-'
			};

			Weather.prototype._build = function (element) {
				var cls = element.classList,
					classes = Weather.classes;

				cls.add(classes.uiWeather);

				return element;
			};

			Weather.prototype._setValue = function (value) {
				var element = this.element,
					iconPrefix = Weather.classes.iconPrefix,
					iconPrefixRe = new RegExp(iconPrefix, 'i'),
					cls = element.classList,
					i = cls.length;
				element.setAttribute("data-value", value);

				// clear old
				while (--i >= 0) {
					if (cls.item(i).match(iconPrefixRe)) {
						cls.remove(cls.item(i));
					}
				}

				cls.add(iconPrefix + value);
			};

			Weather.prototype._getValue = function () {
				return this.element.getAttribute("data-value");
			};

			engine.defineWidget(
				"Weather",
				"[data-role=weather]",
				[],
				Weather
			);
			ns.widget.wearable.Weather = Weather;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.Weather;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
