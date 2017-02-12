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
 * # Circle ProgressBar
 * Shows a control that indicates the progress percentage of an on-going operation by circular shape.
 *
 * ##How to Create CircleProgressBar
 *
 * ###Default CircleProgressBar
 *
 * If you don't make any "circleprogress" with *progress* element, you can show default progress style.
 * To add a CircleProgressBar component to the application, use the following code:
 *
 *      @example
 *      <div class="ui-page" id="pageCircleProgressBar">
 *        <div>
 *          <progress class="ui-circle-progress" id="circleprogress" max="20" value="2"></progress>
 *        </div>
 *      </div>
 *      <script>
 *        (function(){
 *
 *          var page = document.getElementById( "pageCircleProgressBar" ),
 *              progressBar = document.getElementById("circleprogress"),
 *              progressBarWidget;
 *
 *          page.addEventListener( "pageshow", function() {
 *             // make Circle Progressbar object
 *             progressBarWidget = new tau.widget.CircleProgressBar(progressBar);
 *
 *          });
 *
 *          page.addEventListener( "pagehide", function() {
 *             // release object
 *             progressBarWidget.destroy();
 *          });
 *        }());
 *      </script>
 *
 * ###Full(screen) size CircleProgressBar
 *
 * To add a circular shape progressbar in your application, you have to declare _<progress>_ tag with attribute
 * data-size="full" in "ui-page" element and in your javascript code add constructor of widget.
 *
 *      @example
 *      <div class="ui-page" id="pageCircleProgressBar">
 *        <div>
 *          <progress class="ui-circle-progress" id="circleprogress" max="20" value="2" data-size="full"></progress>
 *        </div>
 *      </div>
 *      <script>
 *        (function(){
 *          var page = document.getElementById("pageCircleProgressBar"),
 *              progressBar = document.getElementById("circleprogress"),
 *              progressBarWidget = null;
 *
 *          page.addEventListener("pageshow", function() {
 *            // make Circle Progressbar object
 *            progressBarWidget = new tau.widget.CircleProgressBar(progressBar);
 *          });
 *
 *          page.addEventListener("pagehide", function() {
 *            // release object
 *            progressBarWidget.destroy();
 *          });
 *        }());
 *      </script>
 *
 * You can also set options full directly from JavaScript:
 *
 *      @example
 *      <div class="ui-page" id="pageCircleProgressBar">
 *        <div>
 *          <progress class="ui-circle-progress" id="circleprogress" max="20" value="2"></progress>
 *        </div>
 *      </div>
 *      <script>
 *        (function(){
 *          var page = document.getElementById("pageCircleProgressBar"),
 *              progressBar = document.getElementById("circleprogress"),
 *              progressBarWidget = null;
 *
 *          page.addEventListener("pageshow", function() {
 *            // make Circle Progressbar object
 *            progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {
 *              size: "full"
 *            });
 *          });
 *
 *          page.addEventListener("pagehide", function() {
 *            // release object
 *            progressBarWidget.destroy();
 *          });
 *        }());
 *      </script>
 *
 * ###Using event
 *
 * Circle progress bar triggers "progresschange" event. The description is <a href="#events-list">here</a>.
 * The following shows how to use "progresschange" event.
 *
 *      @example
 *      progressBar.addEventListener("progresschange", function() {
 *        // do something when the value of progress changes
 *        console.log(progressBarWidget.value());
 *      });
 *
 * ### Customization
 *
 * This widget has few possibility of customization.
 *
 * First is set size of widget by option size. You can set one of predefined string value or number size.
 *
 * Second option gives possibility of set thickness of circle line.
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
			"../../../../core/util/DOM",
			"../../../../core/widget/BaseWidget",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilDOM = ns.util.DOM,
				PI = Math.PI,

				eventType = {
					/**
					 * Triggered when value is changed.
					 * @event progresschange
					 * @member ns.widget.wearable.CircleProgressBar
					 */
					CHANGE: "progresschange"
				},

				CircleProgressBar = function () {
					var self = this,
						ui = {};

					ui.progressContainer = null;

					self._ui = ui;

					self._maxValue = null;
					self._minValue = null;
					self._value = null;

				},

				prototype = new BaseWidget(),

				CLASSES_PREFIX = "ui-progressbar",

				classes = {
					uiProgressbar: CLASSES_PREFIX,
					uiProgressbarFull: CLASSES_PREFIX + "-full"
				},

				selectors = {
					progressContainer: "." + classes.uiProgressbar
				},

				size = {
					FULL: "full",
					LARGE: "large",
					MEDIUM: "medium",
					SMALL: "small"
				};

			CircleProgressBar.classes = classes;

			/**
			 * Build structure of circle progress bar
			 * @param {ns.widget.wearable.CircleProgressBar} self
			 * @param {number} value
			 */
			function refreshProgressBar(self, value) {
				var percentValue = (value - self._minValue) / (self._maxValue - self._minValue) * 100,
					ui = self._ui,
					size = self._size,
					thickness = self.options.thickness,
					canvasContext = ui.canvasContext;

				// draw background circle
				drawBackground(canvasContext, size, thickness);

				if (percentValue === 100) {
					// in case of 100% we have to change start angle
					drawLine(canvasContext,
						0,
						2 * PI,
						size,
						thickness
					);
				} else if (percentValue > 0) {
					// if percent is different 0 then we draw arc
					drawLine(canvasContext,
						1.5 * PI,
						2 * PI * (percentValue / 100) - 0.5 * PI,
						size,
						thickness
					);
				}
			}

			/**
			 * Calculate size of progressbar
			 * @param {ns.widget.wearable.CircleProgressBar} self
			 * @param {string} progressSize
			 */
			function setProgressBarSize(self, progressSize) {
				var sizeToNumber = parseFloat(progressSize),
					innerWidth = window.innerWidth,
					ui = self._ui,
					style = ui.progressContainer.style,
					containerClassList = ui.progressContainer.classList,
					canvas = ui.canvas,
					numberSize = 0;

				// clear additional classes
				containerClassList.remove(classes.uiProgressbarFull);

				if (!isNaN(sizeToNumber)) {
					numberSize = sizeToNumber / 2;
				} else {
					switch (progressSize) {
						case size.FULL:
							numberSize = innerWidth / 2;
							containerClassList.add(classes.uiProgressbarFull);
							break;
						case size.LARGE:
							numberSize = 0.15625 * innerWidth;
							break;
						case size.MEDIUM:
							numberSize = 0.13125 * innerWidth;
							break;
						case size.SMALL:
							numberSize = 0.0875 * innerWidth;
							break;
					}
				}
				numberSize = Math.floor(numberSize);
				self._size = numberSize;
				style.width = (2 * numberSize) + "px";
				style.height = (2 * numberSize) + "px";
				canvas.width = (2 * numberSize);
				canvas.height = (2 * numberSize);
			}

			/**
			 * Check options and convert to correct format
			 * @param {ns.widget.wearable.CircleProgressBar} self
			 * @param {Object} options
			 */
			function checkOptions(self, options) {
				if (options.size) {
					setProgressBarSize(self, options.size);
				}

				if (options.containerClassName) {
					self._ui.progressContainer.classList.add(options.containerClassName);
				}
			}

			/**
			 * Calculate min, max and value
			 * @param {ns.widget.wearable.CircleProgressBar} self
			 */
			function prepareValues(self) {
				var element = self.element,
					value = 0;

				self._maxValue = utilDOM.getNumberFromAttribute(element, "max", null, 100);
				self._minValue = utilDOM.getNumberFromAttribute(element, "min", null, 0);

				// max value must be positive number bigger than 0
				if (self._maxValue <= self._minValue) {
					ns.error("max value of progress must be positive number that bigger than zero!");
					self._maxValue = 100;
				}

				value = utilDOM.getNumberFromAttribute(element, "value", null, (self._maxValue + self._minValue) / 2);
				if (value > self._maxValue) {
					value = self._maxValue;
				} else if (value < self._minValue) {
					value = self._minValue;
				}
				self._value = value;
				utilDOM.setAttribute(element, "value", value);
			}

			prototype._configure = function () {
				/**
				 * Options for widget
				 * @property {Object} options Options for widget
				 * @property {number} [options.thickness=8] Sets the border width of CircleProgressBar.
				 * @property {number|"full"|"large"|"medium"|"small"|null} [options.size="full"] Sets the size of CircleProgressBar.
				 * @property {?string} [options.containerClassName=null] Sets the class name of CircleProgressBar container.
				 * @member ns.widget.wearable.CircleProgressBar
				 */
				this.options = {
					thickness: 8,
					size: size.MEDIUM,
					containerClassName: null
				};
			};

			/**
			 * Draw background line
			 * @param {RenderingContext} canvasContext
			 * @param {number} size Radius of arc
			 * @param {number} thickness Thickness of line in pixels
			 */
			function drawBackground(canvasContext, size, thickness) {
				canvasContext.clearRect(0, 0, 2 * size, 2 * size);
				canvasContext.strokeStyle = "rgba(71,71,71,1)";
				canvasContext.lineWidth = thickness;
				canvasContext.beginPath();
				canvasContext.arc(size, size, size - thickness / 2, 0, 2 * PI);
				canvasContext.closePath();
				canvasContext.stroke();
			}

			/**
			 * Draw foreground line
			 * @param {RenderingContext} canvasContext
			 * @param {number} from starting angle
			 * @param {number} to ending angle
			 * @param {number} size Radius of arc
			 * @param {number} thickness Thickness of line in pixels
			 */
			function drawLine(canvasContext, from, to, size, thickness) {
				canvasContext.strokeStyle = "rgba(55,161,237,1)";
				canvasContext.lineWidth = thickness;
				canvasContext.beginPath();
				canvasContext.arc(size, size, size - thickness / 2, from, to);
				canvasContext.stroke();
			}

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
					progressbarContainer = document.createElement("div"),
					canvas = document.createElement("canvas"),
					canvasContext = canvas.getContext("2d");

				ui.progressContainer = progressbarContainer;

				ui.canvasContext = canvasContext;
				ui.canvas = canvas;

				// set classNames of progressbar DOMs.
				progressbarContainer.className = classes.uiProgressbar;

				// set id for progress container using "container" prefix
				progressbarContainer.id = progressElement.id ? progressElement.id + "-container" : "";

				progressElement.parentNode.insertBefore(progressbarContainer, progressElement);

				progressbarContainer.appendChild(canvas);

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
					elementParent = element.parentNode,
					options = self.options;

				ui.progressContainer = ui.progressContainer || elementParent.querySelector(selectors.progressContainer);

				prepareValues(self);
				checkOptions(self, options);
				refreshProgressBar(self, self._value);

				return element;
			};

			/**
			 * Get or Set value of the widget
			 *
			 * Return element value or set the value.
			 *
			 * If maethod is called without argument then work as getter. If you add one argument then this argument is set
			 * as value of widget.
			 *
			 *        @example
			 *        <progress class="ui-circle-progress" id="circleprogress" max="20" value="2"></progress>
			 *        <script>
			 *            var progressbar = document.getElementById("circleprogress"),
			 *                progressbarWidget = tau.widget.CircleProgressBar(progressbar),
			 *
			 *            // return value in progress tag
			 *            value = progressbarWidget.value();
			 *
			 *            // sets the value for the progress
			 *            progressbarWidget.value(15);
			 *        </script>
			 * @method value
			 * @param {string|number|null} value New value to set
			 * @return {string} In get mode return element value
			 * @since 2.3
			 * @member ns.widget.wearable.CircleProgressBar
			 */

			/**
			 * Get value of Circle Progressbar
			 * @method _getValue
			 * @protected
			 * @return {number}
			 * @member ns.widget.wearable.CircleProgressBar
			 */
			prototype._getValue = function () {
				return parseInt(this.element.getAttribute("value"), 10);
			};

			/**
			 * Set value of Circle Progressbar
			 * @method _setValue
			 * @param {string} inputValue
			 * @protected
			 * @member ns.widget.wearable.CircleProgressBar
			 */
			prototype._setValue = function (inputValue) {
				var self = this,
					value;

				if (inputValue > self._maxValue) {
					value = self._maxValue;
				} else if (inputValue < self._minValue) {
					value = self._minValue;
				} else if (isNaN(inputValue)) {
					value = self._minValue;
				} else {
					value = inputValue;
				}

				utilDOM.setAttribute(self.element, "value", value);

				if (self._value !== value) {
					self._value = value;
					self.trigger(eventType.CHANGE);
				}

				refreshProgressBar(self, value);
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.CircleProgressBar
			 */
			prototype._refresh = function () {
				var self = this;

				prepareValues(self);
				checkOptions(self, self.options);
				refreshProgressBar(self, self._value);
				return null;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.CircleProgressBar
			 */
			prototype._destroy = function () {
				var self = this;

				// remove utilDOM
				self.element.parentNode.removeChild(self._ui.progressContainer);

				// clear variables
				self.element = null;
				self._ui = null;
				self._maxValue = null;
				self._minValue = null;
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
