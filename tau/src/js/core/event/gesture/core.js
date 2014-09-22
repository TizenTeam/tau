/*global ns, window, define */
/*jslint nomen: true */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Gesture Namespace
 * Core object enables multi gesture support.
 *
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
				VERTICAL: "vertical",
				HORIZONTAL: "horizontal"
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
				UP: "up",
				DOWN: "down",
				LEFT: "left",
				RIGHT: "right"
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
			 * @property {number} [Result.PENDING=1] is pending
			 * @property {number} [Result.RUNNING=2] is running
			 * @property {number} [Result.FINISHED=4] is finished
			 * @property {number} [Result.BLOCK=8] is blocked
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
			 * @param {HTMLElement} eventSender
			 * @param {Object} options
			 * @return {ns.event.gesture.Gesture}
			 * @member ns.event.gesture
			 * @static
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
