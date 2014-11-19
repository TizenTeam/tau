/*global window, ns, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Info
 *
 * Various TAU information
 * @class ns.info
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"./event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} info
			 * @property {string} [info.profile="default"] Current runtime profile
			 * @property {string} [info.theme="default"] Current runtime theme
			 * @property {string} info.version Current runtime version
			 * @member ns.info
			 * @static
			 */
			var eventUtils = ns.event,
				info = {
					profile: "default",
					theme: "default",
					version: ns.version,

					/**
					 * Refreshes information about runtime
					 * @method refreshTheme
					 * @param {Function} done Callback run when the theme is discovered
					 * @member ns.info
					 * @return {null|String}
					 * @static
					 */
					refreshTheme: function (done) {
						var el = document.createElement("span"),
							parent = document.body,
							themeName = null;

						if (document.readyState !== "interactive" && document.readyState !== "complete") {
							eventUtils.fastOn(document, "DOMContentLoaded", this.refreshTheme.bind(this, done));
							return null;
						}
						el.classList.add("tau-info-theme");

						parent.appendChild(el);
						themeName = window.getComputedStyle(el, ":after").content;
						parent.removeChild(el);

						if (themeName && themeName.length > 0) {
							this.theme = themeName;
						}

						themeName = themeName || null;

						if (done) {
							done(themeName);
						}

						return themeName;
					}
				};

			info.refreshTheme();

			ns.info = info;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.info;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
