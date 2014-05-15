/*global window, define */
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
			"../../../../core/utils/events",
			"../../../../core/event/touch",
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
				events = ns.utils.events,
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

			function triggerAnimationEnd(event) {
				var eventTarget = event.target;

				eventTarget.removeEventListener(webkitTransitionEndEvent, triggerAnimationEnd, false);
				events.trigger(eventTarget, 'animationend');
			}

			function animateCover(self, cover, leftPercentage, item) {
				var coverStyle = cover.style,
					itemStyle = item.style;

				slice.call(self.element.parentNode.querySelectorAll(selectorRoleSwipe)).forEach(function (swipe) {
					var swipeWidget = engine.instanceWidget(swipe, 'Swipe');
					if (self !== swipeWidget && swipeWidget.opened()) {
						swipeWidget.close();
					}
				});

				self._isOpen = leftPercentage === 110;

				// `webkitTransitionEnd` is probably not the best option to determine when animation has finished
				// as it won't fire when element or any parent elements will be hidden, removed or affected property
				// will be changed to different value during transition
				cover.addEventListener(webkitTransitionEndEvent, triggerAnimationEnd, false);

				events.trigger(cover, 'animationstart');

				coverStyle.transition = 'left linear 0.4s';
				coverStyle.webkitTransition = 'left linear 0.4s';

				coverStyle.left = leftPercentage + '%';

				itemStyle.transition = 'opacity linear 0.6s';
				itemStyle.webkitTransition = 'opacity linear 0.6s';

				if (leftPercentage === 0) {
					itemStyle.opacity = 0;
				} else {
					itemStyle.opacity = 1;
				}
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
