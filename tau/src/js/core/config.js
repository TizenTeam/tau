/*global define, ns*/
/*jslint bitwise: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"./defaults"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			// Default configuration properties
			ns.setConfig("rootDir", ns.getFrameworkPath(), true);
			ns.setConfig("version", "");
			ns.setConfig("allowCrossDomainPages", false, true);
			ns.setConfig("domCache", false, true);
			// .. other possible options
			// ns.setConfig("autoBuildOnPageChange", true);
			// if is true then build first page
			// ns.setConfig("autoInitializePage", true);
			// ns.setConfig("container", document.body); // for defining application container
			// setting page container
			// ns.setConfig("pageContainer", document.body);
			// if true then page container is always take from pageContainer config of document body
			// if false then pageContainer option is ignored and PageContainer element is always parent of first page
			// ns.setConfig("pageContainerBody", false);


			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
