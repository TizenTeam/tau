/*global window, define */
/*jslint nomen: true, plusplus: true */
/**
  * Fastscroll is a scrollview controller. It binds scrollview to a list of short cuts.
  * Short cuts list based on scrollview dividers list. Clicking on a shortcut immediately jumps
  * the scrollview to the selected divider. Same action is on mouse movements.
  *
  * To apply, add attribute data-fastscroll="true" to a listview (<ul\> or <ol\> inside page).
  * Alternatively you can call fastscroll() or ns.engine.instanceWidget(list, 'Fastscroll') on list element.
  *
  * If a listview has no dividers or a single divider the widget won't display.
  *
  *
  *	@example
  *	var fastscroll = ns.engine.instanceWidget(document.getElementById('list'), 'Fastscroll');
  *
  *	@example
  *	var fastscroll = $('#list').fastscroll();
  *
  *	@example
  *	<ul data-role="listview" data-fastscroll="true">
  *		<li data-role="list-divider">A</li>
  *		<li>Anton</li>
  *		<li>Arabella</li>
  *		<li data-role="list-divider">B</li>
  *		<li>Barry</li>
  *		<li>Bily</li>
  *	</ul>
  *
  *
  * @class ns.widget.mobile.Listview.Fastscroll
  * @extends ns.widget.mobile.Listview
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../theme",
			"../../widget",
			"../../utils/DOM/attributes",
                        "../../utils/DOM/manipulation",
                        "../../utils/DOM/css",
			"./Tabbar",
			"./Page",
			'./Listview',
			"../../utils/selectors",
			"../../utils/events"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			* @property {Object} selectors Alias to ns.utils.selectors
			* @member ns.widget.mobile.Listview.Fastscroll
			* @private
			* @static
			*/
			var selectors = ns.utils.selectors,

				/**
				*
				* @property {Object} listviewClasses Alias for object ns.widget.mobile.Listview.classes
				* @member ns.widget.mobile.Listview.Fastscroll
				* @static
				* @private
				* @property {string} uiFastscroll Main calss of fascscroll view
				* @property {string} uiFastscrollTarget Class of fascroll target (listview)
				* @property {string} uiFastscrollPopup Class of fastscroll popup
				* @property {string} uiScrollbar Class of scrollbar
				* @property {string} uiFastscrollHover Class of fastscroll item with fover
				* @property {string} uiFastscrollHoverFirstItem Class of first item in fastscroll with fover
				* @property {string} uiFastscrollHoverDown Class of presed fastscroll item with fover
				*/
				listviewClasses,
				/**
				* @property {Function} Tabbar Alias for class ns.widget.mobile.Tabbar
				* @member ns.widget.mobile.Listview.Fastscroll
				* @static
				* @private
				*/
				Tabbar = ns.widget.mobile.Tabbar,
				/**
				* @property {Object} engine Alias for class {@link ns.engine}
				* @member ns.widget.mobile.Listview.Fastscroll
				* @private
				* @static
				*/
				engine = ns.engine,
				/**
				* @property {Object} events alias variable
				* @member ns.widget.mobile.Listview.Fastscroll
				* @static
				* @private
				*/
				events = ns.utils.events,
				/**
				* @property {Function} Page Alias for class ns.widget.mobile.Page
				* @member ns.widget.mobile.Listview.Fastscroll
				* @static
				* @private
				*/
				Page = ns.widget.mobile.Page,
				/**
				* @property {Object} DOMUtils Alias to ns.utils.DOM
				* @private
				* @member ns.widget.mobile.Scrollview
				* @static
				*/
				DOMUtils = ns.utils.DOM,
				/**
				* @property {Function} Listview Alias for class ns.widget.mobile.Listview
				* @member ns.widget.mobile.Listview.Fastscroll
				* @static
				* @private
				*/
				Listview = ns.widget.mobile.Listview,

				/**
				* Backup of _build methods for replacing it
				* @method parent_build
				* @member ns.widget.mobile.Listview.Fastscroll
				* @private
				*/
				parent_build = Listview.prototype._build,

				/**
				* Backup of _configure methods for replacing it
				* @method parent_configure
				* @member ns.widget.mobile.Listview.Fastscroll
				* @private
				*/
				parent_configure = Listview.prototype._configure,

				/**
				* Backup of _init methods for replacing it
				* @method parent_init
				* @member ns.widget.mobile.Listview.Fastscroll
				* @private
				*/
				parent_init = Listview.prototype._init,

				/**
				* Backup of _bindEvents methods for replacing it
				* @method parent_bindEvents
				* @member ns.widget.mobile.Listview.Fastscroll
				* @private
				*/
				parent_bindEvents = Listview.prototype._bindEvents,

				/**
				* Backup of _destroy methods for replacing it
				* @method parent_destroy
				* @member ns.widget.mobile.Listview.Fastscroll
				* @private
				*/
				parent_destroy = Listview.prototype._destroy,

				/**
				* Backup of _refresh methods for replacing it
				* @method parent_refresh
				* @member ns.widget.mobile.Listview.Fastscroll
				* @private
				*/
				parent_refresh = Listview.prototype._refresh;

			/**
			* Cout what is max height of short cut on fastscroll list
			* @method getMaxFastscrollItemHeight
			* @param {ns.widget.mobile.Listview.Fastscroll} self
			* @param {HTMLElement} item
			* @param {number} itemsCount
			* @param {number} containerHeight
			* @returns {number}
			* @private
			* @static
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			function getMaxFastscrollItemHeight(self, item, itemsCount, containerHeight) {
				var style = window.getComputedStyle(item, null),
					marginHeight = self.marginHeight || parseInt(style.marginBottom.replace(/[^\d\.]/g, ''), 10),
					itemHeight = Math.floor(containerHeight / itemsCount);

				marginHeight = self.marginHeight || marginHeight + 2 * parseInt(style.borderBottomWidth.replace(/[^\d\.]/g, ''), 10);

				self.marginHeight = marginHeight;
				itemHeight -= marginHeight;

				return itemHeight;
			}

			/**
			* Match char to divider
			* @method matchToDivider
			* @param {HTMLElement} divider
			* @param {string} indexChar
			* @param {Array} map
			* @private
			* @static
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			function matchToDivider(divider, indexChar, map) {
				if (indexChar === divider.innerText) {
					map[indexChar] = divider;
				}
			}

			/**
			* Creates character set for divider
			* @method makeCharacterSet
			* @param {HTMLElement} divider
			* @param {string} primaryCharacterSet
			* @returns {string}
			* @private
			* @static
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			function makeCharacterSet(divider, primaryCharacterSet) {
				return primaryCharacterSet + divider.innerText;
			}

			/**
			* Function called whane pageshow event on fastscroll parent is called
			* @method onPageshow
			* @param {ns.widget.mobile.Listview.Fastscroll} self
			* @param {Event} event
			* @private
			* @static
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			function onPageshow(self, event) {
				event.target.removeEventListener('pageshow', self._onPageshowBound);
				self._refresh();
			}

			/**
			* Function called on focus out on fast scroll item
			* @method onShortcutsListMouseOut
			* @param {ns.widget.mobile.Listview.Fastscroll} self
			* @private
			* @static
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			function onShortcutsListMouseOut(self) {
				var items,
					itemsLength,
					i,
					ui = self._ui;

				ui._popup.style.display = "none";

				items = document.getElementsByClassName(listviewClasses.uiFastscrollHover);
				itemsLength = items.length;
				for (i = 0; i < itemsLength; i++) {
					items[0].classList.remove(listviewClasses.uiFastscrollHover);
				}

				items = document.getElementsByClassName(listviewClasses.uiFastscrollHoverDown);
				itemsLength = items.length;
				for (i = 0; i < itemsLength; i++) {
					items[i].classList.remove(listviewClasses.uiFastscrollHoverDown);
				}

				items = document.getElementsByClassName(listviewClasses.uiFastscrollHoverFirstItem);
				itemsLength = items.length;
				for (i = 0; i < itemsLength; i++) {
					items[i].classList.remove(listviewClasses.uiFastscrollHoverFirstItem);
				}

				ui._shortcutsContainer.classList.remove(listviewClasses.uiFastscrollHover);
			}

			/**
			* Function called on focus in on fast scroll item
			* @method onShortcutsListMouseOver
			* @param {ns.widget.mobile.Listview.Fastscroll} self
			* @param {Event} event
			* @private
			* @static
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			function onShortcutsListMouseOver(self, event) {
				var coords = {
						x: event.pageX,
						y: event.pageY
					},
					ui = self._ui,
					shortcutsList = ui._shortcutsList,
					shortcutsListOffset = {
						left: shortcutsList.offsetLeft,
						top: shortcutsList.offsetTop
					},
					target = event.target,
					shortcutsListItems,
					shortcutsListItemsLength,
					i,
					j,
					left,
					top,
					right,
					bottom,
					unit,
					baseTop,
					baseBottom,
					omitSet,
					listItem,
					omitSetLength,
					tagName = target.tagName.toLowerCase();

				ui._shortcutsContainer.classList.add(listviewClasses.uiFastscrollHover);

				// If the element is a list item, get coordinates relative to the shortcuts list
				if (tagName === "li") {
					coords.x += target.offsetLeft - shortcutsListOffset.left;
					coords.y += target.offsetTop  - shortcutsListOffset.top;
				}

				if (tagName === "span") {
					coords.x += target.parentElement.offsetLeft - shortcutsListOffset.left;
					coords.y += target.parentElement.offsetTop  - shortcutsListOffset.top;
				}

				shortcutsListItems = shortcutsList.getElementsByTagName('li');
				shortcutsListItemsLength = shortcutsListItems.length;
				for (i = 0; i < shortcutsListItemsLength; i++) {
					listItem = shortcutsListItems[i];
					listItem.classList.remove(listviewClasses.uiFastscrollHover);
					listItem.classList.remove(listviewClasses.uiFastscrollHoverDown);

					left = listItem.offsetLeft - shortcutsListOffset.left;
					top = listItem.offsetTop  - shortcutsListOffset.top;
					right = left + Math.abs(listItem.offsetWidth);
					bottom = top + Math.abs(listItem.offsetHeight);

					if (coords.x >= left && coords.x <= right && coords.y >= top && coords.y <= bottom) {
						if (listItem.innerText === ".") {
							omitSet = DOMUtils.getNSData(listItem, "omitSet");
							omitSetLength = omitSet.length;
							unit = (bottom - top) / omitSetLength;
							for (j = 0; j < omitSetLength; j++) {
								baseTop = top + (j * unit);
								baseBottom = baseTop + unit;
								if (coords.y >= baseTop && coords.y <= baseBottom) {
									self._hitOmitItem(listItem, omitSet.charAt(i));
								}
							}
						} else {
							self._hitItem(listItem);
						}
					}
				}

				event.preventDefault();
				event.stopPropagation();
			}

			/**
			* Refresh fastscroll list items - recout of fastscroll height, recout of fastscroll item height,
			* refresh short cuts list.
			*
			* @method refresh
			* @param {ns.widget.mobile.Listview.Fastscroll} self
			* @private
			* @static
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			function refresh(self) {
				var element = self.element,
					ui = self._ui,
					scrollViewClip = selectors.getClosestByClass(
						element,
						Tabbar.classes.uiScrollviewClip
					),
					contentHeight = DOMUtils.getElementHeight(scrollViewClip),
					primaryCharacterSet = null,
					secondCharacterSet = null,
					popup = ui._popup,
					shortcutsList = ui._shortcutsList,
					shapItem,
					shapItemSpan1,
					shapItemSpan2,
					omitIndex = 0,
					containerHeight,
					shortcutsItems,
					shortcutItem,
					shortcutsTop,
					maxNumOfItems,
					numOfItems,
					minHeight,
					omitInfo,
					dividers,
					listItems,
					emptySize,
					indexChar,
					lastIndex,
					seconds,
					i,
					listItemsLength,
					dividersLength,
					secondsLength,
					shortcutsItemsLength,
					styles,
					item,
					headers,
					shortcutsContainer,
					headersLength,
					dividerClass = ns.widget.mobile.Listdivider.classes.uiLiDivider,
					itemHeight,
					maxHeight,
					primaryCharacterSetLength;

				if ('function' === typeof parent_refresh) {
					parent_refresh.call(self);
				}
				if (true !== self.options.fastscroll) {
					return;
				}

				if (shortcutsList) {
					self._createDividerMap();
					DOMUtils.removeAllChildren(shortcutsList);

					dividers = element.getElementsByClassName(dividerClass);
					listItems = selectors.getChildrenBySelector(element, 'li:not(.' + dividerClass + ')');

					listItemsLength = listItems.length;

					shortcutsList.style.display = "block";
					ui._lastListItem = listItemsLength > 0 ? listItems[listItemsLength - 1] : null;

					shapItem = document.createElement('li');
					shapItem.setAttribute('aria-label', 'double to move Number list');
					shapItem.tabIndex = 0;
					shapItemSpan1 = document.createElement('span');
					shapItemSpan1.setAttribute('aria-hidden', 'true');
					shapItemSpan1.innerText = "#";
					shapItem.appendChild(shapItemSpan1);
					shapItemSpan2 = document.createElement('span');
					shapItemSpan2.setAttribute('aria-label', 'Number');
					shapItem.appendChild(shapItemSpan2);

					shortcutsList.appendChild(shapItem);
					self._focusItem(shapItem);

					dividersLength = dividers.length;

					if (primaryCharacterSet === null) {
						primaryCharacterSet = "";
						for (i = 0; i < dividersLength; i++) {
							primaryCharacterSet = makeCharacterSet(dividers[i], primaryCharacterSet);
						}
					}

					minHeight = shapItem.offsetHeight;
					maxNumOfItems = parseInt(contentHeight / minHeight - 1, 10);
					numOfItems = primaryCharacterSet.length;

					maxNumOfItems = secondCharacterSet ? maxNumOfItems - 2 : maxNumOfItems;

					if (maxNumOfItems < 3) {
						if (shapItem.parentElement) {
							shapItem.parentElement.removeChild(shapItem);
						}

						return;
					}

					omitInfo = self._omit(numOfItems, maxNumOfItems);

					for (i = 0, primaryCharacterSetLength = primaryCharacterSet.length; i < primaryCharacterSetLength; i++) {
						indexChar = primaryCharacterSet.charAt(i);
						shortcutItem = document.createElement('li');
						shortcutItem.setAttribute('aria-label', 'double to move ' + indexChar + ' list');
						shortcutItem.setAttribute('tabindex', 0);
						shortcutItem.innerText = indexChar;

						self._focusItem(shortcutItem);

						if (omitInfo && omitInfo[omitIndex] > 1) {
							shortcutItem = document.createElement('li');
							shortcutItem.innerText = '.';
							DOMUtils.setNSData(shortcutItem, 'omitSet', self._makeOmitSet(i, omitInfo[omitIndex], primaryCharacterSet));
							i += omitInfo[omitIndex] - 1;
						}

						shortcutsList.appendChild(shortcutItem);
						omitIndex++;
					}

					if (secondCharacterSet !== null) {
						lastIndex = secondCharacterSet.length - 1;
						seconds = [];

						seconds.push(secondCharacterSet.charAt(0));
						seconds.push(secondCharacterSet.charAt(lastIndex));

						for (i = 0, secondsLength = seconds.length; i < secondsLength; i++) {
							indexChar = seconds[i];
							shortcutItem = document.createElement('li');
							shortcutItem.tabIndex = 0;
							shortcutItem.setAttribute("aria-label", 'double to move ' + indexChar + ' list');
							shortcutItem.innerText = indexChar;

							self._focusItem(shortcutItem);
							shortcutsList.append(shortcutItem);
						}
					}

					shortcutsContainer = ui._shortcutsContainer;
					maxHeight = contentHeight - element.offsetTop;
					shortcutsContainer.style.maxHeight = maxHeight + "px";

					containerHeight = shortcutsContainer.offsetHeight;
					emptySize = contentHeight - containerHeight;
					shortcutsItems = shortcutsList.children;
					shortcutsItemsLength = shortcutsItems.length;
					shortcutsTop = (dividersLength > 0) ? dividers[0].offsetTop : 0;

					if (emptySize > 0) {
						if (shortcutsItemsLength > 0) {
							item = shortcutsItems[0];
							itemHeight = getMaxFastscrollItemHeight(self, item, shortcutsItemsLength, maxHeight);
						}
						for (i = 0; i < shortcutsItemsLength; i++) {
							item = shortcutsItems[i];
							styles = item.style;
							styles.height = itemHeight + 'px';
							styles.lineHeight =  styles.height;
						}
					}

					headers = shortcutsContainer.parentNode.getElementsByClassName(ns.widget.mobile.Tabbar.classes.uiHeader);

					for (i = 0, headersLength = headers.length; i < headersLength; i++) {
						shortcutsTop += headers[i].offsetHeight;
					}

					shortcutsTop += (maxHeight - shortcutsContainer.offsetHeight) / 2;

					ui._shortcutsContainer.style.top = shortcutsTop + 'px';

					popup.innerText = "M";
					popup.style.width = popup.offsetHeight + 'px';
					popup.style.marginLeft = -(popup.offsetWidth / 2);
					popup.style.marginTop = -(popup.offsetHeight / 2);
				}
			}

			/**
			* Function called on mouse down on short cut
			* @method onListItemVMouseDown
			* @param {ns.widget.mobile.Listview.Fastscroll} self
			* @param {Event} event
			* @private
			* @static
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			function onListItemVMouseDown(self, event) {
				self._ui._shortcutsList.setAttribute("aria-hidden", false);
				self._hitItem(event.target);
			}

			/**
			* Function called on mouse up on short cut
			* @method onListItemVMouseUp
			* @param {ns.widget.mobile.Listview.Fastscroll} self
			* @private
			* @static
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			function onListItemVMouseUp(self) {
				var i,
					length,
					elements,
					ui = self._ui;

				ui._shortcutsList.setAttribute("aria-hidden", true);
				ui._popup.style.display = "none";

				elements = document.getElementsByClassName(listviewClasses.uiFastscrollHover);
				length = elements.length;
				for (i = 0; i < length; i++) {
					elements[0].classList.remove(listviewClasses.uiFastscrollHover);
				}

				elements = document.getElementsByClassName(listviewClasses.uiFastscrollHoverFirstItem);
				length = elements.length;
				for (i = 0; i < length; i++) {
					elements[0].classList.remove(listviewClasses.uiFastscrollHoverFirstItem);
				}

				elements = document.getElementsByClassName(listviewClasses.uiFastscrollHoverDown);
				length = elements.length;
				for (i = 0; i < length; i++) {
					elements[0].classList.remove(listviewClasses.uiFastscrollHoverDown);
				}
			}

			Listview.classes = Listview.classes || {};

			listviewClasses = Listview.classes;
			listviewClasses.uiFastscroll = "ui-fastscroll";
			listviewClasses.uiFastscrollTarget = "ui-fastscroll-target";
			listviewClasses.uiFastscrollPopup = "ui-fastscroll-popup";
			listviewClasses.uiScrollbar = "ui-scrollbar";
			listviewClasses.uiFastscrollHover = "ui-fastscroll-hover";
			listviewClasses.uiFastscrollHoverFirstItem = "ui-fastscroll-hover-first-item";
			listviewClasses.uiFastscrollHoverDown = "ui-fastscroll-hover-down";

			/**
			* Prepare default configuration of fastscroll widget
			* @method _configure
			* @protected
			* @static
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._configure = function () {
				if (typeof parent_configure === 'function') {
					parent_configure.call(this);
				}

				/**
				* @property {Object} options Object with default options
				* @property {boolean} [options.fastscroll=true] Sets if fastscroll should be enabled.
				* @member ns.widget.mobile.Listview.Fastscroll
				* @instance
				*/
				this.options = this.options || {};
				this.options.fastscroll = false;
			};

			/**
			* Builds fasctroll
			* @method _build
			* @param {HTMLElement} element HTML element with fasctscroll enabled
			* @returns {HTMLElement}
			* @protected
			* @instance
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._build = function (element) {
				var scrollView,
					shortcutsContainer,
					shortcutsList,
					fastscrollPopup,
					lastListItem,
					elementChildrens,
					elementChildrensLength,
					scrollBars = [],
					i,
					ui,
					scrollviewParent,
					scrollBarsLength,
					id = this.id;

				parent_build.call(this, element);

				if (this.options.fastscroll === true) {
					//FIXME Why class uiScrollviewClip is in Tabbar not in Scrollview?
					scrollView = selectors.getClosestByClass(element, Tabbar.classes.uiScrollviewClip);
					if (scrollView) {
						shortcutsContainer = document.createElement("div");
						shortcutsContainer.classList.add(listviewClasses.uiFastscroll);
						shortcutsContainer.setAttribute("aria-label", "Fast scroll bar, double tap to fast scroll mode");
						shortcutsContainer.setAttribute('tabindex', 0);
						shortcutsContainer.setAttribute('id', id + '-shortcutscontainer');
						shortcutsContainer.style.maxHeight = scrollView.offsetHeight + "px";
	
						shortcutsList = document.createElement("ul");
						shortcutsList.setAttribute("aria-hidden", "true");
						shortcutsList.setAttribute('id', id + '-shortcutslist');
	
						fastscrollPopup = document.createElement("div");
						fastscrollPopup.classList.add(listviewClasses.uiFastscrollPopup);
						fastscrollPopup.setAttribute('id', id + '-fastscrollpopup');
	
						shortcutsContainer.appendChild(shortcutsList);
	
						scrollviewParent = scrollView.parentNode;
						scrollviewParent.appendChild(shortcutsContainer);
						scrollviewParent.appendChild(fastscrollPopup);
	
						elementChildrens = element.children;
						elementChildrensLength = elementChildrens.length;
	
						if (elementChildrensLength > 0) {
							lastListItem = elementChildrens[elementChildrensLength - 1];
						}
	
						scrollBars = scrollView.getElementsByClassName(listviewClasses.uiScrollbar);
						for (i = 0, scrollBarsLength = scrollBars.length; i < scrollBarsLength; i++) {
							scrollBars[i].style.display = "none";
						}
	
						this._ui = this._ui || {};
						ui = this._ui;
	
						ui._scrollView = scrollView;
						ui._shortcutsContainer = shortcutsContainer;
						ui._shortcutsList = shortcutsList;
						ui._lastListItem = lastListItem;
						ui._popup = fastscrollPopup;
					}
				}
				return element;
			};

			/**
			* Initialize fastscroll widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @instance
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._init = function (element) {
				var ui,
					elementChildrens,
					elementChildrensLength,
					id = this.id;
				if (typeof parent_init === 'function') {
					parent_init.call(this, element);
				}

				if (this.options.fastscroll) {
					this._ui = this._ui || {};
					ui = this._ui;
	
					ui._scrollView = selectors.getClosestByClass(element, Tabbar.classes.uiScrollviewClip);
					ui._shortcutsContainer = document.getElementById(id + '-shortcutscontainer');
					ui._shortcutsList = document.getElementById(id + '-shortcutslist');
					ui._popup = document.getElementById(id + '-fastscrollpopup');
	
					elementChildrens = element.children;
					elementChildrensLength = elementChildrens.length;
	
					if (elementChildrensLength > 0) {
						ui._lastListItem = elementChildrens[elementChildrensLength - 1];
					}
	
					element.classList.add(listviewClasses.uiFastscrollTarget);
				}
			};

			/**
			* Binds fastscroll widget events
			* @method _bindEvents
			* @param {HTMLElement} element
			* @protected
			* @instance
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._bindEvents = function (element) {
				var pageParent = selectors.getParentsByClass(element, Page.classes.uiPage)[0],
					shortcutsList = this._ui._shortcutsList;

				this._uiPageParent = pageParent;

				if (typeof parent_bindEvents === 'function') {
					parent_bindEvents.call(this, element);
				}

				if (this.options.fastscroll !== true) {
					return;
				}

				this._onPageshowBound = onPageshow.bind(null, this);
				this._onRefreshBound = refresh.bind(null, this);
				this._onShortcutsListMouseOverBound = onShortcutsListMouseOver.bind(null, this);
				this._onShortcutsListMouseOutBound = onShortcutsListMouseOut.bind(null, this);

				if (pageParent) {
					pageParent.addEventListener('pageshow', this._onPageshowBound, true);
				}

				element.addEventListener('updatelayout', this._onRefreshBound, false);
				window.addEventListener('resize', this._onRefreshBound, false);
				window.addEventListener('orientationchange', this._onRefreshBound, false);

				if (shortcutsList) {
					shortcutsList.addEventListener('vmousedown', this._onShortcutsListMouseOverBound, false);
					shortcutsList.addEventListener('vmousemove', this._onShortcutsListMouseOverBound, false);
					shortcutsList.addEventListener('vmouseover', this._onShortcutsListMouseOverBound, false);
	
					shortcutsList.addEventListener('vmouseup', this._onShortcutsListMouseOutBound, false);
					shortcutsList.addEventListener('vmouseout', this._onShortcutsListMouseOutBound, false);
				}
			};


			/**
			* Unbinds fastscroll widget events
			* @method _destroy
			* @protected
			* @instance
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._destroy = function () {
				var element = this.element,
					pageParent = this._uiPageParent,
					shortcutsList = this._ui._shortcutsList,
					shortcutsListItems,
					listItem,
					shortcutsListItemsLength,
					i;
				if (typeof parent_destroy === 'function') {
					parent_destroy.call(this);
				}

				if (pageParent) {
					pageParent.removeEventListener('pageshow', this._onPageshowBound);
				}

				element.removeEventListener('updatelayout', this._onRefreshBound);
				window.removeEventListener('resize', this._onRefreshBound);
				window.removeEventListener('orientationchange', this._onRefreshBound);

				if (shortcutsList) {
					shortcutsList.removeEventListener('vmousedown', this._onShortcutsListMouseOverBound);
					shortcutsList.removeEventListener('vmousemove', this._onShortcutsListMouseOverBound);
					shortcutsList.removeEventListener('vmouseover', this._onShortcutsListMouseOverBound);

					shortcutsList.removeEventListener('vmouseup', this._onShortcutsListMouseOutBound);
					shortcutsList.removeEventListener('vmouseout', this._onShortcutsListMouseOutBound);

					shortcutsListItems = shortcutsList.getElementsByTagName('li');

					for (i = 0, shortcutsListItemsLength = shortcutsListItems.length; i < shortcutsListItemsLength; i++) {
						listItem = shortcutsListItems[i];
						listItem.removeEventListener('vmousedown', this._onListItemVMouseDownBound);
						listItem.removeEventListener('vmouseup', this._onListItemVMouseUpBound);
					}
				}

				events.trigger(element, 'destroyed', {
					widget: "Fastscroll",
					parent: pageParent
				});
			};

			/**
			* Creates map of deviders
			* @method _createDividerMap
			* @protected
			* @instance
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._createDividerMap = function () {
				var primaryCharacterSet = null,
					secondCharacterSet = null,
					numberSet = "0123456789",
					dividers = this.element.getElementsByClassName(ns.widget.mobile.Listdivider.classes.uiLiDivider),
					map = {},
					indexChar,
					i,
					j,
					length,
					dividersLength = dividers.length;

				if (primaryCharacterSet === null) {
					primaryCharacterSet = "";
					for (i = 0; i < dividersLength; i++) {
						primaryCharacterSet = makeCharacterSet(dividers[i], primaryCharacterSet);
					}
				}

				for (i = 0, length = primaryCharacterSet.length; i < length; i++) {
					indexChar = primaryCharacterSet.charAt(i);
					for (j = 0; j < dividersLength; j++) {
						matchToDivider(dividers[j], indexChar, map);
					}
				}

				if (secondCharacterSet !== null) {
					for (i = 0, length = secondCharacterSet.length; i < length; i++) {
						indexChar = secondCharacterSet.charAt(i);
						for (j = 0; j < dividersLength; j++) {
							matchToDivider(dividers[j], indexChar, map);
						}
					}
				}

				for (i = 0; i < dividersLength; i++) {
					if (numberSet.search(dividers[i].innerText) !== -1) {
						map.number = dividers[i];
						break;
					}
				}

				this._dividerMap = map;
				this._charSet = primaryCharacterSet + secondCharacterSet;
			};

			/**
			* Finds closes divider
			* @method _findClosestDivider
			* @param {string} targetChar
			* @protected
			* @instance
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._findClosestDivider = function (targetChar) {
				var i,
					dividerMap = this._dividerMap,
					charSet = this._charSet,
					charSetLen = charSet.length,
					targetIdx = charSet.indexOf(targetChar),
					lastDivider,
					subDivider = null;

				for (i = 0; i < targetIdx; ++i) {
					lastDivider = dividerMap[charSet.charAt(i)];
					if (lastDivider !== undefined) {
						subDivider = lastDivider;
					}
				}
				if (!subDivider) {
					for (++i; i < charSetLen; ++i) {
						lastDivider = dividerMap[charSet.charAt(i)];
						if (lastDivider !== undefined) {
							subDivider = lastDivider;
							break;
						}
					}
				}
				return subDivider;
			};

			/**
			* Scroll listview to asked divider
			* @method jumpToDivider
			* @param {HTMLElement} divider
			* @protected
			* @instance
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype.jumpToDivider = function (divider) {
				var dividerY = divider.offsetTop,
					ui = this._ui,
					lastListItem = ui._lastListItem,
					bottomOffset = lastListItem.offsetHeight + lastListItem.offsetTop,
					scrollviewHeight = ui._scrollView.offsetHeight,
					maxScroll = bottomOffset - scrollviewHeight,
					scrollViewBinding = engine.getBinding(ui._scrollView);

				dividerY = (dividerY > maxScroll ? maxScroll : dividerY);

				dividerY = Math.max(dividerY, 0);

				scrollViewBinding.scrollTo(0, dividerY, scrollViewBinding.scrollDuration);
			};

			/**
			* On fastscroll item pressed
			* @method _hitItem
			* @param {HTMLElement} listItem
			* @protected
			* @instance
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._hitItem = function (listItem) {
				var popup = this._ui._popup,
					text = listItem.innerText,
					divider,
					listItemClassList = listItem.classList,
					nextElement = listItem.nextElementSibling,
					popupStyles = popup.style;


				if (text === "#") {
					divider = this._dividerMap.number;
				} else {
					divider = this._dividerMap[text] || this._findClosestDivider(text);
				}

				if (divider) {
					this.jumpToDivider(divider);
				}

				popup.innerText = text;
				popupStyles.display = "block";
				popupStyles.width = popup.offsetHeight + 'px';
				popupStyles.marginLeft = -(popup.offsetWidth / 2);
				popupStyles.marginTop = -(popup.offsetHeight / 2);

				listItemClassList.add(listviewClasses.uiFastscrollHover);
				if (listItem.previousElementSibling) {
					listItemClassList.add(listviewClasses.uiFastscrollHoverFirstItem);
				}
				if (nextElement) {
					nextElement.classList.add(listviewClasses.uiFastscrollHoverDown);
				}
			};

			/**
			* Add focus to shortcut item
			* @method _focusItem
			* @param {HTMLElement} listItem
			* @protected
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._focusItem = function (listItem) {
				this._onListItemVMouseDownBound = this._onListItemVMouseDownBound || onListItemVMouseDown.bind(null, this);
				this._onListItemVMouseUpBound = this._onListItemVMouseUpBound || onListItemVMouseUp.bind(null, this);
				listItem.addEventListener('vmouseover', this._onListItemVMouseDownBound, false);
				listItem.addEventListener('vmouseout', this._onListItemVMouseUpBound, false);
			};

			/**
			* If max number of items is greater then 3 returns array with cout of omited items.
			* @method _omit
			* @param {number} numOfItems
			* @param {number} maxNumOfItems
			* @returns {?Array}
			* @protected
			* @instance
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._omit = function (numOfItems, maxNumOfItems) {
				var maxGroupNum = parseInt((maxNumOfItems - 1) / 2, 10),
					numOfExtraItems = numOfItems - maxNumOfItems,
					groupPos = [],
					omitInfo = [],
					groupPosLength,
					group,
					size,
					i;

				if ((maxNumOfItems < 3) || (numOfItems <= maxNumOfItems)) {
					return null;
				}

				if (numOfExtraItems >= maxGroupNum) {
					size = 2;
					group = 1;
					groupPosLength = maxGroupNum;
				} else {
					size = maxNumOfItems / (numOfExtraItems + 1);
					group = size;
					groupPosLength = numOfExtraItems;
				}

				for (i = 0; i < groupPosLength; i++) {
					groupPos.push(parseInt(group, 10));
					group += size;
				}

				for (i = 0; i < maxNumOfItems; i++) {
					omitInfo.push(1);
				}

				for (i = 0; i < numOfExtraItems; i++) {
					omitInfo[groupPos[i % maxGroupNum]]++;
				}

				return omitInfo;
			};

			/**
			* Creates string containing omited elements. Omits items starting from index.
			* Max number of omited elemets is given as length parameter
			* @method _makeOmitSet
			* @param {number} index
			* @param {number} length
			* @param {string} primaryCharacterSet
			* @returns {string}
			* @protected
			* @member ns.widget.mobile.Listview.Fastscroll
			*/
			Listview.prototype._makeOmitSet = function (index, length, primaryCharacterSet) {
				var count,
					omitSet = "";

				for (count = 0; count < length; count++) {
					omitSet += primaryCharacterSet[index + count];
				}

				return omitSet;
			};

			/**
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.Listview.Fastscroll
			* @instance
			*/
			Listview.prototype._refresh = function () {
				this._onRefreshBound = this._onRefreshBound || refresh.bind(this);
				this._onRefreshBound();
			};

			/**
			* The indexString method is used to get (if no value is defined) or set the string to present the index.
			* @method indexString
			* @param {string} indexAlphabet
			* @member ns.widget.mobile.Listview.Fastscroll
			* @returns {?string}
			*/
			Listview.prototype.indexString = function (indexAlphabet) {
				var characterSet;

				if (undefined === indexAlphabet) {
					return this._primaryLanguage + ":" + this._secondLanguage;
				}

				characterSet = indexAlphabet.split(":");
				this._primaryLanguage = characterSet[0];
				if (2 === characterSet.length) {
					this._secondLanguage = characterSet[1];
				}
				return null;
			};

			// definition
			ns.widget.mobile.Fastscroll = Listview;
			engine.defineWidget(
				"Fastscroll",
				"[data-role='listview'][data-fastscroll='true'], .ui-fastscroll",
				["indexString"],
				Listview,
				'tizen'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return false;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
