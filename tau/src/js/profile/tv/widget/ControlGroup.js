/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../widget",
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
					MobileControlGroup.call(self);
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
					controlElements[i].style.width = widthSize + '%';
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
