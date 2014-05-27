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
/*jslint nomen: true, plusplus: true */
/**
 * # Fast Scroll Widget
 * The fast scroll widget shows a shortcut list that is bound to its parent scroll bar and respective list view.
 *
 * The fast scroll is a scroll view controller, which binds a scroll view to a list of shortcuts. It jumps the scroll view to the selected list divider. If you move the mouse on the shortcut column, the scroll view is moved to the list divider matching the text currently under the mouse cursor. A pop-up with the text currently under the cursor is also displayed. To use the fast scroll widget, add the data-fastscroll="true" attribute to a list view. You can also call the shortcutscroll() method on an element. The closest element of the ui-scrollview-clip class is used as the scroll view to be controlled.
 *
 * !!! For the fast scroll widget to be visible, the parent list view must have multiple list dividers.!!!
 *
 * ## Default selectors
 * In default all ListView elements with _data-fastscroll=true_ are changed to Tizen Web UI Fast Scroll.
 *
 * In default all ListView elements with class _.ui-fastscroll_ are changed to Tizen Web UI Fast Scroll
 *
 *		@example
 *		<div data-role="page" id="main">
 *			<div data-role="content">
 *				<ul data-role="listview" data-fastscroll="true">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Bily</li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * #### Create FastScroll widget using tau method:
 *
 *		@example
 *		<div data-role="page" id="main">
 *			<div data-role="content">
 *				<ul id="list" data-fastscroll="true">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Bily</li>
 *				</ul>
 *			</div>
 *		</div>
 *		<script>
 *			var fastscroll = tau.widget.FastScroll(document.getElementById("list"));
 *		</script>
 *
 * #### Create FastScroll widget using jQueryMobile notation:
 *
 *		@example
 *		<div data-role="page" id="main">
 *			<div data-role="content">
 *				<ul id="list" data-fastscroll="true">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Bily</li>
 *				</ul>
 *			</div>
 *		</div>
 *		<script>
 *			var fastscroll = $("#list").fastscroll();
 *		</script>
 *
 * ## Options
 *
 * ### Fastscroll
 * _data-fastscroll_ option set to true, creates a fast scroll using the HTML unordered list (&lt;ul&gt;) element.
 *
 *		@example
 *		<div data-role="page" id="main">
 *			<div data-role="content">
 *				<ul id="contacts" data-role="listview" data-fastscroll="true">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Bily</li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		<div data-role="page" id="main">
 *			<div data-role="content">
 *				<ul id="contacts">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Bily</li>
 *				</ul>
 *			</div>
 *		</div>
 *		<script>
 *			var element = document.getElementById("contacts"),
 *				contacts = tau.widget.FastScroll(element, {fastscroll: true});
 *
 *			contacts.methodName(methodArgument1, methodArgument2, ...);
 *
 *			// or JQueryMobile notation:
 *			$(element).contacts("methodName", methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * @class ns.widget.mobile.Listview.FastScroll
 * @extends ns.widget.mobile.Listview
 * @since 2.0
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/theme",
			"../../../../core/widget",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/manipulation",
			"../../../../core/util/DOM/css",
			"./Tabbar",
			"./Page",
			"./Listview",
			"../../../../core/event",
			"../../../../core/util/selectors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} selectors Alias to ns.util.selectors
			 * @member ns.widget.mobile.Listview.FastScroll
			 * @private
			 * @static
			 */
			var selectors = ns.util.selectors,

				/**
				 * @property {Function} Tabbar Alias for class ns.widget.mobile.Tabbar
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @static
				 * @private
				 */
				Tabbar = ns.widget.mobile.Tabbar,
				/**
				 * @property {Object} engine Alias for class {@link ns.engine}
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} events alias variable
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @static
				 * @private
				 */
				events = ns.event,
				/**
				 * @property {Function} Page Alias for class ns.widget.mobile.Page
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @static
				 * @private
				 */
				Page = ns.widget.mobile.Page,
				/**
				 * @property {Object} DOMUtils Alias to ns.util.DOM
				 * @private
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @static
				 */
				DOMUtils = ns.util.DOM,
				/**
				 * @property {Function} Listview Alias for class ns.widget.mobile.Listview
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @static
				 * @private
				 */
				Listview = ns.widget.mobile.Listview,

				/**
				 * Backup of _build methods for replacing it
				 * @method parent_build
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @private
				 */
				parent_build = Listview.prototype._build,

				/**
				 * Backup of _configure methods for replacing it
				 * @method parent_configure
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @private
				 */
				parent_configure = Listview.prototype._configure,

				/**
				 * Backup of _init methods for replacing it
				 * @method parent_init
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @private
				 */
				parent_init = Listview.prototype._init,

				/**
				 * Backup of _bindEvents methods for replacing it
				 * @method parent_bindEvents
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @private
				 */
				parent_bindEvents = Listview.prototype._bindEvents,

				/**
				 * Backup of _destroy methods for replacing it
				 * @method parent_destroy
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @private
				 */
				parent_destroy = Listview.prototype._destroy,

				/**
				 * Refresh FastScroll widget
				 *
				 * This method updates and redraws current widget.
				 *
				 *		@example
				 *		<div data-role="page" id="main">
				 *			<div data-role="content">
				 *				<ul id="list" data-role="listview" data-fastscroll="true">
				 *					<li data-role="list-divider">A</li>
				 *					<li>Anton</li>
				 *					<li>Arabella</li>
				 *					<li data-role="list-divider">B</li>
				 *					<li>Barry</li>
				 *					<li>Bily</li>
				 *				</ul>
				 *			</div>
				 *		</div>
				 *		<script>
				 *			var element = document.getElementById("list"),
				 *				fastscroll = tau.widget.FastScroll(element);
				 *
				 *			element.insertAdjacentHTML("afterend", "<li>Bruce</li>");
				 *			fastscroll.refresh();
				 *		</script>
				 *
				 * or JQueryMobile notation:
				 *
				 *		@example
				 *		<div data-role="page" id="main">
				 *			<div data-role="content">
				 *				<ul data-role="listview" data-fastscroll="true" id="fastscroll">
				 *					<li data-role="list-divider">A</li>
				 *					<li>Anton</li>
				 *					<li>Arabella</li>
				 *					<li data-role="list-divider">B</li>
				 *					<li>Barry</li>
				 *					<li>Bily</li>
				 *				</ul>
				 *			</div>
				 *		</div>
				 *		<script>
				 *			$("#list").append("<li>Bruno</li>");
				 *			$("#list").fastscroll("refresh");
				 *		</script>
				 *
				 * @method refresh
				 * @member ns.widget.mobile.Listview.FastScroll
				 */

				/**
				 * Backup of _refresh methods for replacing it
				 * @method parent_refresh
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @private
				 */
				parent_refresh = Listview.prototype._refresh,

				/**
				 * Alias for object ns.widget.mobile.Listview.classes
				 * @property {Object} listviewClasses
				 * @member ns.widget.mobile.Listview.FastScroll
				 * @static
				 * @private
				 * @property {string} listviewClasses.uiFastscroll
				 * Main calss of fascscroll view
				 * @property {string} listviewClasses.uiFastscrollTarget
				 * Class of fascroll target (listview)
				 * @property {string} listviewClasses.uiFastscrollPopup
				 * Class of fastscroll popup
				 * @property {string} listviewClasses.uiScrollbar
				 * Class of scrollbar
				 * @property {string} listviewClasses.uiFastscrollHover
				 * Class of fastscroll item with fover
				 * @property {string} listviewClasses.uiFastscrollHoverFirstItem
				 * Class of first item in fastscroll with fover
				 * @property {string} listviewClasses.uiFastscrollHoverDown
				 * Class of presed fastscroll item with fover
				 */
				listviewClasses = Listview.classes,

				/**
				 * FastScroll event types
				 * @property {Object} eventType
				 * @property {string} [eventType.DESTROYED="destroyed"]
				 * Event is triggering after _destroy method call.
				 * @static
				 * @readonly
				 * @member ns.widget.mobile.Listview.FastScroll
				 */
				eventType = Listview.eventType || {},

				/**
				 * Local cache of function type name
				 * @property {string} [TYPE_FUNCTION="function"]
				 * @private
				 * @static
				 * @member ns.widget.mobile.Listview.FastScroll
				 */
				TYPE_FUNCTION = "function";

			// the extension of Listview events dictionary
			/*
			 * Event is triggering after _destroy method call
			 * @event destroyed
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			eventType.DESTROYED = "destroyed";

			// the extension of Listview classes
			listviewClasses.uiFastscroll = "ui-fastscroll";
			listviewClasses.uiFastscrollTarget = "ui-fastscroll-target";
			listviewClasses.uiFastscrollPopup = "ui-fastscroll-popup";
			listviewClasses.uiScrollbar = "ui-scrollbar";
			listviewClasses.uiFastscrollHover = "ui-fastscroll-hover";
			listviewClasses.uiFastscrollHoverFirstItem = "ui-fastscroll-hover-first-item";
			listviewClasses.uiFastscrollHoverDown = "ui-fastscroll-hover-down";

			/**
			 * Count what is max height of short cut on fastscroll list
			 * @method getMaxFastscrollItemHeight
			 * @param {ns.widget.mobile.Listview.FastScroll} self
			 * @param {HTMLElement} item
			 * @param {number} itemsCount
			 * @param {number} containerHeight
			 * @return {number}
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			function getMaxFastscrollItemHeight(self, item, itemsCount, containerHeight) {
				var style = window.getComputedStyle(item, null),
					marginHeight = self.marginHeight || parseInt(style.marginBottom.replace(/[^\d\.]/g, ""), 10),
					itemHeight = Math.floor(containerHeight / itemsCount);

				marginHeight = self.marginHeight || marginHeight + 2 * parseInt(style.borderBottomWidth.replace(/[^\d\.]/g, ""), 10);

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
			 * @member ns.widget.mobile.Listview.FastScroll
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
			 * @return {string}
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			function makeCharacterSet(divider, primaryCharacterSet) {
				return primaryCharacterSet + divider.innerText;
			}

			/**
			 * Function called whane pageshow event on fastscroll parent is called
			 * @method onPageshow
			 * @param {ns.widget.mobile.Listview.FastScroll} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			function onPageshow(self, event) {
				event.target.removeEventListener("pageshow", self._onPageshowBound);
				self._refresh();
			}

			/**
			 * Function called on focus out on fast scroll item
			 * @method onShortcutsListMouseOut
			 * @param {ns.widget.mobile.Listview.FastScroll} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview.FastScroll
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
			 * @param {ns.widget.mobile.Listview.FastScroll} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview.FastScroll
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

				shortcutsListItems = shortcutsList.getElementsByTagName("li");
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
			 * Refresh fastscroll list items
			 *
			 * Recount of fastscroll height, recount of fastscroll item height,
			 * refresh short cuts list.
			 *
			 * @method fastscrollRefresh
			 * @param {ns.widget.mobile.Listview.FastScroll} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			function fastscrollRefresh(self) {
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
					dividerClass = ns.widget.mobile.ListDivider.classes.uiLiDivider,
					itemHeight,
					maxHeight,
					primaryCharacterSetLength;

				if (typeof parent_refresh === TYPE_FUNCTION) {
					parent_refresh.call(self);
				}
				if (true !== self.options.fastscroll) {
					return;
				}

				if (shortcutsList) {
					self._createDividerMap();
					DOMUtils.removeAllChildren(shortcutsList);

					dividers = element.getElementsByClassName(dividerClass);
					listItems = selectors.getChildrenBySelector(element, "li:not(." + dividerClass + ")");

					listItemsLength = listItems.length;

					shortcutsList.style.display = "block";
					ui._lastListItem = listItemsLength > 0 ? listItems[listItemsLength - 1] : null;

					shapItem = document.createElement("li");
					shapItem.setAttribute("aria-label", "double to move Number list");
					shapItem.tabIndex = 0;
					shapItemSpan1 = document.createElement("span");
					shapItemSpan1.setAttribute("aria-hidden", "true");
					shapItemSpan1.innerText = "#";
					shapItem.appendChild(shapItemSpan1);
					shapItemSpan2 = document.createElement("span");
					shapItemSpan2.setAttribute("aria-label", "Number");
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
						shortcutItem = document.createElement("li");
						shortcutItem.setAttribute("aria-label", "double to move " + indexChar + " list");
						shortcutItem.setAttribute("tabindex", 0);
						shortcutItem.innerText = indexChar;

						self._focusItem(shortcutItem);

						if (omitInfo && omitInfo[omitIndex] > 1) {
							shortcutItem = document.createElement("li");
							shortcutItem.innerText = ".";
							DOMUtils.setNSData(shortcutItem, "omitSet", self._makeOmitSet(i, omitInfo[omitIndex], primaryCharacterSet));
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
							shortcutItem = document.createElement("li");
							shortcutItem.tabIndex = 0;
							shortcutItem.setAttribute("aria-label", "double to move " + indexChar + " list");
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
							styles.height = itemHeight + "px";
							styles.lineHeight =  styles.height;
						}
					}

					headers = shortcutsContainer.parentNode.getElementsByClassName(ns.widget.mobile.Tabbar.classes.uiHeader);

					for (i = 0, headersLength = headers.length; i < headersLength; i++) {
						shortcutsTop += headers[i].offsetHeight;
					}

					shortcutsTop += (maxHeight - shortcutsContainer.offsetHeight) / 2;

					ui._shortcutsContainer.style.top = shortcutsTop + "px";

					popup.innerText = "M";
					popup.style.width = popup.offsetHeight + "px";
					popup.style.marginLeft = -(popup.offsetWidth / 2);
					popup.style.marginTop = -(popup.offsetHeight / 2);
				}
			}

			/**
			 * Function called on mouse down on short cut
			 * @method onListItemVMouseDown
			 * @param {ns.widget.mobile.Listview.FastScroll} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			function onListItemVMouseDown(self, event) {
				self._ui._shortcutsList.setAttribute("aria-hidden", false);
				self._hitItem(event.target);
			}

			/**
			 * Function called on mouse up on short cut
			 * @method onListItemVMouseUp
			 * @param {ns.widget.mobile.Listview.FastScroll} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.Listview.FastScroll
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

			/**
			 * Prepare default configuration of fastscroll widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			Listview.prototype._configure = function () {
				if (typeof parent_configure === TYPE_FUNCTION) {
					parent_configure.call(this);
				}

				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {boolean} [options.fastscroll=false] Sets if fastscroll should be enabled.
				 * @member ns.widget.mobile.Listview.FastScroll
				 */
				this.options = this.options || {};
				this.options.fastscroll = false;
			};

			/**
			 * Builds fasctroll
			 * @method _build
			 * @param {HTMLElement} element HTML element with fasctscroll enabled
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Listview.FastScroll
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
						shortcutsContainer.setAttribute("tabindex", 0);
						shortcutsContainer.setAttribute("id", id + "-shortcutscontainer");
						shortcutsContainer.style.maxHeight = scrollView.offsetHeight + "px";

						shortcutsList = document.createElement("ul");
						shortcutsList.setAttribute("aria-hidden", "true");
						shortcutsList.setAttribute("id", id + "-shortcutslist");

						fastscrollPopup = document.createElement("div");
						fastscrollPopup.classList.add(listviewClasses.uiFastscrollPopup);
						fastscrollPopup.setAttribute("id", id + "-fastscrollpopup");

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
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			Listview.prototype._init = function (element) {
				var ui,
					elementChildrens,
					elementChildrensLength,
					id = this.id;
				if (typeof parent_init === TYPE_FUNCTION) {
					parent_init.call(this, element);
				}

				if (this.options.fastscroll) {
					this._ui = this._ui || {};
					ui = this._ui;

					ui._scrollView = selectors.getClosestByClass(element, Tabbar.classes.uiScrollviewClip);
					ui._shortcutsContainer = document.getElementById(id + "-shortcutscontainer");
					ui._shortcutsList = document.getElementById(id + "-shortcutslist");
					ui._popup = document.getElementById(id + "-fastscrollpopup");

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
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			Listview.prototype._bindEvents = function (element) {
				var pageParent = selectors.getParentsByClass(element, Page.classes.uiPage)[0],
					shortcutsList = this._ui._shortcutsList;

				this._uiPageParent = pageParent;

				if (typeof parent_bindEvents === TYPE_FUNCTION) {
					parent_bindEvents.call(this, element);
				}

				if (this.options.fastscroll !== true) {
					return;
				}

				this._onPageshowBound = onPageshow.bind(null, this);
				this._onRefreshBound = fastscrollRefresh.bind(null, this);
				this._onShortcutsListMouseOverBound = onShortcutsListMouseOver.bind(null, this);
				this._onShortcutsListMouseOutBound = onShortcutsListMouseOut.bind(null, this);

				if (pageParent) {
					pageParent.addEventListener("pageshow", this._onPageshowBound, true);
				}

				element.addEventListener("updatelayout", this._onRefreshBound, false);
				window.addEventListener("resize", this._onRefreshBound, false);
				window.addEventListener("orientationchange", this._onRefreshBound, false);

				if (shortcutsList) {
					shortcutsList.addEventListener("vmousedown", this._onShortcutsListMouseOverBound, false);
					shortcutsList.addEventListener("vmousemove", this._onShortcutsListMouseOverBound, false);
					shortcutsList.addEventListener("vmouseover", this._onShortcutsListMouseOverBound, false);

					shortcutsList.addEventListener("vmouseup", this._onShortcutsListMouseOutBound, false);
					shortcutsList.addEventListener("vmouseout", this._onShortcutsListMouseOutBound, false);
				}
			};

			/**
			 * Destroy FastScroll widget
			 *
			 * Destroy current widget.
			 *
			 *		@example
			 *		<div data-role="page" id="main">
			 *			<div data-role="content">
			 *				<ul id="list" data-role="listview" data-fastscroll="true">
			 *					<li data-role="list-divider">A</li>
			 *					<li>Anton</li>
			 *					<li>Arabella</li>
			 *					<li data-role="list-divider">B</li>
			 *					<li>Barry</li>
			 *					<li>Bily</li>
			 *				</ul>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = document.getElementById("list"),
			 *				fastscroll = tau.widget.FastScroll(element);
			 *			fastscroll.destroy();
			 *		</script>
			 *
			 * or JQueryMobile notation:
			 *
			 *		@example
			 *		<div data-role="page" id="main">
			 *			<div data-role="content">
			 *				<ul data-role="listview" data-fastscroll="true" id="fastscroll">
			 *					<li data-role="list-divider">A</li>
			 *					<li>Anton</li>
			 *					<li>Arabella</li>
			 *					<li data-role="list-divider">B</li>
			 *					<li>Barry</li>
			 *					<li>Bily</li>
			 *				</ul>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			$("#list").fastscroll("destroy");
			 *		</script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.Listview.FastScroll
			 */

			/**
			 * Unbinds fastscroll widget events
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			Listview.prototype._destroy = function () {
				var element = this.element,
					pageParent = this._uiPageParent,
					shortcutsList = this._ui._shortcutsList,
					shortcutsListItems,
					listItem,
					shortcutsListItemsLength,
					i;
				if (typeof parent_destroy === TYPE_FUNCTION) {
					parent_destroy.call(this);
				}

				if (pageParent) {
					pageParent.removeEventListener("pageshow", this._onPageshowBound);
				}

				element.removeEventListener("updatelayout", this._onRefreshBound);
				window.removeEventListener("resize", this._onRefreshBound);
				window.removeEventListener("orientationchange", this._onRefreshBound);

				if (shortcutsList) {
					shortcutsList.removeEventListener("vmousedown", this._onShortcutsListMouseOverBound);
					shortcutsList.removeEventListener("vmousemove", this._onShortcutsListMouseOverBound);
					shortcutsList.removeEventListener("vmouseover", this._onShortcutsListMouseOverBound);

					shortcutsList.removeEventListener("vmouseup", this._onShortcutsListMouseOutBound);
					shortcutsList.removeEventListener("vmouseout", this._onShortcutsListMouseOutBound);

					shortcutsListItems = shortcutsList.getElementsByTagName("li");

					for (i = 0, shortcutsListItemsLength = shortcutsListItems.length; i < shortcutsListItemsLength; i++) {
						listItem = shortcutsListItems[i];
						listItem.removeEventListener("vmousedown", this._onListItemVMouseDownBound);
						listItem.removeEventListener("vmouseup", this._onListItemVMouseUpBound);
					}
				}

				events.trigger(element, eventType.DESTROYED, {
					widget: "FastScroll",
					parent: pageParent
				});
			};

			/**
			 * Creates map of deviders
			 * @method _createDividerMap
			 * @protected
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			Listview.prototype._createDividerMap = function () {
				var primaryCharacterSet = null,
					secondCharacterSet = null,
					numberSet = "0123456789",
					dividers = this.element.getElementsByClassName(ns.widget.mobile.ListDivider.classes.uiLiDivider),
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
			 * @member ns.widget.mobile.Listview.FastScroll
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
			 * @method _jumpToDivider
			 * @param {HTMLElement} divider
			 * @protected
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			Listview.prototype._jumpToDivider = function (divider) {
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
			 * @member ns.widget.mobile.Listview.FastScroll
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
					this._jumpToDivider(divider);
				}

				popup.innerText = text;
				popupStyles.display = "block";
				popupStyles.width = popup.offsetHeight + "px";
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
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			Listview.prototype._focusItem = function (listItem) {
				this._onListItemVMouseDownBound = this._onListItemVMouseDownBound || onListItemVMouseDown.bind(null, this);
				this._onListItemVMouseUpBound = this._onListItemVMouseUpBound || onListItemVMouseUp.bind(null, this);
				listItem.addEventListener("vmouseover", this._onListItemVMouseDownBound, false);
				listItem.addEventListener("vmouseout", this._onListItemVMouseUpBound, false);
			};

			/**
			 * If max number of items is greater then 3 return array with cout of omited items.
			 * @method _omit
			 * @param {number} numOfItems
			 * @param {number} maxNumOfItems
			 * @return {?Array}
			 * @protected
			 * @member ns.widget.mobile.Listview.FastScroll
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
			 * @return {string}
			 * @protected
			 * @member ns.widget.mobile.Listview.FastScroll
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
			 * Refresh Fast Scroll widget
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.Listview.FastScroll
			 */
			Listview.prototype._refresh = function () {
				this._onRefreshBound = this._onRefreshBound || fastscrollRefresh.bind(this);
				this._onRefreshBound();
			};

			/**
			 * Get or set index string:
			 *
			 * You can use the _indexString_ method with the fast scroll to manage string values to be used in shortcut items:
			 *
			 *		@example
			 *		<div data-role="page" id="main">
			 *			<div data-role="content">
			 *				<ul id="fastscroll">
			 *					<li data-role="list-divider">A</li>
			 *					<li>Anton</li>
			 *					<li>Arabella</li>
			 *					<li data-role="list-divider">B</li>
			 *					<li>Barry</li>
			 *					<li>Bily</li>
			 *				</ul>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			// get index string
			 *			var element = document.getElementById("fastscroll"),
			 *				fastscroll = tau.widget.FastScroll(element, {fastscroll: true});
			 *			fastscroll.indexString();
			 *
			 *			// set index string
			 *			fastscroll.indexString("A,D,J,P,W,Z");
			 *		</script>
			 *
			 * or JQueryMobile notation:
			 *
			 *		@example
			 *		<div data-role="page" id="main">
			 *			<div data-role="content">
			 *				<ul data-role="listview" data-fastscroll="true" id="fastscroll">
			 *					<li data-role="list-divider">A</li>
			 *					<li>Anton</li>
			 *					<li>Arabella</li>
			 *					<li data-role="list-divider">B</li>
			 *					<li>Barry</li>
			 *					<li>Bily</li>
			 *				</ul>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			$("#fastscroll").fastscroll("indexString", "A,D,J,P,W,Z");
			 *		</script>
			 *
			 * @method indexString
			 * @param {string} [indexAlphabet] values to be used in shortcut items
			 * @member ns.widget.mobile.Listview.FastScroll
			 * @since 2.1
			 * @return {?string} Primary and secondary language
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
			ns.widget.mobile.FastScroll = Listview;
			engine.defineWidget(
				"FastScroll",
				"[data-role='listview'][data-fastscroll='true'], .ui-fastscroll",
				["indexString"],
				Listview,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return false;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
