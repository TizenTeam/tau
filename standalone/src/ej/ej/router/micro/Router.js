/*global window, define */
/**
 * @class ej.router.Page
 */
(function (window, document, ej) {
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
			var utils = ej.utils,
				eventUtils = utils.events,
				DOM = utils.DOM,
				path = utils.path,
				selectors = utils.selectors,
				object = utils.object,
				engine = ej.engine,
				routerMicro = ej.router.micro,
				microSelectors = ej.micro.selectors,
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
			* Tries to find a page element matching id and filter (selector).
			* Adds data url attribute to found page, sets page = null when nothing found
			* @method findPageAndSetDataUrl
			* @private
			* @param {HTMLElement} page reference to page variable
			* @param {string} id
			* @memberOf routerMicro.Router
			*/
			function findPageAndSetDataUrl(id, filter) {
				var page = document.getElementById(id);

				if (page && selectors.matchesSelector(page, filter)) {
					DOM.setNSData(page, 'url', id);
				} else {
					// if we matched any element, but it doesn't match our filter
					// reset page to null
					page = null;
				}
				// @TODO ... else
				// probably there is a need for running onHashChange while going back to a history entry
				// without state, eg. manually entered #fragment. This may not be a problem on target device
				return page;
			}

			/**
			* Change page
			* @method open
			* @param {HTMLElement|string} toPage
			* @param {Object} options
			* @static
			* @memberOf ej.router.Page
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
							this._loadUrl(to, settings, filter, deferred);
						}
					} else {
						if (selectors.matchesSelector(to, filter)) {
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
				containerElement = ej.get('pageContainer') || body;
				pages = slice.call(containerElement.querySelectorAll(microSelectors.page));

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
					container = engine.instanceWidget(containerElement, 'pagecontainer');
				}

				if (justBuild) {
					this.justBuild = justBuild;
					//>>excludeStart("ejDebug", pragmas.ejDebug);
					ej.log('routerMicro.Router just build');
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

				pages.forEach(function(page) {
					if (!DOM.getNSData(page, 'url')) {
						DOM.setNSData(page, 'url', page.id || location.pathname + location.search);
					}
				});

				if (container && firstPage) {
					this.register(container, firstPage);
				}
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
				this.open(firstPage, { transition: 'none' });
			};

			Router.prototype.openPopup = function (to, options) {
				this.open(to, object.merge({rel: "popup"}, options));
			};

			Router.prototype.closePopup = function () {
				this.back();
			};

			Router.prototype._loadUrl = function (url, options, filter, deferred) {
				var absUrl = path.makeUrlAbsolute(url, path.getLocation()),
					content,
					request,
					detail,
					self = this;

				content = this._find(absUrl, filter);
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
				request = new XMLHttpRequest();
				request.onreadystatechange = function () {
					if (request.readyState === 4) {
						if ((request.status === 200 || request.status === 0)
								&& request.responseText !== undefined && request.responseText.length > 0) {
							self._loadSuccess(absUrl, options, filter, deferred, request.responseText);
						} else {
							self._loadError(absUrl, options, deferred);
						}
					}
				};
				request.open('GET', absUrl);
				request.send();
			};

			Router.prototype._loadError = function (absUrl, settings, deferred) {
				var detail = object.merge({url: absUrl}, settings);
				// Remove loading message.
				if (settings.showLoadMsg) {
					this._showError();
				}

				eventUtils.trigger(this.container.element, "loadfailed", detail);
				deferred.reject(detail);
			};

			// TODO it would be nice to split this up more but everything appears to be "one off"
			//	or require ordering such that other bits are sprinkled in between parts that
			//	could be abstracted out as a group
			Router.prototype._loadSuccess = function (absUrl, settings, filter, deferred, html) {
				var dataUrl = this._createDataUrl(absUrl),
					detail = object.merge({url: absUrl}, settings),
					content = this._parse(html, dataUrl, filter);

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

			Router.prototype._parse = function (html, dataUrl, filter) {
				var page,
					scripts,
					all = document.createElement('div');

				//workaround to allow scripts to execute when included in page divs
				all.innerHTML = html;

				page = all.querySelector(filter);

				// TODO tagging a page with external to make sure that embedded pages aren't
				// removed by the various page handling code is bad. Having page handling code
				// in many places is bad. Solutions post 1.0
				DOM.setNSData(page, 'url', dataUrl);
				DOM.setNSData(page, 'external-page', true);

				scripts = page.querySelectorAll('script');
				slice.call(scripts).forEach(function (baseUrl, script) {
					var newscript = document.createElement('script'),
						i,
						scriptAttributes = script.attributes,
						count = script.childNodes.length,
						src = script.getAttribute("src"),
						xhrObj,
						attribute;

					// 'src' may become null when none src attribute is set 
					if (src !== null) {
						src = path.makeUrlAbsolute(src, baseUrl);
					}

					//Copy script tag attributes
					for (i = scriptAttributes.length - 1; i >= 0; i -= 1) {
						attribute = scriptAttributes[i];
						if (attribute.name !== 'src') {
							newscript.setAttribute(attribute.name, attribute.value);
						}
					}

					if (src) {
						try {
							// get some kind of XMLHttpRequest
							xhrObj = new XMLHttpRequest();
							// open and send a synchronous request
							xhrObj.open('GET', src, false);
							xhrObj.send('');
							// add the returned content to a newly created script tag
							newscript.type = "text/javascript";
							newscript.text = xhrObj.responseText;
						} catch (ignore) {
						}
					} else {
						for (i = 0; i < count; i++) {
							newscript.appendChild(script.childNodes[i]);
						}
					}
					script.parentNode.replaceChild(newscript, script);
				}.bind(null, dataUrl));

				return page;
			};

			Router.prototype._find = function (absUrl, filter) {
				// TODO consider supporting a custom callback
				var dataUrl = this._createDataUrl(absUrl),
					hash = absUrl.replace(/[^#]*#/, ""),
					page,
					initialContent = this._getInitialContent();

				if (hash && !path.isPath(hash)) {
					page = findPageAndSetDataUrl(hash, filter);
				}

				// Check to see if the page already exists in the DOM.
				// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
				//	are a valid url char and it breaks on the first occurence
				if (!page) {
					page = this.container.element
						.querySelector("[data-url='" + dataUrl + "']" + filter);
				}

				// If we failed to find the page, check to see if the url is a
				// reference to an embedded page. If so, it may have been dynamically
				// injected by a developer, in which case it would be lacking a
				// data-url attribute and in need of enhancement.
				if (!page && dataUrl && !path.isPath(dataUrl)) {
					page = findPageAndSetDataUrl(dataUrl, filter);
				}

				// If we failed to find a page in the DOM, check the URL to see if it
				// refers to the first page in the application. Also check to make sure
				// our cached-first-page is actually in the DOM. Some user deployed
				// apps are pruning the first page from the DOM for various reasons.
				// We check for this case here because we don't want a first-page with
				// an id falling through to the non-existent embedded page error case.
				if (!page &&
						path.isFirstPageUrl(dataUrl) &&
						initialContent &&
						initialContent.parentNode) {
					page = initialContent;
				}

				return page;
			};

			Router.prototype._createDataUrl = function (absoluteUrl) {
				return path.convertUrlToDataUrl(absoluteUrl);
			};

			// TODO the first page should be a property set during _create using the logic
			//	that currently resides in init
			Router.prototype._getInitialContent = function () {
				return this.firstPage;
			};

			Router.prototype._showLoading = function (delay) {
				this.container.showLoading(delay);
			};

			Router.prototype._showError = function () {
				ej.error("load error");
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
