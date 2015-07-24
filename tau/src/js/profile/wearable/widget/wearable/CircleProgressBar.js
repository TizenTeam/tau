/*global window, ns, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true */
/**
 * # Circle Progress Widget
 * Shows a control that indicates the progress percentage of an on-going operation by circular shape.
 *
 * The circle progress widget shows a control that indicates the progress percentage of an on-going operation. This widget can be scaled to be fit inside a parent container.
 *
 * ### Simple progress bar
 * If you don't make any widget "circleprogress" with <progress> element, you can show default progress style.
 * To add a circular shape(page size) progressbar in your application, you have to declare <progress> tag in "ui-page" element.
 * To add a CircleProgressBar widget to the application, use the following code:
 *
 *      @example
 *	<div class="ui-page" id="pageCircleProgressBar">
 *	    <header class="ui-header"></header>
 *	    <div class="ui-content"></div>
 *          <progress class="ui-circle-progress" id="circleprogress" max="20" value="2"></progress>
 *	</div>
 *	<script>
 *		(function(){
 *
 *		    var page = document.getElementById( "pageCircleProgressBar" ),
 *		        progressBar = document.getElementById("circleprogress"),
 *		        progressBarWidget;
 *
 *		    page.addEventListener( "pageshow", function() {
 *		        var i=0;
 *		        // make Circle Progressbar object
 *		        progressBarWidget = new tau.widget.CircleProgressBar(progressBar);
 *
 *	            });
 *
 *	            page.addEventListener( "pagehide", function() {
 *		        // release object
 *		        progressBarWidget.destroy();
 *		    });
 *              }());
 *	</script>
 *
 *
 * @class ns.widget.wearable.CircleProgressBar
 * @since 2.3
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/DOM",
			"../../../../core/widget/BaseWidget",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilEvent = ns.event,
				doms = ns.util.DOM,

				eventType = {
					/**
					 * Triggered when the section is changed.
					 * @event progresschange
					 * @member ns.widget.wearable.CircleProgressBar
					 */
					CHANGE: "progresschange"
				},

				CircleProgressBar = function () {
					var self = this,
						ui = {};

					ui.progressContainer = null;
					ui.progressValue = null;
					ui.progressValueLeft = null;
					ui.progressValueRight = null;
					ui.progressValueBg = null;

					self.options = {};
					self._ui = ui;

					self._maxValue = null;
					self._value = null;

				},

				prototype = new BaseWidget(),

				CLASSES_PREFIX = "ui-progressbar",

				classes = {
					uiProgressbar: CLASSES_PREFIX,
					uiProgressbarBg: CLASSES_PREFIX + "-bg",
					uiProgressbarValue: CLASSES_PREFIX + "-value",
					uiProgressbarValueLeft: CLASSES_PREFIX + "-value-left",
					uiProgressbarValueRight: CLASSES_PREFIX + "-value-right",
					uiProgressbarHalf: CLASSES_PREFIX + "-half"
				},

				selectors = {
					progressContainer: "." + classes.uiProgressbar,
					progressBg: "." + classes.uiProgressbarBg,
					progressValue: "." + classes.uiProgressbarValue,
					progressValueLeft: "." + classes.uiProgressbarValueLeft,
					progressValueRight: "." + classes.uiProgressbarValueRight
				},

				size = {
					FULL: "full",
					LARGE: "large",
					MEDIUM: "medium",
					SMALL: "small"
				};

			CircleProgressBar.classes = classes;

			/* make widget refresh with new value */
			function refreshProgressBar (self, value) {
				var percentValue = value / self._maxValue * 100,
					rotateValue,
					ui = self._ui;

				if (percentValue >= 50) {
					ui.progressValue.classList.add(classes.uiProgressbarHalf);
				} else {
					ui.progressValue.classList.remove(classes.uiProgressbarHalf);
				}

				rotateValue = 360 * (percentValue/100);
				ui.progressValueLeft.style.webkitTransform = "rotate(" + rotateValue + "deg)";
			}

			function setThicknessStyle (self, value) {
				var ui = self._ui;

				ui.progressValueLeft.style.borderWidth = value +"px";
				ui.progressValueRight.style.borderWidth = value +"px";
				ui.progressValueBg.style.borderWidth = value +"px";
			}

			function setProgressBarSize (self, progressSize) {
				var sizeToNumber = parseFloat(progressSize),
					ui = self._ui;

				if (!isNaN(sizeToNumber)) {
					ui.progressContainer.style.fontSize = progressSize + "px";
					ui.progressContainer.style.width = progressSize + "px";
					ui.progressContainer.style.height = progressSize + "px";
				} else {
					switch(progressSize) {
						case size.FULL:
						case size.LARGE:
						case size.MEDIUM:
						case size.SMALL:
							ui.progressContainer.classList.add(CLASSES_PREFIX + "-" + progressSize);
							break;
					}
					ui.progressContainer.style.fontSize = doms.getCSSProperty(ui.progressContainer, "width", 0, "float") + "px";
				}
			}

			function checkOptions (self, option) {
				if (option.thickness) {
					setThicknessStyle(self, option.thickness);
				}

				if (option.size) {
					setProgressBarSize(self, option.size);
				}

				if (option.containerClassName) {
					self._ui.progressContainer.classList.add(option.containerClassName);
				}
			}

			prototype._configure = function () {
				/**
				 * Options for widget
				 * @property {Object} options Options for widget
				 * @property {number} [options.thickness=null] Sets the border width of CircleProgressBar.
				 * @property {number|"full"|"large"|"medium"|"small"} [options.size="full"] Sets the size of CircleProgressBar.
				 * @property {string} [options.containerClassName=null] Sets the class name of CircleProgressBar container.
				 * @member ns.widget.wearable.CircleProgressBar
				 */
				this.options = {
					thickness: null,
					size: size.MEDIUM,
					containerClassName: null
				};
			};
			/**
			 * Build CircleProgressBar
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.CircleProgressBar
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					progressElement = element,
					progressbarContainer, progressbarBg, progressbarValue, progressbarValueLeft, progressbarValueRight;

				ui.progressContainer = progressbarContainer = document.createElement("div"),
				ui.progressValueBg = progressbarBg = document.createElement("div"),
				ui.progressValue = progressbarValue = document.createElement("div"),
				ui.progressValueLeft = progressbarValueLeft = document.createElement("div"),
				ui.progressValueRight = progressbarValueRight = document.createElement("div");

				// set classNames of progressbar DOMs.
				progressbarContainer.className = classes.uiProgressbar;
				progressbarBg.className = classes.uiProgressbarBg;
				progressbarValue.className = classes.uiProgressbarValue;
				progressbarValueLeft.className = classes.uiProgressbarValueLeft;
				progressbarValueRight.className = classes.uiProgressbarValueRight;

				// set id for progress container using "container" prefix
				progressbarContainer.id = progressElement.id? progressElement.id + "-container" : "";

				progressbarValue.appendChild(progressbarValueLeft);
				progressbarValue.appendChild(progressbarValueRight);
				progressbarContainer.appendChild(progressbarValue);
				progressbarContainer.appendChild(progressbarBg);
				progressElement.parentNode.appendChild(progressbarContainer);
				progressElement.parentNode.insertBefore(progressElement, progressbarContainer);

				return element;
			};
			/**
			 * Init CircleProgressBar
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.CircleProgressBar
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					progressElement = element,
					elementParent = element.parentNode,
					options = self.options;

				ui.progressContainer = ui.progressContainer || elementParent.querySelector(selectors.progressContainer);
				ui.progressValueBg = ui.progressValueBg || elementParent.querySelector(selectors.progressValueBg);
				ui.progressValue = ui.progressValue || elementParent.querySelector(selectors.progressValue);
				ui.progressValueLeft = ui.progressValueLeft || elementParent.querySelector(selectors.progressValueLeft);
				ui.progressValueRight = ui.progressValueRight || elementParent.querySelector(selectors.progressValueRight);

				self._maxValue = doms.getNumberFromAttribute(progressElement, "max", null, 100);

				// max value must be positive number bigger than 0
				if (self._maxValue <= 0) {
					ns.error("max value of progress must be positive number that bigger than zero!");
					self._maxValue = 100;
				}

				self._value = doms.getNumberFromAttribute(progressElement, "value", null, 50);

				checkOptions(self, options);
				refreshProgressBar(self, self._value);

				return element;
			};

			/**
			 * Get or Set value of the widget
			 *
			 * Return element value or set the value
			 *
			 *		@example
			 * 		<progress class="ui-circle-progress" id="circleprogress" max="20" value="2"></progress>
			 *		<script>
			 *			var progressbar = document.getElementById("circleprogress"),
							progressbarWidget = tau.widget.CircleProgressBar(progressbar),
			 *			// return value in progress tag
			 * 			value = progressbarWidget.value();
			 *			// sets the value for the progress
			 *			progressbarWidget.value("15");
			 *		</script>
			 * @method value
			 * return {string} In get mode return element value
			 * @since 2.3
			 * @member ns.widget.wearable.CircleProgressBar
			 */

			/**
			 * Get value of Circle Progressbar
			 * @method _getValue
			 * @protected
			 * @memeber ns.widget.wearable.CircleProgressBar
			 */
			prototype._getValue = function () {
				return this.element.getAttribute("value");
			};
			/**
			 * Set value of Circle Progressbar
			 * @method _setValue
			 * @param {string} value
			 * @protected
			 * @member ns.widget.wearable.CircleProgressBar
			 */
			prototype._setValue = function (inputValue) {
				var self = this,
					value,
					selfElementValue;

				if (inputValue > self._maxValue) {
					value = self._maxValue;
 				} else if (inputValue < 0) {
					value = 0;
				} else if (isNaN(inputValue)) {
					value = 0;
				} else {
					value = inputValue;
				}

				doms.setAttribute(self.element, "value", value);

				if (self._value !== value) {
					self._value = value;
					utilEvent.trigger(self.element, eventType.CHANGE);
					refreshProgressBar(self, value);
				}
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.CircleProgressBar
			 */
			prototype._refresh = function () {
				var self = this;

				self._reset();
				checkOptions(self, self.options);
				refreshProgressBar(self, self._getValue());
				return null;
			};

			/**
			 * Reset style of Value elements
			 * @method _reset
			 * @protected
			 * @member ns.widget.wearable.CircleProgressBar
			 */
			prototype._reset = function () {
				var self = this,
					ui = self._ui;

				ui.progressValue.classList.remove(classes.uiProgressbarHalf);
				ui.progressValueLeft.style.webkitTransform = "";
				if (self.options.thickness) {
					ui.progressValueLeft.style.borderWidth = "";
					ui.progressValueRight.style.borderWidth = "";
					ui.progressValueBg.style.borderWidth = "";
				}
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.CircleProgressBar
			 */
			prototype._destroy = function () {
				var self = this;

				self._reset();

				// remove doms
				self.element.parentNode.removeChild(self._ui.progressContainer);

				// clear variables
				self.element = null;
				self._ui = null;
				self._maxValue = null;
				self._value = null;

				return null;
			};

			CircleProgressBar.prototype = prototype;
			ns.widget.wearable.CircleProgressBar = CircleProgressBar;

			engine.defineWidget(
				"CircleProgressBar",
				".ui-circle-progress",
				[],
				CircleProgressBar,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return CircleProgressBar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
