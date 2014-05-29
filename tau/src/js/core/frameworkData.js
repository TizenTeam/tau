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
					frameworkName: "tizen-web-ui-fw",
					isMinified: false,
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
					scriptElement = document.getElementsByTagName("script"),
					libFileName = "(tau(.min)?.js|tizen-web-ui-fw(.custom|.full)?(.min)?.js)",
					frameworkName = "tau",
					themePath,
					jsPath,
					theme,
					src,
					idx,
					elem;

				for (idx in scriptElement) {
					if (scriptElement.hasOwnProperty(idx)) {
						elem = scriptElement[idx];
						src = elem.src ? elem.getAttribute("src") : undefined;

						if (src && src.match(libFileName)) {
							theme = elem.getAttribute("data-framework-theme") ? elem.getAttribute("data-framework-theme") : self.theme;
							isMinified = src.search(/\.min\.js$/) > -1 ? true : false;

							if (src.search("tau") > -1 ) {
								// TAU framework
								themePath = "/theme/mobile/" + theme.match("black|white")[0];
								jsPath = "/js/mobile";
							} else {
								// tizen-web-ui framework
								frameworkName = "tizen-web-ui-fw";
								themePath = "/latest/themes/" + theme;
								jsPath = "/latest/js"
							}

							self.rootDir = elem.getAttribute(dataPrefix + "root") ||
								src.substring(0, src.search(frameworkName) + frameworkName.length) ||
								self.rootDir;
							self.themePath = self.rootDir + themePath;
							self.jsPath = self.rootDir + jsPath;
							self.version = elem.getAttribute(dataPrefix + "version") || self.version;
							self.theme = theme;
							self.frameworkName = frameworkName;
							self.isMinified = isMinified;
						}
					}
				}

				return false;
			};

			ns.frameworkData = frameworkData;
			// self init
			ns.frameworkData.getParams();
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
