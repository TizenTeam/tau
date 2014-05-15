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
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/conflict",
			"../../core/engine",
			"../../core/utils/path",
			"../../core/utils/DOM/attributes",
			"../../core/utils/DOM/css",
			"../../core/utils/events",
			"../../core/utils/object",
			"../../core/utils/selectors",
			"../../core/event/gesture"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			document.addEventListener(frameworkNamespace.engine.eventType.INIT, function () {
				var utils = frameworkNamespace.utils,
					utilsDOM = utils.DOM,
					events = utils.events,
					utilsObject = utils.object;
				/**
				 * @class tau.path
				 * @inheritdoc ns.utils.path
				 * @extends ns.utils.path
				 */
				ns.path = utils.path;
				/**
				 * @method fireEvent
				 * @inheritdoc ns.utils.events#trigger
				 * @member tau
				 */
				ns.fireEvent = events.trigger.bind(events);
				/**
				 * @method getData
				 * @inheritdoc ns.utils.DOM#getData
				 * @member tau
				 */
				ns.getData = utilsDOM.getData.bind(utilsDOM);
				/**
				 * @method extendObject
				 * @inheritdoc ns.utils.object#merge
				 * @member tau
				 */
				ns.extendObject = utilsObject.merge.bind(utilsObject);
				/**
				 * @method inherit
				 * @inheritdoc ns.utils.object#inherit
				 * @member tau
				 */
				ns.inherit = utilsObject.inherit.bind(utilsObject);
				/**
				 * Namespace with DOM utilities.
				 * @class tau.dom
				 */
				ns.dom = {
					/**
					 * @method getElementOffset
					 * @inheritdoc ns.utils.DOM#getElementOffset
					 * @static
					 * @member tau.dom
					 */
					getOffset: utilsDOM.getElementOffset.bind(utilsDOM),
					/**
					 * @method triggerCustomEvent
					 * @inheritdoc ns.utils.events#trigger
					 * @member tau.dom
					 */
					triggerCustomEvent: events.trigger.bind(events),
					/**
					 * @method data
					 * @inheritdoc ns.utils.DOM#nsData
					 * @static
					 * @member tau.dom
					 */
					data: utilsDOM.nsData.bind(utilsDOM)
				};

				ns.utils = {
					DOM: utilsDOM,
					event: utils.events,
					object: utils.object,
					path: utils.path,
					selector: utils.selectors
				};

				/**
				 * Namespace with Gesture utilities.
				 * @class tau.gesture
				 */
				ns.gesture = frameworkNamespace.event.gesture;

			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns, window.tau));
