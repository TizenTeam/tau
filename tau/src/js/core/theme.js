/*global window, define, Math, ns*/
/*jslint bitwise: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * #Theme object
 * Class with functions to set theme of application.
 * @class ns.theme
 */
(function (window, document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"./util/DOM/attributes",
			"./util/load"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Local alias for document HEAD element
			 * @property {HTMLHeadElement} head
			 * @static
			 * @private
			 * @member ns.theme
			 */
			var head = document.head,
				documentElement = document.documentElement,
				frameworkData = ns.frameworkData,
				util = ns.util,
				DOM = util.DOM,
				load = util.load,
				support = ns.support,

				stopEvent = function (event) {
					var element = event.target,
						tag = element.tagName.toLowerCase(),
						type = element.type;
					if ((tag !== "input" ||
							(type !== "text" && type !== "email" && type !== "url" && type !== "search" && type !== "tel")) &&
							tag !== "textarea") {
						event.stopPropagation();
						event.preventDefault();
					}
				},

				THEME_JS_FILE_NAME = "theme.js",
				THEME_CSS_FILE_NAME = "tau",

				themeRegex =  /ui-(bar|body|overlay)-([a-z])\b/,
				deviceWidthRegex = /.*width=(device-width|\d+)\s*,?.*$/gi;

			ns.theme = {
				/**
				 * Standard theme
				 * @property {string} theme="s"
				 * @member ns.theme
				 */
				theme: "s",

				_activeTheme: null,

				/**
				 * This function inits theme.
				 * @method init
				 * @param {HTMLElement} container
				 * @member ns.theme
				 */
				init: function (container) {
					var self = this,
						containerClassList = container.classList;

					if (frameworkData) {
						frameworkData.getParams();
					}

					if (support && support.gradeA()) {
						documentElement.classList.add("ui-mobile");
						containerClassList.add("ui-mobile-viewport");
					}

					if (frameworkData) {
						self.loadTheme(frameworkData.theme);
					}
				},

				/**
				 * This function scales font size.
				 * @method scaleBaseFontSize
				 * @param {number} themeDefaultFontSize Default font size
				 * @param {number} ratio Scaling ration
				 * @member ns.theme
				 */
				scaleBaseFontSize : function (themeDefaultFontSize, ratio) {
					var scaledFontSize = Math.max(themeDefaultFontSize * ratio | 0, 4);
					documentElement.style.fontSize = scaledFontSize + "px";
					document.body.style.fontSize = scaledFontSize + "px";
				},

				/**
				 * This function searches theme, which is inherited
				 * from parents by element.
				 * @method getInheritedTheme
				 * @param {HTMLElement} element Element for which theme is looking for.
				 * @param {string} defaultTheme Default theme.
				 * It is used if no theme, which can be inherited, is found.
				 * @return {string} Inherited theme
				 * @member ns.theme
				 */
				getInheritedTheme: function (element, defaultTheme) {
					var theme,
						parentElement = element.parentNode,
						parentClasses,
						parentTheme;

					theme = DOM.getNSData(element, "theme");

					if (!theme) {
						while (parentElement) {
							parentClasses = parentElement.className || "";
							parentTheme = themeRegex.exec(parentClasses);
							if (parentClasses && parentTheme && parentTheme.length > 2) {
								theme = parentTheme[2];
								break;
							}
							parentElement = parentElement.parentNode;
						}
					}
					return theme || defaultTheme;
				},

				/**
				 * This function sets selection behavior for the element.
				 * @method enableSelection
				 * @param {HTMLElement} element Element for which selection behavior is set.
				 * @param {"text"|"auto"|"none"} value="auto" Selection behavior.
				 * @return {HTMLElement} Element with set styles.
				 * @member ns.theme
				 */
				enableSelection: function (element, value) {
					var val,
						elementStyle;

					switch (value) {
					case "text":
					case "auto":
					case "none":
						val = value;
						break;
					default:
						val = "auto";
						break;
					}

					if (element === document) {
						element = document.body;
					}

					elementStyle = element.style;
					elementStyle.MozUserSelect = elementStyle.webkitUserSelect = elementStyle.userSelect = val;

					return element;
				},

				/**
				 * This function disables event "contextmenu".
				 * @method disableContextMenu
				 * @param {HTMLElement} element Element for which event "contextmenu"
				 * is disabled.
				 * @member ns.theme
				 */
				disableContextMenu: function (element) {
					element.addEventListener("contextmenu", stopEvent, true);
				},

				/**
				 * This function enables event "contextmenu".
				 * @method enableContextMenu
				 * @param {HTMLElement} element Element for which event "contextmenu"
				 * is enabled.
				 * @member ns.theme
				 */
				enableContextMenu: function (element) {
					element.removeEventListener("contextmenu", stopEvent, true);
				},

				/**
				 * This function loads files with proper theme.
				 * @method loadTheme
				 * @param {string} theme Choosen theme.
				 * @member ns.theme
				 */
				loadTheme: function(theme) {
					var self = this,
						themePath = frameworkData.themePath,
						themeName = THEME_CSS_FILE_NAME,
						cssPath,
						isMinified = frameworkData.minified,
						jsPath;

					// If the theme has been loaded do not repeat that process
					if (frameworkData.themeLoaded) {
						//>>excludeStart("tauDebug", pragmas.tauDebug);
						ns.log("Theme already loaded, aborting loadTheme(" + theme + ")");
						//>>excludeEnd("tauDebug");
						return;
					}

					if (frameworkData.frameworkName !== "tau") {
						themeName = "tizen-web-ui-fw-theme";
					}
					if (isMinified) {
						cssPath = themePath + "/" + themeName + ".min.css";
					} else {
						cssPath = themePath + "/" + themeName + ".css";
					}

					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("Loading theme: " + theme);
					//>>excludeEnd("tauDebug");

					load.themeCSS(cssPath, theme);
					jsPath = themePath + "/" + THEME_JS_FILE_NAME;
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("Loading theme.js file for theme: " + theme);
					//>>excludeEnd("tauDebug");
					load.scriptSync(jsPath);

					if (support.gradeA()) {
						self.setScaling();
					}

					frameworkData.themeLoaded = true;
				},

				/**
				 * This function sets viewport.
				 * If custom viewport is found, its width will be returned.
				 * Otherwise, the new viewport will be created.
				 * @method setViewport
				 * @param {number|string} viewportWidth Width of the new viewport.
				 * If no viewport is found, the new viewport with this
				 * width is created.
				 * @return {string} Width of custom viewport.
				 * @member ns.theme
				 */
				setViewport: function(viewportWidth) {
					var metaViewport = document.querySelector("meta[name=viewport]"),
						content;

					if (metaViewport) {
						// Found custom viewport!
						content = metaViewport.getAttribute("content");
						viewportWidth = content.replace(deviceWidthRegex, "$1");
					} else {
						// Create a meta tag
						metaViewport = document.createElement("meta");
						metaViewport.name = "viewport";
						content = "width=" + viewportWidth + ", user-scalable=no";
						metaViewport.content = content;
						head.insertBefore(metaViewport, head.firstChild);
					}
					return viewportWidth;
				},

				/**
				 * This function checks if application is run
				 * in the mobile browser.
				 * @method isMobileBrowser
				 * @return {boolean} Returns true, if application
				 * is run in mobile browser. Otherwise, false is returned.
				 * @member ns.theme
				 */
				isMobileBrowser: function() {
					return window.navigator.appVersion.indexOf("Mobile") > -1;
				},

				/**
				 * This function sets scaling of viewport.
				 * @method setScaling
				 * @member ns.theme
				 */
				setScaling: function () {
					var self = this,
						viewportWidth = frameworkData.viewportWidth,
						themeDefaultFontSize = frameworkData.defaultFontSize, // comes from theme.js
						ratio = 1;

					// Keep original font size
					document.body.setAttribute("data-tizen-theme-default-font-size", themeDefaultFontSize);

					if (ns.theme.isMobileBrowser()) {
						// Legacy support: tizen.frameworkData.viewportScale
						if (frameworkData.viewportScale === true) {
							viewportWidth = "screen-width";
						}

						// screen-width support
						if ("screen-width" === viewportWidth) {
							if (window.self === window.top) {
								// Top frame: for target. Use window.outerWidth.
								viewportWidth = window.outerWidth;
							} else {
								// iframe: for web simulator. Use clientWidth.
								viewportWidth = document.documentElement.clientWidth;
							}
						}

						// set viewport meta tag
						// If custom viewport setting exists, get viewport width
						viewportWidth = self.setViewport(viewportWidth);

						if (viewportWidth !== "device-width") {
							ratio = parseFloat(viewportWidth / ns.frameworkData.defaultViewportWidth);
							self.scaleBaseFontSize(themeDefaultFontSize, ratio);
						}
					}
				}
			};

			document.addEventListener("themeinit", function (evt) {
				var router = evt.detail;
				if (router && ns.getConfig("autoInitializePage", true)) {
					ns.theme.init(router.getContainer().element);
				}
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.theme;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
