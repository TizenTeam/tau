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
 * # Gesture Plugin: drag
 * Plugin enables drag event.
 *
 * @class ns.event.gesture.Drag
 */
( function ( ns, window, undefined ) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
			"../core",
			"../detector",
			"../../../util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

				/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.Drag
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture,
				/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Drag
				 * @private
				 * @static
				 */
				Detector = ns.event.gesture.Detector,
				/**
				 * Alias for method {@link ns.util.object.merge}
				 * @property {Function} merge
				 * @member ns.event.gesture.Drag
				 * @private
				 * @static
				 */
				merge = ns.util.object.merge,

				// TODO UA test will move to support.
				tizenBrowser = !!window.navigator.userAgent.match(/tizen/i);

			ns.event.gesture.Drag = Detector.plugin.create({

				/**
				 * Gesture name
				 * @property {string} [name="drag"]
				 * @member ns.event.gesture.Drag
				 */
				name: "drag",

				/**
				 * Gesture Index
				 * @property {number} [index=400]
				 * @member ns.event.gesture.Drag
				 */
				index: 500,

				/**
				 * Array of posible drag events
				 * @property {string[]} types
				 * @member ns.event.gesture.Drag
				 */
				types: ["drag", "dragstart", "dragend", "dragcancel"],

				/**
				 * Default values for drag gesture
				 * @property {Object} defaults
				 * @property {boolean} [defaults.blockHorizontal=false]
				 * @property {boolean} [defaults.blockVertical=false]
				 * @property {number} [defaults.threshold=10]
				 * @property {number} [defaults.delay=0]
				 * @member ns.event.gesture.Drag
				 */
				defaults: {
					blockHorizontal: false,
					blockVertical: false,
					threshold: 20,
					delay: 0
				},

				/**
				 * Triggered
				 * @property {boolean} [triggerd=false]
				 * @member ns.event.gesture.Drag
				 */
				triggerd: false,

				/**
				 * Handler for drag gesture
				 * @method handler
				 * @param {Event} gestureEvent gesture event
				 * @param {Object} sender event's sender
				 * @param {Object} options options
				 * @return {ns.event.gesture.Result.PENDING|ns.event.gesture.Result.END|ns.event.gesture.Result.FINISHED|ns.event.gesture.Result.BLOCK}
				 * @member ns.event.gesture.Drag
				 */
				handler: function( gestureEvent, sender, options ) {
					var ge = gestureEvent,
						threshold = options.threshold,
						result = Gesture.Result.PENDING,
						event = {
							drag: this.types[0],
							start: this.types[1],
							end: this.types[2],
							cancel: this.types[3]
						},
						direction = ge.direction;

					if ( !this.triggerd && ge.eventType === Gesture.Event.MOVE ) {
						if ( Math.abs(ge.deltaX) < threshold && Math.abs(ge.deltaY) < threshold ) {
							if ( !tizenBrowser ) {
								ge.preventDefault();
							}
							return Gesture.Result.PENDING;
						}

						if ( options.delay && ge.deltaTime < options.delay ) {
							if ( !tizenBrowser ) {
								ge.preventDefault();
							}
							return Gesture.Result.PENDING;
						}
						if ( options.blockHorizontal && Gesture.utils.isHorizontal( ge.direction ) ||
							options.blockVertical && Gesture.utils.isVertical( ge.direction ) ) {
							return Gesture.Result.FINISHED;
						}
						this.fixedStartPointX = 0;
						this.fixedStartPointY = 0;
						if ( Gesture.utils.isHorizontal( ge.direction ) ) {
							this.fixedStartPointX = ( ge.deltaX < 0 ? 1 : -1 ) * threshold;
						} else {
							this.fixedStartPointY = ( ge.deltaY < 0 ? 1 : -1 ) * threshold;
						}
					}

					if ( options.blockHorizontal ) {
						direction = ge.deltaY < 0 ? Gesture.Direction.UP : Gesture.Direction.DOWN;
					}

					if ( options.blockVertical ) {
						direction = ge.deltaX < 0 ? Gesture.Direction.LEFT : Gesture.Direction.RIGHT;
					}

					ge = merge({}, ge, {
						deltaX: ge.deltaX + this.fixedStartPointX,
						deltaY: ge.deltaY + this.fixedStartPointY,
						estimatedDeltaX: ge.estimatedDeltaX + this.fixedStartPointX,
						estimatedDeltaY: ge.estimatedDeltaY + this.fixedStartPointY,

						direction: direction
					});

					switch( ge.eventType ) {
						case Gesture.Event.START:
							this.triggerd = false;
							break;
						case Gesture.Event.MOVE:
							if ( !this.triggerd ) {
								sender.sendEvent( event.start, ge );
							}
							result = sender.sendEvent( event.drag, ge ) ? Gesture.Result.RUNNING : Gesture.Result.FINISHED;
							ge.preventDefault();
							this.triggerd = true;
							break;

						case Gesture.Event.BLOCKED:
						case Gesture.Event.END:
							result = Gesture.Result.FINISHED;
							if ( this.triggerd ) {
								sender.sendEvent( event.end, ge );
								ge.preventDefault();
								this.triggerd = false;
							}
							break;

						case Gesture.Event.CANCEL:
							result = Gesture.Result.FINISHED;
							if ( this.triggerd ) {
								sender.sendEvent( event.cancel, ge );
								ge.preventDefault();
								this.triggerd = false;
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
} ( ns, window ) );
