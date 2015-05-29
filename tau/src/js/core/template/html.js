/*global window, define, XMLHttpRequest, ns*/
/*jslint bitwise: true */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class ns.template.html
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../template",
			"../util/path"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var template = ns.template,
				util = ns.util,
				utilPath = util.path;

			function callbackFunction(callback, data, event) {
				var request = event.target,
					status = {},
					element = null;
				if (request.readyState === 4) {
					status.success = (request.status === 200 || (request.status === 0 && request.responseXML));
					element = request.responseXML;
					if (!data.fullDocument) {
						element = element.body.firstChild;
					}
					callback(status, element);
				}
			}

			/**
			 *
			 * @param globalOptions
			 * @param path
			 * @param data
			 * @param callback
			 */
			function htmlTemplate(globalOptions, path, data, callback) {
				var absUrl = utilPath.makeUrlAbsolute((globalOptions.pathPrefix || "" ) + path, utilPath.getLocation()),
					request,
					eventCallback = callbackFunction.bind(null, callback, data);

				// If the caller provided data append the data to the URL.
				if (data) {
					absUrl = utilPath.addSearchParams(path, data);
				}

				// Load the new content.
				request = new XMLHttpRequest();
				request.responseType = "document";
				request.overrideMimeType("text/html");
				request.open("GET", absUrl);
				request.addEventListener("error", eventCallback);
				request.addEventListener("load", eventCallback);
				request.send();
			}

			template.register("html", htmlTemplate);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
