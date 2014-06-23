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
 * Gesture.Manager class
 */
( function ( ns, window, undefined ) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(["./core",
			"./instance",
			"./detector",
			"../../util/object"
		],
		function() {
			//>>excludeEnd("tauBuildExclude");

			var Gesture = ns.event.gesture,
				objectMerge = ns.util.object.merge,
				TOUCH_DEVICE = "ontouchstart" in window;

			Gesture.Manager = (function() {
				var instance = null,


				isReadyDetecting = false,
				blockMouseEvent = false,

				Manager = function() {


					this.instances = [];
					this.gestureDetectors = [];
					this.runningDetectors = [];
					this.detectorRequestedBlock = null;

					this.unregisterBlockList = [];

					this.gestureEvents = null;
					this.velocity = null;

				};

				Manager.prototype = {

					_bindStartEvents: function( instance ) {
						var element = instance.getElement();
						if ( TOUCH_DEVICE ) {
							element.addEventListener( "touchstart", this);
						}

						element.addEventListener( "mousedown", this);
					},

					_bindEvents: function( ) {
						if ( TOUCH_DEVICE ) {
							document.addEventListener( "touchmove", this);
							document.addEventListener( "touchend", this);
							document.addEventListener( "touchcancel", this);
						}

						document.addEventListener( "mousemove", this);
						document.addEventListener( "mouseup", this);
					},

					_unbindStartEvents: function( instance ) {
						var element = instance.getElement();
						if ( TOUCH_DEVICE ) {
							element.removeEventListener( "touchstart", this);
						}

						element.removeEventListener( "mousedown", this);
					},

					_unbindEvents: function() {
						if ( TOUCH_DEVICE ) {
							document.removeEventListener( "touchmove", this);
							document.removeEventListener( "touchend", this);
							document.removeEventListener( "touchcancel", this);
						}

						document.removeEventListener( "mousemove", this);
						document.removeEventListener( "mouseup", this);
					},

					/* jshint -W086 */
					handleEvent: function( event ) {
						var eventType = event.type.toLowerCase();

						if ( eventType.match(/touch/) ) {
							blockMouseEvent = true;
						}

						if ( eventType.match(/mouse/) &&
							( blockMouseEvent || event.which !== 1 ) ) {
							return;
						}

						switch ( event.type ) {
							case "mousedown":
							case "touchstart":
								this._start( event );
								break;
							case "mousemove":
							case "touchmove":
								this._move( event );
								break;
							case "mouseup":
							case "touchend":
								this._end( event );
								break;
							case "touchcancel":
								this._cancel( event );
								break;
						}
					},

					_start: function( event ) {
						var elem = event.currentTarget,
							startEvent, detectors = [];

						if ( !isReadyDetecting ) {
							this._resetDetecting();
							this._bindEvents();

							startEvent = this._createDefaultEventData( Gesture.Event.START, event );

							this.gestureEvents = {
								start: startEvent,
								last: startEvent
							};

							this.velocity = {
								event: startEvent,
								x: 0,
								y: 0
							};
						}

						isReadyDetecting = true;

						startEvent = objectMerge(startEvent, this._createGestureEvent(Gesture.Event.START, event));

						this.instances.forEach(function( instance ) {
							if ( instance.getElement() === elem ) {
								detectors = detectors.concat( instance.getGestureDetectors() );
							}
						}, this);

						detectors.sort(function(a, b) {
							if(a.index < b.index) {
								return -1;
							} else if(a.index > b.index) {
								return 1;
							}
							return 0;
						});

						this.gestureDetectors = this.gestureDetectors.concat( detectors );

						this._detect(detectors, startEvent);
					},

					_move: function( event ) {
						if ( !isReadyDetecting ) {
							return;
						}

						event = this._createGestureEvent(Gesture.Event.MOVE, event);
						this._detect(this.gestureDetectors, event);

						this.gestureEvents.last = event;
					},

					_end: function( event ) {

						event = objectMerge(
							{},
							this.gestureEvents.last,
							this._createDefaultEventData(Gesture.Event.END, event)
						);

						if ( event.pointers.length > 0 ) {
							return;
						}

						this._detect(this.gestureDetectors, event);

						this.unregisterBlockList.forEach(function( instance ) {
							this.unregist( instance );
						}, this);

						this._resetDetecting();
						blockMouseEvent = false;
					},

					_cancel: function( event ) {

						event = objectMerge(
							{},
							this.gestureEvents.last,
							this._createDefaultEventData(Gesture.Event.CANCEL, event)
						);

						this._detect(this.gestureDetectors, event);

						this.unregisterBlockList.forEach(function( instance ) {
							this.unregist( instance );
						}, this);

						this._resetDetecting();
						blockMouseEvent = false;
					},

					_detect: function( detectors, event ) {
						var finishedDetectors = [];

						detectors.forEach(function( detector ) {
							var result;

							if ( this.detectorRequestedBlock ) {
								return;
							}

							result = detector.detect( event );
							if ( result & Gesture.Result.RUNNING ) {
								if ( this.runningDetectors.indexOf( detector ) < 0 ) {
									this.runningDetectors.push( detector );
								}
							}

							if ( result & Gesture.Result.FINISHED ) {
								finishedDetectors.push( detector );
							}

							if ( result & Gesture.Result.BLOCK ) {
								this.detectorRequestedBlock = detector;
							}

						}, this);

						// remove finished detectors.
						finishedDetectors.forEach(function( detector ) {
							var idx;

							idx = this.gestureDetectors.indexOf( detector );
							if ( idx > -1 ) {
								this.gestureDetectors.splice(idx, 1);
							}

							idx = this.runningDetectors.indexOf( detector );
							if ( idx > -1 ) {
								this.runningDetectors.splice(idx, 1);
							}
						}, this);

						// remove all detectors except the detector that return block result
						if ( this.detectorRequestedBlock ) {
							// send to cancel event.
							this.runningDetectors.forEach(function( detector ) {
								var cancelEvent = objectMerge({}, event, {
									eventType: Gesture.Event.BLOCKED
								});
								detector.detect( cancelEvent );
							});
							this.runningDetectors.length = 0;

							// remove all detectors.
							this.gestureDetectors.length = 0;
							if ( finishedDetectors.indexOf( this.detectorRequestedBlock ) < 0 ) {
								this.gestureDetectors.push( this.detectorRequestedBlock );
							}
						}
					},

					_resetDetecting: function() {
						isReadyDetecting = false;

						this.gestureDetectors.length = 0;
						this.runningDetectors.length = 0;
						this.detectorRequestedBlock = null;

						this.gestureEvents = null;
						this.velocity = null;

						this._unbindEvents();
					},

					_createDefaultEventData: function( type, event ) {
						var pointers = event.touches ?
								event.touches :
									event.type === "mouseup" ? [] : ( event.identifier=1 && [event] ),
							pointer = pointers[0],
							timeStamp = new Date().getTime();

						return {
							eventType: type,
							timeStamp: timeStamp,
							pointer: pointer,
							pointers: pointers,

							srcEvent: event,
							preventDefault: function() {
								this.srcEvent.preventDefault();
							},
							stopPropagation: function() {
								this.srcEvent.stopPropagation();
							}
						};
					},

					_createGestureEvent: function( type, event ) {
						var ev = this._createDefaultEventData( type, event ),
							startEvent = this.gestureEvents.start,
							lastEvent = this.gestureEvents.last,
							velocityEvent = this.velocity.event,
							delta = {
								time: ev.timeStamp - startEvent.timeStamp,
								x: ev.pointer.clientX - startEvent.pointer.clientX,
								y: ev.pointer.clientY - startEvent.pointer.clientY
							},
							deltaFromLast = {
								x: ev.pointer.clientX - lastEvent.pointer.clientX,
								y: ev.pointer.clientY - lastEvent.pointer.clientY
							},
							velocity = this.velocity,
							timeDifference = Gesture.defaults.estimatedPointerTimeDifference, /* pause time threshold.util. tune the number to up if it is slow */
							estimated;

						// reset start event for multi touch
						if( startEvent && ev.pointers.length !== startEvent.pointers.length ) {
							startEvent.pointers = [];
							[].forEach.call(ev.pointers, function( pointer ) {
								startEvent.pointers.push( objectMerge({}, pointer) );
							});
						}

						if ( ev.timeStamp - velocityEvent.timeStamp > Gesture.defaults.updateVelocityInterval ) {
							velocity = Gesture.utils.getVelocity(
									ev.timeStamp - velocityEvent.timeStamp,
									ev.pointer.clientX - velocityEvent.pointer.clientX,
									ev.pointer.clientY - velocityEvent.pointer.clientY
							);

							objectMerge(this.velocity, velocity, {
								event: ev
							});
						}

						estimated = {
							x: Math.round( ev.pointer.clientX + ( timeDifference * velocity.x * (deltaFromLast.x < 0 ? -1 : 1) ) ),
							y: Math.round( ev.pointer.clientY + ( timeDifference * velocity.y * (deltaFromLast.y < 0 ? -1 : 1) ) )
						};

						// Prevent that point goes back even though direction is not changed.
						if ( (deltaFromLast.x < 0 && estimated.x > lastEvent.estimatedX) ||
							(deltaFromLast.x > 0 && estimated.x < lastEvent.estimatedX) ) {
							estimated.x = lastEvent.estimatedX;
						}

						if ( (deltaFromLast.y < 0 && estimated.y > lastEvent.estimatedY) ||
							(deltaFromLast.y > 0 && estimated.y < lastEvent.estimatedY) ) {
							estimated.y = lastEvent.estimatedY;
						}

						objectMerge(ev, {
							deltaTime: delta.time,
							deltaX: delta.x,
							deltaY: delta.y,

							velocityX: velocity.x,
							velocityY: velocity.y,

							estimatedX: estimated.x,
							estimatedY: estimated.y,
							estimatedDeltaX: estimated.x - startEvent.pointer.clientX,
							estimatedDeltaY: estimated.y - startEvent.pointer.clientY,

							distance: Gesture.utils.getDistance(startEvent.pointer, ev.pointer),

							angle: Gesture.utils.getAngle(startEvent.pointer, ev.pointer),

							direction: Gesture.utils.getDirection(startEvent.pointer, ev.pointer),

							scale: Gesture.utils.getScale(startEvent.pointers, ev.pointers),
							rotation: Gesture.utils.getRotation(startEvent.pointers, ev.pointers),

							startEvent: startEvent,
							lastEvent: lastEvent
						});

						return ev;
					},

					register: function( instance ) {
						var idx = this.instances.indexOf( instance );
						if ( idx < 0 ) {
							this.instances.push( instance );
							this._bindStartEvents( instance );
						}
					},

					unregister: function( instance ) {
						var idx;

						if ( !!this.gestureDetectors.length ) {
							this.unregisterBlockList.push( instance );
							return;
						}

						idx = this.instances.indexOf( instance );
						if ( idx > -1 ) {
							this.instances.splice( idx, 1 );
							this._unbindStartEvents( instance );
						}

						if ( !this.instances.length ) {
							this._destroy();
						}
					},

					_destroy: function() {
						this._resetDetecting();

						this.instances.length = 0;
						this.unregisterBlockList.length = 0;

						blockMouseEvent = false;
						instance = null;
					}

				};

				return {
					getInstance: function() {
						return instance ? instance : ( instance = new Manager() );
					}
				};
			})();
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} ( ns, window ) );
