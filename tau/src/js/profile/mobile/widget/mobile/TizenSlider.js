/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true */
/**
 * # Slider Widget
 * Slider widget changes browser input with type range to sliders
 *
 * ## Default selectors
 * In default all **INPUT** tags with type equals _range_ are changed
 * to Tizen WebUI sliders.
 * In addition all elements with _data-role=range_ and _data-role=slider_
 * and class _ui-tizenslider_ are changed to Tizen Web UI sliders.
 *
 * ###HTML Examples
 *
 * ####Create slider input
 *
 *		@example
 *		<input type="range" name="slider-1" id="slider" value="60" min="0" max="100">
 *
 * ## Manual constructor
 * For manual creation of slider widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<input id="slider" type="range" name="slider-1"
 *		 value="60" min="0" max="100">
 *		<script>
 *			var sliderElement = document.getElementById("slider"),
 *				slider = tau.widget.TizenSlider(sliderElement);
 *		</script>
 *
 * Constructor has one required parameter **element** which
 * is base **HTMLElement** to create widget. We recommend get this element
 * by method *document.getElementById*. Second parameter is **options**
 * and it is a object with options for widget.
 *
 *		@example
 *		<input id="slider" type="range" name="slider-1"
 *		 value="60" min="0" max="100">
 *		<script>
 *			var sliderElement = document.getElementById("slider"),
 *				slider = tau.widget.TizenSlider(sliderElement, {mini: true});
 *		</script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<input id="slider" type="range" name="slider-1"
 *		 value="60" min="0" max="100">
 *		<script>
 *			$("#slider").tizenslider({mini: true});
 *		</script>
 * jQuery Mobile constructor has one optional parameter **options**
 * and it is a object with options for widget.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<input id="slider" type="range" name="slider"
 *		 value="60" min="0" max="100">
 *		<script>
 *		var slider = document.getElementById("slider"),
 *			slider = tau.widget.TizenSlider(slider);
 *
 *		// slider.methodName(methodArgument1, methodArgument2, ...);
 *		// for example
 *		var value = slider.value("5");
 *		</script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<input id="slider" type="range" name="slider"
 *		 value="60" min="0" max="100">
 *		<script>
 *		//$("#slider").tizenslider("methodName", argument1, argument2, ...);
 *		//for example
 *		$("#slider").tizenslider("value", "5");
 *		</script>
 *
 * @class ns.widget.mobile.TizenSlider
 * @extends ns.widget.mobile.Slider
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/object",
			"../../../../core/util/DOM/css",
			"../mobile",
			"./Slider",
			"./Button",
			"./Popup"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Slider = ns.widget.mobile.Slider,
				Button = ns.widget.mobile.Button,
				engine = ns.engine,
				events = ns.event,
				objectUtils = ns.util.object,
				DOM = ns.util.DOM,
				POPUP_WIDTH = {
					"SMALL": "2.3rem",
					"MEDIUM": "2.8rem",
					"LARGE": "3.0rem"
				},
				FONT_SIZE = {
					"SMALL": "0.95rem",
					"MEDIUM": "0.85rem",
					"LARGE": "0.65rem",
					"DEFAULT": "0.45rem"
				},
				FONT_TOP = {
					"SMALL": "0",
					"MEDIUM": "-0.01rem",
					"LARGE": "-0.1rem",
					"DEFAULT": "-0.15rem"
				},
				TizenSlider = function () {
					Slider.call(this);
					// Some properties for example .popup must be defined once per slider
					// we need to make a copy of base options, because simple assigment
					// would create references to a single object
					this.options = this.options ? objectUtils.copy(this.options) : {};
					// Redefine this._ui use instance property not prototype property
					// in further operations
					this._ui = this._ui || {};
					// @TODO recheck other properties for potential issues
					// like this._ui
					this._popup = null;
				},
				sliderBuild,
				sliderInit,
				sliderConfigure,
				sliderBindEvents,
				slider_refresh,
				slider_setValue,
				slider_getValue;

			/**
			 * Dictionary for TizenSlider related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.TizenSlider
			 * @static
			 * @readonly
			 */
			TizenSlider.classes = {
				uiSliderPopup: "ui-slider-popup",
				uiSliderPopupContainer: "ui-slider-popup-container",
				uiSliderLeftPrefix: "ui-slider-left-",
				uiSliderRightPrefix: "ui-slider-right-",
				uiSliderLeftText: "ui-slider-left-text",
				uiSliderRightText: "ui-slider-right-text",
				uiSliderHandlePress: "ui-slider-handle-press",
				uiSliderCenter: "ui-slider-center"
			};

			TizenSlider.prototype = new Slider();
			sliderConfigure = TizenSlider.prototype._configure;
			sliderBuild = TizenSlider.prototype._build;
			sliderInit = TizenSlider.prototype._init;
			sliderBindEvents = TizenSlider.prototype._bindEvents;
			slider_refresh = TizenSlider.prototype._refresh,
			slider_setValue = TizenSlider.prototype._setValue
			slider_getValue = TizenSlider.prototype._getValue;

			/**
			 * Configure TizenSlider widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.mobile.TizenSlider
			 */
			TizenSlider.prototype._configure = function () {
				/**
				 * All possible widget options
				 * @property {Object} options
				 * @property {boolean} [options.popup=true] enables popup
				 * @property {boolean} [options.center=false] creates additional markup to pointing center of the slider
				 * @property {string} [options.icon=""] icon type
				 * @property {string} [options.innerLabel=false] Displays the value inside the handler
				 * @property {string} [options.textLeft=""] text attached to left
				 * @property {string} [options.textRight=""] text attached to right
				 * @member ns.widget.mobile.TizenSlider
				 */
				var options = this.options;

				if (typeof sliderConfigure === "function") {
					sliderConfigure.call(this);
				}
				options.popup = false;
				options.center = false;
				options.innerLabel = false;
				options.icon = "";
				options.textLeft = "";
				options.textRight = "";
			};

			/**
			 * Check if value is not empty
			 * @method getValueLength
			 * @param {number} value
			 * @return {number}
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function getValueLength(value) {
				return (new String(value)).length;
			}

			/**
			 * Creates popup element and appends it container passed as argument
			 * @method _createPopup
			 * @param {HTMLElement} container
			 * @return {ns.widget.Popup} reference to new widget instance
			 * @protected
			 * @member ns.widget.mobile.TizenSlider
			 */
			TizenSlider.prototype._createPopup = function (container) {
				var classes = TizenSlider.classes,
					popup,
					popupInstance;

				// Create element and append it to slider
				popup = document.createElement("div");
				container.appendChild(popup);
				// Create widget instance out of popup element
				popupInstance = engine.instanceWidget(popup, "Popup", {
					positionTo: "origin", // popup with arrow
					link: this._ui.handle.id, // positioned to slider's element
					transition: "none",
					noScreen: true,
					directionPriority: [
						"top",
						"bottom"
					],
					tolerance: "10,0,10,0",
					specialContainerClass: classes.uiSliderPopupContainer
				});
				popup.classList.add(classes.uiSliderPopup);

				return popupInstance;
			};

			/**
			 * Creates slider with the marked center element
			 * @method _createCenter
			 * @param {HTMLElement} slider
			 * @return {HTMLElement} returns the inserted element
			 * @protected
			 * @member ns.widget.mobile.TizenSlider
			 */
			TizenSlider.prototype._createCenter = function (slider) {
				var centerElement = document.createElement("div");
				centerElement.className = TizenSlider.classes.uiSliderCenter;

				return slider.insertBefore(centerElement, slider.childNodes[0]);
			};

			/**
			 * Updates popup state
			 * @method _updateSlider
			 * @member ns.widget.mobile.TizenSlider
			 * @protected
			 */
			TizenSlider.prototype._updateSlider = function () {
				var self = this,
					newValue,
					options = self.options,
					element = self.element,
					popupElement;

				// As the options.popup could change
				// it may be required to create popup
				if (self.options.popup){
					if (!self._popup) {
						self._popup = self._createPopup(self._ui.container);
					}

					popupElement = self._popup.element;
				}

				self._ui.handle.removeAttribute("title");

				newValue = parseInt(element.value, 10);

				if (newValue !== self.currentValue) {
					self.currentValue = newValue;

					// Set same value for popup element if it exists
					if (popupElement) {
						popupElement.innerHTML = newValue;
					}

					self._refresh();

					events.trigger(element, "update", newValue);
				} else {
					// If text doesn't change reposition only popup
					// no need to run full refresh
					if (self._popup) {
						self._popup.refresh();
					}
				}
			};

			/**
			 * Show popup for tizenslider
			 * @method _showPopup
			 * @member ns.widget.mobile.TizenSlider
			 * @protected
			 */
			TizenSlider.prototype._showPopup = function () {
				var self = this;

				if (self.options.popup && !self.popupVisible) {
					self._popup.open();
					self.popupVisible = true;
				}
			};

			/**
			 * Hide popup for tizenslider
			 * @method _hidePopup
			 * @member ns.widget.mobile.TizenSlider
			 * @protected
			 */
			TizenSlider.prototype._hidePopup = function () {
				var self = this;

				if (self.options.popup && self.popupVisible) {
					self._popup.close();
					self.popupVisible = false;
				}
			};

			/**
			 * Set options for popup in tizenslider
			 * @method _setOption
			 * @param {string} key
			 * @param {number} value
			 * @member ns.widget.mobile.TizenSlider
			 * @protected
			 */
			TizenSlider.prototype._setOption = function (key, value) {
				var needToChange = (value !== this.options[key]);

				if (needToChange) {
					switch (key) {
					case "popup":
						this.options.popup = value;
						if (value) {
							this._updateSlider();
						} else {
							this._hidePopup();
						}
						break;
					case "center":
						this.options.center = value;
					}
				}
			};

			/**
			 * Close popup by triggering vmouseup event
			 * @method _closePopup
			 * @member ns.widget.mobile.TizenSlider
			 * @protected
			 */
			TizenSlider.prototype._closePopup = function () {
				this._hidePopup();
			};

			/**
			 * Build TizenSlider
			 * @method _build
			 * @private
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.TizenSlider
			 */
			TizenSlider.prototype._build = function (element) {
				var self = this,
					options = self.options,
					slider,
					icon = options.icon,
					textRight = options.textRight,
					textLeft = options.textLeft,
					textLength,
					elemLeft,
					elemRight,
					marginLeft,
					marginRight,
					sliderContainer,
					inner,
					minValue,
					maxValue,
					classes = TizenSlider.classes,
					btnClasses = Button.classes,
					sliderContainerStyle,
					ui = self._ui;

				self.currentValue = null;

				sliderBuild.call(self, element);
				sliderInit.call(self, element);

				slider = ui.slider;
				sliderContainer = ui.container;
				sliderContainerStyle = sliderContainer.style;

				// Create popup for element
				if (options.popup) {
					self._popup = self._createPopup(sliderContainer);
				}

				if (options.center) {
					ui.centerElement = self._createCenter(slider);
				}

				maxValue = parseInt(element.getAttribute("max"), 10);
				minValue = parseInt(element.getAttribute("min"), 10);

				// Set default visibility for popup
				// @TODO  consider removing this property and use popup widget instance
				// to determine current popup status
				self.popupVisible = false;

				slider.classList.remove(btnClasses.uiBtnCornerAll);
				if (ui && ui.background) {
					ui.background.classList.remove(btnClasses.uiBtnCornerAll);
				}
				self._ui.handle.classList.remove(btnClasses.uiBtnCornerAll);
				slider.querySelector('.' + btnClasses.uiBtnInner).classList.remove(btnClasses.uiBtnCornerAll);

				switch (icon) {
				case "bright":
				case "volume":
					elemLeft = document.createElement("div");
					elemLeft.classList.add(classes.uiSliderLeftPrefix + icon);

					slider.parentNode.insertBefore(elemLeft, slider);

					marginLeft = (DOM.getElementWidth(elemLeft) + 16) + "px";
					marginRight = "";
					break;

				case "text":
					textLeft = (textLeft && textLeft.substring(0, 3)) || "";
					textRight = (textRight && textRight.substring(0, 3)) || "";

					elemLeft = document.createElement("div");
					elemLeft.classList.add(classes.uiSliderLeftText);

					elemRight = document.createElement("div");
					elemRight.classList.add(classes.uiSliderRightText);

					textLength = Math.max(textLeft.length, textRight.length) + 1;

					marginLeft = textLength + "rem";
					marginRight = textLength + "rem";

					// Properties set before appending to element in DOM
					elemLeft.style.left = "-" + marginLeft;
					elemLeft.style.width = marginLeft;

					elemRight.style.right = "-" + marginRight;
					elemRight.style.width = marginRight;

					inner = document.createElement("span");
					inner.style.position = "relative";
					inner.style.top = "0.4em";
					inner.innerHTML = textLeft;

					// Second element is same as first one
					elemLeft.appendChild(inner.cloneNode(true));

					inner.innerHTML = textRight;

					elemRight.appendChild(inner);

					slider.parentNode.insertBefore(elemLeft, slider);
					slider.parentNode.appendChild(elemRight);

					break;
				}

				if (icon) {
					sliderContainerStyle.marginLeft = marginLeft;
					sliderContainerStyle.marginRight = marginRight;
				}

				self.handleText = slider.querySelector("." + btnClasses.uiBtnText);

				self.element = element;
				self._updateSlider(element);

				return element;
			};

			/**
			 * Callback responsible for opening popup, fires on change event
			 * @method onChangeHandler
			 * @param {ns.widget.mobile.TizenSlider} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function onChangeHandler(self) {
				if (self.popupVisible) {
					self._updateSlider();
					self._showPopup();
					document.addEventListener("vmouseup", self.onVmouseUpHandleHandler, false);
				} else {
					self.popupVisible = true;
					self._updateSlider();
					self.popupVisible = false;
				}
			}

			/**
			 * Callback responsible for refreshing the slider and showing the popup
			 * @method onSlideStartHandler
			 * @param {ns.widget.mobile.TizenSlider} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function onSlideStartHandler(self) {
				self._updateSlider();
				self._showPopup();
				document.addEventListener("vmouseup", self.onVmouseUpHandleHandler, false);
			}

			/**
			 * Callback shows popup and assign another callback, fires on mouse down event
			 * @method onVmouseDownHandler
			 * @param {ns.widget.mobile.TizenSlider} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function onVmouseDownHandler(self) {
				self.handle.classList.add(TizenSlider.classes.uiSliderHandlePress);
				self._showPopup();
				document.addEventListener("vmouseup", self.onVmouseUpHandleHandler, false);
			}

			/**
			 * Callback responsible for refreshing the slider and showing popup.
			 * @method onVmouseDownHandleHandler
			 * @param {ns.widget.mobile.TizenSlider} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function onVmouseDownHandleHandler(self) {
				self._updateSlider();
				self._ui.handle.classList.add(TizenSlider.classes.uiSliderHandlePress);
				self._showPopup();
				document.addEventListener("vmouseup", self.onVmouseUpHandleHandler, false);
			}

			/**
			 * Callback hides popup and stops the event
			 * @method onVmouseUpHandleHandler
			 * @param {ns.widget.mobile.TizenSlider} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TizenSlider
			 */
			function onVmouseUpHandleHandler(self, event) {
				event.preventDefault();
				event.stopPropagation();
				self._hidePopup();
				self._ui.handle.classList.remove(TizenSlider.classes.uiSliderHandlePress);
				document.removeEventListener("vmouseup", self.onVmouseUpHandleHandler, false);
			}

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.TizenSlider
			 * @return {HTMLElement}
			 */
			TizenSlider.prototype._bindEvents = function (element) {
				sliderBindEvents.call(this, element);
				this.onChangeHandler = onChangeHandler.bind(null, this);
				this.onSlideStartHandler = onSlideStartHandler.bind(null, this);
				this.onVmouseDownHandler = onVmouseDownHandler.bind(null, this);
				this.onVmouseDownHandleHandler = onVmouseDownHandleHandler.bind(null, this);
				this.onVmouseUpHandleHandler = onVmouseUpHandleHandler.bind(null, this);
				this.onOrientationChangeHandler = this._closePopup.bind(this);

				element.addEventListener("change", this.onChangeHandler, false);
				element.addEventListener("slidestart", this.onSlideStartHandler, false);
				element.addEventListener("vmousedown", this.onVmouseDownHandler, false);
				this._ui.handle.addEventListener("vmousedown", this.onVmouseDownHandleHandler, false);
				window.addEventListener("orientationchange", this.onOrientationChangeHandler, false);

				return element;
			};

			/**
			 * @method _refresh
			 * @inheritdoc ns.widget.mobile.Slider#_refresh
			 * @protected
			 * @member ns.widget.mobile.TizenSlider
			 */
			TizenSlider.prototype._refresh = function () {
				var self = this,
					popup = self._popup;
				// Call parent refresh method with all passed arguments
				slider_refresh.apply(self, arguments);
				if (popup && self.popupVisible) {
					popup.refresh();
				}
			};

			ns.widget.mobile.TizenSlider = TizenSlider;
			engine.defineWidget(
				"TizenSlider",
				"input[type='range'], :not(select)[data-role='slider'], :not(select)[data-type='range'], .ui-tizenslider",
				[],
				TizenSlider,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.TizenSlider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
