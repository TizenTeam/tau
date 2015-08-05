/*global define, HTMLElement, ns, Element */
/*jslint nomen: true */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Router
 *
 * Main class to navigate between pages, popups and other widgets which has own rules in all profiles.
 *
 * Class communicates with PageContainer which deactivate and activate changed pages.
 *
 * Router listening on events triggered by history manager.
 *
 * ## Getting instance
 *
 * To receive instance of router you should use method _getInstance_
 *
 * 	@example
 * 		var router = ns.router.Router.getInstance();
 *
 * By default TAU create instance of router and getInstance method return this instance.
 *
 * ##Connected widgets
 *
 * Router cooperate with widgets:
 *
 *  - Page
 *  - Popup
 *  - Drawer
 *  - Dialog (mobile)
 *  - CircularIndexScrollBar (wearable - circle)
 *
 * Opening or closing these widgets are possible by create link with correct rel.
 *
 * ##Global options used in router
 *
 *  - *pageContainer* = document.body - default container element
 *  - *pageContainerBody* = false - use body instead pageContainer option
 *  - *autoInitializePage* = true - automatically initialize first page
 *  - *addPageIfNotExist* = true - automatically add page if doesn't exist
 *  - *loader* = false - enable loader on change page
 *  - *disableRouter* = false - disable auto initialize of router
 *
 * @class ns.router.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Hyunkook, Cho <hk0713.cho@samsung.com>
 * @author Piotr Czajka <p.czajka@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Heeju Joo <heeju.joo@samsung.com>
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
				 * @property {Object} router Alias for namespace ns.router
				 * @member ns.router.Router
				 * @static
				 * @private
				 */
				router = ns.router,
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
				route = router.route,
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
				 * Template engine used to load external files, by default html
				 * engine is loaded to TAU.
				 * @property {ns.template} template
				 * @static
				 * @private
				 */
				template = ns.template,

				Page = ns.widget.core.Page,

				Router = function () {
					var self = this;

					/**
					 * Element of the page opened as first.
					 * @property {?HTMLElement} [firstPage=null]
					 * @member ns.router.Router
					 */
					self.firstPage = null;
					/**
					 * Instance of widget PageContainer which controls page changing.
					 * @property {?ns.widget.core.PageContainer} [container=null]
					 * @member ns.router.Router
					 */
					self.container = null;
					/**
					 * Settings for last call of method open
					 * @property {Object} [settings={}]
					 * @member ns.router.Router
					 */
					self.settings = {};

					/**
					 * Handler for event "statechange"
					 * @property {Function} [_onstatechangehandler=null]
					 * @member ns.router.Router
					 * @protected
					 * @since 2.4
					 */
					self._onstatechangehandler = null;
					/**
					 * Handler for event "hashchange"
					 * @property {Function} [_onhashchangehandler=null]
					 * @member ns.router.Router
					 * @protected
					 * @since 2.4
					 */
					self._onhashchangehandler = null;
					/**
					 * Handler for event "controllercontent"
					 * @property {Function} [_oncontrollercontent=null]
					 * @member ns.router.Router
					 * @protected
					 * @since 2.4
					 */
					self._oncontrollercontent = null;

					/**
					 * Router locking flag
					 * @property {boolean} locked=false
					 * @member ns.router.Router
					 * @since 2.4
					 */
					self.locked = false;
				};

			/**
			 * Default values for router
			 * @property {Object} defaults
			 * @property {boolean} [defaults.fromHashChange=false] Sets if will be changed after hashchange.
			 * @property {boolean} [defaults.reverse=false] Sets the direction of change.
			 * @property {boolean} [defaults.showLoadMsg=true] Sets if message will be shown during loading.
			 * @property {number} [defaults.loadMsgDelay=0] Sets delay time for the show message during loading.
			 * @property {boolean} [defaults.volatileRecord=false] Sets if the current history entry will be modified or a new one will be created.
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
			 * Detect rel attribute from HTMLElement.
			 *
			 * This method tries to match element to each rule filter and return first rule name which match.
			 *
			 * If don't match any rule then return null.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.detectRel(document.getElementById("pageId"));
			 *		// if HTML element will be match to selector of page then return rule for page
			 *
			 * @param {HTMLElement} to element to check
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

				return null;
			};

			/**
			 * Change page to page given in parameter "to".
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.open("pageId");
			 *		// open page with given id
			 *		router.open("page.html");
			 *		// open page from html file
			 *		router.open("popupId");
			 *		// open popup with given id
			 *
			 * @method open
			 * @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel="page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain.
			 * @param {string} [options.transition="none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse=false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange=false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg=true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay=0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord=false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container=null] It is used in RoutePopup as selector for container.
			 * @param {Event} [event] Event object
			 * @member ns.router.Router
			 */
			Router.prototype.open = function (to, options, event) {
				var self = this,
					rel,
					rule,
					deferred;

				// if to is a string then convert to HTMLElement
				to = getHTMLElement(to);
				// find rel for given element; order: read from options, autodetect, "page" by default
				rel = ((options && options.rel) || (to instanceof HTMLElement && self.detectRel(to)) || "page");
				// take rule
				rule = route[rel];

				// if router is not locked
				if (!self.locked) {
					if (rel === "back") {
						// in back case we call history back
						history.back();
					} else {
						// if rule is correct
						if (rule) {
							// we set options which will be applied to method open on rule
							options = object.merge(
								// new object to delete references
								{
									rel: rel
								},
								// router defaults
								self.defaults,
								// rule defaults
								rule.option(),
								// argument of current method
								options
							);
							// callbacks called after finish loading content
							deferred = {
								resolve: function (options, content) {
									// on success we apply content to method open on rule
									rule.open(content, options, event);
								},
								reject: function (options) {
									// on error we trigger event to page container
									self.container.trigger("changefailed", options);
								}
							};
							if (typeof to === "string") {
								// if to is still string that mean didn't found element for this id
								// we need to load URL
								if (to.replace(/[#|\s]/g, "")) {
									// load URL and call deferred methods after finish
									self._loadUrl(to, options, rule, deferred);
								}
							} else {
								// we found HTMLElement for given id
								if (to && selectors.matchesSelector(to, rule.filter)) {
									// if element match to filter then we resolve deferred
									deferred.resolve(options, to);
								} else {
									// otherwise we do reject
									deferred.reject(options);
								}
							}
						} else {
							// throw exception if rule not exists
							throw new Error("Not defined router rule [" + rel + "]");
						}
					}
				}
			};

			/**
			 * Method initializes page container and builds the first page if flag autoInitializePage is set.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.init();
			 *		// router now is ready to work
			 *
			 * var router = tau.router.Router.getInstance();
			 * @method init
			 * @member ns.router.Router
			 */
			Router.prototype.init = function () {
				var self = this,
					page,
					containerElement,
					container,
					firstPage,
					pages,
					activePages,
					ruleKey,
					justBuild = engine.getJustBuild(),
					rules = router.route,
					location = window.location,
					pageClasses = Page.classes,
					uiPageActiveClass = pageClasses.uiPageActive,
					pageDefinition = engine.getWidgetDefinition("Page"),
					pageSelector = pageDefinition.selector,
					activePageSelector = "." + uiPageActiveClass,
					currentHash = location.hash;

				// trigger event "beforerouterinit" on this event developer can change setting of router
				eventUtils.trigger(document, "beforerouterinit", this, false);

				// cache body in router
				body = document.body;

				// finding container:
				// 1. find element to build PageContainer widget
				containerElement = ns.getConfig("pageContainer") || body;

				// find all pages
				pages = slice.call(containerElement.querySelectorAll(pageSelector));

				// 2. if pageContainerBody is false pageContainer will be parent of first page
				if (!ns.getConfig("pageContainerBody", false)) {
					containerElement = pages.length ? pages[0].parentNode : containerElement;
				}

				// inform about just build mode
				self.justBuild = justBuild;

				// if router should initialize first page
				if (ns.getConfig("autoInitializePage", true)) {
					// finding first page
					// 1. detect hash and change page if hash exists
					if (currentHash) {
						//simple check to determine if we should show firstPage or other
						page = document.getElementById(currentHash.replace("#", ""));
						if (page && selectors.matchesSelector(page, pageSelector)) {
							firstPage = page;
						}
					}

					// 2. find elements with active page class
					firstPage = firstPage || containerElement.querySelector(activePageSelector);

					// 3. get first page
					firstPage = firstPage || pages[0];

					// and remove active class from other pages
					activePages = containerElement.querySelectorAll(activePageSelector);
					[].forEach.call(activePages, function (page) {
						page.classList.remove(uiPageActiveClass);
					});

					// 4. if option addPageIfNotExist is true and in previous
					// steps we didn't found any page then create new page
					if (!firstPage && ns.getConfig("addPageIfNotExist", true)) {
						// create container for first page
						firstPage = Page.createEmptyElement();
						// move all elements inside container to new page
						while (containerElement.firstChild) {
							firstPage.appendChild(containerElement.firstChild);
						}
						// append new page to container
						containerElement.appendChild(firstPage);
					}
				}

				if (justBuild) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("Router just build");
					//>>excludeEnd("tauDebug");
				} else {
					//init all rules
					for (ruleKey in rules) {
						if (rules.hasOwnProperty(ruleKey) && typeof rules[ruleKey].init === "function") {
							rules[ruleKey].init();
						}
					}
				}

				// create PageContainer widget
				container = engine.instanceWidget(containerElement, "pagecontainer");

				// register instance of PageContainer and first page
				self.register(container, firstPage);

				// trigger event "routerinit" on document
				eventUtils.trigger(document, "routerinit", self, false);
			};

			/**
			 * Method removes all events listeners set by router.
			 *
			 * Also remove singleton instance of router;
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.destroy();
			 *		var router2 = tau.router.Router.getInstance();
			 *		// router !== router2
			 *
			 * @method destroy
			 * @member ns.router.Router
			 */
			Router.prototype.destroy = function () {
				var self = this;

				// remove listeners and clear handler properties
				if (self._onhashchangehandler) {
					window.removeEventListener(historyManagerEvents.HASHCHANGE, self._onhashchangehandler, false);
					self._onhashchangehandler = null;
				}
				if (self._onstatechangehandler) {
					window.removeEventListener(historyManagerEvents.STATECHANGE, self._onstatechangehandler, false);
					self._onstatechangehandler = null;
				}
				if (self._oncontrollercontent) {
					window.removeEventListener("controller-content-available", self._oncontrollercontent, false);
					self._oncontrollercontent = null;
				}

				// unset instance for singleton
				routerInstance = null;
			};

			/**
			 * Method sets instance of PageContainer widget
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.setContainer(new ns.widget.PageContainer());
			 *
			 * @method setContainer
			 * @param {ns.widget.core.PageContainer} container
			 * @member ns.router.Router
			 */
			Router.prototype.setContainer = function (container) {
				this.container = container;
			};

			/**
			 * Method returns instance of PageContainer widget
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		containerWidget = router.getContainer();
			 *
			 * @method getContainer
			 * @return {ns.widget.core.PageContainer}
			 * @member ns.router.Router
			 */
			Router.prototype.getContainer = function () {
				return this.container;
			};

			/**
			 * Method returns ths first page HTMLElement
			 * @method getFirstPage
			 * @return {HTMLElement}
			 * @member ns.router.Router
			 */
			Router.prototype.getFirstPage = function () {
				return this.firstPage;
			};

			/**
			 * Callback for event "historyhashchange" which is triggered by history manager after hash is changed
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 */
			function onHistoryHashChange(router, event) {
				var options = event.detail,
					ruleKey = "";

				//iterate on routes
				for (ruleKey in route) {
					if (route.hasOwnProperty(ruleKey) && route[ruleKey].onHashChange(options)) {
						// if route block hash change event then do prevent default and stop propagate
						eventUtils.preventDefault(event);
						eventUtils.stopImmediatePropagation(event);
						return;
					}
				}
			}

			/**
			 * Callback for event "historystatechange" which is triggered by history manager after hash is changed
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 */
			function onHistoryStateChange(router, event) {
				var options = event.detail,
					//
					url = options.reverse ? options.url : (options.href || options.url);
				router.open(url, options);
				// prevent current event
				eventUtils.preventDefault(event);
				eventUtils.stopImmediatePropagation(event);
			}

			/**
			 * Convert HTML string to HTMLElement
			 * @param {string|HTMLElement} content
			 * @param {string} title
			 * @returns {?HTMLElement}
			 */
			function convertToNode (content, title) {
				var contentNode = null,
					externalDocument = document.implementation.createHTMLDocument(title),
					externalBody = externalDocument.body;

				if (content instanceof HTMLElement) {
					// if content is HTMLElement just set to contentNode
					contentNode = content;
				} else {
					// otherwise convert string to HTMLElement
					try {
						externalBody.insertAdjacentHTML("beforeend", content);
						contentNode = externalBody.firstChild;
					} catch (e) {
						ns.error("Failed to inject element", e);
					}
				}
				return contentNode;
			}

			/**
			 * Set data-url on HTMLElement if not exists
			 * @param {HTMLElement} contentNode
			 * @param {string} url
			 */
			function setURLonElement(contentNode, url) {
				if (url) {
					if (contentNode instanceof HTMLElement && !DOM.hasNSData(contentNode, "url")) {
						// if url is missing we need set data-url attribute for good finding by method open in router
						url = url.replace(/^#/, "");
						DOM.setNSData(contentNode, "url", url);
					}
				}
			}

			/**
			 * Callback for event "controller-content-available" which is triggered by controller after application handle hash change
			 * @param {ns.router.Router} router
			 * @param {Event} event
			 */
			function onControllerContent(router, event) {
				var data = event.detail,
					content = data.content,
					options = data.options,
					contentNode = null,
					url = (options.href || options.url);

				// if controller give content
				if (content) {
					// convert to node if content is string
					contentNode = convertToNode(content, options.title);

					// set data-url on node
					setURLonElement(contentNode, url);

					// calling open method
					router.open(contentNode, options);

					//prevent event
					eventUtils.preventDefault(event);
				}
			}

			/**
			 * Method registers page container and the first page.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.register(new ns.widget.PageContainer(), document.getElementById("firstPage"));
			 *
			 * @method register
			 * @param {ns.widget.core.PageContainer} container
			 * @param {HTMLElement} firstPage
			 * @member ns.router.Router
			 */
			Router.prototype.register = function (container, firstPage) {
				var self = this;

				// sets instance of PageContainer widget
				self.container = container;

				// sets first page HTMLElement
				self.firstPage = firstPage;

				// trigger event "themeinit" to theme module
				eventUtils.trigger(document, "themeinit", self);

				// sets events handlers
				if (!self._onhashchangehandler) {
					self._onhashchangehandler = onHistoryHashChange.bind(null, self);
					window.addEventListener(historyManagerEvents.HASHCHANGE, self._onhashchangehandler, false);
				}
				if (!self._onstatechangehandler) {
					self._onstatechangehandler = onHistoryStateChange.bind(null, self);
					window.addEventListener(historyManagerEvents.STATECHANGE, self._onstatechangehandler, false);
				}
				if (!self._oncontrollercontent) {
					self._oncontrollercontent = onControllerContent.bind(null, self);
					window.addEventListener("controller-content-available", self._oncontrollercontent, false);
				}

				// if loader config is set then create loader widget
				if (ns.getConfig("loader", false)) {
					container.element.appendChild(self.getLoader().element);
				}

				// set history support
				history.enableVolatileMode();

				// if first page exist open this page without transition
				if (firstPage) {
					self.open(firstPage, { transition: "none" });
				}

				// set active popup to null
				self.getRoute("popup").setActive(null);
			};

			/**
			 * Convert string id to HTMLElement or return HTMLElement if is given
			 * @param {string|HTMLElement} idOrElement
			 * @return {HTMLElement|string}
			 */
			function getHTMLElement(idOrElement) {
				var stringId,
					toElement;
				// if given argument is string then
				if (typeof idOrElement === "string") {
					if (idOrElement[0] === "#") {
						// trim first char if it is #
						stringId = idOrElement.substr(1);
					} else {
						stringId = idOrElement;
					}
					// find element by id
					toElement = document.getElementById(stringId);

					if (toElement) {
						// is exists element by id then return it
						idOrElement = toElement;
					}
					// otherwise return string
				}
				return idOrElement;
			}

			/**
			 * Method close route element, eg page or popup.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.close("popupId", {transition: "none"});
			 *
			 * @method close
			 * @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			 * @param {Object} [options]
			 * @param {"page"|"popup"|"external"} [options.rel="page"] Represents kind of link as "page" or "popup" or "external" for linking to another domain
			 * @member ns.router.Router
			 */
			Router.prototype.close = function (to, options) {
				var rel = (options && options.rel) || "back",
					rule = route[rel];

				// if router is not locked
				if (!this.locked) {
					// if rel is back then call back method
					if (rel === "back") {
						history.back();
					} else {
						// otherwise if rule exists
						if (rule) {
							// call close on rule
							rule.close(getHTMLElement(to), options);
						} else {
							throw new Error("Not defined router rule [" + rel + "]");
						}
					}
				}
			};

			/**
			 * Method back to previous state.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.back();
			 *
			 * @method close
			 * @member ns.router.Router
			 */
			Router.prototype.back = function () {

				// if router is not locked
				if (!this.locked) {
					history.back();
				}
			};

			/**
			 * Method opens popup.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.openPopup("popupId", {transition: "none"});
			 *
			 * @method openPopup
			 * @param {HTMLElement|string} to Id or HTMLElement of popup.
			 * @param {Object} [options]
			 * @param {string} [options.transition="none"] Sets the animation used during change of page.
			 * @param {boolean} [options.reverse=false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange=false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg=true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay=0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.volatileRecord=false] Sets if the current history entry will be modified or a new one will be created.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {?string} [options.container=null] It is used in RoutePopup as selector for container.
			 * @member ns.router.Router
			 */
			Router.prototype.openPopup = function (to, options) {
				// call method open with overwrite rel option
				this.open(to, object.fastMerge({rel: "popup"}, options));
			};

			/**
			 * Method closes popup.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance();
			 *		router.closePopup();
			 *
			 * @method closePopup
			 * @param {Object} options
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext="in ui-pre-in"] options.ext
			 * @member ns.router.Router
			 */
			Router.prototype.closePopup = function (options) {
				var popupRoute = this.getRoute("popup");

				if (popupRoute) {
					popupRoute.close(null, options);
				}
			};

			/**
			 * Lock router
			 * @method lock
			 * @member ns.router.Router
			 */
			Router.prototype.lock = function () {
				this.locked = true;
			};

			/**
			 * Unlock router and history manager
			 * @method unlock
			 * @member ns.router.Router
			 */
			Router.prototype.unlock = function () {
				this.locked = false;
			};

			/**
			 * Load content from url.
			 *
			 * Method prepare url and call template function to load external file.
			 *
			 * If option showLoadMsg is ste to tru open loader widget before start loading.
			 *
			 * @method _loadUrl
			 * @param {string} url full URL to load
			 * @param {Object} options options for this and next methods in chain
			 * @param {boolean} [options.showLoadMsg=true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay=0] Sets delay time for the show message during loading.
			 * @param {boolean} [options.data] Sets if page has url attribute.
			 * @param {Object} rule rule which support given call
			 * @param {Object} deferred object with callbacks
			 * @param {Function} deferred.reject callback on error
			 * @param {Function} deferred.resolve callback on success
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadUrl = function (url, options, rule, deferred) {
				var absUrl = path.makeUrlAbsolute(url, path.getLocation()),
					content,
					self = this,
					data = options.data || {};

				// check if content is loaded in current document
				content = rule.find(absUrl);

				// if content doesn't find and url is embedded url
				if (!content && path.isEmbedded(absUrl)) {
					// reject
					deferred.reject({});
				} else {
					// If the content we are interested in is already in the DOM,
					// and the caller did not indicate that we should force a
					// reload of the file, we are done. Resolve the deferred so that
					// users can bind to .done on the promise
					if (content) {
						// content was found and we resolve
						deferred.resolve(object.fastMerge({absUrl: absUrl}, options), content);
					} else {

						// show loading message
						if (options.showLoadMsg) {
							self._showLoading(options.loadMsgDelay);
						}

						// force return full document from template system
						data.fullDocument = true;
						// we put url, not the whole path to function render,
						// because this path can be modified by template's module
						template.render(url, data, function (status, element) {
							// if template loaded successful
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
			 * @param {string} absUrl full URL to load
			 * @param {Object} options options for this and next methods in chain
			 * @param {boolean} [options.showLoadMsg=true] Sets if message will be shown during loading.
			 * @param {Object} deferred object with callbacks
			 * @param {Function} deferred.reject callback on error
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadError = function (absUrl, options, deferred) {
				var detail = object.fastMerge({url: absUrl}, options),
					self = this;

				ns.error("load error, file: ", absUrl);
				// Remove loading message.
				if (options.showLoadMsg) {
					self._hideLoading();
				}

				self.container.trigger("loadfailed", detail);
				deferred.reject(detail);
			};

			// TODO it would be nice to split this up more but everything appears to be "one off"
			//	or require ordering such that other bits are sprinkled in between parts that
			//	could be abstracted out as a group
			/**
			 * Success handler for loading content by AJAX
			 * @method _loadSuccess
			 * @param {string} absUrl full URL to load
			 * @param {Object} options options for this and next methods in chain
			 * @param {boolean} [options.showLoadMsg=true] Sets if message will be shown during loading.
			 * @param {Object} rule rule which support given call
			 * @param {Object} deferred object with callbacks
			 * @param {Function} deferred.reject callback on error
			 * @param {Function} deferred.resolve callback on success
			 * @param {string} html
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._loadSuccess = function (absUrl, options, rule, deferred, html) {
				var detail = object.fastMerge({url: absUrl}, options),
					// find element with given id in returned html
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

			/**
			 * Show the loading indicator
			 * @method _showLoading
			 * @param {number} [delay=0] delay in ms
			 * @member ns.router.Router
			 * @protected
			 */
			Router.prototype._showLoading = function (delay) {
				this.container.showLoading(delay);
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
			 * Returns true if any popup is active.
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance(),
			 *			hasActivePopup = router.hasActivePopup();
			 *			// -> true | false
			 *
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
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance(),
			 *			route = router.getRoute("page"),
			 *			// -> Object with pages support
			 *			activePage = route.getActive();
			 *			// instance of Page widget
			 *
			 * @method getRoute
			 * @param {string} type Type of route
			 * @return {?ns.router.route.interface}
			 * @member ns.router.Router
			 */
			Router.prototype.getRoute = function (type) {
				return route[type];
			};

			/**
			 * Returns instance of loader widget.
			 *
			 * If loader not exist then is created on first element matched to selector
			 * or is created new element.
			 *
			 *	@example
			 *		var loader = router.getLoader();
			 *		// get or create loader
			 *		loader.show();
			 *		// show loader
			 *
			 * @return {?ns.widget.mobile.Loader}
			 * @member ns.router.Page
			 * @method getLoader
			 */
			Router.prototype.getLoader = function () {
				var loaderDefinition = engine.getWidgetDefinition("Loader"),
					loaderSelector = loaderDefinition.selector,
					loaderElement;

				if (loaderDefinition) {
					loaderElement = document.querySelector(loaderSelector);
					return engine.instanceWidget(loaderElement, "Loader");
				}
				return null;
			};

			/**
			 * Creates a new instance of the router and returns it
			 *
			 * 	@example
			 * 		var router = Router.newInstance();
			 *
			 * @method newInstance
			 * @member ns.router.Router
			 * @static
			 * @return {ns.router.Router}
			 * @since 2.4
			 */
			Router.newInstance = function () {
				return (routerInstance = new Router());
			};

			/**
			 * Returns a instance of the router, creates a new if does not exist
			 *
			 *	@example
			 *		var router = tau.router.Router.getInstance(),
			 *			// if router not exists create new instance and return
			 *			router2 = tau.router.Router.getInstance();
			 *			// only return router from first step
			 *			// router === router2
			 *
			 * @method getInstance
			 * @member ns.router.Router
			 * @return {ns.router.Router}
			 * @since 2.4
			 * @static
			 */
			Router.getInstance = function () {
				if (!routerInstance) {
					return this.newInstance();
				}
				return routerInstance;
			};

			router.Router = Router;

			/**
			 * Returns router instance
			 * @deprecated 2,4
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
			return router.Router;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
