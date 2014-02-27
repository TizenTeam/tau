/*global window, define */
/*jslint nomen: true, white: true, plusplus: true*/
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class ns.widget.micro.VirtualListview
 * @extend ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 */
/**
* @class gear.ui.VirtualListview
* @inheritdoc ns.widget.micro.VirtualListview
* @extends ns.widget.micro.VirtualListview
*/
(function(document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../core",
			"../../engine",
			"../../utils/events",
			"../micro", // fetch namespace
			"../BaseWidget"
		],
		function() {
				//>>excludeEnd("ejBuildExclude");
				var BaseWidget = ns.widget.BaseWidget,
						/**
						 * @property {ns.engine} engine alias variable
						 * @private
						 * @static
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						engine = ns.engine,
						events = ns.utils.events,
						// Constants definition
						/**
						 * @property {number} SCROLL_UP defines index of scroll `{@link ns.widget.VirtualListview._scroll#direction}.direction`
						 * to retrive if user is scrolling up
						 * @private
						 * @static
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						SCROLL_UP = 0,
						/**
						 * @property {number} SCROLL_RIGHT defines index of scroll {@link ns.widget.VirtualListview._scroll#direction _scroll.direction}.direction
						 * to retrive if user is scrolling right
						 * @private
						 * @static
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						SCROLL_RIGHT = 1,
						/**
						 * @property {number} SCROLL_DOWN defines index of scroll {@link ns.widget.VirtualListview._scroll#direction _scroll.direction}
						 * to retrive if user is scrolling down
						 * @private
						 * @static
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						SCROLL_DOWN = 2,
						/**
						 * @property {number} SCROLL_LEFT defines index of scroll {@link ns.widget.VirtualListview._scroll#direction _scroll.direction}
						 * to retrive if user is scrolling left
						 * @private
						 * @static
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						SCROLL_LEFT = 3,
						blockEvent = false,
						timer,
						origTarget,
						tapholdThreshold = 250,
						tapHandlerBound = null,
						lastTouchPos = {},

						/**
						 * Local constructor function
						 * @method VirtualListview
						 * @private
						 * @memberOf ns.widget.micro.VirtualListview
						 */
						VirtualListview = function() {
							/**
							 * @property {Object} ui VirtualListview widget's properties associated with
							 * User Interface
							 * @property {?HTMLElement} [ui.scrollview=null] Reference to associated
							 * {@link ns.widget.Scrollview Scrollview widget}
							 * @property {number} [ui.itemSize=0] Size of list element in piksels. If scrolling is
							 * vertically it's item width in other case it"s height of item element
							 * @memberOf ns.widget.micro.VirtualListview
							 */
							this.ui = {
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
							 * @memberOf ns.widget.micro.VirtualListview
							 */
							this._scroll = {
								direction: [0, 0, 0, 0],
								lastPositionX: 0,
								lastPositionY: 0,
								lastJumpX: 0,
								lastJumpY: 0,
								//@TODO: what if there is another element in scroll view? what size of clip should be?
								clipWidth: 0,
								clipHeight: 0
							};

							this.name = "VirtualListview";

							/**
							 * @property {number} _currentIndex Current zero-based index of data set.
							 * @memberOf ns.widget.micro.VirtualListview
							 */
							this._currentIndex = 0;

							/**
							 * @property {Object} options VirtualListview widget options.
							 * @property {number} [options.bufferSize=100] Number of items of result set. The minimum
							 * value is 20 and the default value is 100. As the value gets higher, the loading
							 * time increases while the system performance improves. So you need to pick a value
							 * that provides the best performance without excessive loading time.
							 * @property {number} [options.dataLength=0] Total number of items.
							 */
							this.options = {
								bufferSize: 100,
								dataLength: 0,
								orientation: 'y',
								/**
								 * Method which modifies list item, depended at specified index from database.
								 * **Method should overrided by developer using {@link ns.widget.VirtualListview#create .create} method.**
								 * @method
								 * @param {HTMLElement} element List item to be modified.
								 * @param {number} index Index of data set.
								 * @memberOf ns.widget.micro.VirtualListview
								 */
								listItemUpdater: function() {
									return null;
								}
							};

							//Event function handler
							this._scrollEventBound = null;
							this._touchStartEventBound = null;
							return this;
						},
						prototype = new BaseWidget();

				function _removeHighlight (self) {
					var children = self.element.children,
						i = children.length;
					while (--i > 0) {
						children[i].classList.remove('ui-listview-active');
					}
				}

				function _tapHandler (self, event) {
					var eventTouch = event.changedTouches[0];

					if (event.type === 'touchmove') {
						if (Math.abs(lastTouchPos.clientX - eventTouch.clientX) > 10 && Math.abs(lastTouchPos.clientY - eventTouch.clientY) > 10) {
							_removeHighlight(self);
							window.clearTimeout(timer);
						}
					} else {
						_removeHighlight(self);
						window.clearTimeout(timer);
					}

				}

				function tapholdListener(self) {
					var liElement;

					liElement = origTarget.tagName === 'LI' ? origTarget : origTarget.parentNode;

					origTarget.removeEventListener('touchmove', tapHandlerBound, false);
					origTarget.removeEventListener('touchend', tapHandlerBound, false);
					tapHandlerBound = null;


					_removeHighlight(self);
					liElement.classList.add('ui-listview-active');
					lastTouchPos = {};

				}

				function _touchStartHandler (self, event) {
					origTarget = event.target;
					window.clearTimeout(timer);
					timer = window.setTimeout(tapholdListener.bind('', self), tapholdThreshold);

					lastTouchPos.clientX = event.touches[0].clientX;
					lastTouchPos.clientY = event.touches[0].clientY;

					//Add touch listeners
					tapHandlerBound = _tapHandler.bind('', self);
					origTarget.addEventListener('touchmove', tapHandlerBound, false);
					origTarget.addEventListener('touchend', tapHandlerBound, false);

				}


				//@TODO: Maybe this information should by provided by Scrollview
				/**
				 * Updates scroll information about position, direction and jump size.
				 * @param {ns.widget.micro.VirtualListview} self VirtualListview widget reference
				 * @method _updateScrollInfo
				 * @private
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

				function _computeElementSize(element, orientation) {
					return parseInt(orientation === 'y' ? element.clientHeight : element.clientWidth, 10) + 1;
				}

				function _orderElementsByIndex(self, index) {
					var element = self.element,
						options = self.options,
						scrollInfo = self._scroll,
						scrollClipSize = options.orientation === 'y' ? scrollInfo.clipHeight : scrollInfo.clipWidth,
						dataLength = options.dataLength,
						indexCorrection = 0,
						avgListItemSize = 0,
						bufferSize = options.bufferSize,
						i,
						offset = 0;

					//Compute average list item size
					avgListItemSize = _computeElementSize(element, options.orientation) / bufferSize;

					//Compute count of element in buffer
					indexCorrection = Math.floor((bufferSize - Math.floor(scrollClipSize / avgListItemSize)) / 2);

					if (index - indexCorrection <= 0) {
						index = 0;
						indexCorrection = 0;
					} else {
						index -= indexCorrection;
					}

					if (index + bufferSize >= dataLength) {
						index = dataLength - bufferSize;
						indexCorrection = bufferSize;
					}

					self._loadData(index);
					blockEvent = true;
					offset = index * avgListItemSize;
					if (options.orientation === 'y') {
						element.style.top = offset + "px";
					} else {
						element.style.left = offset + "px";
					}

					for (i = 0; i < indexCorrection; i += 1) {
						offset += _computeElementSize(element.children[i], options.orientation);
					}

					if (options.orientation === 'y') {
						self.ui.scrollview.scrollTop = offset;
					} else {
						self.ui.scrollview.scrollLeft = offset;
					}
					blockEvent = false;
					self._currentIndex = index;
				}

				/**
				 * Orders elements. Controls resultset visibility and does DOM manipulation.
				 * @method _orderElements
				 * @param {ns.widget.micro.VirtualListview} self VirtualListview widget reference
				 * @private
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
							newPosition;

					childrenNodes = element.children;
					for (i = childrenNodes.length - 1; i > 0; i -= 1) {
						if (options.orientation === 'y') {
							resultsetSize += childrenNodes[i].clientHeight;
						} else {
							resultsetSize += childrenNodes[i].clientWidth;
						}
					}
					avgListItemSize = resultsetSize / options.bufferSize;

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
							self._loadData(currentIndex + bufferToLoad * bufferSize);
							if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
								if (scrollDirection[SCROLL_DOWN] || scrollDirection[SCROLL_RIGHT]) {
									jump += bufferToLoad * bufferSize * avgListItemSize;
								}

								if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_LEFT]) {
									jump -= bufferToLoad * bufferSize * avgListItemSize;
								}
							}
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
							if (newPosition < 0) {
								newPosition = 0;
							}
							if (currentIndex === 0) {
								newPosition = 0;
							}
							elementStyle.top = newPosition + "px";
						}

						if (scrollDirection[SCROLL_LEFT] || scrollDirection[SCROLL_RIGHT]) {
							newPosition = elementPositionTop + jump;
							if (newPosition < 0) {
								newPosition = 0;
							}
							if (currentIndex === 0) {
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
				 * Updates list item with data using defined template
				 * @method _updateListItem
				 * @param {ns.widget.micro.VirtualListview} self VirtualListview widget reference
				 * @param {HTMLElement} element List element to update
				 * @param {number} index Data row index
				 * @private
				 */
				prototype._updateListItem = function (element, index) {
					this.options.listItemUpdater(element, index);
				};

				/**
				 * @property {Object} classes Dictionary object containing commonly used wiget classes
				 * @static
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				VirtualListview.classes = {
					uiVirtualListContainer: "ui-virtual-list-container"
				};

				/**
				 * Build widget structure
				 * @method _build
				 * @protected
				 * @param {string} template
				 * @param {HTMLElement} element
				 * @return {HTMLElement}
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype._build = function(template, element) {
					var classes = VirtualListview.classes;

					element.classList.add(classes.uiVirtualListContainer);
					return element;
				};

				/**
				 * Updates list if it needed.
				 * @method _updateList
				 * @protected
				 * @param {ns.widget.micro.VirtualListview} self VirtualListview widget reference
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				function _updateList(self) {
					var _scroll = self._scroll;
					_updateScrollInfo.call(null, self);
					if (_scroll.lastJumpY > 0 || _scroll.lastJumpX > 0) {
						if (!blockEvent) {
							_orderElements.call(null, self);
						}
					}
				}


				/**
				 * Initialize list on an element
				 * @method _init
				 * @protected
				 * @param {HTMLElement} element
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype._init = function(element) {
					var self = this,
						ui = self.ui,
						scrollview,
						spacer,
						spacerStyle;

					//Get scrollview instance
					scrollview = self.element.parentElement;
					spacer = document.createElement("div");
					scrollview.appendChild(spacer);
					spacerStyle = spacer.style;
					spacerStyle.display = "block";
					spacerStyle.position = "static";
					if (self.options.orientation === 'x') {
						spacerStyle.float = 'left';
					}
					//Prepare element
					element.style.position = "relative";
					ui.spacer = spacer;
					ui.scrollview = scrollview;
					self.element = element;

				};

				/**
				 * Builds list items
				 * @method _buildList
				 * @protected
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype._buildList = function() {
					var listItem,
							list = this.element,
							numberOfItems = this.options.bufferSize,
							documentFragment = document.createDocumentFragment(),
							touchStartEventBound = _touchStartHandler.bind(null, this),
							i;

					for (i = 0; i < numberOfItems; ++i) {
						listItem = document.createElement("li");
						if (this.options.orientation === 'x') {
							listItem.style.float = 'left';
						}
						this._updateListItem(listItem, i);
						documentFragment.appendChild(listItem);
						listItem.addEventListener('touchstart', touchStartEventBound, false);
					}

					list.appendChild(documentFragment);
					this._touchStartEventBound = touchStartEventBound;
					this._refresh(true);
				};

				/**
				 * Refresh list
				 * @method _refresh
				 * @protected
				 * @param {boolean} create If it's true items will be recreated. Default is false.
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype._refresh = function(create) {
					//Set default value of variable create
					create = create || false;
					this._refreshScrollbar();
				};

				/**
				 * Loads data from specefied index to result set size.
				 * @method _loadData
				 * @protected
				 * @param {number} index Index of first row
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype._loadData = function(index) {
					var children = this.element.firstElementChild;

					this._currentIndex = index;
					do {
						this._updateListItem(children, index);
						++index;
						children = children.nextElementSibling;
					} while (children);
				};

				/**
				 * Sets proper scrollbar size: height (vertical), width (horizontal)
				 * @method _refreshScrollbar
				 * @protected
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype._refreshScrollbar = function() {
					var self = this,
						element = self.element,
						options = self.options,
						bufferSizePx,
						ui = self.ui,
						spacerStyle = ui.spacer.style;

					/*
					 * @TODO: add checking horizontal / vertical scroll
					 */
					if (options.orientation === 'y') {
						bufferSizePx = parseFloat(element.clientHeight) || 0;
						//Note: element.clientHeight is variable
						spacerStyle.height = (bufferSizePx / options.bufferSize * (options.dataLength - 1) - 4 / 3 * bufferSizePx) + "px";
					} else {
						bufferSizePx = parseFloat(element.clientWidth) || 0;
						//Note: element.clientWidth is variable
						spacerStyle.width = (bufferSizePx / options.bufferSize * (options.dataLength - 1) - 4 / 3 * bufferSizePx) + "px";
					}
				};

				/**
				 * Binds VirtualListview events
				 * @method _bindEvents
				 * @protected
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype._bindEvents = function() {
					var scrollEventBound = _updateList.bind(null, this),
							scrollviewClip = this.ui.scrollview,
							self = this;

					if (scrollviewClip) {
						scrollviewClip.addEventListener("scroll", scrollEventBound, false);
						self._scrollEventBound = scrollEventBound;
					}
				};

				/**
				 * Cleans widget's resources
				 * @method _destroy
				 * @protected
				 * @memberOf ns.widget.micro.VirtualListview
				 */
				prototype._destroy = function() {
					var self = this,
							scrollviewClip = self.ui.scrollview,
							childrenNodes,
							i,
							uiSpacer = self.ui.spacer,
							litsItem,
							element = self.element;

					element.style.top = 0;
					if (scrollviewClip) {
						scrollviewClip.removeEventListener("scroll", self._scrollEventBound, false);
					}

					childrenNodes = element.children;
					for (i = childrenNodes.length - 1; i > 0; --i) {
						litsItem = childrenNodes[i];
						litsItem.removeEventListener('touchstart', self._touchStartEventBound, false);
					}

					//Remove spacer element
					if (uiSpacer.parentNode) {
						uiSpacer.parentNode.removeChild(uiSpacer);
					}

					//Remove li elements.
					while (element.firstElementChild) {
						element.removeChild(element.firstElementChild);
					}

				};

				prototype.scrollTo = function(position) {
					this.ui.scrollview.scrollTop = position;
				};

				prototype.scrollToIndex = function(index) {
					_updateScrollInfo.call(null, this);
					_orderElementsByIndex(this, index);
				};

				prototype.draw = function() {
					this._buildList();
					events.trigger(this.element, 'draw');
				};

				prototype.setListItemUpdater = function(updateFunction) {
					this.options.listItemUpdater = updateFunction;
				};

				VirtualListview.prototype = prototype;

				// definition
				ns.widget.micro.VirtualListview = VirtualListview;

				engine.defineWidget(
						"VirtualListview",
						"",
						"",
						["draw", "setListItemUpdater", "getTopByIndex", "scrollTo", "scrollToIndex"],
						VirtualListview,
						"micro"
						);
				//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
				return VirtualListview;
			}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej));
