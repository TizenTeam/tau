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
/*jslint nomen: true, white: true, plusplus: true*/
/**
 *#VirtualListView Widget
 *
 * In the Web environment, it is challenging to display a large amount of data in a list, such as
 * displaying a contact list of over 1000 list items. It takes time to display the entire list in
 * HTML and the DOM manipulation is complex.
 *
 * The virtual list widget is used to display a list of unlimited data elements on the screen
 * for better performance. This widget provides easy access to databases to retrieve and display data.
 * It based on **result set** which is fixed size defined by developer by data-row attribute. Result
 * set should be **at least 3 times bigger** then size of clip (number of visible elements).
 *
 * To add a virtual list widget to the application follow these steps:
 *
 * ##Create widget container - list element
 *

   &lt;ul id=&quot;vlist&quot; class=&quot;ui-listview ui-virtuallistview&quot;&gt;&lt;/ul&gt;

 *
 * ##Initialize widget
 *
	// Get HTML Element reference
	var elList = document.getElementById("vlist"),
		// Set up config. All config options can be found in virtual list reference
		vListConfig = {
		dataLength: 2000,
		bufferSize: 40,
		listItemUpdater: function(elListItem, newIndex){
			// NOTE: JSON_DATA is global object with all data rows.
			var data = JSON_DATA["newIndex"];
			elListItem.innerHTML = '<span class="ui-li-text-main">' +
												data.NAME + '</span>';
			}
		};
	vlist = tau.widget.VirtualListview(elList, vListConfig);
 *
 * More config options can be found in {@link ns.widget.wearable.VirtualListview#options}
 *
 * ##Set list item update function
 *
 * List item update function is responsible to update list element depending on data row index. If you didn’t
 * pass list item update function by config option, you have to do it using following method.
 * Otherwise you will see an empty list.
 *
 *
	vlist.setListItemUpdater(function(elListItem, newIndex){
		// NOTE: JSON_DATA is global object with all data rows.
		var data = JSON_DATA["newIndex"];
		elListItem.innerHTML = '<span class="ui-li-text-main">' +
									data.NAME + '</span>';
	});
 *
 * **Attention:** Virtual List manipulates DOM elements to be more efficient. It doesn’t remove or create list
 * elements before calling list item update function. It means that, you have to take care about list element
 * and keep it clean from custom classes an attributes, because order of li elements is volatile.
 *
 * ##Draw child elements
 * If all configuration options are set, call draw method to draw child elements and make virtual list work.
 *
	vlist.draw();
 *
 * ##Destroy Virtual List
 * It’s highly recommended to destroy widgets, when they aren’t necessary. To destroy Virtual List call destroy method.
 *
	vlist.destroy();
 *
 * ##Full working code
 *
	var page = document.getElementById("pageTestVirtualList"),
		vlist,
		// Assing data.
		JSON_DATA = [
			{NAME:"Abdelnaby, Alaa", ACTIVE:"1990 - 1994", FROM:"College - Duke", TEAM_LOGO:"../test/1_raw.jpg"},
			{NAME:"Abdul-Aziz, Zaid", ACTIVE:"1968 - 1977", FROM:"College - Iowa State", TEAM_LOGO:"../test/2_raw.jpg"}
			// A lot of records.
			// These database can be found in Gear Sample Application Winset included to Tizen SDK
			];

		page.addEventListener("pageshow", function() {
			var elList = document.getElementById("vlist");

			vlist = tau.widget.VirtualListview(elList, {
					dataLength: JSON_DATA.length,
					bufferSize: 40
			});

			// Set list item updater
			vlist.setListItemUpdater(function(elListItem, newIndex) {
				//TODO: Update listitem here
				var data =  JSON_DATA[newIndex];
				elListItem.innerHTML = '<span class="ui-li-text-main">' +
											data.NAME + '</span>';
			});
			// Draw child elements
			vlist.draw();
		});
		page.addEventListener("pagehide", function() {
			// Remove all children in the vlist
			vlist.destroy();
		});
 *
 * @class ns.widget.wearable.VirtualListview
 * @extend ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 */
(function(document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
			[
				"../../../../core/engine",
				"../../../../core/event",
				"../../../../core/widget/BaseWidget",
				"../wearable" // fetch namespace
			],
			function() {
				//>>excludeEnd("tauBuildExclude");
				var BaseWidget = ns.widget.BaseWidget,
						/**
						 * @property {Object} engine Alias for class {@link ns.engine}
						 * @private
						 * @static
						 * @member ns.widget.wearable.VirtualListview
						 */
						engine = ns.engine,
						events = ns.event,
						// Constants definition
						/**
						 * @property {number} SCROLL_UP Defines index of scroll `{@link ns.widget.wearable.VirtualListview#_scroll}.direction`
						 * to retrive if user is scrolling up
						 * @private
						 * @static
						 * @member ns.widget.wearable.VirtualListview
						 */
						SCROLL_UP = 0,
						/**
						 * @property {number} SCROLL_RIGHT Defines index of scroll `{@link ns.widget.wearable.VirtualListview#_scroll}.direction`
						 * to retrive if user is scrolling right
						 * @private
						 * @static
						 * @member ns.widget.wearable.VirtualListview
						 */
						SCROLL_RIGHT = 1,
						/**
						 * @property {number} SCROLL_DOWN Defines index of scroll {@link ns.widget.wearable.VirtualListview#_scroll}
						 * to retrive if user is scrolling down
						 * @private
						 * @static
						 * @member ns.widget.wearable.VirtualListview
						 */
						SCROLL_DOWN = 2,
						/**
						 * @property {number} SCROLL_LEFT Defines index of scroll {@link ns.widget.wearable.VirtualListview#_scroll}
						 * to retrive if user is scrolling left
						 * @private
						 * @static
						 * @member ns.widget.wearable.VirtualListview
						 */
						SCROLL_LEFT = 3,
						/**
						 * @property {string} VERTICAL Defines vertical scrolling orientation. It's default orientation.
						 * @private
						 * @static
						 */
						VERTICAL = 'y',
						/**
						 * @property {string} HORIZONTAL Defines horizontal scrolling orientation.
						 * @private
						 * @static
						 */
						HORIZONTAL = 'x',
						/**
						 * @property {boolean} blockEvent Determines that scroll event should not be taken into account if scroll event accurs.
						 * @private
						 * @static
						 */
						blockEvent = false,
						/**
						 * @property {number} timeoutHandler Handle window timeout ID.
						 * @private
						 * @static
						 */
						timeoutHandler,
						/**
						 * @property {Object} origTarget Reference to original target object from touch event.
						 * @private
						 * @static
						 */
						origTarget,
						/**
						 * @property {number} tapholdThreshold Number of miliseconds to determine if tap event occured.
						 * @private
						 * @static
						 */
						tapholdThreshold = 250,
						/**
						 * @property {Object} tapHandlerBound Handler for touch event listener to examine tap occurance.
						 * @private
						 * @static
						 */
						tapHandlerBound = null,
						/**
						 * @property {Object} lastTouchPos Stores last touch position to examine tap occurance.
						 * @private
						 * @static
						 */
						lastTouchPos =	{},

						/**
						 * Local constructor function
						 * @method VirtualListview
						 * @private
						 * @member ns.widget.wearable.VirtualListview
						 */
						VirtualListview = function() {
							var self = this;
							/**
							 * @property {Object} ui VirtualListview widget's properties associated with
							 * User Interface
							 * @property {?HTMLElement} [ui.scrollview=null] Scroll element
							 * @property {number} [ui.itemSize=0] Size of list element in piksels. If scrolling is
							 * vertically it's item width in other case it"s height of item element
							 * @member ns.widget.wearable.VirtualListview
							 */
							self.ui = {
								scrollview: null,
								spacer: null,
								itemSize: 0
							};

							/**
							 * @property {Object} _scroll Holds information about scrolling state
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
							 * @member ns.widget.wearable.VirtualListview
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

							self.name = "VirtualListview";

							/**
							 * @property {number} _currentIndex Current zero-based index of data set.
							 * @member ns.widget.wearable.VirtualListview
							 * @protected
							 * @instance
							 */
							self._currentIndex = 0;

							/**
							 * @property {Object} options VirtualListview widget options.
							 * @property {number} [options.bufferSize=100] Number of items of result set. The default value is 100.
							 * As the value gets higher, the loading time increases while the system performance
							 * improves. So you need to pick a value that provides the best performance
							 * without excessive loading time. It's recomended to set bufferSize at least 3 times bigger than number
							 * of visible elements.
							 * @property {number} [options.dataLength=0] Total number of items.
							 * @property {string} [options.orientation='y'] Scrolling orientation. Default vertical scrolling enabled.
							 * @property {Object} options.listItemUpdater Holds reference to method which modifies list item, depended
							 * at specified index from database. **Method should be overridden by developer using
							 * {@link ns.widget.wearable.VirtualListview#setListItemUpdater} method.** or defined as a config
							 * object. Method takes two parameters:
							 *  -  element {HTMLElement} List item to be modified
							 *  -  index {number} Index of data set
							 * @member ns.widget.wearable.VirtualListview
							 */
							self.options = {
								bufferSize: 100,
								dataLength: 0,
								orientation: VERTICAL,
								listItemUpdater: null
							};

							/**
							* @method _scrollEventBound Binding for scroll event listener.
							* @member ns.widget.wearable.VirtualListview
							* @protected
							* @instance
							*/
							self._scrollEventBound = null;
							/**
							* @method _touchStartEventBound Binding for touch start event listener.
							* @member ns.widget.wearable.VirtualListview
							* @protected
							* @instance
							*/
							self._touchStartEventBound = null;

							return self;
						},
						// Cached prototype for better minification
						prototype = new BaseWidget();

				/**
				 * @property {Object} classes Dictionary object containing commonly used wiget classes
				 * @static
				 * @member ns.widget.wearable.VirtualListview
				 */
				VirtualListview.classes = {
					uiVirtualListContainer: "ui-virtual-list-container",
					uiListviewActive: "ui-listview-active"
				};

				/**
				 * Remove highlight from items.
				 * @method _removeHighlight
				 * @param {Object} self Reference to VirtualListview object.
				 * @member ns.widget.wearable.VirtualListview
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
				 * @param {Object} self Reference to VirtualListview object.
				 * @param {Event} event Received Touch event
				 * @member ns.widget.wearable.VirtualListview
				 * @private
				 * @static
				 */
				function _tapHandler (self, event) {
					var eventTouch = event.changedTouches[0];

					if (event.type === 'touchmove') {
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
				 * @param {Object} self Reference to VirtualListview object.
				 * @member ns.widget.wearable.VirtualListview
				 * @private
				 * @static
				 */
				function tapholdListener(self) {
					var liElement;

					liElement = origTarget.tagName === 'LI' ? origTarget : origTarget.parentNode;

					origTarget.removeEventListener('touchmove', tapHandlerBound, false);
					origTarget.removeEventListener('touchend', tapHandlerBound, false);
					tapHandlerBound = null;

					_removeHighlight(self);
					liElement.classList.add(VirtualListview.classes.uiListviewActive);
					lastTouchPos = {};
				}

				/**
				 * Binds touching events to examine tap event.
				 * @method _touchStartHandler
				 * @param {Object} self Reference to VirtualListview object.
				 * @member ns.widget.wearable.VirtualListview
				 * @private
				 * @static
				 */
				function _touchStartHandler (self, event) {
					origTarget = event.target;

					// Clean up
					window.clearTimeout(timeoutHandler);
					origTarget.removeEventListener('touchmove', tapHandlerBound, false);
					origTarget.removeEventListener('touchend', tapHandlerBound, false);

					timeoutHandler = window.setTimeout(tapholdListener.bind(null, self), tapholdThreshold);
					lastTouchPos.clientX = event.touches[0].clientX;
					lastTouchPos.clientY = event.touches[0].clientY;

					//Add touch listeners
					tapHandlerBound = _tapHandler.bind(null, self);
					origTarget.addEventListener('touchmove', tapHandlerBound, false);
					origTarget.addEventListener('touchend', tapHandlerBound, false);

				}


				/**
				 * Updates scroll information about position, direction and jump size.
				 * @method _updateScrollInfo
				 * @param {ns.widget.wearable.VirtualListview} self VirtualListview widget reference
				 * @member ns.widget.wearable.VirtualListview
				 * @private
				 * @static
				 */
				function _updateScrollInfo(self) {
					var scrollInfo = self._scroll,
						scrollDirection = scrollInfo.direction,
						scrollViewElement = self.ui.scrollview,
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
				 * @member ns.widget.wearable.VirtualListview
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
				 * @member ns.widget.wearable.VirtualListview
				 * @param {ns.widget.wearable.VirtualListview} self VirtualListview widget reference
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
						index;

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
					}
					indexCorrection = toIndex - index;

					self._loadData(index);
					blockEvent = true;
					offset = index * avgListItemSize;
					if (options.orientation === VERTICAL) {
						element.style.top = offset + "px";
					} else {
						element.style.left = offset + "px";
					}

					for (i = 0; i < indexCorrection; i += 1) {
						offset += _computeElementSize(element.children[i], options.orientation);
					}

					if (options.orientation === VERTICAL) {
					self.ui.scrollview.scrollTop = offset;
					} else {
						self.ui.scrollview.scrollLeft = offset;
					}
					blockEvent = false;
					self._currentIndex = index;
				}

				/**
				 * Orders elements. Controls resultset visibility and does DOM manipulation. This
				 * method is used during normal scrolling.
				 * @method _orderElements
				 * @param {ns.widget.wearable.VirtualListview} self VirtualListview widget reference
				 * @member ns.widget.wearable.VirtualListview
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
						if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_DOWN]) {
							newPosition = elementPositionTop + jump;

							if (newPosition < 0 || currentIndex <= 0) {
								newPosition = 0;
								currentIndex = 0;
							}

							elementStyle.top = newPosition + "px";
						}

						if (scrollDirection[SCROLL_LEFT] || scrollDirection[SCROLL_RIGHT]) {
							newPosition = elementPositionLeft + jump;

							if (newPosition < 0 || currentIndex <= 0) {
								newPosition = 0;
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
				 * @param {ns.widget.wearable.VirtualListview} self VirtualListview widget reference
				 * @member ns.widget.wearable.VirtualListview
				 * @private
				 * @static
				 */
				function _updateList(self) {
					var _scroll = self._scroll;
					_updateScrollInfo.call(null, self);
					if (_scroll.lastJumpY > 0 || _scroll.lastJumpX > 0) {
						if (!blockEvent) {
							_orderElements(self);
						}
					}
				}

				/**
				 * Updates list item using user defined listItemUpdater function.
				 * @method _updateListItem
				 * @param {HTMLElement} element List element to update
				 * @param {number} index Data row index
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._updateListItem = function (element, index) {
					this.options.listItemUpdater(element, index);
				};

				/**
				 * Build widget structure
				 * @method _build
				 * @param {HTMLElement} element Widget's element
				 * @return {HTMLElement} Element on which built is widget
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._build = function(element) {
					var classes = VirtualListview.classes;

					element.classList.add(classes.uiVirtualListContainer);
					return element;
				};


				/**
				 * Initialize widget on an element.
				 * @method _init
				 * @param {HTMLElement} element Widget's element
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._init = function(element) {
					var self = this,
						ui = self.ui,
						options = self.options,
						orientation,
						scrollview,
						scrollviewStyle,
						spacer,
						spacerStyle;

					//Set orientation, default vertical scrolling is allowed
					orientation = options.orientation.toLowerCase() === HORIZONTAL ? HORIZONTAL : VERTICAL;

					//Get scrollview instance
					scrollview = element.parentElement;
					scrollviewStyle = scrollview.style;

					// Prepare spacer (element which makes scrollbar proper size)
					spacer = document.createElement("div");
					spacerStyle = spacer.style;
					spacerStyle.display = "block";
					spacerStyle.position = "static";
					scrollview.appendChild(spacer);

					//Prepare element
					element.style.position = "relative";

					if (orientation === HORIZONTAL) {
						// @TODO check if whiteSpace: nowrap is better for vertical listes
						spacerStyle.float = 'left';
						scrollviewStyle.overflowX = "scroll";
						scrollviewStyle.overflowY = "hidden";
					} else {
						scrollviewStyle.overflowX = "hidden";
						scrollviewStyle.overflowY = "scroll";
					}

					if (options.dataLength < options.bufferSize) {
						options.bufferSize = options.dataLength - 1;
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
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._buildList = function() {
					var listItem,
						list = this.element,
						numberOfItems = this.options.bufferSize,
						documentFragment = document.createDocumentFragment(),
						touchStartEventBound = _touchStartHandler.bind(null, this),
						orientation = this.options.orientation,
						i;

					for (i = 0; i < numberOfItems; ++i) {
						listItem = document.createElement("li");

						if (orientation === HORIZONTAL) {
							// TODO: check if whiteSpace: nowrap is better for vertical listes
							// NOTE: after rebuild this condition check possible duplication from _init method
							listItem.style.float = 'left';
						}

						this._updateListItem(listItem, i);
						documentFragment.appendChild(listItem);
						listItem.addEventListener('touchstart', touchStartEventBound, false);
					}

					list.appendChild(documentFragment);
					this._touchStartEventBound = touchStartEventBound;
					this._refresh();
				};

				/**
				 * Refresh list
				 * @method _refresh
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._refresh = function() {
					//Set default value of variable create
					this._refreshScrollbar();
				};

				/**
				 * Loads data from specified index to result set.
				 * @method _loadData
				 * @param {number} index Index of first row
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 * @instance
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
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._refreshScrollbar = function() {
					var self = this,
						element = self.element,
						options = self.options,
						ui = self.ui,
						spacerStyle = ui.spacer.style,
						bufferSizePx;

					if (options.orientation === VERTICAL) {
						//Note: element.clientHeight is variable
						bufferSizePx = parseFloat(element.clientHeight) || 0;
						spacerStyle.height = (bufferSizePx / options.bufferSize * (options.dataLength - 1) - 4 / 3 * bufferSizePx) + "px";
					} else {
						//Note: element.clientWidth is variable
						bufferSizePx = parseFloat(element.clientWidth) || 0;
						spacerStyle.width = (bufferSizePx / options.bufferSize * (options.dataLength - 1) - 4 / 3 * bufferSizePx) + "px";
					}
				};

				/**
				 * Binds VirtualListview events
				 * @method _bindEvents
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._bindEvents = function() {
					var scrollEventBound = _updateList.bind(null, this),
						scrollviewClip = this.ui.scrollview;

					if (scrollviewClip) {
						scrollviewClip.addEventListener("scroll", scrollEventBound, false);
						this._scrollEventBound = scrollEventBound;
					}
				};

				/**
				 * Cleans widget's resources
				 * @method _destroy
				 * @member ns.widget.wearable.VirtualListview
				 * @protected
				 * @instance
				 */
				prototype._destroy = function() {
					var self = this,
						scrollviewClip = self.ui.scrollview,
						uiSpacer = self.ui.spacer,
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
						listItem.removeEventListener('touchstart', self._touchStartEventBound, false);
						element.removeChild(listItem);
					}

				};

				/**
				 * Scrolls list to defined position in pixels.
				 * @method scrollTo
				 * @param {number} position Scroll position expressed in pixels.
				 * @member ns.widget.wearable.VirtualListview
				 */
				prototype.scrollTo = function(position) {
					this.ui.scrollview.scrollTop = position;
				};

				/**
				 * Scrolls list to defined index.
				 * @method scrollToIndex
				 * @param {number} index Scroll Destination index.
				 * @member ns.widget.wearable.VirtualListview
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
				 * Builds widget
				 * @method draw
				 * @member ns.widget.wearable.VirtualListview
				 */
				prototype.draw = function() {
					this._buildList();
					this.trigger('draw');
				};

				/**
				 * Sets list item updater function. To learn how to create list item updater function please
				 * visit Virtual List User Guide
				 * @method setListItemUpdater
				 * @param {Object} updateFunction Function reference.
				 * @member ns.widget.wearable.VirtualListview
				 */
				prototype.setListItemUpdater = function(updateFunction) {
					this.options.listItemUpdater = updateFunction;
				};

				// Assign prototype
				VirtualListview.prototype = prototype;

				// definition
				ns.widget.wearable.VirtualListview = VirtualListview;

				engine.defineWidget(
						"VirtualListview",
						"",
						["draw", "setListItemUpdater", "getTopByIndex", "scrollTo", "scrollToIndex"],
						VirtualListview,
						"wearable"
						);
				//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
				return VirtualListview;
			}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
