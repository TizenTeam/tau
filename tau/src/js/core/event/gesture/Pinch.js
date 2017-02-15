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
 * # Gesture Plugin: pinch
 * Plugin enables pinch event.
 *
 * @class ns.event.gesture.Pinch
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../gesture",
		"./Detector"
	],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/**
			 * Local alias for {@link ns.event.gesture}
			 * @property {Object}
			 * @member ns.event.gesture.Pinch
			 * @private
			 * @static
			 */
			var Gesture = ns.event.gesture,
				/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Pinch
				 * @private
				 * @static
				 */
				Detector = ns.event.gesture.Detector;

			ns.event.gesture.Pinch = Detector.plugin.create({
				/**
				 * Gesture name
				 * @property {string} [name="pinch"]
				 * @member ns.event.gesture.Pinch
				 */
				name: "pinch",

				/**
				 * Gesture Index
				 * @property {number} [index=300]
				 * @member ns.event.gesture.Pinch
				 */
				index: 300,

				/**
				 * Array of posible pinch events
				 * @property {string[]} types
				 * @member ns.event.gesture.Pinch
				 */
				types: ["pinchstart", "pinchmove", "pinchend", "pinchcancel", "pinchin", "pinchout"],

				/**
				 * Default values for pinch gesture
				 * @property {Object} defaults
				 * @property {number} [defaults.velocity=0.6]
				 * @property {number} [defaults.timeThreshold=400]
				 * @member ns.event.gesture.Pinch
				 */
				defaults: {
					velocity: 0.6,
					timeThreshold: 400
				},

				/**
				 * Triggered
				 * @property {boolean} [triggerd=false]
				 * @member ns.event.gesture.Pinch
				 */
				triggerd: false,

				/**
				 * Handler for pinch gesture
				 * @method handler
				 * @param {Event} gestureEvent gesture event
				 * @param {Object} sender event's sender
				 * @param {Object} options options
				 * @return {ns.event.gesture.Result.PENDING|ns.event.gesture.Result.END|ns.event.gesture.Result.FINISHED|ns.event.gesture.Result.BLOCK}
				 * @member ns.event.gesture.Pinch
				 */
				handler: function (gestureEvent, sender, options) {
					var ge = gestureEvent,
						result = Gesture.Result.PENDING,
						event = {
							start: this.types[0],
							move: this.types[1],
							end: this.types[2],
							cancel: this.types[3],
							in: this.types[4],
							out: this.types[5]
						};

					switch (ge.eventType) {
						case Gesture.Event.MOVE:
							if (ge.pointers.length === 1 && ge.distance > 35) {
								result = Gesture.Result.FINISHED;
								return result;
							} else if (!this.triggerd && ge.pointers.length >= 2) {
								this.triggerd = true;
								sender.sendEvent(event.start, ge);
								ge.preventDefault();
								result = Gesture.Result.RUNNING;
							} else if (this.triggerd) {
								if ((ge.deltaTime < options.timeThreshold) &&
									(ge.velocityX > options.velocity || ge.velocityY > options.velocity)) {
									if (ge.scale < 1) {
										sender.sendEvent(event.in, gestureEvent);
									} else {
										sender.sendEvent(event.out, gestureEvent);
									}
									ge.preventDefault();
									this.triggerd = false;
									result = Gesture.Result.FINISHED | Gesture.Result.BLOCK;
									return result;
								} else {
									sender.sendEvent(event.move, ge);
									ge.preventDefault();
									result = Gesture.Result.RUNNING;
								}
							}
							break;
						case Gesture.Event.BLOCKED:
						case Gesture.Event.END:
							if (this.triggerd) {
								sender.sendEvent(event.end, ge);
								ge.preventDefault();
								this.triggerd = false;
								result = Gesture.Result.FINISHED;
							}
							break;
						case Gesture.Event.CANCEL:
							if (this.triggerd) {
								sender.sendEvent(event.cancel, ge);
								ge.preventDefault();
								this.triggerd = false;
								result = Gesture.Result.FINISHED;
							}
							break;
					}
					return result;
				}
			});
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
