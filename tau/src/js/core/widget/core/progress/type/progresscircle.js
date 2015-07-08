/*global window, define, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * #progressCircle Type
 * progressCircle type support for Progress widget.
 * @class ns.widget.core.progress.type.progresscircle
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
			"../../../../../core/util/object",
			"../../../../../core/util/DOM"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				doms = ns.util.DOM,
				type = ns.widget.core.progress.type,
				typeInterface = type.interface,
				classes = {
					uiProgressCircle: "ui-progress-circle",
					uiProgressCircleBg: "ui-progress-circle-bg",
					uiProgressCircleValue: "ui-progress-circle-value",
					uiProgressCircleValueLeft: "ui-progress-circle-value-left",
					uiProgressCircleValueRight: "ui-progress-circle-value-right",
					uiProgressCircleHalf: "ui-progress-circle-half"
				};

			/* make widget refresh with new value */
			function paintProgressCircle (self) {
				var options = self.options,
					percentValue = (options.value * 100) / (options.max - options.min),
					rotateValue,
					ui = self._ui;

				if (percentValue >= 50) {
					ui.progressValue.classList.add(classes.uiProgressCircleHalf);
				} else {
					ui.progressValue.classList.remove(classes.uiProgressCircleHalf);
				}

				rotateValue = 360 * (percentValue/100);

				ui.progressValueLeft.style.webkitTransform = "rotate(" + rotateValue + "deg)";
			}

			function setProgressBarSize (self) {
				var progressSize = self.options.size,
					sizeToNumber = parseFloat(progressSize),
					ui = self._ui;

				if (!isNaN(sizeToNumber)) {
					ui.progressContainer.style.fontSize = progressSize + "px";
					ui.progressContainer.style.width = progressSize + "px";
					ui.progressContainer.style.height = progressSize + "px";
				} else {
					switch(progressSize) {
						case "full":
						case "large":
						case "medium":
						case "small":
							ui.progressContainer.classList.add("ui-progress-circle-" + progressSize);
							break;
					}
					ui.progressContainer.style.fontSize = doms.getCSSProperty(ui.progressContainer, "width", 0, "float") + "px";
				}
			}

			function resetDOM (ui) {
				ui.progressValue.classList.remove(classes.uiProgressbarHalf);
				ui.progressValueLeft.style.webkitTransform = "";
			}

			type.circle = utilsObject.merge({}, typeInterface, {
				build: function(progress, element) {
					var ui = {},
						progressElement = element,
						progresscircleBg, progresscircleValue, progresscircleValueLeft, progresscircleValueRight;

					ui.progressContainer = progressElement;
					ui.progressValueBg = progresscircleBg = document.createElement("div");
					ui.progressValue = progresscircleValue = document.createElement("div");
					ui.progressValueLeft = progresscircleValueLeft = document.createElement("div");
					ui.progressValueRight = progresscircleValueRight = document.createElement("div");

					// set classNames of progresscircle DOMs.
					progressElement.className = classes.uiProgressCircle;
					progresscircleBg.className = classes.uiProgressCircleBg;
					progresscircleValue.className = classes.uiProgressCircleValue;
					progresscircleValueLeft.className = classes.uiProgressCircleValueLeft;
					progresscircleValueRight.className = classes.uiProgressCircleValueRight;

					progresscircleValue.appendChild(progresscircleValueLeft);
					progresscircleValue.appendChild(progresscircleValueRight);
					progressElement.appendChild(progresscircleValue);
					progressElement.appendChild(progresscircleBg);

					progress._ui = ui;
					return element;
				},

				init: function (progress, element) {
					var ui = progress._ui;

					ui.progressContainer = ui.progressContainer || element;
					ui.progressValueBg = ui.progressValueBg || element.querySelector("." + classes.uiProgressCircleBg);
					ui.progressValue = ui.progressValue || element.querySelector("." + classes.uiProgressCircleValue);
					ui.progressValueLeft = ui.progressValueLeft || element.querySelector("." + classes.uiProgressCircleValueLeft);
					ui.progressValueRight = ui.progressValueRight || element.querySelector("." + classes.uiProgressCircleValueRight);

					setProgressBarSize(progress);
					paintProgressCircle(progress);
				},

				refresh: function (progress) {
					resetDOM(progress._ui);
					setProgressBarSize(progress);
					paintProgressCircle(progress);
				},

				changeValue: function (progress) {
					paintProgressCircle(progress);
				}
			});

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
