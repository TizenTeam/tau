/*global window, define, Math*/
/*jslint bitwise: true */
/**
* @class ns.theme
* Class with functions to set theme of application.
*/
(function (window, document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core",
			"./utils/DOM/attributes",
			"./utils/load"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {HTMLHeadElement} head local alias for document HEAD element
			 * @static
			 * @private
			 */
			var head = document.head,
				documentElement = document.documentElement,
				frameworkData = ns.frameworkData,
				utils = ns.utils,
				DOM = utils.DOM,
				load = utils.load,
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

				THEMES_DIRECTORY = 'themes',
				THEME_JS_FILE_NAME = 'theme.js',
				THEME_CSS_FILE_NAME = 'tizen-web-ui-fw-theme',

				themeRegex =  /ui-(bar|body|overlay)-([a-z])\b/,
				deviceWidthRegex = /.*width=(device-width|\d+)\s*,?.*$/gi;

			ns.theme = {
				/***
				* @property theme=s
				*/
				theme : 's',

				_activeTheme: null,

				/***
				* @method init
				* init theme
				*/
				init: function (container) {
					var self = this,
						containerClassList = container.classList,
						defaultTheme = frameworkData.theme;

					frameworkData.getParams();

					if (support.gradeA()) {
						documentElement.classList.add("ui-mobile");
						containerClassList.add("ui-mobile-viewport");
					}

					if (defaultTheme !== frameworkData.theme) {
						self.loadTheme(frameworkData.theme);
					}
				},

				/***
				* Scale font size
				* @method scaleBaseFontSize
				* @param {number} themeDefaultFontSize
				* @param {number} ratio
				*/
				scaleBaseFontSize : function (themeDefaultFontSize, ratio) {
					var scaledFontSize = Math.max(themeDefaultFontSize * ratio | 0, 4);
					documentElement.style.fontSize = scaledFontSize + "px";
					document.body.style.fontSize = scaledFontSize + "px";
				},

				getInheritedTheme : function (element, defaultTheme) {
					var theme,
						parentElement = element.parentNode,
						parentClasses,
						parentTheme;
					theme = DOM.getNSData(element, 'theme');
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

				enableSelection : function (element, value) {
					var val;
					switch (value) {
					case 'text':
					case 'auto':
					case 'none':
						val = value;
						break;
					default:
						val = 'auto';
						break;
					}

					if (element === document) {
						element = document.body;
					}
					element.style.MozUserSelect = val;
					element.style.webkitUserSelect = val;
					element.style.userSelect = val;

					return element;
				},

				disableContextMenu: function (element) {
					element.addEventListener("contextmenu", stopEvent, true);
				},

				enableContextMenu: function (element) {
					element.removeEventListener("contextmenu", stopEvent, true);
				},

				loadTheme: function(theme) {
					var self = this,
						themePath,
						cssPath,
						jsPath;

					if (!theme) {
						theme = frameworkData.theme;
					}

					themePath = frameworkData.rootDir +
							'/' + frameworkData.version +
							'/' + THEMES_DIRECTORY +
							'/' + theme;
					jsPath = themePath + '/' + THEME_JS_FILE_NAME;

					if (ns.frameworkData.minified) {
						cssPath = themePath + '/'+ THEME_CSS_FILE_NAME + '.min' + '.css';
					} else {
						cssPath = themePath + '/' + THEME_CSS_FILE_NAME + '.css';
					}
					load.css(cssPath);
					load.scriptSync(jsPath);

					if (support.gradeA()) {
						self.setScaling();
					}
				},

				setViewport: function(viewportWidth) {
					var metaVieport = document.querySelector("meta[name=viewport]"),
						content;

					if (metaVieport) {
						// Found custom viewport!
						content = metaVieport.getAttribute("content");
						viewportWidth = content.replace(deviceWidthRegex, "$1");
					} else {
						// Create a meta tag
						metaVieport = document.createElement("meta");
						metaVieport.name = "viewport";
						content = "width=" + viewportWidth + ", user-scalable=no";
						metaVieport.content = content;
						head.insertBefore(metaVieport, head.firstChild);
					}
					return viewportWidth;
				},

				isMobileBrowser: function() {
					return window.navigator.appVersion.indexOf("Mobile") > -1;
				},

				setScaling: function () {
					var self = this,
						viewportWidth = frameworkData.viewportWidth,
						themeDefaultFontSize = frameworkData.defaultFontSize, // comes from theme.js
						ratio = 1;

					// Keep original font size
					document.querySelector('body').setAttribute('data-tizen-theme-default-font-size', themeDefaultFontSize);

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
				if (router && ns.get('autoInitializePage', true)) {
					ns.theme.init(router.getContainer());
				}
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.theme;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
