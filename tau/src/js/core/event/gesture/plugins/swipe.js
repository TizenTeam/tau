/*global ns, window, define */
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
/**
 * #Gesture Plugin: swipe
 * Plugin enables swipe event.
 *
 * @class ns.event.gesture.Swipe
 */
( function ( ns, window, undefined ) {
	"use strict";
    //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
			"../core",
			"../detector"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

				/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.Swipe
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture,
				/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Swipe
				 * @private
				 * @static
				 */
				Detector = ns.event.gesture.Detector;

			ns.event.gesture.Swipe = Detector.plugin.create({
				/**
				 * Gesture name
				 * @property {string} [name="swipe"]
				 * @member ns.event.gesture.Swipe
				 */
				name: "swipe",

				/**
				 * Gesture Index
				 * @property {number} [index=400]
				 * @member ns.event.gesture.Swipe
				 */
				index: 400,

				/**
				 * Default values for swipe gesture
				 * @property {Object} defaults
				 * @property {number} [defaults.timeThreshold=400]
				 * @property {number} [defaults.velocity=0.6]
				 * @property {ns.event.gesture.HORIZONTAL|ns.event.gesture.VERTICAL} [defaults.orientation=ns.event.gesture.HORIZONTAL]
				 * @member ns.event.gesture.Swipe
				 */
				defaults: {
					timeThreshold: 400,
					velocity: 0.6,
					orientation: Gesture.Orientation.HORIZONTAL
				},

				/**
				 * Handler for swipe gesture
				 * @method handler
				 * @param {Event} gestureEvent gesture event
				 * @param {Object} sender event's sender
				 * @param {Object} options options
				 * @return {ns.event.gesture.Result.PENDING|ns.event.gesture.Result.END|ns.event.gesture.Result.FINISHED|ns.event.gesture.Result.BLOCK}
				 * @member ns.event.gesture.Swipe
				 */
				handler: function( gestureEvent, sender, options ) {
					var ge = gestureEvent,
						result = Gesture.Result.PENDING;

					if ( ge.eventType !== Gesture.Event.END ) {
						return result;
					}

					if ( ( ge.deltaTime > options.timeThreshold ) ||
						( options.orientation !== Gesture.utils.getOrientation( ge.direction ) ) ) {
						result = Gesture.Result.FINISHED;
						return result;
					}

					if( ge.velocityX > options.velocity || ge.velocityY > options.velocity ) {
						sender.sendEvent( this.name, gestureEvent );
						result = Gesture.Result.FINISHED | Gesture.Result.BLOCK;
					}

					return result;
				}
			});
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} ( ns, window ) );
