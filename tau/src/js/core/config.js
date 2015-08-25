/*global define, ns*/
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
			ns.setConfig("useDataAttributes", true, true);
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
