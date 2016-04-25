/*global window, define, ns, screen */
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
			"../../util/scrolling",
			"../BaseWidget",
			"../../../profile/wearable/widget/wearable/SnapListview",
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
				 * @property {number} SCROLL_NONE
				 * to retrive if user is not scrolling
				 * @private
				 * @static
				 * @member ns.widget.core.VirtualListview
				 */
				selectors = ns.util.selectors,
				// Scrolling util is responsible for support touches and calculate scrolling position after touch
				// In Virtual List we use scrolling in virtual model which is responsible for calculate touches, send event
				// but don't render scrolled element. For rendering is responsible only Virtual List
				utilScrolling = ns.util.scrolling,
				SimpleVirtualList = function () {
					var self = this;
					self.options = {
						dataLength: 0,
						listItemUpdater: null,
						scrollElement: null,
						orientation: "vertical",
						snap: false
					};
					self._ui = {};
					self._scrollBegin = 0;
					self._elementsMap = [];
					self._itemSize = 0;
					self._numberOfItems = 3;
				},
				floor = Math.floor,
				filter = Array.prototype.filter,
				prototype = new BaseWidget();

			SimpleVirtualList.classes = {
				uiVirtualListContainer: "ui-virtual-list-container"
			};

			function setupScrollview(element, orientation) {
				var scrollview = selectors.getClosestByClass(element, "ui-scroller") || element.parentElement,
					scrollviewStyle;
				//Get scrollview instance
				scrollviewStyle = scrollview.style;

				return scrollview;
			}

			function getScrollView(options, element) {
				var scrollview = null;

				if (options.scrollElement) {
					if (typeof options.scrollElement === "string") {
						scrollview = selectors.getClosestBySelector(element, "." + options.scrollElement);
					} else {
						scrollview = options.scrollElement;
					}
				}

				if (!scrollview) {
					scrollview = setupScrollview(element, options.orientation);
				}

				return scrollview;
			}

			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					classes = SimpleVirtualList.classes,
					options = self.options,
					scrollview,
					orientation;

				//Prepare element
				element.classList.add(classes.uiVirtualListContainer);

				//Set orientation, default vertical scrolling is allowed
				orientation = options.orientation.toLowerCase() === "horizontal" ? "horizontal" : "vertical";

				scrollview = getScrollView(options, element);

				ui.scrollview = scrollview;
				options.orientation = orientation;

				return element;
			};

			prototype._buildList = function () {
				var self = this,
					listItem,
					options = self.options,
					scrollview = self._ui.scrollview,
					sizeProperty = options.orientation === "vertical" ? "height" : "width",
					list = self.element,
					childElementType = (list.tagName === "UL" || list.tagName === "OL") ? "li" : "div",
					numberOfItems = self._numberOfItems,
					content = selectors.getClosestBySelector(list, ".ui-content").getBoundingClientRect(),
					elementRect = null,
					i,
					scrollInitSize = scrollview.getBoundingClientRect()[sizeProperty];

				if (options.dataLength < numberOfItems) {
					numberOfItems = options.dataLength;
				}

				for (i = 0; i < numberOfItems; ++i) {
					listItem = document.createElement(childElementType);
					self._updateListItem(listItem, i);
					list.appendChild(listItem);
					elementRect = self.element.getBoundingClientRect();
					if (elementRect[sizeProperty] < content[sizeProperty]) {
						numberOfItems++;
					}
				}

				elementRect = self.element.getBoundingClientRect();
				self._itemSize = numberOfItems > 0 ? elementRect[sizeProperty] / numberOfItems : 0;
				self._numberOfItems = numberOfItems;
				self._containerSize = content[sizeProperty];
				self._numberOfVisibleElements = Math.ceil(content[sizeProperty] / self._itemSize);

				utilScrolling.enable(scrollview, options.orientation === "horizontal" ? "x" : "y", true);
				utilScrolling.enableScrollBar();
				if (scrollview.classList.contains("ui-scroller")) {
					utilScrolling.setMaxScroll(options.dataLength * self._itemSize + scrollInitSize);
				} else {
					utilScrolling.setMaxScroll(options.dataLength * self._itemSize);
				}
				if (options.snap) {
					utilScrolling.setSnapSize(self._itemSize);
					self._snapListviewWidget = tau.engine.instanceWidget(list, "SnapListview", options.snap);
					self._snapListviewWidget.refresh();
				}
			};

			prototype._updateListItem = function (element, index) {
				element.setAttribute("data-index", index);
				this.options.listItemUpdater(element, index);
			};

			prototype._refresh = function () {
				this._buildList();
				this.trigger("draw");
			};

			prototype.scrollTo = function (position) {
				utilScrolling.scrollTo(-position);
			};

			prototype.scrollToIndex = function (index) {
				this.scrollTo(Math.floor(this._itemSize * index));
			};

			function filterElement(index, element) {
				return element.getAttribute("data-index") === "" + index;
			}

			function filterNextElement(nextIndex, element, index) {
				return index > nextIndex;
			}

			function filterFreeElements(map, element) {
				return map.indexOf(element) === -1;
			}

			function _updateList(self, event) {
				var list = self.element,
					beginProperty = self.options.orientation === "vertical" ? "scrollTop" : "scrollLeft",
					scrollBegin = event.detail && event.detail[beginProperty],
					fromIndex,
					map = [],
					freeElements,
					numberOfItems = self._numberOfItems,
					i,
					currentIndex,
					listItem,
					correction,
					scroll = {
					    scrollTop: 0,
					    scrollLeft: 0
					},
					nextElement;
				if (scrollBegin !== undefined) {
					self._scrollBegin = scrollBegin;
					currentIndex = floor(scrollBegin / self._itemSize);
					if (currentIndex >= 0) {
						if (currentIndex !== floor(self._scrollBeginPrev / self._itemSize)) {
							if (scrollBegin < self._itemSize) {
								fromIndex = 0;
								correction = 0;
							} else if (currentIndex > (self.options.dataLength - numberOfItems)) {
								fromIndex = self.options.dataLength - numberOfItems;
								correction = self._itemSize * (currentIndex-fromIndex);
							} else if (currentIndex === (self.options.dataLength - numberOfItems)) {
								fromIndex = currentIndex;
								correction = 0;
							} else {
								fromIndex = currentIndex - 1;
								correction = self._itemSize;
							}
							for (i = fromIndex; i < fromIndex + numberOfItems; ++i) {
								map[i - fromIndex] = filter.call(list.children, filterElement.bind(null, i))[0];
							}
							freeElements = filter.call(list.children, filterFreeElements.bind(null, map));
							for (i = fromIndex + numberOfItems - 1; i >= fromIndex ; --i) {
								if (i<self.options.dataLength) {
									if (!map[i - fromIndex]) {
										listItem = freeElements.shift();
										map[i - fromIndex] = listItem;
										self._updateListItem(listItem, i);
										if (i - fromIndex === numberOfItems - 1) {
											list.appendChild(listItem);
										} else {
											nextElement = map.filter(filterNextElement.bind(null, i - fromIndex))[0];
											if (!nextElement) {
												list.insertBefore(listItem, list.firstElementChild);
											} else {
												list.insertBefore(listItem, nextElement);
											}
										}
									}
								}
							}
							scroll[beginProperty] = correction + scrollBegin % self._itemSize;
						}
						else {
							if (scrollBegin < self._itemSize) {
								scroll[beginProperty] = scrollBegin % self._itemSize;
							} else if (currentIndex > (self.options.dataLength - numberOfItems)) {
								fromIndex = self.options.dataLength - numberOfItems;
								correction = self._itemSize * (currentIndex-fromIndex);
								scroll[beginProperty] = correction + scrollBegin % self._itemSize;
							} else if (currentIndex === (self.options.dataLength - numberOfItems)) {
								correction = 0;
								scroll[beginProperty] = correction + scrollBegin % self._itemSize;
							} else {
								scroll[beginProperty] = self._itemSize + scrollBegin % self._itemSize;
							}
						}
						self._ui.scrollview.firstElementChild.style.transform = 'translate(' + (-scroll.scrollLeft) + 'px, ' + (-scroll.scrollTop) + 'px)';
					}
					self._scrollBeginPrev = scrollBegin;
				}
				if (self._snapListviewWidget) {
					self._snapListviewWidget.refresh();
				}
			}

			prototype._bindEvents = function () {
				var self = this,
				scrollEventBound = _updateList.bind(null, this),
					scrollview = this._ui.scrollview;

				if (scrollview) {
					scrollview.addEventListener("scroll", scrollEventBound, false);
					this._scrollEventBound = scrollEventBound;
				}

			};

			prototype._destroy = function() {
				utilScrolling.disable();
			};

			prototype.setListItemUpdater = function (updateFunction) {
				this.options.listItemUpdater = updateFunction;
				this.refresh();
			};

			SimpleVirtualList.prototype = prototype;

			ns.engine.defineWidget(
				"VirtualListviewSimple",
				// empty selector because widget require manual build
				"",
				["draw", "setListItemUpdater", "scrollTo", "scrollToIndex"],
				SimpleVirtualList,
				"",
				true
			);
			ns.widget.core.VirtualListviewSimple = SimpleVirtualList;
		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return SimpleVirtualList;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
