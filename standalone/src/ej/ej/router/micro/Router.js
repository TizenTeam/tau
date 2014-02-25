/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class ns.router.micro.Router
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
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
			var utils = ns.utils,
				eventUtils = utils.events,
				DOM = utils.DOM,
				path = utils.path,
				selectors = utils.selectors,
				object = utils.object,
				engine = ns.engine,
				routerMicro = ns.router.micro,
				microSelectors = ns.micro.selectors,
				history = routerMicro.history,
				route = routerMicro.route,
				body = document.body,
				slice = [].slice,
				Router = function () {
					this.activePage = null;
					this.firstPage = null;
					this.container = null;
					this.settings = {};
					this.rule = {};
				};

			Router.prototype.defaults = {
				fromHashChange: false,
				reverse: false,
				showLoadMsg: true,
				loadMsgDelay: 0,
				volatileRecord: false
			};

			function findClosestLink(element) {
				while (element) {
					if ((typeof element.nodeName === "string") && element.nodeName.toLowerCase() === "a") {
						break;
					}
					element = element.parentNode;
				}
				return element;
			}

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
					transition = !reverse ? state.transition : ((prevState && prevState.transition) || "none");
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
			* Change page
			* @method open
			* @param {HTMLElement|string} toPage
			* @param {Object} options
			* @static
			* @memberOf ns.router.Page
			*/
			Router.prototype.open = function (to, options) {
				var rel = ((options && options.rel) || "page"),
					rule = route[rel],
					deferred = {},
					filter,
					settings,
					self = this;

				if (rule) {
					settings = object.multiMerge(
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
							this._loadUrl(to, settings, rule, deferred);
						}
					} else {
						if (to && selectors.matchesSelector(to, filter)) {
							deferred.resolve(settings, to);
						} else {
							deferred.reject(settings);
						}
					}
				} else {
					throw new Error("Not defined router rule [" + rel + "]");
				}
			};

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
						this.justBuild = justBuild;
						//>>excludeStart("ejDebug", pragmas.ejDebug);
						ns.log('routerMicro.Router just build');
						//>>excludeEnd("ejDebug");
						engine.createWidgets(container.element, true);
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

			Router.prototype.destroy = function () {
				window.removeEventListener('popstate', this.popStateHandler, false);
				if (body) {
					body.removeEventListener('pagebeforechange', this.pagebeforechangeHandler, false);
					body.removeEventListener('click', this.linkClickHandler, false);
				}
			};

			Router.prototype.setContainer = function (element) {
				this.container = element;
			};

			Router.prototype.getContainer = function () {
				return this.container;
			};

			Router.prototype.getFirstPage = function () {
				return this.firstPage;
			};

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

			Router.prototype.openPopup = function (to, options) {
				this.open(to, object.merge({rel: "popup"}, options));
			};

			Router.prototype.closePopup = function () {
				this.back();
			};

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

			Router.prototype._loadError = function (absUrl, settings, deferred) {
				var detail = object.merge({url: absUrl}, settings);
				// Remove loading message.
				if (settings.showLoadMsg) {
					this._showError(absUrl);
				}

				eventUtils.trigger(this.container.element, "loadfailed", detail);
				deferred.reject(detail);
			};

			// TODO it would be nice to split this up more but everything appears to be "one off"
			//	or require ordering such that other bits are sprinkled in between parts that
			//	could be abstracted out as a group
			Router.prototype._loadSuccess = function (absUrl, settings, rule, deferred, html) {
				var detail = object.merge({url: absUrl}, settings),
					content = rule.parse(html, absUrl);

				// Remove loading message.
				if (settings.showLoadMsg) {
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
			Router.prototype._getInitialContent = function () {
				return this.firstPage;
			};

			Router.prototype._showLoading = function (delay) {
				this.container.showLoading(delay);
			};

			Router.prototype._showError = function (absUrl) {
				ns.error("load error, file: ", absUrl);
			};

			Router.prototype._hideLoading = function () {
				this.container.hideLoading();
			};

			routerMicro.Router = Router;

			engine.initRouter(Router);
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return routerMicro.Router;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
