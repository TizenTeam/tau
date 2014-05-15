/*global window, define */
/*jslint nomen: true*/
/**
 * @class ns.event.pinch
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../event", // fetch namespace
			"./touch",
			"../utils/events"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var pinch = {
					min : 0.1,
					max : 3,
					threshold : 0.01,
					factor : 4,
					interval : 50,
					enabled : true
				},
				pinchDetails = {
					origin : [],
					ratio : 1,
					processing : false,
					current : []
				},
				utilsEvents = ns.utils.events,
				pinchMin,
				pinchMax,
				threshold,
				interval;


			/**
			* Computes distance between two touch points
			* @param {Object} points
			* @returns {number}
			* @member ns.event.pinch
			*/
			function getDistance(points) {
				var x = points[0].x - points[1].x,
					y = points[0].y - points[1].y;

				return Math.sqrt(x * x + y * y);
			}

			/**
			* Handle touch move event. Triggers pinch event if occurs
			* @param {TouchEvent} event
			* @member ns.event.pinch
			*/
			function handleTouchMove(event) {
				var touchList = event.touches,
					ratio = pinchDetails.ratio,
					delta;

				if (!pinchDetails.processing && pinchDetails.origin) {
					pinchDetails.current = [
						{ x: touchList[0].pageX, y: touchList[0].pageY },
						{ x: touchList[1].pageX, y: touchList[1].pageY }
					];

					delta = Math.sqrt(getDistance(pinchDetails.current) / getDistance(pinchDetails.origin));

					ratio = ratio < pinchMin ? pinchMin : delta;
					ratio = ratio > pinchMax ? pinchMax : delta;

					if (Math.abs(ratio - pinchDetails.ratio) >= threshold) {
						utilsEvents.trigger(event.target, 'pinch', pinchDetails);
						pinchDetails.ratio = ratio;

						if (interval) {
							pinchDetails.processing = true;
							setTimeout(function () {
								pinchDetails.processing = false;
							}, interval);
						}
					}
				}
			}


			/**
			* Handle touch end, clean up
			* @param {Event} event
			* @member ns.event.pinch
			*/
			function handleTouchEnd(event) {
				utilsEvents.trigger(event.target, 'pinchend', pinchDetails);

				pinchDetails.origin = undefined;
				pinchDetails.current = undefined;
				pinchDetails.ratio = 1;
				pinchDetails.processing = false;

				document.removeEventListener("touchmove", handleTouchMove, true);
				document.removeEventListener("touchend", handleTouchEnd, true);
			}

			/**
			* Handle touch start, set up pinch tracking
			* @param {Event} event
			* @member ns.event.pinch
			*/
			function handleTouchStart(event) {
				var touchList = event.touches;

				// TODO: what if somebody add 3rd finger?? Should Pinch be stopped?
				if (touchList && touchList.length === 2) {

					//Update config
					pinchMin = pinch.min;
					pinchMax = pinch.max;
					threshold = pinch.threshold;
					interval = pinch.interval;

					pinchDetails.origin = [
						{ x: touchList[0].pageX, y: touchList[0].pageY },
						{ x: touchList[1].pageX, y: touchList[1].pageY }
					];

					// Trigger pinchstart event on target element
					utilsEvents.trigger(event.target, 'pinchstart', pinchDetails);

					// Bind events
					document.addEventListener("touchmove", handleTouchMove, true);
					document.addEventListener("touchend", handleTouchEnd, true);
				}
			}


			// Init pinch event
			document.addEventListener("touchstart", handleTouchStart, true);

			ns.event.pinch = pinch;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.pinch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));

