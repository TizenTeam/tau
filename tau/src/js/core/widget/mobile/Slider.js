/*global window, define */
/*jslint nomen: true, plusplus: true */
/**
 * #Slider widget
 * @class ns.widget.mobile.Slider
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../theme",
			"../../utils/DOM/attributes",
            "../../utils/DOM/css",
			"../../utils/events",
			"../../utils/selectors",
			"../../events/vmouse",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile",
			"../../../profile/mobile/widget/mobile/Button"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Slider = function () {
				var self = this;

					self.options = {
						trackTheme: null,
						disabled: false,
						mini: null,
						highlight: true,
						inline: null,
						theme: null
					};
					self._ui = {};
					//container for slider containing handle.element
					self.slider = null;
					self.handle = null;
					//container background
					self.valueBackGround = null;
					self.dragging = false;
					self.beforeStart = null;
					self.userModified = false;
					self.mouseMoved = false;
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				Button = ns.widget.mobile.Button,
				engine = ns.engine,
				events = ns.utils.events,
				themes = ns.theme,
				selectors = ns.utils.selectors,
				DOMutils = ns.utils.DOM;

			Slider.prototype = new BaseWidget();

			/**
			* @property {Object} classes Dictionary for slider related css class names
			* @member ns.widget.mobile.Slider
			* @static
			*/
			Slider.classes = {
				theme: 'ui-body-',
				mini: 'ui-mini',
				sliderSnapping : 'ui-slider-handle-snapping',
				sliderSwitch: 'ui-slider-switch',
				sliderInline: 'ui-slider-inline',
				sliderMini: 'ui-slider-mini',
				slider: 'ui-slider',
				sliderHandle: 'ui-slider-handle',
				sliderBg: 'ui-slider-bg',
				sliderToggle: 'ui-toggle-switch',
				sliderToggleOn: 'ui-toggle-on',
				sliderToggleOff: 'ui-toggle-off',
				sliderInneroffset: 'ui-slider-inneroffset',
				sliderInput: 'ui-slider-input',
				sliderLabel: 'ui-slider-label',
				sliderLabelTheme: 'ui-slider-label-',
				sliderContainer: 'ui-slider-container',
				sliderLabelA: "ui-slider-label-a"
			};

			function onTouchMove(event) {
				event.stopPropagation();
				event.preventDefault();
			}

			function findLabel(element) {
				return element.parentNode.querySelector('label[for="' + element.id + '"]');
			}
			function refreshLabels(self, percent) {
				var shandle = self.handle,
					classes = Slider.classes,
					getElementWidth = DOMutils.getElementWidth.bind(DOMutils),
					handlePercent = getElementWidth(shandle, 'outer') / getElementWidth(self.slider, 'outer') * 100,
					aPercent = percent && handlePercent + (100 - handlePercent) * percent / 100,
					bPercent = percent === 100 ? 0 : Math.min(handlePercent + 100 - aPercent, 100),
					i = self._labels.length,
					label;

				while (i--) {
					label = self._labels[i];
					label.style.width = (label.classList.contains(classes.sliderLabelA) ? aPercent : bPercent) + "%";
				}
			}
			/*
			* val returns default position of the slider, if the element is input
			* type Function
			*/
			function getInitialValue(tag, element) {
				return tag === "input" ? parseFloat(element.value) : element.selectedIndex;
			}

			function createBackground(domSlider) {
				var background = document.createElement('div'),
					classes = Slider.classes,
					cList = background.classList,
					btnClasses = Button.classes;

				cList.add(classes.sliderBg);
				cList.add(btnClasses.uiBtnActive);
				cList.add(btnClasses.uiBtnCornerAll);

				return domSlider.insertBefore(background, domSlider.firstChild);
			}

			function refresh(self, val, isfromControl, preventInputUpdate) {
				var control = self.element,
					percent,
					shandle = self.handle,
					cType = control.nodeName.toLowerCase(),
					min = 0,
					max = control.querySelectorAll("option").length - 1,
					stepValue = DOMutils.getNumberFromAttribute(control, "step", "float", 0),
					step = (cType === "input" && stepValue > 0) ? stepValue : 1,
					data,
					touchThreshold,
					localClasses = shandle.classList,
					newval,
					valModStep,
					alignValue,
					valueChanged,
					newValueOption,
					sliderOffsetLeft;

				if (cType === "input") {
					min = DOMutils.getNumberFromAttribute(control, "min",  "float", min);
					max = DOMutils.getNumberFromAttribute(control, "max", "float", max);
				}

				if (isNaN(step)) {
					step = 0;
				}

				if (self.options.disabled) {
					self._disable();
				}

				// If changes came from event
				if (typeof val === "object") {
					data = val;
					// @TODO take parameter out to config
					touchThreshold = 8;
					sliderOffsetLeft = DOMutils.getElementOffset(self.slider).left;

					// If refreshing while not dragging
					// or movement was within threshold
					if (!self.dragging ||
							data.pageX < sliderOffsetLeft - touchThreshold ||
							data.pageX > sliderOffsetLeft + self.slider.offsetWidth + touchThreshold) {
						return;
					}

					// Calculate new left side percent
					percent = ((data.pageX - sliderOffsetLeft) / self.slider.offsetWidth) * 100;

				// If changes came from input value change
				} else {
					if (val === null) {
						val = (cType === "input") ? parseFloat(control.value) : control.selectedIndex;
					}
					if (isNaN(val)) {
						return;
					}
					// While dragging prevent jumping by assigning last percentage value
					if(self.dragging && self._lastPercent) {
						percent = self._lastPercent;
					} else {
						percent = (parseFloat(val) - min) / (max - min) * 100;
					}
				}

				// Make sure percent is a value between 0 - 100;
				percent = Math.max(0, Math.min(percent, 100));
				self._lastPercent = percent;

				newval = (percent / 100) * (max - min) + min;

				//from jQuery UI slider, the following source will round to the nearest step
				valModStep = (newval - min) % step;
				alignValue = newval - valModStep;

				if (Math.abs(valModStep) * 2 >= step) {
					alignValue += (valModStep > 0) ? step : (-step);
				}
				// Since JavaScript has problems with large floats, round
				// the final value to 5 digits after the decimal point (see jQueryUI: #4124)
				newval = parseFloat(alignValue.toFixed(5));

				newval = Math.max(min, Math.min(newval, max));

				shandle.style.left = percent + "%";
				newValueOption = control.querySelectorAll("option")[newval];
				shandle.setAttribute("aria-valuenow", cType === "input" ? newval : newValueOption && newValueOption.value);
				shandle.setAttribute("aria-valuetext", cType === "input" ? newval : newValueOption && newValueOption.innerText);
				shandle.setAttribute('title', cType === "input" ? newval : newValueOption && newValueOption.innerText);

				if (percent === 100 && localClasses.contains("ui-slider-handle-snapping")) {
					localClasses.remove("ui-toggle-off");
					localClasses.add("ui-toggle-on");
				} else if (percent === 0 && shandle.classList.contains("ui-slider-handle-snapping")) {
					localClasses.remove("ui-toggle-on");
					localClasses.add("ui-toggle-off");
				}

				if (self._ui.background) {
					self._ui.background.style.width = percent + "%";
				}

				// drag the label widths
				if (self._labels) {
					refreshLabels(self, percent);
				}

				if (!preventInputUpdate) {
					valueChanged = false;
					// update control"s value
					if (cType === "input") {
						valueChanged = control.value !== newval;
						control.value = newval;
					} else {
						valueChanged = control.selectedIndex !== newval;
						control.selectedIndex = newval;
					}
					if (!isfromControl && valueChanged) {
						events.trigger(control, "change");
					}
				}
			}

			function onVmouseMove(self, event) {
				var tagName = self.element.nodeName.toLowerCase(),
					handle = self.handle,
					classes = Slider.classes;
				// NOTE: we don't do this in refresh because we still want to
				//	support programmatic alteration of disabled inputs
				if (self.dragging && !self.options.disabled) {

					// self.mouseMoved must be updated before refresh() because it will be used in the control "change" event
					self.mouseMoved = true;

					if (tagName === "select") {
						// make the handle move in sync with the mouse
						handle.classList.remove(classes.sliderSnapping);
					}

					refresh(self, event);
					// only after refresh() you can calculate self.userModified
					self.userModified = self.beforeStart !== self.element.selectedIndex;
					event.preventDefault();
				}
			}

			/**
			 *
			 * @param self
			 */
			function sliderMouseUp(self) {
				if (self.dragging) {
					self.dragging = false;

					if (self.element.nodeName.toLowerCase() === "select") {
						// make the handle move with a smooth transition
						self.handle.classList.add(Slider.classes.sliderSnapping);

						if (self.mouseMoved) {
							// this is a drag, change the value only if user dragged enough
							if (self.userModified) {
								refresh(self, self.beforeStart === 0 ? 1 : 0);
							} else {
								refresh(self, self.beforeStart);
							}
						} else {
							refresh(self, self.beforeStart === 0 ? 1 : 0);
						}
					}
					self.mouseMoved = false;
				}
			}

			Slider.prototype._build = function (element) {
				var classes = Slider.classes,
					options = this.options,
					protoOptions = Slider.prototype.options,
					/*TODO - add support disabled */
					parentTheme = themes.getInheritedTheme(element, (protoOptions && protoOptions.theme) || 's'),
					theme = options.theme = options.theme || parentTheme,
					trackTheme = options.trackTheme = options.trackTheme || parentTheme,
					/*
					* tagName containing lowered tagname
					* type String
					*/
					tagName = element.nodeName.toLowerCase(),
					selectClass = tagName === "select" ? classes.sliderSwitch : "",
					/*
					* elementId get the id attribute
					* type String
					*/
					elementId = element.getAttribute("id"),
					labelFor = findLabel(element),
					labelID,

					/*TODO - assign in callbacks*/
					min = tagName === "input" ? parseFloat(element.getAttribute("min")) : 0,
					/*TODO - assign in callbacks*/
					max = tagName === "input" ? parseFloat(element.getAttribute("max")) : element.querySelectorAll("option").length - 1,
					/*TODO - will be used in long sliders*/
					step = parseFloat(element.getAttribute("step")),

					domHandle = document.createElement('a'),
					domSlider = document.createElement('div'),
					sliderContainer,
					domSliderClassList = domSlider.classList,
					i,
					wrapper = null,
					j,
					side,
					sliderTheme,
					sliderImg,
					length,
					optionsCount,
					domSliderChildNod = domSlider.childNodes,
					sliderImgClassL = null,
					elementClassList = null,
					initValue,
					sliderBtnDownTheme,
					elementsOption = element.querySelector("option"),
					btnClasses = Button.classes;

				if (options.highlight && tagName !== "select") {
					this._ui.background = createBackground(domSlider);
				}
				if (isNaN(min)) {
					min = 0;
				}
				if (isNaN(max)) {
					max = 0;
				}
				if (isNaN(step)) {
					step = 1;
				}
				sliderBtnDownTheme = btnClasses.uiBtnDownThemePrefix + trackTheme;
				if (labelFor) {
					labelID = labelFor.getAttribute("id") || elementId + "-label";
					labelFor.setAttribute("id", labelID);

					labelFor.classList.add(classes.slider);
				}

				domSlider.setAttribute('role', 'application');
				domSlider.setAttribute('id', elementId + "-slider");
				domSliderClassList.add(classes.slider);
				if (selectClass) {
					domSliderClassList.add(selectClass);
				}
				domSliderClassList.add(sliderBtnDownTheme);
				domSliderClassList.add(btnClasses.uiBtnCornerAll);
				if (options.inline) {
					domSliderClassList.add(classes.sliderInline);
				}
				if (options.mini) {
					domSliderClassList.add(classes.sliderMini);
				}

				domHandle.className = classes.sliderHandle;

				if (elementsOption && elementsOption.innerText === "") {
					domSlider.classList.add(classes.sliderToggle);
				}

				initValue = getInitialValue(tagName, element);
				if (initValue !== 1) {
					domHandle.classList.add(classes.sliderToggleOff);
					domHandle.style.left = '0px';
				}

				domSlider.appendChild(domHandle);

				//temporary way to send initial parameters to the instanceWidget method
				domHandle.setAttribute('data-corners', "true");
				domHandle.setAttribute('data-theme', theme);
				domHandle.setAttribute('data-shadow', "true");

				domHandle.setAttribute('role', 'slider');
				domHandle.setAttribute('aria-valuemin', min);
				domHandle.setAttribute('aria-valuemax', max);
				domHandle.setAttribute('aria-valuenow', initValue);
				domHandle.setAttribute('aria-valuetext', initValue);
				domHandle.setAttribute('title', initValue);
				domHandle.setAttribute('aria-labelledby', 'labelID');
				domHandle.setAttribute('data-role', 'button');
				domHandle.setAttribute('inline', 'false');
				domHandle.setAttribute('data-bar', 'true');
				domHandle.setAttribute('id', elementId + '-handle');
				engine.instanceWidget(domHandle, "Button");

				if (tagName === "select") {
					wrapper = document.createElement('div');
					wrapper.className = classes.sliderInneroffset;

					for (j = 0, length = domSliderChildNod.length; j < length; j++) {
						wrapper.appendChild(domSliderChildNod[j]);
					}

					domSlider.appendChild(wrapper);

					// make the handle move with a smooth transition
					domHandle.classList.add("ui-slider-handle-snapping");

					for (i = 0, optionsCount = element.length; i < optionsCount; i++) {
						side = i ? "a" : "b";
						sliderTheme = i ? btnClasses.uiBtnActive : sliderBtnDownTheme;
						/* TODO - check sliderlabel */
						sliderImg = document.createElement('span');
						sliderImgClassL = sliderImg.classList;
						sliderImgClassL.add(classes.sliderLabel);
						sliderImgClassL.add(classes.sliderLabelTheme + side);
						sliderImgClassL.add(sliderTheme);
						sliderImgClassL.add(btnClasses.uiBtnCornerAll);

						sliderImg.setAttribute('role', 'img');
						sliderImg.appendChild(document.createTextNode(element[i].innerHTML));
						domSlider.insertBefore(sliderImg, domSlider.firstChild);
					}
					sliderContainer = domSlider;
				}

				if (tagName === "input") {
					sliderContainer = document.createElement('div');
					sliderContainer.classList.add(classes.sliderContainer);
					sliderContainer.appendChild(domSlider);
					sliderContainer.id = elementId + '-container';
					elementClassList = element.classList;
					elementClassList.add(ns.widget.mobile.Textinput.classes.uiInputText);
					elementClassList.add(classes.theme + theme);
					elementClassList.add(classes.sliderInput);
					element.style.display = 'none';
				} else {
					element.classList.add(classes.sliderSwitch);
				}

				//before it was used in refresh which was called during init, needs duplication in build in order to pass tests
				if (initValue === 1) {
					domHandle.classList.add(classes.sliderToggleOn);
					domHandle.style.left = '27px';
				}

				domHandle.style.right = 'auto';

				element.parentNode.insertBefore(sliderContainer, element.nextSibling);

				return element;
			};

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Slider
			*/
			Slider.prototype._init = function (element) {
				var elementId = element.id,
					self = this;

				self.element = element;
				self.slider = document.getElementById(elementId + "-slider");
				self.handle = document.getElementById(elementId + "-handle");
				self._ui.container = document.getElementById(elementId + "-container") || element;
				self._ui.background = self.slider.querySelector('.' + Slider.classes.sliderBg);
				self._type = element.tagName.toLowerCase();
				self._labels = selectors.getChildrenByClass(self.slider, Slider.classes.sliderLabel);

				refresh(self, self._getValue());
			};

			Slider.prototype._getValue = function () {
				return this._type === "input" ? parseFloat(this.element.value) : this.element.selectedIndex;
			};

			Slider.prototype._refresh = function () {
				var self = this;
				if (self.value !== self._getValue()) {
					refresh(self, self._getValue());
				}
			};

			Slider.prototype._bindEvents = function (element) {
				var self = this,
					handle = self.handle,
					tagName = element.nodeName.toLowerCase(),
					slider = self.slider;

				element.addEventListener('change', function () {
					if (!self.mouseMoved) {
						refresh(self, self._getValue(), true);
					}
				}, false);

				element.addEventListener('keyup', function () {
					refresh(self, self._getValue(), true, true);
				}, false);

				element.addEventListener('blur', function () {
					refresh(self, self._getValue(), true);
				}, false);

				handle.addEventListener('vmousedown', function (event) {
					events.trigger(event.target, 'focus');
				}, false);
				handle.addEventListener('vclick', function (event) {
					event.stopPropagation();
					event.preventDefault();
				}, false);
				handle.addEventListener('keydown', function () {
					// @todo
					/*
					var index = val();
					*/

					if (self.options.disabled) {
						return;
					}


					/*
					* @todo
					// In all cases prevent the default and mark the handle as active
					switch (event.keyCode) {
						case $.mobile.keyCode.HOME:
						case $.mobile.keyCode.END:
						case $.mobile.keyCode.PAGE_UP:
						case $.mobile.keyCode.PAGE_DOWN:
						case $.mobile.keyCode.UP:
						case $.mobile.keyCode.RIGHT:
						case $.mobile.keyCode.DOWN:
						case $.mobile.keyCode.LEFT:
							event.preventDefault();

							if (!self._keySliding) {
								self._keySliding = true;
								$(this).addClass("ui-state-active");
							}
							break;
					}

					// move the slider according to the keypress
					switch (event.keyCode) {
						case $.mobile.keyCode.HOME:
							self.refresh(min);
							break;
						case $.mobile.keyCode.END:
							self.refresh(max);
							break;
						case $.mobile.keyCode.PAGE_UP:
						case $.mobile.keyCode.UP:
						case $.mobile.keyCode.RIGHT:
							self.refresh(index + step);
							break;
						case $.mobile.keyCode.PAGE_DOWN:
						case $.mobile.keyCode.DOWN:
						case $.mobile.keyCode.LEFT:
							self.refresh(index - step);
							break;
					}
					*/
				}, false);
				handle.addEventListener('keyup', function () {
					if (self._keySliding) {
						self._keySliding = false;
						handle.classList.remove("ui-state-active");
					}
				}, false);
				slider.addEventListener("touchend", function () {
					self.dragging = false;
					handle.classList.add("ui-slider-handle-snapping");
					refresh(self, getInitialValue(tagName, element), true, true);
				}, false);

				slider.addEventListener("vmousedown", function (event) {
					if (self.options.disabled) {
						return false;
					}

					self.dragging = true;
					self.userModified = false;
					self.mouseMoved = false;

					if (tagName === "select") {
						self.beforeStart = element.selectedIndex;
					}
					refresh(self, event);
					return false;
				}, false);
				/*TODO - add vmousemove support*/

				this._onVmouseMove = onVmouseMove.bind(null, this);
				slider.addEventListener("vmousemove", this._onVmouseMove, false);

				slider.addEventListener("vclick", function (event) {
					event.stopPropagation();
					event.preventDefault();
				}, false);
				//prevent scrolling when slider is in use
				slider.addEventListener("touchmove", onTouchMove, false);

				this._sliderMouseUp = sliderMouseUp.bind(null, this);
				slider.addEventListener("vmouseup", this._sliderMouseUp, false);

			};

			/**
			* Enable slider
			* @method _enable
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Slider
			* @instance
			*/
			Slider.prototype._enable = function (element) {
				var btnClasses = Button.classes;

				element.removeAttribute("disabled");
				this.slider.classList.remove( btnClasses.uiDisabled );
				this.slider.setAttribute("aria-disabled", false);
				this.options.disabled = false;
			};

			/**
			* Disable slider
			* @method _disable
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Slider
			* @instance
			*/
			Slider.prototype._disable = function (element) {
				var btnClasses = Button.classes;

				element.setAttribute("disabled", "disabled");
				this.slider.classList.add( btnClasses.uiDisabled );
				this.slider.setAttribute( "aria-disabled", true );
				this.options.disabled = true;
			};

			// @TODO add destroy() method

			ns.widget.mobile.Slider = Slider;
			engine.defineWidget(
				"Slider",
				"select[data-role='slider'],select[data-type='range']",
				[],
				Slider,
				'mobile'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Slider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
