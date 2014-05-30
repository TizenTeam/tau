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
 * #Swipe Widget
 *
 * @class ns.widget.Swipe
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/event/touch",
			"../../../../core/util/anim/Animation",
			"../mobile", //namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Swipe = function () {
					var self = this;

					self.options = {
						theme: null
					};
					self._isOpen = false;
					self.moveAnimation = null;
					self.opacityAnimation = null;
				},
				/**
				* @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
				* @member ns.widget.Swipe
				* @private
				* @static
				*/
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {ns.engine} engine Alias for class ns.engine
				* @member ns.widget.Swipe
				* @private
				* @static
				*/
				engine = ns.engine,
				events = ns.event,
				Animation = ns.util.anim.Animation,
				slice = [].slice,
				swipePrototype,
				classPrefix = 'ui-swipe',
				swipeClasses = {
					uiBodyPrefix: 'ui-body-',
					uiSwipe: classPrefix,
					uiSwipeItem: classPrefix + '-item',
					uiSwipeItemCover: classPrefix + '-item-cover',
					uiSwipeItemCoverInner: classPrefix + '-item-cover-inner'
				},
				selectorRoleSwipe = '[data-role="swipe"]',
				selectorRoleSwipeItemCover = '[data-role="swipe-item-cover"]',
				selectorRoleSwipeItem = '[data-role="swipe-item"]',
				classUiBtn = '.ui-btn',
				swipeLeftEvent = 'swipeleft',
				swipeRightEvent = 'swiperight',
				webkitTransitionEndEvent = 'webkitTransitionEnd';


			Swipe.prototype = new BaseWidget();
			swipePrototype = Swipe.prototype;

			function cleanupDom(self, element) {
				var covers,
					item,
					itemHasThemeClass,
					defaultCoverTheme = swipeClasses.uiBodyPrefix + self.options.theme,
					coverTheme = defaultCoverTheme,
					wrapper,
					selfUi = self._ui;

				if (selfUi) {
					covers = selfUi.covers;
					item = selfUi.item;

					element.classList.remove(swipeClasses.uiSwipe);
					item.classList.remove(swipeClasses.uiSwipeItem);

					itemHasThemeClass = element.className.match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/);
					if (itemHasThemeClass) {
						coverTheme = itemHasThemeClass[0];
					}

					covers.forEach(function (cover) {
						var coverClassList = cover.classList;
						coverClassList.remove(swipeClasses.uiSwipeItemCover);
						coverClassList.remove(coverTheme);

						wrapper = cover.querySelector('.' + swipeClasses.uiSwipeItemCoverInner);
						while (wrapper.firstChild) {
							cover.appendChild(wrapper.firstChild);
						}
						wrapper.parentNode.removeChild(wrapper);
					});
				}
			}

			/**
			 * callback for the animation which is triggered when cover is moved or opacity is changed
			 * @method moveAnimationEnd
			 * @param {ns.util.anim.Animation} animation
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.mobile.Swipe
			 */
			function handleAnimationEnd(animation, element) {
				var to = animation.options.to;

				if (to.opacity !== undefined) {
					//@TODO implement "preserve" option in ns.util.anim.Animation
					element.style.opacity = animation.options.to.opacity;
					animation.destroy();
				}
				if (to.left !== undefined) {
					//@TODO implement "preserve" option in ns.util.anim.Animation
					element.style.left = animation.options.to.left;
					animation.destroy();
					events.trigger(element, "swipeanimationend");
				}
			}

			function animateCover(self, cover, leftPercentage, item) {
				var coverStyle = cover.style,
					itemStyle = item.style,
					moveAnimation,
					opacityAnimation,
					swipeWidget;

				slice.call(self.element.parentNode.querySelectorAll(selectorRoleSwipe)).forEach(function (swipe) {
					swipeWidget = engine.instanceWidget(swipe, 'Swipe');
					if (self !== swipeWidget && swipeWidget.opened()) {
						swipeWidget.close();
					}
				});

				self._isOpen = leftPercentage === 110;

				//To pass tests the animation can be triggered only once.
				//Then I need to have a reference to previous animations,
				//in order to destroy it when new animations appear
				if(self.moveAnimation){
					self.moveAnimation.destroy();
					self.opacityAnimation.destroy();
				}

				//animations change the left value to uncover/ cover item element
				moveAnimation = new Animation({
					element: cover,
					duration: "400ms",
					from: {
						"left": coverStyle.left
					},
					to: {
						"left": leftPercentage + '%'
					},
					onEnd: handleAnimationEnd
				});
				self.moveAnimation = moveAnimation;
				moveAnimation.play();

				//animations change item opacity in order to show items under cover
				opacityAnimation = new Animation({
					element: item,
					duration: "600ms",
					from: {
						"opacity": itemStyle.opacity
					},
					to: {
						"opacity": (itemStyle.opacity === 0) ? "0" : "1"
					},
					onEnd: handleAnimationEnd
				});
				self.opacityAnimation = opacityAnimation;
				opacityAnimation.play();
			}

			function refresh(self, element) {
				cleanupDom(self, element);

				var defaultCoverTheme = swipeClasses.uiBodyPrefix + self.options.theme,
					covers = slice.call(element.querySelectorAll(selectorRoleSwipeItemCover)),
					coverTheme = defaultCoverTheme,
					item = element.querySelector(selectorRoleSwipeItem),
					itemHasThemeClass = element.className.match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/),
					selfUi = self._ui || {};

				/*
				* @todo good support multicovers
				*/
				selfUi.covers = covers;
				selfUi.item = item;
				self._ui = selfUi;

				element.classList.add(swipeClasses.uiSwipe);
				item.classList.add(swipeClasses.uiSwipeItem);

				covers.forEach(function (cover) {
					var span,
						coverClassList = cover.classList;

					if (itemHasThemeClass) {
						coverTheme = itemHasThemeClass[0];
					}

					coverClassList.add(swipeClasses.uiSwipeItemCover);
					coverClassList.add(coverTheme);

					if (!cover.querySelector('.' + swipeClasses.uiSwipeItemCoverInner)) {
						span = document.createElement('span');
						span.classList.add(swipeClasses.uiSwipeItemCoverInner);
						while (cover.firstChild) {
							span.appendChild(cover.firstChild);
						}
						cover.appendChild(span);
					}
				});
			}

			swipePrototype._build = function (element) {
				var options = this.options,
					protoOptions = Swipe.prototype.options;
				options.theme = options.theme || ns.theme.getInheritedTheme(element, (protoOptions && protoOptions.theme) || 's');
				refresh(this, element);
				return element;
			};

			swipePrototype._init = function (element) {
				/* @TODO what is swipeSelectors? */
				this._ui = this._ui || {
					covers: slice.call(element.querySelectorAll(selectorRoleSwipeItemCover)),
					item: element.querySelector(swipeSelectors.swipeItem)
				};
			};

			function addEvents(self) {
				var covers = self._ui.covers,
					item = self._ui.item;

					/*
					* @todo good support multicovers
					*/

				covers.forEach(function (cover) {
					cover.swipeAnimateLeft = animateCover.bind(null, self, cover, 0, item);
					cover.swipeAnimateRight = animateCover.bind(null, self, cover, 110, item);

					item.addEventListener(swipeLeftEvent, cover.swipeAnimateLeft, false);
					cover.addEventListener(swipeRightEvent, cover.swipeAnimateRight, false);

					slice.call(item.querySelectorAll(classUiBtn)).forEach(function (button) {
						button.addEventListener('vclick', cover.swipeAnimateLeft, false);
					});
				});
			}

			function removeEvents(self) {
				var selfUI = self._ui,
					covers = selfUI.covers,
					item = selfUI.item;

					/*
					* @todo good support multicovers
					*/

				covers.forEach(function (cover) {
					item.removeEventListener(swipeLeftEvent, cover.swipeAnimateLeft, false);
					cover.removeEventListener(swipeRightEvent, cover.swipeAnimateRight, false);

					slice.call(item.querySelectorAll(classUiBtn)).forEach(function (button) {
						button.removeEventListener('vclick', cover.swipeAnimateLeft, false);
					});
				});
			}

			swipePrototype._bindEvents = function () {
				addEvents(this);
			};

			swipePrototype._destroy = function () {
				var self = this;

				removeEvents(self);
				cleanupDom(self, self.element);
			};

			swipePrototype._refresh = function () {
				refresh(this, this.element);
			};

			swipePrototype.open = function () {
				var self = this;

				self._ui.covers.forEach(function (cover) {
					animateCover(self, cover, 110, self._ui.item);
				});
			};

			swipePrototype.opened = function () {
				return this._isOpen;
			};

			swipePrototype.close = function () {
				var self = this,
					selfUi = self._ui;

				selfUi.covers.forEach(function (cover) {
					animateCover(self, cover, 0, selfUi.item);
				});
			};

			ns.widget.mobile.Swipe = Swipe;
			engine.defineWidget(
				"Swipe",
				selectorRoleSwipe + ", .ui-swipe",
				['open', 'opened', 'close'],
				Swipe,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Swipe;
		}
	);
//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
