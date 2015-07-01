/*global window, define, Node, HTMLElement, ns */
/*jslint nomen: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Router
 * Main class to navigate between pages and popups in profile Wearable.
 *
 * @class ns.router.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document) {
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
			"../util/pathToRegexp",
			"../router",
			"./route", // fetch namespace
			"../history",
			"../history/manager",
			"../widget/core/Page",
			"../widget/core/PageContainer",
			"../template"
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
				pathToRegexp = util.pathToRegexp,
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
				 * Local alias for ns.history
				 * @property {Object} history Alias for {@link ns.history}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				history = ns.history,
				/**
				 * Local alias for ns.history.manager.events
				 * @property {Object} historyManagerEvents Alias for (@link ns.history.manager.events}
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				historyManagerEvents = history.manager.events,
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
				 * Local instance of the Router
				 * @property {Object} routerInstance
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				routerInstance = null,

				/**
				 * Router locking flag
				 * @property {boolean} [isLock]
				 * @member ns.router.Router
				 * @private
				 */
				isLock = false,

				template = ns.template,

				Page = ns.widget.core.Page,

				Router = function () {
					var self = this;

					/**
					 * Element of the page opened as first.
					 * @property {?HTMLElement} [firstPage]
					 * @member ns.router.Router
					 */
					self.firstPage = null;
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

					self.onstatechangehandler = null; // mem containers
					self.onhashchangehandler = null;
					self.oncontrollercontent = null;
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
			 * Detect rel attribute from HTMLElement
			 * @param {HTMLElement} to
			 * @member ns.router.Router
			 * @return {?string}
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
			 * @param {Event} [event] Event object
			 * @member ns.router.Router
			 */
			Router.prototype.open = function (to, options, event) {
				var rel,
					rule,
					deferred,
					filter,
					self = this;

				to = getHTMLElement(to);
				rel = ((options && options.rel) || (to instanceof HTMLElement && self.detectRel(to)) || "page");
					rule = route[rel];
				if (!isLock) {
					if (rel === "back") {
						history.back();
					} else {
						if (rule) {
							options = object.merge(
								{
									rel: rel
								},
								this.defaults,
								rule.option(),
								options
							);
							filter = rule.filter;
							deferred = {
								resolve: function (options, content) {
									rule.open(content, options, event);
								},
								reject: function (options) {
									eventUtils.trigger(self.container.element, "changefailed", options);
								}
							};
							if (typeof to === "string") {
								if (to.replace(/[#|\s]/g, "")) {
									this._loadUrl(to, options, rule, deferred);
								}
							} else {
								if (to && selectors.matchesSelector(to, filter)) {
									deferred.resolve(options, to);
								} else {
									deferred.reject(options);
								}
							}
						} else {
							throw new Error("Not defined router rule [" + rel + "]");
						}
					}
				}
			};

			/**
			 * Method initializes page container and builds the first page if flag autoInitializePage is set.
			 * @method init
			 * @param {boolean} justBuild
			 * @member ns.router.Router
			 */
			Router.prototype.init = function () {
				var page,
					containerElement,
					container,
					firstPage,
					pages,
					activePages,
					ruleKey,
					justBuild = engine.getJustBuild(),
					rules = routerMicro.route,
					location = window.location,
					pageClasses = Page.classes,
					uiPageActiveClass = pageClasses.uiPageActive,
					pageDefinition = ns.engine.getWidgetDefinition("Page"),
					pageSelector = pageDefinition.selector,
					self = this;

				eventUtils.trigger(document, "beforerouterinit", this, false);

				body = document.body;
				containerElement = ns.getConfig("pageContainer") || body;
				pages = slice.call(containerElement.querySelectorAll(pageSelector));
				if (!ns.getConfig("pageContainerBody", false)) {
					containerElement = pages.length ? pages[0].parentNode : containerElement;
				}
				self.justBuild = justBuild;

				if (ns.getConfig("autoInitializePage", true)) {
					firstPage = containerElement.querySelector("." + uiPageActiveClass);
					if (!firstPage) {
						firstPage = pages[0];
					}

					if (firstPage) {
						activePages = containerElement.querySelectorAll("." + uiPageActiveClass);
						slice.call(activePages).forEach(function (page) {
							page.classList.remove("." + uiPageActiveClass);
						});
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
						while(containerElement.firstChild) {
							firstPage.appendChild(containerElement.firstChild);
						}
						containerElement.appendChild(firstPage);
					}

					if (justBuild) {
						//>>excludeStart("tauDebug", pragmas.tauDebug);
						ns.log("routerMicro.Router just build");
						//>>excludeEnd("tauDebug");
						//engine.createWidgets(containerElement, true);
						container = engine.instanceWidget(containerElement, "pagecontainer");
						if (firstPage) {
							self.register(container, firstPage);
						}
						eventUtils.trigger(document, "routerinit", this, false);
						return;
					}
				}

				for (ruleKey in rules) {
					if (rules.hasOwnProperty(ruleKey) && rules[ruleKey].init) {
						rules[ruleKey].init();
					}
				}

				container = engine.instanceWidget(containerElement, "pagecontainer");
				self.register(container, firstPage);
				eventUtils.trigger(document, "routerinit", this, false);
			};

			/**
			 * Method removes all events listners set by router.
			 * @method destroy
			 * @member ns.router.Router
			 */
			Router.prototype.destroy = function () {
				var self = this;
				if (body) {
					if (self.pagebeforechangeHandler) {
						body.removeEventListener("pagebeforechange", self.pagebeforechangeHandler, false);
					}
				}
				document.removeEventListener(historyManagerEvents.HASHCHANGE, self.hashchangehandler, false);
				self.hashchangehandler = null;
				document.removeEventListener(historyManagerEvents.STATECHANGE, self.onstatechangehandler, false);
				self.onstatechangehandler = null;
				document.removeEventListener("controller-content-available", self.oncontrollercontent, false);
				self.oncontrollercontent = null;
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
				return this.firstPage;
			};

			function onHistoryHashChange(router, event) {
				var options = event.detail,
					rules = routerMicro.route,
					ruleKey = "";
				for (ruleKey in rules) {
					if (rules.hasOwnProperty(ruleKey) && rules[ruleKey].onHashChange(options.url, options, options.stateUrl)) {
						eventUtils.preventDefault(event);
						eventUtils.stopImmediatePropagation(event);
						return;
					}
				}
			}

			function onHistoryStateChange(router, event) {
				var options = event.detail,
					url = options.reverse ? options.url : (options.href || options.url);
				router.open(url, options);
				eventUtils.preventDefault(event);
				eventUtils.stopImmediatePropagation(event);
			}

			function onControllerContent(router, event) {
				var data = event.detail,
					content = data.content,
					options = data.options,
					contentNode = null,
					externalDocument = document.implementation.createHTMLDocument(options.title),
					externalBody = externalDocument.body,
					url = (options.href || options.url),
					rel = null;

				if (content) {
					if (content instanceof Element) {
						contentNode = content;
					} else {
						try {
							externalBody.insertAdjacentHTML("beforeend", content);
							contentNode = externalBody.firstChild;
						} catch (e) {
							ns.error("Failed to inject element", e);
							return;
						}
					}

					rel = router.detectRel(contentNode);

					if (rel) {
						if (url) {
							url = url.replace(/^#/, "");
							if (!DOM.hasNSData(contentNode, "url")) {
								DOM.setNSData(contentNode, "url", url);
							}
						}

						options.rel = rel;
						router.open(contentNode, options);
					}
				}
			}

			/**
			 * Method registers page container and the first page.
			 * @method register
			 * @param {ns.widget.core.PageContainer} container
			 * @param {HTMLElement} firstPage
			 * @member ns.router.Router
			 */
			Router.prototype.register = function (container, firstPage) {
				var self = this;
				self.container = container;
				self.firstPage = firstPage;

				eventUtils.trigger(document, "themeinit", self);

				if (!self.hashchangehandler) {
					self.hashchangehandler = onHistoryHashChange.bind(null, self);
					window.addEventListener(historyManagerEvents.HASHCHANGE, self.hashchangehandler, false);
				}
				if (!self.onstatechangehandler) {
					self.onstatechangehandler = onHistoryStateChange.bind(null, self);
					window.addEventListener(historyManagerEvents.STATECHANGE, self.onstatechangehandler, false);
				}
				if (!self.oncontrollercontent) {
					self.oncontrollercontent = onControllerContent.bind(null, self);
					window.addEventListener("controller-content-available", self.oncontrollercontent, false);
				}
				if (ns.getConfig("loader", false)) {
					container.element.appendChild(self.getLoader().element);
				}
				history.enableVolatileMode();
				if (firstPage) {
					self.open(firstPage, { transition: "none" });
				}
				this.getRoute("popup").setActive(null);
			};

			/**
			 * Convert string id to HTMLElement or return HTMLElement if is given
			 * @method getHTMLElement
			 * @param {string|HTMLElement} idOrElement
			 * @returns {HTMLElement}
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

			Router.prototype.lock = function () {
				isLock = true;
			};

			Router.prototype.unlock = function () {
				isLock = false;
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
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadUrl = function (url, options, rule, deferred) {
				var absUrl = path.makeUrlAbsolute(url, path.getLocation()),
					content,
					self = this,
					data = options.data || {};

				content = rule.find(absUrl);

				if (!content && path.isEmbedded(absUrl)) {
					deferred.reject({});
				} else {
					// If the content we are interested in is already in the DOM,
					// and the caller did not indicate that we should force a
					// reload of the file, we are done. Resolve the deferrred so that
					// users can bind to .done on the promise
					if (content) {
						deferred.resolve(object.fastMerge({absUrl: absUrl}, options), content);
					} else {

						if (options.showLoadMsg) {
							self._showLoading(options.loadMsgDelay);
						}

						data.fullDocument = true;
						// we put url, not the whole path to function render,
						// because this path can be modified by template's module
						template.render(url, data, function (status, element) {
							if (status.success) {
								self._loadSuccess(status.absUrl, options, rule, deferred, element);
							} else {
								self._loadError(status.absUrl, options, deferred);
							}
						});
					}
				}
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
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
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

				// Remove loading message.
				if (options.showLoadMsg) {
					this._hideLoading();
				}

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
				return this.firstPage;
			};

			/**
			 * Show the loading indicator
			 * @method _showLoading
			 * @param {number} delay
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._showLoading = function (delay) {
				this.container.showLoading(delay);
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
			 * Hide the loading indicator
			 * @method _hideLoading
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._hideLoading = function () {
				this.container.hideLoading();
			};

			/**
			 * Returns true if popup is active.
			 * @method hasActivePopup
			 * @return {boolean}
			 * @member ns.router.Router
			 */
			Router.prototype.hasActivePopup = function () {
				var popup = this.getRoute("popup");
				return popup && popup.hasActive();
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

			/**
			 * Creates a new instance of the router and returns it
			 * @method newInstance
			 * @member ns.router.Router
			 * @static
			 * @return {ns.router.Router}
			 */
			Router.newInstance = function () {
				return (routerInstance = new Router());
			};

			/**
			 * Returns a instance of the router, creates a new if does not exist
			 * @method getInstance
			 * @member ns.router.Router
			 * @return {ns.router.Router}
			 * @static
			 */
			Router.getInstance = function () {
				if (!routerInstance) {
					return this.newInstance();
				}
				return routerInstance;
			};

			routerMicro.Router = Router;

			/**
			 * Returns router instance
			 * @deprecated
			 * @return {ns.router.Router}
			 */
			engine.getRouter = function () { //@TODO FIX HACK old API
				//@TODO this is suppressed since the tests are unreadable
				// tests need fixes
				//ns.warn("getRouter() method is deprecated! Use tau.router.Router.getInstance() instead");
				return Router.getInstance();
			};

			if (!ns.getConfig("disableRouter", false)) {
				document.addEventListener(historyManagerEvents.ENABLED, function () {
					Router.getInstance().init();
				}, false);
				document.addEventListener(historyManagerEvents.DISABLED, function () {
					Router.getInstance().destroy();
				}, false);
			}

			//engine.initRouter(Router);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routerMicro.Router;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
