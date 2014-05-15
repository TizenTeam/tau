/*global ns, window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Gesture Utils
 */
( function ( ns, window, undefined ) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(["./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var Gesture = ns.event.gesture;

			Gesture.utils = {

				getCenter: function ( touches ) {
					var valuesX = [], valuesY = [];

					[].forEach.call( touches, function( touch ) {
						// I prefer clientX because it ignore the scrolling position
						valuesX.push( touch.clientX !== undefined ? touch.clientX : touch.clientX );
						valuesY.push( touch.clientY !== undefined ? touch.clientY : touch.clientY );
					} );

					return {
						clientX: ( Math.min.apply(Math, valuesX) + Math.max.apply( Math, valuesX ) ) / 2,
						clientY: ( Math.min.apply(Math, valuesY) + Math.max.apply( Math, valuesY ) ) / 2
					};
				},

				getVelocity: function ( delta_time, delta_x, delta_y ) {
					return {
						x: Math.abs( delta_x / delta_time ) || 0,
						y: Math.abs( delta_y / delta_time ) || 0
					};
				},

				getAngle: function ( touch1, touch2 ) {
					var y = touch2.clientY - touch1.clientY,
						x = touch2.clientX - touch1.clientX;
					return Math.atan2( y, x ) * 180 / Math.PI;
				},

				getDirection: function ( touch1, touch2 ) {
					var x = Math.abs( touch1.clientX - touch2.clientX ),
						y = Math.abs( touch1.clientY - touch2.clientY );

					if(x >= y) {
						return touch1.clientX - touch2.clientX > 0 ? Gesture.Direction.LEFT : Gesture.Direction.RIGHT;
					}
					return touch1.clientY - touch2.clientY > 0 ? Gesture.Direction.UP : Gesture.Direction.DOWN;
				},

				getDistance: function ( touch1, touch2 ) {
					var x = touch2.clientX - touch1.clientX,
						y = touch2.clientY - touch1.clientY;
					return Math.sqrt( (x * x) + (y * y) );
				},

				getScale: function ( start, end ) {
					// need two fingers...
					if ( start.length >= 2 && end.length >= 2 ) {
						return this.getDistance(end[0], end[1]) / this.getDistance(start[0], start[1]);
					}
					return 1;
				},

				getRotation: function ( start, end ) {
					// need two fingers
					if(start.length >= 2 && end.length >= 2) {
						return this.getAngle(end[1], end[0]) -
							this.getAngle(start[1], start[0]);
					}
					return 0;
				},

				isVertical: function ( direction ) {
					return direction === Gesture.Direction.UP || direction === Gesture.Direction.DOWN;
				},

				isHorizontal: function ( direction ) {
					return direction === Gesture.Direction.LEFT || direction === Gesture.Direction.RIGHT;
				},

				getOrientation: function ( direction ) {
					return this.isVertical( direction ) ? Gesture.Orientation.VERTICAL : Gesture.Orientation.HORIZONTAL;
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} ( ns, window ) );