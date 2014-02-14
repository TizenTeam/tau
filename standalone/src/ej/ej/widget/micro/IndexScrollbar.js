/*global window, define */
/*jslint nomen: true, plusplus: true */
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
				* @class ej.widget.micro.IndexScrollbar
				* @extends ej.widget.BaseWidget
				*/
				IndexScrollbar = function () {
					var self = this;
					/**
					* @memberOf ej.widget.micro.IndexScrollbar
					*/

					self.options = {
						moreChar: "*",
						indicatorClass: "ui-indexscrollbar-indicator",
						selectedClass: "ui-state-selected",
						delimeter: ",",
						index: [ "A", "B", "C", "D", "E", "F", "G", "H",
								"I", "J", "K", "L", "M", "N", "O", "P", "Q",
								"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"],
						maxIndexSize: 9,
						delayTime: 50,
						container: null
					};

					self.indicator = null;
					self.index = null;
					self.isShowIndicator = false;
					self.touchAreaOffsetLeft = 0;
					self.indexElements = null;
					self.selectEventTriggerTimeoutId = null;

					self.indexCellInfomations = {
						indices: [],
						mergedIndices: [],
						indexLookupTable: [],

						clear: function() {
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
				self.widgetName = "IndexScrollbar";
				return element;
			};

			prototype._isValidElement = function (element) {
				return element.classList.contains(this.widgetClass);
			};

			prototype._isExtended = function () {
				return !!this._extended;
			};

			prototype._setExtended = function (flag) {
				this.extended = flag;
				return this;
			};

			prototype._getIndex = function () {
				var options = this.options,
					index = options.index;
				if (typeof index === 'string') {
					index = index.split(options.delimeter);
				}
				return index;
			};

			/**	Draw additinoal sub-elements
			*	@param {array} indices	List of index string
			*/
			prototype._draw = function (element) {
				var self = this,
					container = element.parentNode,
					moreChar = self.options.moreChar,
					indices = self.indexCellInfomations.indices,
					mergedIndices = self.indexCellInfomations.mergedIndices,
					indexSize = mergedIndices.length,
					indexHeight = container.offsetHeight,
					indexItemHeight = window.parseInt(indexHeight / indexSize),
					leftHeight = indexHeight - indexItemHeight*indexSize,
					addHeightOffset = leftHeight,
					indexCellHeight, text, ul, li, i, m;

				ul = document.createElement("ul");
				for (i=0; i < indexSize; i++) {
					m = mergedIndices[i];
					text = m.length === 1 ? indices[m.start] : moreChar;
					indexCellHeight = i < addHeightOffset ? indexItemHeight + 1 : indexItemHeight;

					li = document.createElement("li");
					li.textContent = text;
					li.style.height = indexCellHeight + "px";
					li.style.lineHeight = indexCellHeight + "px";
					ul.appendChild(li);
				}
				element.appendChild(ul);

				return self;
			};

			prototype._createIndicator = function(element) {
				var self = this,
					indicator = document.createElement("DIV"),
					container = element.parentNode;

				indicator.className = self.options.indicatorClass;
				indicator.innerHTML = "<span></span>";
				container.insertBefore(indicator, element);

				self.indicator = indicator;
			};

			prototype._removeIndicator = function() {
				this.indicator.parentNode.removeChild(this.indicator);
			};

			prototype._changeIndicator = function( idx/*, cellElement */) {
				var self = this,
					selectedClass = self.options.selectedClass,
					cellInfomations = self.indexCellInfomations,
					cellElement,
					val;

				if ( !self.indicator || idx === self.index ) {
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

				if ( self.selectEventTriggerTimeoutId ) {
					window.clearTimeout(self.selectEventTriggerTimeoutId);
				}
				self.selectEventTriggerTimeoutId = window.setTimeout(function() {
					events.trigger(self.element, "select", {index: val});
					self.selectEventTriggerTimeoutId = null;
				}.bind(self), self.options.delayTime);

			};

			prototype._clearSelected = function() {
				var el = this.element,
					selectedClass = this.options.selectedClass,
					selectedElement = el.getElementByClassName(selectedClass),
					i;

				for (i=0; i<selectedElement; i++) {
					selectedElement[i].classList.remove(selectedClass);
				}
			};

			prototype._getPositionFromEvent = function( ev ) {
				return ev.type.search(/^touch/) !== -1 ?
						{x: ev.touches[0].clientX, y: ev.touches[0].clientY} :
						{x: ev.clientX, y: ev.clientY};
			};

			prototype._findIndexByPosition = function( posY ) {
				var rectTable = this.indexCellInfomations.indexLookupTable,
					i, len, info, range;
				for ( i=0, len=rectTable.length; i < len; i++) {
					info = rectTable[i];
					range = posY - info.top;
					if ( range > 0 && range < info.range ) {
						return i;
					}
				}
				return -1;
			};

			prototype._showIndicator = function() {
				var self = this;
				if ( self.isShowIndicator || !this.indicator ) {
					return false;
				}

				self.indicator.style.display = "block";
				self.isShowIndicator = true;
			};

			prototype._hideIndicator = function() {
				var self = this;
				if ( !self.isShowIndicator || !self.indicator ) {
					return false;
				}

				self._clearSelected();
				self.indicator.style.display = "none";
				self.isShowIndicator = false;
				self.index = null;
			};

			prototype._onTouchStartHandler = function( ev ) {
				var self = this,
					pos = self._getPositionFromEvent( ev ),
					idx = self._findIndexByPosition( pos.y );

				if ( idx < 0 ) {
					idx = 0;
				}

				self._changeIndicator(idx, ev.target);
				self._showIndicator();
			};

			prototype._onTouchEndHandler = function(/* ev */) {
				this._hideIndicator();
			};

			prototype._onTouchMoveHandler = function( ev ) {
				var self,
					pos,
					idx;

				if ( !self.isShowIndicator ) {
					return;
				}

				pos = self._getPositionFromEvent( ev );
				idx = self._findIndexByPosition( pos.y );

				if ( idx > -1 && pos.x > self.touchAreaOffsetLeft ) {
					self._changeIndicator(idx, ev.target);
				}

				ev.preventDefault();
				ev.stopPropagation();
			};

			prototype._bindResizeEvent = function() {
				var self = this;
				self.eventHandlers.onresize = function(/* ev */) {
					self.refresh();
				};

				window.addEventListener( "resize", self.eventHandlers.onresize );
			};

			prototype._unbindResizeEvent = function() {
				if ( this.eventHandlers.onresize ) {
					window.removeEventListener( "resize", this.eventHandlers.onresize );
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

			prototype._updateLayout = function(element) {
				var self = this,
					container = element.parentNode,
					positionStyle = window.getComputedStyle(container).position,
					containerOffsetTop = container.offsetTop,
					containerOffsetLeft = container.offsetLeft,
					indicatorStyle = self.indicator.style;
	
				if (self.indicator) {
					indicatorStyle.width = container.offsetWidth + "px";
					indicatorStyle.height = container.offsetHeight + "px";
				}
	
				if (positionStyle !== "absolute" && positionStyle !== "relative") {
					element.style.top = containerOffsetTop + "px";
					indicatorStyle.top = containerOffsetTop + "px";
					indicatorStyle.left = containerOffsetLeft + "px";
				}
	
				self._updateIndexCellInfomation();
				self._draw(element);
				self._updateIndexCellRectInfomation(element);
	
				self.touchAreaOffsetLeft = element.offsetLeft - 10;
			};

			prototype._updateIndexCellInfomation = function() {
				var self = this,
					maxIndexSize = self.options.maxIndexSize,
					indices = self._getIndex(),
					showIndexSize = Math.min( indices.length, maxIndexSize ),
					indexSize = indices.length,
					totalLeft = indexSize - maxIndexSize,
					leftPerItem = window.parseInt(totalLeft / (window.parseInt(showIndexSize/2))),
					left = totalLeft % (window.parseInt(showIndexSize/2)),
					indexItemSizeArr = [],
					mergedIndices = [],
					i, len, pos=0;

				for ( i=0, len=showIndexSize; i < len; i++ ) {
					indexItemSizeArr[i] = 1;
					if ( i % 2 ) {
						indexItemSizeArr[i] += leftPerItem + ( left > 0 ? 1 : 0);
						left--;
					}
				}

				for ( i=0, len=showIndexSize; i < len; i++) {
					pos += indexItemSizeArr[i];

					mergedIndices.push({
						start: pos - 1,
						length: indexItemSizeArr[i]
					});
				}

				self.indexCellInfomations.indices = indices;
				self.indexCellInfomations.mergedIndices = mergedIndices;
			};

			prototype._updateIndexCellRectInfomation = function(element) {
				var self = this,
					mergedIndices = self.indexCellInfomations.mergedIndices,
					containerOffset = self._getOffset(element.parentNode).top,
					indexLookupTable = [];

				[].forEach.call(element.querySelectorAll("li"), function(node, idx) {
					var m = mergedIndices[idx],
						i = m.start,
						len = i + m.length,
						top = containerOffset + node.offsetTop,
						height = node.offsetHeight / m.length;
	
					for ( ; i < len; i++ ) {
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

			prototype._getOffset = function( element ) {
				var left=0,
					top=0 ;
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
				var self = this;
				if( self._isExtended() ) {
					self._unbindEvent();
					self._hideIndicator();
					self._clear();
					self._extended( false );
				}

				self._updateLayout(self.element);
				self._extended( true );
			};

			prototype._bindEventToTriggerSelectEvent = function() {
				var self = this;
				self.eventHandlers.touchStart = self._onTouchStartHandler.bind(self);
				self.eventHandlers.touchEnd = self._onTouchEndHandler.bind(self);
				self.eventHandlers.touchMove = self._onTouchMoveHandler.bind(self);

				self.element.addEventListener("touchstart", self.eventHandlers.touchStart);
				self.element.addEventListener("touchmove", self.eventHandlers.touchMove);
				document.addEventListener("touchend", self.eventHandlers.touchEnd);
				document.addEventListener("touchcancel", self.eventHandlers.touchEnd);
			};

			prototype._unbindEventToTriggerSelectEvent = function() {
				var self = this;
				self.element.removeEventListener("touchstart", self.eventHandlers.touchStart);
				self.element.removeEventListener("touchmove", self.eventHandlers.touchMove);
				document.removeEventListener("touchend", self.eventHandlers.touchEnd);
				document.removeEventListener("touchcancel", self.eventHandlers.touchEnd);
			};

			prototype.addEventListener = function (type, listener) {
				this.element.addEventListener(type, listener);
			};

			prototype.removeEventListener = function (type, listener) {
				this.element.removeEventListener(type, listener);
			};

			/**
			* init widget
			* @method _init
			* @param {HTMLElement} element
			* @new
			* @memberOf ej.widget.micro.IndexScrollbar
			*/
			prototype._init = function (element) {
				return element;
			};

			/**
			* @method _destroy
			* @private
			* @memberOf ej.widget.micro.IndexScrollbar
			*/
			prototype._destroy = function () {
				var self = this;
				self._unbindEvent();
				self._removeIndicator();
				self._clear();
				self._extended( false );

				self.element = null;
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
