/*global window, define*/
/*jslint bitwise: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class ns.support
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/* $.mobile.media method: pass a CSS media type or query and get a bool return
			note: this feature relies on actual media query support for media queries, though types will work most anywhere
			examples:
				$.mobile.media('screen') // tests for screen media type
				$.mobile.media('screen and (min-width: 480px)') // tests for screen media type with window width > 480px
				$.mobile.media('@media screen and (-webkit-min-device-pixel-ratio: 2)') // tests for webkit 2x pixel ratio (iPhone 4)
		*/
			// TODO: use window.matchMedia once at least one UA implements it
			var cacheMedia = {},
				testDiv = document.createElement("div"),
				fakeBody = document.createElement("body"),
				fakeBodyStyle = fakeBody.style,
				html = document.getElementsByTagName('html')[0],
				style,
				vendors = [ "Webkit", "Moz", "O" ],
				webos = window.palmGetResource, //only used to rule out scrollTop
				opera = window.opera,
				operamini = window.operamini && ({}).toString.call(window.operamini) === "[object OperaMini]",
				blackBerry,
				testDivStyle = testDiv.style;

			testDiv.id = 'jquery-mediatest';
			fakeBody.appendChild(testDiv);

			function media(query) {
				var styleBlock = document.createElement("style"),
					cssrule = "@media " + query + " { #jquery-mediatest { position:absolute; } }";
				if (query.cacheMedia === undefined) {
					//must set type for IE!
					styleBlock.type = "text/css";

					if (styleBlock.styleSheet) {
						styleBlock.styleSheet.cssText = cssrule;
					} else {
						styleBlock.appendChild(document.createTextNode(cssrule));
					}

					if (html.firstChild) {
						html.insertBefore(fakeBody, html.firstChild);
					} else {
						html.appendChild(fakeBody);
					}
					html.insertBefore(styleBlock, fakeBody);
					style = window.getComputedStyle(testDiv);
					cacheMedia[query] = (style.position === "absolute");
					styleBlock.parentNode.removeChild(styleBlock);
					fakeBody.parentNode.removeChild(fakeBody);
				}
				return cacheMedia[query];
			}

			function validStyle(prop, value, check_vend) {
				var div = document.createElement('div'),
					uc = function (txt) {
						return txt.charAt(0).toUpperCase() + txt.substr(1);
					},
					vend_pref = function (vend) {
						return "-" + vend.charAt(0).toLowerCase() + vend.substr(1) + "-";
					},
					returnValue,
					check_style = function (vend) {
						var vend_prop = vend_pref(vend) + prop + ": " + value + ";",
							uc_vend = uc(vend),
							propStyle = uc_vend + uc(prop);

						div.setAttribute("style", vend_prop);

						if (!!div.style[propStyle]) {
							returnValue = true;
						}
					},
					checkVendors = check_vend ? [check_vend] : vendors,
					checkVendorsLength = checkVendors.length,
					i;

				for (i = 0; i < checkVendorsLength; i++) {
					check_style(checkVendors[i]);
				}
				return !!returnValue;
			}

			/**
			 *
			 * @param prop
			 * @returns {boolean}
			 */
			function propExists(prop) {
				var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),
					props = (prop + " " + vendors.join(uc_prop + " ") + uc_prop).split(" "),
					key;

				for (key in props) {
					if (props.hasOwnProperty(key) && fakeBodyStyle[props[key]] !== undefined) {
						return true;
					}
				}
				return false;
			}

			function transform3dTest() {
				var prop = "transform-3d";
				return validStyle('perspective', '10px', 'moz') || media("(-" + vendors.join("-" + prop + "),(-") + "-" + prop + "),(" + prop + ")");
			}

			blackBerry = window.blackberry && !propExists("-webkit-transform");

			function baseTagTest() {
				var fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
					head = document.head,
					base = head.querySelector("base"),
					fauxEle = null,
					hadBase = false,
					href = "",
					link,
					rebase;

				if (base) {
					href = base.getAttribute("href");
					base.setAttribute("href", fauxBase);
					hadBase = true;
				} else {
					base = fauxEle = document.createElement('base');
					base.setAttribute("href", fauxBase);
					head.appendChild(base);
				}

				link = document.createElement('a');
				link.href = 'testurl';
				if (fakeBody.firstChild) {
					fakeBody.insertBefore(link, fakeBody.firstChild);
				} else {
					fakeBody.appendChild(link);
				}
				rebase = link.href;
				base.href = href || location.pathname;

				if (fauxEle) {
					head.removeChild(fauxEle);
				}

				// Restore previous base href if base had existed
				if (hadBase) {
					base.setAttribute("href", href);
				}

				// Tell jQuery not to append <base> in build mode
				if (location.hash === "#build") {
					return false;
				}

				return rebase.indexOf(fauxBase) === 0;
			}

			function cssPointerEventsTest() {
				var element = document.createElement('x'),
					documentElement = document.documentElement,
					getComputedStyle = window.getComputedStyle,
					supports,
					elementStyle = element.style;

				if (elementStyle.pointerEvents === undefined) {
					return false;
				}

				elementStyle.pointerEvents = 'auto';
				elementStyle.pointerEvents = 'x';
				documentElement.appendChild(element);
				supports = getComputedStyle && getComputedStyle(element, '').pointerEvents === 'auto';
				documentElement.removeChild(element);
				return !!supports;
			}

			function boundingRect() {
				var div = document.createElement("div");
				return div.getBoundingClientRect !== undefined;
			}

			ns.support = {
				media: media,
				cssTransitions: (window.WebKitTransitionEvent !== undefined || validStyle('transition', 'height 100ms linear')) && !opera,
				pushState: window.history.pushState && window.history.replaceState && true,
				mediaquery: media("only all"),
				cssPseudoElement: !!propExists("content"),
				touchOverflow: !!propExists("overflowScrolling"),
				cssTransform3d: transform3dTest(),
				boxShadow: !!propExists("boxShadow") && !blackBerry,
				scrollTop: ((window.pageXOffset || document.documentElement.scrollTop || fakeBody.scrollTop) !== undefined && !webos && !operamini) ? true : false,
				dynamicBaseTag: baseTagTest(),
				cssPointerEvents: cssPointerEventsTest(),
				cssAnimationPrefix: testDivStyle.hasOwnProperty("webkitAnimation") ? "-webkit-" :
						testDivStyle.hasOwnProperty("mozAnimation") ? "-moz-" :
								testDivStyle.hasOwnProperty("oAnimation") ? "-o-" : "",
				boundingRect: boundingRect(),
				browser: {
					ie: (function () {
						var v = 3,
							div = document.createElement("div"),
							a = div.all || [];
						do {
							div.innerHTML = "<!--[if gt IE " + (++v) + "]><br><![endif]-->";
						} while (a[0]);
						return v > 4 ? v : !v;
					}())
				},
				gradeA: function () {
					return ((this.mediaquery || (this.browser.ie && this.browser.ie >= 7)) &&
						(this.boundingRect || ((window.jQuery && window.jQuery.fn && window.jQuery.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/)) !== null)));
				},
				touch: document.ontouchend !== undefined,
				orientation: window.orientation !== undefined && window.onorientationchange !== undefined
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.support;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
