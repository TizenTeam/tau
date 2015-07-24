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
/*jslint nomen: true, white: true, plusplus: true*/
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/selectors",
			"../../event",
			"../../event/vmouse",
			"../BaseWidget",
			"../core" // fetch namespace
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				// Constants definition
				/**
				 * Defines index of scroll `{@link ns.widget.core.VirtualListview#_scroll}.direction`
				 * @property {number} SCROLL_UP
				 * to retrive if user is scrolling up
				 * @private
				 * @static
				 * @member ns.widget.core.VirtualListview
				 */
				SCROLL_UP = 0,
				/**
				 * Defines index of scroll `{@link ns.widget.core.VirtualListview#_scroll}.direction`
				 * @property {number} SCROLL_RIGHT
				 * to retrive if user is scrolling right
				 * @private
				 * @static
				 * @member ns.widget.core.VirtualListview
				 */
				SCROLL_RIGHT = 1,
				/**
				 * Defines index of scroll {@link ns.widget.core.VirtualListview#_scroll}
				 * @property {number} SCROLL_DOWN
				 * to retrive if user is scrolling down
				 * @private
				 * @static
				 * @member ns.widget.core.VirtualListview
				 */
				SCROLL_DOWN = 2,
				/**
				 * Defines index of scroll {@link ns.widget.core.VirtualListview#_scroll}
				 * @property {number} SCROLL_LEFT
				 * to retrive if user is scrolling left
				 * @private
				 * @static
				 * @member ns.widget.core.VirtualListview
				 */
				SCROLL_LEFT = 3,
				/**
				 * Defines vertical scrolling orientation. It's default orientation.
				 * @property {string} VERTICAL
				 * @private
				 * @static
				 */
				VERTICAL = "y",
				/**
				 * Defines horizontal scrolling orientation.
				 * @property {string} HORIZONTAL
				 * @private
				 * @static
				 */
				HORIZONTAL = "x",
				/**
				 * Determines that scroll event should not be taken into account if scroll event accurs.
				 * @property {boolean} blockEvent
				 * @private
				 * @static
				 */
				blockEvent = false,
				/**
				 * Handle window timeout ID.
				 * @property {number} timeoutHandler
				 * @private
				 * @static
				 */
				timeoutHandler,
				/**
				 * Reference to original target object from touch event.
				 * @property {Object} origTarget
				 * @private
				 * @static
				 */
				origTarget,
				/**
				 * Number of miliseconds to determine if tap event occured.
				 * @property {number} tapholdThreshold
				 * @private
				 * @static
				 */
				tapholdThreshold = 250,
				/**
				 * Handler for touch event listener to examine tap occurance.
				 * @property {Object} tapHandlerBound
				 * @private
				 * @static
				 */
				tapHandlerBound = null,
				/**
				 * Stores last touch position to examine tap occurance.
				 * @property {Object} lastTouchPos
				 * @private
				 * @static
				 */
				lastTouchPos =	{},

				selectors = ns.util.selectors,

				utilEvent = ns.event,

				/**
				 * Local constructor function
				 * @method VirtualListview
				 * @private
				 * @member ns.widget.core.VirtualListview
				 */
				VirtualListview = function() {
					var self = this;
					/**
					 * VirtualListview widget's properties associated with
					 * @property {Object} ui
					 * User Interface
					 * @property {?HTMLElement} [ui.scrollview=null] Scroll element
					 * @property {?HTMLElement} [ui.spacer=null] HTML element which makes scrollbar proper size
					 * @property {number} [ui.itemSize=0] Size of list element in pixels. If scrolling is
					 * vertically it's item width in other case it"s height of item element
					 * @member ns.widget.core.VirtualListview
					 */
					self._ui = {
						scrollview: null,
						spacer: null,
						itemSize: 0
					};

					/**
					 * Holds information about scrolling state
					 * @property {Object} _scroll
					 * @property {Array} [_scroll.direction=[0,0,0,0]] Holds current direction of scrolling.
					 * Indexes suit to following order: [up, left, down, right]
					 * @property {number} [_scroll.lastPositionX=0] Last scroll position from top in pixels.
					 * @property {number} [_scroll.lastPositionY=0] Last scroll position from left in pixels.
					 * @property {number} [_scroll.lastJumpX=0] Difference between last and current
					 * position of horizontal scroll.
					 * @property {number} [_scroll.lastJumpY=0] Difference between last and current
					 * position of vertical scroll.
					 * @property {number} [_scroll.clipWidth=0] Width of clip - visible area for user.
					 * @property {number} [_scroll.clipHeight=0] Height of clip - visible area for user.
					 * @member ns.widget.core.VirtualListview
					 */
					self._scroll = {
						direction: [0, 0, 0, 0],
						lastPositionX: 0,
						lastPositionY: 0,
						lastJumpX: 0,
						lastJumpY: 0,
						clipWidth: 0,
						clipHeight: 0
					};

					/**
					 * Name of widget
					 * @property {string} name
					 * @member ns.widget.core.VirtualListview
					 * @static
					 */
					self.name = "VirtualListview";

					/**
					 * Current zero-based index of data set.
					 * @property {number} _currentIndex
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._currentIndex = 0;

					/**
					 * VirtualListview widget options.
					 * @property {Object} options
					 * @property {number} [options.bufferSize=100] Number of items of result set. The default value is 100.
					 * As the value gets higher, the loading time increases while the system performance
					 * improves. So you need to pick a value that provides the best performance
					 * without excessive loading time. It's recomended to set bufferSize at least 3 times bigger than number
					 * of visible elements.
					 * @property {number} [options.dataLength=0] Total number of items.
					 * @property {string} [options.orientation="y"] Scrolling orientation. Default vertical scrolling enabled.
					 * @property {Object} options.listItemUpdater Holds reference to method which modifies list item, depended
					 * at specified index from database. **Method should be overridden by developer using
					 * {@link ns.widget.core.VirtualListview#setListItemUpdater} method.** or defined as a config
					 * object. Method takes two parameters:
					 *  -  element {HTMLElement} List item to be modified
					 *  -  index {number} Index of data set
					 * @member ns.widget.core.VirtualListview
					 */
					self.options = {
						bufferSize: 100,
						dataLength: 0,
						orientation: VERTICAL,
						listItemUpdater: null,
						scrollElement: null
					};

					/**
					 * Binding for scroll event listener.
					 * @method _scrollEventBound
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._scrollEventBound = null;
					/**
					 * Binding for touch start event listener.
					 * @method _touchStartEventBound
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._touchStartEventBound = null;

					return self;
				},
				POINTER_START = 'vmousedown',
				POINTER_MOVE = 'vmousemove',
				POINTER_END = 'vmouseup',

			// Cached prototype for better minification
				prototype = new BaseWidget();

			/**
			 * Dictionary object containing commonly used wiget classes
			 * @property {Object} classes
			 * @static
			 * @readonly
			 * @member ns.widget.core.VirtualListview
			 */
			VirtualListview.classes = {
				uiVirtualListContainer: "ui-virtual-list-container",
				uiListviewActive: "ui-listview-active"
			};

			/**
			 * Remove highlight from items.
			 * @method _removeHighlight
			 * @param {ns.widget.core.VirtualListview} self Reference to VirtualListview object.
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _removeHighlight (self) {
				var children = self.element.children,
					i = children.length;
				while (--i >= 0) {
					children[i].classList.remove(VirtualListview.classes.uiListviewActive);
				}
			}

			/**
			 * Checks if tap meet the condition.
			 * @method _tapHandler
			 * @param {ns.widget.core.VirtualListview} self Reference to VirtualListview object.
			 * @param {Event} event Received Touch event
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _tapHandler (self, event) {
				var changedTouches = event.changedTouches ||
						(event._originalEvent &&
							event._originalEvent.changedTouches),
					eventTouch = (changedTouches && changedTouches.length) ?
						changedTouches[0] :
						event;

				if (event.type === POINTER_MOVE) {
					if (Math.abs(lastTouchPos.clientX - eventTouch.clientX) > 10 && Math.abs(lastTouchPos.clientY - eventTouch.clientY) > 10) {
						_removeHighlight(self);
						window.clearTimeout(timeoutHandler);
					}
				} else {
					_removeHighlight(self);
					window.clearTimeout(timeoutHandler);
				}

			}

			/**
			 * Adds highlight
			 * @method tapholdListener
			 * @param {ns.widget.core.VirtualListview} self Reference to VirtualListview object.
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function tapholdListener(self) {
				var liElement;

				liElement = origTarget.tagName === "LI" ? origTarget : origTarget.parentNode;

				origTarget.removeEventListener(POINTER_MOVE, tapHandlerBound, false);
				origTarget.removeEventListener(POINTER_END, tapHandlerBound, false);
				tapHandlerBound = null;

				_removeHighlight(self);
				liElement.classList.add(VirtualListview.classes.uiListviewActive);
				lastTouchPos = {};
			}

			/**
			 * Binds touching events to examine tap event.
			 * @method _touchStartHandler
			 * @param {ns.widget.core.VirtualListview} self Reference to VirtualListview object.
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _touchStartHandler (self, event) {
				var eventData;

				origTarget = event.target;

				// Clean up
				window.clearTimeout(timeoutHandler);
				origTarget.removeEventListener(POINTER_MOVE, tapHandlerBound, false);
				origTarget.removeEventListener(POINTER_END, tapHandlerBound, false);

				timeoutHandler = window.setTimeout(tapholdListener.bind(null, self), tapholdThreshold);
				eventData = (event.touches && event.touches.length) ? event.touches[0] : event;
				lastTouchPos.clientX = eventData.clientX;
				lastTouchPos.clientY = eventData.clientY;

				//Add touch listeners
				tapHandlerBound = _tapHandler.bind(null, self);
				origTarget.addEventListener(POINTER_MOVE, tapHandlerBound, false);
				origTarget.addEventListener(POINTER_END, tapHandlerBound, false);

			}


			/**
			 * Updates scroll information about position, direction and jump size.
			 * @method _updateScrollInfo
			 * @param {ns.widget.core.VirtualListview} self VirtualListview widget reference
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _updateScrollInfo(self) {
				var scrollInfo = self._scroll,
					scrollDirection = scrollInfo.direction,
					scrollViewElement = self._ui.scrollview,
					scrollLastPositionX = scrollInfo.lastPositionX,
					scrollLastPositionY = scrollInfo.lastPositionY,
					scrollviewPosX = scrollViewElement.scrollLeft,
					scrollviewPosY = scrollViewElement.scrollTop;

				self._refreshScrollbar();
				//Reset scroll matrix
				scrollDirection = [0, 0, 0, 0];

				//Scrolling UP
				if (scrollviewPosY < scrollLastPositionY) {
					scrollDirection[SCROLL_UP] = 1;
				}

				//Scrolling RIGHT
				if (scrollviewPosX < scrollLastPositionX) {
					scrollDirection[SCROLL_RIGHT] = 1;
				}

				//Scrolling DOWN
				if (scrollviewPosY > scrollLastPositionY) {
					scrollDirection[SCROLL_DOWN] = 1;
				}

				//Scrolling LEFT
				if (scrollviewPosX > scrollLastPositionX) {
					scrollDirection[SCROLL_LEFT] = 1;
				}

				scrollInfo.lastJumpY = Math.abs(scrollviewPosY - scrollLastPositionY);
				scrollInfo.lastJumpX = Math.abs(scrollviewPosX - scrollLastPositionX);
				scrollInfo.lastPositionX = scrollviewPosX;
				scrollInfo.lastPositionY = scrollviewPosY;
				scrollInfo.direction = scrollDirection;
				scrollInfo.clipHeight = scrollViewElement.clientHeight;
				scrollInfo.clipWidth = scrollViewElement.clientWidth;
			}

			/**
			 * Computes list element size according to scrolling orientation
			 * @method _computeElementSize
			 * @param {HTMLElement} element Element whose size should be computed
			 * @param {string} orientation Scrolling orientation
			 * @return {number} Size of element in pixels
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _computeElementSize(element, orientation) {
				// @TODO change to util method if it will work perfectly
				return parseInt(orientation === VERTICAL ? element.clientHeight : element.clientWidth, 10) + 1;
			}

			/**
			 * Scrolls and manipulates DOM element to destination index. Element at destination
			 * index is the first visible element on the screen. Destination index can
			 * be different from Virtual List's current index, because current index points
			 * to first element in the buffer.
			 * @member ns.widget.core.VirtualListview
			 * @param {ns.widget.core.VirtualListview} self VirtualListview widget reference
			 * @param {number} toIndex Destination index.
			 * @method _orderElementsByIndex
			 * @private
			 * @static
			 */
			function _orderElementsByIndex(self, toIndex) {
				var element = self.element,
					options = self.options,
					scrollInfo = self._scroll,
					scrollClipSize = 0,
					dataLength = options.dataLength,
					indexCorrection = 0,
					bufferedElements = 0,
					avgListItemSize = 0,
					bufferSize = options.bufferSize,
					i,
					offset = 0,
					index,
					isLastBuffer = false;

				//Get size of scroll clip depended on scroll direction
				scrollClipSize = options.orientation === VERTICAL ? scrollInfo.clipHeight : scrollInfo.clipWidth;

				//Compute average list item size
				avgListItemSize = _computeElementSize(element, options.orientation) / bufferSize;

				//Compute average number of elements in each buffer (before and after clip)
				bufferedElements = Math.floor((bufferSize - Math.floor(scrollClipSize / avgListItemSize)) / 2);

				if (toIndex - bufferedElements <= 0) {
					index = 0;
					indexCorrection = 0;
				} else {
					index = toIndex - bufferedElements;
				}

				if (index + bufferSize >= dataLength) {
					index = dataLength - bufferSize;
					if (index < 0) {
						index = 0;
					}
					isLastBuffer = true;
				}
				indexCorrection = toIndex - index;

				self._loadData(index);
				blockEvent = true;
				offset = index * avgListItemSize;
				if (options.orientation === VERTICAL) {
					if (isLastBuffer) {
						offset = self._ui.spacer.clientHeight;
					}
					element.style.top = offset + "px";
				} else {
					if (isLastBuffer) {
						offset = self._ui.spacer.clientWidth;
					}
					element.style.left = offset + "px";
				}

				for (i = 0; i < indexCorrection; i += 1) {
					offset += _computeElementSize(element.children[i], options.orientation);
				}

				if (options.orientation === VERTICAL) {
					//MOBILE: self._ui.scrollview.element.scrollTop = offset;
					self._ui.scrollview.scrollTop = offset;
				} else {
					//MOBILE: self._ui.scrollview.element.scrollLeft = offset;
					self._ui.scrollview.scrollLeft = offset;
				}
				blockEvent = false;
				self._currentIndex = index;
			}

			/**
			 * Orders elements. Controls resultset visibility and does DOM manipulation. This
			 * method is used during normal scrolling.
			 * @method _orderElements
			 * @param {ns.widget.core.VirtualListview} self VirtualListview widget reference
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _orderElements(self) {
				var element = self.element,
					scrollInfo = self._scroll,
					options = self.options,
					elementStyle = element.style,
				//Current index of data, first element of resultset
					currentIndex = self._currentIndex,
				//Number of items in resultset
					bufferSize = parseInt(options.bufferSize, 10),
				//Total number of items
					dataLength = options.dataLength,
				//Array of scroll direction
					scrollDirection = scrollInfo.direction,
					scrolledVertically = (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_DOWN]),
					scrolledHorizontally = (scrollDirection[SCROLL_LEFT] || scrollDirection[SCROLL_RIGHT]),
					scrollClipWidth = scrollInfo.clipWidth,
					scrollClipHeight = scrollInfo.clipHeight,
					scrollLastPositionY = scrollInfo.lastPositionY,
					scrollLastPositionX = scrollInfo.lastPositionX,
					elementPositionTop = parseInt(elementStyle.top, 10) || 0,
					elementPositionLeft = parseInt(elementStyle.left, 10) || 0,
					elementsToLoad = 0,
					bufferToLoad = 0,
					elementsLeftToLoad = 0,
					temporaryElement = null,
					avgListItemSize = 0,
					resultsetSize = 0,
					childrenNodes,
					i = 0,
					jump = 0,
					hiddenPart = 0,
					direction,
					newPosition;


				childrenNodes = element.children;
				for (i = childrenNodes.length - 1; i > 0; i -= 1) {
					if (options.orientation === VERTICAL) {
						resultsetSize += childrenNodes[i].clientHeight;
					} else {
						resultsetSize += childrenNodes[i].clientWidth;
					}
				}

				//Compute average list item size
				avgListItemSize = _computeElementSize(element, options.orientation) / bufferSize;

				//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling DOWN
				if (scrollDirection[SCROLL_DOWN]) {
					hiddenPart = scrollLastPositionY - elementPositionTop;
					elementsLeftToLoad = dataLength - currentIndex - bufferSize;
				}

				//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling UP
				if (scrollDirection[SCROLL_UP]) {
					hiddenPart = (elementPositionTop + resultsetSize) - (scrollLastPositionY + scrollClipHeight);
					elementsLeftToLoad = currentIndex;
				}

				//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling RIGHT
				if (scrollDirection[SCROLL_RIGHT]) {
					hiddenPart = scrollLastPositionX - elementPositionLeft;
					elementsLeftToLoad = dataLength - currentIndex - bufferSize;
				}

				//Compute hidden part of result set and number of elements, that needed to be loaded, while user is scrolling LEFT
				if (scrollDirection[SCROLL_LEFT]) {
					hiddenPart = (elementPositionLeft + resultsetSize) - (scrollLastPositionX - scrollClipWidth);
					elementsLeftToLoad = currentIndex;
				}

				//manipulate DOM only, when at least 2/3 of result set is hidden
				//NOTE: Result Set should be at least 3x bigger then clip size
				if (hiddenPart > 0 && (resultsetSize / hiddenPart) <= 1.5) {

					//Left half of hidden elements still hidden/cached
					elementsToLoad = Math.floor(hiddenPart / avgListItemSize) - Math.floor((bufferSize - scrollClipHeight / avgListItemSize) / 2);
					elementsToLoad = elementsLeftToLoad < elementsToLoad ? elementsLeftToLoad : elementsToLoad;
					bufferToLoad = Math.floor(elementsToLoad / bufferSize);
					elementsToLoad = elementsToLoad % bufferSize;

					// Scrolling more then buffer
					if (bufferToLoad > 0) {
						if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
							direction = 1;
						}

						if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_LEFT]) {
							direction = -1;
						}

						// Load data to buffer according to jumped index
						self._loadData(currentIndex + direction * bufferToLoad * bufferSize);

						// Refresh current index after buffer jump
						currentIndex = self._currentIndex;

						jump += direction * bufferToLoad * bufferSize * avgListItemSize;
					}

					if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
						//Switch currentIndex to last
						currentIndex = currentIndex + bufferSize - 1;
					}
					for (i = elementsToLoad; i > 0; i -= 1) {
						if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
							temporaryElement = element.appendChild(element.firstElementChild);
							++currentIndex;

							//Updates list item using template
							self._updateListItem(temporaryElement, currentIndex);
							jump += temporaryElement.clientHeight;
						}

						if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_LEFT]) {
							temporaryElement = element.insertBefore(element.lastElementChild, element.firstElementChild);
							--currentIndex;

							//Updates list item using template
							self._updateListItem(temporaryElement, currentIndex);
							jump -= temporaryElement.clientHeight;
						}
					}
					if (scrolledVertically) {
						newPosition = elementPositionTop + jump;

						if (newPosition < 0 || currentIndex <= 0) {
							newPosition = 0;
							currentIndex = 0;
						}

						if (currentIndex >= (dataLength - 1)) {
							newPosition = self._ui.spacer.clientHeight;
						}

						elementStyle.top = newPosition + "px";
					}

					if (scrolledHorizontally) {
						newPosition = elementPositionLeft + jump;

						if (newPosition < 0 || currentIndex <= 0) {
							newPosition = 0;
						}

						if (currentIndex >= (dataLength - 1)) {
							newPosition = self._ui.spacer.clientWidth;
						}

						elementStyle.left = newPosition + "px";
					}

					if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
						//Switch currentIndex to first
						currentIndex = currentIndex - bufferSize + 1;
					}
					//Save current index
					self._currentIndex = currentIndex;
				}
			}

			/**
			 * Check if scrolling position is changed and updates list if it needed.
			 * @method _updateList
			 * @param {ns.widget.core.VirtualListview} self VirtualListview widget reference
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _updateList(self) {
				var _scroll = self._scroll;
				_updateScrollInfo.call(null, self);
				if (_scroll.lastJumpY > 0 || _scroll.lastJumpX > 0) {
					if (!blockEvent) {
						_orderElements(self);
						utilEvent.trigger(self.element, "vlistupdate");
					}
				}
			}

			/**
			 * Updates list item using user defined listItemUpdater function.
			 * @method _updateListItem
			 * @param {HTMLElement} element List element to update
			 * @param {number} index Data row index
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._updateListItem = function (element, index) {
				this.options.listItemUpdater(element, index);
			};

			/**
			 * Build widget structure
			 * @method _build
			 * @param {HTMLElement} element Widget's element
			 * @return {HTMLElement} Element on which built is widget
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._build = function(element) {
				var classes = VirtualListview.classes;

				element.classList.add(classes.uiVirtualListContainer);
				return element;
			};

			prototype._setupScrollview = function (element, orientation) {
				var scrollview,
					scrollviewStyle;
				//Get scrollview instance
				scrollview = element.parentElement;
				scrollviewStyle = scrollview.style;

				if (orientation === HORIZONTAL) {
					// @TODO check if whiteSpace: nowrap is better for vertical listes
					scrollviewStyle.overflowX = "scroll";
					scrollviewStyle.overflowY = "hidden";
				} else {
					scrollviewStyle.overflowX = "hidden";
					scrollviewStyle.overflowY = "scroll";
				}

				return scrollview;
			};

			/**
			 * Initialize widget on an element.
			 * @method _init
			 * @param {HTMLElement} element Widget's element
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._init = function(element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					orientation,
					scrollview,
					scrollviewStyle,
					spacer,
					spacerStyle;

				//Prepare element
				element.style.position = "relative";

				//Set orientation, default vertical scrolling is allowed
				orientation = options.orientation.toLowerCase() === HORIZONTAL ? HORIZONTAL : VERTICAL;
				if (options.scrollElement) {
					if (typeof options.scrollElement === "string") {
						scrollview = selectors.getClosestBySelector(element, "." + options.scrollElement);
					} else {
						scrollview = options.scrollElement;
					}
				}
				if(!scrollview) {
					scrollview = self._setupScrollview(element, orientation);
				}

				// Prepare spacer (element which makes scrollbar proper size)
				spacer = document.createElement("div");
				spacerStyle = spacer.style;
				spacerStyle.display = "block";
				spacerStyle.position = "static";
				if (orientation === HORIZONTAL) {
					spacerStyle.float = "left";
				}
				element.parentNode.appendChild(spacer);

				if (options.dataLength < options.bufferSize) {
					options.bufferSize = options.dataLength;
				}

				if (options.bufferSize < 1) {
					options.bufferSize = 1;
				}

				// Assign variables to members
				ui.spacer = spacer;
				ui.scrollview = scrollview;
				self.element = element;
				options.orientation = orientation;
			};

			/**
			 * Builds Virtual List structure
			 * @method _buildList
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._buildList = function() {
				var self = this,
					listItem,
					list = self.element,
					options = self.options,
					childElementType = (list.tagName === "UL" || list.tagName === "OL") ? "li" : "div",
					numberOfItems = options.bufferSize,
					documentFragment = document.createDocumentFragment(),
					touchStartEventBound = _touchStartHandler.bind(null, self),
					orientation = options.orientation,
					i;

				for (i = 0; i < numberOfItems; ++i) {
					listItem = document.createElement(childElementType);

					if (orientation === HORIZONTAL) {
						// TODO: check if whiteSpace: nowrap is better for vertical listes
						// NOTE: after rebuild this condition check possible duplication from _init method
						listItem.style.float = "left";
					}

					self._updateListItem(listItem, i);
					documentFragment.appendChild(listItem);
					listItem.addEventListener(POINTER_START, touchStartEventBound, false);
				}

				list.appendChild(documentFragment);
				this._touchStartEventBound = touchStartEventBound;
				this._refresh();
			};

			/**
			 * Refresh list
			 * @method _refresh
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._refresh = function() {
				//Set default value of variable create
				this._refreshScrollbar();
			};

			/**
			 * Loads data from specified index to result set.
			 * @method _loadData
			 * @param {number} index Index of first row
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._loadData = function(index) {
				var self = this,
					children = self.element.firstElementChild;

				if (self._currentIndex !== index) {
					self._currentIndex = index;
					do {
						self._updateListItem(children, index);
						++index;
						children = children.nextElementSibling;
					} while (children);
				}
			};

			/**
			 * Sets proper scrollbar size: height (vertical), width (horizontal)
			 * @method _refreshScrollbar
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._refreshScrollbar = function() {
				var self = this,
					element = self.element,
					options = self.options,
					ui = self._ui,
					spacerStyle = ui.spacer.style,
					bufferSizePx;

				if (options.orientation === VERTICAL) {
					//Note: element.clientHeight is variable
					bufferSizePx = parseFloat(element.clientHeight) || 0;
					spacerStyle.height = (bufferSizePx / options.bufferSize * options.dataLength - bufferSizePx) + "px";
				} else {
					//Note: element.clientWidth is variable
					bufferSizePx = parseFloat(element.clientWidth) || 0;
					spacerStyle.width = (bufferSizePx / options.bufferSize * (options.dataLength - 1) - 4 / 3 * bufferSizePx) + "px";
				}
			};

			/**
			 * Binds VirtualListview events
			 * @method _bindEvents
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._bindEvents = function() {
				var scrollEventBound = _updateList.bind(null, this),
					//MOBILE: scrollviewClip = self._ui.scrollview && self._ui.scrollview.element;
					scrollviewClip = this._ui.scrollview;

				if (scrollviewClip) {
					scrollviewClip.addEventListener("scroll", scrollEventBound, false);
					this._scrollEventBound = scrollEventBound;
				}

				//MOBILE: parent_bindEvents.call(self, self.element);
			};

			/**
			 * Cleans widget's resources
			 * @method _destroy
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._destroy = function() {
				var self = this,
					scrollviewClip = self._ui.scrollview,
					uiSpacer = self._ui.spacer,
					element = self.element,
					elementStyle = element.style,
					listItem;

				// Restore start position
				elementStyle.position = "static";
				if (self.options.orientation === VERTICAL) {
					elementStyle.top = "auto";
				} else {
					elementStyle.left = "auto";
				}

				if (scrollviewClip) {
					scrollviewClip.removeEventListener("scroll", self._scrollEventBound, false);
				}

				//Remove spacer element
				if (uiSpacer.parentNode) {
					uiSpacer.parentNode.removeChild(uiSpacer);
				}

				//Remove li elements.
				while (element.firstElementChild) {
					listItem = element.firstElementChild;
					listItem.removeEventListener(POINTER_START, self._touchStartEventBound, false);
					element.removeChild(listItem);
				}

			};

			/**
			 * This method scrolls list to defined position in pixels.
			 * @method scrollTo
			 * @param {number} position Scroll position expressed in pixels.
			 * @member ns.widget.core.VirtualListview
			 */
			prototype.scrollTo = function(position) {
				this._ui.scrollview.scrollTop = position;
			};

			/**
			 * This method scrolls list to defined index.
			 * @method scrollToIndex
			 * @param {number} index Scroll Destination index.
			 * @member ns.widget.core.VirtualListview
			 */
			prototype.scrollToIndex = function(index) {
				if (index < 0) {
					index = 0;
				}
				if (index >= this.options.dataLength) {
					index = this.options.dataLength - 1;
				}
				_updateScrollInfo(this);
				_orderElementsByIndex(this, index);
			};

			/**
			 * This method builds widget and trigger event "draw".
			 * @method draw
			 * @member ns.widget.core.VirtualListview
			 */
			prototype.draw = function() {
				this._buildList();
				this.trigger("draw");
			};

			/**
			 * This method sets list item updater function.
			 * To learn how to create list item updater function please
			 * visit Virtual List User Guide.
			 * @method setListItemUpdater
			 * @param {Object} updateFunction Function reference.
			 * @member ns.widget.core.VirtualListview
			 */
			prototype.setListItemUpdater = function(updateFunction) {
				this.options.listItemUpdater = updateFunction;
			};

			// Assign prototype
			VirtualListview.prototype = prototype;
			ns.widget.core.VirtualListview = VirtualListview;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return VirtualListview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
