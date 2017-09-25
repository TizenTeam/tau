/*global window, ns, define */
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
/**
 * # Selector Component
 *
 * Selector component is special component that has unique UX of Tizen wearable profile.
 * Selector component has been used in more options commonly but If you want to use other situation then you can use
 * this component as standalone component in everywhere.
 * Selector component was consisted as selector element and item elements. You can set the item selector, each items locate degree and radius.
 * Selector component has made layers automatically. Layer has items and you can set items number on one layer.
 * Indicator is indicator that located center of Selector. We provide default indicator style and function.
 * But, If you want to change indicator style and function, you can make the custom indicator and set your indicator for operate with Selector.
 * Indicator arrow is special indicator style that has the arrow. That was used for provide more correct indicate information for user.
 * Also, you can make the custom indicator arrow and set your custom indicator arrow for operate with Selector.
 * Selector provide to control for arrow indicate active item position.
 *
 * ## HTML example
 *
 *          @example
 *              <div class="ui-page ui-page-active" id="main">
 *                  <div id="selector" class="ui-selector">
 *                      <div class="ui-item ui-show-icon" data-title="Show"></div>
 *                      <div class="ui-item ui-human-icon" data-title="Human"></div>
 *                      <div class="ui-item ui-delete-icon" data-title="Delete"></div>
 *                      <div class="ui-item ui-show-icon" data-title="Show"></div>
 *                      <div class="ui-item ui-human-icon" data-title="Human"></div>
 *                      <div class="ui-item ui-delete-icon" data-title="Delete"></div>
 *                      <div class="ui-item ui-x-icon" data-title="X Icon"></div>
 *                      <div class="ui-item ui-fail-icon" data-title="Fail"></div>
 *                      <div class="ui-item ui-show-icon" data-title="Show"></div>
 *                      <div class="ui-item ui-human-icon" data-title="Human"></div>
 *                      <div class="ui-item ui-delete-icon" data-title="Delete"></div>
 *                  </div>
 *              </div>
 *
 * ## Manual constructor
 *
 *          @example
 *              (function() {
 *                  var page = document.getElementById("selectorPage"),
 *                      selector = document.getElementById("selector"),
 *                      clickBound;
 *
 *                  function onClick(event) {
 *                      var activeItem = selector.querySelector(".ui-item-active");
 *                      //console.log(activeItem.getAttribute("data-title"));
 *                  }
 *                  page.addEventListener("pagebeforeshow", function() {
 *                      clickBound = onClick.bind(null);
 *                      tau.widget.Selector(selector);
 *                      selector.addEventListener("click", clickBound, false);
 *                  });
 *                  page.addEventListener("pagebeforehide", function() {
 *                      selector.removeEventListener("click", clickBound, false);
 *                  });
 *              })();
 *
 * ## Options
 * Selector component options
 *
 * {string} itemSelector [options.itemSelector=".ui-item"] or You can set attribute on tag [data-item-selector=".ui-item] Selector item selector that style is css selector.
 * {string} indicatorSelector [options.indicatorSelector=".ui-selector-indicator"] or You can set attribute on tag [data-indicator-selector=".ui-selector-indicator"] Selector indicator selector that style is css selector.
 * {string} indicatorArrowSelector [options.indicatorArrowSelector=".ui-selector-indicator-arrow"] or You can set attribute on tag [data-indicator-arrow-selector=".ui-selector-indicator-arrow"] Selector indicator arrow selector that style is css style.
 * {number} itemDegree [options.itemDegree=30] or You can set attribute on tag [data-item-degree=30] Items degree each other.
 * {number} itemRadius [options.itemRadius=140] or You can set attribute on tag [data-item-radius=140] Items radius between center and it.
 * {number} maxItemNumber [options.maxItemNumber=11] or You can set attribute on tag [data-max-item-number=11] Max item number on one layer. If you change the itemDegree, we recommend to consider to modify this value for fit your Selector layout.
 * {boolean} indicatorAutoControl [options.indicatorAutoControl=true] or You can set attribute on tag [data-indicator-auto-control=true] Indicator auto control switch. If you want to control your indicator manually, change this options to false.
 *
 * @class ns.widget.wearable.Selector
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/DOM",
			"../../../../core/util/selectors",
			"../../../../core/util/object",
			"../../../../core/widget/BaseWidget",
			"../../../../core/event",
			"../../../../core/event/gesture/Drag",
			"../../../../core/event/gesture/LongPress",
			"../wearable"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				utilDom = ns.util.DOM,
				Gesture = ns.event.gesture,
				events = ns.event,
				utilsObject = ns.util.object,
				requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame,
				Selector = function () {
					var self = this;

					self._ui = {};
					self.options = {
						editable: true,
						plusButton: true
					};

					self._editModeEnabled = false;
				},
				classes = {
					SELECTOR: "ui-selector",
					LAYER: "ui-layer",
					LAYER_ACTIVE: "ui-layer-active",
					LAYER_PREV: "ui-layer-prev",
					LAYER_NEXT: "ui-layer-next",
					LAYER_HIDE: "ui-layer-hide",
					ITEM: "ui-item",
					ITEM_ACTIVE: "ui-item-active",
					ITEM_REMOVABLE: "ui-item-removable",
					ITEM_ICON_REMOVE: "ui-item-icon-remove",
					INDICATOR: "ui-selector-indicator",
					INDICATOR_ACTIVE: "ui-selector-indicator-active",
					INDICATOR_TEXT: "ui-selector-indicator-text",
					INDICATOR_ICON: "ui-selector-indicator-icon",
					INDICATOR_ICON_ACTIVE: "ui-selector-indicator-icon-active",
					INDICATOR_ICON_ACTIVE_WITH_TEXT: "ui-selector-indicator-icon-active-with-text",
					INDICATOR_SUBTEXT: "ui-selector-indicator-subtext",
					INDICATOR_WITH_SUBTITLE: "ui-selector-indicator-with-subtext",
					INDICATOR_NEXT_END: "ui-selector-indicator-next-end",
					INDICATOR_PREV_END: "ui-selector-indicator-prev-end",
					INDICATOR_ARROW: "ui-selector-indicator-arrow",
					EDIT_MODE: "ui-selector-edit-mode",
					PLUS_BUTTON: "ui-item-plus"
				},
				STATIC = {
					RADIUS_RATIO: 0.8
				},
				DEFAULT = {
					ITEM_SELECTOR: "." + classes.ITEM,
					INDICATOR_SELECTOR: "." + classes.INDICATOR,
					INDICATOR_TEXT_SELECTOR: "." + classes.INDICATOR_TEXT,
					INDICATOR_ARROW_SELECTOR: "." + classes.INDICATOR_ARROW,
					ITEM_DEGREE: 30,
					MAX_ITEM_NUMBER: 11,
					ITEM_RADIUS: -1,
					ITEM_START_DEGREE: 30,
					ITEM_END_DEGREE: 330,
					ITEM_NORMAL_SCALE: "scale(0.8235)",
					ITEM_ACTIVE_SCALE: "scale(1)",
					EMPTY_STATE_TEXT: "Selector is empty"
				},
				EVENT_TYPE = {
					/**
					 * Triggered when the active item is changed. Target is active item element.
					 * This event has detail information.
					 * - layer: Layer element on active item
					 * - layerIndex: Layer's index on active item
					 * - index: Item index on layer.
					 * - title: If Item has 'data-title' attribute, this value is that.
					 * @event selectoritemchange
					 * @member ns.widget.wearable.Selector
					 */
					ITEM_CHANGE: "selectoritemchange",
					/**
					 * Triggered when the active layer is changed. Target is active layer element.
					 * This event has detail information.
					 * - index: Layer index.
					 * @event selectorlayerchange
					 * @member ns.widget.wearable.Selector
					 */
					LAYER_CHANGE: "selectorlayerchange"
				},
				BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget();

			Selector.prototype = prototype;

			function buildLayers(element, items, options) {
				var layers = [],
					layer,
					i,
					len;

				removeLayers(element, options);
				len = items.length;
				for (i = 0; i < len; i++) {
					if (!(i % options.maxItemNumber)) {
						layer = document.createElement("div");
						layer.classList.add(classes.LAYER);
						element.appendChild(layer);
						layers.push(layer);
					}
					items[i].classList.add(classes.ITEM);
					layer.appendChild(items[i]);
					if (utilDom.getNSData(items[i], "active")) {
						items[i].classList.add(classes.ITEM_ACTIVE);
						layer.classList.add(classes.LAYER_ACTIVE);
					}
				}
				return layers;
			}

			function removeLayers(element, options) {
				var layers = element.getElementsByClassName(classes.LAYER),
					items,
					i,
					len,
					j,
					itemLength;

				if (layers.length) {
					// Delete legacy layers
					len = layers.length;
					for (i = 0; i < len; i++) {
						items = layers[0].querySelectorAll(options.itemSelector);
						itemLength = items.length;
						for (j = 0; j < itemLength; j++) {
							element.appendChild(items[j]);
						}
						element.removeChild(layers[0]);
					}
				}
			}

			/**
			 * Bind events
			 * @method bindEvents
			 * @param {Object} self
			 * @private
			 * @member ns.widget.wearable.Selector
			 */
			function bindEvents(self) {
				var element = self.element;

				events.enableGesture(
					element,

					new Gesture.Drag(),
					new Gesture.LongPress()
				);

				events.on(document, "rotarydetent", self, false);
				events.on(self._ui.indicator, "animationend webkitAnimationEnd", self, false);
				self.on("dragstart drag dragend click longpress", self, false);
			}

			/**
			 * Unbind events
			 * @method bindEvents
			 * @param {Object} self
			 * @private
			 * @member ns.widget.wearable.Selector
			 */
			function unbindEvents(self) {
				var element = self.element;

				events.disableGesture(
					element
				);
				events.off(document, "rotarydetent", self, false);
				self.off("dragstart drag dragend click longpress", self, false);
			}

			/**
			 * Remove ordering classes of layers base on parameter.
			 * @method removeLayerClasses
			 * @param {HTMLElement} activeLayer
			 * @private
			 * @member ns.widget.wearable.Selector
			 */
			function removeLayerClasses(activeLayer) {
				var activePrevLayer = activeLayer.previousElementSibling,
					activeNextLayer = activeLayer.nextElementSibling;

				if (activePrevLayer) {
					activePrevLayer.classList.remove(classes.LAYER_PREV);
				}
				if (activeNextLayer) {
					activeNextLayer.classList.remove(classes.LAYER_NEXT);
				}
				activeLayer.classList.remove(classes.LAYER_ACTIVE);
			}

			/**
			 * Add ordering classes of layers base on parameter.
			 * @method addLayerClasses
			 * @param {HTMLElement} validLayer
			 * @private
			 * @member ns.widget.wearable.Selector
			 */
			function addLayerClasses(validLayer) {
				var validPrevLayer = validLayer.previousElementSibling,
					validNextLayer = validLayer.nextElementSibling;

				if (validPrevLayer && validPrevLayer.classList.contains(classes.LAYER)) {
					validPrevLayer.classList.add(classes.LAYER_PREV);
				}

				if (validNextLayer && validNextLayer.classList.contains(classes.LAYER)) {
					validNextLayer.classList.add(classes.LAYER_NEXT);
				}
				validLayer.classList.add(classes.LAYER_ACTIVE);
				validLayer.style.transform = "none";
			}

			function setItemTransform(element, degree, radius, selfDegree, scale) {
				element.style.transform = "rotate(" + degree + "deg) " +
					"translate3d(0, " + -radius + "px, 0) " +
					"rotate(" + selfDegree + "deg) " +
					scale;
			}

			function setIndicatorTransform(element, selfDegree) {
				element.style.transform = "rotate(" + selfDegree + "deg) translate3d(0, 0, 0)";
				element.style.transition = "transform 300ms";
			}

			prototype._configure = function () {
				var self = this;
				/**
				 * Selector component options
				 * @property {string} itemSelector [options.itemSelector=".ui-item"] Selector item selector that style is css selector.
				 * @property {string} indicatorSelector [options.indicatorSelector=".ui-selector-indicator"] Selector indicator selector that style is css selector.
				 * @property {string} indicatorArrowSelector [options.indicatorArrowSelector=".ui-selector-indicator-arrow"] Selector indicator arrow selector that style is css style.
				 * @property {number} itemDegree [options.itemDegree=30] Each items locate degree.
				 * @property {number} itemRadius [options.itemRadius=-1] Items locate radius between center to it. Default value is determined by Selector element layout.
				 * @property {number} maxItemNumber [options.maxItemNumber=11] Max item number on one layer. If you change the itemDegree, we recommend to consider to modify this value for fit your Selector layout.
				 * @property {boolean} indicatorAutoControl [options.indicatorAutoControl=true] Indicator auto control switch. If you want to control your indicator manually, change this options to false.
				 */

				self.options = utilsObject.merge(self.options, {
					itemSelector: DEFAULT.ITEM_SELECTOR,
					indicatorSelector: DEFAULT.INDICATOR_SELECTOR,
					indicatorTextSelector: DEFAULT.INDICATOR_TEXT_SELECTOR,
					indicatorArrowSelector: DEFAULT.INDICATOR_ARROW_SELECTOR,
					itemDegree: DEFAULT.ITEM_DEGREE,
					itemRadius: DEFAULT.ITEM_RADIUS,
					maxItemNumber: DEFAULT.MAX_ITEM_NUMBER,
					indicatorAutoControl: true,
					emptyStateText: DEFAULT.EMPTY_STATE_TEXT
				});
			};


			/**
			 * Create indicator structure
			 * @param {Object} ui
			 * @param {HTMLElement} element
			 */
			function createIndicator(ui, element) {
				var indicator,
					indicatorText,
					indicatorSubText,
					indicatorIcon;

				indicator = document.createElement("div");
				indicator.classList.add(classes.INDICATOR);
				ui.indicator = indicator;
				indicatorIcon = document.createElement("div");
				indicatorIcon.classList.add(classes.INDICATOR_ICON);
				ui.indicatorIcon = indicatorIcon;
				ui.indicator.appendChild(ui.indicatorIcon);
				indicatorText = document.createElement("div");
				indicatorText.classList.add(classes.INDICATOR_TEXT);
				ui.indicatorText = indicatorText;
				indicator.appendChild(indicatorText);
				indicatorSubText = document.createElement("div");
				indicatorSubText.classList.add(classes.INDICATOR_SUBTEXT);
				ui.indicatorSubText = indicatorSubText;
				ui.indicator.appendChild(ui.indicatorSubText);
				element.appendChild(ui.indicator);
			}

			/**
			 * Build Selector component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					items = element.querySelectorAll(self.options.itemSelector),
					indicatorArrow,
					queryIndicator,
					queryIndicatorText,
					queryIndicatorArrow,
					layers;

				if (items && items.length) {

					layers = buildLayers(element, items, options);
					element.classList.add(classes.SELECTOR);

					if (options.indicatorAutoControl) {
						queryIndicator = element.querySelector(options.indicatorSelector);
						queryIndicatorArrow = element.querySelector(options.indicatorArrowSelector);
						queryIndicatorText = element.querySelector(options.indicatorTextSelector);

						if (queryIndicator) {
							ui.indicator = queryIndicator;
							if (queryIndicatorText) {
								ui.indicatorText = queryIndicatorText;
							}
						} else {
							createIndicator(ui, element);
						}
						if (queryIndicatorArrow) {
							ui.indicatorArrow = queryIndicatorArrow;
						} else {
							indicatorArrow = document.createElement("div");
							indicatorArrow.classList.add(classes.INDICATOR_ARROW);
							ui.indicatorArrow = indicatorArrow;
							element.appendChild(ui.indicatorArrow);
						}
					}
					ui.items = items;
					ui.layers = layers;
				} else {
					ns.warn("Please check your item selector option. Default value is '.ui-item'");
					return;
				}

				return element;
			};

			/**
			 * Init Selector component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._init = function (element) {
				var self = this,
					options = self.options,
					items = self._ui.items,
					activeLayerIndex = self._getActiveLayer(),
					activeItemIndex = self._getActiveItem(),
					validLayout = element.offsetWidth > element.offsetHeight ? element.offsetHeight : element.offsetWidth,
					i,
					len;

				self._started = false;
				self._enabled = true;
				self._activeItemIndex = activeItemIndex === null ? 0 : activeItemIndex;

				options.itemRadius = options.itemRadius < 0 ? validLayout / 2 * STATIC.RADIUS_RATIO : options.itemRadius;
				len = items.length;
				for (i = 0; i < len; i++) {
					utilDom.setNSData(items[i], "index", i);
					setItemTransform(items[i], DEFAULT.ITEM_END_DEGREE, options.itemRadius, -DEFAULT.ITEM_END_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
				}
				if (activeLayerIndex === null) {
					self._activeLayerIndex = 0;
					self._setActiveLayer(0);
				} else {
					self._activeLayerIndex = activeLayerIndex;
					self._setActiveLayer(activeLayerIndex);
				}
				return element;
			};

			/**
			 * Init items on layer
			 * @method _initItems
			 * @param {HTMLElement} layer
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._initItems = function (layer) {
				var self = this,
					options = self.options,
					items = layer.querySelectorAll(options.itemSelector),
					degree,
					i,
					len;

				len = items.length > options.maxItemNumber ? options.maxItemNumber : items.length;
				for (i = 0; i < len; i++) {
					degree = DEFAULT.ITEM_START_DEGREE + (options.itemDegree * i);
					setItemTransform(items[i], degree, options.itemRadius, -degree, DEFAULT.ITEM_NORMAL_SCALE);
				}

				if (self.options.plusButton) {
					len--;
				}

				if (!self._editModeEnabled && len > 0) {
					self._setActiveItem(self._activeItemIndex);
				}
			};

			prototype._addIconRemove = function (item, index) {
				var removeIconPosition,
					maxItemNumber = this.options.maxItemNumber,
					leftItemsCount,
					iconElement = document.createElement("div");

				leftItemsCount = parseInt(maxItemNumber / 2, 10) - 1;
				removeIconPosition = (index % maxItemNumber) > leftItemsCount ? "right" : "left";
				item.classList.add(classes.ITEM_REMOVABLE);
				iconElement.classList.add(classes.ITEM_ICON_REMOVE + "-" + removeIconPosition);

				item.appendChild(iconElement);
			};

			prototype._addRemoveIcons = function () {
				var self = this,
					isRemovable,
					item,
					items = self._ui.items,
					i;

				for (i = 0; i < items.length; i++) {
					item = items[i];
					isRemovable = utilDom.getNSData(item, "removable");
					if (isRemovable !== false) {
						self._addIconRemove(item, i);
					}
				}
			};

			prototype._removeRemoveIcons = function () {
				var self = this,
					i,
					items = self._ui.items,
					item;

				for (i = 0; i < items.length; i++) {
					item = items[i];
					if (item.classList.contains(classes.ITEM_REMOVABLE)) {
						item.innerHTML = "";
						item.classList.remove(classes.ITEM_REMOVABLE);
					}
				}
			};
			/**
			 * Bind events on Selector component
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._bindEvents = function () {
				bindEvents(this);
			};

			/**
			 * Handle events on Selector component
			 * @method handleEvent
			 * @param {Event} event
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "dragstart":
						self._onDragstart(event);
						break;
					case "drag":
						self._onDrag(event);
						break;
					case "dragend":
						self._onDragend(event);
						break;
					case "click":
						self._onClick(event);
						break;
					case "rotarydetent":
						self._onRotary(event);
						break;
					case "animationend":
					case "webkitAnimationEnd":
						self._onAnimationEnd(event);
						break;
					case "longpress":
						self._onLongPress(event);
						break;
					case "tizenhwkey":
						event.stopPropagation();
						self._onHWKey(event);
						break;
				}
			};

			/**
			 * Get the active layer
			 * @method _getActiveLayer
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._getActiveLayer = function () {
				var self = this,
					ui = self._ui,
					i,
					len;

				len = ui.layers.length;
				for (i = 0; i < len; i++) {
					if (ui.layers[i].classList.contains(classes.LAYER_ACTIVE)) {
						return i;
					}
				}
				return null;
			};

			/**
			 * Set the active layer
			 * @method _setActiveLayer
			 * @param {number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._setActiveLayer = function (index) {
				var self = this,
					ui = self._ui,
					active = self._activeLayerIndex,
					activeLayer = ui.layers[active],
					validLayer = ui.layers[index];

				if (activeLayer) {
					removeLayerClasses(activeLayer);
				}
				if (validLayer) {
					addLayerClasses(validLayer);
				}
				self._activeLayerIndex = index;
				if (ui.items.length > 0) {
					self._initItems(validLayer);
					events.trigger(validLayer, EVENT_TYPE, {
						index: index
					});
				}
			};

			/**
			 * Get the active item
			 * @method _getActiveItem
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._getActiveItem = function () {
				var self = this,
					ui = self._ui,
					i,
					len;

				len = ui.items.length;
				for (i = 0; i < len; i++) {
					if (ui.items[i].classList.contains(classes.ITEM_ACTIVE)) {
						return i;
					}
				}
				return null;
			};

			/**
			 * Set the active item
			 * @method _setActiveItem
			 * @param {number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._setActiveItem = function (index) {
				var self = this,
					element = self.element,
					ui = self._ui,
					items = ui.items,
					transform,
					newTransformStyle,
					active = element.querySelector("." + classes.ITEM_ACTIVE);

				index = index !== undefined ? index : 0;

				transform = items[index].style.transform || items[index].style.webkitTransform;

				if (active) {
					active.style.transform =
						active.style.transform.replace(DEFAULT.ITEM_ACTIVE_SCALE,
							DEFAULT.ITEM_NORMAL_SCALE);
					active.classList.remove(classes.ITEM_ACTIVE);
				}
				if (items.length) {
					items[index].classList.add(classes.ITEM_ACTIVE);
					newTransformStyle = transform.replace(DEFAULT.ITEM_NORMAL_SCALE, DEFAULT.ITEM_ACTIVE_SCALE);
					items[index].style.transform = newTransformStyle;
					items[index].style.webkitTransform = newTransformStyle;
					if (self.options.indicatorAutoControl) {
						self._setIndicatorIndex(index);
					}
					self._activeItemIndex = index;
					events.trigger(items[index], EVENT_TYPE.ITEM_CHANGE, {
						layer: ui.layers[self._activeLayerIndex],
						layerIndex: self._activeLayerIndex,
						index: index,
						title: utilDom.getNSData(items[index], "title")
					});
				}
			};

			/**
			 * Set indicator index. Handler direction was set by index value.
			 * @method _setIndicatorIndex
			 * @param {number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._setIndicatorIndex = function (index) {
				var self = this,
					ui = self._ui,
					item = ui.items[index],
					title = utilDom.getNSData(item, "title"),
					icon = utilDom.getNSData(item, "icon"),
					subtext = utilDom.getNSData(item, "subtitle"),
					iconActiveClass = classes.INDICATOR_ICON_ACTIVE,
					iconActiveWithTextClass = classes.INDICATOR_ICON_ACTIVE_WITH_TEXT,
					indicatorWithSubtitleClass = classes.INDICATOR_WITH_SUBTITLE,
					indicator = ui.indicator,
					indicatorText = ui.indicatorText,
					indicatorIcon = ui.indicatorIcon,
					indicatorSubText = ui.indicatorSubText,
					indicatorArrow = ui.indicatorArrow,
					indicatorClassList = indicator.classList,
					indicatorIconClassList = indicatorIcon.classList,
					idcIndex = index % self.options.maxItemNumber;

				if (title) {
					indicatorText.textContent = title;
					if (subtext) {
						indicatorClassList.add(indicatorWithSubtitleClass);
						indicatorSubText.textContent = subtext;
					} else {
						indicatorClassList.remove(indicatorWithSubtitleClass);
						indicatorSubText.textContent = "";
					}
					if (icon) {
						indicatorIconClassList.add(iconActiveWithTextClass);
					}
				} else {
					indicatorText.textContent = "";
					indicatorIconClassList.remove(iconActiveWithTextClass);
				}

				if (icon) {
					indicatorIconClassList.add(iconActiveClass);
					indicatorIcon.style.backgroundImage = "url(" + icon + ")";
					indicatorSubText.textContent = "";
				} else {
					indicatorIconClassList.remove(iconActiveClass);
					indicatorIconClassList.remove(iconActiveWithTextClass);
				}

				utilDom.setNSData(indicator, "index", index);

				setIndicatorTransform(indicatorArrow, DEFAULT.ITEM_START_DEGREE + self.options.itemDegree * idcIndex);
			};

			/**
			 * Dragstart event handler
			 * @method _onDragstart
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onDragstart = function () {
				this._started = true;
			};

			/**
			 * Clear active class on animation end
			 * @method _onAnimationEnd
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onAnimationEnd = function () {
				this._ui.indicator.classList.remove(classes.INDICATOR_ACTIVE);
			};

			/**
			 * Drag event handler
			 * @method _onDrag
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onDrag = function (event) {
				var self = this,
					ex = event.detail.estimatedX,
					ey = event.detail.estimatedY,
					pointedElement = document.elementFromPoint(ex, ey),
					index;

				if (this._started) {
					if (pointedElement && pointedElement.classList.contains(classes.ITEM)) {
						index = parseInt(utilDom.getNSData(pointedElement, "index"), 10);
						self._setActiveItem(index);
					}
				}
			};

			/**
			 * Dragend event handler
			 * @method _onDragend
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onDragend = function (event) {
				var self = this,
					ex = event.detail.estimatedX,
					ey = event.detail.estimatedY,
					pointedElement = document.elementFromPoint(ex, ey),
					index;

				if (pointedElement && pointedElement.classList.contains(classes.ITEM)) {
					index = parseInt(utilDom.getNSData(pointedElement, "index"), 10);
					self._setActiveItem(index);
				}

				this._started = false;
			};

			/**
			 * Click event handler
			 * @method _onClick
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onClick = function (event) {
				var self = this,
					ui = self._ui,
					pointedElement = document.elementFromPoint(event.pageX, event.pageY),
					indicatorClassList = self._ui.indicator.classList,
					targetElement = event.target,
					targetClassList = targetElement.classList,
					activeLayer,
					prevLayer,
					nextLayer,
					index;

				if (ui.items.length > 0) {
					activeLayer = ui.layers[self._activeLayerIndex];
					prevLayer = activeLayer.previousElementSibling;
					nextLayer = activeLayer.nextElementSibling;
				}

				if (targetElement.classList.contains(classes.LAYER_PREV) && prevLayer) {
					self._setItemAndLayer(self._activeLayerIndex - 1, self._activeLayerIndex * 11 - 1);
				} else if (targetElement.classList.contains(classes.LAYER_NEXT) && nextLayer) {
					self._setItemAndLayer(self._activeLayerIndex + 1, (self._activeLayerIndex + 1) * 11);
				} else if (self._enabled && !self._editModeEnabled) {
					if (pointedElement && (pointedElement.classList.contains(classes.INDICATOR) || pointedElement.parentElement.classList.contains(classes.INDICATOR))) {
						indicatorClassList.remove(classes.INDICATOR_ACTIVE);
						requestAnimationFrame(function () {
							indicatorClassList.add(classes.INDICATOR_ACTIVE);
						});
					}
					if (pointedElement && pointedElement.classList.contains(classes.ITEM)) {
						index = parseInt(utilDom.getNSData(pointedElement, "index"), 10);
						self._setActiveItem(index);
					}
				}

				if (self._editModeEnabled) {
					event.stopPropagation();

					if (targetClassList.contains(classes.ITEM_ICON_REMOVE + "-left") ||
						targetClassList.contains(classes.ITEM_ICON_REMOVE + "-right")) {
						index = parseInt(utilDom.getNSData(targetElement.parentElement,
							"index"), 10);
						self.removeItem(index);
					}
				}
			};

			/**
			 * Sets active layer and item
			 * @param {number} layerIndex
			 * @param {number} itemIndex
			 * @private
			 */
			prototype._setItemAndLayer = function (layerIndex, itemIndex) {
				this._activeItemIndex = itemIndex;
				this._changeLayer(layerIndex);
			};

			/**
			 * Rotary event handler
			 * @method _onRotary
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onRotary = function (event) {
				var self = this,
					ui = self._ui,
					options = self.options,
					direction = event.detail.direction,
					activeLayer = ui.layers[self._activeLayerIndex],
					activeLayerItemsLength = activeLayer &&
						activeLayer.querySelectorAll(options.itemSelector).length,
					prevLayer = activeLayer && activeLayer.previousElementSibling,
					nextLayer = activeLayer && activeLayer.nextElementSibling,
					bounceDegree;

				if (!options.indicatorAutoControl || !self._enabled || ui.items.length === 0) {
					return;
				}
				event.stopPropagation();

				if (direction === "CW") {
					// check length
					if (self._activeItemIndex === (activeLayerItemsLength + self._activeLayerIndex * options.maxItemNumber) - 1) {
						if (nextLayer && nextLayer.classList.contains(classes.LAYER_NEXT)) {
							self._setItemAndLayer(self._activeLayerIndex + 1, self._activeItemIndex + 1);
						} else {
							bounceDegree = DEFAULT.ITEM_START_DEGREE + options.itemDegree * (self._activeItemIndex % options.maxItemNumber);
							setIndicatorTransform(ui.indicatorArrow, bounceDegree + options.itemDegree / 3);
							setTimeout(function () {
								setIndicatorTransform(ui.indicatorArrow, bounceDegree);
							}, 100);
						}
					} else {
						self._changeItem(self._activeItemIndex + 1);
					}
				} else {
					// check 0
					if (self._activeItemIndex % options.maxItemNumber === 0) {
						if (prevLayer && prevLayer.classList.contains(classes.LAYER_PREV)) {
							self._setItemAndLayer(self._activeLayerIndex - 1, self._activeItemIndex - 1);
						} else {
							setIndicatorTransform(ui.indicatorArrow, DEFAULT.ITEM_START_DEGREE - DEFAULT.ITEM_START_DEGREE / 3);
							setTimeout(function () {
								setIndicatorTransform(ui.indicatorArrow, DEFAULT.ITEM_START_DEGREE);
							}, 100);
						}
					} else {
						self._changeItem(self._activeItemIndex - 1);
					}
				}
			};

			/**
			 * Hide items on layer
			 * @method _hideItems
			 * @param {HTMLElement} layer
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._hideItems = function (layer) {
				var self = this,
					items = layer.getElementsByClassName(classes.ITEM),
					i,
					len;

				layer.classList.add(classes.LAYER_HIDE);
				len = items.length;
				for (i = 0; i < len; i++) {
					setItemTransform(items[i], DEFAULT.ITEM_START_DEGREE, self.options.itemRadius, -DEFAULT.ITEM_START_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
				}

				setTimeout(function () {
					len = items.length;
					for (i = 0; i < len; i++) {
						setItemTransform(items[i], DEFAULT.ITEM_END_DEGREE, self.options.itemRadius, -DEFAULT.ITEM_END_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
					}
					layer.classList.remove(classes.LAYER_HIDE);
				}, 150);
			};

			/**
			 * Refresh Selector component
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._refresh = function () {
				var self = this,
					ui = self._ui,
					items = ui.items,
					options = self.options,
					element = self.element,
					i;

				self._removeRemoveIcons();

				for (i = 0; i < ui.items.length; i++) {
					utilDom.setNSData(items[i], "index", i);
				}

				self._addRemoveIcons();
				ui.layers = buildLayers(element, items, options);
				self._setActiveLayer(self._activeLayerIndex);
			};

			/**
			 * Change active layer
			 * @method _changeLayer
			 * @param {number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._changeLayer = function (index) {
				var self = this,
					layers = self._ui.layers,
					activeLayer = layers[self._activeLayerIndex];

				if (index < 0 || index > layers.length - 1) {
					ns.warn("Please insert index between 0 to layers number");
					return;
				}
				self._enabled = false;
				self._hideItems(activeLayer);
				setTimeout(function () {
					self._setActiveLayer(index);
					self._enabled = true;
				}, 150);

			};

			prototype._onLongPress = function () {
				var self = this;

				if (self.options.editable && self._editModeEnabled === false) {
					self._enableEditMode();
				} else {
					self._disableEditMode(); //TODO: Remove this when implementing reorder
				}
			};

			prototype._onHWKey = function (event) {
				var self = this;

				if (event.keyName === "back" && self.options.editable && self._editModeEnabled) {
					self._disableEditMode();
				}
			};

			prototype._addPlusButton = function () {
				var plusButtonElement;

				plusButtonElement = document.createElement("div");
				plusButtonElement.classList.add(classes.ITEM, classes.PLUS_BUTTON);
				setItemTransform(plusButtonElement, DEFAULT.ITEM_END_DEGREE,
					this.options.itemRadius, -DEFAULT.ITEM_END_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
				utilDom.setNSData(plusButtonElement, "removable", "false");

				this.addItem(plusButtonElement);
			};

			prototype._removePlusButton = function () {
				var self = this,
					items = self._ui.items,
					lastItemIndex = items.length - 1;

				if (items[lastItemIndex].classList.contains(classes.PLUS_BUTTON)) {
					self.removeItem(lastItemIndex);
				}
			};

			prototype._enableEditMode = function () {
				var self = this,
					ui = self._ui,
					length = ui.items.length,
					activeItem = ui.items[self._activeItemIndex];

				if (self.options.plusButton) {
					self._addPlusButton();
				}

				self.element.classList.add(classes.EDIT_MODE);
				self._addRemoveIcons();
				ui.indicatorText.textContent = "Edit mode";
				if (length > 0) {
					activeItem.classList.remove(classes.ITEM_ACTIVE);
					activeItem.style.transform = activeItem.style.transform.replace(DEFAULT.ITEM_ACTIVE_SCALE, DEFAULT.ITEM_NORMAL_SCALE);
				}
				events.off(document, "rotarydetent", self, false);
				self.off("dragstart drag dragend", self, false);
				events.on(window, "tizenhwkey", self, true);

				self._editModeEnabled = true;
			};

			prototype._disableEditMode = function () {
				var self = this,
					items,
					ui = self._ui,
					elementClassList = self.element.classList;

				if (self.options.plusButton) {
					self._removePlusButton();
				}

				elementClassList.remove(classes.EDIT_MODE);

				items = ui.items;
				if (items.length > 0) {
					items[self._activeItemIndex].classList.add(classes.ITEM_ACTIVE);
					self._removeRemoveIcons();
					self._setActiveItem(self._activeItemIndex);
				} else {
					ui.indicatorText.textContent = self.options.emptyStateText;
					ui.indicatorSubText.textContent = "";
					ui.indicatorIcon.classList.remove(classes.INDICATOR_ICON_ACTIVE,
						classes.INDICATOR_ICON_ACTIVE_WITH_TEXT);
				}
				events.on(document, "rotarydetent", self, false);
				self.on("dragstart drag dragend", self, false);
				events.off(window, "tizenhwkey", self, true);

				self._editModeEnabled = false;
			};

			/**
			 * Change active item on active layer
			 * @method _changeItem
			 * @param {number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._changeItem = function (index) {
				this._setActiveItem(index);
			};

			/**
			 * Change active item on active layer
			 * @method changeItem
			 * @param {number} index
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.changeItem = function (index) {
				this._changeItem(index);
			};

			/**
			 * Add new item
			 * @method addItem
			 * @param {HTMLElement} item
			 * @param {number} index
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.addItem = function (item, index) {
				var self = this,
					element = self.element,
					items = element.querySelectorAll(self.options.itemSelector),
					ui = self._ui;

				removeLayers(self.element, self.options);
				if (index >= 0 && index < ui.items.length) {
					element.insertBefore(item, items[index]);
				} else {
					element.appendChild(item);
				}
				ui.items = element.querySelectorAll(self.options.itemSelector);
				self._refresh();
			};

			/**
			 * Remove item on specific layer
			 * @method removeItem
			 * @param {number} index
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.removeItem = function (index) {
				var self = this,
					ui = self._ui,
					element = self.element,
					length,
					itemsOnLayer = self.options.maxItemNumber;

				removeLayers(self.element, self.options);
				element.removeChild(ui.items[index]);
				ui.items = element.querySelectorAll(self.options.itemSelector);
				length = ui.items.length;

				/** This block checks if the removed item is last on active layer, and if this
				/** condition is true, it changes active layer to previous one.
				 */
				if ((index % itemsOnLayer === 0) && (index === ui.items.length - 1)) {
					self._changeLayer(self._activeLayerIndex - 1);
				}

				if (self._activeItemIndex >= length) {
					self._activeItemIndex = length - 1;
				}
				self._refresh();
			};

			prototype._destroy = function () {
				var self = this,
					activeItem;

				unbindEvents(self);
				activeItem = self._getActiveItem();
				if (activeItem !== null) {
					self._ui.items[activeItem].classList.remove(classes.ITEM_ACTIVE);
				}
				self._ui = null;
			};

			/**
			 * Disable Selector
			 * @method _disable
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._disable = function () {
				this._enabled = false;
			};

			/**
			 * Enable Selector
			 * @method _enable
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._enable = function () {
				this._enabled = true;
			};

			ns.widget.wearable.Selector = Selector;
			engine.defineWidget(
				"Selector",
				".ui-selector",
				[
					"changeItem",
					"addItem",
					"removeItem",
					"enable",
					"disable"
				],
				Selector,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.Selector;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
