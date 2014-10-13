/*global ns, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
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
