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
/*jslint nomen: true, plusplus: true */

/**
 * # Popup Widget
 * Shows a pop-up window.
 *
 * The popup widget shows in the middle of the screen a list of items in a pop-up window. It automatically optimizes the pop-up window size within the screen. The following table describes the supported popup classes.
 *
 * ## Default selectors
 * All elements with class *ui-popup* will be become popup widgets.
 *
 * The pop-up window can contain a header, content, and footer area like the page element.
 *
 * To open a pop-up window from a link, use the data-rel attribute in HTML markup as in the following code:
 *
 *      @example
 *      <a href="#popup" class="ui-btn" data-rel="popup">Open popup when clicking this element.</a>
 *
 * The following table shows examples of various types of popups.
 *
 * The popup contains header, content and footer area
 *
 * ###HTML Examples
 *
 * #### Basic popup with header, content, footer
 *
 *		@example
 *		<div class="ui-page">
 *		    <div class="ui-popup">
 *		        <div class="ui-popup-header">Power saving mode</div>
 *		        <div class="ui-popup-content">
 *		            Turning on Power
 *		            saving mode will
 *		            limit the maximum
 *		            per
 *		        </div>
 *		        <div class="ui-popup-footer">
 *		            <button id="cancel" class="ui-btn">Cancel</button>
 *		        </div>
 *		    </div>
 *		</div>
 *
 * #### Popup with 2 buttons in the footer
 *
 *      @example
 *         <div id="2btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Delete</div>
 *             <div class="ui-popup-content">
 *                 Delete the image?
 *             </div>
 *             <div class="ui-popup-footer ui-grid-col-2">
 *                 <button id="2btnPopup-cancel" class="ui-btn">Cancel</button>
 *                 <button id="2btnPopup-ok" class="ui-btn">OK</button>
 *             </div>
 *         </div>
 *
 * #### Popup with checkbox/radio
 *
 * If you want make popup with list checkbox(or radio) just include checkbox (radio) to popup and add class *ui-popup-checkbox-label* to popup element.
 *
 *		@example
 *         <div id="listBoxPopup" class="ui-popup">
 *             <div class="ui-popup-header">When?</div>
 *             <div class="ui-popup-content" style="height:243px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="check-1" class="ui-popup-checkbox-label">Yesterday</label>
 *                         <input type="checkbox" name="checkset" id="check-1" />
 *                     </li>
 *                     <li>
 *                         <label for="check-2" class="ui-popup-checkbox-label">Today</label>
 *                         <input type="checkbox" name="checkset" id="check-2" />
 *                     </li>
 *                     <li>
 *                         <label for="check-3" class="ui-popup-checkbox-label">Tomorrow</label>
 *                         <input type="checkbox" name="checkset" id="check-3" />
 *                     </li>
 *                 </ul>
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="radio-1" class="ui-popup-radio-label">Mandatory</label>
 *                         <input type="radio" name="radioset" id="radio-1" />
 *                     </li>
 *                     <li>
 *                         <label for="radio-2" class="ui-popup-radio-label">Optional</label>
 *                         <input type="radio" name="radioset" id="radio-2" />
 *                     </li>
 *                 </ul>
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="listBoxPopup-close" class="ui-btn">Close</button>
 *             </div>
 *         </div>
 *     </div>
 *
 * #### Popup with no header and footer
 *
 *      @example
 *         <div id="listNoTitleNoBtnPopup" class="ui-popup">
 *             <div class="ui-popup-content" style="height:294px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li><a href="">Ringtones 1</a></li>
 *                     <li><a href="">Ringtones 2</a></li>
 *                     <li><a href="">Ringtones 3</a></li>
 *                 </ul>
 *             </div>
 *         </div>
 *
 * #### Toast popup
 *
 *      @example
 *         <div id="PopupToast" class="ui-popup ui-popup-toast">
 *             <div class="ui-popup-content">Saving contacts to sim on Samsung</div>
 *         </div>
 *
 * ### Create Option popup
 *
 * Popup inherits value of option positionTo from property data-position-to set in link.
 *
 *		@example
 *		<!--definition of link, which opens popup and sets its position-->
 *		<a href="#popupOptionText" data-rel="popup"  data-position-to="origin">Text</a>
 *		<!--definition of popup, which inherites property position from link-->
 *		<div id="popupOptionText" class="ui-popup">
 *			<div class="ui-popup-content">
 *				<ul class="ui-listview">
 *				<li><a href="#">Option 1</a></li>
 *				<li><a href="#">Option 2</a></li>
 *				<li><a href="#">Option 3</a></li>
 *				<li><a href="#">Option 4</a></li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * ### Opening and closing popup
 *
 * To open popup from "a" link using html markup, use the following code:
 *
 *		@example
 *      <div class="ui-page">
 *          <header class="ui-header">
 *              <h2 class="ui-title">Call menu</h2>
 *          </header>
 *          <div class="ui-content">
 *              <a href="#popup" class="ui-btn" data-rel="popup" >Open Popup</a>
 *          </div>
 *
 *          <div id="popup" class="ui-popup">
 *               <div class="ui-popup-header">Power saving mode</div>
 *                   <div class="ui-popup-content">
 *                       Turning on Power
 *                       saving mode will
 *                       limit the maximum
 *                       per
 *                   </div>
 *               <div class="ui-popup-footer">
 *               <button id="cancel" class="ui-btn">Cancel</button>
 *           </div>
 *       </div>
 *
 *  To open the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.openPopup("popup")
 *
 *  To close the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.closePopup("popup")
 *
 * To find the currently active popup, use the ui-popup-active class.
 *
 * To bind the popup to a button, use the following code:
 *
 *      @example
 *         <!--HTML code-->
 *         <div id="1btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Power saving mode</div>
 *             <div class="ui-popup-content">
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="1btnPopup-cancel" class="ui-btn">Cancel</button>
 *             </div>
 *         </div>
 *         <script>
 *             // Popup opens with button click
 *             var button = document.getElementById("button");
 *             button.addEventListener("click", function() {
 *                 tau.openPopup("#1btnPopup");
 *             });
 *
 *             // Popup closes with Cancel button click
 *             document.getElementById("1btnPopup-cancel").addEventListener("click", function() {
 *                 tau.closePopup();
 *             });
 *         </script>
 *
 * ## Manual constructor
 * For manual creation of popup widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.popup(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*.
 *
 * ## Options for Popup Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.popup(buttonElement);
 *
 *		popup.methodName(methodArgument1, methodArgument2, ...);
 *
 * ## Transitions
 *
 * By default, the framework doesn't apply transition. To set a custom transition effect, add the data-transition attribute to the link.
 *
 *		@example
 *		<a href="index.html" data-rel="popup" data-transition="slideup">I'll slide up</a>
 *
 * Global configuration:
 *
 *		@example
 *		gear.ui.defaults.popupTransition = "slideup";
 *
 * ### Transitions list
 *
 * - **none** Default value, no transition.
 * - **slideup** Makes the content of the pop-up slide up.
 *
 * ## Handling Popup Events
 *
 * To use popup events, use the following code:
 *
 *      @example
 *         <!--Popup html code-->
 *         <div id="popup" class="ui-popup">
 *             <div class="ui-popup-header"></div>
 *             <div class="ui-popup-content"></div>
 *         </div>
 *         </div>
 *         <script>
 *             // Use popup events
 *             var popup = document.getElementById("popup");
 *             popup.addEventListener("popupbeforecreate", function() {
 *                 // Implement code for popupbeforecreate event
 *             });
 *         </script>
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.core.Popup
 * @extends ns.widget.core.BasePopup
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/object",
			"./Popup"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var Popup = ns.widget.core.Popup,

				PopupPrototype = Popup.prototype,

				engine = ns.engine,

				objectUtils = ns.util.object,

				/**
				 * Object with default options
				 * @property {Object} defaults
				 * @property {string} [options.transition="none"] Sets the default transition for the popup.
				 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
				 * @property {boolean} [options.dismissible=true] Sets whether to close popup when a popup is open to support the back button.
				 * @property {boolean} [options.overlay=true] Sets whether to show overlay when a popup is open.
				 * @property {string} [overlayClass=""] Sets the custom class for the popup background, which covers the entire window.
				 * @property {boolean} [options.history=true] Sets whether to alter the url when a popup is open to support the back button.
				 * @property {string} [options.arrow="l,t,r,b"] Sets directions of popup's arrow by priority ("l" for left, "t" for top,
				 * "r" for right, and "b" for bottom). The first one has the highest priority, the last one - the lowest. If you set arrow="t",
				 * then arrow will be placed at the top of popup container and the whole popup will be placed under cliced element.
				 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
				 * @property {number} [options.distance=0] Sets the extra distance in px from clicked element.
				 * @member ns.widget.core.ContextPopup
				 * @static
				 * @private
				 */
				defaults = objectUtils.merge({}, Popup.defaults, {
					arrow: "l,t,r,b",
					positionTo: "window",
					distance: 0
				}),

				ContextPopup = function () {
					var self = this,
						ui;

					Popup.call(self);

					// set options
					self.options = objectUtils.merge(self.options, defaults);

					// set ui
					ui = self._ui || {};
					ui.wrapper = null;
					ui.arrow = null;
					self._ui = ui;
				},

				/**
				 * @property {Object} classes Dictionary for popup related css class names
				 * @member ns.widget.core.Popup
				 * @static
				 */
				CLASSES_PREFIX = "ui-popup",
				classes = objectUtils.merge({}, Popup.classes, {
					wrapper: CLASSES_PREFIX + "-wrapper",
					context: "ui-ctxpopup",
					arrow: "ui-arrow",
					arrowDir: CLASSES_PREFIX + "-arrow-",
					build: "ui-build"
				}),

				/**
				 * @property {Object} events Dictionary for popup related events
				 * @member ns.widget.core.Popup
				 * @static
				 */
				events = objectUtils.merge({}, Popup.events, {
					before_position: "beforeposition"
				}),

				positionType = {
					WINDOW: "window",
					ORIGIN: "origin"
				},

				prototype = new Popup();

			ContextPopup.defaults = defaults;
			ContextPopup.classes = classes;
			ContextPopup.events = events;

			/**
			 * Build structure of Popup widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					wrapper,
					arrow,
					child = element.firstChild;

				// set class for element
				element.classList.add(classes.popup);

				// create wrapper
				wrapper = document.createElement("div");
				wrapper.classList.add(classes.wrapper);
				ui.wrapper = wrapper;
				ui.container = wrapper;

				// move all children to wrapper
				while (child) {
					wrapper.appendChild(child);
					child = element.firstChild;
				}

				// create arrow
				arrow = document.createElement("div");
				arrow.appendChild(document.createElement("span"));
				arrow.classList.add(classes.arrow);
				ui.arrow = arrow;

				// add wrapper and arrow to popup element
				element.appendChild(wrapper);
				element.appendChild(arrow);

				// build elements of popup
				PopupPrototype._build.call(self, element);

				return element;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._init = function(element) {
				var self = this,
					ui = self._ui;

				PopupPrototype._init.call(this, element);

				ui.wrapper = ui.wrapper || element.querySelector("." + classes.wrapper);
				ui.arrow = ui.arrow || element.querySelector("." + classes.arrow);

				// set container of popup elements
				ui.container = ui.wrapper;
			};

			/**
			 * Set positon and size of popup.
			 * @method _reposition
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._reposition = function(options) {
				var self = this,
					element = self.element,
					elementClassList = element.classList;

				options = objectUtils.copy(options);

				self.trigger(events.before_position, null, false);

				elementClassList.add(classes.build);

				// set height of content
				self._setContentHeight();
				// set position of popup
				self._placementCoords(options);

				elementClassList.remove(classes.build);

			};

			/**
			 * Find the best positon of context popup.
			 * @method findBestPosition
			 * @param {ns.widget.core.ContextPopup} self
			 * @param {HTMLElement} clickedElement
			 * @private
			 * @member ns.widget.core.ContextPopup
			 */
			function findBestPosition(self, clickedElement) {
				var options = self.options,
					arrowsPriority = options.arrow.split(","),
					element = self.element,
					windowWidth = window.innerWidth,
					windowHeight = window.innerHeight,
					popupWidth = element.offsetWidth,
					popupHeight = element.offsetHeight,
					// offset coordinates of clicked element
					clickElementRect = clickedElement.getBoundingClientRect(),
					clickElementOffsetX = clickElementRect.left,
					clickElementOffsetY = clickElementRect.top,
					// width of visible part of clicked element
					clickElementOffsetWidth = Math.min(clickElementRect.width,
							windowWidth - clickElementOffsetX),
					// height of visible part of clicked element
					clickElementOffsetHeight = Math.min(clickElementRect.height,
							windowHeight - clickElementOffsetY),
					// params for all types of popup
					// "l" - popup with arrow on the left side, "r" - right, "b" - bottom, "t" - top
					// dir - this letter is added as a suffix of class to popup's element
					// fixedPositionField - specifies which coordinate is changed for this type of popup
					// fixedPositionFactor - factor, which specifies if size should be added or subtracted
					// size - available size, which is needed for this type of popup (width or height)
					// max - maximum size of available place
					params = {
						"l": {dir: "l", fixedPositionField: "x", fixedPositionFactor: 1,
							size: popupWidth, max: windowWidth - clickElementOffsetX - clickElementOffsetWidth},
						"r": {dir: "r", fixedPositionField: "x", fixedPositionFactor: -1,
							size: popupWidth, max: clickElementOffsetX},
						"b": {dir: "b", fixedPositionField: "y", fixedPositionFactor: -1,
							size: popupHeight, max: clickElementOffsetY},
						"t": {dir: "t", fixedPositionField: "y", fixedPositionFactor: 1,
							size: popupHeight, max: windowHeight - clickElementOffsetY - clickElementOffsetHeight}
					},
					bestDirection,
					direction,
					bestOffsetInfo;

				// set value of bestDirection on the first possible type or top
				bestDirection = params[arrowsPriority[0]] || params.t,

				arrowsPriority.forEach(function(key){
					var param = params[key],
						paramMax = param.max;
					if (!direction) {
						if (param.size < paramMax) {
							direction = param;
						} else if (paramMax > bestDirection.max) {
							bestDirection = param;
						}
					}
				});

				if (!direction) {
					direction = bestDirection;
					if (direction.fixedPositionField === "x") {
						popupWidth = direction.max;
					} else {
						popupHeight = direction.max;
					}
				}

				// info about the best position without taking into account type of popup
				bestOffsetInfo = {
					x: clickElementOffsetX + clickElementOffsetWidth / 2 - popupWidth / 2,
					y: clickElementOffsetY + clickElementOffsetHeight / 2 - popupHeight / 2,
					w: popupWidth,
					h: popupHeight,
					dir: direction.dir
				};

				// check type of popup and correct value for "fixedPositionField" coordinate
				bestOffsetInfo[direction.fixedPositionField] +=
					(direction.fixedPositionField === "x" ?
						(popupWidth + clickElementOffsetWidth) * direction.fixedPositionFactor :
						(popupHeight + clickElementOffsetHeight) * direction.fixedPositionFactor)
						/ 2 + options.distance * direction.fixedPositionFactor;

				return bestOffsetInfo;
			}

			/**
			 * Find the best positon of arrow.
			 * @method adjustedPositionAndPlacementArrow
			 * @param {ns.widget.core.ContextPopup} self
			 * @param {Object} bestRectangle
			 * @param {number} x
			 * @param {number} y
			 * @private
			 * @member ns.widget.core.ContextPopup
			 */
			function adjustedPositionAndPlacementArrow(self, bestRectangle, x, y) {
				var ui = self._ui,
					wrapper = ui.wrapper,
					arrow = ui.arrow,
					arrowStyle = arrow.style,
					windowWidth = window.innerWidth,
					windowHeight = window.innerHeight,
					wrapperRect = wrapper.getBoundingClientRect(),
					arrowHalfWidth = arrow.offsetWidth / 2,
					params = {
						"t": {pos: x, min: "left", max: "right", posField: "x", valField: "w", styleField: "left"},
						"b": {pos: x, min: "left", max: "right", posField: "x", valField: "w", styleField: "left"},
						"l": {pos: y, min: "top", max: "bottom", posField: "y", valField: "h", styleField: "top"},
						"r": {pos: y, min: "top", max: "bottom", posField: "y", valField: "h", styleField: "top"}
					},
					param = params[bestRectangle.dir],
					surplus;

				wrapperRect = {
					left: wrapperRect.left + bestRectangle.x,
					right: wrapperRect.right + bestRectangle.x,
					top: wrapperRect.top + bestRectangle.y,
					bottom: wrapperRect.bottom + bestRectangle.y
				};

				if (wrapperRect[param.min] > param.pos - arrowHalfWidth) {
					surplus = bestRectangle[param.posField];
					if (surplus > 0) {
						bestRectangle[param.posField] = Math.max(param.pos - arrowHalfWidth, 0);
						param.pos = bestRectangle[param.posField] + arrowHalfWidth;
					} else {
						param.pos = wrapperRect[param.min] + arrowHalfWidth;
					}
				} else if (wrapperRect[param.max] < param.pos + arrowHalfWidth) {
					surplus = (param.valField === "w" ? windowWidth : windowHeight)
						- (bestRectangle[param.posField] + bestRectangle[param.valField]);
					if (surplus > 0) {
						bestRectangle[param.posField] += Math.min(surplus, (param.pos + arrowHalfWidth) - wrapperRect[param.max]);
						param.pos = bestRectangle[param.posField] + bestRectangle[param.valField] - arrowHalfWidth;
					} else {
						param.pos = wrapperRect[param.max] - arrowHalfWidth;
					}
				}

				arrowStyle[param.styleField] = (param.pos - arrowHalfWidth - bestRectangle[param.posField]) + "px";

				return bestRectangle;
			}

			/**
			 * Set top, left and margin for popup's container.
			 * @method _placementCoordsWindow
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._placementCoordsWindow = function(element) {
				var elementStyle = element.style,
					elementWidth = element.offsetWidth,
					elementHeight = element.offsetHeight;

				elementStyle.top = (window.innerHeight - elementHeight) + "px";
				elementStyle.left = "50%";
				elementStyle.marginLeft = -(elementWidth / 2) + "px";
			};

			/**
			 * Find clicked element.
			 * @method _findClickedElement
			 * @param {number} x
			 * @param {number} y
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._findClickedElement = function(x, y) {
				return document.elementFromPoint(x, y);
			};

			/**
			 * Find and set the best position for popup.
			 * @method _placementCoords
			 * @param {object} options
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._placementCoords = function(options) {
				var self = this,
					positionTo = options.positionTo,
					x = options.x,
					y = options.y,
					element = self.element,
					elementStyle = element.style,
					elementClassList = element.classList,
					elementHeight,
					clickedElement,
					bestRectangle;

				if (typeof positionTo === "string") {
					if (positionTo === positionType.ORIGIN && typeof x === "number" && typeof y === "number") {
						clickedElement = self._findClickedElement(x, y);
					} else if (positionTo !== positionType.WINDOW) {
						try {
							clickedElement = document.querySelector(options.positionTo);
						} catch(e) {}
					}
				} else {
					clickedElement = positionTo;
				}

				if (clickedElement) {

					elementClassList.add(classes.context);

					elementHeight = element.offsetHeight;
					bestRectangle = findBestPosition(self, clickedElement);

					elementClassList.add(classes.arrowDir + bestRectangle.dir);

					bestRectangle = adjustedPositionAndPlacementArrow(self, bestRectangle, x, y);

					if (elementHeight > bestRectangle.h) {
						self._setContentHeight(bestRectangle.h);
					}

					elementStyle.left = bestRectangle.x + "px";
					elementStyle.top = bestRectangle.y + "px";

				} else {
					self._placementCoordsWindow(element);
				}

			};

			/**
			 * Set height for popup's container.
			 * @method _setContentHeight
			 * @param {number} maxHeight
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._setContentHeight = function(maxHeight) {
				var self = this,
					element = self.element,
					content = self._ui.content,
					contentStyle,
					contentHeight,
					elementOffsetHeight;

				if (content) {
					contentStyle = content.style;

					if (contentStyle.height || contentStyle.minHeight) {
						contentStyle.height = "";
						contentStyle.minHeight = "";
					}

					maxHeight = maxHeight || window.innerHeight;

					contentHeight = content.offsetHeight;
					elementOffsetHeight = element.offsetHeight;

					if (elementOffsetHeight > maxHeight) {
						contentHeight -= (elementOffsetHeight - maxHeight);
						contentStyle.height = contentHeight + "px";
						contentStyle.minHeight = contentHeight + "px";
					}
				}

			};

			/**
			 * Hide popup.
			 * @method _onHide
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._onHide = function() {
				var self = this,
					ui = self._ui,
					element = self.element,
					elementClassList = element.classList,
					content = ui.content,
					arrow = ui.arrow;

				PopupPrototype._onHide.call(self);

				elementClassList.remove(classes.context);
				["l", "r", "b", "t"].forEach(function(key) {
					elementClassList.remove(classes.arrowDir + key);
				});

				element.removeAttribute("style");
				content.removeAttribute("style");
				arrow.removeAttribute("style");
			};

			/**
			 * Destroy popup.
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._destroy = function() {
				var self = this,
					element = self.element,
					ui = self._ui,
					wrapper = ui.wrapper;

				PopupPrototype._destroy.call(self);

				[].forEach.call(wrapper.children, function(child) {
					element.appendChild(child);
				});

				wrapper.parentNode.removeChild(wrapper);

				ui.wrapper = null;
				ui.arrow = null;
			};

			/**
			 * Show popup.
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.ContextPopup
			 */
			prototype._show = function(options) {
				var openOptions = objectUtils.merge({}, options);
				this._reposition(openOptions);
				PopupPrototype._show.call(this, openOptions);
			};

			/**
			 * Set new position for popup.
			 * @method reposition
			 * @param options
			 * @param options.x
			 * @param options.y
			 * @param options.positionTo
			 * @member ns.widget.core.ContextPopup
			 */
			prototype.reposition = function(options) {
				if (this._isActive()) {
					this._reposition(options);
				}
			};

			ContextPopup.prototype = prototype;
			ns.widget.core.ContextPopup = ContextPopup;

			engine.defineWidget(
				"popup",
				"[data-role='popup'], .ui-popup",
				[
					"open",
					"close",
					"reposition"
				],
				ContextPopup,
				"core"
			);

			engine.defineWidget(
				"Popup",
				"",
				[
					"open",
					"close",
					"reposition"
				],
				ContextPopup,
				"core",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ContextPopup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));