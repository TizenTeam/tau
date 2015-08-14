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
/*jslint nomen: true */
/**
 * # FloatingActions component
 * Floating actions component creates a floating button at the bottom of the screen.
 *
 * ##Default Selectors
 * By default, all elements with the class="ui-floatingactions" or data-role="floatingactions" attribute are displayed as floating actions components.
 *
 * ##Manual constructor
 *      @example
 *      <div class="ui-floatingactions" id="floating">
 *          <button class="ui-floatingactions-item" data-icon="floating-add"/>
 *          <button class="ui-floatingactions-item" data-icon="floating-search"/>
 *      </div>
 *      <script>
 *          var elFloatingActions = document.getElementById("floating"),
 *                flaotingActions = tau.widget.FloatingActions(elFloatingActions);
 *      </script>
 *
 * @class ns.widget.mobile.FloatingActions
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/widget/core/Page",
			"../../../../core/event/gesture",
			"../../../../core/util/selectors",
			"../../../../core/widget/BaseWidget",
			"../mobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilsEvents = ns.event,
				Page = ns.widget.core.Page,
				selectors = ns.util.selectors,
				prototype = new BaseWidget(),
				MATRIX_REGEXP = /matrix\((.*), (.*), (.*), (.*), (.*), (.*)\)/,
				RGBA_REGEXP = /rgba\(([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+)\)/,
				SNAP_WIDTH = 19,
				FloatingActions = function () {
					this.element = null;
					this._paddingSet = false;
					this.options = {};
					this._style = null;
					this._startX = 0;
					this._currentX = 0;
					this._hasSingle = true;
					this._padding = {};
					this._position = {};
					this._scope = {};
					this._colorTransitionRatio = {};
					this._fromColor = [];
					this._callbacks = {};
				};


			/**
			* Configure component
			* @method _configure
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._configure = function() {
				/**
				 * @property {Object} options Object with default options
				 * @property {string} [options.fromRgba="rgba(66, 162, 207, 1)"] color when the floating button is positioned at the left end
				 * @property {string} [options.toRgba="rgba(54, 132, 168, 1)"] color when the floating button is positioned at the right end
				 * @property {number} [options.opacity=0.9] opacity when the floating button is clicked
				 * @property {number} [options.duration=300] animation duration for color and opacity (unit of time : millisecond)
				 * @member ns.widget.mobile.FloatingActions
				 */
				this.options = {
					fromRgba: "rgba(66, 162, 207, 1)",
					toRgba: "rgba(54, 132, 168, 1)",
					opacity: 0.9,
					duration: 300
				};
			};

			/**
			* Init component
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._init = function(element) {
				var self = this;

				self._style = element.style;
				self._hasSingle = element.children.length > 1 ? false : true;
				self._setPosition();
				self._setScope();
				self._setColorTransitionRatio();
				self._initStyle();
				return element;
			};

			/**
			* Callback on pagebeforeshow event
			* @method pageBeforeShow
			* @param self
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			function pageBeforeShow(self) {
				self._refresh();
			}

			/**
			* Bind events
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._bindEvents = function() {
				var self = this,
					element = self.element,
					page = selectors.getClosestByClass(element, Page.classes.uiPage);

				utilsEvents.enableGesture(
					element,

					new utilsEvents.gesture.Drag({
						blockVertical: true
					})
				);

				utilsEvents.on(element, "drag dragstart dragend dragcancel touchstart touchend vmousedown vmouseup", self);
				self._callbacks.onPageBeforeShow = pageBeforeShow.bind(null, self);
				page.addEventListener(Page.events.BEFORE_SHOW, self._callbacks.onPageBeforeShow, false);
			};

			/**
			* Unbind events
			* @method _unbindEvents
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._unbindEvents = function() {
				var self = this,
					element = self.element,
					page = selectors.getClosestByClass(element, Page.classes.uiPage);

				utilsEvents.disableGesture(self.element);
				utilsEvents.off(self.element, "drag dragstart dragend dragcancel touchstart touchend vmousedown vmouseup", self);
				page.removeEventListener(Page.events.BEFORE_SHOW, self._callbacks.onPageBeforeShow, true);
			};

			/**
			* Refresh component
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._refresh = function() {
				var self = this,
					element = self.element;

				self._hasSingle = element.children.length > 1 ? false : true;
				self._setPosition();
				self._setScope();
				self._setColorTransitionRatio();
				self._initStyle();
			};

			/**
			* Destroy component
			* @method _destroy
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._destroy = function() {
				var self = this;
				if (self.isBound()) {
					self._unbindEvents();
					self._paddingSet = false;
					self._style = null;
					self._position = null;
					self._scope = null;
					self._padding = null;
				}
			};

			/**
			* Init component style
			* @method _initStyle
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._initStyle = function() {
				var self = this,
					style = self._style,
					position = self._position,
					padding = self._padding,
					fromColor = self._fromColor,
					colorTransitionRatio = self._colorTransitionRatio,
					transform, distance, r, g, b, a;

				style.paddingLeft = padding.left + "px";
				style.paddingRight = SNAP_WIDTH + padding.right + "px";

				transform = "translate3d(" + position.right + "px, 0, 0)";
				style.webkitTransform = transform;
				style.transform = transform;

				distance = position.right - position.min;

				r = Math.floor(colorTransitionRatio.r * distance + fromColor.r);
				g = Math.floor(colorTransitionRatio.g * distance + fromColor.g);
				b = Math.floor(colorTransitionRatio.b * distance + fromColor.b);
				a = Math.floor(colorTransitionRatio.a * distance + fromColor.a);
				style.backgroundColor = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
			};

			/**
			* Set position for move effect
			* @method _setPosition
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._setPosition = function() {
				var self = this,
					element = self.element,
					elementStyle = window.getComputedStyle(element),
					position = self._position,
					padding = self._padding,
					paddingLeft,
					paddingRight,
					elementWidth = element.offsetWidth;

				paddingLeft = parseInt(elementStyle.paddingLeft);
				paddingRight = parseInt(elementStyle.paddingRight);

				//we always add SNAP_WIDTH to element.style.paddingRight
				//if we added SNAP_WIDTH before we decrease element's paddingRight to original value
				if(self._paddingSet) {
					paddingRight -= SNAP_WIDTH;
				}

				position.min = -window.innerWidth + paddingLeft;
				position.max = elementWidth - paddingRight;
				position.center = (position.max + position.min) / 2;
				position.left = position.min + elementWidth - (paddingLeft + paddingRight);
				position.leftOneButton = position.min + (position.left - position.min) / 2;
				position.right = position.max - elementWidth + (paddingRight + paddingLeft);
				position.rightOneButton = position.right + (position.max - position.right) / 2;

				padding.left = paddingLeft;
				padding.right = paddingRight;
				padding.ratioInShow = SNAP_WIDTH / (position.center - position.left);
				padding.ratioInHide = SNAP_WIDTH / (position.left - position.min);

				if(!isNaN(paddingRight)) {
					self._paddingSet = true;
				}
			};

			/**
			* Set scope for move effect
			* @method _setScope
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._setScope = function() {
				var self = this,
					position = self._position,
					scope = self._scope,
					padding = self._padding,
					hasSingle = self._hasSingle;

				scope.min = position.min + padding.left / 2;
				scope.leftOneButton = !hasSingle ? position.min + (position.left - position.min) * 3 / 4 : null;
				scope.left = position.left + (position.center - position.left) / 2;
				scope.center = position.center + (position.right - position.center) / 2;
				scope.right = position.right + padding.right / 2;
				scope.rightOneButton = !hasSingle ? position.right + (position.max - position.right) * 3 / 4 : null;
				scope.max = position.max;
			};

			/**
			* Set color transition ratio
			* @method _setTransitionRatio
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._setColorTransitionRatio = function() {
				var self = this,
					options = self.options,
					position = self._position,
					fromColor = self._fromColor,
					colorTransitionRatio = self._colorTransitionRatio,
					fromRgba = options.fromRgba.match(RGBA_REGEXP),
					toRgba = options.toRgba.match(RGBA_REGEXP),
					width = position.max - position.min;

				colorTransitionRatio.r = (toRgba[1] - fromRgba[1]) / width;
				colorTransitionRatio.g = (toRgba[2] - fromRgba[2]) / width;
				colorTransitionRatio.b = (toRgba[3] - fromRgba[3]) / width;
				colorTransitionRatio.a = (toRgba[4] - fromRgba[4]) / width;

				self._fromColor.r = parseInt(fromRgba[1]);
				self._fromColor.g = parseInt(fromRgba[2]);
				self._fromColor.b = parseInt(fromRgba[3]);
				self._fromColor.a = parseInt(fromRgba[4]);
			};

			/**
			* Dragstart event handler
			* @method _start
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._start = function(event) {
				var self = this,
					style = self.element.style;

				self._startX = event.detail.pointer.clientX;
				// get current x value of translated3d
				self._currentX = parseInt(window.getComputedStyle(self.element).webkitTransform.match(MATRIX_REGEXP)[5]);
				style.webkitTransition = "none";
				style.transition = "none";
			};

			/**
			* Drag event handler
			* @method _move
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._move = function(event) {
				var self = this,
					style = self._style,
					moveX = event.detail.estimatedX - self._startX + self._currentX,
					position = self._position,
					padding = self._padding,
					colorTransitionRatio = self._colorTransitionRatio,
					fromColor = self._fromColor,
					distance = moveX - position.min,
					transform, r, g, b, a;

				if (moveX >= position.min && moveX <= position.max) {
					// for color transition
					r = Math.floor(colorTransitionRatio.r * distance + fromColor.r);
					g = Math.floor(colorTransitionRatio.g * distance + fromColor.g);
					b = Math.floor(colorTransitionRatio.b * distance + fromColor.b);
					a = Math.floor(colorTransitionRatio.a * distance + fromColor.a);
					style.backgroundColor = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";

					// for component position
					transform = "translate3d(" + moveX + "px, 0, 0)";
					style.webkitTransform = transform;
					style.transform = transform;

					// for edge snap
					if (moveX < position.left) {
						style.paddingLeft = (moveX - position.min) * padding.ratioInHide + self._padding.left + "px";
					} else if (moveX < position.center) {
						style.paddingLeft = (position.center - moveX) * padding.ratioInShow + self._padding.left + "px";
					} else if (moveX < position.right) {
						style.paddingRight = (moveX - position.center) * padding.ratioInShow + self._padding.right + "px";
					} else {
						style.paddingRight = (position.max - moveX) * padding.ratioInHide + self._padding.right + "px";
					}
				}
			};

			/**
			* Dragend event handler
			* @method _end
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._end = function(event) {
				var self = this,
					style = self._style,
					duration = self.options.duration,
					moveX = event.detail.estimatedX - self._startX + self._currentX,
					position = self._position,
					scope = self._scope,
					hasSingle = self._hasSingle,
					colorTransitionRatio = self._colorTransitionRatio,
					fromColor = self._fromColor,
					transform, translateX, distance, r, g, b, a, transition;

				transition = "all " + duration + "ms linear";
				style.webkitTransition = transition;
				style.transition = transition;

				if (moveX < scope.min) {
					translateX = position.min;
					style.paddingLeft = self._padding.left + "px";
					style.paddingRight = self._padding.right + "px";
				} else if (!hasSingle && moveX < scope.leftOneButton) {
					translateX = position.leftOneButton;
					style.paddingLeft = SNAP_WIDTH / 2 + self._padding.left + "px";
					style.paddingRight = self._padding.right + "px";
				} else if (moveX < scope.left) {
					translateX = position.left;
					style.paddingLeft = SNAP_WIDTH + self._padding.left + "px";
					style.paddingRight = self._padding.right + "px";
				} else if (moveX < scope.center) {
					translateX = position.center;
					style.paddingLeft = self._padding.left + "px";
					style.paddingRight = self._padding.right + "px";
				} else if (moveX < scope.right) {
					translateX = position.right;
					style.paddingLeft = self._padding.left + "px";
					style.paddingRight = SNAP_WIDTH + self._padding.right + "px";
				} else if (!hasSingle && moveX < scope.rightOneButton){
					translateX = position.rightOneButton;
					style.paddingLeft = self._padding.left + "px";
					style.paddingRight = SNAP_WIDTH / 2 + self._padding.right + "px";
				} else {
					translateX = position.max;
					style.paddingLeft = self._padding.left + "px";
					style.paddingRight = self._padding.right + "px";
				}

				transform = "translate3d(" + translateX + "px, 0, 0)";
				style.webkitTransform = transform;
				style.transform = transform;

				distance = translateX - position.min;
				r = Math.floor(colorTransitionRatio.r * distance + fromColor.r);
				g = Math.floor(colorTransitionRatio.g * distance + fromColor.g);
				b = Math.floor(colorTransitionRatio.b * distance + fromColor.b);
				a = Math.floor(colorTransitionRatio.a * distance + fromColor.a);
				style.backgroundColor = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";

			};

			/**
			* Touchstart event handler
			* @method _touchStart
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._touchStart = function(event) {
				var self = this,
					style = self._style,
					opacity = self.options.opacity,
					duration = self.options.duration,
					transition;

				transition = "opacity " + duration + "ms linear";
				style.webkitTransition = transition;
				style.transition = transition;
				style.opacity = opacity;
			};

			/**
			* Touchend event handler
			* @method _touchEnd
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._touchEnd = function(event) {
				var self = this,
					style = self._style,
					opacity = self.options.opacity,
					duration = self.options.duration,
					transition;

				transition = "opacity " + duration + "ms linear";
				style.webkitTransition = transition;
				style.transition = transition;
				style.opacity = "1";
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @public
			 * @param {Event} event Event
			 * @member ns.widget.mobile.FloatingActions
			 */
			prototype.handleEvent = function(event) {
				var self = this;

				switch (event.type) {
					case "dragstart":
						self._start(event);
						break;
					case "drag":
						self._move(event);
						break;
					case "dragend":
					case "dragcancel":
						self._end(event);
						break;
					case "touchstart":
					case "vmousedown":
						self._touchStart(event);
						break;
					case "touchend":
					case "vmouseup":
						self._touchEnd(event);
						break;
				}
			};

			// definition
			FloatingActions.prototype = prototype;
			ns.widget.mobile.FloatingActions = FloatingActions;

			engine.defineWidget(
				"FloatingActions",
				"[data-role='floatingactions'], .ui-floatingactions",
				[],
				FloatingActions,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.FloatingActions;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
