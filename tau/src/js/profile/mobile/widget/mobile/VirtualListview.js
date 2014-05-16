/*global window, define, $, ns */
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
 * #Virtual List Widget
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
 * For now Virtual Lists are based on the **jQuery.template plugin** as described in the jQuery documentation
 * for jQuery.template plugin - but it will change some day...
 *
 * ##Default selectors
 * In _ul_ elements with _data-role=virtuallistview_ or _data-role=virtuallist_.
 *
 * ##Make it work
 * To active and configure virtual list widget with application follow these steps:
 *
 * ####1. Create template and place widget element
 *
 *    @example
 *    <script id="tmp-3-2-7" type="text/x-jquery-tmpl">
 *            <li class="ui-li-3-2-7">
 *            <span class="ui-li-text-main">${NAME}</span>
 *                <img src="00_winset_icon_favorite_on.png" class="ui-li-icon-sub"/>
 *                <span class="ui-li-text-sub">${ACTIVE}</span>
 *                <span class="ui-li-text-sub2">${FROM}</span>
 *            </li>
 *        </script>
 *        <ul id="vlist" data-role="virtuallistview" data-template="tmp-3-2-7" data-row="100"></ul>
 *
 * **NOTE:** Tizen Web UI's data-dbtable attribute and functionality is not supported.
 *
 * ####2. Create template and place widget element
 * Run {@link ns.widget.mobile.VirtualListview#create .create} method to configure iteration function and
 * declare total number of items.
 *
 *    @example
 *    virtuallistview.create({
 *		//Configure iteration function
 *		itemData: function ( idx ) {
 *			return myDATA[idx];
 *		},
 *		//Declare total number of items
 *		numItemData: myDATA.length
 *	});
 *
 * ##Manual constructor
 * To construct VirtualListview widget manually you can use constructor of the widget:
 *
 *    @example
 *    var virtuallistview = ns.engine.instanceWidget(document.getElementById('virtuallistview'), 'VirtualListview');
 *
 * If jQuery library is loaded, its method can be used:
 *
 *    @example
 *    var virtuallistview = $('#virtuallistview').virtuallistview();
 *
 * **NOTE:** after construct of widget should be create method called with proper parameters.
 *
 *
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @author Mateusz Ciepliński <m.cieplinski@samsung.com> [add jQuery template functionality]
 * @author Piotr Karny <p.karny@samsung.com>
 * @class ns.widget.mobile.VirtualListview
 * @extends ns.widget.mobile.Listview
 */

/**
 * CSS MODIFICATION
 * creating this widget we modified CSS file.
 *
 * CHANGED:
 * .ui-virtual-list-container { position:relative; }
 *
 */

(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/utils/selectors",
			"../../../../core/utils/DOM/css",
			"../../../../core/event",
			"../../../../core/theme",
			"../mobile", // fetch namespace
			"./Scrollview",
			"./Listview",
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {ns.widget.mobile.Listview} Listview alias variable
			 * @private
			 * @static
			 */
			var Listview = ns.widget.mobile.Listview,
				/**
				 * @property {ns.engine} engine alias variable
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {ns.utils.selectors} utilsSelectors alias variable
				 * @private
				 * @static
				 */
				utilsSelectors = ns.utils.selectors,
				/**
				 * @property {ns.theme} themes alias variable
				 * @private
				 * @static
				 */
				themes = ns.theme,
				/**
				 * @property {ns.widget.mobile.Listview} listviewPrototype
				 * @private
				 */
				parentPrototype = Listview.prototype,
				/**
				 * Shortcut for parent's `{@link ns.widget.mobile.Listview#_build} ns.widget.mobile.Listview._build`
				 * method from `{@link ns.widget.mobile.Listview} ns.widget.mobile.Listview.prototype`
				 * @method
				 * @private
				 * @static
				 */
				parent_build = parentPrototype._build,

				// Constants definition
				/**
				 * @property {number} SCROLL_UP defines index of scroll `{@link ns.widget.mobile.VirtualListview._scroll#direction}.direction`
				 * to retrive if user is scrolling up
				 * @private
				 * @static
				 */
				SCROLL_UP = 0,
				/**
				 * @property {number} SCROLL_RIGHT defines index of scroll {@link ns.widget.mobile.VirtualListview._scroll#direction _scroll.direction}.direction
				 * to retrive if user is scrolling right
				 * @private
				 * @static
				 */
				SCROLL_RIGHT = 1,
				/**
				 * @property {number} SCROLL_DOWN defines index of scroll {@link ns.widget.mobile.VirtualListview._scroll#direction _scroll.direction}
				 * to retrive if user is scrolling down
				 * @private
				 * @static
				 */
				SCROLL_DOWN = 2,
				/**
				 * @property {number} SCROLL_LEFT defines index of scroll {@link ns.widget.mobile.VirtualListview._scroll#direction _scroll.direction}
				 * to retrive if user is scrolling left
				 * @private
				 * @static
				 */
				SCROLL_LEFT = 3,
				/**
				 * @property {string} VERTICAL Defines vertical scrolling direction. It's default direction.
				 * @private
				 * @static
				 */
				VERTICAL = "y",
				/**
				 * @property {string} HORIZONTAL Defines horizontal scrolling direction.
				 * @private
				 * @static
				 */
				HORIZONTAL = "x",
				/**
				 * @property {boolean} blockEvent Determines that scroll event should not be taken into account if scroll event accurs.
				 * @private
				 * @static
				 */
				blockEvent = false,
				/**
				 * Local constructor function
				 * @method VirtualListview
				 * @private
				 * @member ns.widget.mobile.VirtualListview
				 */
				VirtualListview = function () {
					return this;
				},
				prototype = new Listview(),
				classes = {
					CONTAINER: "ui-virtual-list-container"
				};


			VirtualListview.prototype = prototype;

			/**
			 * @property {Object} classes Dictionary object containing commonly used wiget classes
			 * @static
			 * @member ns.widget.mobile.VirtualListview
			 */
			VirtualListview.classes = classes;

			prototype._configure = function () {
				var self = this;

				// Call parent _configure
				parentPrototype._configure.apply(self, arguments);

				/**
				 * @property {Object} ui VirtualListview widget's properties associated with
				 * User Interface
				 * @property {?HTMLElement} [ui.scrollview=null] Reference to associated
				 * {@link ns.widget.mobile.Scrollview Scrollview widget}
				 * @property {number} [ui.itemSize=0] Size of list element in piksels. If scrolling is
				 * vertically it's item width in other case it's height of item element
				 * @member ns.widget.mobile.VirtualListview
				 */
				self.ui = {
					scrollview: null,
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
				 * @member ns.widget.mobile.VirtualListview
				 */
				self._scroll = {
					direction: [0, 0, 0, 0],
					lastPositionX: 0,
					lastPositionY: 0,
					lastJumpX: 0,
					lastJumpY: 0,
					//@TODO: what if there is another element in scroll view? what size of clip should be?
					clipWidth: 0,
					clipHeight: 0
				};

				/**
				 * @property {number} _currentIndex Current zero-based index of data set.
				 * @member ns.widget.mobile.VirtualListview
				 */
				self._currentIndex = 0;

				/**
				 * Method which returns list item value at specified index from database.
				 * **Method should overrided by developer using {@link ns.widget.mobile.VirtualListview#create .create} method.**
				 * @method
				 * @param {number} idx Index of data set.
				 * @return {Object}
				 * @member ns.widget.mobile.VirtualListview
				 */
				self.itemData = function () {
					return null;
				};

				/**
				 * @property {Object} options VirtualListview widget options.
				 * @property {?Object} [options.template=null] Widget template engine.
				 * @property {?string} [options.theme=null] Widget theme
				 * value is used when .theme option isn't on element itself and on it's parents.
				 * @property {number} [options.row=100] Number of items of result set. The minimum
				 * value is 20 and the default value is 100. As the value gets higher, the loading
				 * time increases while the system performance improves. So you need to pick a value
				 * that provides the best performance without excessive loading time.
				 * @property {number} [options.numItemData=0] Total number of items.
				 * @property {boolean} [options.standalone=false] If true scrollview instance will be created inside of the widget
				 */
				self.options = {
					template: null,
					theme: null,
					direction: VERTICAL,
					row: 50,
					numItemData: 0,
					standalone: false
				};

				//Event function handler
				self._scrollEventBound = null;
			};

			//@TODO: Maybe this information should by provided by Scrollview
			/**
			 * Updates scroll information about position, direction and jump size.
			 * @method _updateScrollInfo
			 * @private
			 */
			prototype._updateScrollInfo = function () {
				var self = this,
					scrollInfo = self._scroll,
					scrollDirection,
					scrollViewElement = self.ui.scrollview.element,
					scrollLastPositionX = scrollInfo.lastPositionX,
					scrollLastPositionY = scrollInfo.lastPositionY,
					// Fetch current scroll position
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
				if (scrollviewPosX > scrollLastPositionX) {
					scrollDirection[SCROLL_RIGHT] = 1;
				}

				//Scrolling DOWN
				if (scrollviewPosY > scrollLastPositionY) {
					scrollDirection[SCROLL_DOWN] = 1;
				}

				//Scrolling LEFT
				if (scrollviewPosX < scrollLastPositionX) {
					scrollDirection[SCROLL_LEFT] = 1;
				}

				scrollInfo.lastJumpY = Math.abs(scrollviewPosY - scrollLastPositionY);
				scrollInfo.lastJumpX = Math.abs(scrollviewPosX - scrollLastPositionX);
				scrollInfo.lastPositionX = scrollviewPosX;
				scrollInfo.lastPositionY = scrollviewPosY;
				scrollInfo.direction = scrollDirection;
				scrollInfo.clipHeight = scrollViewElement.clientHeight;
				scrollInfo.clipWidth = scrollViewElement.clientWidth;
			};

			/**
			 * Orders elements. Controls resultset visibility and does DOM manipulation.
			 * @method _orderElements
			 * @param {ns.widget.mobile.VirtualListview} self VirtualListview widget reference
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
					bufferSize = parseInt(options.row, 10),
					//Total number of items
					dataLength = options.numItemData,
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
					elementsLeftToLoad = 0,
					temporaryElement = null,
					avgListItemSize,
					resultsetSize,
					i,
					jump = 0,
					hiddenPart = 0,
					newPosition;

				resultsetSize = self._computeResultsetSize();
				avgListItemSize = self._computeAvgSize(resultsetSize);

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
					hiddenPart = (elementPositionLeft + resultsetSize) - (scrollLastPositionX + scrollClipWidth);
					elementsLeftToLoad = currentIndex;
				}

				//manipulate DOM only, when at least 2/3 of result set is hidden
				//NOTE: Result Set should be at least 3x bigger then clip size
				if (hiddenPart > 0 && (resultsetSize / hiddenPart) <= 1.5) {

					//Left half of hidden elements still hidden/cached
					elementsToLoad = Math.floor(hiddenPart / avgListItemSize) - Math.floor((bufferSize - scrollClipHeight / avgListItemSize) / 2);
					elementsToLoad = elementsLeftToLoad < elementsToLoad ? elementsLeftToLoad : elementsToLoad;

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
							if (scrolledVertically) {
								jump += temporaryElement.offsetHeight;
							} else {
								jump += temporaryElement.offsetWidth;
							}
						}

						if (scrollDirection[SCROLL_UP] || scrollDirection[SCROLL_LEFT]) {
							temporaryElement = element.insertBefore(element.lastElementChild, element.firstElementChild);
							--currentIndex;

							//Updates list item using template
							self._updateListItem(temporaryElement, currentIndex);
							if (scrolledVertically) {
								jump -= temporaryElement.offsetHeight;
							} else {
								jump -= temporaryElement.offsetWidth;
							}
						}
					}
					if (scrolledVertically) {
						newPosition = elementPositionTop + jump;

						if (newPosition < 0 || currentIndex <= 0) {
							newPosition = 0;
							currentIndex = 0;
						}

						elementStyle.top = newPosition + "px";
					}

					if (scrolledHorizontally) {
						newPosition = elementPositionLeft + jump;

						if (newPosition < 0 || currentIndex <= 0) {
							newPosition = 0;
							currentIndex = 0;
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
			 * @method _updateListItem
			 * Updates list item using user defined listItemUpdater function.
			 * @param {HTMLElement} element List element to update
			 * @param {number} index Data row index
			 * @protected
			 */
			prototype._updateListItem = function (element, index) {
				var self = this,
					itemData = self.itemData,
					$jqTmpl = self.ui.$jqTmpl,
					templateElement;

				if(typeof self.options.listItemUpdater === "function") {
					self.options.listItemUpdater(element, index);
				} else {
					//@TODO THIS IS A JQUERY INCLUSION IN A TAU WIDGET!!!
					//@TODO FIX THIS!!!
					templateElement = $.tmpl($jqTmpl, itemData(index))[0];
					element.innerHTML = templateElement.innerHTML;
					if (templateElement.className) {
						//@TODO move this to utils
						window.DOMTokenList.prototype.add.apply(element.classList, templateElement.className.split(" "));
					}
					engine.createWidgets(element);
				}
			};

			/**
			 * Build widget structure
			 * @method _build
			 * @protected
			 * @param {string} template
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 */
			VirtualListview.prototype._build = function (element) {
				var self = this,
					options = self.options,
					elementStyle = element.style,
					styleHeight = elementStyle.height,
					styleWidth = elementStyle.width,
					standaloneContainer;

				// Check if standalone must be forced
				// this is not placed inside _configure method because it could be overriden by a data- attribute
				// @TODO other properties could potentially work in this way too
				if (styleHeight !== "" && styleHeight !== "auto" && styleWidth !== "" && styleWidth !== "auto") {
					options.standalone = true;
				}

				// Prepare a parent container for VirtualList
				if (options.standalone) {
					standaloneContainer = document.createElement('div');

					// Standalone container must match sizes designed by developer
					standaloneContainer.style.width = styleWidth || "100%";
					standaloneContainer.style.height = styleHeight || "100%";

					// Remove style values
					// @TODO reassign those values on destroy
					elementStyle.height = "";
					elementStyle.width = "";

					// Add scrollview to content element
					// we must add it before creating instance because some operations inside build method
					// require presence inside DOM
					element.parentElement.appendChild(standaloneContainer);

					// Create a widget instance of it
					self.ui.scrollview = engine.instanceWidget(standaloneContainer, "Scrollview", {
						scroll: options.direction
					});

					// After creating scrollview widget apeend list as a child
					self.ui.scrollview.ui.view.appendChild(element);
				}

				//Call parent's method
				parent_build.call(self, element);

				options.theme = themes.getInheritedTheme(element) || options.theme;
				element.classList.add(classes.CONTAINER);

				//Prepare element
				elementStyle.position = "relative";

				return element;
			};

			/**
			 * Check if scrolling position is changed and updates list if it needed.
			 * @method _updateList
			 * @param {ns.widget.mobile.VirtualListview} self VirtualListview widget reference
			 * @member ns.widget.mobile.VirtualListview
			 * @private
			 * @static
			 */
			function _updateList(self) {
				var _scroll = self._scroll;

				self._updateScrollInfo();

				if (_scroll.lastJumpY > 0 || _scroll.lastJumpX > 0) {
					if (!blockEvent) {
						_orderElements(self);
					}
				}
			}

			/**
			 * Configures list. Sets data source and iterator behavior.
			 * @method _configureList
			 * @protected
			 * @param {Object} argumentsArray
			 * @member ns.widget.mobile.VirtualListview
			 */
			prototype._configureList = function (argumentsArray) {
				var self = this,
					options = self.options,
					args = argumentsArray[0];

				if (typeof args.itemData === "function" && (typeof args.numItemData === "function" || typeof args.numItemData === "number")) {
					if (typeof args.numItemData === "function") {
						options.numItemData = args.numItemData();
					} else {
						options.numItemData = args.numItemData <= 0 ? 0 : args.numItemData;
					}
					self.itemData = args.itemData;
				}

				// @TODO set minimum set size depending on current screen size
				options.row = Math.max(20, options.row);

				self._buildList();

				//Update scroll info: scroll position etc...
				self._updateScrollInfo();
			};

			/**
			 * Sums current element set size depending on direction
			 * @return {number} current loaded set of elements size
			 * @protected
			 */
			prototype._computeResultsetSize = function () {
				var self = this,
					resultsetSize = 0,
					currentDirection = self.options.direction,
					childrenNodes = self.element.children,
					i;

				// Go through children and fetch their sizes
				for (i = childrenNodes.length - 1; i >= 0; i -= 1) {
					if (currentDirection === VERTICAL) {
						resultsetSize += childrenNodes[i].offsetHeight;
					} else {
						resultsetSize += childrenNodes[i].offsetWidth;
					}
				}

				return resultsetSize;
			};


			/**
			 * Calculates current set size depending on currently loaded elements
			 * @method _computeAvgSize
			 * @param {number} [resultsetSize] result size may be passed for saving computations
			 * @protected
			 * @return {number} Average size of result elements
			 */
			prototype._computeAvgSize = function (resultsetSize) {
				var self = this,
					size = resultsetSize || self._computeResultsetSize(),
					avgSize = Math.ceil(size / self.options.row);

				self._avgListItemSize = avgSize;

				return avgSize;
			};

			/**
			 * Initialize list on an element
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.VirtualListview
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self.ui,
					options = self.options,
					direction,
					scrollviewInstance;

				// scrollview may be set while widget is created with standalone option
				if (!ui.scrollview) {
					//Get Scrollview widget instance
					// @TODO make this asynchrous, it's currently possible that a child widget will be built before scrollview (for example VirtualGrid)
					// @TODO this will fail also if data-scroll is set to none on target scrollable element
					scrollviewInstance = engine.getBinding(utilsSelectors.getClosestByClass(element, 'ui-scrollview-clip'));
					ui.scrollview = scrollviewInstance;
				} else {
					scrollviewInstance = ui.scrollview;
				}

				//@TODO JQUERY!
				ui.$jqTmpl = $(document.getElementById(self.options.template));

				options.row = parseInt(options.row, 10);

				//Set direction, default vertical scrolling is allowed
				direction = (options.direction.toLowerCase() === HORIZONTAL) ? HORIZONTAL : VERTICAL;
				options.direction = direction;

				// Prepare view
				if (options.direction === HORIZONTAL) {
					scrollviewInstance.ui.view.style.height = "100%";
				}
			};

			/**
			 * Builds list items
			 * @method _buildList
			 * @protected
			 * @member ns.widget.mobile.VirtualListview
			 */
			prototype._buildList = function () {
				var self = this,
					listItem,
					list = self.element,
					childElementType = (list.tagName === "UL" || list.tagName === "OL") ? "li" : "div",
					numberOfItems = self.options.row,
					documentFragment = document.createDocumentFragment(),
					direction = self.options.direction,
					i;

				for (i = 0; i < numberOfItems; ++i) {
					listItem = document.createElement(childElementType);

					if (direction === HORIZONTAL) {
						// TODO: check if whiteSpace: nowrap is better for vertical listes
						// NOTE: after rebuild this condition check possible duplication from _init method
						listItem.style.float = 'left';
					}

					self._updateListItem(listItem, i);
					documentFragment.appendChild(listItem);
				}

				list.appendChild(documentFragment);
				self._refresh();
			};

			/**
			 * Refresh list
			 * @method _refresh
			 * @member ns.widget.mobile.VirtualListview
			 * @protected
			 * @instance
			 */
			prototype._refresh = function (create) {
				//Set default value of variable create
				create = create === undefined ? false : create;
				//Set default value of variable create
				this._refreshItems(this.element, create);
				this._refreshScrollbar();
			};

			/**
			 * Loads data from specefied index to result set size.
			 * @method _loadData
			 * @protected
			 * @param {number} index Index of first row
			 * @member ns.widget.mobile.VirtualListview
			 */
			prototype._loadData = function (index) {
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
			 * @protected
			 * @member ns.widget.mobile.VirtualListview
			 */
			prototype._refreshScrollbar = function () {
				var self = this,
					options = self.options,
					newViewSize = self._computeAvgSize() * options.numItemData,
					scrollviewInstance = self.ui.scrollview,
					// Get scrollview view element (child)
					// @TODO remove fetching first child after createing ui.view property inside Scrollview widget
					scrollviewView = (scrollviewInstance.ui && scrollviewInstance.ui.view) || scrollviewInstance.element.firstElementChild;

				if (options.direction === VERTICAL) {
					scrollviewView.style.height = newViewSize + "px";
				} else {
					scrollviewView.style.width = newViewSize + "px";
				}
			};

			/**
			 * Binds VirtualListview events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.VirtualListview
			 */
			prototype._bindEvents = function () {
				var self = this,
					scrollEventBound = _updateList.bind(null, self),
					scrollviewClip = self.ui.scrollview && self.ui.scrollview.element;

				if (scrollviewClip) {
					scrollviewClip.addEventListener("scroll", scrollEventBound, false);
					self._scrollEventBound = scrollEventBound;
				}
			};

			/**
			 * Cleans widget's resources
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.VirtualListview
			 */
			prototype._destroy = function () {
				var self = this,
					scrollview = self.ui.scrollview,
					scrollviewClip = scrollview.element,
					scrollviewParent = scrollviewClip.parentElement,
					element = self.element,
					elementStyle = element.style,
					listItem;

				// Restore start position
				elementStyle.position = "static";
				if (self.options.direction === VERTICAL) {
					elementStyle.top = "";
				} else {
					elementStyle.left = "";
				}

				if (scrollviewClip) {
					scrollviewClip.removeEventListener("scroll", self._scrollEventBound, false);
				}

				// In case we have a standalone version move element to parent of scrollview
				// call destroy and remove it from DOM
				if (self.options.standalone) {
					scrollviewParent.appendChild(self.element);
					scrollview.destroy();

					scrollviewParent.removeChild(scrollviewClip);

					self.ui.scrollview = null;
				}

				//Remove li elements.
				// @TODO innerHTML = "" could be faster
				while (element.firstElementChild) {
					listItem = element.firstElementChild;
					element.removeChild(listItem);
				}
			};

			/**
			 * Sets iterator function and total number of data based on users arguments.
			 * @method create
			 * @protected
			 * @member ns.widget.mobile.VirtualListview
			 */
			prototype.create = function () {
				this._configureList(arguments);
			};

			// definition
			ns.widget.mobile.VirtualListview = VirtualListview;

			engine.defineWidget(
				"VirtualListview",
				"[data-role='virtuallistview'],[data-role='virtuallist'], .ui-virtuallistview",
				["create"],
				VirtualListview,
				'tizen'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.VirtualListview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));

