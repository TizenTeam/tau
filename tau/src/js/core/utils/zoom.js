/*global window, define */
/**
 * #Zoom utilities
 * Namespace with helpers function connected with zoom.
 *
 * @class ns.utils.zoom
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../utils"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var meta = document.querySelector("meta[name=viewport]"),
				initialContent = meta && meta.getAttribute("content"),
				disabledZoom = initialContent + ",maximum-scale=1, user-scalable=no",
				enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes",
				disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(initialContent),
				zoom = {
					enabled: !disabledInitially,
					locked: false,
					disable: function (lock) {
						if (!disabledInitially && !zoom.locked) {
							if (meta) {
								meta.setAttribute("content", disabledZoom);
							}
							zoom.enabled = false;
							zoom.locked = lock || false;
						}
					},
					enable: function (unlock) {
						if (!disabledInitially && (!zoom.locked || unlock === true)) {
							if (meta) {
								meta.setAttribute("content", enabledZoom);
							}
							zoom.enabled = true;
							zoom.locked = false;
						}
					},
					restore: function () {
						if (!disabledInitially) {
							if (meta) {
								meta.setAttribute("content", initialContent);
							}
							zoom.enabled = true;
						}
					}
				};
			ns.utils.zoom = zoom;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.utils.zoom;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
