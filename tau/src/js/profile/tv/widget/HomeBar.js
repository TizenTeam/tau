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
 * # HomeBar Widget
 *
 * Shows a list of block which can be moved after click on box.
 *
 * ## Default selectors
 *
 * Default selector for HomeBar widget is class *ui-home-bar*.
 *
 * ## HTML Examples
 *
 * To add a list widget to the application, use the following code.
 *
 * ### HomeBar with basic items
 *
 * You can add a basic HomeBar widget as follows:
 *
 *      @example
 *         <ul class="ui-home-bar">
 *             <li><a>Andrew</a></li>
 *             <li><a>Live</a></li>
 *             <li><a>Movies</a></li>
 *             <li><a>Apps</a></li>
 *             <li><a>Source</a></li>
 *         </ul>
 *
 * ### HomeBar with icons items
 *
 * You can add a HomeBar widget with icons as follows:
 *
 *      @example
 *         <ul class="ui-home-bar">
 *             <li><a data-icon="source" data-iconpos="top">Andrew</a></li>
 *             <li><a data-icon="live" data-iconpos="top">Live</a></li>
 *             <li><a data-icon="movie" data-iconpos="top">Movies</a></li>
 *             <li><a data-icon="app" data-iconpos="top">Apps</a></li>
 *             <li><a data-icon="source" data-iconpos="top">Source</a></li>
 *         </ul>
 *
 * ### HomeBar with icons items and button add
 *
 * You can add a HomeBar widget with icons and button add as follows:
 *
 *      @example
 *         <ul class="ui-home-bar">
 *             <li><a data-icon="source" data-iconpos="top">Andrew</a></li>
 *             <li><a data-icon="live" data-iconpos="top">Live</a></li>
 *             <li><a data-icon="movie" data-iconpos="top">Movies</a></li>
 *             <li><a data-icon="app" data-iconpos="top">Apps</a></li>
 *             <li><a data-icon="source" data-iconpos="top">Source</a></li>
 *             <li class="ui-home-bar-move-disabled">
 *                 <a href="#add" data-rel="popup" data-icon="add"
 *                 data-iconpos="top">pin</a></li>
 *         </ul>
 *
 * ### Additional classes
 *
 * HomeBar has two additional classes which you can add to li elements
 *
 *  - _ui-home-bar-move-disabled_ - elements with this class can't be moved
 *  - _ui-home-bar-header_ - mark elements which can will be in header and can't be scrolled
 *
 * @class ns.widget.tv.HomeBar
 * @extends ns.widget.core.BaseWidget
 */
(function (document, tau) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/widget/BaseWidget",
			"../../../core/widget/core/PageContainer",
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/util/DOM",
			"../../../core/util/array",
			"../../../core/event",
			"./BaseKeyboardSupport",
			"./Drawer"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = tau.widget.BaseWidget,
				Drawer = tau.widget.tv.Drawer,
				drawerClasses = Drawer.classes,
				pageContainerClasses = tau.widget.core.PageContainer.classes,
				engine = tau.engine,
				util = tau.util,
				utilDOM = util.DOM,
				utilArray = util.array,
				utilsSelectors = tau.util.selectors,
				tauEvent = tau.event,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				HomeBar = function () {
					var self = this;
					BaseWidget.call(self);
					BaseKeyboardSupport.call(self);
					self._ui = self._ui || {};
					self._listeners = self._listeners || {};
					self._editMode = false;
					self._pageWidget = null;
				},
				prototype = new BaseWidget(),
				events = {
					add: "homebaradd",
					move: "homebarmove",
					remove: "homebarremove"
				},
				classes = {
					homebar: "ui-home-bar-main",
					background: "ui-home-bar-background",
					backgroundActive: "ui-home-bar-background-active",
					editContainer: "ui-home-bar-container",
					editButtonUp: "ui-home-bar-button-up",
					editButtonDown: "ui-home-bar-button-down",
					editButtonClose: "ui-home-bar-button-close",
					editBox: "ui-home-bar-box",
					disableMove: "ui-home-bar-move-disabled",
					block: "ui-block",
					header: "ui-home-bar-header",
					headerBox: "ui-home-bar-header-box",
					focus: "ui-focus"
				},
				KEY_CODES = BaseKeyboardSupport.KEY_CODES;

			HomeBar.events = events;
			HomeBar.classes = classes;

			/**
			 * Set position style attribute to absolute and set top to given value
			 * @param {HTMLElement} element
			 * @param {number} top
			 * @static
			 * @private
			 * @memberof ns.widget.tv.HomeBar
			 */
			function setAbsolutePositionTop(element, top) {
				var style = element.style;
				style.top = top + "px";
				style.position = "absolute";
			}

			/**
			 * Move headers elements to top and create another UL tag to place
			 * header LIs.
			 * @param {HTMLElement} element
			 * @static
			 * @private
			 * @memberof ns.widget.tv.HomeBar
			 */
			function buildHeaders(element) {
				var headers = utilsSelectors.getChildrenByClass(element, classes.header),
					headerUL = createElement(classes.headerBox, "ul"),
					headerULStyle = headerUL.style,
					elementStyle = element.style,
					container = createElement(""),
					top = 0;

				if (headers.length) {
					utilArray.forEach(headers, function(li) {
						headerUL.appendChild(li);
					});
					container.appendChild(headerUL);
					element.parentNode.insertBefore(container, element);
					container.appendChild(element);
					container.classList.add(classes.homebar);
					headerULStyle.top = 0;
					headerULStyle.position = "absolute";
					utilArray.forEach(headers, function(li) {
						var height = utilDOM.getElementHeight(li);
						li.classList.add(classes.block);
						engine.instanceWidget(li.firstElementChild, "Button");
						setAbsolutePositionTop(li, top);
						top += Math.ceil(height);
					});

					headerULStyle.height = top + "px";
					elementStyle.top = top + "px";
					elementStyle.bottom = 0;
					elementStyle.position = "absolute";
				} else {
					element.classList.add(classes.homebar);
				}
			}

			/**
			 * Set absolute position to all li element which are not in header.
			 * Absolute position is set to support moving animation.
			 * @param {HTMLElement} element
			 * @static
			 * @private
			 * @memberof ns.widget.tv.HomeBar
			 */
			function positionElements(element) {
				var children = utilsSelectors.getChildrenByTag(element, "li"),
					top = 0;

				utilArray.forEach(children, function(li) {
					var height = utilDOM.getElementHeight(li);
					li.classList.add(classes.block);
					engine.instanceWidget(li.firstElementChild, "Button");
					setAbsolutePositionTop(li, top);
					top += Math.ceil(height);
				});
			}

			/**
			 * Builds structure of widget
			 * @method _build
			 * @param {HTMLInputElement} element
			 * @return {HTMLInputElement} Built element
			 * @protected
			 * @member ns.widget.tv.HomeBar
			 */
			prototype._build = function(element) {
				buildHeaders(element);
				positionElements(element);
				return element;
			};

			/**
			 * Refresh structure of widget
			 * @method _build
			 * @protected
			 * @member ns.widget.tv.HomeBar
			 */
			prototype._refresh = function() {
				positionElements(this.element);
			};

			/**
			 * Init structure of widget
			 * @method _init
			 * @param {HTMLInputElement} element
			 * @protected
			 * @member ns.widget.tv.HomeBar
			 */
			prototype._init = function(element) {
				var drawerElement = utilsSelectors.getClosestByClass(element, drawerClasses.drawer);
				this._drawerWidget = engine.instanceWidget(drawerElement, "Drawer");
				return element;
			};

			/**
			 * Helper to create element and set class for it.
			 * @method createElement
			 * @param {string} classes classes to set
			 * @param {string} [tag="div"] tag name of element
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function createElement(classes, tag) {
				var div = document.createElement(tag || "div");

				div.className = classes;
				return div;
			}

			/**
			 * Callback to click event, which enable edit mode
			 * @method activateOnClick
			 * @param {ns.widget.tv.HomeBar} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function activateOnClick(self, event) {
				var clickedElement = utilsSelectors.getClosestByTag(event.target, "li"),
					pageWidget = self._drawerWidget;
				if (!self._editMode &&
						!clickedElement.classList.contains(classes.disableMove) &&
						self._drawerWidget.isOpen()) {
					// enable edit mode
					self._editMode = true;

					//show background layer
					showBackground(self);

					//set active element which are edited
					self._ui.clickedElement = clickedElement;

					// set proper position of box
					positionBox(self);

					//support keyboard
					BaseKeyboardSupport.blurAll();
					self.saveKeyboardSupport();
					self.disableKeyboardSupport();
					pageWidget.closeDynamic();

					//block event
					tauEvent.preventDefault(event);
					tauEvent.stopImmediatePropagation(event);
				}
			}

			/**
			 * Callback to click event, which disable edit mode
			 * @method hideOnClick
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function hideOnClick(self) {
				self._editMode = false;
				self._confirmDelete = false;
				hideBackground(self);
				clearBox(self);
				self.disableKeyboardSupport();
				self.restoreKeyboardSupport();
			}

			/**
			 * Method move current element one position up
			 * @method moveUpOnClick
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function moveUpOnClick(self) {
				var clickedElement = self._ui.clickedElement,
					previous = clickedElement.previousElementSibling;
				if (previous && !previous.classList.contains(classes.disableMove)) {
					self._confirmDelete = false;
					self.element.insertBefore(clickedElement, previous);
					positionElements(self.element);
					moveBox(self, -1, previous);
					self.trigger(events.move, {
						listElement: clickedElement
					});
				}
			}

			/**
			 * Method move current element one position down
			 * @method moveDownOnClick
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function moveDownOnClick(self) {
				var clickedElement = self._ui.clickedElement,
					next = clickedElement.nextElementSibling;
				if (next && !next.classList.contains(classes.disableMove)) {
					self._confirmDelete = false;
					self.element.insertBefore(clickedElement, next.nextElementSibling);
					positionElements(self.element);
					moveBox(self, 1, next);
					self.trigger(events.move, {
						listElement: clickedElement
					});
				}
			}

			/**
			 * Confirm delete of current element
			 * @method deleteElement
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function deleteElement(self) {
				var clickedElement = self._ui.clickedElement,
					nextElement;
				if (clickedElement) {
					nextElement = clickedElement.nextElementSibling ? clickedElement.nextElementSibling.firstElementChild :
						clickedElement.previousElementSibling ? clickedElement.previousElementSibling.firstElementChild : null;
					self.element.removeChild(clickedElement);
					hideOnClick(self);
					positionElements(self.element);
					self.trigger(events.remove, {
						listElement: clickedElement
					});
					if (nextElement) {
						// Focus on next element on list, because current operation is doing inside event we have to wait untils keydow/keyup event will be finished
						tauEvent.one(document, "keyup", BaseKeyboardSupport.focusElement.bind(BaseKeyboardSupport, self.element, nextElement));
					}
				}
			}

			/**
			 * Set state of widget as "delete to confirm"
			 * @method confirmDeleteElement
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function confirmDeleteElement(self) {
				self._ui.close.classList.add(classes.focus);
				self._confirmDelete = true;
			}

			/**
			 * Method remove current
			 * @method cancelConfirmDeleteElement
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function cancelConfirmDeleteElement(self) {
				self._ui.close.classList.remove(classes.focus);
				self._confirmDelete = false;
			}

			/**
			 * Helper to find the closest PageContainer element
			 * @method findPageContainer
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function findPageContainer(element) {
				return utilsSelectors.getClosestByClass(element, pageContainerClasses.pagecontainer) || document.body;
			}

			/**
			 * Create black background
			 * @method createBackground
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function createBackground(self) {
				var background = createElement(classes.background),
					parent = findPageContainer(self.element);
				background.id = self.id + "-bg";
				parent.appendChild(background);
				self._ui.background = background;
				createBox(self);
				return background;
			}

			/**
			 * Remove edit mode structure
			 * @method removeBackground
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function removeBackground(self) {
				var background = self._ui.background;
				if (background) {
					background.parentNode.removeChild(background);
				}
			}
			/**
			 * Show edit mode structure
			 * @method showBackground
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function showBackground(self) {
				var background = self._ui.background || createBackground(self);
				background.classList.add(classes.backgroundActive);
			}

			/**
			 * Hide edit mode structure
			 * @method hideBackground
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function hideBackground(self) {
				if (self._ui.background) {
					self._ui.background.classList.remove(classes.backgroundActive);
				}
			}

			/**
			 * Create box with current element in edit mode
			 * @method createBox
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function createBox(self) {
				var ui = self._ui,
					container = createElement(classes.editContainer),
					buttonUp = createElement(classes.editButtonUp),
					buttonDown = createElement(classes.editButtonDown),
					buttonClose = createElement(classes.editButtonClose),
					box = createElement(classes.editBox, "ul");
				container.id = self.id + "edit";
				container.appendChild(buttonUp);
				container.appendChild(buttonDown);
				container.appendChild(buttonClose);
				container.appendChild(box);
				ui.background.appendChild(container);
				ui.editContainer = container;
				ui.editBox = box;
				ui.buttonUp = buttonUp;
				ui.close = buttonClose;
				buttonClose.addEventListener("vclick", self._listeners.close, false);
			}

			/**
			 * Update position of box with current element in edit mode
			 * @method positionBox
			 * @param {ns.widget.tv.HomeBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function positionBox(self) {
				var element = self.element,
					ui = self._ui,
					container = ui.editContainer,
					clickedElement = ui.clickedElement,
					box = ui.editBox,
					containerStyle,
					boxStyle,
					offsetElement,
					offsetClickedElement,
					width,
					height,
					clonedElement,
					buttonSize,
					newTop;
				if (self._editMode) {
					boxStyle = box.style,
					containerStyle = container.style;
					offsetElement = utilDOM.getElementOffset(element);
					offsetClickedElement = utilDOM.getElementOffset(clickedElement);
					width = utilDOM.getElementWidth(element);
					height = utilDOM.getElementHeight(clickedElement);
					buttonSize = utilDOM.getElementHeight(ui.buttonUp);
					clonedElement = clickedElement.cloneNode(true);
					newTop = (offsetClickedElement.top - buttonSize - element.scrollTop);
					if (newTop + buttonSize < offsetElement.top ) {
						element.scrollTop += newTop + buttonSize - offsetElement.top;
						newTop = (offsetClickedElement.top - buttonSize - element.scrollTop);
					}
					containerStyle.left = offsetClickedElement.left + "px";
					containerStyle.top = newTop + "px";
					containerStyle.width = (width + buttonSize) + "px";
					containerStyle.height = (height + 2 * buttonSize) + "px";
					boxStyle.width = width + "px";
					boxStyle.height = height + "px";
					box.innerHTML = "";
					box.appendChild(clonedElement);
					clonedElement.style.top = 0;
					clonedElement.firstElementChild.classList.add(classes.focus);
				}
			}

			function clearBox(self) {
				if (self._ui.editBox) {
					self._ui.editBox.innerHTML = "";
				}
			}

			/**
			 * Move box with current element in edit mode.
			 * We cannot use positionBox method because elements in list are animated
			 * and we can't calculate position. We temporary move by +/- 1 * height
			 * and after transition end we recalculate position.
			 * @method moveBox
			 * @param {ns.widget.tv.HomeBar} self
			 * @param {-1|1} direction Direction of move
			 * @param {HTMLElement} siblingElement previous or next element in list
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function moveBox(self, direction, siblingElement) {
				var container = self._ui.editContainer,
					containerStyle,
					offsetContainerElement,
					height;
				if (container) {
					containerStyle = container.style;
					offsetContainerElement = utilDOM.getElementOffset(container);
					height = utilDOM.getElementHeight(siblingElement);
					containerStyle.top = (offsetContainerElement.top + direction * height) + "px";
				}
			}

			/**
			 * Keydown event-handling method.
			 * @method onKeydown
			 * @param {ns.widget.tv.HomeBar} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function onKeydown(self, event) {
				if (self._editMode) {
					switch (event.keyCode) {
						case KEY_CODES.up:
							cancelConfirmDeleteElement(self);
							moveUpOnClick(self);
							break;
						case KEY_CODES.down:
							cancelConfirmDeleteElement(self);
							moveDownOnClick(self);
							break;
						case KEY_CODES.left:
							cancelConfirmDeleteElement(self);
							break;
						case KEY_CODES.right:
							confirmDeleteElement(self);
							break;
						case KEY_CODES.enter:
							if (self._confirmDelete) {
								deleteElement(self);
							} else {
								hideOnClick(self);
							}
							cancelConfirmDeleteElement(self);
					}
					tauEvent.preventDefault(event);
					tauEvent.stopImmediatePropagation(event);
				}
			}

			/**
			 * Find last li element which can be moving to place after them new
			 * li element
			 * @method placeToAdd
			 * @param {HTMLElement} element Base element of widget
			 * @private
			 * @static
			 * @member ns.widget.tv.HomeBar
			 */
			function placeToAdd(element) {
				return element.querySelector("." + classes.disableMove);
			}

			/**
			 * Add element after last li element which can be moving
			 * @method add
			 * @param {HTMLLIElement} liElement Element to add
			 * @member ns.widget.tv.HomeBar
			 */
			prototype.add = function(liElement) {
				var element = this.element;
				element.insertBefore(liElement, placeToAdd(element));
				liElement.classList.add(classes.block);
				engine.instanceWidget(liElement.firstElementChild, "Button", {
					corners: false
				});
				this.trigger(events.add, {
					listElement: liElement
				});
				positionElements(element);
			};

			/**
			 * Remove li element from list
			 * @method remove
			 * @param {HTMLLIElement} liElement Element to remove
			 * @member ns.widget.tv.HomeBar
			 */
			prototype.remove = function(liElement) {
				if (liElement) {
					this._ui.clickedElement = liElement;
					deleteElement(this);
				}
			};

			/**
			 * Move up li element on list
			 * @method moveUp
			 * @param {HTMLLIElement} liElement Element to move
			 * @member ns.widget.tv.HomeBar
			 */
			prototype.moveUp = function(liElement) {
				if (liElement) {
					this._ui.clickedElement = liElement;
					moveUpOnClick(this);
				}
			};

			/**
			 * Move down li element on list
			 * @method moveDown
			 * @param {HTMLLIElement} liElement Element to move
			 * @member ns.widget.tv.HomeBar
			 */
			prototype.moveDown = function(liElement) {
				if (liElement) {
					this._ui.clickedElement = liElement;
					moveDownOnClick(this);
				}
			};

			/**
			 * Binds events to widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.tv.HomeBar
			 */
			prototype._bindEvents = function() {
				var self = this,
					element = self.element,
					listeners = self._listeners;
				listeners.click = activateOnClick.bind(null, self);
				listeners.onKeydown = onKeydown.bind(null, self);
				listeners.transitionend = positionBox.bind(null, self);

				element.addEventListener("vclick", listeners.click, false);
				tauEvent.prefixedFastOn(element, "transitionEnd", listeners.transitionend, false);
				document.addEventListener("keydown", listeners.onKeydown, true);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.tv.HomeBar
			 */
			prototype._destroy = function(element) {
				var self = this,
					listeners = self._listeners;
				element.removeEventListener("vclick", listeners.click, false);
				document.removeEventListener("keydown", listeners.onKeydown, true);
				tauEvent.prefixedFastOff(element, "transitionEnd", listeners.transitionend, false);
				if (self._ui.close) {
					self._ui.close.removeEventListener("vclick", self._listeners.close, false);
				}
				removeBackground(self);
			};

			HomeBar.prototype = prototype;
			tau.widget.tv.HomeBar = HomeBar;

			engine.defineWidget(
				"HomeBar",
				".ui-home-bar",
				[],
				HomeBar,
				"tv"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return HomeBar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
