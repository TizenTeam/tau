/* global define, ns */
/**
 * #Scrolling by rotary event
 *
 * Tool to enable scrolling on rotary event.
 *
 * @class ns.util.rotaryScrolling
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var rotaryScrolling = {},
				element = null,
				scrollDiff = 40;

			/**
			 * Handler for rotary event
			 * @param {Event} event
			 */
			function rotaryDetentHandler(event) {
				if (event.detail.direction === "CW") {
					element.scrollTop += scrollDiff;
				} else {
					element.scrollTop -= scrollDiff;
				}
			}

			/**
			 * Enable Rotary event scrolling
			 * @param {HTMLElement} newElement
			 * @param {number} newScrollDiff
			 */
			function enable(newElement, newScrollDiff) {
				element = newElement;
				if (newScrollDiff) {
					scrollDiff = newScrollDiff;
				}
				document.addEventListener("rotarydetent", rotaryDetentHandler);
			}

			/**
			 * Disable rotary event scrolling
			 */
			function disable() {
				scrollDiff = 40;
				document.removeEventListener("rotarydetent", rotaryDetentHandler);
			}

			rotaryScrolling.enable = enable;
			rotaryScrolling.disable = disable;

			ns.util.rotaryScrolling = rotaryScrolling;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return rotaryScrolling;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
