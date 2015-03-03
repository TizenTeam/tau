/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
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

				SnapListview = function() {
					var self = this;

					self._ui = {
						page: null,
						scrollableParent: null,
						childItems: {}
					};

					self.options = {
						selector: "li:not(.ui-listview-divider)"
					};

					self._callbacks = {};
					self._timer = null;
					self._isScrollStarted = false;
					self._selectedIndex = null;
				},

				prototype = new BaseWidget(),

				CLASSES_PREFIX = "ui-snap-listview",

				classes = {
					SNAP_CONTAINER: "ui-snap-container",
					SNAP_LISTVIEW: CLASSES_PREFIX,
					SNAP_LISTVIEW_SELECTED: CLASSES_PREFIX + "-selected",
					SNAP_LISTVIEW_ITEM: CLASSES_PREFIX + "-item"
				},

				// time threshold for detect scroll end
				SCROLL_END_TIME_THRESHOLD = 350;

			SnapListview.classes = classes;

			function removeSelectedClass(self) {
				var selectedIndex = self._selectedIndex;

				if (selectedIndex !== null) {
					self._ui.childItems[selectedIndex].classList.remove(classes.SNAP_LISTVIEW_SELECTED);
				}
			}

			function scrollEndHandler(self) {
				self._isScrollStarted = false;

				// trigger "scrollend" event
				utilEvent.trigger(self.element, eventType.SCROLL_END);

				setSelection(self);
			}

			function scrollStartHandler(self) {
				var scrollEndCallback = scrollEndHandler.bind(null, self);

				if (!self._isScrollStarted) {
					self._isScrollStarted = true;
					// trigger "scrollstart" event
					utilEvent.trigger(self.element, eventType.SCROLL_START);
					removeSelectedClass(self);
				}

				self._callbacks.scrollEnd = scrollEndCallback;

				window.clearTimeout(self._timer);

				self._timer = window.setTimeout(scrollEndCallback, SCROLL_END_TIME_THRESHOLD);
			}

			/* TODO: please check algorithm */
			function getScrollableParent(element) {
				var overflow;

				while (element != document.body) {
					overflow = doms.getCSSProperty(element, "overflow-y");
					if (overflow === "scroll" || (overflow === "auto" && element.scrollHeight > element.clientHeight)) {
						return element;
					}
					element = element.parentNode;
				}

				return null;
			}

			function setSnapListviewItem(element) {
				var ui = this._ui,
					options = this.options,
					listviewElement = element;

				childItems = listviewElement.querySelectorAll(options.selector);
				ui.page = utilSelector.getClosestByClass(listviewElement, "ui-page") || window;
				ui.childItems = childItems;
				ui.scrollableParent = getScrollableParent(listviewElement) || ui.page;

				 if (childItems && (childItems.length > 0)) {
					ui.scrollableParent.classList.add(classes.SNAP_CONTAINER);
					initSnapListviewItemInfo(childItems);
				}
			};

			function initSnapListviewItemInfo(listItems) {
				var listItemLength = listItems.length,
					i, tempListItem;

				for (i=0 ; i < listItemLength; i++) {
					tempListItem = listItems[i];
					tempListItem.itemTop = tempListItem.offsetTop;
					tempListItem.itemHeight = tempListItem.offsetHeight;
					tempListItem.itemBottom = tempListItem.itemTop + tempListItem.itemHeight;
					tempListItem.classList.add(classes.SNAP_LISTVIEW_ITEM);
				}
			}

			function setSelection(self) {
				var ui = self._ui,
					listItems = ui.childItems,
					scrollableElement = ui.scrollableParent,
					scrollableElementScrollTop = scrollableElement.scrollTop,
					scrollableElementOffsetHeight = scrollableElement.offsetHeight,
					scrollElementCenter = scrollableElementScrollTop + scrollableElementOffsetHeight/2,
					listItemLength = listItems.length,
					i,
					tempListItem,
					gapOfBeforeItem,
					gapOfNextItem;

				for (i=0 ; i < listItemLength; i++) {
					tempListItem = listItems[i];
					gapOfBeforeItem = listItems[i-1] ? (tempListItem.itemTop - listItems[i-1].itemBottom) / 2 : tempListItem.itemTop;
					gapOfAfterItem = listItems[i+1] ? (listItems[i+1].itemTop - tempListItem.itemBottom) / 2 : scrollableElement.scrollHeight - tempListItem.itemBottom;

					if ((tempListItem.itemTop - gapOfBeforeItem < scrollElementCenter) && (tempListItem.itemBottom + gapOfAfterItem >= scrollElementCenter)) {
						self._selectedIndex = i;
						tempListItem.classList.add(classes.SNAP_LISTVIEW_SELECTED);
						// trigger "selected" event
						utilEvent.trigger(tempListItem, eventType.SELECTED);
						break;
					}
				}

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
					ui = self._ui,
					listviewElement = element,
					scrollStartCallback = scrollStartHandler.bind(null, self);

				self._callbacks.scrollStart = scrollStartCallback;

				setSnapListviewItem.call(self, element);

				// bind scroll event to scrollable parent
				utilEvent.on(ui.scrollableParent, "scroll", scrollStartCallback);

				// init selectedItem
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
					element = self.element,
					ui = self._ui;

				ui.scrollableParent = getScrollableParent(element) || ui.page;
				setSnapListviewItem.call(self, element);
				setSelection(self);

				return null;
			};

			prototype._unbindEvents = function() {
				this._ui.scrollableParent.removeEventListener("scroll", this._callbacks.scrollStart, false);
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
				self._isScrollStarted = null;
				if (self._timer) {
					window.clearTimeout(self._timer);
				}
				self._timer = null;
				self._selectedIndex = null;

				return null;
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
				var ui = this._ui,
					selectedIndex = this._selectedIndex,
					listItems = ui.childItems,
					scrollableParent = ui.scrollableParent,
					listItemLength = listItems.length,
					indexItem = listItems[index],
					selectedItem = listItems[selectedIndex];

				if (index > selectedIndex && selectedIndex + 1 < listItemLength) {
					scrollableParent.scrollTop += indexItem.itemTop - selectedItem.itemBottom + (indexItem.itemHeight / 2 + selectedItem.itemHeight / 2);
				} else if (index < selectedIndex && selectedIndex > 0) {
					scrollableParent.scrollTop -= selectedItem.itemTop - indexItem.itemBottom + (indexItem.itemHeight / 2 + selectedItem.itemHeight / 2);
				}
			};

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
