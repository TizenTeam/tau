/*global CustomEvent, define, window, ns */
/*jslint plusplus: true, nomen: true, bitwise: true */

/**
 * #Virtual Mouse Events
 * Reimplementation of jQuery Mobile virtual mouse events.
 *
 * ##Purpose
 * It will let for users to register callbacks to the standard events like bellow,
 * without knowing if device support touch or mouse events
 * @class ns.event.vmouse
 */
/**
 * Triggered after mouse-down or touch-started.
 * @event vmousedown
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-click or touch-end when touch-move didn't occur
 * @event vclick
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-up or touch-end
 * @event vmouseup
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-move or touch-move
 * @event vmousemove
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-over or touch-start if went over coordinates
 * @event vmouseover
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-out or touch-end
 * @event vmouseout
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-cancel or touch-cancel and when scroll occur during touchmove
 * @event vmousecancel
 * @member ns.event.vmouse
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
				/**
				* Object with default options
				* @property {Object} vmouse
				* @member ns.event.vmouse
				* @static
				* @private
				**/
			var vmouse,
				/**
				* @property {Object} eventProps Contains the properties which are copied from the original event to custom v-events
				* @member ns.event.vmouse
				* @static
				* @private
				**/
				eventProps,
				/**
				* @property {boolean} touchSupport Indicates if the browser support touch events
				* @member ns.event.vmouse
				* @static
				**/
				touchSupport = window.hasOwnProperty("ontouchstart"),
				/**
				* @property {boolean} didScroll The flag tell us if the scroll event was triggered
				* @member ns.event.vmouse
				* @static
				* @private
				**/
				didScroll,
				/**
				* @property {Number} [startX=false] Initial data for touchstart event
				* @member ns.event.vmouse
				* @static
				* @private
				**/
				startX = 0,
				/**
				* @property {Number} [startY=false] Initial data for touchstart event
				* @member ns.event.vmouse
				* @private
				* @static
				**/
				startY = 0,
				touchEventProps = ["clientX", "clientY", "pageX", "pageY", "screenX", "screenY"];

			/**
			* Extends objects with other objects
			* @method copyProps
			* @param {Object} from Sets the original event
			* @param {Object} to Sets the new event
			* @param {Object} props Describe parameters which will be copied from Original to To event
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function copyProps(from, to, props) {
				var i,
					len,
					descriptor;

				for (i = 0, len = props.length; i < len; ++i) {
					if (isNaN(from[props[i]]) === false) {
						descriptor = Object.getOwnPropertyDescriptor(to, props[i]);
						if (!descriptor || descriptor.writable) {
							to[props[i]] = from[props[i]];
						}
					}
				}
			}

			/**
			* Create custom event
			* @method createEvent
			* @param {string} newType gives a name for the new Type of event
			* @param {Event} original Event which trigger the new event
			* @return {Event}
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function createEvent(newType, original) {
				var evt = new CustomEvent(newType, {
					"bubbles": original.bubbles,
					"cancelable": original.cancelable,
					"detail": original.detail
				}),
					orginalType = original.type,
					changeTouches,
					touch,
					j = 0,
					len,
					prop;

				copyProps(original, evt, eventProps);
				evt._originalEvent = original;

				if (orginalType.indexOf("touch") !== -1) {
					orginalType = original.touches;
					changeTouches = original.changedTouches;

					if (orginalType && orginalType.length) {
						touch = orginalType[0];
					} else {
						touch = (changeTouches && changeTouches.length) ? changeTouches[0] : null;
					}

					if (touch) {
						for (len = touchEventProps.length; j < len; j++) {
							prop = touchEventProps[j];
							evt[prop] = touch[prop];
						}
					}
				}

				return evt;
			}

			/**
			* Dispatch Events
			* @method fireEvent
			* @param {string} eventName event name
			* @param {Event} evt original event
			* @return {boolean}
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function fireEvent(eventName, evt) {
				return evt.target.dispatchEvent(createEvent(eventName, evt));
			}

			eventProps = [
				"currentTarget",
				"detail",
				"button",
				"buttons",
				"clientX",
				"clientY",
				"offsetX",
				"offsetY",
				"pageX",
				"pageY",
				"screenX",
				"screenY",
				"toElement"
			];

			vmouse = {
				/**
				* Sets the distance of pixels after which the scroll event will be successful
				* @property {number} [eventDistanceThreshold=10]
				* @member ns.event.vmouse
				* @private
				* @static
				* @instance
				*/
				eventDistanceThreshold: 10,

				touchSupport: touchSupport
			};

			/**
			* Handle click down
			* @method handleDown
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleDown(evt) {
				fireEvent("vmousedown", evt);
			}

			/**
			* Handle click
			* @method handleClick
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleClick(evt) {
				fireEvent("vclick", evt);
			}

			/**
			* Handle click up
			* @method handleUp
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleUp(evt) {
				fireEvent("vmouseup", evt);
			}

			/**
			* Handle click move
			* @method handleMove
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleMove(evt) {
				fireEvent("vmousemove", evt);
			}

			/**
			* Handle click over
			* @method handleOver
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleOver(evt) {
				fireEvent("vmouseover", evt);
			}

			/**
			* Handle click out
			* @method handleOut
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleOut(evt) {
				fireEvent("vmouseout", evt);
			}

			/**
			* Handle touch start
			* @method handleTouchStart
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleTouchStart(evt) {
				var touches = evt.touches,
					firstTouch;
				//if touches are registered and we have only one touch
				if (touches && touches.length === 1) {
					didScroll = false;
					firstTouch = touches[0];
					startX = firstTouch.pageX;
					startY = firstTouch.pageY;
					fireEvent("vmouseover", evt);
					fireEvent("vmousedown", evt);
				}

			}

			/**
			* Handle touch end
			* @method handleTouchEnd
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleTouchEnd(evt) {
				fireEvent("vmouseup", evt);
				fireEvent("vmouseout", evt);
			}

			/**
			* Handle touch move
			* @method handleTouchMove
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleTouchMove(evt) {
				var over,
					firstTouch = evt.touches && evt.touches[0],
					didCancel = didScroll,
					//sets the threshold, based on which we consider if it was the touch-move event
					moveThreshold = vmouse.eventDistanceThreshold;

				didScroll = didScroll ||
				//check in both axes X,Y if the touch-move event occur
					(Math.abs(firstTouch.pageX - startX) > moveThreshold ||
					Math.abs(firstTouch.pageY - startY) > moveThreshold);

				// detect over event
				// for compatibility with mouseover because "touchenter" fires only once
				over = document.elementFromPoint(evt.pageX, evt.pageY);
				if (over) {
					fireEvent("_touchover", evt);
				}

				//if didscroll occur and wasn't canceled then trigger touchend otherwise just touchmove
				if (didScroll && !didCancel) {
					fireEvent("vmousecancel", evt);
				}
				fireEvent("vmousemove", evt);
			}

			/**
			* Handle Scroll
			* @method handleScroll
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleScroll(evt) {
				if (!didScroll) {
					fireEvent("vmousecancel", evt);
				}
				didScroll = true;
			}

			/**
			* Handle touch cancel
			* @method handleTouchCancel
			* @param {Event} evt
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleTouchCancel(evt) {
				fireEvent("vmousecancel", evt);
			}

			/**
			* Handle touch cancel
			* @method handleTouchOver
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleTouchOver() {
				return false;
				// @TODO add callback with handleTouchOver,
			}

			/**
			* Handle key up
			* @method handleKeyUp
			* @param {Event} event
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleKeyUp(event) {
				if (event.keyCode === 13) {
					fireEvent("vmouseup", event);
					fireEvent("vclick", event);
				}
			}

			/**
			* Handle key down
			* @method handleKeyDown
			* @param {Event} event
			* @private
			* @static
			* @member ns.event.vmouse
			*/
			function handleKeyDown(event) {
				if (event.keyCode === 13) {
					fireEvent("vmousedown", event);
				}
			}

			// @TODO delete touchSupport flag and attach touch and mouse listeners,
			// @TODO check if v-events are not duplicated if so then called only once

			vmouse.bindTouch = function () {
				document.addEventListener("touchstart", handleTouchStart, true);
				document.addEventListener("touchend", handleTouchEnd, true);
				document.addEventListener("touchmove", handleTouchMove, true);

				// @TODO add callback with handleTouchOver,
				document.addEventListener("touchenter", handleTouchOver, true);
				// for compatibility with mouseover because "touchenter" fires only once
				// @TODO add callback with handleTouchOver,
				document.addEventListener("_touchover", handleTouchOver, true);
				// document.addEventListener("touchleave", callbacks.out, true);
				document.addEventListener("touchcancel", handleTouchCancel, true);

				document.addEventListener("click", handleClick, true);
			};

			vmouse.bindMouse = function () {
				document.addEventListener("mousedown", handleDown, true);

				document.addEventListener("mouseup", handleUp, true);
				document.addEventListener("mousemove", handleMove, true);
				document.addEventListener("mouseover", handleOver, true);
				document.addEventListener("mouseout", handleOut, true);

				document.addEventListener("keyup", handleKeyUp, true);
				document.addEventListener("keydown", handleKeyDown, true);
				document.addEventListener("scroll", handleScroll, true);
				document.addEventListener("click", handleClick, true);
			};

			ns.event.vmouse = vmouse;

			if (touchSupport) {
				vmouse.bindTouch();
			} else {
				vmouse.bindMouse();
			}

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.vmouse;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
