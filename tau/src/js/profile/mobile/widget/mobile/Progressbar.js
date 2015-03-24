/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */

/**
 * #Progress Bar Widget
 * The progress bar widget shows a control that indicates the progress
 * percentage of an on-going operation.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - HTML elements with data-role equal "progressbar"
 *  - HTML elements with class ui-progressbar
 *
 * ###HTML Examples
 *
 * ####Create simple text input on INPUT element
 *
 *		@example
 *		<div id="progress-bar" data-role="progressbar"></div>
 *
 * ## Manual constructor
 * For manual creation of button widget you can use constructor of widget from
 * **tau** namespace:
 *
 *		@example
 *		<div id="progress-bar"></div>
 *		<script>
 *			var element = document.getElementById("progress-bar"),
 *				progressBar = tau.widget.ProgressBar(element);
 *		</script>
 *
 * Constructor has one required parameter **element** which is base
 * **HTMLElement** to create widget. We recommend fetching this element by
 * method *document.getElementById*. Second parameter is **options** and it is a
 * object with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<div id="progress-bar"></div>
 *		<script>
 *			$("#progress-bar").progressbar();
 *		</script>
 *
 * jQuery Mobile constructor has one optional parameter **options** and it is
 * a object with options for widget.
 *
 * ##Options for widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<script>
 *			var element = document.getElementById("probress-bar"),
 *				progressBar = tau.widget.ProgressBar(element);
 *
 *			progressBar.methodName(argument1, argument2, ...);
 *		</script>
 *
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		$(".selector").progressbar("methodName", argument1, argument2, ...);
 *
 * @extends ns.widget.BaseWidget
 * @class ns.widget.mobile.ProgressBar
 */

(function (document, ns) {
	"use strict";

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);


	define(
		[
			"../../../../core/engine",
			"../mobile",
			"./BaseWidgetMobile",
			"../../../../core/event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				events = ns.event,
				engine = ns.engine,
				prototype = new BaseWidget(),

				ProgressBar = function () {
					var self = this;

					self._ui = {
						progressBarBgElement: null,
						progressBarValueElement: null,
						progressBarValueBackElement: null,
						styleSheetElement: null
					};
					self._min = null;
					self._oldValue = null;
					self._state = states.CHANGING;
				},

				states = {
					CHANGING: "changing",
					COMPLETE: "complete"
				},

				CLASSES_PREFIX = "ui-progressbar",
				/**
				 * Dictionary for progress related css class names
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.mobile.ProgressBar
				 * @readonly
				 */
				classes = {
					uiProgressbar: CLASSES_PREFIX,
					uiProgressbarBg: CLASSES_PREFIX + "-bg",
					uiProgressbarValue: CLASSES_PREFIX + "-value",
					uiProgressbarValueFront: CLASSES_PREFIX + "-value-front",
					uiProgressbarValueBack: CLASSES_PREFIX + "-value-back",
					uiProgressbarActivity: CLASSES_PREFIX + "-activity"
				},

				selector = {
					progressbarBg : "." + CLASSES_PREFIX + "-bg",
					progressbarValue: "." + CLASSES_PREFIX + "-value",
					progressbarValueBack: "." + CLASSES_PREFIX + "-value-back",
					uiProgressbarActivity: "." + CLASSES_PREFIX + "-activity"
				},

				valueAnimation = {
					keyFrameName: "progressFront",
					duration: 1350
				},

				eventType = {
					/**
					 * Event is triggered when value of widget is changing.
					 * @event change
					 * @member ns.widget.mobile.ProgressBar
					 */
					CHANGE: "change",
				};

			ProgressBar.prototype = prototype;
			ProgressBar.classes = classes;

			prototype._configure = function () {
				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {number} [options.value=0] value of progress bar
				 * @property {number} [options.min=0] minimal value of progress bar
				 * @property {number} [options.max=100] maximal value of progress bar
				 * @property {"activitybar"|"progressbar"} [options.type="progressbar"] type of progress bar
				 * @member ns.widget.mobile.ProgressBar
				 */
				this.options = {
					value: 0,
					max: 100,
					min: 0,
					type: "progressbar"
				};
			};

			function progressEndHandler(self) {
				self.element.classList.add("ui-progress-complete");
			}

			function setAnimationKeyframe(self) {
				var customKeyFrame,
					styleElement = document.createElement("style"),
					remainWidth = self._ui.progressBarBgElement.offsetHeight,
					progressBarValueBackOffsetWidth = self._ui.progressBarValueBackElement.offsetWidth,
					progressBarValueFrontLeft = progressBarValueBackOffsetWidth - remainWidth;


				customKeyFrame = "@-webkit-keyframes test2 {"
				+ "0% { width: 100%; left: 0; }"
				+ "100% { width: " + remainWidth +"px; left: " + progressBarValueFrontLeft + "px;} }";

				if (customKeyFrame) {
					self.element.appendChild(styleElement);
					styleElement.sheet.insertRule(customKeyFrame, 0);

					self._ui.styleSheelElement = styleElement;
				}
			}

			function setAnimationStyle(self, options) {
				var progressBarValueElement = self._ui.progressBarValueElement,
					progressBarValueBackElement = self._ui.progressBarValueBackElement,
					progressBarValueElementStyle = progressBarValueElement.style,
					progressBarValueBackElementStyle = progressBarValueBackElement.style;

				progressBarValueElement.classList.add("ui-progressbar-value-front-anim");

				progressBarValueElementStyle.width = (options.value / options.max * 100) + "%";
				progressBarValueBackElementStyle.width = (options.value / options.max * 100) + "%";
				setAnimationKeyframe(self);

				progressBarValueBackElementStyle.webkitTransition = "width 800ms ease-out"
			}
			/**
			 * Build structure of ProgressBar
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.ProgressBar
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					progressBarBgElement,
					progressBarValueElement,
					progressBarValueBackElement = null;

				progressBarBgElement = document.createElement("div");
				progressBarValueElement = document.createElement("div");

				element.classList.add(classes.uiProgressbar);
				progressBarBgElement.classList.add(classes.uiProgressbarBg);
				progressBarValueElement.classList.add(classes.uiProgressbarValue);

				if (options.type === "activitybar") {
					progressBarValueElement.classList.add(classes.uiProgressbarActivity);
				} else if (options.type === "progressbar") {
					progressBarValueElement.classList.add(classes.uiProgressbarValueFront);

					progressBarValueBackElement = document.createElement("div");
					progressBarValueBackElement.classList.add(classes.uiProgressbarValueBack);
				}

				progressBarBgElement.appendChild(progressBarValueElement);
				element.appendChild(progressBarBgElement);

				ui.progressBarBgElement = progressBarBgElement;
				ui.progressBarValueElement = progressBarValueElement;
				ui.progressBarValueBackElement = progressBarValueBackElement;

				return element;
			};

			/**
			 * Init progress widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.ProgressBar
			 */
			prototype._init = function (element) {
				var self = this,
					options = self.options,
					ui = self._ui;

				ui.progressBarBgElement = ui.progressBarBgElement || element.querySelector(selector.uiProgressbarBg);
				ui.progressBarValueElement = ui.progressBarValueElement || element.querySelector(selector.uiProgressbarValue) || element.querySelector(selector.uiProgressbarActivity);
				ui.progressBarValueBackElement = ui.progressBarValueBackElement || element.querySelector(selector.uiProgressbarValueBack);

				ui.progressBarValueElement.style.width = options.value + "%";

				if (ui.progressBarValueBackElement) {
					ui.progressBarBgElement.appendChild(ui.progressBarValueBackElement);
				}

				self._oldValue = options.value;

				if (options.type === "progressbar") {
					element.setAttribute("role", "ProgressBar");
					element.setAttribute("aria-valuemin", options.min);
					element.setAttribute("aria-valuenow", options.value);
					element.setAttribute("aria-valuemax", options.max);

					setAnimationStyle(self, self.options);
					self._ui.progressBarValueElement.classList.remove("ui-progressbar-value-front-anim");
				}

				return element;
			};

			/**
			 * Get or set value
			 *
			 * Return inner text of button or set text on button
			 *
			 *	@example
			 *	<div id="progress-bar"></div>
			 *	<script>
			 *		var element = document.getElementById("progress-bar"),
			 *			progressBarWidget = tau.widget.ProgressBar(element),
			 *			// returns current value
			 *			value = progressBarWidget.value();
			 *
			 *		progressBarWidget.value( 30 ); // sets new value to 30
			 *	</script>
			 *
			 *	@example
			 *	<div id="progress-bar"></div>
			 *	<script>
			 *		// returns current value
			 *		$( "#progress-bar" ).progressbar( "value" );
			 *
			 *		// set new value to 30
			 *		$( "#progress-bar" ).progressbar( "value", 30 );
			 *	</script>
			 * @method value
			 * @param {number} [value] Value to set on progress bar
			 * @return {number} In get mode returns current value of progress bar
			 * @since 2.3
			 * @member ns.widget.mobile.ProgressBar
			 */

			/**
			 * Method sets ProgressBar value.
			 * @method _setValue
			 * @param {number} value
			 * @return {boolean}
			 * @protected
			 * @member ns.widget.mobile.ProgressBar
			 */
			prototype._setValue = function (value) {
				var self = this,
					options = self.options,
					element = self.element,
					progressBarValueElement = self._ui.progressBarValueElement,
					animationEndCallback = progressEndHandler.bind(null, self);

				if (typeof value === "number") {
					value = Math.min(options.max, Math.max(options.min, value));
					options.value = value;
					// value changed
					if (value !== options.value) {
						options.value = value;
						events.trigger(element, eventType.CHANGE);
					}
					// value complete
					if (value === options.max && options.type === "progressbar") {
						events.one(progressBarValueElement, "webkitAnimationEnd", animationEndCallback)
					}
					this.refresh();
					return true;
				}
				return false;
			};

			/**
			 * Method gets ProgressBar value.
			 * @method _getValue
			 * @return {number}
			 * @protected
			 * @member ns.widget.mobile.ProgressBar
			 */
			prototype._getValue = function () {
				return this.options.value;
			};

			/**
			 * Refresh a progres bar.
			 *
			 * This method will rebuild while DOM structure of widget. Method
			 * should be called after are manually change in HTML attributes of
			 * widget DOM structure. Refresh is called automatically after
			 * change any option of widget.
			 *
			 *	@example
			 *	<div id="progress-bar"></div>
			 *	<script>
			 *		var element = document.getElementById("progress-bar"),
			 *			progressBarWidget = tau.widget.ProgressBar(element),
			 *
			 *		progressBarWidget.refresh();
			 *	</script>
			 *
			 *	@example
			 *	<div id="progress-bar"></div>
			 *	<script>
			 *		$( "#progress-bar" ).progressbar( "refresh" );
			 *	</script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.ProgressBar
			 */

			/**
			 * Method refreshes ProgressBar.
			 * @method _refresh
			 * @member ns.widget.mobile.ProgressBar
			 * @protected
			 */
			prototype._refresh = function () {
				var self = this,
					element = self.element,
					options = self.options;

				if (options.type === "progressbar") {
					element.setAttribute("aria-valuenow", options.value);
					/*elementChild.style.display = "";
					 elementChild.style.width = options.value + "%";*/
					setAnimationStyle(self, self.options);
					/* TODO: when webkitanimationEnd event fired, please remove this line */
					//self._ui.progressBarValueElement.classList.remove("ui-progressbar-value-front-anim");
				}
				self._oldValue = options.value;
			};

			prototype._destroy = function () {
				var self = this,
					element = self.element,
					firstChild = element.firstChild;

				while (firstChild) {
					element.removeChild(firstChild);
					firstChild = element.firstChild;
				}

				self._ui = null;
			};

			ProgressBar.prototype = prototype;
			ns.widget.mobile.ProgressBar = ProgressBar;
			engine.defineWidget(
				"ProgressBar",
				"[data-role='progressbar'], .ui-progressbar",
				["value"],
				ProgressBar,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.ProgressBar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
