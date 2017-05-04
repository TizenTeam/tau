/*global window, ns, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Text Enveloper
 * Text enveloper component changes a text item to a button.
 *
 * The TextEnveloper component is that makes text to a chunk divided by delimiter.
 * When you managed various word block, this component is very useful.
 * This component was consisted by input area and word block area.
 * Word block was made after insert text to input area and press enter key.
 * If you want to delete word block, you should press the backspace key.
 * If you focus out the input area, word block is changed to minimize.
 *
 * ##HTML Examples
 * ###Create simple TextEnveloper from div using data-role:
 *
 *		@example
 *			<div data-role="textenveloper"></div>

 * ###Create simple TextEnveloper from div using class:
 *
 *		@example
 *			<div class="ui-text-enveloper"></div>
 *
 * ##Manual constructor
 * ###For manual creation of progressbar component you can use constructor
 * of component:
 *
 *		@example
 *			<div id="TextEnveloper"><div>
 *			 <script>
 *				var textEnveloper = tau.widget.TextEnveloper(
 *					document.getElementById('TextEnveloper')
 *				);
 *			</script>
 *
 * If jQuery library is loaded, it's method can be used:
 *
 *		@example
 *			<div id="TextEnveloper"><div>
 *			 <script>
 *				$("#TextEnveloper").TextEnveloper();
 *			</script>
 *
 * Initialize the component
 *
 *		@example
 *			<script>
 *				var textEnveloperElement = document.getElementById("ns-TextEnveloper"),
 *				TextEnveloper = tau.component.TextEnveloper(textEnveloperElement);
 *			</script>
 *
 * To call method on component you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		var textEnveloperElement = document.getElementById("ns-tokentext"),
 *			TextEnveloper = tau.component.TextEnveloper(textEnveloperElement);
 *
 *		TextEnveloper.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		$(".selector").TextEnveloper("methodName", methodArgument1, ...);
 *
 * ##Events
 *
 * TextEnveloper trigger various events.
 * - newvalue : 'newvalue' event is triggered when user press the ENTER key after insert text to input tag.
 * - added: 'added' event is triggered when textEnveloper button was added.
 * - removed: 'removed' event is triggered when textEnveloper button was removed.
 *
 * @since 2.4
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 * @class ns.widget.mobile.TextEnveloper
 * @extends ns.widget.BaseWidget
 */

(function (window, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/widget/core/Page",
			"../mobile",
			"../mobile/BaseWidgetMobile",
			"./TextInput"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/**
			 * BaseWidget alias variable
			 * @property {Object} BaseWidget alias variable
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,

				/**
				 * Engine alias variable
				 * @property {ns.engine} engine alias variable
				 * @private
				 * @static
				 * @member ns.widget.mobile.TextEnveloper
				 */
				engine = ns.engine,

				events = ns.event,
				/**
				 * Dictionary object containing commonly used component classes
				 * @property {Object} classes
				 * @static
				 * @private
				 * @readonly
				 * @member ns.widget.mobile.TextEnveloper
				 */
				classes = {
					TEXT_ENVELOPER: "ui-text-enveloper",
					TEXT_ENVELOPER_INPUT: "ui-text-enveloper-input",
					TEXT_ENVELOPER_BTN: "ui-text-enveloper-btn",
					TEXT_ENVELOPER_BTN_SELECTED: "ui-text-enveloper-btn-selected",
					TEXT_ENVELOPER_BTN_ACTIVE: "ui-text-enveloper-btn-active",
					TEXT_ENVELOPER_BTN_BLUR: "ui-text-enveloper-btn-blur",
					TEXT_ENVELOPER_BTN_EXPANDED: "ui-text-enveloper-btn-expanded",
					TEXT_ENVELOPER_START: "ui-text-enveloper-start",
					TEXT_ENVELOPER_TEXTLINE: "ui-text-input-textline",
					TEXT_ENVELOPER_SLASH: "ui-text-enveloper-slash",
					TEXT_ENVELOPER_SLASH_HIDDEN: "ui-text-enveloper-slash-hidden",
					TEXT_ENVELOPER_BTN_SLASH: "ui-text-enveloper-btn-separator"
				},

				keyCode = {
					BACKSPACE: 8,
					ENTER: 13
				},

				eventName = {
					NEW_VALUE: "newvalue",
					ADDED: "added",
					REMOVED: "removed",
					SELECT: "select",
					UNSELECT: "unselect",
					RESIZE: "resize"
				},
				/**
				 * Local constructor function
				 * @method TextEnveloper
				 * @private
				 * @member ns.widget.mobile.TextEnveloper
				 */
				TextEnveloper = function () {
					var self = this;
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {string} [options.label="To : "] Sets a label
					 * as a guide for the user
					 * @property {string} [options.link=""] Sets the ID of the page or
					 * the URL of other HTML file
					 * @property {string} [options.description="+ {0}"] Manages
					 * the message format
					 * @property {boolean} [options.groupOnBlur = true] Group elements when blur form input
					 * @property {boolean} [options.selectable = false] Give possibility of select elements
					 * @member ns.widget.mobile.TextEnveloper
					 */

					self.options = {
						groupOnBlur: true,
						label: "To : ",
						link: "",
						description: "+ {0}",
						selectable: false
					};
					self._ui = {};
				},

				prototype = new BaseWidget();

			TextEnveloper.prototype = prototype;

			TextEnveloper.classes = classes;

			function bindEvents(self) {
				var ui = self._ui;

				events.on(ui.inputElement, "keyup blur focus", self);
				self.on("click", self);
			}

			function unbindEvents(self) {
				var ui = self._ui;

				events.off(ui.inputElement, "keyup blur focus", self);
				self.off("click", self);
			}

			/**
			 * Build component structure
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					input = document.createElement("input"),
					title = element.querySelector("." + classes.TEXT_ENVELOPER_START),
					//if title is defined (usually its described as To, Cc, Bcc)
					//then place it in the proper position
					tempTitle = (title) ? title.cloneNode(true) : null,
					textLineElement;

				element.classList.add(classes.TEXT_ENVELOPER);
				input.classList.add(classes.TEXT_ENVELOPER_INPUT);

				if (tempTitle) {
					element.removeChild(title);
					element.appendChild(tempTitle);
				}

				element.appendChild(input);
				engine.instanceWidget(input, "TextInput");
				ui.inputElement = input;
				ui.buttons = [];

				textLineElement = element.querySelector("." + classes.TEXT_ENVELOPER_TEXTLINE);
				textLineElement.parentElement.removeChild(textLineElement);

				return element;
			};

			/**
			 * Init component
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._init = function (element) {
				var self = this;

				self._btnActive = false;
				self._isBlurred = false;

				return element;
			};

			/**
			 * Bind event handler
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._bindEvents = function () {
				bindEvents(this);
			};

			/**
			 * Bind event handler
			 * @method handleEvent
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "click":
						self._onClick(event);
						break;
					case "keyup":
						self._onKeyup(event);
						break;
					case "blur":
						self._onBlur(event);
						break;
					case "focus":
						self._onFocus(event);
						break;
				}
			};

			/**
			 * Focus event handler of input element
			 * @method _onFocus
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._onFocus = function () {
				this.expandButtons();
			};

			/**
			 * Method used to show Text Enveloper items
			 * @method expandButtons
			 * @since 3.0
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.expandButtons = function () {
				var self = this,
					ui = self._ui,
					length = ui.buttons.length,
					i;

				if (self._isBlurred && self.options.groupOnBlur) {
					self._isBlurred = false;
					if (length > 1 && ui.buttons[length - 2].classList.contains(classes.TEXT_ENVELOPER_BTN_BLUR)) {
						self._remove(length - 1);
					}
					for (i = 0; i < length - 1; i++) {
						ui.buttons[i].classList.remove(classes.TEXT_ENVELOPER_BTN_BLUR);
					}
					self.trigger(eventName.RESIZE);
				}
			};

			/**
			 * Focus event handler of input element
			 * @method _onFocus
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._onClick = function (event) {
				var self = this,
					buttons = self._ui.buttons,
					target = event.target,
					targetClassList = target.classList,
					previousElementSibling = target.previousElementSibling,
					nextElementSibling = target.nextElementSibling,
					previousElementSiblingClassList = null,
					nextElementSiblingClassList = null;

				if (self.options.selectable && targetClassList.contains(classes.TEXT_ENVELOPER_BTN)) {
					previousElementSiblingClassList = previousElementSibling && previousElementSibling.classList;
					nextElementSiblingClassList = nextElementSibling && nextElementSibling.classList;
					if (targetClassList.contains(classes.TEXT_ENVELOPER_BTN_SELECTED)) {
						event.target.classList.remove(classes.TEXT_ENVELOPER_BTN_SELECTED);
						if (previousElementSibling && previousElementSibling.previousElementSibling && !previousElementSibling.previousElementSibling.classList.contains(classes.TEXT_ENVELOPER_BTN_SELECTED)) {
							previousElementSiblingClassList.remove(classes.TEXT_ENVELOPER_SLASH_HIDDEN);
						}
						if (nextElementSibling && nextElementSibling.nextElementSibling && !nextElementSibling.nextElementSibling.classList.contains(classes.TEXT_ENVELOPER_BTN_SELECTED)) {
							nextElementSiblingClassList.remove(classes.TEXT_ENVELOPER_SLASH_HIDDEN);
						}
						self.trigger(eventName.SELECT, {
							value: target.textContent,
							index: buttons.indexOf(target)
						}, false);
					} else {
						targetClassList.add(classes.TEXT_ENVELOPER_BTN_SELECTED);
						if (previousElementSiblingClassList && previousElementSiblingClassList.contains(classes.TEXT_ENVELOPER_SLASH)) {
							previousElementSiblingClassList.add(classes.TEXT_ENVELOPER_SLASH_HIDDEN);
						}
						if (nextElementSiblingClassList && nextElementSiblingClassList.contains(classes.TEXT_ENVELOPER_SLASH)) {
							nextElementSiblingClassList.add(classes.TEXT_ENVELOPER_SLASH_HIDDEN);
						}
						self.trigger(eventName.UNSELECT, {
							value: target.textContent,
							index: buttons.indexOf(target)
						}, false);
					}
					event.preventDefault();
					event.stopPropagation();
				}
			};

			/**
			 * Blur event handler of input element
			 * @method _onBlur
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._onBlur = function () {
				this.foldButtons();
			};

			/**
			 * Method used to hide Text Enveloper items
			 * @method foldButtons
			 * @since 3.0
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.foldButtons = function () {
				var self = this,
					ui = self._ui,
					length = ui.buttons.length,
					firstButtonValue = ui.buttons[0] ? ui.buttons[0].textContent : "",
					i,
					button,
					firstButtonTextNode,
					separatorNode,
					lengthTextNode;

				if (length > 1 && self.options.groupOnBlur) {
					for (i = 0; i < length; i++) {
						ui.buttons[i].classList.add(classes.TEXT_ENVELOPER_BTN_BLUR);
					}

					firstButtonTextNode = document.createTextNode(firstButtonValue);
					lengthTextNode = document.createTextNode("+" + (length - 1));
					separatorNode = document.createElement("span");

					separatorNode.classList.add(classes.TEXT_ENVELOPER_BTN_SLASH);

					button = self._createButton("");
					button.appendChild(firstButtonTextNode);
					button.appendChild(separatorNode);
					button.appendChild(lengthTextNode);

					self._isBlurred = true;
					self.trigger(eventName.RESIZE);
				}
			};

			/**
			 * keyup event handler of input element
			 * @method _onKeyup
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._onKeyup = function (event) {
				var self = this,
					element = self.element,
					ui = self._ui,
					input = ui.inputElement,
					value = input.value,
					keyValue = event.keyCode,
					lastIndex = ui.buttons.length - 1;

				if (keyValue === keyCode.ENTER) {
					events.trigger(element, eventName.NEW_VALUE, {
						value: value
					}, false);
					input.value = "";
					self.trigger(eventName.RESIZE);
				} else if (keyValue === keyCode.BACKSPACE) {
					if (value === "") {
						if (self._btnActive) {
							self._remove(lastIndex);
							self._btnActive = false;
						} else {
							if (ui.buttons.length) {
								ui.buttons[lastIndex].classList.add(classes.TEXT_ENVELOPER_BTN_ACTIVE);
								self._btnActive = true;
							}
						}
					}
					self.trigger(eventName.RESIZE);
				} else {
					if (self._btnActive) {
						ui.buttons[lastIndex].classList.remove(classes.TEXT_ENVELOPER_BTN_ACTIVE);
						self._btnActive = false;
					}
				}
			};

			/**
			 * Create button as used to word block
			 * @method _onKeyup
			 * @param {string} value
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._createButton = function (value) {
				var self = this,
					ui = self._ui,
					element = self.element,
					button = document.createElement("div");

				button.innerText = value;
				button.classList.add(classes.TEXT_ENVELOPER_BTN);
				engine.instanceWidget(button, "Button", {
					inline: true
				});
				element.insertBefore(button, self._ui.inputElement);
				ui.buttons.push(button);
				events.trigger(element, eventName.ADDED, {
					value: value,
					index: ui.buttons.length - 1
				}, false);
				return button;
			};

			/**
			 * Create slash to apear after button
			 * @method _createSlash
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._createSlash = function () {
				var self = this,
					ui = self._ui,
					element = self.element,
					span = document.createElement("span");

				span.classList.add(classes.TEXT_ENVELOPER_SLASH);
				element.insertBefore(span, ui.inputElement);
				return span;
			};

			/**
			 * Method add block
			 *
			 * Method adds new token text component button with specified text
			 * in place of the index. If index isn't set the token will
			 * be inserted at the end.
			 *
			 *		@example
			 *			<div data-role="TextEnveloper" id="ns-tokentext"></div>
			 *			<script>
			 *				var tokencomponent = tau.component.TextEnveloper(
			 *						document.getElementById("ns-tokentext")
			 *				);
			 *				tokencomponent.add("foobar");
			 *
			 *				//or
			 *
			 *				$( "#ns-tokentext" ).TextEnveloper("add", "foobar");
			 *			</script>
			 *
			 * @method add
			 * @param {string} messages
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.add = function (messages) {
				this._createButton(messages);
				this._createSlash();
			};

			/**
			 * Method delete token; delete all tokens without parameter
			 *
			 * The remove method is used to remove a token text area component
			 * button at the specified index position. If the parameter
			 * is not defined, all the component buttons are removed.
			 *
			 *		@example
			 *			<div 	data-role="TextEnveloper"
			 *					data-label="Send to: "
			 *					id="ns-tokentext">
			 *			</div>
			 *			<script>
			 *				var tokencomponent = tau.component.TextEnveloper(
			 *						document.getElementById("ns-tokentext")
			 *				);
			 *				tokencomponent.remove(1);
			 *
			 *				//or
			 *
			 *				$( "#ns-tokentext" ).TextEnveloper("remove", "1" );
			 *			</script>
			 *
			 * @method remove
			 * @param {number} index
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.remove = function (index) {
				this._remove(index);
			};

			prototype._remove = function (index) {
				var self = this,
					element = self.element,
					buttons = self._ui.buttons,
					innerText = buttons[index].innerText,
					validLength = self._isBlurred ? buttons.length - 2 : buttons.length - 1;

				if (index < 0 || index > validLength) {
					ns.warn("You insert incorrect index, please check your index value");
				} else if (self._isBlurred) {
					if (buttons.length > 2) {
						buttons[buttons.length - 1].textContent = buttons[0].textContent + " + " + (buttons.length - 2);
					} else if (buttons.length === 2) {
						element.removeChild(buttons[buttons.length - 1]);
						buttons.pop();
						buttons[0].classList.remove(classes.TEXT_ENVELOPER_BTN_BLUR);
					}
				} else {
					if (buttons[index].nextElementSibling.classList.contains(classes.TEXT_ENVELOPER_SLASH)) {
						element.removeChild(buttons[index].nextElementSibling);
					}
					element.removeChild(buttons[index]);
					buttons.splice(index, 1);
				}

				events.trigger(element, eventName.REMOVED, {
					value: innerText,
					index: index
				});
			};
			/**
			 * Function return blocks count
			 *
			 * The length method is used to retrieve the number of buttons
			 * in the token text area component:
			 *
			 *		@example
			 *			<div data-role="TextEnveloper" id="ns-tokentext"></div>
			 *			<script>
			 *				var tokencomponent = tau.component.TextEnveloper(
			 *						document.getElementById("ns-tokentext")
			 *				);
			 *				tokencomponent.lenght();
			 *
			 *				//if jQuery is loaded
			 *
			 *				$( "#ns-tokentext" ).TextEnveloper( "length" );
			 *			</script>
			 *
			 * @method length
			 * @return {number}
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.length = function () {
				return this._ui.buttons.length;
			};

			/**
			 * Destroy component
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._destroy = function () {
				var self = this;

				unbindEvents(self);
				self._ui = null;
			};

			ns.widget.mobile.TextEnveloper = TextEnveloper;
			engine.defineWidget(
				"TextEnveloper",
				"[data-role='textenveloper'], .ui-text-enveloper",
				[
					"add",
					"remove",
					"length"
				],
				TextEnveloper,
				"mobile"
			);

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return TextEnveloper;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
