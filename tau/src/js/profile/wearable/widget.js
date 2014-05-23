/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
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
/*jslint plusplus: true, nomen: true */
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
/**
 * @class tau.VirtualGrid
 * @inheritdoc ns.widget.wearable.VirtualGrid
 * @extends ns.widget.wearable.VirtualGrid
 */
/**
 * @class tau.VirtualListview
 * @inheritdoc ns.widget.wearable.VirtualListview
 * @extends ns.widget.wearable.VirtualListview
 */
/**
 * @class tau.Popup
 * @inheritdoc ns.widget.wearable.Popup
 * @extends ns.widget.wearable.Popup
 */
/**
 * @class tau.Page
 * @inheritdoc ns.widget.wearable.Page
 * @extends ns.widget.wearable.Page
 */
/**
 * @class tau.PageContainer
 * @inheritdoc ns.widget.wearable.PageContainer
 * @extends ns.widget.wearable.PageContainer
 */
/**
 * @class tau.IndexScrollbar
 * @inheritdoc ns.widget.wearable.IndexScrollbar
 * @extends ns.widget.wearable.IndexScrollbar
 */
(function (document, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/conflict",
			"../../core/widget/BaseWidget",
			"../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = frameworkNamespace.engine;

			ns.widget = {
				getInstance: engine.getBinding.bind(engine),
				getAllInstances: engine.getAllBindings.bind(engine)
			};

			ns.defineWidget = engine.defineWidget.bind(engine);

			document.addEventListener("widgetdefined", function (evt) {
				var definition = evt.detail,
					name = definition.name;

				ns.widget[name] = (function (definitionName) {
					return function (element, options) {
						return engine.instanceWidget(element, definitionName, options);
					};
				}(name));
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns, window.tau));
