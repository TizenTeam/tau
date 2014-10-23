/*jslint plusplus: true, nomen: true */
/*global window, define, ns, HTMLElement */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Mobile Router
 * Class is responsible for change pages in applications.
 * @class ns.router.Page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Grzegorz Osimowicz <g.osimowicz@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 * @author Krzysztof Glodowski <k.glodowski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/router", // fetch namespace
			"../../../core/event",
			"../../../core/util/DOM/attributes",
			"../../../core/util/DOM/manipulation",
			"../../../core/util/selectors",
			"../../../core/util/path",
			"../../../core/util/object",
			"../../../core/util/deferred",
			"../widget/mobile/Page",
			"./urlHistory"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var eventUtils = ns.event,
				DOM = ns.util.DOM,
				selectors = ns.util.selectors,
				object = ns.util.object,
				path = ns.util.path,
				Deferred = ns.util.deferred,
				engine = ns.engine,
				body = document.body,
				pageDefinition = engine.getWidgetDefinition("Page"),
				RouterPage = function () {
					var self = this;
					self.activePage = null;
					self.firstPage = null;
					self.container = null;
					self.lastClickedLink = null;
					self.settings = {};
					self.navreadyDeferred = new Deferred();
					self.navreadyDeferred.done(function () {
						self.bindEvents();
					});
				};

			/**
			 * Default router settings
			 * @property {object}
			 * @property {undefined} [transition=undefined]
			 * @property {boolean} [reverse=false]
			 * @property {boolean} [changeHash=true]
			 * @property {boolean} [fromHashChange=false]
			 * @property {undefined} [role=undefined]
			 * @property {undefined} [duplicateCachedPage=undefined]
			 * @property {boolean} [showLoadMsg=true]
			 * @property {undefined} [dataUrl=undefined]
			 * @property {undefined} [fromPage=undefined]
			 * @property {boolean} [allowSamePageTransition=false]
			 * @member ns.router.Page
			 * @static
			 * @readonly
			 */
			RouterPage.defaults = {
				transition: undefined, //@TODO all the "undefined" declarations should be
						//removed
				reverse: false,
				changeHash: true,
				fromHashChange: false,
				role: undefined, // By default we rely on the role defined by the @data-role
						//attribute.
				duplicateCachedPage: undefined,
				container: ns.getConfig("container") || body,
				showLoadMsg: true, //loading message shows by default when pages are being
						// fetched during changePage
				dataUrl: undefined,
				fromPage: undefined,
				allowSamePageTransition: false
			};

			/**
			 * Event definitions
			 * @property {Object}
			 * @property {string} [PAGE_CREATE="pagecreate"] Fired when page is created
			 * @property {string} [PAGE_INIT="pageinit"] Fired when page is initialized
			 * @property {string} [PAGE_BEFORE_LOAD="pagebeforeload"] Fired before page is
			 * 		loaded
			 * @property {string} [PAGE_LOAD="pageload"] Fired after page is loaded
			 * @property {string} [PAGE_LOAD_FAILED="pageloadfailed"] Fired on page load
			 * 		error
			 * @property {string} [PAGE_BEFORE_HIDE="pagebeforehide"] Fired before page is
			 * 		hidden
			 * @property {string} [PAGE_HIDE="pagehide"] Fired after page is hidden
			 * @property {string} [PAGE_BEFORE_SHOW="pagebeforeshow"] Fired before page is
			 * 		shown
			 * @property {string} [PAGE_SHOW="pageshow"] Fired after page is shown
			 * @property {string} [PAGE_BEFORE_CHANGE="pagebeforechange"] Fired before page
			 * 		change operation
			 * @property {string} [PAGE_CHANGE="pagachange"] Fired after page is changed
			 * @property {string} [PAGE_CHANGE_FAILED="pagechangefailed"] Fired on error
			 * 		when changing pages
			 * @property {string} [PAGE_REMOVE="pageremove"] Fired on page removal
			 * @property {string} [WIDGET_BOUND="widgetbound"] Fired when a DOM element has
			 * 		been bound to widget instance
			 * @property {string} [POP_STATE="popstate"] Fired on history change
			 * @property {string} [CLICK="click"] Fired on document click
			 * @property {string} [SUBMIT="submit"] Fired on form submit
			 * @member ns.router.Page
			 * @static
			 * @readonly
			 */
			RouterPage.events = {
				PAGE_CREATE : "pagecreate",
				PAGE_INIT : "pageinit",
				PAGE_BEFORE_LOAD : "pagebeforeload",
				PAGE_LOAD : "pageload",
				PAGE_LOAD_FAILED : "pageloadfailed",
				PAGE_BEFORE_HIDE : "pagebeforehide",
				PAGE_HIDE : "pagehide",
				PAGE_BEFORE_SHOW : "pagebeforeshow",
				PAGE_SHOW : "pageshow",
				PAGE_BEFORE_CHANGE : "pagebeforechange",
				PAGE_CHANGE : "pagechange",
				PAGE_CHANGE_FAILED : "pagechangefailed",
				PAGE_REMOVE : "pageremove",
				HASH_CHANGE : "hashchange",
				WIDGET_BOUND : "widgetbound",
				POP_STATE : "popstate",
				CLICK : "click",
				SUBMIT : "submit"
			};

			/**
			 * Before page change event handler
			 * @param {ns.router.Page} router
			 * @param {Event} event
			 * @member ns.router.Page
			 * @method pagebeforechangeHandler
			 * @private
			 * @static
			 */
			function pagebeforechangeHandler(router, event) {
				var linkId,
					linkElement,
					popup = event.detail.toPage,
					popupWidget;

				if (popup && selectors.matchesSelector(popup, '[data-role="popup"],.ui-popup')) {
					linkElement = router.lastClickedLink;
					linkId = linkElement.id;
					if (ns.activePopup) {
						ns.activePopup.close();
					}
					popupWidget = engine.getBinding(popup);
					popupWidget.open({
						link: linkId,
						positionTo: linkElement ? DOM.getNSData(linkElement, "position-to") :
								null,
						transition: linkElement ?  DOM.getNSData(linkElement, "transition") :
								null
					}, event);
					event.preventDefault();
				}
			}

			/**
			 * Handler for link clicks
			 * @param {ns.router.Page} router
			 * @param {Event} event
			 * @member ns.router.Page
			 * @method linkClickHandler
			 * @private
			 * @static
			 */
			function linkClickHandler(router, event) {
				var link = selectors.getClosestByTag(event.target, "a"),
					linkHref = link ? link.getAttribute("href") : null,
					element,
					isHash = linkHref && (linkHref.charAt(0) === "#"),
					options = {},
					useDefaultUrlHandling = false,
					inputInsideLink,
					inputInsideLinkLength,
					i;

				router.lastClickedLink = null;
				if (link) {
					useDefaultUrlHandling = (link.getAttribute("rel") === "external")
									|| link.hasAttribute("target")
									|| (linkHref ? linkHref.search(/^https?\:\/\//g) !== -1 : false);
					if (!useDefaultUrlHandling) {
						event.preventDefault();
						options.transition = DOM.getNSData(link, "transition");
						options.reverse = (DOM.getNSData(link, "direction") === "reverse");
						// Only swiching pages
						if (isHash) {
							element = document.getElementById(linkHref.substr(1));
							if (element) {
								router.lastClickedLink = link;
								router.open(element);
							}
						} else if (linkHref) {
							// Open link only if it exists
							router.open(linkHref, options);
						}

						//IMPORTANT / DEPRECIATED This following if statement
						//should be removed as soon
						//as we will stop to support controls tags like inputs
						//inside anchors, which is against W3C standards
						inputInsideLink = link.getElementsByClassName("ui-slider-switch-input");
						if (inputInsideLink) {
							inputInsideLinkLength = inputInsideLink.length;
							for (i = 0; i < inputInsideLinkLength; i++) {
								inputInsideLink[i].checked = !inputInsideLink[i].checked;
								eventUtils.trigger(inputInsideLink[i], "change");
							}
						}
					}
				}
			}

			/**
			 * Handler for form submitions
			 * @param {ns.router.Page} router
			 * @param {Event} event
			 * @member ns.router.Page
			 * @method submitHandler
			 * @private
			 * @static
			 */
			function submitHandler(router, event) {
				var form = selectors.getClosestByTag(event.target, "form"),
					elements = form.elements,
					length = elements.length,
					options = {
						data: {},
						type: form.method,
						transition: DOM.getNSData(form, "transition"),
						reverse: DOM.getNSData(form, "direction") === "reverse"
						//TODO Handle other options?
					},
					url = form.action || form.baseURI,
					i;

				eventUtils.preventDefault(event);

				for (i = 0; i < length; i++) {
					options.data[elements[i].name] = elements[i].value;
				}

				router.open(url, options);
				return false;
			}

			/**
			 * History change handler
			 * @param {ns.router.Page} router
			 * @param {Event} event
			 * @member ns.router.Page
			 * @method popStateHandler
			 * @private
			 * @static
			 */
			function popStateHandler(router, event) {
				var eventState = event.state,
					toPageId = (eventState && eventState.pageId) || window.location.hash
							.substr(1),
					toPage = document.getElementById(toPageId),
					settings = router.settings;

				if (toPage) {
					settings.reverse = true;
					settings.fromPage = settings.fromPage || router.activePage;
					settings.toPage = toPage;
					if (toPage && DOM.getNSData(toPage, "role") === "page"
							&& settings.fromPage !== toPage) {
						router.setActivePage(toPage);
					}
					settings.fromPage = null;
					settings.toPage = null;
				} else {
					if (eventState && eventState.url) {
						router.open(eventState.url.trim(), {});
					}
				}
			}

			/**
			 * URI Hash change handler
			 * @param {string} hash
			 * @member ns.router.Page
			 * @method _hashChangeHandler
			 * @protected
			 */
			RouterPage.prototype._hashChangeHandler = function (hash) {
				var router = this,
					toPageId = path.stripHash(hash),
					toPage = document.getElementById(toPageId),
					settings = router.settings;

				if (toPage) {
					settings.fromPage = settings.fromPage || router.activePage;
					settings.toPage = toPage;
					if (DOM.getNSData(toPage, "role") === "page"
							&& settings.fromPage !== toPage) {
						router.setActivePage(toPage);
					}
					settings.fromPage = null;
					settings.toPage = null;
				}
			};

			/**
			 * Returns loader widget
			 * @return {ns.widget.mobile.Loader}
			 * @member ns.router.Page
			 * @method getLoader
			 */
			RouterPage.prototype.getLoader = function () {
				var loaderElement = document.querySelector("[data-role=loader],.ui-loader");

				if (!loaderElement) {
					loaderElement = document.createElement("div");
					DOM.setNSData(loaderElement, "role", "loader");
				}

				return engine.instanceWidget(loaderElement, "Loader");
			};

			/**
			 * Sets focus on given page
			 * @param {ns.widget.mobile.Page} page
			 * @member ns.router.Page
			 * @method focusPage
			 */
			RouterPage.prototype.focusPage = function (page) {
				var autofocus = page.querySelector("[autofocus]");
				if (autofocus) {
					autofocus.focus();
					return;
				}
				page.focus();
			};

			/**
			 * Handles change page finish process
			 * @param {HTMLElement} fromPage
			 * @param {HTMLElement} toPage
			 * @param {boolean} noEvents
			 * @method changePageFinish
			 * @member ns.router.Page
			 */
			RouterPage.prototype.changePageFinish = function (fromPage, toPage, noEvents) {
				var events = RouterPage.events,
					self = this;
				self.activePage = toPage;
				if (!noEvents) {
					if (fromPage) {
						eventUtils.trigger(fromPage, events.PAGE_HIDE);
					}
					eventUtils.trigger(toPage, events.PAGE_SHOW);
					eventUtils.trigger(self.container, events.PAGE_CHANGE, toPage);
				}
			};

			/**
			 * Handles change page process
			 * @param {Object} settings
			 * @param {HTMLElement} [settings.fromPage]
			 * @param {HTMLElement} [settings.toPage]
			 * @param {boolan} noEvents
			 * @method changePage
			 * @member ns.router.Page
			 */
			RouterPage.prototype.changePage = function (settings, noEvents) {
				var fromPage = settings.fromPage,
					toPage = settings.toPage,
					fromPageWidget,
					toPageWidget,
					self = this;
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Change page from", fromPage && fromPage.id, " to ",
						toPage && toPage.id);
				//>>excludeEnd("tauDebug");
				if (fromPage) {
					fromPageWidget = engine.getBinding(fromPage);
					if (fromPageWidget) {
						fromPageWidget.setActive(false, self.container);
					}
				}
				if (toPage) {
					toPageWidget = engine.getBinding(toPage);
					if (toPageWidget) {
						toPageWidget.setActive(true, self.container);
					}
				}
				self.changePageFinish(fromPage, toPage, noEvents);
			};

			/**
			* Set active page
			* @method setActivePage
			* @param {HTMLElement} page HTMLElement from Page or Dialog widget
			* @param {boolean} [noEvents=false]
			* @static
			* @member ns.router.Page
			*/
			RouterPage.prototype.setActivePage = function (page, noEvents) {
				var self = this,
					events = RouterPage.events,
					// @TODO Add type for .getBinding, but NOTICE that it may be a Page or
					// Dialog widget
					toPageWidget = engine.getBinding(page),
					callInit = true,
					pageRole,
					eventBound = function () {
						var fromPage = self.activePage;
						page.removeEventListener(events.WIDGET_BOUND, eventBound, false);

						// If autoBuild is turned off do not build widgets on newly activated
						// page
						if (ns.getConfig("autoBuildOnPageChange", true)) {
							engine.createWidgets(page);
						}

						if (!noEvents) {
							if (callInit) {
								eventUtils.trigger(page, events.PAGE_INIT);
							}
							if (fromPage) {
								eventUtils.trigger(fromPage, events.PAGE_BEFORE_HIDE);
							}
						}
						if (!noEvents) {
							eventUtils.trigger(page, events.PAGE_BEFORE_SHOW);
						}
						self.changePage(self.settings, noEvents);
					};

				eventUtils.trigger(window, events.HASH_CHANGE, true);
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Set active page ", page.id, " no events: ", noEvents);
				//>>excludeEnd("tauDebug");
				if (toPageWidget && toPageWidget.isBuilt()) {
					//page is ready to show, just make sure it is active
					callInit = false;
					eventBound();
				} else {
					//add event which will make page active when enhancing is done
					page.addEventListener(events.WIDGET_BOUND, eventBound, false);
					//create page widget
					pageRole = DOM.getNSData(page, "role");
					if (pageRole === "page") {
						engine.instanceWidget(page, "Page");
					} else if (pageRole === "dialog") {
						engine.instanceWidget(page, "Dialog");
					}
					//engine.instanceWidget(page, "Page");
				}
			};

			/**
			* Open page
			* @method open
			* @param {HTMLElement} toPage
			* @param {Object} options
			* @param {string} [options.transition] transition for opening page
			* @param {boolean} [options.reverse=false] true, if transition should
			* 		be reversed
			* @static
			* @member ns.router.Page
			*/
			RouterPage.prototype.open = function (toPage, options) {
				var newHash = toPage.id ? "#" + toPage.id : "",
					settings = {},
					continuation,
					triggerData = {
						toPage: toPage,
						options: options
					},
					historyState = window.history.state || {},
					historyStateUrl = historyState.url,
					pageRole,
					parentElement,
					pageUrl,
					url,
					self = this;

				settings = object.merge({}, RouterPage.defaults, options);
				settings.pageContainer = self.container;

				settings.toPage = toPage;
				parentElement = toPage.parentNode;
				while (parentElement && parentElement !== settings.pageContainer) {
					parentElement = parentElement.parentNode;
				}

				if (parentElement) {
					self.settings = settings;
					continuation = eventUtils.trigger(settings.pageContainer,
							RouterPage.events.PAGE_BEFORE_CHANGE, triggerData);

					if (continuation) {
						pageUrl = DOM.getNSData(toPage, "url");
						if (!pageUrl) {
							DOM.setNSData(toPage, "url", "#"+toPage.id);
						}

						pageUrl = DOM.getNSData(toPage, "url");
						if (toPage) {
							pageRole = DOM.getNSData(toPage, "role");
							if (!pageRole) {
								pageRole = toPage.classList.contains("ui-page") ? "page" : null;
								if (pageRole) { // set just in case ^_^
									DOM.setNSData(toPage, "role", pageRole);
								}
							}
						}

						if (historyStateUrl !== pageUrl) {
							if (pageRole === "dialog") {
								url = "#&ui-state=dialog";
							} else if ((!settings.fromSubmit) && ((historyStateUrl === undefined)
									|| (historyStateUrl.split("#")[0] === pageUrl.split("#")[0]))) {
								url =  (newHash.length > 1) ? newHash : "";
							} else if (toPage === this.firstPage) {
								url = pageUrl.split("#")[0];
							} else {
								url = pageUrl;
								settings.fromSubmit = false;
							}
							window.history.pushState({pageId: toPage.id, url: pageUrl}, "", url);
						}

						if (pageRole === "dialog") {
							ns.router.urlHistory.addNew("#&ui-state=dialog",
									DOM.getNSData(toPage, "transition"), "", pageUrl, pageRole);
						} else {
							ns.router.urlHistory.addNew(newHash,
									DOM.getNSData(toPage, "transition"), "", pageUrl, pageRole);
						}

						settings.reverse = false;
						settings.fromPage = settings.fromPage || self.activePage;
						settings.toPage = toPage;

						if ((pageRole === "page" || pageRole === "dialog")
								&& settings.fromPage !== toPage) {
							self.setActivePage(toPage);
						}
						self.settings.fromPage = null;
						self.settings.toPage = null;
					}
				}
			};

			/**
			 * Initializes router
			 * @param {boolean} justBuild
			 * @method init
			 * @member ns.router.Page
			 */
			RouterPage.prototype.init = function (justBuild) {
				var page,
					self = this,
					container = ns.getConfig("container") || RouterPage.defaults.container ||
							document.body;

				RouterPage.defaults.container = container;
				self.container = container;

				eventUtils.trigger(document, "themeinit", this);

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("just build: " + justBuild);
				//>>excludeEnd("tauDebug");
				if (justBuild) {
					self.justBuild = justBuild;
					engine.createWidgets(container);
				}

				if (ns.getConfig("autoInitializePage", true)) {
					self.firstPage = container.querySelector(pageDefinition.selector);
					if (!self.firstPage) {
						DOM.wrapInHTML(container.childNodes,
								'<div data-role="page" id="' + ns.getUniqueId() + '"></div>');
						self.firstPage = container.children[0];
					}

					if (justBuild) {
						self.settings = self.settings || {};
						self.settings.toPage = self.firstPage;
						self.setActivePage(self.firstPage, true);
						return;
					}

					if (window.location.hash) {
						//simple check to determine if we should show firstPage or other
						page = document.getElementById(window.location.hash.replace("#", ""));
						if (page && selectors.matchesSelector(page, pageDefinition.selector)) {
							self.firstPage = page;
						}
					}

					container.appendChild(self.getLoader().element);

					//@todo add loader only if html is not built
					//find a way to determine if html is built
					//show body with loader
					//htmlClassList.remove("ui-mobile-rendering");

					self.open(self.firstPage);
					self.navreadyDeferred.resolve();

				}
			};

			/**
			 * Binds events to document and window
			 * @method bindEvents
			 * @member ns.router.Page
			 */
			RouterPage.prototype.bindEvents = function () {
				var self = this,
					events = RouterPage.events;
				self.pagebeforechangeHandler = pagebeforechangeHandler.bind(null, self);
				self.linkClickHandler = linkClickHandler.bind(null, self);
				self.popStateHandler = popStateHandler.bind(null, self);
				self.submitHandler = submitHandler.bind(null, self);
				window.addEventListener(events.POP_STATE, self.popStateHandler, false);
				document.addEventListener(events.PAGE_BEFORE_CHANGE,
						self.pagebeforechangeHandler, false);
				document.addEventListener(events.HASH_CHANGE, self._hashChangeHandler,
						false);
				document.addEventListener(events.CLICK, self.linkClickHandler, false);
				document.addEventListener(events.SUBMIT, self.submitHandler, false);
			};

			/**
			 * Destroys router
			 * @method destroy
			 * @member ns.router.Page
			 */
			RouterPage.prototype.destroy = function () {
				var self = this,
					events = RouterPage.events;
				window.removeEventListener(events.POP_STATE, self.popStateHandler, false);
				document.removeEventListener(events.PAGE_BEFORE_CHANGE,
						self.pagebeforechangeHandler, false);
				document.removeEventListener(events.HASH_CHANGE,
						self._hashChangeHandler, false);
				document.removeEventListener(events.CLICK, self.linkClickHandler, false);
				document.removeEventListener(events.SUBMIT, self.submitHandler, false);
			};

			/**
			 * Sets container for page elements
			 * @param {HTMLElement} element
			 * @method setContainer
			 * @member ns.router.Page
			 */
			RouterPage.prototype.setContainer = function (element) {
				this.container = element;
			};

			/**
			 * Returns container for pages
			 * @return {HTMLElement}
			 * @method getContainer
			 * @member ns.router.Page
			 */
			RouterPage.prototype.getContainer = function () {
				return this.container;
			};

			/**
			 * Returns first page
			 * @return {HTMLElement}
			 * @method getFirstPage
			 * @member ns.router.Page
			 */
			RouterPage.prototype.getFirstPage = function () {
				return this.firstPage;
			};

			ns.router.Page = RouterPage;

			engine.initRouter(RouterPage);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.router.Page;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
