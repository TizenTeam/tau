/*global window, define, ns */
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
 * # Toggle Switch Widget
 * Shows a 2-state switch.
 *
 * The toggle switch widget shows a 2-state switch on the screen.
 * If defined with select type with options it creates toggles with labels
 * On the toggle with labels its possible to drag or flip the handle
 * or tap one side of the switch.
 *
 * We still support toggles defined with select tag for backward compatibility
 *
 * ## Default selectors
 * INPUT tags with _data-role=toggleswitch_ or SELECT tags
 * with _data-role=slider_
 * or
 *  _data-role=toggleswitch_
 * changed to toggle switch
 * To add a toggle switch widget to the application, use the following code:
 *
 *		@example
 *		<input type="checkbox" data-role="toggleswitch">
 *
 *		@example
 *		<input type="checkbox" id="checkbox-1" data-role="toggleswitch"/>
 *		<label for="checkbox-1"></label>
 *
 *		@example
 *		<select name="flip-11" id="flip-11" data-role="slider">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *
 *		@example
 *		<select name="flip-11" id="flip-11" data-role="toggleswitch">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *
 *		@example
 *		<select name="flip-11" id="flip-11" data-role="toggleswitch">
 *			<option value="off">off option</option>
 *			<option value="on">on option</option>
 *		</select>
 *
 * ## Manual constructor
 * For manual creation of toggle switch widget you can use constructor of
 * widget from **tau** namespace:
 *
 *		@example
 *		<select id="toggle" name="flip-11" id="flip-11" data-role="slider"
 *		data-mini="true">
 *			<option value="off"></option>
 *			<option value="on"></option>
 *		</select>
 *		<script>
 *			var toggleElement = document.getElementById("toggle"),
 *				toggle = tau.widget.ToggleSwitch(toggleElement);
 *		</script>
 *
 * ## JavaScript API
 *
 * ToggleSwitch widget hasn't JavaScript API.
 *
 * @class ns.widget.mobile.ToggleSwitch
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
		 	"../../../../core/engine",
		 	"../../../../core/theme",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/manipulation",
			"../../../../core/event",
			"../../../../core/widget/core/Button",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ToggleSwitch = function () {
				var self = this;
					/**
					 * All possible widget options
					 * @property {Object} options
					 * @property {?string} [options.trackTheme=null] sets
					 * the color scheme (swatch) for the slider's track
					 * @property {boolean} [options.disabled=false] start
					 * widget as enabled / disabled
					 * @property {?boolean} [options.mini=false] size
					 * of toggle switch
					 * @property {boolean} [options.highlight=true] if set
					 * then toggle switch can be highligted
					 * @property {?boolean} [options.inline=false] if value is
					 * "true" then toggle switch has css property
					 * display = "inline"
					 * @property {string} [options.theme=null] theme of widget
					 * @member ns.widget.mobile.ToggleSwitch
					 */
					self.options = {
						trackTheme: null,
						disabled: false,
						mini: null,
						highlight: true,
						inline: null,
						theme: null
					};
					self._ui = {};
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				events = ns.event,
				DOMutils = ns.util.DOM,
				Button = ns.widget.core.Button,
				themes = ns.theme,
				/**
				* @property {Object} selectors Alias for class ns.util.selectors
				* @member ns.widget.mobile.ToggleSwitch
				* @private
				* @static
				*/
				selectors = ns.util.selectors,

				classes = {
					//slider
					sliderSwitch: "ui-slider-switch",
					toggleInneroffset: "ui-slider-inneroffset",
					sliderInline: "ui-slider-inline",
					sliderMini: "ui-slider-mini",
					sliderHandle: "ui-slider-handle",
					flipHandle: "ui-flip-handle",
					slider: "ui-slider",
					sliderLabel: "ui-slider-label",
					sliderLabelTheme: "ui-slider-label-",
					sliderInneroffset: "ui-slider-inneroffset",
					sliderLabelA: "ui-slider-label-a",
					sliderSnapping : "ui-slider-handle-snapping",
					//sliderBg: "ui-slider-bg",
					sliderContainer: "ui-slider-container",
					sliderStateActive: "ui-state-active",

					//input
					toggleSwitchInput: "ui-slider-switch-input",
					toggle: "ui-toggle-switch",
					toggleInputLabel: "ui-toggle-label",
					toggleHandler: "ui-switch-handler",
					toggleOff: "ui-toggle-off",
					toggleOn: "ui-toggle-on"
				},
				keyCode = {
					HOME: 36,
					END: 35,
					PAGE_UP : 33,
					PAGE_DOWN: 34,
					UP: 38,
					RIGHT: 39,
					DOWN: 40,
					LEFT: 37
				};

			ToggleSwitch.prototype = new BaseWidget();

			/**
			 * Dictionary for ToggleSwitch related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.ToggleSwitch
			 * @static
			 * @readonly
			 */
			ToggleSwitch.classes = classes;

			/**
			* Dictionary for keyboard codes
			* @property {Object} keyCode
			* @member ns.widget.mobile.ToggleSwitch
			* @static
			* @readonly
			*/
			ToggleSwitch.keyCode = keyCode;

			//for select
			/**
			 * Returns default position of the slider, if the element is input
			 * @method getInitialValue
			 * @param {string} tag
			 * @param {HTMLElement} element
			 * @return {number}
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function getInitialValue(tag, element) {
				return tag === "input" ? parseFloat(element.value) :
						element.selectedIndex;
			}

			/**
			 * Sets the width for labels which represents a value of widget
			 * @method refreshLabels
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @param {number} percent
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function refreshLabels(self, percent) {
				var getElementWidth = DOMutils.getElementWidth,
					handlePercent = getElementWidth(self._ui.handle, "outer") /
							getElementWidth(self._ui.slider, "outer") * 100,
					aPercent = percent && handlePercent +
							(100 - handlePercent) * percent / 100,
					bPercent = percent === 100 ? 0 : Math.min(handlePercent +
							100 - aPercent, 100),
					i = self._labels.length,
					label;

				while (i--) {
					label = self._labels[i];
					label.style.width =
							(label.classList.contains(classes.sliderLabelA) ?
								aPercent : bPercent) + "%";
				}
			}

			/**
			 * Sets the width for labels which represents a value of widget
			 * @method addRemoveClassesBasedOnProcentage
			 * @param {number} percent
			 * @param {classList} localClasses
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function addRemoveClassesBasedOnProcentage(percent, localClasses) {
				if (percent === 100 &&
						localClasses.contains(classes.sliderSnapping)) {
					localClasses.remove(classes.toggleOff);
					localClasses.add(classes.toggleOn);
				} else if (percent === 0 &&
						localClasses.contains(classes.sliderSnapping)) {
					localClasses.remove(classes.toggleOn);
					localClasses.add(classes.toggleOff);
				}
			}
			/**
			 * Refresh all the elements of Slider widget
			 * @method refresh
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @param {Object|number|null} value
			 * @param {boolean} [isFromControl] tells if the refresh was called from callbacks
			 * @param {boolean} [preventInputUpdate] prevents change value for input
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function refresh(self, value, isFromControl, preventInputUpdate) {
				var data,
					percent,
					newValue,
					valModStep,
					alignValue,
					valueChanged,
					touchThreshold,
					newValueOption,
					sliderOffsetLeft,
					min = 0,
					control = self.element,
					handle = self._ui.handle,
					slider = self._ui.slider,
					localClasses = handle.classList,
					controlType = control.nodeName.toLowerCase(),
					max = control.querySelectorAll("option").length - 1,
					stepValue = DOMutils.getNumberFromAttribute(control,
							"step", "float", 0),
					step = (controlType === "input" && stepValue > 0) ?
							stepValue : 1;

				if (controlType === "input") {
					min = DOMutils.getNumberFromAttribute(control,
							"min",  "float", min);
					max = DOMutils.getNumberFromAttribute(control,
							"max", "float", max);
				}

				if (isNaN(step)) {
					step = 0;
				}

				if (self.options.disabled) {
					self._disable();
				}

				// If changes came from event
				if (typeof value === "object") {
					data = value;
					// @TODO take parameter out to config
					touchThreshold = 8;
					sliderOffsetLeft =
							DOMutils.getElementOffset(slider).left;

					// If refreshing while not dragging
					// or movement was within threshold
					if (!self._dragging ||
							data.pageX < sliderOffsetLeft - touchThreshold ||
							data.pageX > sliderOffsetLeft +
							slider.offsetWidth + touchThreshold) {
						return;
					}

					// Calculate new left side percent
					percent = ((data.pageX - sliderOffsetLeft) /
							slider.offsetWidth) * 100;

				// If changes came from input value change
				} else {
					if (value === null) {
						value = getInitialValue(controlType, control);
					}
					if (isNaN(value)) {
						return;
					}
					// While dragging prevent jumping by assigning
					// last percentage value
					if (self._dragging && self._lastPercent) {
						percent = self._lastPercent;
					} else {
						percent = (parseFloat(value) - min) / (max - min) * 100;
					}
				}

				// Make sure percent is a value between 0 - 100;
				percent = Math.max(0, Math.min(percent, 100));
				self._lastPercent = percent;

				newValue = (percent / 100) * (max - min) + min;

				//from jQuery UI slider, the following source will round
				// to the nearest step
				valModStep = (newValue - min) % step;
				alignValue = newValue - valModStep;

				if (Math.abs(valModStep) * 2 >= step) {
					alignValue += (valModStep > 0) ? step : (-step);
				}
				// Since JavaScript has problems with large floats, round
				// the final value to 5 digits after the decimal point
				// (see jQueryUI: #4124)
				newValue = parseFloat(alignValue.toFixed(5));

				newValue = Math.max(min, Math.min(newValue, max));

				handle.style.left = percent + "%";
				newValueOption = control.querySelectorAll("option")[newValue];
				handle.setAttribute("aria-valuenow", controlType === "input" ?
						newValue : newValueOption && newValueOption.value);
				handle.setAttribute("aria-valuetext", controlType === "input" ?
						newValue : newValueOption && newValueOption.innerText);
				handle.setAttribute("title", controlType === "input" ?
						newValue : newValueOption && newValueOption.innerText);

				addRemoveClassesBasedOnProcentage(percent, localClasses);

				// drag the label widths
				if (self._labels) {
					refreshLabels(self, percent);
				}

				if (!preventInputUpdate) {
					valueChanged = false;
					// update control"s value
					if (controlType === "input") {
						valueChanged = control.value !== newValue;
						control.value = newValue;
					} else {
						valueChanged = control.selectedIndex !== newValue;
						control.selectedIndex = newValue;
					}
					if (!isFromControl && valueChanged) {
						// Trigger change event on the control element
						events.trigger(control, "change");
					}
				}
			}

			/**
			 * Disable any action when TouchMove event appear
			 * @method onTouchMove
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onTouchMove(event) {
				event.stopPropagation();
				event.preventDefault();
			}

			/**
			 * Function fires on mouse move event
			 * @method onVmouseMove
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onVmouseMove(self, event) {
				var element = self.element,
					tagName = element.nodeName.toLowerCase(),
					handle = self._ui.handle;
				// NOTE: we don't do this in refresh because we still want to
				//	support programmatic alteration of disabled inputs
				if (self._dragging && !self.options.disabled) {

					// self.mouseMoved must be updated before refresh()
					// because it will be used in the control "change" event
					self._mouseMoved = true;

					if (tagName === "select") {
						// make the handle move in sync with the mouse
						handle.classList.remove(classes.sliderSnapping);
					}

					refresh(self, event);
					// only after refresh() you can calculate self.userModified
					self._userModified = self._beforeStart !==
						element.selectedIndex;
					events.preventDefault(event);
				}
			}

			/**
			 * Function fires on mouse move event
			 * @method sliderMouseUp
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function sliderMouseUp(self) {
				var _beforeStart;

				if (self._dragging) {
					self._dragging = false;
					_beforeStart = self._beforeStart;

					if (self.element.nodeName.toLowerCase() === "select") {
						// make the handle move with a smooth transition
						self._ui.handle.classList.add(classes.sliderSnapping);

						if (self._mouseMoved) {
							// this is a drag, change the value only
							// if user dragged enough
							if (self._userModified) {
								refresh(self, _beforeStart === 0 ? 1 : 0);
							} else {
								refresh(self, _beforeStart);
							}
						} else {
							refresh(self, _beforeStart === 0 ? 1 : 0);
						}
					}
					self._mouseMoved = false;
				}
			}

			/**
			* Callback change the value of input type=checkbox
			* (method stricly for toggleswitch based oninput tag)
			* @method onChangeValue
			* @param {ns.widget.mobile.ToggleSwitch} self
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function onChangeValue(self){
				self.element.selectedIndex = (self._ui.input.checked) ? 1 :0;
				if (self.element.nodeName.toLowerCase() === "select") {
					events.trigger(self.element, "change");
				}
			}

			/**
			 * Call refresh when state change
			 * @method onFocus
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onChange(self) {
				if (!self._mouseMoved) {
					refresh(self, self._getValue(), true);
				}
			}

			/**
			 * Call refresh when blur event ocur
			 * @method onBlur
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onBlur(self) {
				refresh(self, self._getValue(), true);
			}

			/**
			 * Triggers focus event on the target element
			 * @method onVmousedown
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onVmousedown(event) {
				events.trigger(event.target, "focus");
			}

			/**
			 * Stoping event
			 * @method onVclick
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onVclick(event) {
				event.stopPropagation();
				event.preventDefault();
			}

			function onLabelVclick(input, ev) {
				input.checked = (input.type === "checkbox") ? !input.checked : true;
				events.preventDefault(ev);
			}
			/**
			 * Manage intearaction of widget with key down events
			 * @method onKeydown
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onKeydown(self, event) {
				var element = self.element,
					tagName = element.nodeName.toLowerCase(),
					index = getInitialValue(tagName, element),
					eventkeyCode = event.keyCode,
					classList = event.target.classList,
					step = parseFloat(self.element.getAttribute( "step" ) ||
							1);

				if (self.options.disabled) {
					return;
				}

				// In all cases prevent the default and mark the handle
				// as active
				switch (eventkeyCode) {
					case keyCode.HOME:
					case keyCode.END:
					case keyCode.PAGE_UP:
					case keyCode.PAGE_DOWN:
					case keyCode.UP:
					case keyCode.RIGHT:
					case keyCode.DOWN:
					case keyCode.LEFT:
						event.preventDefault();
						if (!self._keySliding) {
							self._keySliding = true;
							classList.add(classes.sliderStateActive);
						}
						break;
				}
				// move the slider according to the keypress
				switch (eventkeyCode) {
					case keyCode.HOME:
						refresh(self, min);
						break;
					case keyCode.END:
						refresh(self, max);
						break;
					case keyCode.PAGE_UP:
					case keyCode.UP:
					case keyCode.RIGHT:
						refresh(self, index + step);
						break;
					case keyCode.PAGE_DOWN:
					case keyCode.DOWN:
					case keyCode.LEFT:
						refresh(self, index - step);
						break;
				}


			}

			/**
			 * Remove slider state active
			 * @method onKeyup
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onKeyupHandle (self) {
				if (self._keySliding) {
					self._keySliding = false;
					self._ui.handle.classList.remove(classes.sliderStateActive);
				}
			}

			/**
			 * Call refresh when keyUp event ocur
			 * @method onKeyup
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onKeyupElement(self) {
				refresh(self, self._getValue(), true, true);
			}

			/**
			 * Refresh widget and add css class
			 * @method onTouchend
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onTouchend(self) {
				var element = self.element,
					tagName = element.nodeName.toLowerCase();

				self._dragging = false;
				self._ui.handle.classList.add(classes.sliderSnapping);
				refresh(self, getInitialValue(tagName, element),
						true, true);
			}

			/**
			 * Callback responsible for refreshing the widget
			 * @method onVmousedown
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onVmousedownRefresh(self, event) {
				var element = self.element;

				if (self.options.disabled) {
					return false;
				}

				self._dragging = true;
				self._userModified = false;
				self._mouseMoved = false;
				//element.nodeName.toLowerCase()
				if (element.nodeName.toLowerCase() === "select") {
					self._beforeStart = element.selectedIndex;
				}
				refresh(self, event);
				return false;
			}

			/**
			* Take the label related to the given input
			* (method stricly for toggleswitch based oninput tag)
			* @method getLabel
			* @param {HTMLElement} input
			* @return {HTMLElement}
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function getLabel(input) {
				var parent = selectors.getClosestByTag(input, "label"),
					label;
				if (parent) {
					parent.parentNode.replaceChild(parent.firstElementChild,
							parent);
					return parent;
				}
				if (input.id) {
					parent = selectors.getClosestBySelector(input,
						"form, fieldset, [data-role='page'], [data-role='dialog']");
					if (parent) {
						label = parent.querySelector("label[for='"+
								input.id + "']");
						if (label) {
							return label;
						}
					}
				}

				label = createElement("label");
				if (input.id) {
					label.setAttribute("for", input.id);
				}
				return label;
			}

			/**
			* Simplify creating dom elements
			* (method stricly for toggleswitch based oninput tag)
			* @method createElement
			* @param {String} name
			* @return {HTMLElement}
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function createElement(name) {
				return document.createElement(name);
			}

			/**
			* Creates and set up input element
			* @method setUpInput
			* @return {HTMLElement}
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function setUpInput() {
				var inputElement = createElement("input");

				inputElement.type = "checkbox";
				inputElement.className = classes.toggleSwitchInput;
				return inputElement;
			}

			/**
			* Creates wrapper for slider
			* @method createWrapper
			* @param {HTMLElement} domSlider
			* @return {HTMLElement}
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function createWrapper(domSlider) {
				var wrapper,
					domSliderChildNode = domSlider.childNodes,
					j, length;

				wrapper = createElement("div");
				wrapper.className = classes.sliderInneroffset;

				for (j = 0, length = domSliderChildNode.length;
						j < length; j++) {
					wrapper.appendChild(domSliderChildNode[j]);
				}
				return wrapper;
			}

			/**
			* Adding classes for slider
			* @method addClassesForSlider
			* @param {HTMLElement} domSlider
			* @param {String} sliderBtnDownTheme
			* @param {Object} btnClasses
			* @param {Object} options
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function addClassesForSlider(domSlider, sliderBtnDownTheme, btnClasses, options) {
				var domSliderClassList = domSlider.classList;

				domSliderClassList.add(classes.slider);
				domSliderClassList.add(classes.sliderSwitch);
				domSliderClassList.add(sliderBtnDownTheme);
				domSliderClassList.add(btnClasses.uiBtnCornerAll);

				if (options.inline) {
					domSliderClassList.add(classes.sliderInline);
				}
				if (options.mini) {
					domSliderClassList.add(classes.sliderMini);
				}
			}

			/**
			* Simplify creating dom elements
			* @method buildOptions
			* @param {HTMLElement} element
			* @param {Object} btnClasses
			* @param {String} sliderBtnDownTheme
			* @param {HTMLElement} domSlider
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function buildOptions(element, btnClasses, sliderBtnDownTheme, domSlider) {
				var i,
					side,
					sliderImg,
					sliderTheme,
					sliderImgClassList = null;

				for (i = 0; i < element.length; i++) {
					side = i ? "a" : "b";
					sliderTheme = i ? btnClasses.uiBtnActive :
							sliderBtnDownTheme;
					/* TODO - check sliderlabel */
					sliderImg =
						createElement("span");
					sliderImgClassList = sliderImg.classList;
					sliderImgClassList.add(classes.sliderLabel);
					sliderImgClassList.add(classes.sliderLabelTheme +
							side);
					sliderImgClassList.add(sliderTheme);
					sliderImgClassList.add(btnClasses.uiBtnCornerAll);

					sliderImg.setAttribute("role", "img");
					sliderImg.appendChild(document.createTextNode(
							element[i].innerHTML));
					domSlider.insertBefore(
							sliderImg, domSlider.firstChild);
				}
			}

			/**
			* Adding widget object to the callbacks
			* @method bindCallbacksForSelectTag
			* @param {ns.widget.mobile.ToggleSwitch} self
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function bindCallbacksForSelectTag(self){
				self._onKeyupElement = onKeyupElement.bind(null, self);
				self._sliderMouseUp = sliderMouseUp.bind(null, self);
				self._onKeyupHandle = onKeyupHandle.bind(null, self);
				self._onVmouseMove = onVmouseMove.bind(null, self);
				self._onTouchend = onTouchend.bind(null, self);
				self._onKeydown = onKeydown.bind(null, self);
				self._onChange = onChange.bind(null, self);
				self._onBlur = onBlur.bind(null, self);
				self._onVmousedownRefresh =
					onVmousedownRefresh.bind(null, self);
			}

			/**
			* Remove events from Slider which is based on Select Tag
			* @method removeEventsFromToggleBasedOnSelect
			* @param {ns.widget.mobile.ToggleSwitch} self
			* @param {HTMLElement} element
			* @param {HTMLElement} handle
			* @param {HTMLElement} slider
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function removeEventsFromToggleBasedOnSelect(self, element, handle, slider) {

				element.removeEventListener("change", self._onChange, false);
				element.removeEventListener("keyup", self._onKeyupElement, false);
				element.removeEventListener("blur", self._onBlur, false);

				handle.removeEventListener("vmousedown", self._onVmousedown,
						false);
				handle.removeEventListener("vclick", self.onVclick, false);
				handle.removeEventListener("keydown", self._onKeydown, false);
				handle.removeEventListener("keyup", self._onKeyupHandle, false);

				slider.removeEventListener("vmousedown",
						self._onVmousedownRefresh, false);
				slider.removeEventListener("vmousemove", self._onVmouseMove,
						false);
				slider.removeEventListener("vmouseup", self._sliderMouseUp,
						false);
			}

			/**
			* Build Slider based on Select Tag
			* @method buildSliderBasedOnSelectTag
			* @param {ns.widget.mobile.ToggleSwitch} self
			* @param {HTMLElement} element
			* @param {HTMLElement} sliderContainer
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function buildSliderBasedOnSelectTag(self, element, sliderContainer) {
				var domSlider = createElement("div"),
					sliderBtnDownTheme,
					options = self.options,
					elementId = element.getAttribute("id"),
					btnClasses = Button.classes,
					protoOptions = ToggleSwitch.prototype.options,
					parentTheme = themes.getInheritedTheme(element,
							(protoOptions && protoOptions.theme) || "s"),
					domHandle = createElement("a"),
					trackTheme,
					theme = options.theme = options.theme || parentTheme;

				trackTheme = options.trackTheme = options.trackTheme ||
				parentTheme;

				domSlider.setAttribute("id", elementId + "-slider");
				sliderBtnDownTheme = btnClasses.uiBtnDownThemePrefix +
						trackTheme;

				addClassesForSlider(domSlider, sliderBtnDownTheme, btnClasses, options);

				domHandle.className = classes.sliderHandle;
				domSlider.appendChild(domHandle);
				domHandle.setAttribute("id", elementId + "-handle");

				domSlider.appendChild(createWrapper(domSlider));
				// make the handle move with a smooth transition
				domHandle.classList.add(classes.sliderSnapping);
				buildOptions(element, btnClasses, sliderBtnDownTheme, domSlider);
				// to make a difference between slider and flip type toggle
				domHandle.classList.add(classes.flipHandle);

				sliderContainer = domSlider;
				element.classList.add(classes.sliderSwitch);
				domHandle.style.right = "auto";
				element.parentNode.insertBefore(sliderContainer,
						element.nextSibling);
			}

			/**
			* Build Toggle based on Select Tag
			* @method buildToggleBasedOnSelectTag
			* @param {HTMLElement} element
			* @param {HTMLElement} divHandler
			* @param {HTMLElement} divInneroffset
			* @param {HTMLElement} sliderContainer
			* @param {HTMLElement} label
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function buildToggleBasedOnSelectTag(element, divHandler, divInneroffset, sliderContainer, label) {
				ns.warn("Please use input[data-role='toggleswitch'] " +
						"selector in order to define button like " +
						"toggle, select[data-role='slider'] is " +
						"deprecated");

				label.className = classes.toggleInputLabel;
				sliderContainer.className = classes.toggle;
				divHandler.className = classes.toggleHandler;
				divInneroffset.className = classes.toggleInneroffset;

				sliderContainer.appendChild(divHandler);

				label.appendChild(setUpInput());
				label.appendChild(sliderContainer);
				label.appendChild(divInneroffset);

				element.parentNode.insertBefore(label,
						element.nextSibling);
				label.appendChild(element);
			}

			/**
			* Build Toggle based on Input Tag
			* @method buildToggleBasedOnInputTag
			* @param {HTMLElement} element
			* @param {HTMLElement} divHandler
			* @param {HTMLElement} divInneroffset
			* @param {HTMLElement} sliderContainer
			* @param {HTMLElement} label
			* @private
			* @static
			* @member ns.widget.mobile.ToggleSwitch
			*/
			function buildToggleBasedOnInputTag(element, divHandler, divInneroffset, sliderContainer, label) {
				var mountPointForLabel = element.nextSibling;

				sliderContainer.className = classes.toggle;
				divHandler.className = classes.toggleHandler;
				element.className = classes.toggleSwitchInput;
				divInneroffset.className = classes.toggleInneroffset;

				sliderContainer.appendChild(divHandler);

				label = getLabel(element);
				label.className = classes.toggleInputLabel;
				label.appendChild(element);
				label.appendChild(sliderContainer);
				label.appendChild(divInneroffset);

				mountPointForLabel.parentNode.insertBefore(label,
						mountPointForLabel);
			}

			/**
			 * Build ToggleSwitch
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._build = function (element) {
				var roleType,
					elementsOption,
					label = createElement("label"),
					divHandler = createElement("div"),
					divInneroffset = createElement("div"),
					controlType = element.nodeName.toLowerCase(),
					sliderContainer = createElement("div");

				this._ui.label = label;
				//when the input with input[data-role='toggleswitch'],
				//button like toggle
				if (controlType === "input") {
					buildToggleBasedOnInputTag(element, divHandler, divInneroffset, sliderContainer, label);
				} else {
					roleType = element.getAttribute("role");
					elementsOption = element.querySelector("option");
					if (roleType === "slider"){
						ns.warn("Please use select[data-role='toggleswitch'] " +
								"selector in order to define widget, " +
								"select[data-role='slider'] is depreciated");
					}
					//hide select
					element.className = classes.sliderSwitch;

					//if the select type, two empty options (simple on/off)
					if (elementsOption && elementsOption.innerText === "") {
						buildToggleBasedOnSelectTag(element, divHandler, divInneroffset, sliderContainer, label);
					//logic moved from slider widget
					} else {
						buildSliderBasedOnSelectTag(this, element, sliderContainer);
					}
				}
				return element;
			};

			/**
			* Inits widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.ToggleSwitch
			* @instance
			*/
			ToggleSwitch.prototype._init = function (element) {
				var controlType = element.nodeName.toLowerCase(),
					elementId,
					self = this,
					elementsOption = element.querySelector("option") || "";

				//because the select with empty options is replaced with
				//input I just need and input on widget instance
				if (controlType === "input" || elementsOption.innerText === "") {
					self._ui.input = element.parentElement.firstChild;
				} else {
					elementId = element.id;
					self._ui.slider = document.getElementById(elementId +
							"-slider");
					self._ui.handle = document.getElementById(elementId +
							"-handle");
					self._ui.container = document.getElementById(elementId +
							"-container") || element;
					self._type = element.tagName.toLowerCase();
					self._labels = selectors.getChildrenByClass(self._ui.slider,
							ToggleSwitch.classes.sliderLabel);
					refresh(self, self._getValue());
				}
			};

			/**
			 * Get or Set value of the widget
			 *
			 * Return element value or set the value
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			var slider = document.getElementById("slider"),
			 *				sliderWidget = tau.widget.Slider(slider),
			 *			// value contains index of select tag
			 *			value = sliderWidget.value();
			 *			//sets the index for the toggle
			 *			sliderWidget.value("1");
			 *		</script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			// value contains index of select tag
			 *			$( "#slider" ).slider( "value" );
			 *			// sets the index for the toggle
			 *			$( "#slider" ).slider( "value", "1" );
			 *		</script>
			 *
			 * @method value
			 * @return {string} In get mode return element value or element
			 * selected index based on tag name.
			 * @since 2.3
			 * @member ns.widget.mobile.ToggleSwitch
			 */

			/**
			 * Get value of toggle switch. If widget is based on input type
			 * tag otherwise it return index of the element
			 * @method _getValue
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._getValue = function () {
				var self = this,
					element = self.element;

				return self._type === "input" ?
						parseFloat(element.value) :
							element.selectedIndex;
			};

			/**
			 * Set value of toggle switch
			 * @method _setValue
			 * @param {string} value
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._setValue = function (value) {
				var self = this,
					element = self.element;

				if (self._type === "input") {
					element.value = value;
				} else {
					element.selectedIndex = value;
				}
			};

			/**
			 * Refresh a slider markup.
			 *
			 * This method will rebuild while DOM structure of widget.
			 *
			 * This method should be called after are manually change in HTML
			 * attributes of widget DOM structure.
			 *
			 * This method is called automatically after change any option
			 * of widget.
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			var slider = document.getElementById("slider"),
			 *				  sliderWidget = tau.widget.Slider(slider),
			 *			sliderWidget.refresh();
			 *		</script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			$( "#slider" ).slider( "refresh" );
			 *		</script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.ToggleSwitch
			 */

			/**
			 * Refresh slider
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._refresh = function () {
				var self = this;
				if (self._ui.slider && self.value !== self._getValue()) {
					refresh(self, self._getValue());
				}
			};

			/**
			 * Enable the slider
			 *
			 * Method removes disabled attribute on slider and changes look
			 * of slider to enabled state.
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			var slider = document.getElementById("slider"),
			 *				  sliderWidget = tau.widget.Slider(slider),
			 *			sliderWidget.enable();
			 *		</script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			$( "#slider" ).slider( "enable" );
			 *		</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.ToggleSwitch
			 */

			/**
			 * Enable slider
			 * @method _enable
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._enable = function (element) {
				var btnClasses = Button.classes,
					self = this,
					slider = self._ui.slider;

				if (slider) {
					element.removeAttribute("disabled");
					slider.classList.remove(btnClasses.uiDisabled);
					slider.setAttribute("aria-disabled", false);
					self.options.disabled = false;
				}
			};

			/**
			 * Disable the slider
			 *
			 * Method sets disabled attribute on slider and changes look
			 * of slider to disabled state.
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			var slider = document.getElementById("slider"),
			 *				sliderWidget = tau.widget.Slider(slider),
			 *			sliderWidget.disable();
			 *		</script>
			 *
			 * ####If jQuery library is loaded, its method can be used:
			 *
			 *		@example
			 *		<select id="slider" name="flip-11" data-role="slider">
			 *			<option value="off"></option>
			 *			<option value="on"></option>
			 *		</select>
			 *		<script>
			 *			$( "#slider" ).slider( "disable" );
			 *		</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.ToggleSwitch
			 */

			/**
			 * Disable slider
			 * @method _disable
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._disable = function (element) {
				var self = this,
					btnClasses = Button.classes,
					slider = self._ui.slider;

				if (slider) {
					element.setAttribute("disabled", "disabled");
					slider.classList.add(btnClasses.uiDisabled);
					slider.setAttribute("aria-disabled", true);
					self.options.disabled = true;
				}
			};

			/**
			* Binds events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.ToggleSwitch
			* @instance
			*/
			ToggleSwitch.prototype._bindEvents = function () {
				var self = this,
					ui = self._ui,
					element = self.element,
					handle = ui.handle,
					tagName = element.nodeName.toLowerCase(),
					slider = ui.slider,
					elementsOption = element.querySelector("option") || "";

				if (tagName === "input" || elementsOption.innerText === "") {
					self._onChangeValue = onChangeValue.bind(null, self);
					self._onLabelVclick = onLabelVclick.bind(null, ui.input);

					ui.input.addEventListener("change", self._onChangeValue, true);
					ui.label.addEventListener("vclick", self._onLabelVclick, true);
				} else {
					bindCallbacksForSelectTag(self);

					element.addEventListener("keyup", self._onKeyupElement,
							false);
					element.addEventListener("change", self._onChange, false);
					element.addEventListener("blur", self._onBlur, false);

					handle.addEventListener("keyup", self._onKeyupHandle,
							false);
					handle.addEventListener("keydown", self._onKeydown, false);
					handle.addEventListener("vclick", onVclick, false);
					handle.addEventListener("vmousedown", onVmousedown,
							false);

					slider.addEventListener("vmousedown",
							self._onVmousedownRefresh, false);
					slider.addEventListener("vmousemove", self._onVmouseMove,
							false);
					slider.addEventListener("vmouseup", self._sliderMouseUp,
							false);
				}
			};

			function removeAttributesWhenDestroy(element) {
				element.removeAttribute("data-tau-name");
				element.removeAttribute("aria-disabled");
				element.removeAttribute("data-tau-bound");
				element.removeAttribute("data-tau-built");
			}
			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._destroy = function () {
				var self = this,
					element = self.element,
					ui = self._ui,
					handle = ui.handle,
					slider = ui.slider,
					label = ui.label,
					tagName = element.nodeName.toLowerCase(),
					elementsOption = element.querySelector("option") || "";

				if (tagName === "input" || elementsOption.innerText === "") {
					ui.input.removeEventListener("change", self._onChangeValue, true);
					label.addEventListener("vclick", self._onLabelVclick, true);

					//cleaning toggle based on input type
					if (tagName === "input") {
						label.classList.remove(classes.toggleInputLabel);
						if (label.parentElement) {
							label.parentElement.insertBefore(element, label);
						}
						label.innerHTML = "";

						element.removeAttribute("aria-disabled");
						element.classList.remove(classes.toggleSwitchInput);

					//cleaning toggle based on select type
					} else {
						if (element.nextElementSibling &&
							element.nextElementSibling.tagName.toLowerCase() === "label") {
							//remove attributes
							removeAttributesWhenDestroy(element);
							//remove classes
							element.classList.remove(classes.sliderSwitch);
							//remove visible representative
							element.parentElement.removeChild(
									element.nextElementSibling);
						}
					}
				} else {
					removeEventsFromToggleBasedOnSelect(self, element, handle, slider);

					removeAttributesWhenDestroy(element);
					element.classList.remove(classes.sliderSwitch);
					element.parentElement.removeChild(element.nextElementSibling);
				}

				events.trigger(document, "destroyed", {
					widget: "ToggleSwitch",
					parent: element.parentNode
				});
			};

			ns.widget.mobile.ToggleSwitch = ToggleSwitch;
			engine.defineWidget(
				"ToggleSwitch",
				"select[data-role='toggleswitch']," +
				"input[data-role='toggleswitch']," +
				"select[data-role='slider']," +
				"select.ui-toggleswitch, input.ui-toggleswitch",
				[],
				ToggleSwitch,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.ToggleSwitch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
