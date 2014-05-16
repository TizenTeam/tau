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
/*jslint plusplus: true, nomen: true */
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
			"../../core/utils/object",
			"../../core/utils/selectors",
			"../../core/event",
			"../../core/event/gesture"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			document.addEventListener(frameworkNamespace.engine.eventType.INIT, function () {
				var utils = frameworkNamespace.utils,
					events = frameworkNamespace.event,
					utilsDOM = utils.DOM,
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
