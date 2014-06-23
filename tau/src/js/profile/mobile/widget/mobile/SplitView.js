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
 * #Split View Widget
 *
 * SplitView is a widget, which displays two children separated with a movable divider.
 * It allows to change the size ratio of its children and supports two orientations.
 * @class ns.widget.SplitView
 * @extends ns.widget.mobile.BaseWidgetMobile
 */
(function (document, ns) {
	'use strict';
	//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/DOM",
			"../../../../core/theme",
			"../../../../core/util/selectors",
			"../../../../core/event",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile",
			"./Scrollview"
		],
		function () {
			//>>excludeEnd('tauBuildExclude');
			var BaseWidgetMobile = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				selectors = ns.util.selectors,
				DOM = ns.util.DOM,
				events = ns.event,
				classes,

				SplitView = function () {
					var self = this;
					/**
					 *
					 * @property {Object} options
					 * @property {boolean} [options.fixed=false] if true, the divider can't be manipulated
					 * @property {boolean} [options.dividerVertical=false] specifies divider orientation
					 * @property {Array} [options.ratio=[0.5, 0.5]] width/height distribution between panes
					 * @member ns.widget.SplitView
					 * @instance
					 */
					/** @expose */
					self.options = {
						fixed : false,
						dividerVertical : false,
						ratio : [0.5, 0.5]
					};
					/**
					 * @property {Object} movementData helper object for movement events
					 * @property {number} [movementData.lastX=0] last X movement
					 * @property {number} [movementData.lastY=0] last Y movement
					 * @property {boolean} [movementData.hadMovement=false] indicates whether there was a down event
					 * @member ns.widget.SplitView
					 * @instance
					 */
					self.movementData = {
						lastX : 0,
						lastY : 0,
						hadDownEvent : false
					};
					/**
					 * @property {Object} dimensions
					 * @property {number} [dimensions.containerWidth=0] the width available for split view
					 * @property {number} [dimensions.containerHeight=0] the height available for split view
					 * @property {number} [dimensions.splitterSize=0] splitter bar size
					 * @property {number} [dimensions.splitterTouchSize=0] splitter touch area size
					 * @property {number} [dimensions.splitterHandleSize=0] splitter handle size
					 * @property {Array} [dimensions.originalRatio] original ratio set for this split view
					 * @property {number} [dimensions.minPaneSize=20] minimum size of a pane
					 * @property {number} [dimensions.maxPaneSize=0] maximum size of a pane
					 * @member ns.widget.SplitView
					 * @instance
					 */
					self.dimensions = {
						containerWidth : 0,
						containerHeight : 0,
						splitterSize : 0,
						splitterTouchSize : 0,
						splitterHandleSize : 0,
						originalRatio : [],
						minPaneSize : 20,
						maxPaneSize : 0
					};
					/**
					 * @property {Array} panes split view panes
					 * @member ns.widget.SplitView
					 * @instance
					 */
					self.panes = null;
					/**
					 * @property {HTMLElement} splitterTouchElement splitter touch element
					 * @member ns.widget.SplitView
					 * @instance
					 */
					self.splitterTouchElement = null;
					/**
					 * @property {HTMLElement} splitterBar splitter element displaying a bar
					 * @member ns.widget.SplitView
					 * @instance
					 */
					self.splitterBar = null;
					/**
					 * @property {HTMLElement} splitterHandle splitter handle element
					 * @member ns.widget.SplitView
					 * @instance
					 */
					self.splitterHandle = null;
					/**
					 * @property {Object} eventHandlers an object containing event handlers
					 * @member ns.widget.SplitView
					 * @instance
					 */
					self.eventHandlers = {};
				},
				prototype = new BaseWidgetMobile();

			SplitView.classes = {
				uiPane :'ui-pane',
				uiSplitView : 'ui-splitview',
				uiDirectionHorizontal : 'ui-direction-horizontal',
				uiDirectionVertical : 'ui-direction-vertical',
				uiPageActive : 'ui-page-active',
				uiSplitter : 'ui-spliter',
				uiSplitterBar : 'ui-spliter-bar',
				uiSplitterHandle : 'ui-spliter-handle',
				uiSplitterActive : 'ui-spliter-active',
				uiFixed : 'ui-fixed'
			};
			classes = SplitView.classes;

			/**
			 * Build the widget. This method performs all required DOM modifications.
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.SplitView
			 * @protected
			 * @instance
			 */
			prototype._build = function (element) {
				var panes = null,
					panesCount = 0,
					splitterTouchElement = null,
					splitterBar = null,
					handle = null,
					i = 0,
					elementClasses = element.classList,
					options = this.options,
					pane = null;

				panes = selectors.getChildrenBySelector(element, 'div');
				panesCount = panes.length;
				if (panesCount !== 2) {
					if (panesCount < 2) {
						for (i = panesCount; i < 2; ++i) {
							pane = document.createElement('div');
							element.appendChild(pane);
						}
					} else {
						for (i = 2; i < panesCount; ++i) {
							element.removeChild(panes[i]);
						}
						panes.length = 2;
					}

					panes = selectors.getChildrenBySelector(element, 'div');
					panesCount = panes.length;
				}

				for (i = 0; i < 2; i++) {
					panes[i].classList.add(classes.uiPane);
				}

				elementClasses.add(classes.uiSplitView);
				elementClasses.add(options.dividerVertical ? classes.uiDirectionHorizontal : classes.uiDirectionVertical);

				splitterTouchElement = document.createElement('a');
				splitterTouchElement.classList.add(classes.uiSplitter);
				splitterBar = document.createElement('div');
				splitterBar.classList.add(classes.uiSplitterBar);
				handle = document.createElement('div');
				handle.classList.add(classes.uiSplitterHandle);
				splitterBar.appendChild(handle);
				if (options.fixed) {
					splitterBar.classList.add(classes.uiFixed);
				}
				DOM.insertNodeAfter(panes[0], splitterTouchElement);
				DOM.insertNodeAfter(splitterTouchElement, splitterBar);
				return element;
			};

			/**
			 * Init the widget. This is the place where it can init variables not related to DOM modifications.
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.SplitView
			 * @protected
			 * @instance
			 */
			prototype._init = function (element) {
				var self = this,
					options = self.options,
					ratio = options.ratio;
				options.ratio = convertRatio(ratio);
				self.dimensions.originalRatio = options.ratio.slice();
				self.panes = selectors.getChildrenByClass(element, classes.uiPane);
				self.splitterTouchElement = selectors.getChildrenByTag(element, 'a')[0];
				self.splitterBar = selectors.getChildrenByClass(element, classes.uiSplitterBar)[0];
				self.splitterHandle = selectors.getChildrenByTag(self.splitterBar, 'div')[0];
				return element;
			};

			/**
			 * Registers widget's event listeners
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @return {HTMLElement}
			 * @member ns.widget.SplitView
			 * @instance
			 */
			prototype._bindEvents = function (element) {
				var eventHandlers = this.eventHandlers,
					splitterTouchElement = this.splitterTouchElement,
					page = findParentPage(this.element);
				eventHandlers.onTouchEvent = onTouchEvent.bind(null, this);
				eventHandlers.onPageShow = onPageShow.bind(null, this);
				if (page) {
					page.addEventListener("pageshow", eventHandlers.onPageShow, true);
				}
				splitterTouchElement.addEventListener("vmousedown", eventHandlers.onTouchEvent, true);
				return element;
			};

			/**
			 * Destroys the widget and unregisters event listeners
			 * @method _destroy
			 * @protected
			 * @member ns.widget.SplitView
			 * @instance
			 */
			prototype._destroy = function () {
				var eventHandlers = this.eventHandlers,
					splitterTouchElement = this.splitterTouchElement,
					page = findParentPage(this.element);
				page.removeEventListener("pageshow", eventHandlers.onPageShow, true);
				splitterTouchElement.removeEventListener("vmousedown", eventHandlers.onTouchEvent, true);
			};

			/**
			 * Finds nearest ancestor of given element being a {@link ns.widget.mobile.Page}
			 * @method findParentPage
			 * @private
			 * @static
			 * @return {HTMLElement} element's ancestor bounded to a {@link ns.widget.mobile.Page}
			 * @member ns.widget.SplitView
			 */
			function findParentPage(element) {
				return selectors.getClosestByClass(element, ns.widget.mobile.Page.classes.uiPage);
			}

			/**
			 * Called when the page is shown
			 * @method onPageShow
			 * @param {SplitView} self
			 * @private
			 * @static
			 * @member ns.widget.SplitView
			 */
			function onPageShow(self) {
				self._refresh();
			}

			/**
			 * Called when a touch or mouse event occured on the splitter. After receiving down event it sets
			 * itself as a callback for further events like "move" and "up".
			 * @method onTouchEvent
			 * @param {SplitView} self
			 * @param {TouchEvent} event
			 * @private
			 * @static
			 * @member ns.widget.SplitView
			 */
			function onTouchEvent(self, event) {
				var splitView = self.widget(),
					movementData = self.movementData,
					localX = event.clientX,
					localY = event.clientY,
					shiftX = localX - movementData.lastX,
					shiftY = localY - movementData.lastY,
					fixed = self.options.fixed,
					canMove = movementData.hadDownEvent,
					isHorizontal = self.options.dividerVertical,
					shiftArea = isHorizontal ? self.dimensions.containerWidth : self.dimensions.containerHeight,
					eventListener = self.eventHandlers.onTouchEvent,
					activeClass = SplitView.classes.uiSplitterActive,
					splitterClasses = self.splitterBar.classList,
					ratio = self.options.ratio,
					ratioDiff = 0;

				if (fixed) {
					return;
				}

				switch (event.type) {
					case "vmousedown":
						movementData.lastX = localX;
						movementData.lastY = localY;
						movementData.hadDownEvent = true;
						splitView.addEventListener("vmousemove", eventListener, true);
						splitView.addEventListener("vmouseup", eventListener, true);
						splitterClasses.add(activeClass);
						break;
					case "vmousemove":
						if (canMove) {
							ratioDiff = (isHorizontal ? shiftX : shiftY) / shiftArea;
							ratio.forEach(function(value, i) {
								var shiftDirection = (i === 0 ? 1 : -1);
								ratio[i] = value + (ratioDiff * shiftDirection);
							});
							self._layout();
							self._refreshChildren();
							movementData.lastX = localX;
							movementData.lastY = localY;
						}
						break;
					case "vmouseup":
						movementData.hadDownEvent = false;
						splitView.removeEventListener("vmousemove", eventListener);
						splitView.removeEventListener("vmouseup", eventListener);
						splitterClasses.remove(activeClass);
						break;
				}
			}
			/**
			 * Measures and layouts the children.
			 * @method _refresh
			 * @protected
			 * @member ns.widget.SplitView
			 * @instance
			 */
			prototype._refresh = function () {
				var self = this,
					element = self.widget();

				self._measureSplitter();
				if (self._getContainerSize(element)) {
					self._layout();
				}
			};

			/**
			 * Checks available width and height for splitted views. If the SplitView is wrapped by a {@link=ns.widget.mobile.Scrollview},
			 * it will read the height of Scrollview clip.
			 * @method _getContainerSize
			 * @param {HTMLElement} element the element of SplitView widget
			 * @protected
			 * @instance
			 * @return {boolean} true if container has its dimensions available
			 * @member ns.widget.SplitView
			 */
			prototype._getContainerSize = function (element) {
				var dimensions = this.dimensions,
					parentElement = element.parentElement;

				dimensions.containerWidth = DOM.getCSSProperty(element, "width", 0, "integer");
				if (hasClass(parentElement, ns.widget.mobile.Scrollview.classes.view) && parentElement.parentElement) {
					dimensions.containerHeight = DOM.getCSSProperty(parentElement.parentElement, "height", 0, "integer");
				} else {
					dimensions.containerHeight = DOM.getCSSProperty(element, "height", 0, "integer");
				}
				return dimensions.containerWidth || dimensions.containerHeight;
			};

			/**
			 * If the ratio is given as a comma separated string, this method will convert it to Array.
			 * @method convertRatio
			 * @param {string} ratio
			 * @private
			 * @static
			 * @return {Array} parsed ratio
			 * @member ns.widget.SplitView
			 */
			function convertRatio(ratio) {
				var ratioArray = [],
					length = 0,
					i = 0;
				if (!Array.isArray(ratio)) {
					ratioArray = ratio.split(',');
					length = ratioArray.length;
					for (;i < length; i++) {
						ratioArray[i] = parseFloat(ratioArray[i]);
					}
					return ratioArray;
				}
				return ratio;
			}

			/**
			 * Layouts child panes basing on th orientation and ratio.
			 * @method _layout
			 * @param {boolean} ignoreMinMax if set to true, minimum and maximum pane sizes will be ignored
			 * @protected
			 * @instance
			 * @member ns.widget.SplitView
			 */
			prototype._layout = function(ignoreMinMax) {
				var self = this,
					options = self.options,
					dimensions = self.dimensions,
					ratio = options.ratio,
					isHorizontal = options.dividerVertical,
					panes = self.panes,
					splitterTouchElementStyle = self.splitterTouchElement.style,
					splitterHandle = self.splitterHandle,
					splitterHandleSize = dimensions.splitterHandleSize,
					splitterSize = dimensions.splitterSize,
					panesCount = panes.length,
					currentAvailable = 0,
					width = dimensions.containerWidth,
					height = dimensions.containerHeight,
					availableWidth = Math.floor(isHorizontal ? width - splitterSize :
						height - splitterSize) ;

				dimensions.maxPaneSize = availableWidth - dimensions.minPaneSize;
				currentAvailable = availableWidth;
				panes.forEach(function (pane, i) {
					var paneWidth = Math.floor(availableWidth * ratio[i]),
						paneStyle = pane.style;

					currentAvailable -= paneWidth;
					if (i === (panesCount - 1)) {
						paneWidth = Math.max(Math.min(paneWidth, dimensions.minPaneSize), paneWidth + currentAvailable);
					}

					if (ignoreMinMax || (paneWidth >= dimensions.minPaneSize && paneWidth <= dimensions.maxPaneSize)) {
						if (isHorizontal) {
							paneStyle.width = paneWidth + 'px';
							paneStyle.height = height + 'px';
						} else {
							paneStyle.height = paneWidth + 'px';
						}
					}
				});

				if (isHorizontal) {
					splitterTouchElementStyle.left = (width * ratio[0] - dimensions.splitterTouchSize / 2) + 'px';
					splitterTouchElementStyle.top = 0;
					splitterHandle.style.top = ((height - splitterHandleSize) / 2) + 'px';
					self.splitterBar.style.height = height + 'px';
				}else{
					splitterTouchElementStyle.left = 0;
					splitterTouchElementStyle.top = (height * ratio[0] - dimensions.splitterTouchSize / 2) + 'px';
					splitterHandle.style.top = 0;
				}
			};

			/**
			 * Calls refresh() on each child SplitView.
			 * @method _refreshChildren
			 * @protected
			 * @instance
			 * @member ns.widget.SplitView
			 */
			prototype._refreshChildren = function() {
				this.panes.forEach(function(pane) {
					if (DOM.getNSData(pane, 'role') === 'splitview') {
						engine.getBinding(pane).refresh();
					}
				});
			};

			/**
			 * Changes orientation of the SplitView.
			 * @method _setDividerVertical
			 * @param {HTMLElement} element
			 * @param {boolean} dividerVertical if true, the divider will be placed vertically
			 * @protected
			 * @instance
			 * @member ns.widget.SplitView
			 */
			prototype._setDividerVertical = function(element, dividerVertical) {
				var self = this,
					splitViewClasses = SplitView.classes,
					classes = element.classList;
				classes.remove(dividerVertical ? splitViewClasses.uiDirectionVertical : splitViewClasses.uiDirectionHorizontal);
				classes.add(dividerVertical ? splitViewClasses.uiDirectionHorizontal : splitViewClasses.uiDirectionVertical);
				self.options.dividerVertical = dividerVertical;
			};

			/**
			 * Changes fixed state of the SplitView.
			 * @method _setFixed
			 * @param {HTMLElement} element
			 * @param {boolean} fixed if true, the splitter is locked in its current position
			 * @protected
			 * @instance
			 * @member ns.widget.SplitView
			 */
			prototype._setFixed = function(element, fixed) {
				var self = this,
					classes = SplitView.classes;
				self.options.fixed = fixed;
				if (fixed) {
					self.splitterBar.classList.add(classes.uiFixed);
				} else {
					self.splitterBar.classList.remove(classes.uiFixed);
				}
			};

			/**
			 * Changes ratio of the SplitView. It will overwrite original ratio set in HTML document,
			 * so it will be impossible to revert it back using restore().
			 * @method _setRatio
			 * @param {HTMLElement} element
			 * @param {Array} ratio the new ratio to set
			 * @protected
			 * @instance
			 * @member ns.widget.SplitView
			 */
			prototype._setRatio = function(element, ratio) {
				var self = this,
					newRatio = convertRatio(ratio);
				self.options.ratio = newRatio;
				self.dimensions.originalRatio = newRatio.slice();
			};

			/**
			 * Measures dimensions of the splitter.
			 * @method _measureSplitter
			 * @protected
			 * @instance
			 * @member ns.widget.SplitView
			 */
			prototype._measureSplitter = function() {
				var self = this,
					dimensions = self.dimensions,
					isHorizontal = self.options.dividerVertical;
				//clear any previous dynamic height setting
				self.splitterBar.style.height = "";
				dimensions.splitterSize = isHorizontal ? DOM.getElementWidth(self.splitterBar, 'outer') :
					DOM.getElementHeight(self.splitterBar, 'outer');
				dimensions.splitterHandleSize = isHorizontal ? DOM.getElementHeight(self.splitterHandle) :
					DOM.getElementWidth(self.splitterHandle);
				dimensions.splitterTouchSize = isHorizontal ? DOM.getElementWidth(self.splitterTouchElement, 'outer') :
					DOM.getElementHeight(self.splitterTouchElement, 'outer');
			};

			/**
			 * Maximizes a pane with specified id by setting its ratio to 1.
			 * @method maximize
			 * @param {string} id the id of a pane to maximize
			 * @instance
			 * @member ns.widget.SplitView
			 */
			prototype.maximize = function(id) {
				var self = this,
					ratio = self.options.ratio,
					element = selectors.getChildrenBySelector(self.widget(), id);

				if (element) {
					self.panes.forEach(function(pane, i) {
						if (pane === element[0]) {
							ratio[i] = 1;
							ratio[i === 0 ? 1 : 0] = 0;
							self._layout(true);
						}
					});
				}

			};

			/**
			 * Restores to original ratio set through HTML document or option setter.
			 * @method restore
			 * @instance
			 * @member ns.widget.SplitView
			 */
			prototype.restore = function () {
				var self = this;
				self.options.ratio = self.dimensions.originalRatio.slice();
				self._layout();
			};

			/**
			 * Gets element in pane specified by id or replaces it with given element as a second argument.
			 * @method pane
			 * @param {string} id the id of a pane to get the content from
			 * @param {HTMLElement} element the new element to be inserted
			 * @instance
			 * @return {HTMLCollection} a collection of pane's child elements
			 * @member ns.widget.SplitView
			 */
			prototype.pane = function(id, element) {
				var self = this,
					classes = SplitView.classes,
					targetPane = selectors.getChildrenBySelector(self.widget(), id)[0],
					targetView = null,
					scollViewClasses = ns.widget.mobile.Scrollview.classes;

				if (hasClass(targetPane, classes.uiPane)) {
					if (element) {
						if (element.length) {
							element = element[0];
						}
						//setter
						if (hasClass(targetPane, scollViewClasses.clip)) {
							engine.getBinding(targetPane).scrollTo(0, 0, 0);
							targetView = selectors.getChildrenByClass(targetPane, scollViewClasses.view);
							if (targetView.length) {
								targetView = targetView[0];
							}else {
								return null;
							}
						} else {
							targetView = targetPane;
						}

						while(targetView.firstChild) {
							targetView.removeChild(targetView.firstChild);
						}
						targetView.appendChild(element);
						events.trigger(element, 'create');
					} else {
						//getter
						return targetPane.children;
					}
				}
			};

			/**
			 * Checks if specified element has given class
			 * @method hasClass
			 * @param {HTMLElement} element
			 * @param {string} cls the class to check
			 * @private
			 * @static
			 * @return {boolean} true if given element contains the class
			 * @member ns.widget.SplitView
			 */
			function hasClass(element, cls) {
				return element && element.classList.contains(cls);
			}

			SplitView.prototype = prototype;

			ns.widget.mobile.SplitView = SplitView;
			engine.defineWidget(
				'SplitView',
				'[data-role="splitview"], .ui-splitview',
				['pane', 'restore', 'maximize'],
				SplitView,
				'tizen'
			);
			//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
			return ns.widget.mobile.SplitView;
		}
	);
//>>excludeEnd('tauBuildExclude');
}(window.document, ns));
