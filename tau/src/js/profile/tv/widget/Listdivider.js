/*global ns, define */
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
 */
/*jslint nomen: true */
/**
 * # List Divider Widget
 * List divider widget creates a list separator, which can be used for building
 * grouped list of items.
 *
 * @class ns.widget.tv.ListDivider
 * @extends ns.widget.mobile.ListDivider
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../tv",
			"../../../profile/mobile/widget/mobile/Listdivider"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var MobileListDivider = ns.widget.mobile.ListDivider,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.tv.ListDivider
				 * @private
				 * @static
				 */
				engine = ns.engine,
				ListDivider = function () {
					MobileListDivider.call(this);
				},
				prototype = new MobileListDivider();

			ListDivider.events = MobileListDivider.events;
			ListDivider.classes = MobileListDivider.classes;
			ListDivider.prototype = prototype;

			prototype._build = function (element) {
				element = MobileListDivider.prototype._build.call(this, element);
				element.removeAttribute("tabindex");
				return element;
			};

			// definition
			ns.widget.tv.ListDivider = ListDivider;
			engine.defineWidget(
				"ListDivider",
				"[data-role='list-divider'], .ui-list-divider",
				[],
				ListDivider,
				"tv",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.ListDivider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
