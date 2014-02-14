/*global window, define */
/**
 * @class ej.router.Page
 */
(function (window, document, ej) {
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
			var path = ej.utils.path,
				DOM = ej.utils.DOM,
				object = ej.utils.object,
				utilSelector = ej.utils.selectors,
				history = ej.router.micro.history,
				engine = ej.engine,
				RouterPage = {};

			RouterPage.defaults = {
				transition: 'none'
			};

			RouterPage.filter = ej.micro.selectors.page;

			RouterPage.option = function () {
				return RouterPage.defaults;
			};

			/**
			* Change page
			* @method open
			* @param {HTMLElement|string} toPage
			* @param {Object} options
			* @static
			* @memberOf ej.router.Page
			*/
			RouterPage.open = function (toPage, options) {
				var pageTitle = document.title,
					url,
					state = {},
					router = engine.getRouter();

				if (toPage === router.firstPage && !options.dataUrl) {
					options.dataUrl = path.documentUrl.hrefNoHash;
				}

				url = (options.dataUrl && path.convertUrlToDataUrl(options.dataUrl)) || DOM.getNSData(toPage, "url");

				pageTitle = DOM.getNSData(toPage, "title") || utilSelector.getChildrenBySelector(toPage, ".ui-header > .ui-title").textContent || pageTitle;
				if (!DOM.getNSData(toPage, "title")) {
					DOM.setNSData(toPage, "title", pageTitle);
				}

				if (url && !options.fromHashChange) {
					if (!path.isPath(url) && url.indexOf("#") < 0) {
						url = "#" + url;
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

				//set page title
				document.title = pageTitle;
				router.container.change(toPage, options);
			};

			RouterPage.onHashChange = function () {
				return null;
			};

			ej.router.micro.route.page = RouterPage;

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return RouterPage;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
