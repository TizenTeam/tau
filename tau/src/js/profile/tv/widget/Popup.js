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
/*jslint nomen: true, plusplus: true */
/**
 * # PageContainer Widget
 * PageContainer is a widget, which is supposed to have multiple child pages but display only one at a time.
 *
 * It allows for adding new pages, switching between them and displaying progress bars indicating loading process.
 *
 * @class ns.widget.wearable.PageContainer
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Krzysztof Głodowski <k.glodowski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../profile/wearable/widget/wearable/Popup",
			"../../../core/engine",
			"../../../core/util/DOM/css"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var WearablePopup = ns.widget.wearable.Popup,
				classes = WearablePopup.classes,
				util = ns.util,
				DOM = util.DOM,
				Popup = function () {
				},
				engine = ns.engine,
				prototype = new WearablePopup();

			Popup.events = WearablePopup.events;
			Popup.classes = WearablePopup.classes;

			Popup.prototype = prototype;

			prototype._configure = function() {
				var options = this.options;
				options.minScreenHeigth = null;
			}

			// definition
			ns.widget.tv.Page = Popup;

			engine.defineWidget(
				"popup",
				".ui-popup",
				["setActive", "show", "hide", "open", "close"],
				Popup,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
