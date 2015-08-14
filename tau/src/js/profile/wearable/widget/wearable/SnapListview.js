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
/*jslint nomen: true */
/**
 * # SnapListview Widget
 * Shows a snap list view.
 * It detects center-positioned list item when scroll end. When scroll event started, SnapListview trigger *scrollstart* event, and scroll event ended, it trigger *scrollend* event.
 * When scroll ended and it attach class to detected item.
 *
 * ## Default selectors
 *
 * Default selector for snap listview widget is class *ui-snap-listview*.
 *
 * To add a list widget to the application, use the following code:
 *
 * ### List with basic items
 *
 * You can add a basic list widget as follows:
 *
 *      @example
 *         <ul class="ui-listview ui-snap-listview">
 *             <li>1line</li>
 *             <li>2line</li>
 *             <li>3line</li>
 *             <li>4line</li>
 *             <li>5line</li>
 *         </ul>
 *
 * ## JavaScript API
 *
 * There is no JavaScript API.
 *
 * @author Heeju Joo <heeju.joo@samsung.com>
 * @class ns.widget.wearable.SnapListview
 * @extends ns.widget.BaseWidget
 */
(function(document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/DOM",
			"../../../../core/util/selectors",
			"../../../../core/widget/BaseWidget",
			"../wearable"
		],
		function() {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.wearable.SnapListview
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for class ns.event
				 * @property {ns.event} utilEvent
				 * @member ns.widget.wearable.SnapListview
				 * @private
				 */
				utilEvent = ns.event,
				/**
				 * Alias for class ns.util.DOM
				 * @property {ns.util.DOM} doms
				 * @member ns.widget.wearable.SnapListview
				 * @private
				 */
				doms = ns.util.DOM,
				/**
				 * Alias for class ns.util.selectors
				 * @property {ns.util.selectors} utilSelector
				 * @member ns.widget.wearable.SnapListview
				 * @private
				 */
				utilSelector = ns.util.selectors,


				eventType = {
					/**
					 * Dictionary for SnapListview related events.
					 * @event scrollstart
					 * @event scrollend
					 * @event selected
					 * @member ns.widget.wearable.SnapListview
					 */
					SCROLL_START: "scrollstart",
					SCROLL_END: "scrollend",
					SELECTED: "selected"
				},

				animationTimer = null,

				SnapListview = function() {
					var self = this;

					self._ui = {
						page: null,
						scrollableParent: {
							element: null,
							height: 0
						},
						childItems: {}
					};

					self.options = {
						selector: "li:not(.ui-listview-divider)",
						animate: "none",
						scale: {
							from: 0.77,
							to: 1
						},
						opacity: {
							from: 0.7,
							to: 1
						}
					};

					self._listItems = [];
					self._callbacks = {};
					self._scrollEndTimeoutId = null;
					self._isScrollStarted = false;
					self._selectedIndex = null;
					self._enabled = true;
				},

				prototype = new BaseWidget(),

				CLASSES_PREFIX = "ui-snap-listview",

				classes = {
					SNAP_CONTAINER: "ui-snap-container",
					SNAP_DISABLED: "ui-snap-disabled",
					SNAP_LISTVIEW: CLASSES_PREFIX,
					SNAP_LISTVIEW_SELECTED: CLASSES_PREFIX + "-selected",
					SNAP_LISTVIEW_ITEM: CLASSES_PREFIX + "-item"
				},

				// time threshold for detect scroll end
				SCROLL_END_TIME_THRESHOLD = 100;

			SnapListview.classes = classes;

			SnapListview.ListItem = function(element, visiableOffset) {
				var offsetTop = element.offsetTop,
					height = element.offsetHeight;

				this.element = element;
				this.rate = -1;

				this.coord = {
					top: offsetTop,
					height: height
				};

				this.position = {
					begin: offsetTop - visiableOffset,
					start: offsetTop - visiableOffset + height,
					stop: offsetTop,
					end: offsetTop + height
				};

				element.classList.add(classes.SNAP_LISTVIEW_ITEM);
			};

			SnapListview.ListItem.prototype = {
				animate: function(offset, callback) {
					var element = this.element,
						p = this.position,
						begin = p.begin,
						end = p.end,
						start = p.start,
						stop = p.stop,
						rate;

					if (offset >= start && offset <= stop) {
						rate = Math.min(1, Math.abs((offset - start) / (stop - start)));
					} else if ((offset > begin && offset < start) || (offset < end && offset > stop)) {
						rate = 0;
					} else {
						rate = -1;
					}

					if (this.rate !== rate) {
						callback(element, rate);
						this.rate = rate;
					}
				}
			};

			function removeSelectedClass(self) {
				var selectedIndex = self._selectedIndex;

				if (selectedIndex !== null) {
					self._listItems[selectedIndex].element.classList.remove(classes.SNAP_LISTVIEW_SELECTED);
				}
			}

			function setSelection(self) {
				var ui = self._ui,
					listItems = self._listItems,
					scrollableParent = ui.scrollableParent,
					scrollCenter = scrollableParent.element.scrollTop + scrollableParent.height / 2,
					listItemLength = listItems.length,
					tempListItem, tempListItemCoord, i;

				for (i=0 ; i < listItemLength; i++) {
					tempListItem = listItems[i];
					tempListItemCoord = tempListItem.coord;

					if ((tempListItemCoord.top < scrollCenter) && (tempListItemCoord.top + tempListItemCoord.height >= scrollCenter)) {
						removeSelectedClass(self);
						self._selectedIndex = i;
						tempListItem.element.classList.add(classes.SNAP_LISTVIEW_SELECTED);
						utilEvent.trigger(tempListItem.element, eventType.SELECTED);
						return;
					}
				}

			}

			function listItemAnimate(self) {
				var anim = self.options.animate,
					animateCallback = self._callbacks[anim],
					scrollPosition;

				if (animateCallback) {
					scrollPosition = self._ui.scrollableParent.element.scrollTop;
					self._listItems.forEach(function(item) {
						item.animate(scrollPosition, animateCallback);
					});
				}
			}

			function scrollEndCallback(self) {
				self._isScrollStarted = false;

				// trigger "scrollend" event
				utilEvent.trigger(self.element, eventType.SCROLL_END);

				setSelection(self);
			}

			function scrollHandler(self) {
				var callbacks = self._callbacks,
					scrollEndCallback = callbacks.scrollEnd;

				if (!self._isScrollStarted) {
					self._isScrollStarted = true;
					removeSelectedClass(self);
					utilEvent.trigger(self.element, eventType.SCROLL_START);
				}

				listItemAnimate(self);

				window.clearTimeout(self._scrollEndTimeoutId);
				self._scrollEndTimeoutId = window.setTimeout(scrollEndCallback, SCROLL_END_TIME_THRESHOLD);
			}

			function getScrollableParent(element) {
				var overflow;

				while (element !== document.body) {
					overflow = doms.getCSSProperty(element, "overflow-y");
					if (overflow === "scroll" || (overflow === "auto" && element.scrollHeight > element.clientHeight)) {
						return element;
					}
					element = element.parentNode;
				}

				return null;
			}

			function initSnapListview(listview) {
				var self = this,
					ui = self._ui,
					options = self.options,
					listItems = [],
					scroller, visiableOffset;


				ui.page = utilSelector.getClosestByClass(listview, "ui-page") || window;
				scroller = getScrollableParent(listview) || ui.page;
				scroller.classList.add(classes.SNAP_CONTAINER);
				visiableOffset = scroller.clientHeight || ui.page.offsetHeight;

				ui.scrollableParent.element = scroller;
				ui.scrollableParent.height = visiableOffset;

				[].slice.call(listview.querySelectorAll(options.selector)).forEach(function(element) {
					listItems.push(new SnapListview.ListItem(element, visiableOffset));
				});

				self._listItems = listItems;
				listItemAnimate(self);
			}

			prototype._build = function(element) {
				if (!element.classList.contains(classes.SNAP_LISTVIEW)) {
					element.classList.add(classes.SNAP_LISTVIEW);
				}

				return element;
			};

			/**
			 * Init SnapListview
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._init = function(element) {
				var self = this,
					options = this.options,
					scaleForm = options.scale.from,
					scaleTo = options.scale.to,
					opacityForm = options.opacity.from,
					opacityTo = options.opacity.to;

				self._callbacks = {
					scroll: scrollHandler.bind(null, self),
					scrollEnd: scrollEndCallback.bind(null, self),
					scale : function(listItemElement, rate) {
						var scale = 1,
							opacity = 1;

						if (rate < 0) {
							listItemElement.style.webkitTransform = "";
							listItemElement.style.opacity = "";
							return;
						}

						rate = rate > 0.5 ? 1 - rate : rate;

						scale = scaleForm + ((scaleTo - scaleForm) * rate*2);
						opacity = opacityForm + ((opacityTo - opacityForm) * rate*2);

						listItemElement.style.webkitTransform = "scale3d("+scale+","+scale+","+scale+")";
						listItemElement.style.opacity = opacity;
					}
				};

				initSnapListview.call(self, element);
				setSelection(self);

				return element;
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._refresh = function() {
				var self = this,
					element = self.element;

				self._unbindEvents();

				initSnapListview.call(self, element);
				setSelection(self);

				self._bindEvents();

				return null;
			};

			prototype._bindEvents = function() {
				var element = this._ui.scrollableParent.element;
				if (element) {
					utilEvent.on(element, "scroll", this._callbacks.scroll, false);
				}
			};

			prototype._unbindEvents = function() {
				var element = this._ui.scrollableParent.element;
				if (element) {
					utilEvent.off(element, "scroll", this._callbacks.scroll, false);
				}
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._destroy = function() {
				var self = this;

				self._unbindEvents();

				self._ui = null;
				self._callbacks = null;
				self._listItems = null;
				self._isScrollStarted = null;

				if (self._scrollEndTimeoutId) {
					window.clearTimeout(self._scrollEndTimeoutId);
				}
				self._scrollEndTimeoutId = null;
				self._selectedIndex = null;

				return null;
			};

			prototype._enable = function() {
				var self = this,
					scrollableParent = self._ui.scrollableParent.element;

				scrollableParent.classList.remove(classes.SNAP_DISABLED);
				if (!self._enabled) {
					self._enabled = true;
					self._refresh();
				}
			};

			prototype._disable = function() {
				var self = this,
					scrollableParent = self._ui.scrollableParent.element;

				scrollableParent.classList.add(classes.SNAP_DISABLED);
				self._enabled = false;
			};

			/**
			 * Get selectedIndex
			 * @method getSelectedIndex
			 * @return {number} index
			 * @public
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype.getSelectedIndex = function() {
				return this._selectedIndex;
			};

			/**
			 * Scroll SnapList by index
			 * @method scrollToPosition
			 * @param {number} index
			 * @public
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype.scrollToPosition = function(index) {
				var self = this,
					ui = self._ui,
					enabled = self._enabled,
					listItems = self._listItems,
					scrollableParent = ui.scrollableParent,
					listItemLength = listItems.length,
					indexItem,
					dest;

				if (!enabled || index < 0 || index >= listItemLength) {
					return;
				}

				removeSelectedClass(self);
				
				indexItem = listItems[index].coord;
				dest = indexItem.top - scrollableParent.height / 2 + indexItem.height / 2;

				self._selectedIndex = index;

				if(animationTimer !== null) {
					window.cancelAnimationFrame(animationTimer);
					animationTimer = null;
				}
				scrollAnimation(scrollableParent.element, scrollableParent.element.scrollTop, dest, 450);
			};

			function cubicBezier (x1, y1, x2, y2) {
				return function (t) {
					var rp = 1 - t, rp3 = 3 * rp, p2 = t * t, p3 = p2 * t, a1 = rp3 * t * rp, a2 = rp3 * p2;
					return a1 * y1 + a2 * y2 + p3;
				};
			}

			function scrollAnimation(element, from, to, duration) {
				var easeOut = cubicBezier(0.25, 0.46, 0.45, 1),
					startTime = 0,
					currentTime = 0,
					progress = 0,
					easeProgress = 0,
					distance = to - from,
					scrollTop = element.scrollTop;

				startTime = window.performance.now();
				animationTimer = window.requestAnimationFrame(function animation() {
					var gap;
					currentTime = window.performance.now();
					progress = (currentTime - startTime) / duration;
					easeProgress = easeOut(progress);
					gap = distance * easeProgress;
					element.scrollTop = scrollTop + gap;
					if (progress <= 1 && progress >= 0) {
						animationTimer = window.requestAnimationFrame(animation);
					} else {
						animationTimer = null;
					}
				});
			}

			SnapListview.prototype = prototype;
			ns.widget.wearable.SnapListview = SnapListview;

			engine.defineWidget(
				"SnapListview",
				".ui-snap-listview",
				[],
				SnapListview,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return SnapListview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
