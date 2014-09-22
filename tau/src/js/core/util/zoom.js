/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Zoom Utility
 * Object supports enabling and disabling zoom.
 * @class ns.util.zoom
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var meta = document.querySelector("meta[name=viewport]"),
				initialContent = meta && meta.getAttribute("content"),
				disabledZoom = initialContent + ",maximum-scale=1, user-scalable=no",
				enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes",
				disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(initialContent),
				zoom = {
					/**
					 * Status of zoom
					 * @property {boolean} enabled
					 * @static
					 * @member ns.util.zoom
					 */
					enabled: !disabledInitially,
					/**
					 * Flag shows actual locked/unlocked status
					 * @property {boolean} [locked=false]
					 * @static
					 * @member ns.util.zoom
					 */
					locked: false,
					/**
					 * Disable zoom
					 * @method disable
					 * @param {boolean} lock
					 * @static
					 * @member ns.util.zoom
					 */
					disable: function (lock) {
						if (!disabledInitially && !zoom.locked) {
							if (meta) {
								meta.setAttribute("content", disabledZoom);
							}
							zoom.enabled = false;
							zoom.locked = lock || false;
						}
					},
					/**
					 * Enable zoom
					 * @method enable
					 * @param {boolean} unlock
					 * @static
					 * @member ns.util.zoom
					 */
					enable: function (unlock) {
						if (!disabledInitially && (!zoom.locked || unlock === true)) {
							if (meta) {
								meta.setAttribute("content", enabledZoom);
							}
							zoom.enabled = true;
							zoom.locked = false;
						}
					},
					/**
					 * Restore zoom
					 * @method restore
					 * @static
					 * @member ns.util.zoom
					 */
					restore: function () {
						if (!disabledInitially) {
							if (meta) {
								meta.setAttribute("content", initialContent);
							}
							zoom.enabled = true;
						}
					}
				};
			ns.util.zoom = zoom;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.zoom;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
