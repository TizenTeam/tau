/*global window, define */
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
 * #Touch events
 * Reimplementation of jQuery Mobile virtual mouse events.
 * @class ns.event.touch
 */
/**
 * Short tap event
 * @event tap
 * @member ns.event.touch
 */
/**
 * Long tap event
 * @event taphold
 * @member ns.event.touch
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../event" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Touch = {
					/**
					 * tap support configuration
					 * @property {Object} tap
					 * @property {number} [tap.tapholdThreshold=750]
					 * @member ns.event.touch
					 * @static
					 */
					tap: {
						tapholdThreshold: 750
					},
					/**
					 * swipe support configuration
					 * @property {Object} swipe
					 * @property {number} [swipe.scrollSupressionThreshold=30]
					 * @property {number} [swipe.durationThreshold=1000]
					 * @property {number} [swipe.horizontalDistanceThreshold=30]
					 * @property {number} [swipe.verticalDistanceThreshold=75]
					 * @member ns.event.touch
					 * @static
					 */
					swipe : {
						scrollSupressionThreshold: 30, // More than this horizontal displacement, and we will suppress scrolling.
						durationThreshold: 1000, // More time than this, and it isn't a swipe.
						horizontalDistanceThreshold: 30,  // Swipe horizontal displacement must be more than this.
						verticalDistanceThreshold: 75  // Swipe vertical displacement must be less than this.
					}
				},
				timer,
				origTarget,
				eventUtils = ns.event,
				swipeStart = {},
				swipeStop = {},
				clickHandler;

			function clearTapTimer() {
				window.clearTimeout(timer);
			}

			function clearTapHandlers() {
				clearTapTimer();
				document.removeEventListener('vclick', clickHandler, false);
				document.removeEventListener('vmouseup', clearTapTimer, false);
				document.removeEventListener("vmousecancel", clearTapHandlers, false);
			}

			clickHandler = function (event) {
				clearTapHandlers();
				// ONLY trigger a 'tap' event if the start target is
				// the same as the stop target.
				if (origTarget === event.target) {
					eventUtils.trigger(event.target, 'tap');
				}
			};

			function tiemoutFunction() {
				eventUtils.trigger(origTarget, 'taphold');
			}

			function handleTap(event) {
				if (!event.which || event.which === 1) {
					origTarget = event.target;

					document.addEventListener('vclick', clickHandler, false);
					document.addEventListener('vmouseup', clearTapTimer, false);
					document.addEventListener("vmousecancel", clearTapHandlers, false);

					timer = window.setTimeout(tiemoutFunction, Touch.tap.tapholdThreshold);
				}
			}

			function handleSwipeMove(event) {
				swipeStop = {
					time: (new Date()).getTime(),
					coords: [event.pageX, event.pageY]
				};
				// prevent scrolling
				if (Math.abs(swipeStart.coords[0] - swipeStop.coords[0]) > Touch.swipe.scrollSupressionThreshold) {
					event.preventDefault();
				}
			}

			function handleSwipeUp() {
				document.removeEventListener("vmousemove", handleSwipeMove, false);
				document.removeEventListener("vmouseup", handleSwipeUp, false);

				if (swipeStart && swipeStop) {
					if (swipeStop.time - swipeStart.time < Touch.swipe.durationThreshold &&
							Math.abs(swipeStart.coords[0] - swipeStop.coords[0]) > Touch.swipe.horizontalDistanceThreshold &&
							Math.abs(swipeStart.coords[1] - swipeStop.coords[1]) < Touch.swipe.verticalDistanceThreshold) {
						eventUtils.trigger(swipeStart.origin, "swipe");
						eventUtils.trigger(swipeStart.origin, swipeStart.coords[0] > swipeStop.coords[0] ? "swipeleft" : "swiperight");
						swipeStart = swipeStop = {};
					}
				}
			}

			function handleSwipe(event) {
				swipeStart = {
					time: (new Date()).getTime(),
					coords: [event.pageX, event.pageY],
					origin: event.target
				};
				document.addEventListener("vmousemove", handleSwipeMove, false);
				document.addEventListener("vmouseup", handleSwipeUp, false);
			}

			document.addEventListener("vmousedown", handleTap, true);
			document.addEventListener("vmousedown", handleSwipe, true);

			ns.event.touch = Touch;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.touch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));

