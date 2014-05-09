/*global ns, window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Gesture class with events functions
 */
(function ( ns, window, undefined ) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var Gesture = function( elem, options ) {
				return new ns.events.gesture.Instance( elem, options );
			};

			Gesture.defaults = {

				triggerEvent: false,

				// interval in which Gesture recalculates current velocity in ms
				updateVelocityInterval: 16,

				// pause time threshold.. tune the number to up if it is slow
				estimatedPointerTimeDifference: 15
			};

			Gesture.Orientation = {
				VERTICAL: 1,
				HORIZONTAL: 2
			};

			Gesture.Direction = {
				UP: 1,
				DOWN: 2,
				LEFT: 3,
				RIGHT: 4
			};

			Gesture.Event = {
				START: "start",
				MOVE: "move",
				END: "end",
				CANCEL: "cancel",
				BLOCKED: "blocked"
			};

			Gesture.Result = {
				PENDING: 1,
				RUNNING: 2,
				FINISHED: 4,
				BLOCK: 8
			};

			// define plugin namespace.
			Gesture.plugin = {};

			Gesture.createDetector = function( gesture, eventSender, options ) {
				if ( !Gesture.plugin[gesture] ) {
					throw gesture + " gesture is not supported";
				}

				return new Gesture.plugin[gesture]( eventSender, options );
			};

			ns.events.gesture = Gesture;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} ( ns, window ) );
