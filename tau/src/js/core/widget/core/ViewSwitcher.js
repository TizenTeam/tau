/*global window, define */
/*jslint nomen: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #ViewSwitcher Component
 * ViewSwitcher component is controller for each view elements is changing position.
 * This component managed to animation, views position, events and get/set active view index.
 * If you want to change the view as various animating, you should wrap views as the ViewSwitcher element then
 * ViewSwitcher would set views position and start to manage to gesture event.
 *
 * ##Set and Get the active index
 * You can set or get the active index as the setActiveIndex() and getActiveIndex()
 *
 * @class ns.widget.core.ViewSwitcher
 * @extends ns.widget.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../theme",
			"../../util/selectors",
			"../../util/DOM/css",
			"../../util/object",
			"../../event/gesture",
			"../../event",
			"../core", // fetch namespace
			"../BaseWidget"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.core.ViewSwitcher
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				utilDOM = ns.util.DOM,
				events = ns.event,
				engine = ns.engine,
				utilsObject = ns.util.object,
				Gesture = ns.event.gesture,
				/**
				 * Default values
				 */
				DEFAULT = {
					ACTIVE_INDEX: 0,
					ACTIVE_BG_COLOR: "rgba(250, 250, 250, 1)",
					END_BG_COLOR: "rgba(85, 85, 85, 1)",
					CAROUSEL_SIDE_SPACING_RATIO: 0.15,
					CAROUSEL_EDGE_SPACING_RATIO: 0.10,
					PERSPECTIVE: 280,
					ZINDEX_TOP: 100,
					ZINDEX_MIDDLE: 50,
					ZINDEX_BOTTOM: 10,
					ANIMATION_TYPE: "carousel",
					ANIMATION_SPEED: 30,
					ANIMATION_TIMING_FUNCTION: "ease-out",
					RGBA_REGEXP: /rgba\(([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+)\)/,
					USE_CUSTOM_COLOR: false
				},
				CONST = {
					ACTIVE_TO_END: 0,
					END_TO_ACTIVE: 1
				},
				/**
				 * ViewSwitcher triggered some customEvents
				 * viewchangestart : This event has been triggerred when view changing started.
				 * viewchangeend : This event has been triggerred when view changing ended.
				 * viewchange: This event has been triggerred when view changing complete to user.
				 */
				EVENT_TYPE = {
					CHANGE_START: "viewchangestart",
					CHANGE_END: "viewchangeend",
					CHANGE: "viewchange"
				},
				/**
				 * ViewSwitcher constructor
				 * @method ViewSwitcher
				 */
				ViewSwitcher = function () {
					var self = this;

					self.options = {};
					self._ui = {};
					self._colorTransitionRatio = {};
					self._activeRGB = {};
					self._endRGB = {};
				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @member ns.widget.core.ViewSwitcher
				 * @private
				 * @static
				 * @readonly
				 */
				classes = {
					VIEW: "ui-view",
					VIEW_ACTIVE: "ui-view-active",
					VIEW_PREVIOUS: "ui-view-previous",
					VIEW_NEXT: "ui-view-next",
					VIEW_AFTER_NEXT: "ui-view-after-next",
					VIEW_BEFORE_PREVIOUS: "ui-view-before-previous",
					ANIMATION_TYPE: "ui-animation-"
				},
				/**
				 * {Object} ViewSwitcher widget prototype
				 * @member ns.widget.core.ViewSwitcher
				 * @private
				 * @static
				 */
				prototype = new BaseWidget();

			ViewSwitcher.prototype = prototype;
			ViewSwitcher.classes = classes;

			function resetStyle(element) {
				element.style.left = "";
				element.style.right = "";
				element.style.transform = "";
				element.style.zIndex = DEFAULT.ZINDEX_MIDDLE;
				element.style.transform = "translateZ(" + -this.element.offsetWidth / 2 + "px)";
			}
			/**
			 * ViewSwitcher translate function
			 * @method _translate
			 * @param {number} x
			 * @param {number} duration
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._translate = function (element, x, y, z, duration) {

				if (duration) {
					utilDOM.setPrefixedStyle(element, "transition", utilDOM.getPrefixedValue("transform " + duration / 1000 + "s ease-out"));
				}

				// there should be a helper for this :(
				utilDOM.setPrefixedStyle(element, "transform", "translate3d(" + x + "px, " + y + "px, " + z + "px)");
			};

			/**
			 * Configure of ViewSwitcher component
			 * @method _configure
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._configure = function () {
				var self = this;

				/**
				 * ViewSwitcher containing some options
				 * @property {number} ViewSwitcher default active index (Default is 0)
				 * @property {string} ViewSwitcher animation type (Default is "carousel")
				 * @property {number} ViewSwitcher animation speed (Default is 18)
				 * @property {string} Active view background color (Default is "rgba(250, 250, 250, 1)")
				 * @property {string} Another views background color (Default is "rgba(85, 85, 85, 1)")
				 */
				self.options = utilsObject.merge(self.options, {
					active: DEFAULT.ACTIVE_INDEX,
					animationType: DEFAULT.ANIMATION_TYPE,
					animationSpeed: DEFAULT.ANIMATION_SPEED,
					activeBgColor: DEFAULT.ACTIVE_BG_COLOR,
					endBgColor: DEFAULT.END_BG_COLOR
				});
			};
			/**
			 * Build structure of ViewSwitcher component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui;

				ui._views = element.querySelectorAll("." + classes.VIEW);
				return element;
			};

			/**
			 * Initialization of ViewSwitcher component
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					activeView = element.querySelector("." + classes.VIEW_ACTIVE);

				ui._activeView = activeView ? activeView : ui._views[options.active];
				ui._activeView.classList.add(classes.VIEW_ACTIVE);

				ui._previousView = ui._activeView.previousElementSibling;
				ui._nextView = ui._activeView.nextElementSibling;
				if (ui._previousView) {
					ui._previousView.classList.add(classes.VIEW_PREVIOUS);
				}
				if (ui._nextView) {
					ui._nextView.classList.add(classes.VIEW_NEXT);
				}
				self._elementOffsetWidth = element.offsetWidth;
				self._elementOffsetHalfWidth = self._elementOffsetWidth / 2;
				self._initPosition();
				self._initColor();

				return element;
			};

			/**
			 * Init position of Views inner ViewSwitcher
			 * @method _initPosition
			 * @param {HTMLElement} element
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._initPosition = function () {
				var self = this,
					ui = self._ui,
					animationType = self.options.animationType;

				switch(animationType) {
					case "carousel" :
						self._setPosition("carousel");
						break;
				}
			};

			/**
			 * Init color of custom colors
			 * @method _initColor
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._initColor = function() {
				var self = this,
					options = self.options,
					elementOffsetHalfWidth = self._elementOffsetHalfWidth,
					colorTransitionRatio = self._colorTransitionRatio,
					activeBGColor = options.activeBgColor.match(DEFAULT.RGBA_REGEXP),
					endBGColor = options.endBgColor.match(DEFAULT.RGBA_REGEXP),
					activeRGB = self._activeRGB,
					endRGB = self._endRGB;

				colorTransitionRatio.r = (activeBGColor[1] - endBGColor[1]) / elementOffsetHalfWidth;
				colorTransitionRatio.g = (activeBGColor[2] - endBGColor[2]) / elementOffsetHalfWidth;
				colorTransitionRatio.b = (activeBGColor[3] - endBGColor[3]) / elementOffsetHalfWidth;
				colorTransitionRatio.a = (activeBGColor[4] - endBGColor[4]) / elementOffsetHalfWidth;
				activeRGB.r = parseInt(activeBGColor[1], 10);
				activeRGB.g = parseInt(activeBGColor[2], 10);
				activeRGB.b = parseInt(activeBGColor[3], 10);
				activeRGB.a = parseInt(activeBGColor[4], 10);
				endRGB.r = parseInt(endBGColor[1], 10);
				endRGB.g = parseInt(endBGColor[2], 10);
				endRGB.b = parseInt(endBGColor[3], 10);
				endRGB.a = parseInt(endBGColor[4], 10);
			};

			/**
			 * Get the active index as view has the "ui-view-active" or not
			 * @method _getActiveIndex
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._getActiveIndex = function() {
				var self = this,
					ui = self._ui,
					views = ui._views,
					i, len;

				len = views.length;
				for (i = 0; i < len; i++) {
					if (views[i].classList.contains(classes.VIEW_ACTIVE)) {
						return i;
					}
				}
				return self.options.active;
			};

			/**
			 * Calculate color value as the moved distance
			 * @method _calculateColor
			 * @param {number} distance
			 * @param {number} direction (0 is active to end, 1 is end to active)
			 * @return {string} return the rgba string value
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._calculateColor = function(distance, direction) {
				var self = this,
					colorTransitionRatio = self._colorTransitionRatio,
					activeRGB = self._activeRGB,
					endRGB = self._endRGB,
					r, g, b, a;

				if (direction === CONST.ACTIVE_TO_END) {
					r = Math.floor(colorTransitionRatio.r * -distance + activeRGB.r);
					g = Math.floor(colorTransitionRatio.g * -distance + activeRGB.g);
					b = Math.floor(colorTransitionRatio.b * -distance + activeRGB.b);
					a = Math.floor(colorTransitionRatio.a * -distance + activeRGB.a);
				} else if (direction === CONST.END_TO_ACTIVE) {
					r = Math.floor(colorTransitionRatio.r * distance + endRGB.r);
					g = Math.floor(colorTransitionRatio.g * distance + endRGB.g);
					b = Math.floor(colorTransitionRatio.b * distance + endRGB.b);
					a = Math.floor(colorTransitionRatio.a * distance + endRGB.a);
				}
				return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
			};

			/**
			 * Set the views init position.
			 * @method _setPosition
			 * @param {string} Animation type has been used as set position type
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._setPosition = function(type) {
				var self = this,
					element = self.element,
					elementOffsetWidth = self._elementOffsetWidth,
					ui = self._ui;
				if (type === "carousel") {
					element.style.webkitPerspective = DEFAULT.PERSPECTIVE;
					element.classList.add(classes.ANIMATION_TYPE + "carousel");
					self._edgePosition = parseInt(elementOffsetWidth * DEFAULT.CAROUSEL_EDGE_SPACING_RATIO, 10);
					self._sidePosition = parseInt(elementOffsetWidth * DEFAULT.CAROUSEL_SIDE_SPACING_RATIO, 10);
					if (ui._previousView) {
						ui._previousView.style.transform = "translateZ(" + -elementOffsetWidth / 2 + "px)";
					}
					if (ui._nextView) {
						ui._nextView.style.transform = "translateZ(" + -elementOffsetWidth / 2 + "px)";
					}
				}
			};

			/**
			 * Binds events to a ViewSwitcher component
			 * @method _bindEvents
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._bindEvents = function() {
				var self = this,
					element = self.element;

				events.enableGesture(
					element,
					new events.gesture.Drag({
						blockVertical: true,
						angleThreshold: 50
					}),
					new events.gesture.Swipe({
						orientation: Gesture.Orientation.HORIZONTAL
					})
				);
				events.on(element, "drag dragstart dragend swipe", self, false);

			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.ViewSwitcher
			 */
			prototype.handleEvent = function(event) {
				var self = this;
				switch (event.type) {
					case "drag":
						self._onDrag(event);
						break;
					case "dragstart":
						self._onDragStart(event);
						break;
					case "dragend":
					case "swipe":
						self._onDragEnd(event);
						break;
				}
			};

			/**
			 * Drag event handler
			 * @method _onDrag
			 * @param {Event} event
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._onDrag = function(event) {
				var self = this,
					direction = event.detail.direction,
					estimatedDeltaX = event.detail.estimatedDeltaX,
					ui = self._ui,
					active = ui._activeView;

				if ((direction === "left" && !active.nextElementSibling) || (direction === "right" && !active.previousElementSibling)) {
					return;
				}
				if (self._dragging && !self._isAnimating) {
					if (self.options.animationType === "carousel") {
						self._animateCarousel(estimatedDeltaX, direction);
					}
				}
			};

			/**
			 * DragStart event handler
			 * @method _onDragStart
			 * @param {Event} event
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._onDragStart = function(event) {
				var self = this,
					element = self.element,
					direction = event.detail.direction,
					ui = self._ui,
					active = ui._activeView;

				if ((direction === "left" && !active.nextElementSibling) || (direction === "right" && !active.previousElementSibling) || self._dragging) {
					return;
				}
				self._dragging = true;
			};

			/**
			 * DragEnd event handler
			 * @method _onDragEnd
			 * @param {Event} event
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._onDragEnd = function(event) {
				var self = this,
					ui = self._ui,
					active = ui._activeView,
					direction = event.detail.direction,
					estimatedDeltaX = event.detail.estimatedDeltaX;

				if (!self._dragging || self._isAnimating
					|| (direction === "left" && !active.nextElementSibling) || (direction === "right" && !active.previousElementSibling)) {
					return;
				}
				self._lastDirection = direction;
				if (event.type === "dragend" && Math.abs(estimatedDeltaX) < self._elementOffsetWidth / 2) {
					direction = "backward";
				}
				self.trigger(EVENT_TYPE.CHANGE_START);
				self._requestFrame(direction);
			};

			/**
			 * Animate views as the requestAnimationFrame.
			 * @method _requestFrame
			 * @param {string} animation direction
			 * @param {string} animation timing type (ease-out|linear)
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._requestFrame = function(direction, type) {
				var self = this,
					elementOffsetWidth = self._elementOffsetWidth,
					animationTimingFunction = type ? type : DEFAULT.ANIMATION_TIMING_FUNCTION,
					isStop = false,
					lastDirection = self._lastDirection,
					ui = self._ui,
					afterNext = ui._nextView ? ui._nextView.nextElementSibling : null,
					beforePrev = ui._previousView ? ui._previousView.previousElementSibling : null,
					animationFrame,
					validDirection,
					stopPosition,
					mark;

				if (direction === "backward") {
					validDirection = lastDirection === "left" ? "right" : "left";
					if (lastDirection === "left" && self._lastDeltaX > 0
						|| lastDirection === "right" && self._lastDeltaX < 0) {
						isStop = true;
						stopPosition = 0;
					}
				} else {
					validDirection = direction;
					if (Math.abs(self._lastDeltaX) > elementOffsetWidth) {
						isStop = true;
						stopPosition = elementOffsetWidth;
					}
				}
				mark = validDirection === "left" ? -1 : 1;
				if (isStop) {
					self._animateCarousel(stopPosition * mark, validDirection);
					webkitCancelRequestAnimationFrame(animationFrame);
					if (direction !== "backward") {
						self._reorderViews(validDirection);
					} else {
						if (afterNext) {
							afterNext.classList.remove(classes.VIEW_NEXT);
						}
						if (beforePrev) {
							beforePrev.classList.remove(classes.VIEW_PREVIOUS);
						}
					}
					self._dragging = false;
					self._isAnimating = false;
					self._isChange = false;
					self.trigger(EVENT_TYPE.CHANGE_END);
					return;
				}
				self._animateCarousel(self._lastDeltaX, lastDirection);
				self._isAnimating = true;

				if (animationTimingFunction === "ease-out") {
					if (Math.abs(self._lastDeltaX) > elementOffsetWidth * 0.95) {
						self._lastDeltaX = self._lastDeltaX + mark;
					} else {
						self._lastDeltaX = self._lastDeltaX + self.options.animationSpeed * mark;
					}
				} else if (animationTimingFunction === "linear") {
					self._lastDeltaX = self._lastDeltaX + self.options.animationSpeed * mark;
				}
				animationFrame = webkitRequestAnimationFrame(self._requestFrame.bind(self, direction, type));
			};

			/**
			 * Reordering the views after animating.
			 * @method _reorderViews
			 * @param {string} animation direction
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._reorderViews = function(direction) {
				var self = this,
					ui = self._ui,
					prev = ui._previousView,
					next = ui._nextView,
					afterNext = next ? next.nextElementSibling : null,
					beforePrev = prev ? prev.previousElementSibling : null,
					active = ui._activeView;

				active.classList.remove(classes.VIEW_ACTIVE);
				if (next) {
					next.classList.remove(classes.VIEW_NEXT);
					if (direction === "left") {
						active.classList.add(classes.VIEW_PREVIOUS);
						next.classList.add(classes.VIEW_ACTIVE);
						ui._activeView = next;
						ui._previousView = active;
						if (afterNext) {
							afterNext.classList.remove(classes.VIEW_AFTER_NEXT);
							afterNext.classList.add(classes.VIEW_NEXT);
						}
						ui._nextView = afterNext;
					}
				}
				if (prev) {
					prev.classList.remove(classes.VIEW_PREVIOUS);
					if (direction === "right") {
						active.classList.add(classes.VIEW_NEXT);
						prev.classList.add(classes.VIEW_ACTIVE);
						ui._activeView = prev;
						ui._nextView = active;
						if (beforePrev) {
							beforePrev.classList.remove(classes.VIEW_BEFORE_PREVIOUS);
							beforePrev.classList.add(classes.VIEW_PREVIOUS);
						}
						ui._previousView = beforePrev;
					}
				}
				self._resetView();
			};

			/**
			 * Control the Carousel animation
			 * @method _animateCarousel
			 * @param {number} estimated delta x position
			 * @param {string} animating direction
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._animateCarousel = function(estimatedDeltaX, direction) {
				var self = this,
					elementOffsetWidth = self._elementOffsetWidth,
					elementOffsetHalfWidth = self._elementOffsetHalfWidth,
					ui = self._ui,
					prev = ui._previousView,
					next = ui._nextView,
					active = ui._activeView,
					activeIndex = self._getActiveIndex(),
					halfEstimateDeltaX = estimatedDeltaX / 2,
					mark = direction === "left" ? 1 : -1,
					sideEdge = elementOffsetHalfWidth * 0.2 * mark,
					absEstimatedDeltaX = Math.abs(estimatedDeltaX),
					edgeDeltaX = -mark * 1.6 * elementOffsetHalfWidth - halfEstimateDeltaX,
					elementHalfMinusDeltaX = -elementOffsetHalfWidth - halfEstimateDeltaX,
					elementHalfPlusDeltaX = -elementOffsetHalfWidth + halfEstimateDeltaX,
					lessEstimatedDeltaX = -halfEstimateDeltaX * 0.2,
					activeToEndColor,
					endToActiveColor;

				if (absEstimatedDeltaX > elementOffsetWidth) {
					return;
				}

				activeToEndColor = self._calculateColor(absEstimatedDeltaX / 2, CONST.ACTIVE_TO_END);
				endToActiveColor = self._calculateColor(absEstimatedDeltaX / 2, CONST.END_TO_ACTIVE);

				active.style.left = (elementOffsetWidth - active.offsetWidth) / 2 + "px";
				active.style.zIndex = DEFAULT.ZINDEX_TOP;
				if (direction === "left") {
					if (next) {
						if (absEstimatedDeltaX < elementOffsetWidth * 0.2) {
							next.style.zIndex = DEFAULT.ZINDEX_MIDDLE;
							self._translate(next, -halfEstimateDeltaX, 0, elementHalfMinusDeltaX);
						} else {
							active.style.zIndex = DEFAULT.ZINDEX_MIDDLE;
							next.style.zIndex = DEFAULT.ZINDEX_TOP;
							self._translate(next, 2 * sideEdge + halfEstimateDeltaX, 0, elementHalfMinusDeltaX);
						}

						if (next.nextElementSibling) {
							next.nextElementSibling.classList.add(classes.VIEW_NEXT);
							self._translate(next.nextElementSibling, elementHalfMinusDeltaX * 0.6, 0, -elementOffsetWidth - halfEstimateDeltaX);
						}
						next.style.backgroundColor = endToActiveColor;
					}
					if (prev) {
						if (prev.previousElementSibling) {
							prev.previousElementSibling.classList.remove(classes.VIEW_PREVIOUS);
						}
						prev.style.zIndex = DEFAULT.ZINDEX_BOTTOM;
						self._translate(prev, lessEstimatedDeltaX, 0, elementHalfPlusDeltaX);
					}
					active.style.backgroundColor = activeToEndColor;
				} else {
					if (prev) {
						if (absEstimatedDeltaX < elementOffsetWidth * 0.2) {
							prev.style.zIndex = DEFAULT.ZINDEX_MIDDLE;
							self._translate(prev, -halfEstimateDeltaX, 0, elementHalfPlusDeltaX);
						} else {
							active.style.zIndex = DEFAULT.ZINDEX_MIDDLE;
							prev.style.zIndex = DEFAULT.ZINDEX_TOP;
							self._translate(prev, 2 * sideEdge + halfEstimateDeltaX, 0, elementHalfPlusDeltaX);
						}
						if (prev.previousElementSibling) {
							prev.previousElementSibling.classList.add(classes.VIEW_PREVIOUS);
							self._translate(prev.previousElementSibling, -elementHalfPlusDeltaX * 0.6, 0, -elementOffsetWidth + halfEstimateDeltaX);
						}
						prev.style.backgroundColor = endToActiveColor;
					}
					if (next) {
						if (next.nextElementSibling) {
							next.nextElementSibling.classList.remove(classes.VIEW_NEXT);
						}
						next.style.zIndex = DEFAULT.ZINDEX_BOTTOM;
						self._translate(next, lessEstimatedDeltaX, 0, elementHalfMinusDeltaX);
					}
					active.style.backgroundColor = activeToEndColor;
				}

				if (absEstimatedDeltaX > elementOffsetHalfWidth && !self._isChange) {
					self.trigger(EVENT_TYPE.CHANGE, {
						index: activeIndex + mark
					});
					self._isChange = true;
				} else if (absEstimatedDeltaX < elementOffsetHalfWidth && self._isChange) {
					self.trigger(EVENT_TYPE.CHANGE, {
						index: activeIndex
					});
					self._isChange = false;
				}
				if (absEstimatedDeltaX < elementOffsetWidth * 0.8) {
					self._translate(active, halfEstimateDeltaX, 0, halfEstimateDeltaX * mark);
				} else {
					self._translate(active, edgeDeltaX , 0, halfEstimateDeltaX * mark);
				}
				self._lastDeltaX = estimatedDeltaX;
			};

			/**
			 * Reset the css value of views
			 * @method _resetView
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._resetView = function() {
				var self = this,
					ui = self._ui,
					prev = ui._previousView,
					next = ui._nextView,
					active = ui._activeView;

				if (prev) {
					resetStyle.call(self, prev);
				}
				if (next) {
					resetStyle.call(self, next);
				}
				if (active) {
					utilDOM.setPrefixedStyle(active, "transform", "");
				}
				active.style.zIndex = DEFAULT.ZINDEX_TOP;
			};

			/**
			 * Set the active view
			 * @method setActiveIndex
			 * @member ns.widget.core.ViewSwitcher
			 * @public
			 */
			prototype.setActiveIndex = function(index) {
				var self = this,
					latestActiveIndex = self._getActiveIndex(),
					interval = latestActiveIndex - index,
					direction, i, len;

				if (!self._isAnimating && index < self._ui._views.length && index >= 0) {
					self._lastDeltaX = 0;
					if (interval < 0) {
						direction = "left";
					} else {
						direction = "right";
					}
					len = Math.abs(interval);
					self._lastDirection = direction;
					for (i = 0; i < len; i++) {
						self.trigger(EVENT_TYPE.CHANGE_START);
						self._requestFrame(direction, "linear");
					}
				}
			};

			/**
			 * Get the active view index
			 * @method getActiveIndex
			 * @member ns.widget.core.ViewSwitcher
			 * @public
			 */
			prototype.getActiveIndex = function() {
				return this._getActiveIndex();
			};
			/**
			 * Destroys ViewSwitcher widget
			 * @method _destroy
			 * @member ns.widget.core.ViewSwitcher
			 * @protected
			 */
			prototype._destroy = function() {
				var element = this.element;
				events.disableGesture(element);
				events.off(element, "drag dragstart dragend", this, false);
				this.options = null;
				this._ui = null;
				this._colorTransitionRatio = null;
				this._activeRGB = null;
				this._endRGB = null;
			};

			ns.widget.core.ViewSwitcher = ViewSwitcher;

			engine.defineWidget(
				"ViewSwitcher",
				"[data-role='viewSwitcher'], .ui-view-switcher",
				[
					"setActiveIndex",
					"getActiveIndex"
				],
				ViewSwitcher
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.ViewSwitcher;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
