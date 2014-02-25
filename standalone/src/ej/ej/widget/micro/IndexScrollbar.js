/*global window, define */
/*jslint nomen: true, plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../engine",
			"../../utils/events",
			"../micro",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				events = ns.utils.events,
				/**
				* IndexScrollbar widget
				* @class ns.widget.micro.IndexScrollbar
				* @extends ns.widget.BaseWidget
				*/
				IndexScrollbar = function () {
					var self = this;
					/**
					* @memberOf ns.widget.micro.IndexScrollbar
					*/

					self.options = {
						moreChar: "*",
						indicatorClass: "ui-indexscrollbar-indicator",
						selectedClass: "ui-state-selected",
						delimeter: ",",
						index: [ "A", "B", "C", "D", "E", "F", "G", "H",
								"I", "J", "K", "L", "M", "N", "O", "P", "Q",
								"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"],
						maxIndexLen: 0,
						indexHeight: 36,
						delayTime: 50,
						container: null
					};

					self.indicator = null;
					self.index = null;
					self.isShowIndicator = false;
					self.touchAreaOffsetLeft = 0;
					self.indexElements = null;
					self.selectEventTriggerTimeoutId = null;
					self.ulMarginTop = 0;
					self._extended = false;

					self.indexCellInfomations = {
						indices: [],
						mergedIndices: [],
						indexLookupTable: [],

						clear: function () {
							var indexCellInfomations = this;
							indexCellInfomations.indices.length = 0;
							indexCellInfomations.mergedIndices.length = 0;
							indexCellInfomations.indexLookupTable.length = 0;
						}
					};

					self.eventHandlers = {};

					return self;
				},
				EventType = {},
				classes = {},
				prototype = new BaseWidget();
			IndexScrollbar.classes = classes;
			IndexScrollbar.events = EventType;

			prototype.widgetClass = "ui-indexscrollbar";

			prototype._build = function (template, element) {
				var self = this;
				if (!self._isExtended()) {
					self._createIndicator(element);
					self._updateLayout(element);
					self._setExtended(true);
				}
				return element;
			};

			prototype._isValidElement = function (element) {
				return element.classList.contains(this.widgetClass);
			};

			prototype._isExtended = function () {
				return !!this._extended;
			};

			prototype._setExtended = function (flag) {
				this._extended = flag;
				return this;
			};

			prototype._getIndex = function () {
				var options = this.options,
					index = options.index;
				if (typeof index === 'string') {
					index = index.split(options.delimeter);
					options.index = index;
				}
				return index;
			};

			prototype._getContainer = function (element) {
				return this.options.container || element.parentNode;
			},

			/** Draw additinonal sub-elements
			* @param {Array} indices List of index string
			* @memberOf ns.widget.micro.IndexScrollbar
			*/
			prototype._draw = function (element) {
				var self = this,
					options = self.options,
					indexCellInfomations = self.indexCellInfomations,
					container = self._getContainer(element),
					moreChar = options.moreChar,
					indices = indexCellInfomations.indices,
					mergedIndices = indexCellInfomations.mergedIndices,
					indexSize = mergedIndices.length,
					containerHeight = container.offsetHeight,
					indexHeight = options.indexHeight,
					leftHeight = containerHeight - indexHeight * indexSize,
					addHeightOffset = leftHeight,
					indexCellHeight,
					text,
					ul,
					li,
					i,
					m,
					addMoreCharLineHeight = 9; // to adjust position of morechar

				ul = document.createElement("ul");
				for (i = 0; i < indexSize; i++) {
					m = mergedIndices[i];
					text = m.length === 1 ? indices[m.start] : moreChar;
					indexCellHeight = i < addHeightOffset ? indexHeight + 1 : indexHeight;

					li = document.createElement("li");
					li.textContent = text;
					li.style.height = indexCellHeight + "px";
					li.style.lineHeight = text === moreChar ? indexCellHeight + addMoreCharLineHeight + "px" : indexCellHeight + "px";
					ul.appendChild(li);
				}
				// Set ul's margin-top
				self.ulMarginTop = Math.floor((parseInt(containerHeight, 10) - indexSize * indexHeight)/2);
				ul.style.marginTop = self.ulMarginTop + "px";
				element.appendChild(ul);

				return self;
			};

			prototype._createIndicator = function (element) {
				var self = this,
					indicator = document.createElement("DIV"),
					container = self._getContainer(element);

				indicator.setAttribute("id", element.id + "-div-indicator");
				indicator.className = self.options.indicatorClass;
				indicator.innerHTML = "<span></span>";
				container.insertBefore(indicator, element);

				self.indicator = indicator;
			};

			prototype._removeIndicator = function () {
				this.indicator.parentNode.removeChild(this.indicator);
			};

			prototype._changeIndicator = function (idx/*, cellElement */) {
				var self = this,
					options = self.options,
					selectedClass = options.selectedClass,
					cellInfomations = self.indexCellInfomations,
					cellElement,
					val;

				if (!self.indicator || idx === self.index) {
					return false;
				}

				// TODO currently touch event target is not correct. it's browser bugs.
				// if the bug is fixed, this logic that find cellelem have to be removed.
				cellElement = self.indexElements[cellInfomations.indexLookupTable[idx].cellIndex];
				self._clearSelected();
				cellElement.classList.add(selectedClass);

				val = cellInfomations.indices[idx];
				self.indicator.firstChild.innerHTML = val;

				self.index = idx;

				if (self.selectEventTriggerTimeoutId) {
					window.clearTimeout(self.selectEventTriggerTimeoutId);
				}
				self.selectEventTriggerTimeoutId = window.setTimeout(function () {
					events.trigger(self.element, "select", {index: val});
					self.selectEventTriggerTimeoutId = null;
				}.bind(self), options.delayTime);

			};

			prototype._clearSelected = function () {
				var el = this.element,
					selectedClass = this.options.selectedClass,
					selectedElements = el.getElementsByClassName(selectedClass),
					selectedElementsLen = selectedElements.length,
					i;

				for (i = 0; i < selectedElementsLen; i++) {
					selectedElements[i].classList.remove(selectedClass);
				}
			};

			prototype._getPositionFromEvent = function (ev) {
				return ev.type.search(/^touch/) !== -1 ?
						{x: ev.touches[0].clientX, y: ev.touches[0].clientY} :
						{x: ev.clientX, y: ev.clientY};
			};

			prototype._findIndexByPosition = function (posY) {
				var rectTable = this.indexCellInfomations.indexLookupTable,
					i,
					len,
					info,
					range;
				for (i = 0, len = rectTable.length; i < len; i++) {
					info = rectTable[i];
					range = posY - info.top;
					if (range >= 0 && range < info.range) {
						return i;
					}
				}
				return -1;
			};

			prototype._showIndicator = function () {
				var self = this;
				if (self.isShowIndicator || !self.indicator) {
					return false;
				}

				self.indicator.style.display = "block";
				self.isShowIndicator = true;
			};

			prototype._hideIndicator = function () {
				var self = this;
				if (!self.isShowIndicator || !self.indicator) {
					return false;
				}

				self._clearSelected();
				self.indicator.style.display = "none";
				self.isShowIndicator = false;
				self.index = null;
			};

			prototype._onTouchStartHandler = function ( self, event ) {
				var pos = self._getPositionFromEvent(event),
					idx = self._findIndexByPosition(pos.y);

				if (idx < 0) {
					idx = 0;
				}

				self._changeIndicator(idx, event.target);
				self._showIndicator();
			};

			prototype._onTouchEndHandler = function ( self, event) {
				if ( event.touches.length <= 1 ) {
					self._hideIndicator();
				}
			};

			prototype._onTouchMoveHandler = function ( self, event ) {
				var pos,
					idx;

				if (self.isShowIndicator && event.touches.length === 1 ) {
					pos = self._getPositionFromEvent(event);
					idx = self._findIndexByPosition(pos.y);

					if (idx > -1 && pos.x > self.touchAreaOffsetLeft) {
						self._changeIndicator(idx, event.target);
					}

					event.preventDefault();
					event.stopPropagation();
				}
			};

			prototype._bindResizeEvent = function () {
				var self = this;
				self.eventHandlers.onresize = function (/* ev */) {
					self.refresh();
				};

				window.addEventListener("resize", self.eventHandlers.onresize, false);
			};

			prototype._unbindResizeEvent = function () {
				var event = this.eventHandlers.onresize;
				if (event) {
					window.removeEventListener("resize", event, false);
				}
			};

			prototype._clear = function (element) {
				element = element || this.element;
				while (element.firstChild) {
					element.removeChild(element.firstChild);
				}
			};

			function clickCallback(self, event) {
				var target = event.target,
					index = "";
				if ("li" === target.tagName.toLowerCase()) {
					index = target.innerText;
					events.trigger(self.element, "select", {index: index});
				}
			}

			prototype._setLayoutValues = function (element) {
				var indicator = this.indicator,
					container = this._getContainer(element),
					positionStyle = window.getComputedStyle(container).position,
					containerOffsetTop = container.offsetTop,
					containerOffsetLeft = container.offsetLeft,
					indicatorStyle = indicator.style;

				if (indicator) {
					indicatorStyle.width = container.offsetWidth + "px";
					indicatorStyle.height = container.offsetHeight + "px";
				}

				if (positionStyle !== "absolute" && positionStyle !== "relative") {
					element.style.top = containerOffsetTop + "px";
					indicatorStyle.top = containerOffsetTop + "px";
					indicatorStyle.left = containerOffsetLeft + "px";
				}
			};

			prototype._setMaxIndexLen = function(element) {
				var options = this.options,
					maxIndexLen = options.maxIndexLen,
					container = this._getContainer(element),
					containerHeight = container.offsetHeight;

				// this should be counted always (during initialization and resizing)
				maxIndexLen = Math.floor( containerHeight / options.indexHeight );

				if(maxIndexLen > 0 && maxIndexLen%2 === 0) {
					maxIndexLen -= 1;	// Ensure odd number
				}
				options.maxIndexLen = maxIndexLen;
			},

			prototype._updateLayout = function(element) {
				var self = this;
				self._setLayoutValues(element);
				self._setMaxIndexLen(element);
				self._updateIndexCellInfomation();
				self._draw(element);
				self._updateIndexCellRectInfomation(element);

				self.touchAreaOffsetLeft = element.offsetLeft - 10;
			},

			prototype._updateIndexCellInfomation = function () {
				var self = this,
					indexCellInfomations = self.indexCellInfomations,
					maxIndexLen = self.options.maxIndexLen,
					indices = self._getIndex(),
					indexSize = indices.length,
					showIndexSize = Math.min(indexSize, maxIndexLen),
					totalLeft = indexSize - maxIndexLen,
					leftPerItem = window.parseInt(totalLeft / (window.parseInt(showIndexSize / 2, 10)), 10),
					left = totalLeft % (window.parseInt(showIndexSize / 2, 10)),
					indexItemSizeArr = [],
					mergedIndices = [],
					i,
					len,
					pos = 0;

				for (i = 0, len = showIndexSize; i < len; i++) {
					indexItemSizeArr[i] = 1;
					// if counter is even, we will put 'moreChar' sign, which symbolizes for leftPerItem[+1] items
					if (i % 2) {
						indexItemSizeArr[i] += leftPerItem + (left > 0 ? 1 : 0);
						left--;
					}
				}

				for (i = 0, len = showIndexSize; i < len; i++) {
					pos += indexItemSizeArr[i];

					mergedIndices.push({
						start: pos - 1,
						length: indexItemSizeArr[i]
					});
				}

				indexCellInfomations.indices = indices;
				indexCellInfomations.mergedIndices = mergedIndices;
			};

			prototype._updateIndexCellRectInfomation = function (element) {
				var self = this,
					mergedIndices = self.indexCellInfomations.mergedIndices,
					containerOffset = self._getOffset(self._getContainer(element)).top,
					indexLookupTable = [];

				[].forEach.call(element.getElementsByTagName("li"), function (node, idx) {
					var mergedIndice = mergedIndices[idx],
						mergedIndiceLen = mergedIndice.length,
						i = mergedIndice.start,
						len = i + mergedIndiceLen,
						top = containerOffset + node.offsetTop,
						height = node.offsetHeight / mergedIndiceLen;

					for ( ; i < len; i++) {
						indexLookupTable.push({
							cellIndex: idx,
							top: top,
							range: height
						});
						top += height;
					}
				});

				self.indexCellInfomations.indexLookupTable = indexLookupTable;
				self.indexElements = element.children[0].children;
			};

			prototype._bindEvents = function (element) {
				var self = this;
				element = element || self.element;
				self.clickCallback = clickCallback.bind(null, self);
				element.addEventListener("click", self.clickCallback, false);
				self._bindResizeEvent();
				self._bindEventToTriggerSelectEvent();
				return self;
			};

			prototype._unbindEvent = function () {
				this._unbindResizeEvent();
				this._unbindEventToTriggerSelectEvent();
			};

			prototype._getOffset = function (element) {
				var left = 0,
					top = 0;
				do {
					top += element.offsetTop;
					left += element.offsetLeft;
					element = element.offsetParent;
				} while (element !== null);

				return {
					top: top,
					left: left
				};
			};

			prototype._refresh = function () {
				var self = this,
					bindEvents = false;
				if (self._isExtended()) {
					self._unbindEvent();
					self._hideIndicator();
					self._clear();
					self._setExtended(false);
					bindEvents = true;
				}

				self._updateLayout(self.element);
				if (bindEvents) {
					self._bindResizeEvent();
					self._bindEventToTriggerSelectEvent();
				}
				self._setExtended(true);
			};

			prototype._bindEventToTriggerSelectEvent = function () {
				var self = this,
					element = self.element;
				self.eventHandlers.touchStart = self._onTouchStartHandler.bind(null, self);
				self.eventHandlers.touchEnd = self._onTouchEndHandler.bind(null, self);
				self.eventHandlers.touchMove = self._onTouchMoveHandler.bind(null, self);

				element.addEventListener("touchstart", self.eventHandlers.touchStart, false);
				element.addEventListener("touchmove", self.eventHandlers.touchMove, false);
				document.addEventListener("touchend", self.eventHandlers.touchEnd, false);
				document.addEventListener("touchcancel", self.eventHandlers.touchEnd, false);
			};

			prototype._unbindEventToTriggerSelectEvent = function () {
				var self = this,
					element = self.element;
				element.removeEventListener("touchstart", self.eventHandlers.touchStart, false);
				element.removeEventListener("touchmove", self.eventHandlers.touchMove, false);
				document.removeEventListener("touchend", self.eventHandlers.touchEnd, false);
				document.removeEventListener("touchcancel", self.eventHandlers.touchEnd, false);
			};


			/* This method registers the specified listener
			 * @method addEventListener
			 * @param {string} type name of the event to listen for
			 * @param {Function} listener event handler function to associate with the event
			 * @param {boolean} [capture] specifies whether the event needs to be captured or not
			 * @memberOf ns.widget.micro.IndexScrollbar,
			 * @instance
			 */
			prototype.addEventListener = function (type, listener, capture) {
				this.element.addEventListener(type, listener, capture);
			};

			/* This method removes the specified listener
			 * @method removeEventListener
			 * @param {string} type name of the event being registered
			 * @param {Function} listener event handler function to associate with the event
			 * @param {boolean} [capture] specifies whether the event needs to be captured or not
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype.removeEventListener = function (type, listener, capture) {
				this.element.removeEventListener(type, listener, capture);
			};

			/**
			* init widget
			* @method _init
			* @param {HTMLElement} element
			* @new
			* @memberOf ns.widget.micro.IndexScrollbar
			*/
			prototype._init = function (element) {
				var self = this;
				self._setExtended(true);
				self.indicator = document.getElementById(element.id + "-div-indicator");
				return element;
			};

			/**
			* @method _destroy
			* @private
			* @memberOf ns.widget.micro.IndexScrollbar
			*/
			prototype._destroy = function () {
				var self = this;
				self._unbindEvent();
				self._removeIndicator();
				self._clear();
				self._setExtended(false);

				self.indicator = null;
				self.index = null;
				self.isShowIndicator = false;
				self.indexCellInfomations = null;
				self.eventHandlers = null;
			};

			IndexScrollbar.prototype = prototype;

			// definition
			ns.widget.micro.IndexScrollbar = IndexScrollbar;
			engine.defineWidget(
				"IndexScrollbar",
				"",
				".ui-indexscrollbar",
				[],
				IndexScrollbar,
				'micro'
			);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return IndexScrollbar;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
