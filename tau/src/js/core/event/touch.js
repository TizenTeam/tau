/*global window, define */
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
					tap: {
						tapholdThreshold: 750
					},
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

					timer = window.setTimeout(tiemoutFunction, Touch.tapholdThreshold);
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
			ns.event.touch = Touch;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.touch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));

