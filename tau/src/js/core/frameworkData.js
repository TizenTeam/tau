/*global window, define*/
/*jslint bitwise: true */
/**
 * #Framework Data Object
 * Object contains properties describing run time environment.
 * @class ns.frameworkData
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
					/**
					 * The name of framework
					 * @property {string} frameworkName="tizen-web-ui-fw"
					 * @member ns.frameworkData
					 * @static
					 */
					frameworkName: "tizen-web-ui-fw",
					/**
					 * Determines whether the framework is minified
					 * @property {boolean} isMinified=false
					 * @member ns.frameworkData
					 * @static
					 */
					isMinified: false,
					/**
					 * The root directory of framework
					 * @property {string} rootDir="/usr/share/tizen-web-ui-fw"
					 * @member ns.frameworkData
					 * @static
					 */
					rootDir: "/usr/share/tizen-web-ui-fw",
					/**
					 * The version of framework
					 * @property {string} version="latest"
					 * @member ns.frameworkData
					 * @static
					 */
					version: "latest",
					/**
					 * The theme of framework
					 * @property {string} theme="tizen-black"
					 * @member ns.frameworkData
					 * @static
					 */
					theme: "tizen-black",
					/**
					 * The default width of viewport in framework.
					 * @property {number} defaultViewportWidth=360
					 * @member ns.frameworkData
					 * @static
					 */
					defaultViewportWidth: 360,
					/**
					 * The type of width of viewport in framework.
					 * @property {string} viewportWidth="device-width"
					 * @member ns.frameworkData
					 * @static
					 */
					viewportWidth: "device-width",
					/**
					 * Determines whether the viewport should be scaled
					 * @property {boolean} isMinified=false
					 * @member ns.frameworkData
					 * @static
					 */
					viewportScale: false,
					/**
					 * The default font size in framework.
					 * @property {number} defaultFontSize=22
					 * @member ns.frameworkData
					 * @static
					 */
					defaultFontSize: 22,
					/**
					 * Determines whether the framework is minified
					 * @property {boolean} minified=false
					 * @member ns.frameworkData
					 * @static
					 */
					minified: false,
					/**
					 * Determines the capability of device
					 * @property {Object} deviceCapa
					 * @property {boolean} deviceCapa.inputKeyBack=true
					 * Determines whether the back key is supported.
					 * @property {boolean} deviceCapa.inputKeyMenu=true
					 *  Determines whether the menu key is supported.
					 * @member ns.frameworkData
					 * @static
					 */
					deviceCapa: { inputKeyBack: true, inputKeyMenu: true },
					/**
					 * Determines whether the framework is loaded in debug profile.
					 * @property {boolean} debug=false
					 * @member ns.frameworkData
					 * @static
					 */
					debug: false,
					/**
					 * The version of framework's package
					 * @property {string} pkgVersion="0.2.83"
					 * @member ns.frameworkData
					 * @static
					 */
					pkgVersion: "0.2.83",
					/**
					 * The prefix of data used in framework
					 * @property {string} dataPrefix="data-framework-"
					 * @member ns.frameworkData
					 * @static
					 */
					dataPrefix: "data-framework-",
					/**
					 * The profile of framework
					 * @property {string} profile=""
					 * @member ns.frameworkData
					 * @static
					 */
					profile: ""
				},

				MINIFIED_REGEXP = /\.min\.js$/;

			/**
			 * Get data-* params from <script> tag, and set tizen.frameworkData.* values
			 * Returns true if proper <script> tag is found, or false if not.
			 * @method getParams
			 * @return {boolean} Returns true if proper <script> tag is found, or false if not.
			 * @member ns.frameworkData
			 * @static
			 */
			frameworkData.getParams = function() {
				var self = this,
					dataPrefix = self.dataPrefix,
					scriptElement = document.getElementsByTagName("script"),
					cssElement = document.getElementsByTagName("link"),
					libFileName = "(tau(.min)?.js|tizen-web-ui-fw(.custom|.full)?(.min)?.js)",
					cssFileName = "(tau(.min)?.css|tizen-web-ui-fw(.custom|.full)?(.min)?.css)",
					frameworkName = "tau",
					profileName = "",
					isMinified,
					themePath,
					themeVersion,
					jsPath,
					theme,
					src,
					href,
					idx,
					elem;

				// Get tau theme version
				for (idx in cssElement) {
					if (cssElement.hasOwnProperty(idx)) {
						elem = cssElement[idx];
						href = elem.href ? elem.getAttribute("href") : undefined;
						if (href && href.match(cssFileName)) {
							if (href.search("default") > -1) {
								themeVersion = "default";
							} else {
								themeVersion = "changeable";
							}
						}
					}
				}

				for (idx in scriptElement) {
					if (scriptElement.hasOwnProperty(idx)) {
						elem = scriptElement[idx];
						src = elem.src ? elem.getAttribute("src") : undefined;

						if (src && src.match(libFileName)) {
							theme = elem.getAttribute("data-framework-theme") || self.theme;
							if (themeVersion === "changeable")
								theme = "changeable";

							isMinified = src.search(MINIFIED_REGEXP) > -1 ? true : false;

							if (src.indexOf("tau") > -1 ) {
								// Get profile name. It can be assumed, that profile name is second up directory name
								// e.g. pathToLib/profileName/js/tau.js
								profileName = src.split('/').slice(-3)[0];

								// TAU framework
								themePath = "/" + profileName + "/theme/" + theme.match("black|white|changeable|default")[0];
								jsPath = "/" + profileName + "/js";
							} else {
								// tizen-web-ui framework
								frameworkName = "tizen-web-ui-fw";
								themePath = "/latest/themes/" + theme;
								jsPath = "/latest/js";
							}

							self.rootDir = elem.getAttribute(dataPrefix + "root") ||
							// remove from src path jsPath and "/" sign
							src.substring(0, src.lastIndexOf(frameworkName) - jsPath.length - 1) ||
								self.rootDir;
							self.themePath = self.rootDir + themePath;
							self.jsPath = self.rootDir + jsPath;
							self.version = elem.getAttribute(dataPrefix + "version") || self.version;
							self.theme = theme;
							self.frameworkName = frameworkName;
							self.isMinified = isMinified;
							self.profile = profileName;
							return true;
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
