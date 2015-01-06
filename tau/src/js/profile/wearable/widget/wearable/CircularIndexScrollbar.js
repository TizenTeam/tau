/*global window, define, Event, console */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # CircularIndexScrollbar Widget
 * Shows an circular index scroll bar with indeces, usually for the list.
 *
 * The circular index scroll bar widget shows on the screen a scrollbar with indices.
 *
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/event/gesture",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilsEvents = ns.event,
				eventTrigger = utilsEvents.trigger,
				Gesture = utilsEvents.gesture,
				MIN_INDEX = 3,
				prototype = new BaseWidget(),

				CircularIndexScrollbar = function() {
				// Support calling without 'new' keyword
					this.element = null;
					this._indexBar = null;
					this._centralAngle = 0;
					this._activeIndexNo = 0;
					this._isShow = false;
					this._indexObjects = [];
					this._indicator = {
						element: null,
						style: null,
						startX: 0,
						positionX: 0,
						maxPositionX: 0,
						minPositionX: 0,
						dragging: false,
					};
				},

				rotaryDirection = {
					// right rotary direction
					CW: "CW",
					// left rotary direction
					CCW: "CCW"
				},

				EventType = {
					/**
					 * Event triggered after select index by user
					 * @event select
					 * @member ns.widget.wearable.CircularIndexScrollbar
					 */
					SELECT: "select",
					INDEX_SHOW: "indexshow",
					INDEX_HIDE: "indexhide"
				},

				classes = {
					INDEXBAR: "ui-circularindexscrollbar-indexbar",
					INDICATOR: "ui-circularindexscrollbar-indicator",
					INDEX: "ui-circularindexscrollbar-index",
					SHOW: "ui-circularindexscrollbar-show",
					SELECTED: "ui-state-selected",
				};

			CircularIndexScrollbar.prototype = prototype;

			/**
			 * This method configure widget.
			 * @method _configure
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._configure = function() {
				this.options = {
					moreChar: ".",
					delimiter: ",",
					index: [
						"A", "B", "C", "D", "E", "F", "G", "H",
						"I", "J", "K", "L", "M", "N", "O", "P", "Q",
						"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"
					],
					maxVisibleIndex: 30,
					duration: 500
				};
			};

			/**
			 * This method inits widget.
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._init = function(element) {
				var self = this,
					options = self.options;

				self._setIndices(options.index);
				self._draw();
				self._setValueByPosition(self._activeIndexNo);

				return element;
			};

			/**
			 * This method set indices prepared from parameter
			 * or index of widget.
			 * @method _setIndices
			 * @param {string} [value] Indices to prepared
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._setIndices = function(value) {
				var self = this,
					options = self.options,
					maxVisibleIndex = options.maxVisibleIndex;

				if (value === null) {
					ns.warn("CircularIndexScrollbar must have indices.");
					options.index = null;
					return;
				}

				if (typeof value === "string") {
					value = value.split(options.delimiter); // delimiter
				}

				if (maxVisibleIndex < MIN_INDEX) {
					ns.warn("CircularIndexScrollbar is required at least 3 maxVisibleIndex, otherwise it may not work.");
					self.options.maxVisibleIndex = MIN_INDEX;
				}

				if (value.length < MIN_INDEX) {
					ns.warn("CircularIndexScrollbar is required at least 3 indices, otherwise it may not work.");
				}

				self._centralAngle = 360 / (value.length > maxVisibleIndex ? maxVisibleIndex : value.length);
				options.index = value;
			};

			/**
			 * This method draw index elements and indicator in the CircularIndexScrollbar
			 * @method _draw
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._draw = function() {
				var self = this,
					options = self.options,
					element = self.element,
					indexBar = document.createElement("div"),
					indicator = document.createElement("div"),
					windowWidth = window.innerWidth,
					indicatorWidth;

				if (options.index) {
					if (options.index.length < options.maxVisibleIndex) {
						self._drawBasicIndices(indexBar);
					} else {
						self._drawOmitIndices(indexBar);
					}
				}

				indexBar.classList.add(classes.INDEXBAR);
				indicator.classList.add(classes.INDICATOR);

				self._indicator.style = indicator.style;
				self._indicator.element = indicator;

				self._indexBar = indexBar;
				element.appendChild(indexBar);
				element.appendChild(indicator);

				indicatorWidth = indicator.clientWidth;
				self._indicator.maxPositionX = windowWidth/2 - indicatorWidth/2;
				self._indicator.minPositionX = -indicatorWidth * 0.8;
			};

			/**
			 * This method draw basic style index elements in the CircularIndexScrollbar
			 * @method _drawBasicIndices
			 * @param {Element} indexBar
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._drawBasicIndices = function(indexBar) {
				var self = this,
					options = self.options,
					child,
					i;

				for (i = 0; i < options.index.length; i++) {
					child = document.createElement("div");
					self._setChildStyle(child, i, options.index[i]);
					indexBar.appendChild(child);
					self._indexObjects.push({index: options.index[i], container: child});
				}
			};

			/**
			 * This method draw omit style index elements in the CircularIndexScrollbar
			 * @method _drawOmitIndices
			 * @param {Element} indexBar
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._drawOmitIndices = function(indexBar) {
				var self = this,
					options = self.options,
					index = options.index,
					indexLen = index.length,
					maxVisibleIndex = options.maxVisibleIndex,
					leftIndexLen = indexLen - parseInt((maxVisibleIndex+1) / 2, 10),
					nIndexPerItem = parseInt(leftIndexLen / parseInt(maxVisibleIndex / 2, 10), 10 ),
					nIndexPerItemLeft = leftIndexLen % parseInt(maxVisibleIndex / 2, 10),
					indexNo = 0,
					omitIndexLen = 0,
					child,
					i;

				for (i = 0; i < maxVisibleIndex; i++) {
					child = document.createElement("div");
					if (i % 2) {
						omitIndexLen = nIndexPerItem + (nIndexPerItemLeft-- > 0 ? 1 : 0);
						self._setChildStyle(child, i, options.moreChar);
						while (omitIndexLen-- > 0) {
							self._indexObjects.push({index: index[indexNo++],container: child});
						}
					} else {
						self._setChildStyle(child, i, index[indexNo]);
						self._indexObjects.push({index: index[indexNo++], container: child});
					}
					indexBar.appendChild(child);
				}
			};

			/**
			 * This method set the style of index elements
			 * @method _setChildStyle
			 * @param {HTMLElement} index element
			 * @param {number} index
			 * @param {string} value of index
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._setChildStyle = function(child, index, value) {
				var self = this,
					inner = document.createElement("span"),
					options = self.options,
					centralAngle = self._centralAngle,
					skewAngle = 90 - centralAngle,
					rotateAngle,
					transform;

				rotateAngle = index * centralAngle + 90 - centralAngle/2;
				transform = "rotate(" + rotateAngle + "deg) skew(" + skewAngle + "deg)";

				child.classList.add(classes.INDEX);
				child.style.webkitTransform = transform;
				child.style.transform = transform;

				// inner element
				transform  = "skew(" + (-skewAngle) + "deg) rotate(" + (centralAngle/2 - 90) + "deg)";

				inner.innerText = value;
				inner.style.webkitTransform = transform;
				inner.style.transform = transform;

				child.appendChild(inner);
			};

			/**
			 * This method show the CircularIndexScrollbar
			 * @method show
			 * @public
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype.show = function() {
				var self = this,
					options = self.options,
					indicator = self._indicator,
					style = indicator.style,
					transition,
					transform;

				if (self._isShow && !indicator.dragging) {
					return;
				}

				transition = "-webkit-transform " + options.duration + "ms ease-out";
				transform = "translate3d(" + indicator.maxPositionX + "px, 0, 0)";

				self._isShow = true;
				self.element.classList.add(classes.SHOW);
				style.webkitTransition = transition;
				style.transition = transition;
				style.webkitTransform = transform;
				style.transform = transform;
			};

			/**
			 * This method hide the CircularIndexScrollbar
			 * @method hide
			 * @public
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype.hide = function() {
				var self = this,
					options = self.options,
					indicator = self._indicator,
					style = indicator.style,
					transition,
					transform;

				if (!self._isShow && !indicator.dragging) {
					return;
				}

				transition = "-webkit-transform " + options.duration + "ms ease-out";
				transform = "translate3d(" + indicator.minPositionX + "px, 0, 0)";

				self.element.classList.remove(classes.SHOW);
				style.webkitTransition = transition;
				style.transition = transition;
				style.webkitTransform = transform;
				style.transform = transform;
				self._isShow = false;
			};

			/**
			 * This method select the index
			 * @method _setValueByPosition
			 * @protected
			 * @param {stirng} index number
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._setValueByPosition = function(indexNo) {
				var self = this,
					curActiveElement,
					indexElement,
					indicator;

				if (!self.options.index) {
					return;
				}

				curActiveElement = self._indexObjects[self._activeIndexNo].container,
				indexElement = self._indexObjects[indexNo].container,
				indicator = self._indicator.element;

				if(indexElement) {
					self._activeIndexNo = indexNo;
					curActiveElement.classList.remove(classes.SELECTED);
					indexElement.classList.add(classes.SELECTED);
					indicator.innerHTML = self.options.index[indexNo];
					eventTrigger(self.element, EventType.SELECT, {index: self.options.index[indexNo]});
				}
			};

			/**
			 * This method select next index
			 * @method _nextIndex
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._nextIndex = function() {
				var self = this,
					activeIndexNo = self._activeIndexNo,
					indexLen = self.options.index.length,
					nextIndexNo = activeIndexNo < indexLen - 1 ? activeIndexNo + 1 : 0;

				self._setValueByPosition(nextIndexNo);
			};

			/**
			 * This method select previos index
			 * @method _prevIndex
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._prevIndex = function() {
				var self = this,
					activeIndexNo = self._activeIndexNo,
					indexLen = self.options.index.length,
					prevIndexNo = activeIndexNo > 0 ? activeIndexNo - 1 : indexLen -1;

				self._setValueByPosition(prevIndexNo);
			};

			/**
			 * This method select the index
			 * @method _setValue
			 * @protected
			 * @param {stirng} value of index
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._setValue = function(value) {
				var self = this,
					index = self.options.index,
					indexNo;

				if (index && (indexNo = index.indexOf(value))) {
					self._setValueByPosition(indexNo);
				}
			};

			/**
			 * This method gets current index
			 * @method _getValue
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._getValue = function() {
				var self = this,
					index = self.options.index;

				if (index) {
					return index[self._activeIndexNo];
				} else {
					return null;
				}
			};

			/**
			 * This method is a "dragstart" event handler
			 * @method _start
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._start = function(event) {
				var self = this,
					indicator = self._indicator;

				indicator.dragging = true;
				indicator.startX = event.detail.estimatedX;
				indicator.positionX = indicator.element.getBoundingClientRect().left;
				indicator.style.webkitTransition = "none";
				indicator.style.transition = "none";
			};

			/**
			 * This method is a "dragmove" event handler
			 * @method _move
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._move = function(event) {
				var self = this,
					indicator = self._indicator,
					showPositionX = indicator.maxPositionX,
					hiddenPositionX = indicator.minPositionX,
					moveX = indicator.positionX + (event.detail.estimatedX - indicator.startX),
					transform;

					if (moveX >= hiddenPositionX && moveX <= showPositionX) {
						transform = "translate3d(" + moveX + "px, 0, 0)";
						indicator.style.webkitTransform = transform;
						indicator.style.transform = transform;
					} else if (moveX > showPositionX && !self._isShow) {
						self.show();
					} else if (moveX < hiddenPositionX && self._isShow) {
						self.hide();
					}
			};

			/**
			 * This method is a "dragend" event handler
			 * @method _end
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._end = function(event) {
				var self = this,
					indicator = self._indicator,
					positionX = indicator.element.getBoundingClientRect().left;

				if (!indicator.dragging) {
					return;
				}

				if (positionX > (indicator.maxPositionX + indicator.minPositionX) / 2) {
					self.show();
				} else {
					self.hide();
				}

				indicator.dragging = false;
			};

			/**
			 * This method is a "swipe" event handler
			 * @method _swipe
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._swipe = function(event) {
				var self = this,
					gesture = event.detail;

				if (gesture.direction === Gesture.Direction.RIGHT) {
					self.show();
				} else {
					self.hide();
				}

				self._indicator.dragging = false;
			};

			/**
			 * This method is a "mousewheel" event handler
			 * @method _onMouseWheelHandler
			 * @param {Event} event Event
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._wheel = function(event) {
				var self = this,
					delta = event.wheelDelta;

				if (!self.options.index) {
					return;
				}

				if(delta) {
					if(delta < 0) {
						self._nextIndex();
					} else {
						self._prevIndex();
					}
				}
			};

			/**
			 * This method is a "transitionend" event handler
			 * @method _transitionEnd
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._transitionEnd = function(event) {
				var self = this;
				self._indicator.style.webkitTransition = "none";

				if (self._isShow) {
					utilsEvents.on(document, "rotarydetent", self);
					eventTrigger(self.element, EventType.INDEX_SHOW);
				} else {
					utilsEvents.off(document, "rotarydetent", self);
					eventTrigger(self.element, EventType.INDEX_HIDE);
				}
			};

			/**
			 * This method is a "rotarydetent" event handler
			 * @method _rotary
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._rotary = function(event) {
				var self = this,
					direction = event.detail.direction;

				if (!self.options.index) {
					return;
				}

				if(direction === rotaryDirection.CW) {
					self._nextIndex();
				} else {
					self._prevIndex();
				}
			};

			/**
			 * This method handles events
			 * @method _handleEvent
			 * @public
			 * @param {Event} event Event
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype.handleEvent = function(event) {
				var self = this;

				switch (event.type) {
					case "dragstart":
						self._start(event);
						break;
					case "drag":
						self._move(event);
						break;
					case "dragend":
					case "dragcancel":
						self._end(event);
						break;
					case "swipe":
						self._swipe(event);
						break;
					case "mousewheel":
						self._wheel(event);
						break;
					case "webkitTransitionEnd":
						self._transitionEnd(event);
						break;
					case "rotarydetent":
						self._rotary(event);
						break;
				}
			};

			/**
			 * This method binds events to widget.
			 * method _bindEvents
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._bindEvents = function() {
				var self = this,
					indicator = self._indicator.element;

				utilsEvents.enableGesture(
					indicator,

					new utilsEvents.gesture.Drag({
						blockVertical: true
					}),

					new utilsEvents.gesture.Swipe({
						orientation: Gesture.Orientation.HORIZONTAL
					})
				);

				utilsEvents.on(indicator, "drag dragstart dragend dragcancel swipe", self);
				utilsEvents.on(self.element, "mousewheel", self);
				utilsEvents.on(self._indexBar, "webkitTransitionEnd", self);
			};

			/**
			 * This method unbinds events to widget.
			 * method _unbindEvents
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._unbindEvents = function() {
				var self = this,
					indicator = self._indicator.element,
					indexBar = self._indexBar;

				if (self.element) {
					utilsEvents.off(self.element, "mousewheel", self);
				}

				if (indicator) {
					utilsEvents.disableGesture(indicator);
					utilsEvents.off(indicator, "drag dragstart dragend dragcancel swipe", self);
				}

				if (indexBar) {
					utilsEvents.off(indexBar, "webkitTransitionEnd", self);
				}

				utilsEvents.off(document, "rotarydetent", self);
			};

			/**
			 * This method resets widget.
			 * @method _reset
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._reset = function() {
				var self = this;

				self._indexBar = null;
				self._isShow = false;
				self._activeIndexNo = 0;
				self._centralAngle = 0;
				self._indexObjects = [];
				self._indicator = {
					element: null,
					style: null,
					startX: 0,
					positionX: 0,
					maxPositionX: 0,
					minPositionX: 0,
					dragging: false,
				};

				self.element.classList.remove(classes.SHOW);
			};

			/**
			 * This method refreshes widget.
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._refresh = function() {
				var self = this,
					options = self.options;

				self._unbindEvents();
				self._destroySubObjects();
				self._reset();
				self._setIndices(options.index);
				self._draw();
				self._setValueByPosition(self._activeIndexNo);
				self._bindEvents();
			};

			/**
			 * This method detroys widget.
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._destroy = function() {
				var self = this;
				if (self.isBound()) {
					self._unbindEvents();
					self._destroySubObjects();
					self._indexBar = null;
					self._indicator = null;
					self._indexObjects = null;
				}
			};

			/**
			 * This method destroys sub-elements: index elements and indicator.
			 * @method _destroySubObjects
			 * @protected
			 * @member ns.widget.wearable.CircularIndexScrollbar
			 */
			prototype._destroySubObjects = function() {
				var container = this.element;

				container.textContent = "";
			};

			// definition
			ns.widget.wearable.CircularIndexScrollbar = CircularIndexScrollbar;
			engine.defineWidget(
				"CircularIndexScrollbar",
				".ui-circularindexscrollbar",
				[],
				CircularIndexScrollbar,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return CircularIndexScrollbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
