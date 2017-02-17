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
			var gesture = ns.event.gesture,
				/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Pinch
				 * @private
				 * @static
				 */
				Result = gesture.Result,

				Detector = ns.event.gesture.Detector,
				eventNames = {
					start: "pinchstart",
					move: "pinchmove",
					end: "pinchend",
					cancel: "pinchcancel",
					in: "pinchin",
					out: "pinchout"
				},

				Pinch = Detector.plugin.create({
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
					 * @property {Object} eventNames
					 * @member ns.event.gesture.Pinch
					 */
					eventNames: eventNames,

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
					 * @property {boolean} [triggered=false]
					 * @member ns.event.gesture.Pinch
					 */
					triggered: false,

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
						var result = Result.PENDING;

						switch (gestureEvent.eventType) {
							case gesture.Event.MOVE:
								if (gestureEvent.pointers.length === 1 && gestureEvent.distance > 35) {
									result = Result.FINISHED;
								} else if (!this.triggered && gestureEvent.pointers.length >= 2) {
									this.triggered = true;
									sender.sendEvent(eventNames.start, gestureEvent);
									gestureEvent.preventDefault();
									result = Result.RUNNING;
								} else if (this.triggered) {
									if ((gestureEvent.deltaTime < options.timeThreshold) &&
										(gestureEvent.velocityX > options.velocity || gestureEvent.velocityY > options.velocity)) {
										if (gestureEvent.scale < 1) {
											sender.sendEvent(eventNames.in, gestureEvent);
										} else {
											sender.sendEvent(eventNames.out, gestureEvent);
										}
										gestureEvent.preventDefault();
										this.triggered = false;
										result = Result.FINISHED | Result.BLOCK;
										return result;
									} else {
										sender.sendEvent(eventNames.move, gestureEvent);
										gestureEvent.preventDefault();
										result = Result.RUNNING;
									}
								}
								break;
							case gesture.Event.BLOCKED:
							case gesture.Event.END:
								if (this.triggered) {
									sender.sendEvent(eventNames.end, gestureEvent);
									gestureEvent.preventDefault();
									this.triggered = false;
									result = Result.FINISHED;
								}
								break;
							case gesture.Event.CANCEL:
								if (this.triggered) {
									sender.sendEvent(eventNames.cancel, gestureEvent);
									gestureEvent.preventDefault();
									this.triggered = false;
									result = Result.FINISHED;
								}
								break;
						}
						return result;
					}
				});

			ns.event.gesture.Pinch = Pinch;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Pinch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
