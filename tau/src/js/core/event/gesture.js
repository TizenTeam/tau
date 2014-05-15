/*global window, define, CustomEvent */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Gesture namespace
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
			var GESTURE_ElEMENT_DATA_KEY = "gestureElementDataKey",
				instances = [],
				gesture = ns.event.gesture || {},
				Gesture = gesture.Gesture;

			function findInstance(element) {
				var instance;
				instances.forEach(function(item) {
					if (item.element === element) {
						instance = item.instance;
					}
				});
				return instance;
			}

			function removeInstance(element) {
				var instance;
				instances.forEach(function(item, key) {
					if (item.element === element) {
						instances.splice(key, 1);
					}
				});
			}

			ns.event.enableGesture = function(/* element, gesture object ... */) {
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

			ns.event.disableGesture = function(/* element, gesture object ... */) {
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
