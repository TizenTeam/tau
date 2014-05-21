/*global window, define, Event, console */
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
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ej.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/event/gesture",
			"../../../../core/util/selectors",
			"../../../../core/widget/BaseWidget",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Gesture = ns.event.gesture,
				utilsEvents = ns.event,
				engine = ns.engine,
				selectors = ns.util.selectors,

				eventType = {
					LEFT: "swipelist.left",
					RIGHT: "swipelist.right"
				},

				SwipeList = function (elem, options) {

					this.element = elem;

					this.container = null;

					this.swipeElement = null;
					this.swipeLeftElement = null;
					this.swipeRightElement = null;

					this.swipeElementStyle = null;
					this.swipeLeftElementStyle = null;
					this.swipeRightElementStyle = null;

					this.activeElement = null;
					this.activeTarget = null;

					this.resetLayoutCallback = null;
					this.options = {};

					this._interval = 0;

					this._cancelled = false;
					this._dragging = false;
					this._animating = false;

				},
				prototype = new ns.widget.BaseWidget();

			prototype._configure = function () {

				this.options = {
					threshold: 10,
					animationThreshold: 150,
					animationDuration: 200,
					animationInterval: 8,

					container: null,

					swipeTarget: "li",
					swipeElement: ".ui-swipelist",
					swipeLeftElement: ".ui-swipelist-left",
					swipeRightElement: ".ui-swipelist-right",

					ltrStartColor: "#62a917",
					ltrEndColor: "#58493a",
					rtlStartColor: "#eaa317",
					rtlEndColor: "#58493a"
				};
			};

			prototype._init = function (element) {
				var page = selectors.getClosestBySelector(element, ns.wearable.selectors.page),
					o = this.options;

				if (o.container) {
					this.container = page.querySelector(o.container);
				} else {
					this.container = this._findScrollableElement(this.element);
				}

				this.container.style.position = "relative";

				this.swipeElement = page.querySelector(o.swipeElement);
				this.swipeLeftElement = o.swipeLeftElement ? page.querySelector(o.swipeLeftElement) : undefined;
				this.swipeRightElement = o.swipeRightElement ? page.querySelector(o.swipeRightElement) : undefined;

				this.swipeElementStyle = this.swipeElement ? this.swipeElement.style : undefined;
				this.swipeLeftElementStyle = this.swipeLeftElement ? this.swipeLeftElement.style : undefined;
				this.swipeRightElementStyle = this.swipeRightElement ? this.swipeRightElement.style : undefined;

				if (this.swipeElementStyle) {
					this.swipeElementStyle.display = "none";
					this.swipeElementStyle.background = "transparent";
					this.swipeElementStyle.width = this.container.offsetWidth + "px";
					this.swipeElementStyle.height = this.container.offsetHeight + "px";
				}

				if (this.swipeLeftElementStyle) {
					// Left element existed
					this.swipeLeftElementStyle.display = "none";
					this.swipeLeftElementStyle.background = "-webkit-linear-gradient(left, " + this.options.ltrStartColor + " 0%, " + this.options.ltrEndColor + " 0%)"; // Default color
				}
				if (this.swipeRightElementStyle) {
					// Right element existed
					this.swipeRightElementStyle.display = "none";
					this.swipeRightElementStyle.background = "-webkit-linear-gradient(right, " + this.options.rtlStartColor + " 0%, " + this.options.rtlEndColor + " 0%)"; // Default color
				}

				this.resetLayoutCallback = null;
				if (this.swipeElement.parentNode !== this.container) {
					this.resetLayoutCallback = (function (parent, nextSibling, element) {
						return function () {
							try {
								if (nextSibling) {
									parent.insertBefore(element, nextSibling);
								} else {
									parent.appendChild(element);
								}
							} catch (e) {
								element.parentNode.removeChild(element);
							}
						};
					}(this.swipeElement.parentNode, this.swipeElement.nextElementSibling, this.swipeElement));
					this.container.appendChild(this.swipeElement);
				}
			};

			prototype._reset = function () {
				this.container.style.position = "";

				this.swipeElementStyle.display = "";
				this.swipeElementStyle.background = "";
				this.swipeElementStyle.width = "";
				this.swipeElementStyle.height = "";

				this.swipeLeftElementStyle.display = "";
				this.swipeLeftElementStyle.background = "";

				this.swipeRightElementStyle.display = "";
				this.swipeRightElementStyle.background = "";

				if (this.resetLayoutCallback) {
					this.resetLayoutCallback();
				}
				this._unbindEvents();
			};

			prototype._bindEvents = function () {

				ns.event.enableGesture(
					this.element,

					new Gesture.Drag({
						threshold: this.options.threshold,
						blockVertical: true
					}),

					new Gesture.Swipe({
						orientation: Gesture.Orientation.HORIZONTAL
					})
				);

				utilsEvents.on(this.element, "drag dragstart dragend dragcancel swipe", this);
				utilsEvents.on(document, "scroll touchcancel", this);
			};

			prototype._unbindEvents = function () {
				ns.event.disableGesture(this.element);

				utilsEvents.off(this.element, "drag dragstart dragend dragcancel swipe", this);
				utilsEvents.off(document, "scroll touchcancel", this);
			};

			prototype.handleEvent = function (event) {
				switch (event.type) {
					case "dragstart":
						this._start(event);
						break;
					case "drag":
						this._move(event);
						break;
					case "dragend":
						this._end(event);
						break;
					case "swipe":
						this._swipe(event);
						break;
					case "dragcancel":
					case "scroll":
						this._cancel();
						break;
				}
			};

			prototype._translate = function (activeElementStyle, translateX, anim) {
				var deltaX = translateX / window.innerWidth * 100,
					self = this,
					fromColor, toColor, prefix;

				if (this.swipeLeftElement && translateX >= 0) {
					// left
					fromColor = self.options.ltrStartColor;
					toColor = self.options.ltrEndColor;
					prefix = "left";
				} else if (this.swipeRightElement && translateX < 0) {
					fromColor = self.options.rtlStartColor;
					toColor = self.options.rtlEndColor;
					prefix = "right";
					deltaX = Math.abs(deltaX);
				}

				( function animate() {
					activeElementStyle.background = "-webkit-linear-gradient(" + prefix + ", " + fromColor + " 0%, " + toColor + " " + deltaX + "%)";
					if (anim && deltaX < self.options.animationDuration) {
						self._animating = true;
						deltaX += self.options.animationInterval;
						window.webkitRequestAnimationFrame(animate);
					} else if (anim && deltaX >= self.options.animationDuration) {
						self._animating = false;
						self._transitionEnd();
					}
				}());
			};

			prototype._findScrollableElement = function (elem) {
				while (( elem.scrollHeight <= elem.offsetHeight ) && ( elem.scrollWidth <= elem.offsetWidth )) {
					elem = elem.parentNode;
				}
				return elem;
			};

			prototype._findSwipeTarget = function (element) {
				var selector = this.options.swipeTarget;

				while (element && element.webkitMatchesSelector && !element.webkitMatchesSelector(selector)) {
					element = element.parentNode;
				}
				return element;
			};

			prototype._fireEvent = function (eventName, detail) {
				var target = this.activeTarget || this.listElement;
				utilsEvents.trigger(target, eventName, detail);
			};

			prototype._start = function (e) {
				var gesture = e.detail,
					containerTop, width, height, top;

				this._dragging = false;
				this._cancelled = false;

				this.activeTarget = this._findSwipeTarget(gesture.srcEvent.target);

				if (this.activeTarget) {

					width = this.activeTarget.offsetWidth;
					height = this.activeTarget.offsetHeight;
					containerTop = this.container.scrollTop;
					top = this.activeTarget.offsetTop - containerTop;

					this.swipeElementStyle.top = containerTop + "px";

					if (this.swipeLeftElementStyle) {
						this.swipeLeftElementStyle.width = width + "px";
						this.swipeLeftElementStyle.height = height + "px";
						this.swipeLeftElementStyle.top = top + "px";
					}
					if (this.swipeRightElementStyle) {
						this.swipeRightElementStyle.width = width + "px";
						this.swipeRightElementStyle.height = height + "px";
						this.swipeRightElementStyle.top = top + "px";
					}

					this._dragging = true;
				}
			};

			prototype._move = function (e) {
				var gesture = e.detail,
					translateX = gesture.estimatedDeltaX,
					activeElementStyle;

				if (!this._dragging || this._cancelled) {
					return;
				}

				if (this.swipeLeftElement && ( gesture.direction === Gesture.Direction.RIGHT )) {
					if (this.swipeRightElementStyle) {
						this.swipeRightElementStyle.display = "none";
					}
					this.activeElement = this.swipeLeftElement;
					activeElementStyle = this.swipeLeftElementStyle;

				} else if (this.swipeRightElement && ( gesture.direction === Gesture.Direction.LEFT )) {
					if (this.swipeLeftElementStyle) {
						this.swipeLeftElementStyle.display = "none";
					}
					this.activeElement = this.swipeRightElement;
					activeElementStyle = this.swipeRightElementStyle;
				}

				if (!activeElementStyle) {
					return;
				}

				activeElementStyle.display = "block";
				this.swipeElementStyle.display = "block"; // wrapper element

				this._translate(activeElementStyle, translateX, false);
			};

			prototype._end = function (e) {
				var gesture = e.detail;

				if (!this._dragging || this._cancelled) {
					return;
				}

				if (this.swipeLeftElement && ( gesture.estimatedDeltaX > this.options.animationThreshold )) {
					this._fire(eventType.LEFT, e);
				} else if (this.swipeRightElement && ( gesture.estimatedDeltaX < -this.options.animationThreshold )) {
					this._fire(eventType.RIGHT, e);
				} else {
					this._hide();
				}

				this._dragging = false;
			};

			prototype._swipe = function (e) {
				var gesture = e.detail;

				if (!this._dragging || this._cancelled) {
					return;
				}

				if (this.swipeLeftElement && ( gesture.direction === Gesture.Direction.RIGHT )) {
					this._fire(eventType.LEFT, e);
				} else if (this.swipeRightElement && ( gesture.direction === Gesture.Direction.LEFT )) {
					this._fire(eventType.RIGHT, e);
				} else {
					this._hide();
				}

				this._dragging = false;
			};

			prototype._fire = function (type, e) {
				var gesture = e.detail;

				if (type === eventType.LEFT) {
					this._translate(this.swipeLeftElementStyle, gesture.estimatedDeltaX, true);
				} else if (type === eventType.RIGHT) {
					this._translate(this.swipeRightElementStyle, gesture.estimatedDeltaX, true);
				}
			};

			prototype._transitionEnd = function () {
				this._hide();

				if (this.activeElement === this.swipeLeftElement) {
					this._fireEvent(eventType.LEFT);
				} else if (this.activeElement === this.swipeRightElement) {
					this._fireEvent(eventType.RIGHT);
				}
			};

			prototype._cancel = function () {
				this._dragging = false;
				this._cancelled = true;
				this._hide();
			};

			prototype._hide = function () {
				if (this.swipeElementStyle) {
					this.swipeElementStyle.display = "none";
				}

				if (this.activeElement) {
					this.activeElement.style.display = "none";
				}
			};

			prototype._destroy = function () {
				this._reset();

				this.element = null;
				this.container = null;
				this.swipeElement = null;
				this.swipeLeftElement = null;
				this.swipeRightElement = null;

				this.swipeElementStyle = null;
				this.swipeLeftElementStyle = null;
				this.swipeRightElementStyle = null;

				this.activeElement = null;
				this.activeTarget = null;

				this.startX = null;
				this.options = null;
				this.gesture = null;

				this._cancelled = null;
				this._dragging = null;
				this._animating = null;
			};

			SwipeList.prototype = prototype;

			ns.widget.wearable.SwipeList = SwipeList;

			engine.defineWidget(
				"SwipeList",
				".ui-swipe",
				[],
				SwipeList
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
