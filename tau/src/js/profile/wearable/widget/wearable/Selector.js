/*global window, define */
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
 * {String} itemSelector [options.itemSelector=".ui-item"] or You can set attribute on tag [data-item-selector=".ui-item] Selector item selector that style is css selector.
 * {String} indicatorSelector [options.indicatorSelector=".ui-selector-indicator"] or You can set attribute on tag [data-indicator-selector=".ui-selector-indicator"] Selector indicator selector that style is css selector.
 * {String} indicatorArrowSelector [options.indicatorArrowSelector=".ui-selector-indicator-arrow"] or You can set attribute on tag [data-indicator-arrow-selector=".ui-selector-indicator-arrow"] Selector indicator arrow selector that style is css style.
 * {Number} itemDegree [options.itemDegree=30] or You can set attribute on tag [data-item-degree=30] Items degree each other.
 * {Number} itemRadius [options.itemRadius=140] or You can set attribute on tag [data-item-radius=140] Items radius between center and it.
 * {Number} maxItemNumber [options.maxItemNumber=11] or You can set attribute on tag [data-max-item-number=11] Max item number on one layer. If you change the itemDegree, we recommend to consider to modify this value for fit your Selector layout.
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
			"../../../../core/event/gesture",
			"../wearable"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				utilDom = ns.util.DOM,
				Gesture = ns.event.gesture,
				events = ns.event,
				utilsObject = ns.util.object,
				Selector = function () {
					var self = this;
					self._ui = {};
					self.options = {};
				},
				classes = {
					SELECTOR: "ui-selector",
					LAYER: "ui-layer",
					LAYER_ACTIVE: "ui-layer-active",
					LAYER_PREV: "ui-layer-prev",
					LAYER_PREV_PREV: "ui-layer-prev-prev",
					LAYER_NEXT: "ui-layer-next",
					LAYER_NEXT_NEXT: "ui-layer-next-next",
					LAYER_HIDE: "ui-layer-hide",
					ITEM: "ui-item",
					ITEM_ACTIVE: "ui-item-active",
					INDICATOR: "ui-selector-indicator",
					INDICATOR_NEXT_END: "ui-selector-indicator-next-end",
					INDICATOR_PREV_END: "ui-selector-indicator-prev-end",
					INDICATOR_ARROW: "ui-selector-indicator-arrow"
				},
				STATIC = {
					RADIUS_RATIO: 0.78
				},
				DEFAULT = {
					ITEM_SELECTOR: "."+ classes.ITEM,
					INDICATOR_SELECTOR: "." + classes.INDICATOR,
					INDICATOR_ARROW_SELECTOR: "." + classes.INDICATOR_ARROW,
					ITEM_DEGREE: 30,
					MAX_ITEM_NUMBER: 11,
					ITEM_RADIUS: -1,
					ITEM_START_DEGREE: 30,
					ITEM_END_DEGREE: 330,
					ITEM_NORMAL_SCALE: "scale(1)",
					ITEM_ACTIVE_SCALE: "scale(1.18)"
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
					i, len;

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
					i, len, j, itemLength;
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
				var element= self.element;
				events.enableGesture(
					element,

					new Gesture.Drag()
				);
				events.on(document, "rotarydetent", self, false);
				events.on(element, "dragstart drag dragend click", self, false);
			}

			/**
			 * Unbind events
			 * @method bindEvents
			 * @param {Object} self
			 * @private
			 * @member ns.widget.wearable.Selector
			 */
			function unbindEvents(self) {
				var element= self.element;
				events.disableGesture(
					element
				);
				events.off(document, "rotarydetent", self, false);
				events.off(element, "dragstart drag dragend click", self, false);
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
					activeNextLayer = activeLayer.nextElementSibling,
					ppLayer, nnLayer;

				if (activePrevLayer) {
					activePrevLayer.classList.remove(classes.LAYER_PREV);
					ppLayer = activePrevLayer.previousElementSibling;
					ppLayer && ppLayer.classList.remove(classes.LAYER_PREV_PREV);
				}
				if (activeNextLayer) {
					activeNextLayer.classList.remove(classes.LAYER_NEXT);
					nnLayer = activeNextLayer.nextElementSibling;
					nnLayer && nnLayer.classList.remove(classes.LAYER_NEXT_NEXT);
				}
				activeLayer.classList.remove(classes.LAYER_ACTIVE);
			}

			/**
			 * Add ordering classes of layers base on parameter.
			 * @method addLayerClasses
			 * @param {HTMLElement} activeLayer
			 * @private
			 * @member ns.widget.wearable.Selector
			 */
			function addLayerClasses(self, validLayer) {
				var options = self.options,
					validPrevLayer = validLayer.previousElementSibling,
					validNextLayer = validLayer.nextElementSibling,
					radius = options.itemRadius,
					prevLayerDeg, ppLayerDeg, nextLayerDeg, nnLayerDeg,
					ppLayer, nnLayer;

				if (validPrevLayer && validPrevLayer.classList.contains(classes.LAYER)) {
					validPrevLayer.classList.add(classes.LAYER_PREV);
					prevLayerDeg = DEFAULT.ITEM_END_DEGREE + DEFAULT.ITEM_DEGREE / 6;
					setItemTransform(validPrevLayer, prevLayerDeg, radius, -prevLayerDeg, DEFAULT.ITEM_NORMAL_SCALE);
					ppLayer = validPrevLayer.previousElementSibling;
					ppLayerDeg = DEFAULT.ITEM_END_DEGREE + DEFAULT.ITEM_DEGREE / 4;
					if (ppLayer && ppLayer.classList.contains(classes.LAYER)) {
						ppLayer.classList.add(classes.LAYER_PREV_PREV);
						setItemTransform(ppLayer, ppLayerDeg, radius, -ppLayerDeg, DEFAULT.ITEM_NORMAL_SCALE);
					}
				}

				if (validNextLayer && validNextLayer.classList.contains(classes.LAYER)) {
					validNextLayer.classList.add(classes.LAYER_NEXT);
					nextLayerDeg = DEFAULT.ITEM_START_DEGREE - DEFAULT.ITEM_DEGREE / 6;
					setItemTransform(validNextLayer, nextLayerDeg, radius, -nextLayerDeg, DEFAULT.ITEM_NORMAL_SCALE);
					nnLayer = validNextLayer.nextElementSibling;
					nnLayerDeg = DEFAULT.ITEM_START_DEGREE - DEFAULT.ITEM_DEGREE / 4;
					if (nnLayer && nnLayer.classList.contains(classes.LAYER)) {
						nnLayer.classList.add(classes.LAYER_NEXT_NEXT);
						setItemTransform(nnLayer, nnLayerDeg, radius, -nnLayerDeg, DEFAULT.ITEM_NORMAL_SCALE);
					}
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
				element.style.transform = "rotate(" + selfDegree + "deg) ";
				element.style.transition = "transform 300ms";
			}

			prototype._configure = function() {
				var self = this;
				/**
				 * Selector component options
				 * @property {string} itemSelector [options.itemSelector=".ui-item"] Selector item selector that style is css selector.
				 * @property {string} indicatorSelector [options.indicatorSelector=".ui-selector-indicator"] Selector indicator selector that style is css selector.
				 * @property {string} indicatorArrowSelector [options.indicatorArrowSelector=".ui-selector-indicator-arrow"] Selector indicator arrow selector that style is css style.
				 * @property {Number} itemDegree [options.itemDegree=30] Each items locate degree.
				 * @property {Number} itemRadius [options.itemRadius=-1] Items locate radius between center to it. Default value is determined by Selector element layout.
				 * @property {Number} maxItemNumber [options.maxItemNumber=11] Max item number on one layer. If you change the itemDegree, we recommend to consider to modify this value for fit your Selector layout.
				 * @property {boolean} indicatorAutoControl [options.indicatorAutoControl=true] Indicator auto control switch. If you want to control your indicator manually, change this options to false.
				 */
				self.options = utilsObject.merge(self.options, {
					itemSelector: DEFAULT.ITEM_SELECTOR,
					indicatorSelector: DEFAULT.INDICATOR_SELECTOR,
					indicatorArrowSelector: DEFAULT.INDICATOR_ARROW_SELECTOR,
					itemDegree: DEFAULT.ITEM_DEGREE,
					itemRadius: DEFAULT.ITEM_RADIUS,
					maxItemNumber: DEFAULT.MAX_ITEM_NUMBER,
					indicatorAutoControl: true
				});
			};

			/**
			 * Build Selector component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._build = function(element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					items = element.querySelectorAll(self.options.itemSelector),
					indicator,
					indicatorArrow,
					queryIndicator,
					queryIndicatorArrow,
					layers;

				if (items && items.length) {

					layers = buildLayers(element, items, options);
					element.classList.add(classes.SELECTOR);

					if (options.indicatorAutoControl) {
						queryIndicator = element.querySelector(options.indicatorSelector);
						queryIndicatorArrow = element.querySelector(options.indicatorArrowSelector);

						if (queryIndicator) {
							ui.indicator = queryIndicator;
						} else {
							indicator = document.createElement("div");
							indicator.classList.add(classes.INDICATOR);
							ui.indicator = indicator;
							element.appendChild(ui.indicator);
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
					console.warn("Please check your item selector option. Default value is '.ui-item'");
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
			prototype._init = function(element) {
				var self = this,
					options = self.options,
					items = self._ui.items,
					activeLayerIndex = self._getActiveLayer(),
					activeItemIndex = self._getActiveItem(),
					validLayout = element.offsetWidth > element.offsetHeight ? element.offsetHeight : element.offsetWidth,
					i, len;

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
			prototype._initItems = function(layer) {
				var self = this,
					options = self.options,
					items = layer.querySelectorAll(options.itemSelector),
					degree,
					i, len;

				len = items.length > options.maxItemNumber ? options.maxItemNumber : items.length;
				for (i = 0; i < len; i++) {
					degree = DEFAULT.ITEM_START_DEGREE + (options.itemDegree * i);
					setItemTransform(items[i], degree, options.itemRadius, -degree, DEFAULT.ITEM_NORMAL_SCALE);
				}

				self._setActiveItem(self._activeItemIndex);
			};

			/**
			 * Bind events on Selector component
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._bindEvents = function() {
				bindEvents(this);
			};

			/**
			 * Handle events on Selector component
			 * @method handleEvent
			 * @param {Event} event
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.handleEvent = function(event) {
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
				}
			};

			/**
			 * Get the active layer
			 * @method _getActiveLayer
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._getActiveLayer = function() {
				var self = this,
					ui = self._ui,
					i, len;

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
			 * @param {Number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._setActiveLayer = function(index) {
				var self = this,
					ui = self._ui,
					active = self._activeLayerIndex,
					activeLayer = ui.layers[active],
					validLayer = ui.layers[index];
				if (activeLayer) {
					removeLayerClasses(activeLayer);
				}
				if (validLayer) {
					addLayerClasses(self, validLayer);
				}
				self._activeLayerIndex = index;
				self._initItems(validLayer);
				events.trigger(validLayer, EVENT_TYPE, {
					index: index
				})
			};

			/**
			 * Get the active item
			 * @method _getActiveItem
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._getActiveItem = function() {
				var self = this,
					ui = self._ui,
					i, len;

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
			 * @param {Number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._setActiveItem = function(index) {
				var self = this,
					element = self.element,
					ui = self._ui,
					options = self.options,
					items = ui.items,
					index = index !== undefined ? index : 0,
					active = element.querySelector("." + classes.ITEM_ACTIVE);

				if (active) {
					active.style.transform = active.style.transform.replace(DEFAULT.ITEM_ACTIVE_SCALE, DEFAULT.ITEM_NORMAL_SCALE);
					active.classList.remove(classes.ITEM_ACTIVE);
				}
				if (items.length) {
					items[index].classList.add(classes.ITEM_ACTIVE);
					items[index].style.transform = items[index].style.transform.replace(DEFAULT.ITEM_NORMAL_SCALE, DEFAULT.ITEM_ACTIVE_SCALE);
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
			 * @param {Number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._setIndicatorIndex = function(index) {
				var self = this,
					ui = self._ui,
					item = ui.items[index],
					title = utilDom.getNSData(item, "title"),
					indicator = ui.indicator,
					indicatorArrow = ui.indicatorArrow,
					idcIndex = index % self.options.maxItemNumber;

				if (indicator.children.length === 0) {
					indicator.textContent = title ? title : "ITEM";
				}

				utilDom.setNSData(indicator, "index", index);

				setIndicatorTransform(indicatorArrow, DEFAULT.ITEM_START_DEGREE + self.options.itemDegree * idcIndex);
			};

			/**
			 * Dragstart event handler
			 * @method _onDragstart
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onDragstart = function(event) {
				this._started = true;
			};

			/**
			 * Drag event handler
			 * @method _onDrag
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onDrag = function(event) {
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
			prototype._onDragend = function(event) {
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
			prototype._onClick = function(event) {
				var self = this,
					pointedElement = document.elementFromPoint(event.pageX, event.pageY),
					index;

				if (!self._enabled) {
					return;
				}
				if (pointedElement && pointedElement.classList.contains(classes.ITEM)) {
					index = parseInt(utilDom.getNSData(pointedElement, "index"), 10);
					self._setActiveItem(index);
				}
			};

			/**
			 * Rotary event handler
			 * @method _onRotary
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._onRotary = function(event) {
				var self = this,
					ui = self._ui,
					options = self.options,
					direction = event.detail.direction,
					activeLayer = ui.layers[self._activeLayerIndex],
					activeLayerItemsLength = activeLayer.querySelectorAll(options.itemSelector).length,
					prevLayer = activeLayer.previousElementSibling,
					nextLayer = activeLayer.nextElementSibling,
					bounceDegree;

				if (!options.indicatorAutoControl || !self._enabled) {
					return;
				}
				event.stopPropagation();

				if (direction === "CW") {
					// check length
					if (self._activeItemIndex === (activeLayerItemsLength + self._activeLayerIndex * options.maxItemNumber) - 1) {
						if (prevLayer && prevLayer.classList.contains(classes.LAYER_PREV)) {
							self._activeItemIndex = self._activeItemIndex - activeLayerItemsLength - prevLayer.querySelectorAll(options.itemSelector).length + 1;
							self._changeLayer(self._activeLayerIndex - 1);
						} else {
							bounceDegree = DEFAULT.ITEM_START_DEGREE + options.itemDegree * (self._activeItemIndex % options.maxItemNumber);
							setIndicatorTransform(ui.indicatorArrow, bounceDegree + options.itemDegree / 3);
							//setIndicatorTransform(ui.indicatorArrow, options.itemDegree * self._activeItemIndex + options.itemDegree / 3);
							setTimeout(function() {
								setIndicatorTransform(ui.indicatorArrow, bounceDegree);
							}, 100)
						}
					} else {
						self._changeItem(self._activeItemIndex + 1);
					}
				} else {
					// check 0
					if (self._activeItemIndex % options.maxItemNumber === 0) {
						if (nextLayer && nextLayer.classList.contains(classes.LAYER_NEXT)) {
							self._activeItemIndex = self._activeItemIndex + activeLayerItemsLength + nextLayer.querySelectorAll(options.itemSelector).length - 1;
							self._changeLayer(self._activeLayerIndex + 1);
						} else {
							setIndicatorTransform(ui.indicatorArrow, DEFAULT.ITEM_START_DEGREE - DEFAULT.ITEM_START_DEGREE / 3);
							setTimeout(function() {
								setIndicatorTransform(ui.indicatorArrow, DEFAULT.ITEM_START_DEGREE);
							}, 100)
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
			prototype._hideItems = function(layer) {
				var self = this,
					options = self.options,
					items = layer.getElementsByClassName(classes.ITEM),
					i, len;
				layer.classList.add(classes.LAYER_HIDE);
				len = items.length;
				for (i = 0; i < len; i++) {
					setItemTransform(items[i], DEFAULT.ITEM_START_DEGREE, self.options.itemRadius, -DEFAULT.ITEM_START_DEGREE, DEFAULT.ITEM_NORMAL_SCALE);
				}

				setTimeout(function() {
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
			prototype._refresh = function() {
				var self = this,
					ui = self._ui,
					options = self.options,
					element = self.element;

				ui.layers = buildLayers(element, ui.items, options);
				self._setActiveLayer(self._activeLayerIndex);
			};

			/**
			 * Change active layer
			 * @method _changeLayer
			 * @param {Number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._changeLayer = function(index) {
				var self = this,
					layers = self._ui.layers,
					activeLayer = layers[self._activeLayerIndex];

				if (index < 0 || index > layers.length - 1) {
					console.warn("Please insert index between 0 to layers number");
					return;
				}
				self._enabled = false;
				self._hideItems(activeLayer);
				setTimeout(function() {
					self._setActiveLayer(index);
					self._enabled = true;
				}, 150);

			};

			/**
			 * Change active item on active layer
			 * @method _changeItem
			 * @param {Number} index
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._changeItem = function(index) {
				this._setActiveItem(index);
			};

			/**
			 * Change active item on active layer
			 * @method changeItem
			 * @param {Number} index
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.changeItem = function(index) {
				this._changeItem(index);
			};

			/**
			 * Add new item
			 * @method addItem
			 * @param {HTMLElement} item
			 * @param {Number} index
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.addItem = function(item, index) {
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
			 * @param {Number} index
			 * @public
			 * @member ns.widget.wearable.Selector
			 */
			prototype.removeItem = function(index) {
				var self = this,
					ui = self._ui,
					element = self.element;

				removeLayers(self.element, self.options);
				element.removeChild(ui.items[index]);
				ui.items = element.querySelectorAll(self.options.itemSelector);
				self._refresh();
			};

			prototype._destroy = function() {
				var self = this;
				unbindEvents(self);
				self._ui = null;
			};

			/**
			 * Disable Selector
			 * @method _disable
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._disable = function() {
				this._enabled = false;
			};

			/**
			 * Enable Selector
			 * @method _enable
			 * @protected
			 * @member ns.widget.wearable.Selector
			 */
			prototype._enable = function() {
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
