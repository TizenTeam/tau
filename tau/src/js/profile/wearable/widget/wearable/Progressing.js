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
 * # Processing Widget
 * Shows that an operation is in progress.
 *
 * The processing widget shows that an operation is in progress.
 *
 * ## Default selectors
 *
 * To add a processing widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-processing"></div>
 *      <div class="ui-processing-text">
 *          Description about progress
 *      </div>
 *
 * ## JavaScript API
 *
 * Processing widget hasn't JavaScript API.
 *
 * @class ns.widget.wearable.Progressing
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Progressing = function () {
					return this;
				},
				prototype = new BaseWidget();

			Progressing.events = {};

			/**
			* build Progressing
			* @method _build
			* @private
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.Progressing
			*/
			prototype._build = function (element) {
				return element;
			};

			prototype._init = function (element) {
				return element;
			};

			prototype._bindEvents = function (element) {
				return element;
			};

			/**
			* refresh structure
			* @method _refresh
			* @new
			* @member ns.widget.Progressing
			*/
			prototype._refresh = function () {
				return null;
			};

			/**
			* @method _destroy
			* @private
			* @member ns.widget.Progressing
			*/
			prototype._destroy = function () {
				return null;
			};

			Progressing.prototype = prototype;
			ns.widget.wearable.Progressing = Progressing;

			engine.defineWidget(
				"Progressing",
				".ui-progress",
				[],
				Progressing,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Progressing;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
