/*global window, define, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #activityBar Type
 * activityBar type support for Progress widget.
 * @class ns.widget.core.progress.type.activitybar
 * @extends ns.widget.core.progress.type.interface
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../type",
			"./interface",
			"../Progress",
			"../../../../../core/util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				type = ns.widget.core.progress.type,
				typeInterface = type.interface,
				classes = {
					uiActivitybar: "ui-activity-bar",
					uiActivitybarActivity: "ui-activity-bar-activity"
				};

			function paintProgressStyle (progress) {
				var ui = progress._ui,
					options = progress.options,
					percentValue = (options.value * 100) / (options.max - options.min);

				ui.activityBarElement.style.width = percentValue + "%";
			}

			type.activitybar = utilsObject.merge({}, typeInterface, {
				build: function (progress, element) {
					var ui = {},
						activityElement = element,
						activityBarElement;

					activityBarElement = document.createElement("div");

					activityElement.classList.add(classes.uiActivitybar);
					activityBarElement.classList.add(classes.uiActivitybarActivity);

					activityElement.appendChild(activityBarElement);

					ui.activityBarElement = activityBarElement;

					progress._ui = ui;

					return activityElement;
				},

				init: function (progress, element) {
					var ui = progress._ui,
						activityElement = element;

					ui.activityBarElement = ui.activityBarElement || activityElement.querySelector("." + classes.uiActivitybarActivity);

					paintProgressStyle(progress);
				},

				refresh: function (progress) {
					paintProgressStyle(progress);
				},

				changeValue: function (progress) {
					paintProgressStyle(progress);
				}
			});

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
