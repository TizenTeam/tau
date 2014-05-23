/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
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
 * #Tizen Slider Widget
 *
 * @class ns.widget.TizenSlider
 * @extends ns.widget.mobile.Slider
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/utils/events",
			"../../../../core/utils/DOM/css",
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
				events = ns.utils.events,
				objectUtils = ns.utils.object,
				DOM = ns.utils.DOM,
				POPUP_WIDTH = {
					'SMALL': '2.3rem',
					'MEDIUM': '2.8rem',
					'LARGE': '3.0rem'
				},
				FONT_SIZE = {
					'SMALL': '0.95rem',
					'MEDIUM': '0.85rem',
					'LARGE': '0.65rem',
					'DEFAULT': '0.45rem'
				},
				FONT_TOP = {
					'SMALL': '0',
					'MEDIUM': '-0.01rem',
					'LARGE': '-0.1rem',
					'DEFAULT': '-0.15rem'
				},
				/**
				* TizenSlider widget
				* @class ns.widget.TizenSlider
				* @extends ns.widget.BaseWidget
				*/
				TizenSlider = function () {
					// Some properties for example .popup must be defined once per slider
					// we need to make a copy of base options, because simple assigment
					// would create references to a single object
					this.options = this.options ? objectUtils.copy(this.options) : {};
					// Redefine this._ui use instance property not prototype property
					// in further operations
					this._ui = {};
					// @TODO recheck other properties for potential issues
					// like this._ui
				},
				sliderBuild,
				sliderInit,
				sliderConfigure,
				sliderBindEvents,
				slider_refresh;

			TizenSlider.classes = {
				uiSliderPopup: "ui-slider-popup",
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
			slider_refresh = TizenSlider.prototype._refresh;

			TizenSlider.prototype._configure = function () {
				var options = this.options;

				if (typeof sliderConfigure === 'function') {
					sliderConfigure.call(this);
				}
				options.popup = true;
				options.center = false;
				options.icon = "";
				options.textLeft = "";
				options.textRight = "";
			};

			function getValueLength(value) {
				return (String(value)).length;
			}

			/**
			 * Creates popup element and appends it container passed as argument
			 * @method _createPopup
			 * @param {HTMLElement} container
			 * @protected
			 * @return {ns.widget.Popup} reference to new widget instance
			 * @member ns.widget.TizenSlider
			 */
			TizenSlider.prototype._createPopup = function (container) {
				var popup,
					popupInstance;

				// Create element and append it to slider
				popup = document.createElement('div');
				container.appendChild(popup);
				// Create widget instance out of popup element
				popupInstance = engine.instanceWidget(popup, 'Popup', {
					positionTo: "origin", // popup with arrow
					link: this.handle.id, // positioned to slider's element
					transition: "none",
					noScreen: true,
					directionPriority: [
						'top',
						'bottom'
					]
				});
				popup.classList.add(TizenSlider.classes.uiSliderPopup);

				return popupInstance;
			};

			TizenSlider.prototype._createCenter = function (slider) {
				var centerElement = document.createElement('div');
				centerElement.className = TizenSlider.classes.uiSliderCenter;

				return slider.insertBefore(centerElement, slider.childNodes[0]);
			};

			TizenSlider.prototype._updateSlider = function () {
				var self = this,
					font_size,
					font_length,
					font_top,
					popup_width,
					newValue,
					element = self.element,
					handleTextStyle = self.handleText.style,
					popupElement,
					popupStyle;

				// As the options.popup could change
				// it may be required to create popup
				if (self.options.popup){
					if (!self.popup) {
						self.popup = self._createPopup(self._ui.container);
					}

					popupElement = self.popup.element;
					popupStyle = popupElement.style;
				}

				self.handle.removeAttribute('title');

				newValue = parseInt(element.value, 10);

				if (newValue !== self.currentValue) {

					font_length = getValueLength(newValue);

					// Set proper font-size for popup content
					if (self.popup && self.popupVisible) {
						switch (font_length) {
						case 1:
						case 2:
							popup_width = POPUP_WIDTH.SMALL;
							break;
						case 3:
							popup_width = POPUP_WIDTH.MEDIUM;
							break;
						default:
							popup_width = POPUP_WIDTH.SMALL;
							break;
						}

						popupStyle.width = popup_width;
					}

					switch (font_length) {
					case 1:
						font_size = FONT_SIZE.SMALL;
						font_top = FONT_TOP.SMALL;
						break;
					case 2:
						font_size = FONT_SIZE.MEDIUM;
						font_top = FONT_TOP.MEDIUM;
						break;
					case 3:
						font_size = FONT_SIZE.LARGE;
						font_top = FONT_TOP.LARGE;
						break;
					default:
						font_size = FONT_SIZE.DEFAULT;
						font_top = FONT_TOP.DEFAULT;
						break;
					}

					if (font_size !== self.handleText.style.fontSize) {
						handleTextStyle.fontSize = font_size;
						handleTextStyle.top = font_top;
						handleTextStyle.position = 'relative';
					}

					self.currentValue = newValue;
					self.handleText.innerText = newValue;

					// Set same value for popup element if it exists
					if (popupElement) {
						popupElement.innerHTML = newValue;
					}

					self._refresh();

					events.trigger(element, "update", newValue);
				} else {
					// If text doesn't change reposition only popup
					// no need to run full refresh
					if (self.popup) {
						self.popup.setPosition();
					}
				}
			};

			TizenSlider.prototype._showPopup = function () {
				var self = this;

				if (self.options.popup && !self.popupVisible) {
					self.popup.open();
					self.popupVisible = true;
				}
			};

			TizenSlider.prototype._hidePopup = function () {
				var self = this;

				if (self.options.popup && self.popupVisible) {
					self.popup.close();
					self.popupVisible = false;
				}
			};

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

			TizenSlider.prototype._closePopup = function () {
				events.trigger(this.slider, "vmouseup");
			};

			/**
			* Build TizenSlider
			* @method _build
			* @private
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.TizenSlider
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

				slider = self.slider;
				sliderContainer = ui.container;
				sliderContainerStyle = sliderContainer.style;

				// Create popup for element
				if (options.popup) {
					self.popup = self._createPopup(sliderContainer);
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
				self.handle.classList.remove(btnClasses.uiBtnCornerAll);
				slider.querySelector('.' + btnClasses.uiBtnInner).classList.remove(btnClasses.uiBtnCornerAll);

				switch (icon) {
				case 'bright':
				case 'volume':
					elemLeft = document.createElement('div');
					elemLeft.classList.add(classes.uiSliderLeftPrefix + icon);

					elemRight = document.createElement('div');
					elemRight.classList.add(classes.uiSliderRightPrefix + icon);

					slider.parentNode.insertBefore(elemLeft, slider);
					slider.parentNode.appendChild(elemRight);

					marginLeft = (DOM.getElementWidth(elemLeft) + 16) + 'px';
					marginRight = (DOM.getElementWidth(elemRight) + 16) + 'px';
					break;

				case 'text':
					textLeft = (textLeft && textLeft.substring(0, 3)) || '';
					textRight = (textRight && textRight.substring(0, 3)) || '';

					elemLeft = document.createElement('div');
					elemLeft.classList.add(classes.uiSliderLeftText);

					elemRight = document.createElement('div');
					elemRight.classList.add(classes.uiSliderRightText);

					textLength = Math.max(textLeft.length, textRight.length) + 1;

					marginLeft = textLength + "rem";
					marginRight = textLength + "rem";

					// Properties set before appending to element in DOM
					elemLeft.style.left = "-" + marginLeft;
					elemLeft.style.width = marginLeft;

					elemRight.style.right = "-" + marginRight;
					elemRight.style.width = marginRight;

					inner = document.createElement('span');
					inner.style.position = 'relative';
					inner.style.top = '0.4em';
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

				self.handleText = slider.querySelector('.' + btnClasses.uiBtnText);

				self.element = element;
				self._updateSlider(element);

				return element;
			};

			function onChangeHandler(self) {
				if (self.popupVisible) {
					self._updateSlider();
					self._showPopup();
					document.addEventListener('vmouseup', self.onVmouseUpHandleHandler, false);
				} else {
					self.popupVisible = true;
					self._updateSlider();
					self.popupVisible = false;
				}
			}

			function onSlideStartHandler(self) {
				self._updateSlider();
				self._showPopup();
				document.addEventListener('vmouseup', self.onVmouseUpHandleHandler, false);
			}

			function onVmouseDownHandler(self) {
				self.handle.classList.add(TizenSlider.classes.uiSliderHandlePress);
				self._showPopup();
				document.addEventListener('vmouseup', self.onVmouseUpHandleHandler, false);
			}

			function onVmouseDownHandleHandler(self) {
				self._updateSlider();
				self.handle.classList.add(TizenSlider.classes.uiSliderHandlePress);
				self._showPopup();
				document.addEventListener('vmouseup', self.onVmouseUpHandleHandler, false);
			}

			function onVmouseUpHandleHandler(self, event) {
				event.preventDefault();
				event.stopPropagation();
				self._hidePopup();
				self.handle.classList.remove(TizenSlider.classes.uiSliderHandlePress);
				document.removeEventListener('vmouseup', self.onVmouseUpHandleHandler, false);
			}

			TizenSlider.prototype._bindEvents = function (element) {
				sliderBindEvents.call(this, element);
				this.onChangeHandler = onChangeHandler.bind(null, this);
				this.onSlideStartHandler = onSlideStartHandler.bind(null, this);
				this.onVmouseDownHandler = onVmouseDownHandler.bind(null, this);
				this.onVmouseDownHandleHandler = onVmouseDownHandleHandler.bind(null, this);
				this.onVmouseUpHandleHandler = onVmouseUpHandleHandler.bind(null, this);
				this.onOrientationChangeHandler = this._closePopup.bind(this);

				element.addEventListener('change', this.onChangeHandler, false);
				element.addEventListener('slidestart', this.onSlideStartHandler, false);
				element.addEventListener('vmousedown', this.onVmouseDownHandler, false);
				this.handle.addEventListener('vmousedown', this.onVmouseDownHandleHandler, false);
				window.addEventListener('orientationchange', this.onOrientationChangeHandler, false);

				return element;
			};

			/**
			 * @method _refresh
			 * @inheritdoc ns.widget.mobile.Slider#_refresh
			 * @protected
			 * @member ns.widget.TizenSlider
			 */
			TizenSlider.prototype._refresh = function () {
				var self = this,
					popup = self.popup;
				// Call parent refresh method with all passed arguments
				slider_refresh.apply(self, arguments);
				if (popup && self.popupVisible) {
					popup.setPosition();
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
