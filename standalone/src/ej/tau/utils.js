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
			"../tau",
			"../ej/utils/path",
			"../ej/utils/DOM/attributes",
			"../ej/utils/DOM/css",
			"../ej/utils/events",
			"../ej/utils/object",
            "../ej/utils/selectors"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");

			document.addEventListener("mobileinit", function () {
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
				 * @memberOf tau
				 */
				ns.fireEvent = events.trigger.bind(events);
				/**
				 * @method getData
				 * @inheritdoc ns.utils.DOM#getData
				 * @memberOf tau
				 */
				ns.getData = utilsDOM.getData.bind(utilsDOM);
				/**
				 * @method extendObject
				 * @inheritdoc ns.utils.object#multiMerge
				 * @memberOf tau
				 */
				ns.extendObject = utilsObject.multiMerge.bind(utilsObject);
				/**
				 * @method inherit
				 * @inheritdoc ns.utils.object#inherit
				 * @memberOf tau
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
					 * @memberOf tau.dom
					 */
					getOffset: utilsDOM.getElementOffset.bind(utilsDOM),
					/**
					 * @method triggerCustomEvent
					 * @inheritdoc ns.utils.events#trigger
					 * @memberOf tau.dom
					 */
					triggerCustomEvent: events.trigger.bind(events),
					/**
					 * @method data
					 * @inheritdoc ns.utils.DOM#nsData
					 * @static
					 * @memberOf tau.dom
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
			}, false);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, ns, window.tau));
