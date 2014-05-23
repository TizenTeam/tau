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
/*jslint nomen: true */
/**
 * @class ns.widget.wearable.Label
 */
/** !!DRAFT!! **/
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Label = function () {
					this.options = {};
					this.options.value = "";
				};

			Label.prototype = new BaseWidget();

			Label.classes = {
				uiLabel: 'ui-label'
			};

			Label.prototype._build = function (element) {
				return element;
			};

			Label.prototype._setValue = function (value) {
				this.options.value = value;
				this.element.setAttribute("data-value", value);
				this.element.innerHTML = value;
			};

			Label.prototype._getValue = function () {
				return this.options.value;
			};

			ns.widget.wearable.Label = Label;
			engine.defineWidget(
				"Label",
				"[data-role=label]",
				[],
				Label
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.Label;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
