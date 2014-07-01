/*global ns, window, define */
/*jslint nomen: true */
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
/**
 * Gesture class with events functions
 * @class ns.event.gesture
 */
(function ( ns, window, undefined ) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		'../gesture'
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var Gesture = function( elem, options ) {
				return new ns.event.gesture.Instance( elem, options );
			};

			/**
			 * Default values for Gesture feature
			 * @property {Object} defaults
			 * @property {boolean} [defaults.triggerEvent=false]
			 * @property {number} [defaults.updateVelocityInterval=16]
			 * Interval in which Gesture recalculates current velocity in ms
			 * @property {number} [defaults.estimatedPointerTimeDifference=15]
			 * pause time threshold.. tune the number to up if it is slow
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.defaults = {
				triggerEvent: false,
				updateVelocityInterval: 16,
				estimatedPointerTimeDifference: 15
			};

			/**
			 * Dictionary of orientation
			 * @property {Object} Orientation
			 * @property {1} Orientation.VERTICAL vertical orientation
			 * @property {2} Orientation.HORIZONTAL horizontal orientation
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.Orientation = {
				VERTICAL: 1,
				HORIZONTAL: 2
			};

			/**
			 * Dictionary of direction
			 * @property {Object} Direction
			 * @property {1} Direction.UP up
			 * @property {2} Direction.DOWN down
			 * @property {3} Direction.LEFT left
			 * @property {4} Direction.RIGHT right
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.Direction = {
				UP: 1,
				DOWN: 2,
				LEFT: 3,
				RIGHT: 4
			};

			/**
			 * Dictionary of gesture events state
			 * @property {Object} Event
			 * @property {"start"} Event.START start
			 * @property {"move"} Event.MOVE move
			 * @property {"end"} Event.END end
			 * @property {"cancel"} Event.CANCEL cancel
			 * @property {"blocked"} Event.BLOCKED blocked
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.Event = {
				START: "start",
				MOVE: "move",
				END: "end",
				CANCEL: "cancel",
				BLOCKED: "blocked"
			};

			/**
			 * Dictionary of gesture events flags
			 * @property {Object} Result
			 * @property {1} Result.PENDING is pending
			 * @property {2} Result.RUNNING is running
			 * @property {4} Result.FINISHED is finished
			 * @property {8} Result.BLOCK is blocked
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.Result = {
				PENDING: 1,
				RUNNING: 2,
				FINISHED: 4,
				BLOCK: 8
			};

			/**
			 * Create plugin namespace.
			 * @property {Object} plugin
			 * @member ns.event.gesture
			 * @static
			 */
			Gesture.plugin = {};

			/**
			 * Create object of Detector
			 * @method createDetector
			 * @param {string} gesture
			 * @param {HTMLElement} element
			 * @param {Object} options
			 * @return {ns.event.gesture.Gesture}
			 * @member ns.event.gesture
			 * @static
			 * @throws {string}
			 * The methods throws exception when given gesture is not supported
			 */
			Gesture.createDetector = function( gesture, eventSender, options ) {
				if ( !Gesture.plugin[gesture] ) {
					throw gesture + " gesture is not supported";
				}
				return new Gesture.plugin[gesture]( eventSender, options );
			};

			ns.event.gesture = Gesture;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} ( ns, window ) );
