/*global window, define, HTMLElement */
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
 * @class ns.router.PageTransition
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/router", // fetch namespace
			"../../../core/util",
			"../../../core/util/selectors",
			"../../../core/util/DOM/attributes",
			"../../../core/util/deferred",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var MAX_SCROLL_FOR_TRANSITION_FACTOR = 3,
				util = ns.util,
				selectors = util.selectors,
				isPageTransitioning = false,
				pageTransitionQueue = [],
				RouterPage = ns.router.Page,
				parentInit = RouterPage.prototype.init,
				//existing base tag?
				//tuck away the original document URL minus any fragment.
				activeClickedLink,
				transitions = {},
				DOM = util.DOM,
				UtilsDeferred = util.deferred,
				engine = ns.engine,
				maxTransitionWidth = false,
				getMaxScrollForTransition = function () {
					return window.offsetHeight * MAX_SCROLL_FOR_TRANSITION_FACTOR;
				},
				defaultHomeScroll = 0,
				classes = {
					uiPagePreIn: "ui-page-pre-in",
					uiMobileViewportTransitioning: 'ui-mobile-viewport-transitioning',
					viewportPrefix: 'viewport-',
					reverse: "reverse",
					out: 'out',
					inClass: 'in',
					uiBlocker: "ui-blocker"
				},
				transitionHandler = function (sequential) {

					// Default to sequential
					if (sequential === undefined) {
						sequential = true;
					}

					return function (name, reverse, to, from) {

						var deferred = new UtilsDeferred(),
							router = ns.engine.getRouter(),
							focusPage = router.focusPage,
							container = router.container,
							reverseClass = reverse ? classes.reverse : "",
							toScroll = 0,//active.lastScroll || defaultHomeScroll,
							screenHeight = window.offsetHeight,
							maxTransitionOverride = maxTransitionWidth !== false && window.offsetWidth > maxTransitionWidth,
							none = maxTransitionOverride || !name || name === "none" || Math.max(window.scrollY, toScroll) > getMaxScrollForTransition(),
							toPreClass = classes.uiPagePreIn,
							toggleViewportClass = function () {
								var containerClassList = container.classList;
								containerClassList.toggle(classes.uiMobileViewportTransitioning);
								containerClassList.toggle(classes.viewportPrefix + name);
							},
							fromWidget,
							toWidget,
							fromClassList = from && from.classList,
							toClassList = to.classList,
							toStyle = to.style,
							fromStyle = from && from.style,
							scrollPage = function () {
								// Prevent blinking on page scrolling in Tizen/Android devices.
								// Don't scoll window, when current scroll top(scrollY) is already at toScroll,
								// or when current scroll top is 0 and toScroll is same to defaultHomeScroll
								// (which means the top position of page). In these case, page scrolling is not needed.
								var st = window.scrollY;
								if (st === toScroll || (defaultHomeScroll === toScroll && st === 0)) {
									return;
								}

								// By using scrollTo instead of silentScroll, we can keep things better in order
								// Just to be precautios, disable scrollstart listening like silentScroll would
								ns.setConfig('event.special.scrollstart.enabled', false);

								window.scrollTo(0, toScroll);

								// reenable scrollstart listening like silentScroll would
								// 150ms timeout ensures that the scrolling will be complete
								setTimeout(function () {
									ns.setConfig('event.special.scrollstart.enabled', true);
								}, 150);
							},
							cleanFrom = function () {
								fromWidget = engine.getBinding(from);
								if (fromWidget) {
									fromWidget.setActive(false, router.getContainer());
								}
								fromClassList.remove(classes.out);
								fromClassList.remove(classes.inClass);
								fromClassList.remove(classes.reverse);
								fromClassList.remove(name);
								fromStyle.height = '';
							},
							doneIn = function () {
								to.removeEventListener("animationend", doneIn, false);
								to.removeEventListener("webkitAnimationEnd", doneIn, false);
								if (!sequential) {
									if (from) {
										cleanFrom();
									}
								}

								toClassList.remove(classes.out);
								toClassList.remove(classes.inClass);
								toClassList.remove(classes.reverse);
								toClassList.remove(name);
								toStyle.height = '';

								toggleViewportClass();

								// In some browsers (iOS5), 3D transitions block the ability to scroll to the desired location during transition
								// This ensures we jump to that spot after the fact, if we aren't there already.
								if (window.scrollY !== toScroll) {
									scrollPage();
								}

								deferred.resolve(name, reverse, to, from, true);
							},
							startIn = function () {
								// Prevent flickering in phonegap container: see comments at #4024 regarding iOS
								toStyle.zIndex = -10;

								toWidget = engine.instanceWidget(to, DOM.getNSData(to, 'role') === 'page' ? 'Page' : 'Dialog');
								toWidget.setActive(true, router.getContainer());

								toClassList.add(toPreClass);

								// Send focus to page as it is now display: block
								focusPage(to);

								// Set to page height
								toStyle.height = screenHeight + toScroll;

								scrollPage();

								// Restores visibility of the new page: added together with $to.css("z-index", -10);
								toStyle.zIndex = '';

								if (!none) {
									to.addEventListener("animationend", doneIn, false);
									to.addEventListener("webkitAnimationEnd", doneIn, false);
								}

								toClassList.remove(toPreClass);
								toClassList.add(name);
								toClassList.add(classes.inClass);
								if (reverseClass) {
									toClassList.add(reverseClass);
								}

								if (none) {
									setTimeout(doneIn, 0);
								}

							},
							doneOut = function () {
								if (from && sequential) {
									from.removeEventListener("animationend", doneOut, false);
									from.removeEventListener("webkitAnimationEnd", doneOut, false);
									cleanFrom();
								}
								startIn();
							},
							startOut = function () {
								// if it's not sequential, call the doneOut transition to start the TO page animating in simultaneously
								if (sequential) {
									from.addEventListener("animationend", doneOut, false);
									from.addEventListener("webkitAnimationEnd", doneOut, false);
								} else {
									doneOut();
								}

								// Set the from page's height and start it transitioning out
								// Note: setting an explicit height helps eliminate tiling in the transitions
								fromStyle.height = screenHeight + window.scrollY;
								fromClassList.add(name);
								fromClassList.add(classes.out);
								if (reverseClass) {
									fromClassList.add(reverseClass);
								}
							};

						toggleViewportClass();

						if (from && !none) {
							startOut();
						} else {
							doneOut();
						}

						return deferred.promise();
					};
				};
			/**
			 * @method _maybeDegradeTransition
			 * @param {string} transition
			 * @member ns.router.PageTransition
			 * @private
			 * @static
			 * @return {string} transition
			 */
			function _maybeDegradeTransition(transition) {
				if (transition && !ns.support.cssTransform3d && transitions[transition] && transitions[transition].fallback) {
					transition = transitions[transition].fallback;
				}

				return transition;
			}
			/**
			 * @method removeEventBlocker
			 * @member ns.router.PageTransition
			 * @private
			 * @static
			 */
			function removeEventBlocker() {
				var html = document.querySelector('html');
				html.classList.remove(classes.uiBlocker);
				//$html.unbind( "touchstart touchend vclick mousedown mouseup click" );
			}
			/**
			 * @method transitionPages
			 * @param {HTMLElement} toPage
			 * @param {HTMLElement} fromPage
			 * @param {string} transition
			 * @param {boolean} reverse
			 * @member ns.router.PageTransition
			 * @private
			 * @static
			 * @return {Object} promise
			 */
			function transitionPages(toPage, fromPage, transition, reverse) {
				var handler = (transitions[transition || "default"] && transitions[transition || "default"].handler) || transitions["default"].handler,
					promise = handler(transition, reverse, toPage, fromPage);

				//clear page loader
				//$.mobile.hidePageLoadingMsg();

				transition = _maybeDegradeTransition(transition);

				//find the transition handler for the specified transition. If there
				//isn't one in our transitionHandlers dictionary, use the default one.
				//call the handler immediately to kick-off the transition.

				promise.done(function () {
					util.requestAnimationFrame(function () {
						removeEventBlocker();
					});
				});

				return promise;
			}
			/**
			 * @method removeActiveLinkClass
			 * @param {boolean} forceRemoval
			 * @member ns.router.PageTransition
			 * @private
			 * @static
			 */
			function removeActiveLinkClass(forceRemoval) {
				if (!!activeClickedLink && (!selectors.getClosestByClass(activeClickedLink, ns.getConfig('activePageClass')).length || forceRemoval)) {
					activeClickedLink.classList.remove(ns.getConfig('activeBtnClass'));
				}
				activeClickedLink = null;
			}
			/**
			 * @method releasePageTransitionLock
			 * @param {ns.router.Page} router
			 * @member ns.router.PageTransition
			 * @private
			 * @static
			 */
			function releasePageTransitionLock(router) {
				isPageTransitioning = false;
				if (pageTransitionQueue.length > 0) {
					router.open(pageTransitionQueue.pop());
				}
			}
			/**
			 * @method changePage
			 * @param {Object} settings
			 * @param {Object} [settings.fromPage]
			 * @param {Object} [settings.toPage]
			 * @param {string} [settings.transition]
			 * @param {boolean} [settings.reverse=false]
			 * @param {boolean} [settings.duplicateCachedPage]
			 * @member ns.router.PageTransition
			 * @instance
			 */
			RouterPage.prototype.changePage = function (settings) {
				var fromPage = settings.fromPage,
					toPage = settings.toPage,
					router = this;

				if (isPageTransitioning) {
					pageTransitionQueue.unshift(arguments);
					return;
				}

				transitionPages(toPage, fromPage, settings.transition, settings.reverse)
					.done(function (name, reverse, toPage, fromPage) {
						var duplicateCachedPage = settings.duplicateCachedPage;
						removeActiveLinkClass();

						//if there's a duplicateCachedPage, remove it from the DOM now that it's hidden
						if (duplicateCachedPage instanceof HTMLElement) {
							duplicateCachedPage.parentNode.removeChild(duplicateCachedPage);
						}

						releasePageTransitionLock(router);
						router.changePageFinish(fromPage, toPage);
						isPageTransitioning = false;
					});
			};
			/**
			 * @method registerTransition
			 * @param {string} name
			 * @param {Object} handler
			 * @param {Object} fallback
			 * @member ns.router.PageTransition
			 * @instance
			 */
			RouterPage.prototype.registerTransition = function (name, handler, fallback) {
				transitions[name] = {
					handler: handler,
					fallback: fallback
				};
			};
			/**
			 * @method getTransitions
			 * @member ns.router.PageTransition
			 * @return {Array} transitions
			 * @instance
			 */
			RouterPage.prototype.getTransitions = function () {
				return transitions;
			};
			/**
			 * @method getTransition
			 * @param {string} name
			 * @member ns.router.PageTransition
			 * @return {Object} transition
			 * @instance
			 */
			RouterPage.prototype.getTransition = function (name) {
				return transitions[name];
			};

			RouterPage.prototype._maybeDegradeTransition = _maybeDegradeTransition;

			RouterPage.prototype.getMaxScrollForTransition = getMaxScrollForTransition;
			/**
			 * @method init
			 * @param {boolean} justBuild
			 * @member ns.router.PageTransition
			 * @instance
			 */
			RouterPage.prototype.init = function (justBuild) {
				var self = this;
				self.registerTransition('sequential', transitionHandler());
				self.registerTransition('simultaneous', transitionHandler(false));
				self.registerTransition('default', self.getTransition('sequential').handler);
				self.registerTransition('flip', null, "fade");
				self.registerTransition('depth', self.getTransition('simultaneous').handler, "fade");
				self.registerTransition('flow', null, "fade");
				self.registerTransition('pop', null, "fade");
				self.registerTransition('slide', self.getTransition('simultaneous').handler, "fade");
				self.registerTransition('slidedown', null, "fade");
				self.registerTransition('slideup', null, "fade");
				self.registerTransition('slidefade', null, "fade");
				self.registerTransition('turn', null, "fade");
				parentInit.call(self, justBuild);
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.router.Page;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
