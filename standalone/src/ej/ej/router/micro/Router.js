/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Main class to navigate between pages and popups.
 * @class ns.router.micro.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../engine",
			"../micro", // fetch namespace
			"./route", // fetch namespace
			"./history",
			"../../utils/events",
			"../../utils/DOM/attributes",
			"../../utils/selectors",
			"../../utils/path",
			"../../utils/object",
			"../../widget/micro/Page",
			"../../widget/micro/PageContainer",
			"../../micro/selectors"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
				/**
				* Local alias for ns.utils
				* @property {Object} utils Alias for {@link ns.utils}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
			var utils = ns.utils,
				/**
				* Local alias for ns.utils.events
				* @property {Object} eventUtils Alias for {@link ns.utils.events}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				eventUtils = utils.events,
				/**
				* @property {Object} DOM Alias for {@link ns.utils.DOM}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				DOM = utils.DOM,
				/**
				* Local alias for ns.utils.path
				* @property {Object} path Alias for {@link ns.utils.path}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				path = utils.path,
				/**
				* Local alias for ns.utils.selectors
				* @property {Object} selectors Alias for {@link ns.utils.selectors}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				selectors = utils.selectors,
				/**
				* Local alias for ns.utils.object
				* @property {Object} DOM Alias for {@link ns.utils.object}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				object = utils.object,
				/**
				* Local alias for ns.engine
				* @property {Object} engine Alias for {@link ns.utils.engine}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				engine = ns.engine,
				/**
				* Local alias for ns.router.micro
				* @property {Object} routerMicro Alias for {@link ns.router.micro}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				routerMicro = ns.router.micro,
				/**
				* Local alias for ns.micro.selectors
				* @property {Object} microSelectors Alias for {@link ns.micro.selectors}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				microSelectors = ns.micro.selectors,
				/**
				* Local alias for ns.router.micro.history
				* @property {Object} history Alias for {@link ns.router.micro.history}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				history = routerMicro.history,
				/**
				* Local alias for ns.router.micro.route
				* @property {Object} route Alias for {@link ns.router.micro.route}
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				route = routerMicro.route,
				/**
				* Local alias for document body element
				* @property {HTMLElement} body
				* @memberOf ns.micro.router.Router
				* @static
				* @private
				*/
				body = document.body,
				/**
				 * Alias to Array.slice method
				 * @method slice
				 * @memberOf ns.micro.router.Router
				 * @private
				 * @static
				 */
				slice = [].slice,

				Router = function () {
					var self = this;
					self.activePage = null;
					self.firstPage = null;
					self.container = null;
					self.settings = {};
					self.rule = {};
				};

			/**
			* @property {Object} defaults
			* @property {boolean} [defaults.fromHashChange = false]
			* @property {boolean} [defaults.reverse = false]
			* @property {boolean} [defaults.showLoadMsg = true]
			* @property {number} [defaults.loadMsgDelay = 0]
			* @property {boolean} [defaults.volatileRecord = false]
			* @instance
			* @memberOf ns.router.micro.Router
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
			 */
			function findClosestLink(element) {
				while (element) {
					if ((typeof element.nodeName === "string") && element.nodeName.toLowerCase() === "a") {
						break;
					}
					element = element.parentNode;
				}
				return element;
			}

			/**
			 * Handle event link click
			 * @method linkClickHandler
			 * @param {ns.router.micro.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 */
			function linkClickHandler(router, event) {
				var link = findClosestLink(event.target),
					href,
					useDefaultUrlHandling,
					options;

				if (link && event.which === 1) {
					href = link.getAttribute("href");
					useDefaultUrlHandling = (link.getAttribute('rel') === 'external') || link.hasAttribute('target');
					if (!useDefaultUrlHandling) {
						options = DOM.getData(link);
						router.open(href, options);
						event.preventDefault();
					}
				}
			}

			/**
			 * Handle event for pop state
			 * @method popStateHandler
			 * @param {ns.router.micro.Router} router
			 * @param {Event} event
			 * @private
			 * @static
			 */
			function popStateHandler(router, event) {
				var state = event.state,
					prevState = history.activeState,
					rules = routerMicro.route,
					ruleKey,
					options,
					to,
					url,
					isContinue = true,
					reverse,
					transition;

				if (state) {
					to = state.url;
					reverse = history.getDirection(state) === "back";
					transition = reverse ? ((prevState && prevState.transition) || "none") : state.transition;
					options = object.multiMerge({}, state, {
						reverse: reverse,
						transition: transition,
						fromHashChange: true
					});

					url = path.getLocation();

					for (ruleKey in rules) {
						if (rules.hasOwnProperty(ruleKey) && rules[ruleKey].onHashChange(url, options)) {
							isContinue = false;
						}
					}

					history.setActive(state);

					if (isContinue) {
						router.open(to, options);
					}
				}
			}

			/**
			* Change page to page given in parameter to.
			* @method open
			* @param {string|HTMLElement} to Id of page or file url or HTMLElement of page
			* @param {Object} [options]
			* @param {string} [options.rel = 'page'] represents kind of link as 'page' or 'popup' or 'external' for linking to another domain
			* @param {string} [options.transition = 'none'] the animation used during change of page
			* @param {boolean} [options.reverse = false] the direction of change
			* @param {boolean} [options.fromHashChange = false] the change route after hashchange
			* @param {boolean} [options.showLoadMsg = true] show message during loading
			* @param {number} [options.loadMsgDelay = 0] delay time for the show message during loading
			* @param {boolean} [options.volatileRecord = false]
			* @param {boolean} [options.dataUrl] page has url attribute
			* @param {string} [options.container = null] uses in RoutePopup as container selector
			 * @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.open = function (to, options) {
				var rel = ((options && options.rel) || "page"),
					rule = route[rel],
					deferred = {},
					filter,
					self = this;

				if (rule) {
					options = object.multiMerge(
						{
							rel: rel
						},
						this.defaults,
						rule.option(),
						options
					);
					filter = rule.filter;
					deferred.resolve = function (options, content) {
						rule.open(content, options);
					};
					deferred.reject = function (options) {
						eventUtils.trigger(self.container.element, "changefailed", options);
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
			};

			/**
			* Method initialize page container and build first page is is set flag autoInitializePage
			* @method init
			* @param {boolean} justBuild
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.init = function (justBuild) {
				var page,
					containerElement,
					container,
					firstPage,
					pages,
					activePages,
					location = window.location;

				body = document.body;
				containerElement = ns.get('pageContainer') || body;
				pages = slice.call(containerElement.querySelectorAll(microSelectors.page));
				this.justBuild = justBuild;

				if (ns.get('autoInitializePage', true)) {
					firstPage = containerElement.querySelector(microSelectors.activePage);
					if (!firstPage) {
						firstPage = pages[0];
					}

					if (firstPage) {
						activePages = containerElement.querySelectorAll(microSelectors.activePage);
						slice.call(activePages).forEach(function (page) {
							page.classList.remove(microSelectors.activePage);
						});
						containerElement = firstPage.parentNode;
					}

					if (justBuild) {
						//>>excludeStart("ejDebug", pragmas.ejDebug);
						ns.log('routerMicro.Router just build');
						//>>excludeEnd("ejDebug");
						//engine.createWidgets(containerElement, true);
						container = engine.instanceWidget(containerElement, 'pagecontainer');
						if (firstPage) {
							this.register(container, firstPage);
						}
						return;
					}

					if (location.hash) {
						//simple check to determine if we should show firstPage or other
						page = document.getElementById(location.hash.replace('#', ''));
						if (page && selectors.matchesSelector(page, microSelectors.page)) {
							firstPage = page;
						}
					}
				}

				pages.forEach(function(page) {
					if (!DOM.getNSData(page, 'url')) {
						DOM.setNSData(page, 'url', page.id || location.pathname + location.search);
					}
				});

				container = engine.instanceWidget(containerElement, 'pagecontainer');
				this.register(container, firstPage);
			};

			/**
			* Remove all events listners set by router
			* @method destroy
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.destroy = function () {
				window.removeEventListener('popstate', this.popStateHandler, false);
				if (body) {
					body.removeEventListener('pagebeforechange', this.pagebeforechangeHandler, false);
					body.removeEventListener('click', this.linkClickHandler, false);
				}
			};

			/**
			* Set container
			* @method setContainer
			* @param {ns.widget.micro.PageContainer} container
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.setContainer = function (container) {
				this.container = container;
			};

			/**
			* Get container
			* @method getContainer
			* @return {ns.widget.micro.PageContainer} container
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.getContainer = function () {
				return this.container;
			};

			/**
			* Get first page
			* @method getFirstPage
			* @return {HTMLElement} page
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.getFirstPage = function () {
				return this.firstPage;
			};

			/**
			* Register page container and first page
			* @method register
			* @param {ns.widget.micro.PageContainer} container
			* @param {HTMLElement} firstPage
			* @instance
			* @memberOf ns.router.micro.Router
			*/
			Router.prototype.register = function (container, firstPage) {
				this.container = container;
				this.firstPage = firstPage;

				this.linkClickHandler = linkClickHandler.bind(null, this);
				this.popStateHandler = popStateHandler.bind(null, this);

				document.addEventListener('click', this.linkClickHandler, false);
				window.addEventListener('popstate', this.popStateHandler, false);

				history.enableVolatileRecord();
				if (firstPage) {
					this.open(firstPage, { transition: 'none' });
				}
			};

			/**
			 * Open popup
			 * @method openPopup
			 * @param {HTMLElement|string} to
			 * @param {Object} [options]
			 * @param {string} [options.rel = 'page'] represents kind of link as 'page' or 'popup' or 'external' for linking to another domain
			 * @param {string} [options.transition = 'none'] the animation used during change of page
			 * @param {boolean} [options.reverse = false] the direction of change
			 * @param {boolean} [options.fromHashChange = false] the change route after hashchange
			 * @param {boolean} [options.showLoadMsg = true] show message during loading
			 * @param {number} [options.loadMsgDelay = 0] delay time for the show message during loading
			 * @param {boolean} [options.volatileRecord = false]
			 * @param {boolean} [options.dataUrl] page has url attribute
			 * @param {string} [options.container = null] uses in RoutePopup as container selector
			 * @instance
			 * @memberOf ns.router.micro.Router
			 */
			Router.prototype.openPopup = function (to, options) {
				this.open(to, object.merge({rel: "popup"}, options));
			};

			/**
			 * Close popup
			 * @method closePopup
			 * @instance
			 * @memberOf ns.router.micro.Router
			 */
			Router.prototype.closePopup = function () {
				// @TODO add checking is popup active
				history.back();
			};

			/**
			 * Load content from url
			 * @method _loadUrl
			 * @param {string} url
			 * @param {Object} options
			 * @param {string} [options.rel = 'page'] represents kind of link as 'page' or 'popup' or 'external' for linking to another domain
			 * @param {string} [options.transition = 'none'] the animation used during change of page
			 * @param {boolean} [options.reverse = false] the direction of change
			 * @param {boolean} [options.fromHashChange = false] the change route after hashchange
			 * @param {boolean} [options.showLoadMsg = true] show message during loading
			 * @param {number} [options.loadMsgDelay = 0] delay time for the show message during loading
			 * @param {boolean} [options.volatileRecord = false]
			 * @param {boolean} [options.dataUrl] page has url attribute
			 * @param {string} [options.container = null] uses in RoutePopup as container selector
			 * @param {string} [options.absUrl] absolute Url for content used by deferred object
			 * @param {Object} rule
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @param {Function} deferred.resolve
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._loadUrl = function (url, options, rule, deferred) {
				var absUrl = path.makeUrlAbsolute(url, path.getLocation()),
					content,
					request,
					detail = {},
					self = this;

				content = rule.find(absUrl);

				if ( !content && path.isEmbedded( absUrl ) ) {
					deferred.reject( detail );
					return;
				}
				// If the content we are interested in is already in the DOM,
				// and the caller did not indicate that we should force a
				// reload of the file, we are done. Resolve the deferrred so that
				// users can bind to .done on the promise
				if (content) {
					detail = object.merge({absUrl: absUrl}, options);
					deferred.resolve(detail, content);
					return;
				}

				if (options.showLoadMsg) {
					this._showLoading(options.loadMsgDelay);
				}

				// Load the new content.
				try {
					request = new XMLHttpRequest();
					request.open('GET', absUrl, false);
					request.send('');
					if (request.readyState === 4) {
						if (request.status === 200 || request.status === 0) {
							self._loadSuccess(absUrl, options, rule, deferred, request.responseText);
						} else {
							self._loadError(absUrl, options, deferred);
						}
					}
				} catch (e) {
					self._loadError(absUrl, options, deferred);
				}
			};

			/**
			 * Error handler for loading content by AJAX
			 * @method _loadError
			 * @param {string} absUrl
			 * @param {Object} options
			 * @param {string} [options.rel = 'page'] represents kind of link as 'page' or 'popup' or 'external' for linking to another domain
			 * @param {string} [options.transition = 'none'] the animation used during change of page
			 * @param {boolean} [options.reverse = false] the direction of change
			 * @param {boolean} [options.fromHashChange = false] the change route after hashchange
			 * @param {boolean} [options.showLoadMsg = true] show message during loading
			 * @param {number} [options.loadMsgDelay = 0] delay time for the show message during loading
			 * @param {boolean} [options.volatileRecord = false]
			 * @param {boolean} [options.dataUrl] page has url attribute
			 * @param {string} [options.container = null] uses in RoutePopup as container selector
			 * @param {string} [options.absUrl] absolute Url for content used by deferred object
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._loadError = function (absUrl, options, deferred) {
				var detail = object.merge({url: absUrl}, options);
				// Remove loading message.
				if (options.showLoadMsg) {
					this._showError(absUrl);
				}

				eventUtils.trigger(this.container.element, "loadfailed", detail);
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
			 * @param {string} [options.rel = 'page'] represents kind of link as 'page' or 'popup' or 'external' for linking to another domain
			 * @param {string} [options.transition = 'none'] the animation used during change of page
			 * @param {boolean} [options.reverse = false] the direction of change
			 * @param {boolean} [options.fromHashChange = false] the change route after hashchange
			 * @param {boolean} [options.showLoadMsg = true] show message during loading
			 * @param {number} [options.loadMsgDelay = 0] delay time for the show message during loading
			 * @param {boolean} [options.volatileRecord = false]
			 * @param {boolean} [options.dataUrl] page has url attribute
			 * @param {string} [options.container = null] uses in RoutePopup as container selector
			 * @param {string} [options.absUrl] absolute Url for content used by deferred object
			 * @param {Object} rule
			 * @param {Object} deferred
			 * @param {Function} deferred.reject
			 * @param {Function} deferred.resolve
			 * @param {string} html
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._loadSuccess = function (absUrl, options, rule, deferred, html) {
				var detail = object.merge({url: absUrl}, options),
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
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @return {HTMLElement} first page
			 * @protected
			 */
			Router.prototype._getInitialContent = function () {
				return this.firstPage;
			};

			/**
			 * Show the loading indicator
			 * @method _showLoading
			 * @param {number} delay
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._showLoading = function (delay) {
				this.container.showLoading(delay);
			};

			/**
			 * Report an error loading
			 * @method _showError
			 * @param {string} absUrl
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._showError = function (absUrl) {
				ns.error("load error, file: ", absUrl);
			};

			/**
			 * Hide the loading indicator
			 * @method _hideLoading
			 * @instance
			 * @memberOf ns.router.micro.Router
			 * @protected
			 */
			Router.prototype._hideLoading = function () {
				this.container.hideLoading();
			};

			/**
			 * Return true if popup is active
			 * @method hasActivePopup
			 * @return {boolean}
			 * @instance
			 * @memberOf ns.router.micro.Router
			 */
			Router.prototype.hasActivePopup = function () {
				return this.rule.popup && this.rule.popup._hasActivePopup();
			};

			routerMicro.Router = Router;

			engine.initRouter(Router);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return routerMicro.Router;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
