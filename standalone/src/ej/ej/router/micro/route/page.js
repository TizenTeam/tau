/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class ej.router.micro.route.page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../../engine",
			"../../../micro/selectors",
			"../route",
			"../../../utils/DOM/attributes",
			"../../../utils/path",
			"../../../utils/selectors",
			"../../../utils/object",
			"../history",
			"../../../widget/micro/Page"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var utils = ns.utils,
				path = utils.path,
				DOM = utils.DOM,
				object = utils.object,
				utilSelector = utils.selectors,
				history = ns.router.micro.history,
				engine = ns.engine,
				router = engine.getRouter(),
				baseElement,
				slice = [].slice,
				RouterPage = {},
				head;

			/**
			* Tries to find a page element matching id and filter (selector).
			* Adds data url attribute to found page, sets page = null when nothing found
			* @method findPageAndSetDataUrl
			* @private
			* @param {string} id Id of searching element
			* @param {string} filter Query selector for searching page
			* @memberOf ej.router.micro.route.page
			*/
			function findPageAndSetDataUrl(id, filter) {
				var page = document.getElementById(id);

				if (page && utilSelector.matchesSelector(page, filter)) {
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

			RouterPage.defaults = {
				transition: 'none'
			};

			RouterPage.filter = ns.micro.selectors.page;

			RouterPage.option = function () {
				return RouterPage.defaults;
			};

			/**
			* Change page
			* @method open
			* @param {HTMLElement|string} toPage
			* @param {Object} options
			* @static
			* @memberOf ej.router.micro.route.page
			*/
			RouterPage.open = function (toPage, options) {
				var pageTitle = document.title,
					url,
					state = {};

				if (toPage === router.firstPage && !options.dataUrl) {
					url = path.documentUrl.hrefNoHash;
				} else {
					url = DOM.getNSData(toPage, "url");
				}

				pageTitle = DOM.getNSData(toPage, "title") || utilSelector.getChildrenBySelector(toPage, ".ui-header > .ui-title").textContent || pageTitle;
				if (!DOM.getNSData(toPage, "title")) {
					DOM.setNSData(toPage, "title", pageTitle);
				}

				if (url && !options.fromHashChange) {
					if (!path.isPath(url) && url.indexOf("#") < 0) {
						url = path.makeUrlAbsolute( "#" + url, path.documentUrl.hrefNoHash );
					}

					state = object.multiMerge(
						{},
						options,
						{
							url: url
						}
					);

					history.replace(state, pageTitle, url);
				}

				// write base element
				this._setBase( url );

				//set page title
				document.title = pageTitle;
				router.container.change(toPage, options);
			};

			RouterPage.find = function( absUrl ) {
				var dataUrl = this._createDataUrl( absUrl ),
					initialContent = router.getFirstPage(),
					pageContainer = router.getContainer(),
					page;

				if ( /#/.test( absUrl ) && path.isPath(dataUrl) ) {
					return;
				}

				// Check to see if the page already exists in the DOM.
				// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
				//      are a valid url char and it breaks on the first occurence
				page = pageContainer.element.querySelector("[data-url='" + dataUrl + "']" + this.filter);

				// If we failed to find the page, check to see if the url is a
				// reference to an embedded page. If so, it may have been dynamically
				// injected by a developer, in which case it would be lacking a
				// data-url attribute and in need of enhancement.
				if ( !page && dataUrl && !path.isPath( dataUrl ) ) {
					page = findPageAndSetDataUrl(dataUrl, this.filter);
				}

				// If we failed to find a page in the DOM, check the URL to see if it
				// refers to the first page in the application. Also check to make sure
				// our cached-first-page is actually in the DOM. Some user deployed
				// apps are pruning the first page from the DOM for various reasons.
				// We check for this case here because we don't want a first-page with
				// an id falling through to the non-existent embedded page error case.
				if ( !page &&
					path.isFirstPageUrl( dataUrl ) &&
					initialContent &&
					initialContent.parentNode ) {
					page = initialContent;
				}

				return page;
			},

			RouterPage.parse = function( html, absUrl ) {
				var page,
					dataUrl = this._createDataUrl( absUrl ),
					scripts,
					all = document.createElement('div');

				// write base element
				this._setBase( absUrl );

				//workaround to allow scripts to execute when included in page divs
				all.innerHTML = html;

				page = all.querySelector(this.filter);

				if (page) {
					// TODO tagging a page with external to make sure that embedded pages aren't
					// removed by the various page handling code is bad. Having page handling code
					// in many places is bad. Solutions post 1.0
					DOM.setNSData(page, 'url', dataUrl);
					DOM.setNSData(page, 'external', true);

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
				}
				return page;
			},

			RouterPage.onHashChange = function () {
				return null;
			};

			RouterPage._createDataUrl = function( absoluteUrl ) {
				return path.convertUrlToDataUrl( absoluteUrl, true );
			};

			RouterPage.onOpenFailed = function(/* options */) {
				this._setBase( path.parseLocation().hrefNoSearch );
			};

			RouterPage._getBaseElement = function() {
				if (!head) {
					head = document.querySelector("head");
				}
				if ( !baseElement ) {
					baseElement = document.querySelector("base");
					if (!baseElement) {
						baseElement = document.createElement('base');
						baseElement.href = path.documentBase.hrefNoHash;
						head.appendChild(baseElement);
					}
				}
				return baseElement;
			};

			RouterPage._setBase = function( url ) {
				var base = this._getBaseElement(),
					baseHref = base.href;

				if ( path.isPath( url ) ) {
					url = path.makeUrlAbsolute( url, path.documentBase );
					if ( path.parseUrl(baseHref).hrefNoSearch !== path.parseUrl(url).hrefNoSearch ) {
						base.href = url;
						path.documentBase = path.parseUrl(path.makeUrlAbsolute(url, path.documentUrl.href));
					}
				}
			};

			ns.router.micro.route.page = RouterPage;

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return RouterPage;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
