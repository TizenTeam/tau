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
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/engine",
			"../../core/util/path",
			"../../core/util/DOM/attributes",
			"../../core/util/DOM/css",
			"../../core/util/object",
			"../../core/util/selectors",
			"../../core/event",
			"../../core/event/gesture"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			document.addEventListener(ns.engine.eventType.INIT, function () {
				var util = ns.util,
					events = ns.event,
					utilsDOM = util.DOM,
					utilsObject = util.object;
				/**
				 * @class tau.path
				 * @inheritdoc ns.util.path
				 * @extends ns.util.path
				 */
				ns.path = util.path;
				/**
				 * @method fireEvent
				 * @inheritdoc ns.util.events#trigger
				 * @member tau
				 */
				ns.fireEvent = events.trigger.bind(events);
				/**
				 * @method getData
				 * @inheritdoc ns.util.DOM#getData
				 * @member tau
				 */
				ns.getData = utilsDOM.getData.bind(utilsDOM);
				/**
				 * @method extendObject
				 * @inheritdoc ns.util.object#merge
				 * @member tau
				 */
				ns.extendObject = utilsObject.merge.bind(utilsObject);
				/**
				 * @method inherit
				 * @inheritdoc ns.util.object#inherit
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
					 * @inheritdoc ns.util.DOM#getElementOffset
					 * @static
					 * @member tau.dom
					 */
					getOffset: utilsDOM.getElementOffset.bind(utilsDOM),
					/**
					 * @method triggerCustomEvent
					 * @inheritdoc ns.util.events#trigger
					 * @member tau.dom
					 */
					triggerCustomEvent: events.trigger.bind(events),
					/**
					 * @method data
					 * @inheritdoc ns.util.DOM#nsData
					 * @static
					 * @member tau.dom
					 */
					data: utilsDOM.nsData.bind(utilsDOM)
				};

			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
