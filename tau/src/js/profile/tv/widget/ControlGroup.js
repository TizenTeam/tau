/*global window, define, ns */
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
/*jslint nomen: true, plusplus: true */
/**
 * #Control Group Widget
 * Controlgroup widget improves the styling of a group of buttons by grouping them to form a single block.
 *
 * @class ns.widget.tv.Controlgroup
 * @extends ns.widget.mobile.Controlgroup
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../mobile/widget/mobile/Controlgroup",
			"../../../core/engine",
			"../../../core/util/selectors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var MobileControlGroup = ns.widget.mobile.Controlgroup,
				engine = ns.engine,
				selectors = ns.util.selectors,

				ControlGroup = function () {
					MobileControlGroup.call(this);
				},
				classes = MobileControlGroup.classes,
				prototype = new MobileControlGroup();

			ControlGroup.prototype = prototype;
			ControlGroup.classes = classes;

			prototype._setWidthForButtons = function (groupControls) {
				var controlElements,
					controlElementsLength,
					widthSize,
					i;
				controlElements = selectors.getChildrenByTag(groupControls, "a");
				controlElementsLength = controlElements.length;
				// because buttons have margin, we have to do correction of size
				widthSize = 100 / controlElementsLength - 3;
				for (i = 0; i < controlElementsLength; i++) {
					engine.instanceWidget(controlElements[i], "Button");
					controlElements[i].style.width = widthSize + "%";
				}
			};

			ns.widget.tv.ControlGroup = ControlGroup;

			engine.defineWidget(
				"Controlgroup",
				"[data-role='controlgroup'], .ui-controlgroup",
				[],
				ControlGroup,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.ControlGroup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
