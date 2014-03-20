/*global define, ns, document, window */
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../engine",
			"../../utils/events",
			"../../utils/DOM/css",
			"../micro",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
				/**
				 * IndexScrollbar widget
				 * @class ns.widget.micro.IndexScrollbar
				 * @extends ns.widget.BaseWidget
				 */
				/**
				 * @class gear.ui.IndexScrollbar
				 * @inheritdoc ns.widget.micro.IndexScrollbar
				 * @extends ns.widget.micro.IndexScrollbar
				 */
			var IndexScrollbar = function () {
					var self = this;
					self.options = {};
					self.indicator = null;
					self.index = null;
					self.isShowIndicator = false;
					self.touchAreaOffsetLeft = 0;
					self.indexElements = null;
					self.defaultMaxIndexLen = 0;
					self.selectEventTriggerTimeoutId = null;
					self.ulMarginTop = 0;
					self._extended = false;

					self.indexCellInfomations = {
						indices: [],
						mergedIndices: [],
						indexLookupTable: []
					};

					self.eventHandlers = {};
				},
				BaseWidget = ns.widget.BaseWidget,
				/**
				 * @property {Object} engine Alias for class {@link ns.engine}
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} events Alias for class {@link ns.utils.events}
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @private
				 * @static
				 */
				events = ns.utils.events,
				/**
				 * @property {Object} doms Alias for class {@link ns.utils.DOM}
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @private
				 * @static
				 */
				doms = ns.utils.DOM,
				EventType = {},
				prototype = new BaseWidget();
			IndexScrollbar.classes = {};
			IndexScrollbar.events = EventType;

			prototype.widgetClass = "ui-indexscrollbar";

			/**
			 * Function configures widget
			 * @method _configure
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._configure = function () {
				var self = this,
					options = self.options;

				self.widgetName = "IndexScrollbar";

				/**
				 * Symbol for characters, which are hidden
				 * @property {string} [options.moreChar='*']
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @instance
				 */
				options.moreChar = "*";
				/**
				 * CSS class added to indicator
				 * @property {string} [options.indicatorClass='ui-indexscrollbar-indicator']
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @instance
				 */
				options.indicatorClass = "ui-indexscrollbar-indicator";
				/**
				 * CSS class added to selected element
				 * @property {string} [options.selectedClass='ui-state-selected']
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @instance
				 */
				options.selectedClass = "ui-state-selected";
				/**
				 * Separator used for splitting elements in data-index option
				 * @property {string} [options.delimeter=',']
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @instance
				 */
				options.delimeter = ",";
				/**
				 * Shown index
				 * @property {Array} [options.index=[ "A", "B", "C", "D", "E", "F", "G", "H",
						"I", "J", "K", "L", "M", "N", "O", "P", "Q",
						"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"]]
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @instance
				 */
				options.index = [ "A", "B", "C", "D", "E", "F", "G", "H",
						"I", "J", "K", "L", "M", "N", "O", "P", "Q",
						"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"];
				/**
				 * Maximum number of index's elements, which will be shown
				 * @property {number} [options.maxIndexLen=0]
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @instance
				 */
				options.maxIndexLen = 0;
				/**
				 * Height of single element on list
				 * @property {number} [options.indexHeight=36]
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @instance
				 */
				options.indexHeight = 36;
				/**
				 * Delay time in miliseconds for triggering 'select' event
				 * @property {number} [options.delayTime=50]
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @instance
				 */
				options.delayTime = 50;
				/**
				 * Widget element
				 * @property {?Object} [options.container=null]
				 * @memberOf ns.widget.micro.IndexScrollbar
				 * @instance
				 */
				options.container = null;
			};

			/**
			 * Function builds structure of index scrollbar widget
			 * @method _build
			 * @param {string} template
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._build = function (template, element) {
				var self = this;

				if (!self._isValidElement(element)) {
					return null;
				}

				self.defaultMaxIndexLen = self.options.maxIndexLen;

				if (!self._isExtended()) {
					self._createIndicator(element);
					self._updateLayout(element);
					self._setExtended(true);
				}
				return element;
			};

			/**
			 * Function inits widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @new
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._init = function (element) {
				var self = this;
				self._setExtended(true);
				self.indicator = document.getElementById(element.id + "-div-indicator");
				self.defaultMaxIndexLen = self.defaultMaxIndexLen || self.options.maxIndexLen;
				return element;
			};

			/**
			 * Function checks if element contains 'ui-indexscrollbar' class
			 * @method _isValidElement
			 * @param {HTMLElement} element
			 * @return {boolean}
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._isValidElement = function (element) {
				return element.classList.contains(this.widgetClass);
			};

			/**
			 * Function checks if widget is extended
			 * @method _isExtended
			 * @return {boolean}
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._isExtended = function () {
				return !!this._extended;
			};

			/**
			 * Function sets value of _extended
			 * @method _setExtended
			 * @param {boolean} flag
			 * @chainable
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._setExtended = function (flag) {
				this._extended = flag;
				return this;
			};

			/**
			 * Function returns proper index for widget.
			 * @method _getIndex
			 * @return {Array}
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._getIndex = function () {
				var options = this.options,
					index = options.index;
				if (typeof index === 'string') {
					index = index.split(options.delimeter);
					options.index = index;
				}
				return index;
			};

			/**
			 * Function returns container of widget
			 * @method _getContainer
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._getContainer = function (element) {
				return this.options.container || element.parentNode;
			};

			/**
			 * Function draws additinonal sub-elements
			 * @method _draw
			 * @param {HTMLElement} element
			 * chainable
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
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
					addMoreCharLineHeight = Math.floor(indexHeight / 4); // to adjust position of morechar, star should be at center of height

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

			/**
			 * Function creates indicator for widget
			 * @method _createIndicator
			 * @param {HTMLElement} element
			 * chainable
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._createIndicator = function (element) {
				var self = this,
					indicator = document.createElement("DIV"),
					container = self._getContainer(element);

				indicator.id = element.id + "-div-indicator";
				indicator.className = self.options.indicatorClass;
				indicator.innerHTML = "<span></span>";
				container.insertBefore(indicator, element);

				self.indicator = indicator;
			};

			/**
			 * Function removes indicator for widget
			 * @method _removeIndicator
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._removeIndicator = function () {
				this.indicator.parentNode.removeChild(this.indicator);
			};


			/**
			 * This event is triggered some ({@link options.delayTime}) miliseconds after the value of indicator is changed
			 * @event select
			 * @member ns.widget.micro.IndexScrollbar
			 */
			/**
			 * Function changes indicator on touch events
			 * @method _changeIndicator
			 * @param {Array} idx
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._changeIndicator = function (idx/*, cellElement */) {
				var self = this,
					options = self.options,
					selectedClass = options.selectedClass,
					cellInfomations = self.indexCellInfomations,
					cellElement,
					val;

				if (self.indicator && idx !== self.index) {
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
						self.trigger("select", {index: val});
						self.selectEventTriggerTimeoutId = null;
					}.bind(self), options.delayTime);
				}
			};

			/**
			 * Function removes selection
			 * @method _clearSelected
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
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

			/**
			 * Function returns event's position
			 * @method _getPositionFromEvent
			 * @param {Event} ev
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._getPositionFromEvent = function (ev) {
				return ev.type.search(/^touch/) === -1 ?
						{x: ev.clientX, y: ev.clientY} :
						{x: ev.touches[0].clientX, y: ev.touches[0].clientY};
			};

			/**
			 * Function finds and returns selected index by position of event
			 * @method _findIndexByPosition
			 * @param {number} posY
			 * @return {number}
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
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

			/**
			 * Function shows indicator
			 * @method _showIndicator
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._showIndicator = function () {
				var self = this;
				if (!self.isShowIndicator && self.indicator) {
					self.indicator.style.display = "block";
					self.isShowIndicator = true;
				}
			};

			/**
			 * Function hides indicator
			 * @method _hideIndicator
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._hideIndicator = function () {
				var self = this;
				if (self.isShowIndicator && self.indicator) {
					self._clearSelected();
					self.indicator.style.display = "none";
					self.isShowIndicator = false;
					self.index = null;
				}
			};

			/**
			 * Function fires on touch start event
			 * @method _onTouchStartHandler
			 * @param {ns.widget.micro.IndexScrollbar} self
			 * @param {Event} event
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._onTouchStartHandler = function ( self, event ) {
				var pos = self._getPositionFromEvent(event),
					idx = self._findIndexByPosition(pos.y);

				if (idx < 0) {
					idx = 0;
				}

				self._changeIndicator(idx, event.target);
				self._showIndicator();
			};

			/**
			 * Function fires on touch end and touch cancel events
			 * @method _onTouchEndHandler
			 * @param {ns.widget.micro.IndexScrollbar} self
			 * @param {Event} event
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._onTouchEndHandler = function ( self, event) {
				if ( event.touches.length <= 1 ) {
					self._hideIndicator();
				}
			};

			/**
			 * Function fires on touch move event
			 * @method _onTouchMoveHandler
			 * @param {ns.widget.micro.IndexScrollbar} self
			 * @param {Event} event
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
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

			/**
			 * Function adds resize event listener
			 * @method _bindResizeEvent
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._bindResizeEvent = function () {
				var self = this;
				self.eventHandlers.onresize = function (/* ev */) {
					self.refresh();
				};

				window.addEventListener("resize", self.eventHandlers.onresize, false);
			};

			/**
			 * Function removes resize event listener
			 * @method _unbindResizeEvent
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._unbindResizeEvent = function () {
				if (this.eventHandlers.onresize) {
					window.removeEventListener("resize", this.eventHandlers.onresize, false);
				}
			};

			/**
			 * Function removes all children of element and is called by 'refresh' and 'destroy' functions
			 * @method _clear
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._clear = function () {
				var self = this,
					element = self.element,
					indexCellInfomations = self.indexCellInfomations;

				while (element.firstChild) {
					element.removeChild(element.firstChild);
				}
				indexCellInfomations.mergedIndices.length = 0;
				indexCellInfomations.indexLookupTable.length = 0;
			};

			/**
			 * Function fires on click event
			 * @method clickCallback
			 * @param {ns.widget.micro.IndexScrollbar} self
			 * @param {Event} event
			 * @private
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			function clickCallback(self, event) {
				var target = event.target,
					index = "";
				if ("li" === target.tagName.toLowerCase()) {
					index = target.innerText;
					events.trigger(self.element, "select", {index: index});
				}
			}

			/**
			 * Function sets style of indicator and widget's element
			 * @method _setLayoutValues
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
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

			/**
			 * Function sets proper value of maxIndexLen option.
			 * This value is related with height of container and indexHeight option. Moreover, it is always odd.
			 * @method _setMaxIndexLen
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._setMaxIndexLen = function(element) {
				var options = this.options,
					maxIndexLen,
					defaultMaxIndexLen = this.defaultMaxIndexLen,
					container = this._getContainer(element),
					containerHeight = container.offsetHeight;

				// this should be counted always (during initialization and resizing)
				maxIndexLen = Math.floor( containerHeight / options.indexHeight );

				if (defaultMaxIndexLen && maxIndexLen > defaultMaxIndexLen) {
					maxIndexLen = defaultMaxIndexLen;
				}

				if(maxIndexLen > 0 && maxIndexLen%2 === 0) {
					maxIndexLen -= 1;	// Ensure odd number
				}
				options.maxIndexLen = maxIndexLen;
			};

			/**
			 * Function updates layout
			 * @method _updateLayout
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._updateLayout = function(element) {
				var self = this;
				self._setLayoutValues(element);
				self._setMaxIndexLen(element);
				self._updateIndexCellInfomation();
				self._draw(element);
				self._updateIndexCellRectInfomation(element);
				self.touchAreaOffsetLeft = element.offsetLeft - 10;
			};

			/**
			 * Function updates information about index's cells
			 * @method _updateIndexCellInfomation
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._updateIndexCellInfomation = function () {
				var self = this,
					indexCellInfomations = self.indexCellInfomations,
					maxIndexLen = self.options.maxIndexLen,
					indices = self._getIndex(),
					indexSize = indices.length,
					showIndexSize = Math.min(indexSize, maxIndexLen),
					// if more elements can be shown than we have, this variable has to be equal 0
					totalLeft = indexSize - maxIndexLen > 0 ? indexSize - maxIndexLen : 0,
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

			/**
			 * Function updates information about index's cells
			 * @method _updateIndexCellInfomation
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._updateIndexCellRectInfomation = function (element) {
				var self = this,
					mergedIndices = self.indexCellInfomations.mergedIndices,
					containerOffset = doms.getElementOffset(self._getContainer(element)).top,
					indexLookupTable = [],
					li = element.getElementsByTagName("li"),
					liLength = li.length,
					i,
					mergedIndice,
					mergedIndiceLen,
					top,
					j,
					len,
					height,
					node;

				for (i = 0; i < liLength; i++) {
					node = li[i];
					mergedIndice = mergedIndices[i];
					mergedIndiceLen = mergedIndice.length;
					j = mergedIndice.start;
					len = j + mergedIndiceLen;
					top = containerOffset + node.offsetTop;
					height = node.offsetHeight / mergedIndiceLen;

					for ( ; j < len; j++) {
						indexLookupTable.push({
							cellIndex: i,
							top: top,
							range: height
						});
						top += height;
					}
				}

				self.indexCellInfomations.indexLookupTable = indexLookupTable;
				self.indexElements = element.children[0].children;
			};

			/**
			 * Function binds events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._bindEvents = function (element) {
				var self = this;
				element = element || self.element;
				self.clickCallback = clickCallback.bind(null, self);
				element.addEventListener("click", self.clickCallback, false);
				self._bindResizeEvent(element);
				self._bindEventToTriggerSelectEvent(element);
				return self;
			};

			/**
			 * Function unbinds events
			 * @method _unbindEvent
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._unbindEvent = function (element) {
				this._unbindResizeEvent();
				this._unbindEventToTriggerSelectEvent(element);
			};

			/**
			 * Function refreshes widget
			 * @method _refresh
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
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

			/**
			 * Function adds touch events' listeners
			 * @method _bindEventToTriggerSelectEvent
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._bindEventToTriggerSelectEvent = function (element) {
				var self = this,
					eventHandlers = self.eventHandlers;
				element = element || self.element;
				eventHandlers.touchStart = self._onTouchStartHandler.bind(null, self);
				eventHandlers.touchEnd = self._onTouchEndHandler.bind(null, self);
				eventHandlers.touchMove = self._onTouchMoveHandler.bind(null, self);

				element.addEventListener("touchstart", eventHandlers.touchStart, false);
				element.addEventListener("touchmove", eventHandlers.touchMove, false);
				document.addEventListener("touchend", eventHandlers.touchEnd, false);
				document.addEventListener("touchcancel", eventHandlers.touchEnd, false);
			};

			/**
			 * Function removes touch events' listeners
			 * @method _unbindEventToTriggerSelectEvent
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._unbindEventToTriggerSelectEvent = function (element) {
				var self = this,
					eventHandlers = self.eventHandlers;
				element = element || self.element;
				if (element) {
					element.removeEventListener("touchstart", eventHandlers.touchStart, false);
					element.removeEventListener("touchmove", eventHandlers.touchMove, false);
				}
				document.removeEventListener("touchend", eventHandlers.touchEnd, false);
				document.removeEventListener("touchcancel", eventHandlers.touchEnd, false);
			};


			/**
			 * This method registers the specified listener
			 * @method addEventListener
			 * @param {string} type name of the event to listen for
			 * @param {Function} listener event handler function to associate with the event
			 * @param {boolean} [capture] specifies whether the event needs to be captured or not
			 * @memberOf ns.widget.micro.IndexScrollbar,
			 * @instance
			 * @todo maybe it should be deprecated
			 */
			prototype.addEventListener = function (type, listener, capture) {
				this.element.addEventListener(type, listener, capture);
			};

			/**
			 * This method removes the specified listener
			 * @method removeEventListener
			 * @param {string} type name of the event being registered
			 * @param {Function} listener event handler function to associate with the event
			 * @param {boolean} [capture] specifies whether the event needs to be captured or not
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 * @todo maybe it should be deprecated
			 */
			prototype.removeEventListener = function (type, listener, capture) {
				this.element.removeEventListener(type, listener, capture);
			};


			/**
			 * Function destroys widget
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @memberOf ns.widget.micro.IndexScrollbar
			 * @instance
			 */
			prototype._destroy = function (element) {
				var self = this;
				element = element || this.element;
				self._unbindEvent(element);
				self._removeIndicator();
				self._clear(element);
				self._setExtended(false);
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
