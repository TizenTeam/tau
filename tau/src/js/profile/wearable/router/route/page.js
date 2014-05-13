/*global window, define */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Support class for router to control change pages.
 * @class ns.router.route.page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../selectors",
			"../route",
			"../../../../core/utils/DOM/attributes",
			"../../../../core/utils/path",
			"../../../../core/utils/selectors",
			"../../../../core/utils/object",
			"../history",
			"../../widget/wearable/Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utils = ns.utils,
				path = utils.path,
				DOM = utils.DOM,
				object = utils.object,
				utilSelector = utils.selectors,
				history = ns.router.history,
				engine = ns.engine,
				baseElement,
				slice = [].slice,
				routePage = {},
				head;

			/**
			* Tries to find a page element matching id and filter (selector).
			* Adds data url attribute to found page, sets page = null when nothing found
			* @method findPageAndSetDataUrl
			* @private
			* @param {string} id Id of searching element
			* @param {string} filter Query selector for searching page
			* @static
			* @member ns.router.route.page
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

			/**
			 * Property containing default properties
			 * @property {Object} defaults
			 * @property {string} defaults.transition='none'
			 * @static
			 * @member ns.router.route.page
			 */
			routePage.defaults = {
				transition: 'none'
			};

			/**
			 * Property defining selector for filtering only page elements
			 * @property {string} filter
			 * @member ns.router.route.page
			 * @inheritdoc ns.wearable.selectors#page
			 * @static
			 */
			routePage.filter = ns.wearable.selectors.page;

			/**
			 * Returns default route options used inside Router
			 * @method option
			 * @static
			 * @member ns.router.route.page
			 * @return {Object}
			 */
			routePage.option = function () {
				return routePage.defaults;
			};

			/**
			* Change page
			* @method open
			* @param {HTMLElement|string} toPage
			* @param {Object} [options]
			* @param {boolean} [options.fromHashChange] call was made when on hash change
			* @param {string} [options.dataUrl]
			* @static
			* @member ns.router.route.page
			*/
			routePage.open = function (toPage, options) {
				var pageTitle = document.title,
					url,
					state = {},
					router = engine.getRouter();

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

					state = object.merge(
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

			/**
			 * Determines target page to open
			 * @method find
			 * @param {string} absUrl absolute path to opened page
			 * @static
			 * @member ns.router.route.page
			 * @return {?HTMLElement}
			 */
			routePage.find = function( absUrl ) {
				var self = this,
					router = engine.getRouter(),
					dataUrl = self._createDataUrl( absUrl ),
					initialContent = router.getFirstPage(),
					pageContainer = router.getContainer(),
					page;

				if ( /#/.test( absUrl ) && path.isPath(dataUrl) ) {
					return null;
				}

				// Check to see if the page already exists in the DOM.
				// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
				//      are a valid url char and it breaks on the first occurence
				page = pageContainer.element.querySelector("[data-url='" + dataUrl + "']" + self.filter);

				// If we failed to find the page, check to see if the url is a
				// reference to an embedded page. If so, it may have been dynamically
				// injected by a developer, in which case it would be lacking a
				// data-url attribute and in need of enhancement.
				if ( !page && dataUrl && !path.isPath( dataUrl ) ) {
					page = findPageAndSetDataUrl(dataUrl, self.filter);
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
			};

			/**
			 * Parses HTML and runs scripts from parsed code. 
			 * Fetched external scripts if required.
			 * Sets document base to parsed document absolute path.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed page
			 * @static
			 * @member ns.router.route.page
			 * @return {?HTMLElement}
			 */
			routePage.parse = function( html, absUrl ) {
				var self = this,
					page,
					dataUrl = self._createDataUrl( absUrl ),
					scripts,
					all = document.createElement('div');

				// write base element
				// @TODO shouldn't base be set if a page was found?
				self._setBase( absUrl );

				//workaround to allow scripts to execute when included in page divs
				all.innerHTML = html;

				// Finding matching page inside created element
				page = all.querySelector(self.filter);

				// If a page exists...
				if (page) {
					// TODO tagging a page with external to make sure that embedded pages aren't
					// removed by the various page handling code is bad. Having page handling code
					// in many places is bad. Solutions post 1.0
					DOM.setNSData(page, 'url', dataUrl);
					DOM.setNSData(page, 'external', true);

					// Check if parsed page contains scripts
					scripts = page.querySelectorAll('script');
					slice.call(scripts).forEach(utils.runScript.bind(null, dataUrl));
				}
				return page;
			};

			/**
			 * Handles hash change, **currently does nothing**.
			 * @method onHashChange
			 * @static
			 * @member ns.router.route.page
			 * @return {null}
			 */
			routePage.onHashChange = function () {
				return null;
			};

			/**
			 * Created data url from absolute url given as argument
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @protected
			 * @static
			 * @member ns.router.route.page
			 * @return {string}
			 */
			routePage._createDataUrl = function( absoluteUrl ) {
				return path.convertUrlToDataUrl( absoluteUrl, true );
			};

			/**
			 * On open fail, currently never used
			 * @method onOpenFailed 
			 * @static
			 * @member ns.router.route.page
			 */
			routePage.onOpenFailed = function(/* options */) {
				this._setBase( path.parseLocation().hrefNoSearch );
			};

			/**
			 * Returns base element from document head.
			 * If no base element is found, one is created based on current location
			 * @method _getBaseElement
			 * @protected
			 * @static
			 * @member ns.router.route.page
			 * @return {HTMLElement}
			 */
			routePage._getBaseElement = function() {
				// Fetch document head if never cached before
				if (!head) {
					head = document.querySelector("head");
				}
				// Find base element
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

			/**
			 * Sets document base to url given as argument
			 * @method _setBase
			 * @param {string} url
			 * @protected
			 * @static
			 * @member ns.router.route.page
			 */
			routePage._setBase = function( url ) {
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

			ns.router.route.page = routePage;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routePage;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));