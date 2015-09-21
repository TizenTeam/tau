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
 * # GridView component
 * Grid View components provides a list of grid-type and presents contents that are easily identified as images.
 *
 * ##Default Selectors
 * By default, all ul elements with the class="ui-gridview" or data-role="gridview" attribute are displayed as grid view components.
 *
 * ##Manual constructor
 *
 *      @example
 *      <ul id="gridview" class="ui-gridview">
 *          <li class="ui-gridview-item">
 *              <img class="ui-gridview-image" src="images/1.jpg">
 *              <div class="ui-gridview-handler"></div>
 *          </li>
 *          <li class="ui-gridview-item">
 *              <img class="ui-gridview-image" src="images/2.jpg">
 *              <div class="ui-gridview-handler"></div>
 *          </li>
 *          <li class="ui-gridview-item">
 *              <img class="ui-gridview-image" src="images/3.jpg">
 *              <div class="ui-gridview-handler"></div>
 *          </li>
 *          <li class="ui-gridview-item">
 *              <img class="ui-gridview-image" src="images/4.jpg">
 *              <div class="ui-gridview-handler"></div>
 *          </li>
 *      </ul>
 *      <script>
 *          var elGridView = document.getElementById("gridview"),
 *               gridView = tau.widget.GridView(elGridView);
 *      </script>
 *
 * @class ns.widget.mobile.GridView
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/widget/BaseWidget",
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/event/gesture",
			"../../../../core/util/selectors",
			"../mobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilsEvents = ns.event,
				utilsSelectors = ns.util.selectors,
				STYLE_PATTERN = ".ui-gridview li:nth-child({index})",
				MATRIX_REGEXP = /matrix\((.*), (.*), (.*), (.*), (.*), (.*)\)/,
				direction = {
					PREV: 0,
					NEXT: 1
				},
				labels = {
					IN: "in",
					OUT: "out",
					NONE: "none"
				},
				classes = {
					GRIDLIST: "ui-gridview",
					ITEM: "ui-gridview-item",
					HELPER: "ui-gridview-helper",
					HOLDER: "ui-gridview-holder",
					LABEL: "ui-gridview-label",
					LABEL_IN: "ui-gridview-label-in",
					LABEL_OUT: "ui-gridview-label-out",
					HANDLER: "ui-gridview-handler"
				},
				GridView = function () {
					var self = this;
					self.options = {};
					self._direction = 0;
					self._styleElement = null;
					self._ui = {
						listElements: [],
						listElHandler: null,
						listItems: [],
						helper: {},
						holder: {},
						scrollableParent: null,
						content: null
					};
				},
				prototype = new BaseWidget();

			GridView.prototype = prototype;
			GridView.classes = classes;

			/**
			 * Configure options for GridView
			 * @method _configure
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._configure = function () {
				/**
				 * Options for widget.
				 * @property {Object} options
				 * @property {number} [options.cols=4] the number of columns to be displayed
				 * @property {boolean} [options.reorder=false] represents whether grid view is reorder mode
				 * @property {string} [options.label="none"] type of label to be attached to grid item("none", "in", "out")
				 * @property {number} [options.minWidth=null] minimum width px of grid item(number or "auto")
				 * @property {number} [options.minCols=1] the minimum number of columns
				 * @property {number} [options.maxCols=5] the maximum number of columns
				 * @member ns.widget.mobile.GridView
				 */
				this.options = {
					cols: 4,
					reorder: false,
					label: labels.NONE,
					minWidth: null,
					minCols: 1,
					maxCols: 5
				};
				this._direction = direction.NEXT;
			};

			/**
			 * Build GridView
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._build = function (element) {
				return element;
			};

			/**
			 * Initialize GridView
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui;

				ui.listElements = [].slice.call(self.element.getElementsByTagName("li"));
				ui.listElHandler = element.querySelectorAll("." + classes.HANDLER);
				ui.content = utilsSelectors.getClosestByClass(element, "ui-content") || window;
				ui.scrollableParent = utilsSelectors.getScrollableParent(element) || self._ui.content;
				ui.page = utilsSelectors.getClosestBySelector(element, engine.getWidgetDefinition("Page").selector);
				self._setItemWidth();
				self._setGridStyle();
				self._setLabel(element);
				self._setReorder(element, self.options.reorder);
				self._calculateListHeight();
			};


			/**
			 * Bind pageBeforeShow event
			 * @method _onPagebeforeshow
			 * @member ns.widget.core.GridView
			 * @protected
			 */
			prototype._onPagebeforeshow = function() {
				this.refresh();
			};

			/**
			 * Bind events for GridView
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._bindEvents = function () {
				utilsEvents.on(this._ui.page, "pagebeforeshow", this, false);
			};

			/**
			 * Unbind events for GridView
			 * @method _unbindEvents
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._unbindEvents = function () {
				var self = this,
					element = self.element;

				utilsEvents.disableGesture(element);

				utilsEvents.off(element, "drag dragstart dragend dragcancel dragprepare", self);
				utilsEvents.off(element, "pinchin pinchout", self);
				utilsEvents.off(self._ui.page, "pagebeforeshow", self, false);
			};

			/**
			 * Refresh GridView
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._refresh = function () {
				var self = this,
					ui = self._ui,
					element = self.element;

				self._removeGridStyle();
				ui.listElements = [].slice.call(element.getElementsByTagName("li"));
				ui.listElHandler = element.querySelectorAll("." + classes.HANDLER);
				self._setItemWidth();
				self._setGridStyle();
				self._setLabel(element);
				self._setReorder(element, self.options.reorder);
				self._calculateListHeight();
				self._ui.content = utilsSelectors.getClosestByClass(element, "ui-content") || window;
				self._ui.scrollableParent = utilsSelectors.getScrollableParent(element) || self._ui.content;
			};

			/**
			 * Destroy GridView
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._destroy = function () {
				this._unbindEvents();
				this._removeGridStyle();
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @public
			 * @param {Event} event Event
			 * @member ns.widget.mobile.GridView
			 */
			prototype.handleEvent = function(event) {
				var self = this;

				switch (event.type) {
					case "dragprepare":
						if(event.detail.srcEvent.srcElement.classList.contains(classes.HANDLER)) {
							break;
						}
						event.preventDefault();
						break;
					case "dragstart":
						if(event.detail.srcEvent.srcElement.classList.contains(classes.HANDLER)) {
							self._start(event);
							break;
						}
						event.preventDefault();
						break;
					case "drag":
						self._move(event);
						break;
					case "dragend":
						self._end(event);
						break;
					case "pinchin":
						self._in(event);
						break;
					case "pinchout":
						self._out(event);
						break;
					case "pagebeforeshow":
						self._onPagebeforeshow(event);
						break;
				}
			};

			/**
			 * Method for dragstart event
			 * @method _start
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.mobile.GridView
			 */
			prototype._start = function (event) {
				var self = this,
					element = self.element,
					helper = self._ui.helper,
					helperElement = event.detail.srcEvent.srcElement.parentElement,
					helperStyle = helperElement.style,
					translated = window.getComputedStyle(helperElement).webkitTransform.match(MATRIX_REGEXP),
					holder, top, left;

				// custom elements polyfill patch
				helperElement = wrap(helperElement);
				//--
				self._refreshItemsInfo();
				top = parseInt(translated[6], 10);
				left = parseInt(translated[5], 10);
				helperElement.classList.add(classes.HELPER);
				holder = self._createHolder();
				element.insertBefore(holder, helperElement);
				element.appendChild(helperElement);
				helperStyle.top = top + "px";
				helperStyle.left = left + "px";

				helper.element = helperElement;
				helper.style = helperStyle;
				helper.position = {
					startTop: top,
					startLeft: left,
					moveTop: top,
					moveLeft: left
				};

				helper.startX = event.detail.estimatedX;
				helper.startY = event.detail.estimatedY;
				helper.width = helperElement.offsetWidth;
				helper.height = helperElement.offsetHeight;

				self._ui.holder = holder;
				helper.element = helperElement;
				self._ui.helper = helper;
			};

			/**
			 * Method for drag event
			 * @method _move
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.mobile.GridView
			 */
			prototype._move = function (event) {
				var self = this,
					ui = self._ui,
					element = self.element,
					listItems = ui.listItems,
					length = listItems.length,
					helper = self._ui.helper,
					style = helper.style,
					position = helper.position,
					helperElement = helper.element,
					startX = helper.startX,
					startY = helper.startY,
					moveX, moveY, i,
					scrollableParent = self._ui.scrollableParent,
					autoScrollDown,
					autoScrollUp,
					scrollUnit;

				moveY = position.startTop + event.detail.estimatedY - startY;
				moveX = position.startLeft + event.detail.estimatedX - startX;
				autoScrollDown = (element.offsetTop + moveY + helperElement.offsetHeight) - (scrollableParent.offsetHeight + scrollableParent.scrollTop);
				autoScrollUp = scrollableParent.scrollTop - (element.offsetTop + moveY);
				scrollUnit = helperElement.offsetHeight / 5;
				if( autoScrollDown > 0 && ((helperElement.offsetTop + helperElement.offsetHeight) < element.offsetHeight)) {
					scrollableParent.scrollTop += scrollUnit;
					moveY += scrollUnit;
					position.startTop += scrollUnit;
				}
				if( autoScrollUp > 0 && helperElement.offsetTop > 0) {
					scrollableParent.scrollTop -= scrollUnit;
					moveY -= scrollUnit;
					position.startTop -= scrollUnit;
				}
				style.top = moveY + "px";
				style.left = moveX + "px";
				position.moveTop = moveY;
				position.moveLeft = moveX;

				for (i = 0; i < length; i++) {
					if (self._compareOverlapItem(listItems[i])) {
						self._direction ? element.insertBefore(ui.holder, listItems[i].element.nextSibling) : element.insertBefore(ui.holder, listItems[i].element);
						self._refreshItemsInfo();
					}
				}
			};

			/**
			 * Method for dragend event
			 * @method _end
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._end = function () {
				var self = this,
					element = self.element,
					helper = self._ui.helper,
					helperElement = helper.element,
					holder = self._ui.holder;

				helperElement.classList.remove(classes.HELPER);
				helper.style.top = 0;
				helper.style.left = 0;
				element.insertBefore(helperElement, holder);
				element.removeChild(holder);
				self._ui.helper = {};
			};

			/**
			 * Method for pinchout event
			 * @method _out
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._out = function () {
				var self = this,
					options = self.options,
					cols = options.cols,
					minCols = options.minCols;

				if (cols > minCols) {
					options.minWidth = null;
					options.cols = cols - 1;
					self._refresh();
				}
			};

			/**
			 * Method for pinchin event
			 * @method _in
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._in = function () {
				var self = this,
					options = self.options,
					cols = options.cols,
					maxCols = options.maxCols;

				if (maxCols === null || cols < maxCols) {
					options.cols = cols + 1;
					options.minWidth = null;
					self._refresh();
				}
			};

			/**
			 * Check whether a selected item is overlapped with adjacent items
			 * @method _compareOverlapItem
			 * @protected
			 * @param {HTMLElement} item
			 * @member ns.widget.mobile.GridView
			 */
			prototype._compareOverlapItem = function (item) {
				var self = this,
					helper = self._ui.helper,
					position = helper.position,
					overlapWidth, overlapHeight;

				if (helper.element === item.element) {
					return false;
				}

				if (position.moveTop > item.top || (position.moveTop === item.top && position.moveLeft > item.left)) {
					self._direction = direction.PREV;
				} else {
					self._direction = direction.NEXT;
				}

				overlapWidth = position.moveTop > item.top ? item.top + item.height - position.moveTop : position.moveTop + helper.height - item.top;
				overlapHeight = position.moveLeft > item.left ? item.left + item.width - position.moveLeft : position.moveLeft + helper.width - item.left;

				if (overlapWidth <= 0 || overlapHeight <= 0) {
					return false;
				} else if (overlapWidth * overlapHeight > item.height * item.width / 2) {
					return true;
				}
				return false;
			};

			/**
			 * Calculate and set the height of grid view depending on the number of columns
			 * @method _calculateListHeight
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._calculateListHeight = function () {
				var self = this,
					listElements = self._ui.listElements,
					itemHeight, rows;

				window.setTimeout(function () {
					rows = Math.ceil(listElements.length / self.options.cols);
					itemHeight = listElements[0].offsetHeight;
					self.element.style.height = (itemHeight * rows) + "px";
				}, 300);
			};

			/**
			 * Update information of each list item
			 * @method _refreshItemsInfo
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._refreshItemsInfo = function () {
				var self = this,
					listElements = self._ui.listElements,
					length = listElements.length,
					listItems = [],
					translated, li, i;

				for (i = 0; i < length; i++) {
					li = listElements[i];
					translated = window.getComputedStyle(li).webkitTransform.match(MATRIX_REGEXP);
					listItems.push({
						top: parseInt(translated[6], 10),
						left: parseInt(translated[5], 10),
						height: li.offsetHeight,
						width: li.offsetWidth,
						element: li
					});
				}

				self._ui.listItems = listItems;

			};

			/**
			 * Create holder element to help reordering
			 * @method _createHolder
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._createHolder = function () {
				var holder = document.createElement("li"),
					classList = holder.classList;

				classList.add(classes.ITEM);
				classList.add(classes.HOLDER);

				return holder;
			};

			/**
			 * Set the width of each item
			 * @method _setItemWidth
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._setItemWidth = function() {
				var self = this,
					options = self.options,
					parentWidth = self.element.offsetWidth,
					minWidth = options.minWidth,
					listElements = self._ui.listElements,
					length = listElements.length,
					cols, i, width;

				if (minWidth === "auto") {
					minWidth = listElements[0].offsetWidth;
					options.minWidth = minWidth;
				} else {
					minWidth = parseInt(minWidth, 10);
				}

				cols = minWidth ? Math.floor(parentWidth / minWidth) : options.cols;
				width = parentWidth / cols + "px";

				for (i = 0; i < length; i++) {
					listElements[i].style.width = width;
				}

				options.cols = cols;
			};

			/**
			 * Toggle grid view reordering mode
			 * @method _setReorder
			 * @protected
			 * @param {HTMLElement} element
			 * @param {boolean} reorder
			 * @member ns.widget.mobile.GridView
			 */
			prototype._setReorder = function (element, reorder) {
				var self = this,
					options = self.options;

				utilsEvents.disableGesture(element);

				if (reorder) {
					utilsEvents.enableGesture(
						element,
						new utilsEvents.gesture.Drag({
							blockVertical: false
						})
					);
					utilsEvents.on(element, "drag dragstart dragend dragcancel dragprepare", self, true);
					utilsEvents.off(element, "pinchin pinchout", self);
					element.classList.add("ui-gridview-reorder");
				} else {
					utilsEvents.enableGesture(
						element,
						new utilsEvents.gesture.Pinch()
					);
					utilsEvents.off(element, "drag dragstart dragend dragcancel dragprepare", self, true);
					utilsEvents.on(element, "pinchin pinchout", self);
					element.classList.remove("ui-gridview-reorder");
				}

				options.reorder = reorder;
			};

			/**
			 * Set style for grid view
			 * @method _setGridStyle
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._setGridStyle = function () {
				var self = this,
					length = self._ui.listElements.length,
					options = self.options,
					cols = options.cols,
					rows,
					styleElement,
					styles = [],
					index = 0, row, col,
					element = self.element,
					elementId = element.id ? "#" + element.id : "";

				styleElement = document.createElement("style");
				styleElement.type = "text/css";

				rows = Math.ceil(length / cols);

				for(row = 0; row < rows; row++) {
					for(col = 0; col < cols && index < length; col++) {
						styles.push(self._getTransformStyle(elementId, col, row, ++index));
					}
				}
				styleElement.textContent = styles.join("\n");

				document.head.appendChild(styleElement);

				self._styleElement = styleElement;
			};

			/**
			 * Define transform style for positioning of grid items
			 * @method _getTransformStyle
			 * @protected
			 * @param {string} selectorPrefix
			 * @param {number} col
			 * @param {number} row
			 * @param {number|string} index
			 * @member ns.widget.mobile.GridView
			 */
			prototype._getTransformStyle = function (selectorPrefix, col, row, index) {
				var x = col * 100 + "%",
					y = row * 100 + "%",
					transform, style;

				transform = "{ -webkit-transform: translate3d(" + x + ", " + y + ", 0); transform: translate3d(" + x + ", " + y + ", 0); }";
				style = selectorPrefix + STYLE_PATTERN.replace("{index}", index) + transform;

				return style;
			};

			/**
			 * Remove style node
			 * @method _removeGridStyle
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._removeGridStyle = function() {
				var styleElement = this._styleElement;

				if (styleElement) {
					styleElement.parentNode.removeChild(styleElement);
					this._styleElement = null;
				}
			};

			/**
			 * Add an item to grid view
			 * @method addItem
			 * @public
			 * @param {HTMLElement} item
			 * @member ns.widget.mobile.GridView
			 */
			prototype.addItem = function (item) {
				var self = this,
					listElements = self._ui.listElements,
					styleElement = self._styleElement,
					styles = styleElement.textContent,
					element = self.element,
					cols = self.options.cols,
					col, row, length,
					elementId = element.id ? "#" + element.id : "";

				// append item
				item.classList.add(classes.ITEM);
				item.style.width = listElements[0].offsetWidth + "px";
				element.appendChild(item);
				listElements.push(item);

				// calculate item position
				length = listElements.length;
				row = Math.floor((length - 1) / cols);
				col = (length - 1) % cols;

				// add transform style for item added
				styleElement.textContent = styles.concat("\n" + self._getTransformStyle(elementId, col, row, length));
			};

			/**
			 * Remove an item from grid view
			 * @method removeItem
			 * @public
			 * @param {HTMLElement} item
			 * @member ns.widget.mobile.GridView
			 */
			prototype.removeItem = function (item) {
				var self = this,
					element = self.element,
					listElements = self._ui.listElements,
					styleElement = self._styleElement,
					styles = styleElement.textContent.split("\n"),
					index;

				index = listElements.indexOf(item);

				if (index > -1) {
					listElements.splice(index, 1);
					element.removeChild(item);
					styles.pop();
					styleElement.textContent = styles.join("\n");
				}
			};

			/**
			 * Set label type for grid view
			 * @method _setLabel
			 * @protected
			 * @param {HTMLElement} element
			 * @param {string} [label]
			 * @member ns.widget.mobile.GridView
			 */
			prototype._setLabel = function (element, label) {
				var self = this,
					options = self.options,
					labelCheck;
				
				labelCheck = label || options.label;

				element.classList.remove(classes.LABEL_IN);
				element.classList.remove(classes.LABEL_OUT);

				if (labelCheck === labels.IN) {
					element.classList.add(classes.LABEL_IN);
				} else if (labelCheck === labels.OUT) {
					element.classList.add(classes.LABEL_OUT);
				}

				options.label = labelCheck;
			};

			ns.widget.mobile.GridView = GridView;

			engine.defineWidget(
				"GridView",
				"ul.ui-gridview, ul[data-role='gridview']",
				[],
				GridView,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.GridView;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
