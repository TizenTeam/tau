/*global window, define*/
/*jslint bitwise: true */
/**
* @class ns.theme
* Class with functions to set theme of application.
*/
(function (document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var frameworkData = {
					rootDir: '/usr/share/tizen-web-ui-fw',
					version: 'latest',
					theme: "tizen-black",
					defaultViewportWidth: 360,
					viewportWidth: "device-width",
					viewportScale: false,
					defaultFontSize: 22,
					minified: false,
					deviceCapa: { inputKeyBack: true, inputKeyMenu: true },
					debug: false,
					pkgVersion: "0.2.83",
					dataPrefix: 'data-framework-'
				},
				slice = [].slice,

				FILE_REGEXP = /^file:(\/\/)?/,
				TOKENS_REGEXP = /[\/\\]/,
				MINIFIED_REGEXP = /\.min\.js$/;

			/* Get data-* params from <script> tag, and set tizen.frameworkData.* values
			 * Returns true if proper <script> tag is found, or false if not.
			 */
			frameworkData.getParams = function() {
				var self = this,
					dataPrefix = self.dataPrefix,
					scriptElement = slice.call(document.querySelectorAll('script['+ dataPrefix +'theme]'), 0).pop(),
					src = (scriptElement) ? scriptElement.getAttribute('src') : null,
					tokens,
					version_idx = -3;

				if (src) {
					// Set framework data, only when they are given.
					tokens = src.split(TOKENS_REGEXP);
					self.rootDir = (scriptElement.getAttribute(dataPrefix + 'root') ||
						tokens.slice(0, tokens.length + version_idx).join('/') ||
						self.rootDir).replace(FILE_REGEXP, '');
					self.version = scriptElement.getAttribute(dataPrefix + 'version') ||
						tokens[ tokens.length + version_idx ] ||
						self.version;
					self.theme = scriptElement.getAttribute(dataPrefix + 'theme') ||
						self.theme;
					self.viewportWidth = scriptElement.getAttribute(dataPrefix + 'viewport-width') ||
						self.viewportWidth;
					self.viewportScale = "true" === scriptElement.getAttribute(dataPrefix + 'viewport-scale') ? true : self.viewportScale;
					self.minified = src.search(MINIFIED_REGEXP) > -1;
					self.debug = "true" === scriptElement.getAttribute(dataPrefix + 'debug') ? true : self.debug;
					return true;
				}
				return false;
			};

			ns.frameworkData = frameworkData;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
