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
			"../../../../core/event/gesture",
			"../../../../core/widget/BaseWidget",
			"../mobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilsEvents = ns.event,
				prototype = new BaseWidget(),
				MATRIX_REGEXP = /matrix\((.*), (.*), (.*), (.*), (.*), (.*)\)/,
				SNAP_WIDTH = 19,
				FloatingActions = function () {
					this.element = null;
					this.options = {};
					this._style = null;
					this._startX = 0;
					this._currentX = 0;
					this._hasSingle = true;
					this._padding = {};
					this._position = {};
					this._scope = {};
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
				 * @property {number} [options.duration=300] animation duration for color and opacity (unit of time : millisecond)
				 * @member ns.widget.mobile.FloatingActions
				 */
				this.options = {
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
				self._hasSingle = element.children.length <= 1;
				self._setPosition();
				self._setScope();
				return element;
			};

			/**
			* Bind events
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._bindEvents = function() {
				var self = this,
					element = self.element;

				utilsEvents.enableGesture(
					element,

					new utilsEvents.gesture.Drag({
						blockVertical: true
					})
				);

				utilsEvents.on(element, "drag dragstart dragend dragcancel touchstart touchend vmousedown vmouseup", self);
			};

			/**
			* Unbind events
			* @method _unbindEvents
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._unbindEvents = function() {
				utilsEvents.disableGesture(this.element);
				utilsEvents.off(this.element, "drag dragstart dragend dragcancel touchstart touchend vmousedown vmouseup", this);
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

				self._hasSingle = element.children.length <= 1;
				self._setPosition();
				self._setScope();
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
					self._style = null;
					self._position = null;
					self._scope = null;
					self._padding = null;
				}
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
			* Dragstart event handler
			* @method _start
			* @protected
			* @member ns.widget.mobile.FloatingActions
			*/
			prototype._start = function(event) {
				var style = this.element.style;

				this._startX = event.detail.pointer.clientX;
				// get current x value of translated3d
				this._currentX = parseInt(window.getComputedStyle(this.element).webkitTransform.match(MATRIX_REGEXP)[5]);
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
					transform;

				if (moveX >= position.min && moveX <= position.max) {
					// for component position
					transform = "translate3d(" + moveX + "px, 0, 0)";
					style.webkitTransform = transform;
					style.transform = transform;
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
					transform, translateX, transition;

				transition = "all " + duration + "ms linear";
				style.webkitTransition = transition;
				style.transition = transition;

				if (moveX < scope.min) {
					translateX = position.min;
				} else if (!hasSingle && moveX < scope.leftOneButton) {
					translateX = position.leftOneButton;
				} else if (moveX < scope.left) {
					translateX = position.left;
				} else if (moveX < scope.center) {
					translateX = position.center;
				} else if (moveX < scope.right) {
					translateX = position.right;
				} else if (!hasSingle && moveX < scope.rightOneButton){
					translateX = position.rightOneButton;
				} else {
					translateX = position.max;
				}

				transform = "translate3d(" + translateX + "px, 0, 0)";
				style.webkitTransform = transform;
				style.transform = transform;
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
