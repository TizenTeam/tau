/*global ns, window, define */
/*jslint nomen: true */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Gesture Utilities
 * Contains helper function to gesture support.
 * @class ns.event.gesture.utils
 */
(function (ns, Math, undefined) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(["./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

				/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.utils
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture;

			Gesture.utils = {

				/**
				 * Get center from array of touches
				 * @method getCenter
				 * @param {Event[]} touches description
				 * @member ns.event.gesture.utils
				 * @return {Object} position
				 * @return {number} return.clientX position X
				 * @return {number} return.clientY position Y
				 */
				getCenter: function (touches) {
					var valuesX = [], valuesY = [];

					[].forEach.call(touches, function(touch) {
						// I prefer clientX because it ignore the scrolling position
						valuesX.push(!isNaN(touch.clientX) ? touch.clientX : touch.pageX);
						valuesY.push(!isNaN(touch.clientY) ? touch.clientY : touch.pageY);
					});

					return {
						clientX: (Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2,
						clientY: (Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2
					};
				},

				/**
				 * Get velocity
				 * @method getVelocity
				 * @param {number} delta_time Delta of time
				 * @param {number} delta_x Position change on x axis
				 * @param {number} delta_y Position change on y axis
				 * @return {Object} velocity
				 * @return {number} return.x velocity on X axis
				 * @return {number} return.y velocity on Y axis
				 * @member ns.event.gesture.utils
				 */
				getVelocity: function (delta_time, delta_x, delta_y) {
					return {
						x: Math.abs(delta_x / delta_time) || 0,
						y: Math.abs(delta_y / delta_time) || 0
					};
				},

				/**
				 * Get angel between position of two touches
				 * @method getAngle
				 * @param {Event} touch1 first touch
				 * @param {Event} touch2 second touch
				 * @return {number} angel (deg)
				 * @member ns.event.gesture.utils
				 */
				getAngle: function (touch1, touch2) {
					var y = touch2.clientY - touch1.clientY,
						x = touch2.clientX - touch1.clientX;
					return Math.atan2(y, x) * 180 / Math.PI;
				},

				/**
				 * Get direction indicated by position of two touches
				 * @method getDirectiqon
				 * @param {Event} touch1 first touch
				 * @param {Event} touch2 second touch
				 * @return {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN}
				 * @member ns.event.gesture.utils
				 */
				getDirection: function (touch1, touch2) {
					var x = Math.abs(touch1.clientX - touch2.clientX),
						y = Math.abs(touch1.clientY - touch2.clientY);

					if (x >= y) {
						return touch1.clientX - touch2.clientX > 0 ? Gesture.Direction.LEFT : Gesture.Direction.RIGHT;
					}
					return touch1.clientY - touch2.clientY > 0 ? Gesture.Direction.UP : Gesture.Direction.DOWN;
				},

				/**
				 * Get distance indicated by position of two touches
				 * @method getDistance
				 * @param {Event} touch1 first touch
				 * @param {Event} touch2 second touch
				 * @return {number} distance
				 * @member ns.event.gesture.utils
				 */
				getDistance: function (touch1, touch2) {
					var x = touch2.clientX - touch1.clientX,
						y = touch2.clientY - touch1.clientY;
					return Math.sqrt((x * x) + (y * y));
				},

				/**
				 * Get scale indicated by position of the first and the last touch
				 * @method getScale
				 * @param {Event} start start touch
				 * @param {Event} end end touch
				 * @return {number} scale
				 * @member ns.event.gesture.utils
				 */
				getScale: function (start, end) {
					// need two fingers...
					if (start.length >= 2 && end.length >= 2) {
						return this.getDistance(end[0], end[1]) / this.getDistance(start[0], start[1]);
					}
					return 1;
				},

				/**
				 * Get value of rotation indicated by position
				 * of the first and the last touch
				 * @method getRotation
				 * @param {Event} start start touch
				 * @param {Event} end end touch
				 * @return {number} angle (deg)
				 * @member ns.event.gesture.utils
				 */
				getRotation: function (start, end) {
					// need two fingers
					if (start.length >= 2 && end.length >= 2) {
						return this.getAngle(end[1], end[0]) -
							this.getAngle(start[1], start[0]);
					}
					return 0;
				},

				/**
				 * Check if the direction is vertical
				 * @method isVertical
				 * @param {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} direction start touch
				 * @return {boolean}
				 * @member ns.event.gesture.utils
				 */
				isVertical: function (direction) {
					return direction === Gesture.Direction.UP || direction === Gesture.Direction.DOWN;
				},

				/**
				 * Check if the direction is horizontal
				 * @method isHorizontal
				 * @param {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} direction start touch
				 * @return {boolean}
				 * @member ns.event.gesture.utils
				 */
				isHorizontal: function (direction) {
					return direction === Gesture.Direction.LEFT || direction === Gesture.Direction.RIGHT;
				},

				/**
				 * Check if the direction is horizontal
				 * @method getOrientation
				 * @param {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} direction
				 * @return {boolean}
				 * @member ns.event.gesture.utils
				 */
				getOrientation: function (direction) {
					return this.isVertical(direction) ? Gesture.Orientation.VERTICAL : Gesture.Orientation.HORIZONTAL;
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} (ns, window.Math));
