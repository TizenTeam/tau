/*global window, define, ns*/
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
/**
 * #Scroll View Widget
 *
 * @class ns.widget.mobile.Scrollview
 * @extends ns.widget.BaseWidget
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/utils/easing",
			"../../../../core/utils/DOM/css",
			"../../../../core/utils/DOM/attributes",
			"../../../../core/utils/selectors",
			"../../../../core/event/orientationchange",
			"../../../../core/event/vmouse",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile",
			"./Button",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @private
			 * @member ns.widget.mobile.Scrollview
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {ns.engine} engine Alias to ns.engine
				 * @private
				 * @member ns.widget.mobile.Scrollview
				 */
					engine = ns.engine,
				/**
				 * @property {Object} utils Alias to ns.utils
				 * @private
				 * @member ns.widget.mobile.Scrollview
				 */
					utils = ns.utils,
				/**
				 * @property {Object} easingUtils Alias to ns.utils.easing
				 * @private
				 * @member ns.widget.mobile.Scrollview
				 */
					easingUtils = ns.utils.easing,
				/**
				 * @property {Object} eventUtils Alias to ns.event
				 * @private
				 * @member ns.widget.mobile.Scrollview
				 */
					eventUtils = ns.event,
				/**
				 * @property {Object} DOMUtils Alias to ns.utils.DOM
				 * @private
				 * @member ns.widget.mobile.Scrollview
				 */
					DOMUtils = ns.utils.DOM,
				/**
				 * @property {Object} selectors Alias to ns.utils.selectors
				 * @private
				 * @member ns.widget.mobile.Scrollview
				 */
					selectors = ns.utils.selectors,
				/**
				 * @method currentTransition
				 * @private
				 * @member ns.widget.mobile.Scrollview
				 */
					currentTransition = null,
				/**
				* @property {Object} Page Alias to ns.widget.mobile.Page
				* @private
				* @member ns.widget.mobile.Scrollview
				*/
				Page = ns.widget.mobile.Page,
				/**
				* @property {string} pageClass Alias to ns.widget.mobile.Page.classes.uiPage
				* @private
				* @member ns.widget.mobile.Scrollview
				*/
				pageClass = Page.classes.uiPage,
				/**
				* @property {string} pageActiveClass Alias to ns.widget.mobile.Page.classes.uiPageActive
				* @private
				* @member ns.widget.mobile.Scrollview
				*/
				pageActiveClass = Page.classes.uiPageActive,
				/**
				* @property {Object} Scrollview
				* @private
				* @member ns.widget.mobile.Scrollview
				*/
				Scrollview = function () {
					var self = this;
					self.state = {
						currentTransition: null
					};
					self.scrollDuration = 300;
					self.scrollviewSetHeight = false;
					self.options = {
						scroll: "y",
						scrollJump: false
					};
					self.ui = self.ui || {};
					self.ui.view = null;
					self.ui.page = null;
					self.ui.jumpHorizontalButton = null;
					self.ui.jumpVerticalButton = null;
					self._callbacks = {
						repositionJumps: null,
						jumpTop: null,
						jumpBottom: null
					};
				},
				classes =  {
					view: "ui-scrollview-view",
					clip: "ui-scrollview-clip",
					jumpTop: "ui-scroll-jump-top-bg",
					jumpLeft: "ui-scroll-jump-left-bg"
				};

			/*
			 * Changes static position to relative
			 * @method makePositioned
			 * @param {HTMLElement} view
			 * @private
			 * @member ns.widget.mobile.Scrollview
			 */
			function makePositioned(view) {
				if (DOMUtils.getCSSProperty(view, "position") === "static") {
					view.style.position = "relative";
				} else {
					view.style.position = "absolute";
				}
			}

			/**
			 * Translation animation loop
			 * @method translateTransition
			 * @param {Object} state Scrollview instance state
			 * @param {HTMLElement} element
			 * @param {number} startTime
			 * @param {number} startX
			 * @param {number} startY
			 * @param {number} translateX
			 * @param {number} translateY
			 * @param {number} endX
			 * @param {number} endY
			 * @param {number} duration
			 * @private
			 * @member ns.widget.mobile.Scrollview
			 */
			function translateTransition(state, element, startTime, startX, startY, translateX, translateY, endX, endY, duration) {
				var timestamp = (new Date()).getTime() - startTime,
					newX = parseInt(easingUtils.cubicOut(timestamp, startX, translateX, duration), 10),
					newY = parseInt(easingUtils.cubicOut(timestamp, startY, translateY, duration), 10);
				if (element.scrollLeft !== endX) {
					element.scrollLeft = newX;
				}
				if (element.scrollTop !== endY) {
					element.scrollTop = newY;
				}

				if ((newX !== endX || newY !== endY) &&
					(newX >= 0 && newY >= 0) &&
					state.currentTransition) {
					utils.requestAnimationFrame(state.currentTransition);
				} else {
					state.currentTransition = null;
				}
			}

			/**
			 * Translates scroll posotion directly or with an animation
			 * if duration is specified
			 * @method translate
			 * @param {Object} state Scrollview instance state
			 * @param {HTMLElement} element
			 * @param {number} x
			 * @param {number} y
			 * @param {number=} [duration]
			 * @private
			 * @member ns.widget.mobile.Scrollview
			 */
			function translate(state, element, x, y, duration) {
				if (duration) {
					state.currentTransition = translateTransition.bind(
						null,
						state,
						element,
						(new Date()).getTime(),
						element.scrollLeft,
						element.scrollTop,
						x,
						y,
						element.scrollLeft + x,
						element.scrollTop + y,
						duration
					);
					utils.requestAnimationFrame(state.currentTransition);
				} else {
					if (x) {
						element.scrollLeft = element.scrollLeft + x;
					}
					if (y) {
						element.scrollTop = element.scrollTop + y;
					}
				}
			}

			function repositionJumps(self) {
				var ui = self.ui,
					horizontalJumpButton = ui.jumpHorizontalButton,
					verticalJumpButton = ui.jumpVerticalButton,
					offsets = horizontalJumpButton || verticalJumpButton ? DOMUtils.getElementOffset(self.element) : null; // dont calc when not used

				if (horizontalJumpButton) {
					horizontalJumpButton.style.left = offsets.left + "px";
				}

				if (verticalJumpButton) {
					verticalJumpButton.style.top = offsets.top + "px";
				}
			}

			Scrollview.classes = classes;

			Scrollview.prototype = new BaseWidget();

			/**
			 * Builds the widget
			 * @method _build
			 * @protected
			 * @member ns.widget.mobile.Scrollview
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @instance
			 */
			Scrollview.prototype._build = function (element) {
				//@TODO wrap element's content with external function
				var self = this,
					ui = self.ui,
					view = selectors.getChildrenByClass(element, classes.view)[0] || document.createElement('div'),
					clipStyle = element.style,
					node = null,
					child = element.firstChild,
					options = self.options,
					direction = options.scroll,
					jumpButton,
					jumpBackground;
				view.className = classes.view;

				while (child) {
					node = child;
					child = child.nextSibling;
					if (view !== node) {
						view.appendChild(node);
					}
				}

				if (view.parentNode !== element) {
					element.appendChild(view);
				}

				// setting view style
				makePositioned(view);

				element.classList.add(classes.clip);

				switch (direction) {
					case "x":
						clipStyle.overflowX = "scroll";
						break;
					case "xy":
						clipStyle.overflow = "scroll";
						break;
					default:
						clipStyle.overflowY = "scroll";
						break;
				}

				if (options.scrollJump) {
					if (direction.indexOf("x") > -1) {
						jumpBackground = document.createElement('div');
						jumpBackground.className = classes.jumpLeft;
						jumpButton = document.createElement('div');

						jumpBackground.appendChild(jumpButton);
						element.appendChild(jumpBackground);
						engine.instanceWidget(
							jumpButton,
							"Button",
							{
								"icon": "scrollleft",
								"style": "box"
							}
						);
						ui.jumpHorizontalButton = jumpBackground;
					}

					if (direction.indexOf("y") > -1) {
						jumpBackground = document.createElement('div');
						jumpBackground.className = classes.jumpTop;
						jumpButton = document.createElement('div');

						jumpBackground.appendChild(jumpButton);
						element.appendChild(jumpBackground);
						engine.instanceWidget(
							jumpButton,
							"Button",
							{
								"icon": "scrolltop",
								"style": "box"
							}
						);
						ui.jumpVerticalButton = jumpBackground;
					}
				}

				ui.view = view;
				// @TODO
				//this._addOverflowIndicator(element);
				return element;
			};

			/**
			 * Inits widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Scrollview
			 * @instance
			 */
			Scrollview.prototype._init = function (element) {
				var ui = this.ui,
					page = ui.page;

				if (!ui.view) {
					ui.view = selectors.getChildrenByClass(element, classes.view)[0];
				}

				if (!page) {
					page = selectors.getClosestByClass(element, pageClass);
					if (page) {
						ui.page = page;
						if (page.classList.contains(pageActiveClass) && this.options.scrollJump) {
							repositionJumps(this);
						}
					}
				}
			};

			/**
			 * Adds overflow indicators
			 * @method _addOverflowIndicator
			 * @protected
			 * @member ns.widget.mobile.Scrollview
			 * @param {HTMLElement} clip
			 * @instance
			 */
			Scrollview.prototype._addOverflowIndicator = function (clip) {
				if ((clip.getAttribute('data-overflow-enable') || 'true') === 'false') {
					return;
				}
				clip.insertAdjacentHTML('beforeend', '<div class="ui-overflow-indicator-top"></div><div class="ui-overflow-indicator-bottom"></div>');
			};

			/**
			 * Scrolls to specified position
			 * @method scrollTo
			 * @protected
			 * @member ns.widget.mobile.Scrollview
			 * @param {number} x
			 * @param {number} y
			 * @param {number=} [duration]
			 * @instance
			 */
			Scrollview.prototype.scrollTo = function (x, y, duration) {
				var element = this.element;
				this.translateTo(x - element.scrollLeft, y - element.scrollTop, duration);
			};

			/**
			 * Translates the scroll to specified position
			 * @method translateTo
			 * @member ns.widget.mobile.Scrollview
			 * @param {number} x
			 * @param {number} y
			 * @param {number=} [duration]
			 * @instance
			 */
			Scrollview.prototype.translateTo = function (x, y, duration) {
				translate(this.state, this.element, x, y, duration);
			};

			/**
			 * Ensures that specified element is visible in the
			 * clip area
			 * @method ensureElementIsVisible
			 * @member ns.widget.mobile.Scrollview
			 * @param {HTMLElement} element
			 * @instance
			 */
			Scrollview.prototype.ensureElementIsVisible = function (element) {
				var clip = this.element,
					clipHeight = DOMUtils.getElementHeight(clip),
					clipWidth = DOMUtils.getElementWidth(clip),
					clipTop = 0,
					clipBottom = clipHeight,
					elementHeight = DOMUtils.getElementHeight(element),
					elementWidth = DOMUtils.getElementWidth(element),
					elementTop = 0,
					elementBottom,
					elementFits = clipHeight >= elementHeight && clipWidth >= elementWidth,
					anchor,
					anchorPositionX,
					anchorPositionY,
					parent,
					findPositionAnchor = function (input) {
						var id = input.getAttribute("id"),
							tagName = input.tagName.toLowerCase();
						if (id && ["input", "textarea", "button"].indexOf(tagName) > -1) {
							return input.parentNode.querySelector("label[for=" + id + "]");
						}
					},
					_true = true;

				parent = element.parentNode;
				while (parent && parent.node !== clip) {
					elementTop += parent.offsetTop;
					//elementLeft += parent.offsetLeft;
					parent = parent.parentNode;
				}
				elementBottom = elementTop + elementHeight;
				//elementRight = elementLeft + elementWidth;

				switch (_true) {
					case elementFits && clipTop < elementTop && clipBottom > elementBottom: // element fits in view is inside clip area
						// pass, element position is ok
						break;
					case elementFits && clipTop < elementTop && clipBottom < elementBottom: // element fits in view but its visible only at top
					case elementFits && clipTop > elementTop && clipBottom > elementBottom: // element fits in view but its visible only at bottom
					case elementFits: // element fits in view but is not visible
						this.centerToElement(element);
						break;
					case clipTop < elementTop && clipBottom < elementBottom: // element visible only at top
					case clipTop > elementTop && clipBottom > elementBottom: // element visible only at bottom
						// pass, we cant do anything, if we move the scroll
						// the user could lost view of something he scrolled to
						break;
					default: // element is not visible
						anchor = findPositionAnchor(element);
						if (!anchor) {
							anchor = element;
						}
						anchorPositionX = anchor.offsetLeft + DOMUtils.getCSSProperty(anchor, "margin-left", 0, "integer");
						anchorPositionY = anchor.offsetTop + DOMUtils.getCSSProperty(anchor, "margin-top", 0, "integer");
						parent = anchor.parentNode;
						while (parent && parent !== clip) {
							anchorPositionX = parent.offsetLeft + DOMUtils.getCSSProperty(parent, "margin-left", 0, "integer");
							anchorPositionY = parent.offsetTop + DOMUtils.getCSSProperty(parent, "margin-top", 0, "integer");
							parent = parent.parentNode;
						}
						this.scrollTo(anchorPositionX, anchorPositionY, this.scrollDuration);
						break;
				}
			};

			/**
			 * Centers specified element in the clip area
			 * @method centerToElement
			 * @member ns.widget.mobile.Scrollview
			 * @param {HTMLElement} element
			 * @instance
			 */
			Scrollview.prototype.centerToElement = function (element) {
				var clip = this.element,
					deltaX = parseInt(DOMUtils.getElementWidth(clip) / 2 - DOMUtils.getElementWidth(element) / 2, 10),
					deltaY = parseInt(DOMUtils.getElementHeight(clip) / 2 - DOMUtils.getElementHeight(element) / 2, 10),
					elementPositionX = element.offsetLeft,
					elementPositionY = element.offsetTop,
					parent = element.parentNode;

				while (parent && parent !== clip) {
					elementPositionX += parent.offsetLeft + DOMUtils.getCSSProperty(parent, "margin-left", 0, "integer");
					elementPositionY += parent.offsetTop + DOMUtils.getCSSProperty(parent, "margin-top", 0, "integer");
					parent = parent.parentNode;
				}
				this.scrollTo(elementPositionX - deltaX, elementPositionY - deltaY, this.scrollDuration);
			};

			/**
			 * This is just for compatibility
			 * @method skipDragging
			 * @member ns.widget.mobile.Scrollview
			 * @deprecated
			 * @instance
			 */
			Scrollview.prototype.skipDragging = function () {
				if (window.console) {
					window.console.warn("ns.widget.mobile.Scrollview: skipDragging is deprecated");
				}
			}; // just for TWEBUIFW compat

			/**
			 * Returns scroll current position
			 * @method getScrollPosition
			 * @member ns.widget.mobile.Scrollview
			 * @return {Object}
			 * @instance
			 */
			Scrollview.prototype.getScrollPosition = function () {
				var element = this.element;
				return {
					"x": element.scrollLeft,
					"y": element.scrollTop
				};
			};

			/**
			 * Binds scrollview events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Scrollview
			 * @instance
			 */
			Scrollview.prototype._bindEvents = function (element) {
				var scrollTimer = null,
					view = element.children[0],
					lastClipHeight = DOMUtils.getElementHeight(element),
					lastClipWidth = DOMUtils.getElementWidth(element),
					notifyScrolled = function () {
						eventUtils.trigger(element, "scrollstop");
						window.clearTimeout(scrollTimer);
						scrollTimer = null;
					},
					self = this,
					//FIXME there should be some other way to get parent container
					ui = self.ui,
					page = ui.page,
					jumpTop = ui.jumpVerticalButton,
					jumpLeft = ui.jumpHorizontalButton,
					repositionJumpsCallback,
					jumpTopCallback,
					jumpLeftCallback,
					callbacks = self._callbacks;

				if (page) {
					if (this.options.scrollJump) {
						repositionJumpsCallback = repositionJumps.bind(null, this);
						jumpTopCallback = function () {
							self.scrollTo(element.scrollLeft, 0, 250);
						};
						jumpLeftCallback = function () {
							self.scrollTo(0, element.scrollTop, 250);
						};
						page.addEventListener("pageshow", repositionJumpsCallback, false);
						if (jumpTop) {
							jumpTop.firstChild.addEventListener("vclick", jumpTopCallback, false);
						}
						if (jumpLeft) {
							jumpLeft.firstChild.addEventListener("vclick", jumpLeftCallback, false);
						}

						callbacks.repositionJumps = repositionJumpsCallback;
						callbacks.jumpTop = jumpTopCallback;
						callbacks.jumpLeft = jumpLeftCallback;
					}

					element.addEventListener("scroll", function () {
						if (scrollTimer) {
							window.clearTimeout(scrollTimer);
						} else {
							eventUtils.trigger(element, "scrollstart");
						}
						scrollTimer = window.setTimeout(notifyScrolled, 50);
						eventUtils.trigger(element, "scrollupdate");
					}, false);


					window.addEventListener("throttledresize", function () {
						var focusedElement = view.querySelector(".ui-focus"),
							clipWidth,
							clipHeight;
						if (focusedElement) {
							self.ensureElementIsVisible(focusedElement);
						} else {
							clipHeight = DOMUtils.getElementHeight(element);
							clipWidth = DOMUtils.getElementWidth(element);
							self.translateTo(
								lastClipWidth - clipWidth,
								lastClipHeight - clipHeight,
								self.scrollDuration
							);
							lastClipHeight = clipHeight;
							lastClipWidth = clipWidth;
						}
					}, false);

					document.addEventListener("vmousedown", function () {
						if (currentTransition) {
							currentTransition = null;
						}
					}, false);

				}
			};

			Scrollview.prototype._destroy = function () {
				var ui = this.ui,
					page = ui.page,
					scrollJump = this.options.scrollJump,
					jumpTop = ui.jumpVerticalButton,
					jumpLeft = ui.jumpHorizontalButton,
					callbacks = this._callbacks,
					repositionJumpsCallback = callbacks.repositionJumps,
					jumpTopCallback = callbacks.jumpTop,
					jumpLeftCallback = callbacks.jumpLeft;

				if (scrollJump) {
					if (page && repositionJumpsCallback) {
						page.removeEventListener("pageshow", repositionJumpsCallback, false);
					}
					if (jumpTop && jumpTopCallback) {
						jumpTop.firstChild.removeEventListener("vclick", jumpTopCallback, false);
					}
					if (jumpLeft && jumpLeftCallback) {
						jumpLeft.firstChild.removeEventListener("vclick", jumpLeftCallback, false);
					}
				}

			};

			ns.widget.mobile.Scrollview = Scrollview;
			engine.defineWidget(
				"Scrollview",
				"[data-role='content']:not([data-scroll='none']):not([data-handler='true']):not(.ui-scrollview-clip):not(.ui-scrolllistview), [data-scroll]:not([data-scroll='none']):not([data-handler='true']), .ui-scrollview",
				[
					"scrollTo",
					"ensureElementIsVisible",
					"centerToElement",
					"getScrollPosition",
					"skipDragging",
					"translateTo"
				],
				Scrollview,
				'tizen'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Scrollview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
