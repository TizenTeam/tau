/*global window, define, ns */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/widget/BaseWidget",
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/event/gesture",
			"../../../../core/util/DOM",
			"../../../../core/util/selectors",
			"../mobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilsEvents = ns.event,
				utilsSelectors = ns.util.selectors,
				utilsDom = ns.util.DOM,
				STYLE_PATTERN = ".ui-gridview li:nth-child({index})",
				MATRIX_REGEXP = /matrix\((.*), (.*), (.*), (.*), (.*), (.*)\)/,
				DATA_ROLE = "data-role",
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

			function getScrollableParent(element) {
				var overflow;

				while (element !== document.body) {
					overflow = utilsDom.getCSSProperty(element, "overflow-y");
					if (overflow === "scroll" || (overflow === "auto" && element.scrollHeight > element.clientHeight)) {
						return element;
					}
					element = element.parentNode;
				}

				return null;
			}

			prototype._configure = function () {
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

			prototype._build = function (element) {
				return element;
			};

			prototype._init = function (element) {
				var self = this,
					ui = self._ui;

				ui.listElements = [].slice.call(self.element.getElementsByTagName("li"));
				ui.listElHandler = element.querySelectorAll("." + classes.HANDLER);
				self._setItemWidth();
				self._setGridStyle();
				self._setLabel(element);
				self._setReorder(element, self.options.reorder);
				self._calculateListHeight();
				self._ui.content = utilsSelectors.getClosestByClass(element, "ui-content") || window;
				self._ui.scrollableParent = getScrollableParent(element) || self._ui.content;
			};

			prototype._bindEvents = function () {
			};

			prototype._unbindEvents = function () {
				var self = this,
					element = self.element;

				utilsEvents.disableGesture(element);

				utilsEvents.off(element, "drag dragstart dragend dragcancel dragprepare", self);
				utilsEvents.off(element, "pinchin pinchout", self);
			};

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
				self._ui.scrollableParent = getScrollableParent(element) || self._ui.content;
			};

			prototype._destroy = function () {
				this._unbindEvents();
				this._removeGridStyle();
			};

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
				}
			};

			prototype._start = function (event) {
				var self = this,
					element = self.element,
					helper = self._ui.helper,
					helperElement = event.detail.srcEvent.srcElement.parentElement,
					helperStyle = helperElement.style,
					translated = window.getComputedStyle(helperElement).webkitTransform.match(MATRIX_REGEXP),
					holder, top, left;

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

			prototype._createHolder = function () {
				var holder = document.createElement("li"),
					classList = holder.classList;

				classList.add(classes.ITEM);
				classList.add(classes.HOLDER);

				return holder;
			};

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

			prototype._getParentPage = function (element) {
				while (element && element !== document.body) {
					if (element.getAttribute(DATA_ROLE) === "page") {
						return element;
					}
					element = element.parentNode;
				}
				return document.body;
			};

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

			prototype._setGridStyle = function () {
				var self = this,
					length = self._ui.listElements.length,
					options = self.options,
					page = self._getParentPage(),
					cols = options.cols,
					rows,
					styleElement,
					styles = [],
					index = 0, row, col;

				styleElement = document.createElement("style");
				styleElement.type = "text/css";

				rows = Math.ceil(length / cols);

				for(row = 0; row < rows; row++) {
					for(col = 0; col < cols && index < length; col++) {
						styles.push(self._getTransformStyle(col, row, ++index));
					}
				}
				styleElement.textContent = styles.join("\n");
				page.appendChild(styleElement);
				self._styleElement = styleElement;
			};

			prototype._getTransformStyle = function (col, row, index) {
				var x = col * 100 + "%",
					y = row * 100 + "%",
					transform, style;

				transform = "{ -webkit-transform: translate3d(" + x + ", " + y + ", 0); transform: translate3d(" + x + ", " + y + ", 0); }";
				style = STYLE_PATTERN.replace("{index}", index) + transform;

				return style;
			};

			prototype._removeGridStyle = function() {
				var styleElement = this._styleElement;

				if (styleElement) {
					styleElement.parentNode.removeChild(styleElement);
					this._styleElement = null;
				}
			};

			prototype.addItem = function (item) {
				var self = this,
					listElements = self._ui.listElements,
					styleElement = self._styleElement,
					styles = styleElement.textContent,
					element = self.element,
					cols = self.options.cols,
					col, row, length;

				// append item
				item.classList.add(classes.ITEM);
				item.style.width = listElements[0].offsetWidth + "px";
				element.appendChild(item);
				listElements.push(item);

				// calculate item position
				length = listElements.length;
				row = Math.floor((length - 1) / cols);
				col = (length - 1) % cols;

				// add trnasform style for item added
				styleElement.textContent = styles.concat("\n" + self._getTransformStyle(col, row, length));
			};

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
