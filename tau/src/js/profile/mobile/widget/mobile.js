/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Mobile Widget Reference
 *
 * The Tizen Web UI service provides rich Tizen widgets that are optimized for the Tizen Web browser. You can use the widgets for:
 *
 * - CSS animation
 * - Rendering
 *
 * The following table displays the widgets provided by the Tizen Web UI service.
 *
 * @class ns.widget.mobile
 * @seeMore https://developer.tizen.org/dev-guide/2.2.1/org.tizen.web.uiwidget.apireference/html/web_ui_framework.htm "Web UI Framework Reference"
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.widget.mobile = ns.widget.mobile || {};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
