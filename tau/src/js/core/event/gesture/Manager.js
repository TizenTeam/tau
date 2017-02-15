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
 * #Gesture.Manager class
 * Main class controls all gestures.
 * @class ns.event.gesture.Manager
 */
(function (ns, window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../gesture",
		"./Detector",
		"./utils",
		"../../util/object"
	],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/**
			 * Local alias for {@link ns.event.gesture}
			 * @property {Object}
			 * @member ns.event.gesture.Manager
			 * @private
			 * @static
			 */
			var gesture = ns.event.gesture,

				/**
				 * Alias for method {@link ns.util.object.merge}
				 * @property {Function} objectMerge
				 * @member ns.event.gesture.Manager
				 * @private
				 * @static
				 */
				utilObject = ns.util.object,

				instance = null,

				touchCheck = /touch/,

				Manager = function () {

					this.instances = [];
					this.gestureDetectors = [];
					this.runningDetectors = [];
					this.detectorRequestedBlock = null;

					this.unregisterBlockList = [];

					this.gestureEvents = {};
					this.velocity = null;

					this._isReadyDetecting = false;
					this._blockMouseEvent = false;
					this.touchSupport = "ontouchstart" in window;
				};

			function sortInstances(a, b) {
				if (a.index < b.index) {
					return -1;
				} else if (a.index > b.index) {
					return 1;
				}
				return 0;
			}

			Manager.prototype = {
					/**
					 * Bind start events
					 * @method _bindStartEvents
					 * @param {ns.event.gesture.Instance} instance gesture instance
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_bindStartEvents: function (instance) {
					var element = instance.getElement();

					if (this.touchSupport) {
						element.addEventListener("touchstart", this, false);
					} else {
						element.addEventListener("mousedown", this, false);
					}
				},

					/**
					 * Bind move, end and cancel events
					 * @method _bindEvents
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_bindEvents: function () {
					if (this.touchSupport) {
						document.addEventListener("touchmove", this);
						document.addEventListener("touchend", this);
						document.addEventListener("touchcancel", this);
					} else {
						document.addEventListener("mousemove", this);
						document.addEventListener("mouseup", this);
					}
				},

					/**
					 * Unbind start events
					 * @method _unbindStartEvents
					 * @param {ns.event.gesture.Instance} instance gesture instance
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_unbindStartEvents: function (instance) {
					var element = instance.getElement();

					if (this.touchSupport) {
						element.removeEventListener("touchstart", this, false);
					} else {
						element.removeEventListener("mousedown", this, false);
					}
				},

					/**
					 * Unbind move, end and cancel events
					 * @method _bindEvents
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_unbindEvents: function () {
					if (this.touchSupport) {
						document.removeEventListener("touchmove", this, false);
						document.removeEventListener("touchend", this, false);
						document.removeEventListener("touchcancel", this, false);
					} else {
						document.removeEventListener("mousemove", this, false);
						document.removeEventListener("mouseup", this, false);
					}
				},

					/**
					 * Handle event
					 * @method handleEvent
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
					/* jshint -W086 */
				handleEvent: function (event) {
					var eventType = event.type;

					if (eventType.match(touchCheck)) {
						this._blockMouseEvent = true;
					} else {
						if (this._blockMouseEvent || event.which !== 1) {
							return;
						}
					}

					switch (eventType) {
						case "mousedown":
						case "touchstart":
							this._start(event);
							break;
						case "mousemove":
						case "touchmove":
							this._move(event);
							break;
						case "mouseup":
						case "touchend":
							this._end(event);
							break;
						case "touchcancel":
							this._cancel(event);
							break;
					}
				},

					/**
					 * Handler for gesture start
					 * @method _start
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_start: function (event) {
					var element = event.currentTarget,
						startEvent = {},
						detectors = [];

					if (!this._isReadyDetecting) {
						this._resetDetecting();
						this._bindEvents();

						startEvent = this._createDefaultEventData(gesture.Event.START, event);

						this.gestureEvents = {
							start: startEvent,
							last: startEvent
						};

						this.velocity = {
							event: startEvent,
							x: 0,
							y: 0
						};

						startEvent = utilObject.fastMerge(startEvent, this._createGestureEvent(gesture.Event.START, event));
						this._isReadyDetecting = true;
					}

					this.instances.forEach(function (instance) {
						if (instance.getElement() === element) {
							detectors = detectors.concat(instance.getGestureDetectors());
						}
					}, this);

					detectors.sort(sortInstances);

					this.gestureDetectors = this.gestureDetectors.concat(detectors);

					this._detect(detectors, startEvent);
				},

					/**
					 * Handler for gesture move
					 * @method _move
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_move: function (event) {
					var newEvent = null;

					if (this._isReadyDetecting) {
						newEvent = this._createGestureEvent(gesture.Event.MOVE, event);
						this._detect(this.gestureDetectors, newEvent);
						this.gestureEvents.last = newEvent;
					}
				},

					/**
					 * Handler for gesture end
					 * @method _end
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_end: function (event) {
					var newEvent = utilObject.merge(
							{},
						this.gestureEvents.last,
						this._createDefaultEventData(gesture.Event.END, event)
						);

					if (newEvent.pointers.length === 0) {
						this._detect(this.gestureDetectors, newEvent);

						this.unregisterBlockList.forEach(function (instance) {
							this.unregister(instance);
						}, this);

						this._resetDetecting();
						this._blockMouseEvent = false;
					}
				},

					/**
					 * Handler for gesture cancel
					 * @method _cancel
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_cancel: function (event) {

					event = utilObject.merge(
							{},
						this.gestureEvents.last,
						this._createDefaultEventData(gesture.Event.CANCEL, event)
						);

					this._detect(this.gestureDetectors, event);

					this.unregisterBlockList.forEach(function (instance) {
						this.unregister(instance);
					}, this);

					this._resetDetecting();
					this._blockMouseEvent = false;
				},

					/**
					 * Detect gesture
					 * @method _detect
					 * @param {Array} detectors
					 * @param {Event} event
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_detect: function (detectors, event) {
					var finishedDetectors = [];

					detectors.forEach(function (detector) {
						var result;

						if (!this.detectorRequestedBlock) {
							result = detector.detect(event);
							if (result & gesture.Result.RUNNING) {
								if (this.runningDetectors.indexOf(detector) < 0) {
									this.runningDetectors.push(detector);
								}
							}

							if (result & gesture.Result.FINISHED) {
								finishedDetectors.push(detector);
							}

							if (result & gesture.Result.BLOCK) {
								this.detectorRequestedBlock = detector;
							}
						}
					}, this);

						// remove finished detectors.
					finishedDetectors.forEach(function (detector) {
						var idx;

						idx = this.gestureDetectors.indexOf(detector);
						if (idx > -1) {
							this.gestureDetectors.splice(idx, 1);
						}

						idx = this.runningDetectors.indexOf(detector);
						if (idx > -1) {
							this.runningDetectors.splice(idx, 1);
						}
					}, this);

						// remove all detectors except the detector that return block result
					if (this.detectorRequestedBlock) {
							// send to cancel event.
						this.runningDetectors.forEach(function (detector) {
							var cancelEvent = utilObject.fastMerge({}, event);

							cancelEvent.eventType = gesture.Event.BLOCKED;

							detector.detect(cancelEvent);
						});
						this.runningDetectors.length = 0;

							// remove all detectors.
						this.gestureDetectors.length = 0;
						if (finishedDetectors.indexOf(this.detectorRequestedBlock) < 0) {
							this.gestureDetectors.push(this.detectorRequestedBlock);
						}
					}
				},

					/**
					 * Reset of gesture manager detector
					 * @method _resetDetecting
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_resetDetecting: function () {
					this._isReadyDetecting = false;

					this.gestureDetectors.length = 0;
					this.runningDetectors.length = 0;
					this.detectorRequestedBlock = null;

					this.gestureEvents = {};
					this.velocity = null;

					this._unbindEvents();
				},

					/**
					 * Create default event data
					 * @method _createDefaultEventData
					 * @param {string} type event type
					 * @param {Event} event source event
					 * @return {Object} default event data
					 * @return {string} return.eventType
					 * @return {number} return.timeStamp
					 * @return {Touch} return.pointer
					 * @return {TouchList} return.pointers
					 * @return {Event} return.srcEvent
					 * @return {Function} return.preventDefault
					 * @return {Function} return.stopPropagation
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_createDefaultEventData: function (type, event) {
					var pointers = event.touches ?
								event.touches :
								event.type === "mouseup" ? [] : (event.identifier = 1 && [event]),
						pointer = pointers[0],
						timeStamp = Date.now();

					return {
						eventType: type,
						timeStamp: timeStamp,
						pointer: pointer,
						pointers: pointers,

						srcEvent: event,
						preventDefault: event.preventDefault.bind(event),
						stopPropagation: event.stopPropagation.bind(event)
					};
				},

					/**
					 * Create gesture event
					 * @method _createGestureEvent
					 * @param {string} type event type
					 * @param {Event} event source event
					 * @return {Object} gesture event consist from Event class and additional properties
					 * @return {number} return.deltaTime
					 * @return {number} return.deltaX
					 * @return {number} return.deltaY
					 * @return {number} return.velocityX
					 * @return {number} return.velocityY
					 * @return {number} return.estimatedX
					 * @return {number} return.estimatedY
					 * @return {number} return.estimatedDeltaX
					 * @return {number} return.estimatedDeltaY
					 * @return {number} return.distance
					 * @return {number} return.angle
					 * @return {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} return.direction
					 * @return {number} return.scale
					 * @return {number} return.rotation (deg)
					 * @return {Event} return.startEvent
					 * @return {Event} return.lastEvent
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_createGestureEvent: function (type, event) {
					var ev = this._createDefaultEventData(type, event),
						startEvent = this.gestureEvents.start,
						lastEvent = this.gestureEvents.last,
						velocity = this.velocity,
						velocityEvent = velocity.event,
						delta = {
							time: ev.timeStamp - startEvent.timeStamp,
							x: ev.pointer.clientX - startEvent.pointer.clientX,
							y: ev.pointer.clientY - startEvent.pointer.clientY
						},
						deltaFromLast = {
							x: ev.pointer.clientX - lastEvent.pointer.clientX,
							y: ev.pointer.clientY - lastEvent.pointer.clientY
						},
						timeDifference = gesture.defaults.estimatedPointerTimeDifference, /* pause time threshold.util. tune the number to up if it is slow */
						estimated;

						// reset start event for multi touch
					if (startEvent && ev.pointers.length !== startEvent.pointers.length) {
						startEvent.pointers = Array.prototype.slice.call(ev.pointers);
					}

					if (ev.timeStamp - velocityEvent.timeStamp > gesture.defaults.updateVelocityInterval) {
						utilObject.fastMerge(velocity, gesture.utils.getVelocity(
							ev.timeStamp - velocityEvent.timeStamp,
							ev.pointer.clientX - velocityEvent.pointer.clientX,
							ev.pointer.clientY - velocityEvent.pointer.clientY
						));
						velocity.event = ev;
					}

					estimated = {
						x: Math.round(ev.pointer.clientX + (timeDifference * velocity.x * (deltaFromLast.x < 0 ? -1 : 1))),
						y: Math.round(ev.pointer.clientY + (timeDifference * velocity.y * (deltaFromLast.y < 0 ? -1 : 1)))
					};

						// Prevent that point goes back even though direction is not changed.
					if ((deltaFromLast.x < 0 && estimated.x > lastEvent.estimatedX) ||
							(deltaFromLast.x > 0 && estimated.x < lastEvent.estimatedX)) {
						estimated.x = lastEvent.estimatedX;
					}

					if ((deltaFromLast.y < 0 && estimated.y > lastEvent.estimatedY) ||
							(deltaFromLast.y > 0 && estimated.y < lastEvent.estimatedY)) {
						estimated.y = lastEvent.estimatedY;
					}

					utilObject.fastMerge(ev, {
						deltaTime: delta.time,
						deltaX: delta.x,
						deltaY: delta.y,

						velocityX: velocity.x,
						velocityY: velocity.y,

						estimatedX: estimated.x,
						estimatedY: estimated.y,
						estimatedDeltaX: estimated.x - startEvent.pointer.clientX,
						estimatedDeltaY: estimated.y - startEvent.pointer.clientY,

						distance: gesture.utils.getDistance(startEvent.pointer, ev.pointer),

						angle: gesture.utils.getAngle(startEvent.pointer, ev.pointer),

						direction: gesture.utils.getDirection(startEvent.pointer, ev.pointer),

						scale: gesture.utils.getScale(startEvent.pointers, ev.pointers),
						rotation: gesture.utils.getRotation(startEvent.pointers, ev.pointers),

						startEvent: startEvent,
						lastEvent: lastEvent
					});

					return ev;
				},

					/**
					 * Register instance of gesture
					 * @method register
					 * @param {ns.event.gesture.Instance} instance gesture instance
					 * @member ns.event.gesture.Manager
					 */
				register: function (instance) {
					var idx = this.instances.indexOf(instance);

					if (idx < 0) {
						this.instances.push(instance);
						this._bindStartEvents(instance);
					}
				},

					/**
					 * Unregister instance of gesture
					 * @method unregister
					 * @param {ns.event.gesture.Instance} instance gesture instance
					 * @member ns.event.gesture.Manager
					 */
				unregister: function (instance) {
					var idx;

					if (this.gestureDetectors.length) {
						this.unregisterBlockList.push(instance);
					} else {
						idx = this.instances.indexOf(instance);
						if (idx > -1) {
							this.instances.splice(idx, 1);
							this._unbindStartEvents(instance);
						}

						if (!this.instances.length) {
							this._destroy();
						}
					}
				},

					/**
					 * Destroy instance of Manager
					 * @method _destroy
					 * @member ns.event.gesture.Manager
					 * @protected
					 */
				_destroy: function () {
					this._resetDetecting();

					this.instances.length = 0;
					this.unregisterBlockList.length = 0;

					this._blockMouseEvent = false;
					instance = null;
				}

			};

			Manager.getInstance = function () {
				if (!instance) {
					instance = new Manager();
				}
				return instance;
			};

			gesture.Manager = Manager;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Manager;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns, window, window.document));
