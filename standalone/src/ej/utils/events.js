/*global window, define, CustomEvent */
/*jslint nomen: true */
/**
 * @class ej.utils.events
 * Utils class with events functions
 */
(function (ej) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../utils" // fetch namespace
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			ej.utils.events = {
					/**
					* @method trigger
					* Triggers custom event on element
					* The return value is false, if at least one of the event
					* handlers which handled this event, called preventDefault.
					* Otherwise it returns true.
					* @param {HTMLElement} element
					* @param {string} type
					* @param {Mixed} data
					* @param {Boolean=} bubbles default true
					* @param {Boolean=} cancelable default true
					* @return {Boolean=}
					* @memberOf ej.utils.event
					* @static
					*/
				trigger: function ejUtilsEvents_trigger(element, type, data, bubbles, cancelable) {
					var evt = new CustomEvent(type, {
						"detail": data,
						//allow event to bubble up, required if we want to allow to listen on document etc
						bubbles: typeof bubbles === "boolean" ? bubbles : true,
						cancelable: typeof cancelable === "boolean" ? cancelable : true
					});
					//>>excludeStart("ejDebug", pragmas.ejDebug);
					ej.log("triggered event " + type + " on:", element.tagName + '#' + (element.id || "--no--id--"));
					//>>excludeEnd("ejDebug");
					return element.dispatchEvent(evt);
				},

				/**
				* Stop event propagation
				* @method stopPropagation
				* @param {CustomEvent} event
				* @memberOf ej.utils.events
				* @static
				*/
				stopPropagation: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;
					if (!originalEvent) {
						return;
					}
					if (originalEvent.stopPropagation) {
						originalEvent.stopPropagation();
					}
					event.stopPropagation();
				},

				/**
				* Stop event propagation immediately
				* @method stopImmediatePropagation
				* @param {CustomEvent} event
				* @memberOf ej.utils.events
				* @static
				*/
				stopImmediatePropagation: function (event) {
					// @todo this.isImmediatePropagationStopped = returnTrue;
					this.stopPropagation(event);
				}
			};
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return ej.utils.events;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.ej));
