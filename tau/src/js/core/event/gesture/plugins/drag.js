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
 * Gesture Plugin: drag
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

			var Gesture = ns.event.gesture,
				Detector = ns.event.gesture.Detector,
				merge = ns.util.object.merge,
				// TODO UA test will move to support.
				tizenBrowser = !!window.navigator.userAgent.match(/tizen/i);

			ns.event.gesture.Drag = Detector.plugin.create({

				name: "drag",

				index: 500,

				types: ["drag", "dragstart", "dragend", "dragcancel"],

				defaults: {
					blockHorizontal: false,
					blockVertical: false,
					threshold: 10,
					angleThreshold: 20,
					delay: 0
				},

				triggerd: false,

				handler: function( gestureEvent, sender, options ) {
					var ge = gestureEvent,
						threshold = options.threshold,
						angleThreshold = options.angleThreshold,
						result = Gesture.Result.PENDING,
						event = {
							drag: this.types[0],
							start: this.types[1],
							end: this.types[2],
							cancel: this.types[3]
						},
						direction = ge.direction,
						angle = Math.abs(ge.angle);

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

						if ( options.blockHorizontal && ( angle < 90 - angleThreshold || angle > 90 + angleThreshold ) ) {
							return Gesture.Result.FINISHED;
						}

						if ( options.blockVertical && ( angle > 0 + angleThreshold && angle < 180 - angleThreshold ) ) {
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

							result = Gesture.Result.RUNNING;
							if ( !this.triggerd ) {
								sender.sendEvent( event.start, ge );
							}
							sender.sendEvent( event.drag, ge );
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
