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
/*global window, define, XMLHttpRequest, Node, HTMLElement, ns */
/**
 * #Router
 * Main class to navigate between pages and popups in profile Wearable.
 *
 * @class ns.router.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../event",
			"../util/DOM/attributes",
			"../util/selectors",
			"../util/path",
			"../util/object",
			"../router",
			"./route", // fetch namespace
			"./history",
			"../widget/core/Page",
			"../widget/core/PageContainer"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Local alias for ns.util
			 * @property {Object} util Alias for {@link ns.util}
			 * @member ns.router.Router
			 * @static
			 * @private
			 */
			var util = ns.util,
				/**
				 * Local alias for ns.event
				 * @property {Object} eventUtils Alias for {@link ns.event}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				eventUtils = ns.event,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				DOM = util.DOM,
				/**
				 * Local alias for ns.util.path
				 * @property {Object} path Alias for {@link ns.util.path}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				path = util.path,
				/**
				 * Local alias for ns.util.selectors
				 * @property {Object} selectors Alias for {@link ns.util.selectors}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				selectors = util.selectors,
				/**
				 * Local alias for ns.util.object
				 * @property {Object} object Alias for {@link ns.util.object}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				object = util.object,
				/**
				 * Local alias for ns.engine
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Local alias for ns.router
				 * @property {Object} routerMicro Alias for namespace ns.router
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				routerMicro = ns.router,
				/**
				 * Local alias for ns.router.history
				 * @property {Object} history Alias for {@link ns.router.history}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				history = routerMicro.history,
				/**
				 * Local alias for ns.router.route
				 * @property {Object} route Alias for namespace ns.router.route
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				route = routerMicro.route,
				/**
				 * Local alias for document body element
				 * @property {HTMLElement} body
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				body = document.body,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @member ns.router.Router
				 * @private
				 * @static
				 */
				slice = [].slice,

				/**
				 * Router locking flag
				 * @property {boolean} [_isLock]
				 * @member ns.router.Router
				 * @private
				 */
				_isLock = false,

				ORDER_NUMBER = {
					1: "page",
					10: "panel",
					100: "popup",
					1000: "drawer",
					2000: "circularindexscrollbar"
				},

				HASH_REGEXP = /[#|\s]/g,

				Page = ns.widget.core.Page,

				Router = function () {
					var self = this;

					/**
					 * The container of widget.
					 * @property {?ns.widget.core.PageContainer} [container]
					 * @member ns.router.Router
					 */
					self.container = null;
					/**
					 * Settings for last open method
					 * @property {Object} [settings]
					 * @member ns.router.Router
					 */
					self.settings = {};
				};

			/**
			 * Default values for router
			 * @property {Object} defaults
			 * @property {boolean} [defaults.fromHashChange = false] Sets if will be changed after hashchange.
			 * @property {boolean} [defaults.reverse = false] Sets the direction of change.
			 * @property {boolean} [defaults.showLoadMsg = true] Sets if message will be shown during loading.
			 * @property {number} [defaults.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @property {boolean} [defaults.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @member ns.router.Router
			 */
			Router.prototype.defaults = {
				fromHashChange: false,
				reverse: false,
				showLoadMsg: true,
				loadMsgDelay: 0,
				volatileRecord: false
			};

			/**
			 * Find the closest link for element
			 * @method findClosestLink
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @member ns.router.Router
			 */
			function findClosestLink(element) {
				while (element) {
					if (element.nodeType === Node.ELEMENT_NODE && element.nodeName && element.nodeName === "A") {
						break;
					}
					element = element.parentNode;
				}
				return element;
			}

			/**
			 * Handle event link click
			 * @method linkClickHandler
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.router.Router
			 */
			function linkClickHandler(router, event) {
				var link = findClosestLink(event.target),
					href,
					useDefaultUrlHandling,
					options;

				if (link && event.which === 1) {
					href = link.getAttribute("href");
					useDefaultUrlHandling = (link.getAttribute("rel") === "external") || link.hasAttribute("target");
					if (!useDefaultUrlHandling) {
						options = DOM.getData(link);
						router.open(href, options, event);
						eventUtils.preventDefault(event);
					}
				}
			}

			Router.prototype.linkClick = function (event) {
				linkClickHandler(this, event);
			};

			function openUrlFromState(router, state) {
				var rules = routerMicro.route,
					prevState = history.activeState,
					reverse = state && history.getDirection(state) === "back",
					maxOrderNumber,
					orderNumberArray = [],
					ruleKey,
					options,
					url = path.getLocation(),
					isContinue = true,
					transition,
					rule;

				transition = reverse ? ((prevState && prevState.transition) || "none") : state.transition;
				options = object.merge({}, state, {
					reverse: reverse,
					transition: transition,
					fromHashChange: true
				});

				// find rule with max order number
				for (ruleKey in rules) {
					if (rules.hasOwnProperty(ruleKey) && rules[ruleKey].active) {
						orderNumberArray.push(rules[ruleKey].orderNumber);
					}
				}
				maxOrderNumber = Math.max.apply(null, orderNumberArray);
				rule = rules[ORDER_NUMBER[maxOrderNumber]];

				if (rule && rule.onHashChange(url, options, prevState)) {
					if (maxOrderNumber === 10) {
						// rule is panel
						return;
					}
					isContinue = false;
				}

				history.setActive(state);
				if (isContinue) {
					router.open(state.url, options);
				}
			}

			function openUrlFromLocation(router) {
				var prevState = history.activeState,
					url = path.getLocation();

				if (prevState && prevState.absUrl !== url && prevState.stateUrl !== url) {
					history.enableVolatileRecord();
					router.open(url);
				}
			}

			/**
			 * Handle event for pop state
			 * @method popStateHandler
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.router.Router
			 */
			function popStateHandler(router, event) {
				var state = event.state,
					prevState = history.activeState,
					inTransition = router.getContainer().inTransition,
					reverse = state && history.getDirection(state) === "back";

				if (_isLock || (inTransition && reverse)) {
					// don't open any page, only history change in backward
					history.disableVolatileMode();
					history.replace(prevState, prevState.stateTitle, prevState.stateUrl);
				} else if (state) {
					openUrlFromState(router, state);
				} else {
					openUrlFromLocation(router);
				}
			}

			/**
			 * Detect rel attribute from HTMLElement
			 * @param {HTMLElement} to
			 * @member ns.router.Router
			 * @method detectRel
			 */
			Router.prototype.detectRel = function (to) {
				var rule,
					i;

				for (i in route) {
					if (route.hasOwnProperty(i)) {
						rule = route[i];
						if (selectors.matchesSelector(to, rule.filter)) {
							return i;
						}
					}
				}
			};

			/**
			 * Open given page with deferred
			 * @method _openDeferred
			 * @param {HTMLElement} to HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {Event} event
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._openDeferred = function (to, options, event) {
				var self = this,
					rule = route[options.rel],
					deferred = {
						resolve: function (options, content) {
							rule.open(content, options, event);
						},
						reject: function (options) {
							eventUtils.trigger(self.container.element, "changefailed", options);
						}
					};

				if (typeof to === "string") {
					if (to.replace(HASH_REGEXP, "")) {
						self._loadUrl(to, options, rule, deferred);
					}
				} else {
					// execute deferred object immediately
					if (to && selectors.matchesSelector(to, rule.filter)) {
						deferred.resolve(options, to);
					} else {
						deferred.reject(options);
					}
				}
			};

			/**
			 * Change page to page given in parameter "to".
			 * @method open
			 * @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {Event} event
			 * @member ns.router.Router
			 */
			Router.prototype.open = function (to, options, event) {
				var self = this,
					rel,
					rule;

				if (!_isLock) {
					to = getHTMLElement(to);
					rel = (options && options.rel) ||
						(to instanceof HTMLElement && self.detectRel(to));
					rel = rel || "page";
					rule = route[rel];

					if (rel === "back") {
						history.back();
					} else if (rule) {
						options = object.merge(
							{
								rel: rel
							},
							self.defaults,
							rule.option(),
							options
						);
						self._openDeferred(to, options, event);
					} else {
						throw new Error("Not defined router rule [" + rel + "]");
					}
				}
			};

			/**
			 * Init routes defined in router
			 * @method _initRoutes
			 * @member ns.router.Router
			 */
			Router.prototype._initRoutes = function () {
				var ruleKey,
					rules = routerMicro.route;

				for (ruleKey in rules) {
					if (rules.hasOwnProperty(ruleKey) && rules[ruleKey].init) {
						rules[ruleKey].init();
					}
				}
			};

			function removeActivePageClass(containerElement) {
				var PageClasses = Page.classes,
					uiPageActiveSelector = "." + PageClasses.uiPageActive,
					activePages = slice.call(containerElement.querySelectorAll(uiPageActiveSelector));

				activePages.forEach(function (page) {
					page.classList.remove(uiPageActiveSelector);
				});
			}

			Router.prototype._autoInitializePage = function (containerElement, pages, pageSelector) {
				var self = this,
					page,
					location = window.location,
					uiPageActiveClass = Page.classes.uiPageActive,
					firstPage = containerElement.querySelector("." + uiPageActiveClass);

				if (!firstPage) {
					firstPage = pages[0];
				}

				if (firstPage) {
					removeActivePageClass(containerElement);
				}

				if (location.hash) {
					//simple check to determine if we should show firstPage or other
					page = document.getElementById(location.hash.replace("#", ""));
					if (page && selectors.matchesSelector(page, pageSelector)) {
						firstPage = page;
					}
				}

				if (!firstPage && ns.getConfig("addPageIfNotExist", true)) {
					firstPage = Page.createEmptyElement();
					while (containerElement.firstChild) {
						firstPage.appendChild(containerElement.firstChild);
					}
					containerElement.appendChild(firstPage);
				}

				if (self.justBuild) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("routerMicro.Router just build");
					//>>excludeEnd("tauDebug");
					if (firstPage) {
						self.register(
							engine.instanceWidget(containerElement, "pagecontainer"),
							firstPage
						);
					}
				}

				return firstPage;
			};

			/**
			 * Method initializes page container and builds the first page if flag autoInitializePage is set.
			 * @method init
			 * @param {boolean} justBuild
			 * @member ns.router.Router
			 */
			Router.prototype.init = function (justBuild) {
				var containerElement,
					firstPage,
					pages,
					pageDefinition = ns.engine.getWidgetDefinition("Page"),
					pageSelector = pageDefinition.selector,
					self = this;

				body = document.body;
				self.justBuild = justBuild;

				containerElement = ns.getConfig("pageContainer") || body;
				pages = slice.call(containerElement.querySelectorAll(pageSelector));

				if (!ns.getConfig("pageContainerBody", false)) {
					containerElement = pages.length ? pages[0].parentNode : containerElement;
				}

				if (ns.getConfig("autoInitializePage", true)) {
					firstPage = self._autoInitializePage(containerElement, pages, pageSelector);
					if (justBuild) {
						return;
					}
				}

				// init router's routes
				self._initRoutes();

				self.register(
					engine.instanceWidget(containerElement, "pagecontainer"),
					firstPage
				);
			};

			/**
			 * Method removes all events listners set by router.
			 * @method destroy
			 * @member ns.router.Router
			 */
			Router.prototype.destroy = function () {
				var self = this;

				window.removeEventListener("popstate", self.popStateHandler, false);
				if (body) {
					body.removeEventListener("pagebeforechange", self.pagebeforechangeHandler, false);
					body.removeEventListener("vclick", self.linkClickHandler, false);
				}
			};

			/**
			 * Method sets container.
			 * @method setContainer
			 * @param {ns.widget.core.PageContainer} container
			 * @member ns.router.Router
			 */
			Router.prototype.setContainer = function (container) {
				this.container = container;
			};

			/**
			 * Method returns container.
			 * @method getContainer
			 * @return {ns.widget.core.PageContainer} container of widget
			 * @member ns.router.Router
			 */
			Router.prototype.getContainer = function () {
				return this.container;
			};

			/**
			 * Method returns ths first page.
			 * @method getFirstPage
			 * @return {HTMLElement} the first page
			 * @member ns.router.Router
			 */
			Router.prototype.getFirstPage = function () {
				self.getRoute("page").getFirstElement();
			};

			/**
			 * Method registers page container and the first page.
			 * @method register
			 * @param {ns.widget.core.PageContainer} container
			 * @param {HTMLElement} firstPage
			 * @member ns.router.Router
			 */
			Router.prototype.register = function (container, firstPage) {
				var self = this,
					routePopup = this.getRoute("popup");

				self.container = container;
				self.getRoute("page").setFirstElement(firstPage);

				self.linkClickHandler = linkClickHandler.bind(null, self);
				self.popStateHandler = popStateHandler.bind(null, self);

				document.addEventListener("vclick", self.linkClickHandler, false);
				window.addEventListener("popstate", self.popStateHandler, false);

				eventUtils.trigger(document, "themeinit", self);

				if (ns.getConfig("loader", false)) {
					container.element.appendChild(self.getLoader().element);
				}
				history.enableVolatileRecord();
				if (firstPage) {
					self.open(firstPage, {transition: "none"});
				}

				if (routePopup) {
					this.getRoute("popup").setActive(null);
				}
			};

			/**
			 * Convert string id to HTMLElement or return HTMLElement if is given
			 * @method getHTMLElement
			 * @param {string|HTMLElement} idOrElement
			 * @return {HTMLElement}
			 */
			function getHTMLElement(idOrElement) {
				var stringId,
					toElement;

				if (typeof idOrElement === "string") {
					if (idOrElement[0] === "#") {
						stringId = idOrElement.substr(1);
					} else {
						stringId = idOrElement;
					}
					toElement = document.getElementById(stringId);
					if (toElement) {
						idOrElement = toElement;
					}
				}
				return idOrElement;
			}

			/*
			 * Method close route element, eg page or popup.
			 * @method close
			 * @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain
			 * @member ns.router.Router
			 */
			Router.prototype.close = function (to, options) {
				var rel = (options && options.rel) || "back",
					rule = route[rel];

				if (rel === "back") {
					history.back();
				} else {
					if (rule) {
						rule.close(getHTMLElement(to), options);
					} else {
						throw new Error("Not defined router rule [" + rel + "]");
					}
				}
			};

			/**
			 * Method opens popup.
			 * @method openPopup
			 * @param {HTMLElement|string} to Id or HTMLElement of popup.
			 * @param {Object} [options]
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @member ns.router.Router
			 */
			Router.prototype.openPopup = function (to, options) {
				this.open(to, object.fastMerge({rel: "popup"}, options));
			};

			/**
			 * Method closes popup.
			 * @method closePopup
			 * @param {Object} options
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext= in ui-pre-in] options.ext
			 * @member ns.router.Router
			 */
			Router.prototype.closePopup = function (options) {
				var popupRoute = this.getRoute("popup");

				if (popupRoute) {
					popupRoute.close(null, options);
				}
			};

			/**
			 * Method close route element, eg page or popup.
			 * @method close
			 * @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain
			 * @member ns.router.Router
			 */
			Router.prototype.close = function (to, options) {
				var rel = ((options && options.rel) || "page"),
					rule = route[rel];

				if (rel === "back") {
					history.back();
				} else {
					if (rule) {
						rule.close(to, options);
					} else {
						throw new Error("Not defined router rule [" + rel + "]");
					}
				}
			};

			Router.prototype.lock = function () {
				_isLock = true;
			};

			Router.prototype.unlock = function () {
				_isLock = false;
			};

			/**
			 * Load content from url
			 * @method _loadUrl
			 * @param {string} url
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {string} [options.absUrl] Absolute Url for content used by deferred object.
			 * @param {Object} rule
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @param {Function} deferred.resolve
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadUrl = function (url, options, rule, deferred) {
				var absUrl = path.makeUrlAbsolute(url, path.getLocation()),
					content,
					request,
					detail = {},
					self = this;

				// If the caller provided data append the data to the URL.
				if (options.data) {
					absUrl = path.addSearchParams(absUrl, options.data);
					options.data = undefined;
				}

				content = rule.find(absUrl);

				if (!content && path.isEmbedded(absUrl)) {
					deferred.reject(detail);
					return;
				}
				// If the content we are interested in is already in the DOM,
				// and the caller did not indicate that we should force a
				// reload of the file, we are done. Resolve the deferrred so that
				// users can bind to .done on the promise
				if (content) {
					detail = object.fastMerge({absUrl: absUrl}, options);
					deferred.resolve(detail, content);
					return;
				}

				// Load the new content.
				eventUtils.trigger(self.getContainer().element, options.rel + "beforeload");
				request = new XMLHttpRequest();
				request.responseType = "document";
				request.overrideMimeType("text/html");
				request.open("GET", absUrl);
				request.addEventListener("error", self._loadError.bind(self, absUrl, options, deferred));
				request.addEventListener("load", function (event) {
					var request = event.target;

					if (request.readyState === 4) {
						if (request.status === 200 || (request.status === 0 && request.responseXML)) {
							self._loadSuccess(absUrl, options, rule, deferred, request.responseXML);
							eventUtils.trigger(self.getContainer().element, options.rel + "load");
						} else {
							self._loadError(absUrl, options, deferred);
						}
					}
				});
				request.send();
			};

			/**
			 * Error handler for loading content by AJAX
			 * @method _loadError
			 * @param {string} absUrl
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {string} [options.absUrl] Absolute Url for content used by deferred object.
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadError = function (absUrl, options, deferred) {
				var detail = object.fastMerge({url: absUrl}, options),
					self = this;
				// Remove loading message.

				if (options.showLoadMsg) {
					self._showError(absUrl);
				}

				eventUtils.trigger(self.container.element, "loadfailed", detail);
				deferred.reject(detail);
			};

			// TODO it would be nice to split this up more but everything appears to be "one off"
			//	or require ordering such that other bits are sprinkled in between parts that
			//	could be abstracted out as a group
			/**
			 * Success handler for loading content by AJAX
			 * @method _loadSuccess
			 * @param {string} absUrl
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = "page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition = "none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord = false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container = null] It is used in RoutePopup as selector for container.
			 * @param {string} [options.absUrl] Absolute Url for content used by deferred object.
			 * @param {Object} rule
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @param {Function} deferred.resolve
			 * @param {string} html
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadSuccess = function (absUrl, options, rule, deferred, html) {
				var detail = object.fastMerge({url: absUrl}, options),
					content = rule.parse(html, absUrl);

				if (content) {
					deferred.resolve(detail, content);
				} else {
					deferred.reject(detail);
				}
			};

			// TODO the first page should be a property set during _create using the logic
			//	that currently resides in init
			/**
			 * Get initial content
			 * @method _getInitialContent
			 * @member ns.router.Router
			 * @return {HTMLElement} the first page
			 * @protected
			 */
			Router.prototype._getInitialContent = function () {
				return this.getRoute("page").getFirstElement();
			};

			/**
			 * Report an error loading
			 * @method _showError
			 * @param {string} absUrl
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._showError = function (absUrl) {
				ns.error("load error, file: ", absUrl);
			};

			/**
			 * Returns Page or Popup widget
			 * @param {string} [routeName="page"] in default page or popup
			 * @method getActive
			 * @return {ns.widget.BaseWidget}
			 * @member ns.router.Router
			 */
			Router.prototype.getActive = function (routeName) {
				var route = this.getRoute(routeName || "page");

				return route && route.getActive();
			};

			/**
			 * Returns true if element in given route is active.
			 * @param {string} [routeName="page"] in default page or popup
			 * @method hasActive
			 * @return {boolean}
			 * @member ns.router.Router
			 */
			Router.prototype.hasActive = function (routeName) {
				var route = this.getRoute(routeName || "page");

				return !!(route && route.hasActive());
			};

			/**
			 * Returns true if popup is active.
			 * @method hasActivePopup
			 * @return {boolean}
			 * @member ns.router.Router
			 */
			Router.prototype.hasActivePopup = function () {

				return this.hasActive("popup");
			};

			/**
			 * This function returns proper route.
			 * @method getRoute
			 * @param {string} type Type of route
			 * @return {?ns.router.route.interface}
			 * @member ns.router.Router
			 */
			Router.prototype.getRoute = function (type) {
				return route[type];
			};


			/**
			 * Returns loader widget
			 * @return {ns.widget.mobile.Loader}
			 * @member ns.router.Page
			 * @method getLoader
			 */
			Router.prototype.getLoader = function () {
				var loaderElement = document.querySelector("[data-role=loader],.ui-loader");

				if (!loaderElement) {
					loaderElement = document.createElement("div");
					DOM.setNSData(loaderElement, "role", "loader");
				}

				return engine.instanceWidget(loaderElement, "Loader");
			};

			routerMicro.Router = Router;

			engine.initRouter(Router);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routerMicro.Router;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
