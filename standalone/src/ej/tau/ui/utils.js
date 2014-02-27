/*global window, define */
/*jslint plusplus: true, nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, frameworkNamespace, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../ui",
			"../../ej/utils/path",
			"../../ej/utils/DOM/attributes",
			"../../ej/utils/events"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			document.addEventListener("initjqm", function () {
				var utils = frameworkNamespace.utils,
					DOM = utils.DOM,
					events = utils.events;
				/**
				 * @class gear.ui.path
				 * @inheritdoc ns.utils.path
				 * @extends ns.utils.path
				 */
				ns.path = utils.path;
				/**
				 * @method fireEvent
				 * @inheritdoc ns.utils.events.trigger
				 * @memberOf gear.ui
				 */
				ns.fireEvent = events.trigger.bind(events.trigger);
				/**
				 * @method getData
				 * @inheritdoc ns.utils.DOM.getData
				 * @memberOf gear.ui
				 */
				ns.getData = DOM.getData.bind(DOM);
			}, false);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, window.ej, window.gear.ui));
