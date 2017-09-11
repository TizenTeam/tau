/*global window, define, ns*/
/*jslint nomen: true */
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
 * # ScrollView Widget
 * Widgets allows for creating scrollable panes, lists, etc.
 *
 * ## Manual constructor
 *
 * To create the widget manually you can use APIs,
 *
 * ### Create scrollview by TAU API
 *
 *@example
 *   <div data-role="page" id="myPage">
 *   </div>
 *   <script>
 *       var page = tau.widget.Page(document.getElementById("myPage")),
 *       scrollview = tau.widget.Scrollview("myPage");
 *   </script>
 *
 * ## Options for Scrollview widget
 *
 * Options can be set using data-* attributes or by passing them to
 * the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation.
 *
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 */

(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/selectors",
			"../../../../core/event",
			"../../../../core/widget/core/scroller/effect/Bouncing",
			"../../../../core/util/DOM/manipulation",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				utilsEvents = ns.event,
				engine = ns.engine,
				/**
				 * Alias for {@link ns.util}
				 * @property {Object} util
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				util = ns.util,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} doms
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				doms = util.DOM,
				/**
				 * Alias for {@link ns.util.selectors}
				 * @property {Object} selectors
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				selectors = util.selectors,
				/**
				 * Alias for {@link ns.util.object}
				 * @property {Object} object
				 * @member ns.widget.wearable.Page
				 * @private
				 * @static
				 */
				scrollBarType = {
					CIRCLE: "tizen-circular-scrollbar"
				},
				EffectBouncing = ns.widget.core.scroller.effect.Bouncing,
				Scrollview = function () {
					this.options = {};
				},
				/**
				 * Dictionary for page related css class names
				 * @property {Object} classes
				 * @member ns.widget.core.Page
				 * @static
				 * @readonly
				 */
				classes = {
					uiHeader: "ui-header",
					uiContent: "ui-content",
					uiPageScroll: "ui-scroll-on",
					uiScroller: "ui-scroller"
				},
				prototype = new BaseWidget();

			prototype._build = function (element) {
				var pageScrollSelector = classes.uiPageScroll,
					children = [].slice.call(element.children),
					scroller,
					content,
					fragment;

				element.classList.add(pageScrollSelector);
				scroller = document.createElement("div");
				scroller.classList.add(classes.uiScroller);
				fragment = document.createDocumentFragment();

				children.forEach(function (value) {
					if (selectors.matchesSelector(value, ".ui-header:not(.ui-fixed), .ui-content, .ui-footer:not(.ui-fixed)")) {
						fragment.appendChild(value);
					}
				});

				if (element.children.length > 0 && element.children[0].classList.contains(classes.uiHeader)) {
					doms.insertNodeAfter(element.children[0], scroller);
				} else {
					element.insertBefore(scroller, element.firstChild);
				}

				scroller.appendChild(fragment);

				if (ns.support.shape.circle) {
					if (scroller) {
						scroller.setAttribute(scrollBarType.CIRCLE, "");
					}
					content = element.querySelector("." + classes.uiContent);
					if (content) {
						content.setAttribute(scrollBarType.CIRCLE, "");
					}
				}

				this.scroller = scroller;

				return element;
			};


			prototype._init = function () {
				this.maxScrollX = 0;
				this.maxScrollY = 0;
				if (this.scroller) {
					this.maxScrollY = this.scroller.scrollHeight - window.innerHeight;
				}
				this.minScrollX = 0;
				this.minScrollY = 0;
				this.bouncingEffect = new EffectBouncing(this.element, {
					maxScrollX: this.maxScrollX,
					maxScrollY: this.maxScrollY,
					orientation: "vertical"
				});
				this.scrollerOffsetX = 0;
				this.scrollerOffsetY = 0;
			};


			prototype._start = function () {
				var self = this;

				self.scrolled = false;
				self.dragging = true;
				self.scrollCanceled = false;
				self.startScrollerOffsetX = self.scrollerOffsetX;
				self.startScrollerOffsetY = self.scrollerOffsetY;
			};

			prototype._end = function () {
				if (this.dragging) {

					// bouncing effect
					if (this.bouncingEffect) {
						this.bouncingEffect.dragEnd();
					}

					this.dragging = false;
				}
			};

			/* jshint -W086 */
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
				}
			};


			prototype._bindEvents = function () {
				ns.event.enableGesture(
					this.scroller,

					new ns.event.gesture.Drag({
						threshold: 30,
						delay: this.options.scrollDelay,
						blockVertical: this.orientation === EffectBouncing.Orientation.HORIZONTAL,
						blockHorizontal: this.orientation === EffectBouncing.Orientation.VERTICAL
					})
				);

				utilsEvents.on(this.scroller, "drag dragstart dragend", this);
			};

			prototype._move = function (event) {
				var newX = this.startScrollerOffsetX,
					newY = this.startScrollerOffsetY;

				if ((this.scroller.scrollTop === 0 && event.detail.deltaY > 0) ||
					(this.scroller.scrollTop === this.maxScrollY && event.detail.deltaY < 0)) {
					if (this.bouncingEffect) {
						this.bouncingEffect.drag(0, -this.scroller.scrollTop);
					}
				}

				this.scrollerOffsetX = newX;
				this.scrollerOffsetY = newY;
			};

			Scrollview.prototype = prototype;
			ns.widget.wearable.Scrollview = Scrollview;

			engine.defineWidget(
				"Scrollview",
				"",
				[],
				Scrollview
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Scrollview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
