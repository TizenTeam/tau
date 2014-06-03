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
 */
(function ( ns, window, undefined ) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var Gesture = function( elem, options ) {
				return new ns.event.gesture.Instance( elem, options );
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

			ns.event.gesture = Gesture;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} ( ns, window ) );
