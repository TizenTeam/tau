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
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../profile/wearable/widget/wearable/PageContainer",
			"../../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var WearablePageContainer = ns.widget.wearable.PageContainer,
				WearablePageContainerPrototype = WearablePageContainer.prototype,
				PageContainer = function () {
				},
				engine = ns.engine,
				prototype = new WearablePageContainer();

			PageContainer.events = WearablePageContainer.events;

			prototype._build = function ( element ) {
				var optionsBackground = this.options.background;
				if (WearablePageContainerPrototype._build) {
					element = WearablePageContainerPrototype._build(element);
				}

				if (optionsBackground) {
					element.style.background = "url(" + optionsBackground + ") no-repeat center center";
				}

				return element;
			};

			prototype._configure = function ( ) {
				var options = this.options || {};
				options.background = null;
				this.options = options;
			};

			PageContainer.prototype = prototype;

			// definition
			ns.widget.tv.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"body",
				["change", "getActivePage", "showLoading", "hideLoading"],
				PageContainer,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
