/*global window, define, CustomEvent */
/*jslint nomen: true */
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
/*
 * @class ns.event.gesture
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
				"../event",
				"./gesture/core",
				"./gesture/utils",
				"./gesture/instance",
				"./gesture/manager",
				"./gesture/plugins/drag",
				"./gesture/plugins/swipe"],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var instances = [],
				gesture = ns.event.gesture || {};

			/**
			 * Find instance by element
			 * @method findInstance
			 * @param {HTMLElement} element
			 * @return {ns.event.gesture.Instance}
			 * @member ns.event
			 * @static
			 * @private
			 */
			function findInstance(element) {
				var instance;
				instances.forEach(function(item) {
					if (item.element === element) {
						instance = item.instance;
					}
				});
				return instance;
			}

			/**
			 * Remove instance from instances by element
			 * @method removeInstance
			 * @param {HTMLElement} element
			 * @member ns.event
			 * @static
			 * @private
			 */
			function removeInstance(element) {
				instances.forEach(function(item, key) {
					if (item.element === element) {
						instances.splice(key, 1);
					}
				});
			}

			/**
			 * Enable gesture handlingo on given HTML element or object
			 * @method enableGesture
			 * @param {HTMLElement} element
			 * @param {...Object} [gesture] Gesture object {@link ns.event.gesture}
			 * @member ns.event
			 */
			ns.event.enableGesture = function() {
				var element = arguments[0],
					gestureInstance = findInstance( element ),
					length = arguments.length,
					i = 1;

				if ( !gestureInstance ) {
					gestureInstance = new gesture.Instance(element);
					instances.push({element: element, instance: gestureInstance});
				}

				for ( ; i < length; i++ ) {
					gestureInstance.addDetector( arguments[i] );
				}
			};

			/**
			 * Disable gesture handling from given HTML element or object
			 * @method disableGesture
			 * @param {HTMLElement} element
			 * @param {...Object} [gesture] Gesture object {@link ns.event.gesture}
			 * @member ns.event
			 */
			ns.event.disableGesture = function() {
				var element = arguments[0],
					gestureInstance = findInstance( element ),
					length = arguments.length,
					i = 1;

				if ( !gestureInstance ) {
					return;
				}

				if ( length > 1 ) {
					gestureInstance.removeDetector( arguments[i] );
				} else {
					gestureInstance.destroy();
					removeInstance( element );
				}
			};

			ns.event.gesture = gesture;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.gesture;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
