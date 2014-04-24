/*global window, define */
/*jslint plusplus: true, nomen: true */
//  * @TODO add support of $.mobile.buttonMarkup.hoverDelay
/**
 * #jQuery Mobile mapping class
 * @class ns.jqm
 */
(function (window, document, ns, $) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../jqm",
			"../core/events/vmouse",
			"../core/events/orientationchange",
			"../core/events/pinch",
			"../core/events/touch"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var orginalTrigger,
				orginalDispatch,
				eventType = {
					CLICK: "click",
					SUBMIT: "submit",
					KEYUP: "keyup",
					TOUCHSTART: "touchstart",
					TOUCHEND: "touchend",
					VCLICK: "vclick",
					MOUSEDOWN: "mousedown",
					MOUSEUP: "mouseup",
					PAGEBEFORESHOW: "pagebeforeshow",
					MOBILEINIT: "mobileinit"
				};

			ns.jqm.events = {
				/**
				* Create method on jQuery object with name represent event.
				* @method proxyEventTriggerMethod
				* @param {string} name Name of event and new method
				* @param {Function} trigger Function called after invoke method
				* @member ns.jqmn
				* @static
				*/
				proxyEventTriggerMethod: function (name, trigger) {
					$.fn[name] = function () {
						var $elements = this,
							elementsLength = $elements.length,
							i;

						for (i = 0; i < elementsLength; i++) {
							trigger($elements.get(i));
						}
					};
				},

				/**
				* Adds proxy to jquery.trigger method
				* @method proxyTrigger
				* @param {string} type event type
				* @param {Mixed} data event data
				* @return {jQuery}
				*/
				proxyTrigger: function (type, data) {
					var chain,
						$elements = this,
						elementsLength = $elements.length,
						i;

					if (type !== eventType.CLICK && type !== eventType.SUBMIT && type !== eventType.KEYUP && type !== eventType.PAGEBEFORESHOW) {
						chain = orginalTrigger.call($elements, type, data);
					}

					for (i = 0; i < elementsLength; i++) {
						ns.utils.events.trigger($elements.get(i), type);
					}

					return chain;
				},
				/**
				* Method read additional data from event.detail and move these data as additional argument to jQuery.event.dispatch
				* @method proxyDispatch
				* @param {jQuery.Event} event event type
				* @return {jQuery}
				*/
				proxyDispatch: function (event) {
					var data = (event.originalEvent && event.originalEvent.detail) || event.detail,
						args;
					args = [].slice.call(arguments);
					if (data) {
						args.push(data);
					}
					return orginalDispatch.apply(this, args);
				},

				/**
				* Copy properties from originalEvent.detail.* to event Object.
				* @method copyEventProperties
				* @param {HTMLElement} root root element to catch all events window/document
				* @param {string} name Name of event
				* @param {Array.<string>} properties Array of properties to copy from originalEvent to jQuery Event
				* @member ns.jqm
				* @static
				*/
				copyEventProperties: function (root, name, properties) {
					$(root).on(name, function (event) {
						var i,
							property;
						for (i = 0; i < properties.length; i++) {
							property = properties[i];
							if (!event[property]) {
								event[property] = event.originalEvent.detail[property];
							}
						}
					});
				},

				/**
				* Proxy events from ns namespace to jQM namespace
				* @method init
				* @param {Object} events Alias to {@link ns.events}
				* @member ns.jqm
				* @static
				*/
				init: function () {
					var events = ns.events,
						removeEvents = function (event) {
							event.stopPropagation();
							event.preventDefault();
							return false;
						},
						blockedEvents = [events.TOUCHSTART, events.TOUCHEND, events.VCLICK, events.MOUSEDOWN, events.MOUSEUP, events.CLICK],
						blockedEventsLength = blockedEvents.length,
						html = document.getElementsByTagName("html")[0];
					if ($) {
						this.copyEventProperties(window, 'orientationchange', events.orientationchange.properties);
						this.proxyEventTriggerMethod('orientationchange', events.orientationchange.trigger);

						// Proxied jQuery's trigger method to fire swipe events
						if (orginalTrigger === undefined) {
							orginalTrigger = $.fn.trigger;
							$.fn.trigger = this.proxyTrigger;
						}

						if (!orginalDispatch) {
							orginalDispatch = $.event.dispatch;
							$.event.dispatch = this.proxyDispatch;
						}

						$.mobile = $.mobile || {};
						$.mobile.pinch = ns.events.pinch || {};
						$.mobile.tizen = $.mobile.tizen || {};
						$.mobile.tizen.documentRelativeCoordsFromEvent = null;
						$.mobile.tizen.targetRelativeCoordsFromEvent = null;
						$.mobile.addEventBlocker = function () {
							var i;
							html.classList.add("ui-blocker");
							for (i = 0; i < blockedEventsLength; i++) {
								html.addEventListener(blockedEvents[i], removeEvents, true);
							}
						};
						$.mobile.removeEventBlocker = function () {
							var i;
							html.classList.remove("ui-blocker");
							for (i = 0; i < blockedEventsLength; i++) {
								html.removeEventListener(blockedEvents[i], removeEvents, true);
							}
						};
						$.mobile.tizen.documentRelativeCoordsFromEvent = ns.utils.events.documentRelativeCoordsFromEvent.bind(ns.utils.events);
						$.mobile.tizen.targetRelativeCoordsFromEvent = ns.utils.events.targetRelativeCoordsFromEvent.bind(ns.utils.events);
					}
				}
			};
			document.addEventListener(eventType.MOBILEINIT, function () {
				ns.jqm.events.init();
			}, false);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.events;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns, ns.jqm.jQuery));
