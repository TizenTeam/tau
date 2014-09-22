/*global ns, window, define */
/*jslint nomen: true */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Gesture.Instance class
 * Creates instance of gesture manager on element.
 * @class ns.event.gesture.Instance
 */
( function ( ns, window, undefined ) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([ "./core",
			"./manager",
			"./detector",
			"../../event",
			"../../util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
				/**
				 * Local alias for {@link ns.event.gesture}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
			var Gesture = ns.event.gesture,
				/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				Detector = ns.event.gesture.Detector,
				/**
				 * Local alias for {@link ns.event.gesture.Manager}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				Manager = ns.event.gesture.Manager,
				/**
				 * Local alias for {@link ns.event}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				events = ns.event,
				/**
				 * Alias for method {@link ns.util.object.merge}
				 * @property {Function} merge
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				merge = ns.util.object.merge;

			Gesture.Instance = function( element, options ) {

				this.element = element;
				this.eventDetectors = [];

				this.options = merge({}, Gesture.defaults, options);
				this.gestureManager = null;

				this._init();
			};

			Gesture.Instance.prototype = {
				/**
				 * Initialize gesture instance
				 * @method _init
				 * @member ns.event.gesture.Instance
				 * @protected
				 */
				_init: function() {
					this.gestureManager = Manager.getInstance();
					this.eventSender = merge({}, Detector.Sender, {
						sendEvent: this.trigger.bind(this)
					});
				},

				/**
				 * Find gesture detector
				 * @method _findGestureDetector
				 * @param {string} gesture gesture
				 * @member ns.event.gesture.Instance
				 * @protected
				 */
				_findGestureDetector: function( gesture ) {
					var detectors = Detector.plugin,
						detector, name;
					for ( name in detectors ) {
						if ( detectors.hasOwnProperty( name ) ) {
							detector = detectors[ name ];
							if ( detector.prototype.types.indexOf( gesture ) > -1 ) {
								return detector;
							}
						}
					}
				},

				/**
				 * Set options
				 * @method setOptions
				 * @param {Object} options options
				 * @chainable
				 * @member ns.event.gesture.Instance
				 */
				setOptions: function( options ) {
					merge(this.options, options);
					return this;
				},

				/**
				 * Add detector
				 * @method addDetector
				 * @param {Object} detectorStrategy strategy
				 * @chainable
				 * @member ns.event.gesture.Instance
				 */
				addDetector: function( detectorStrategy ) {
					var detector = new Detector( detectorStrategy, this.eventSender ),
						alreadyHasDetector = !!this.eventDetectors.length;

					this.eventDetectors.push(detector);

					if ( !!this.eventDetectors.length && !alreadyHasDetector ) {
						this.gestureManager.register(this);
					}

					return this;
				},

				/**
				 * Remove detector
				 * @method removeDetector
				 * @param {Object} detectorStrategy strategy
				 * @chainable
				 * @member ns.event.gesture.Instance
				 */
				removeDetector: function( detectorStrategy ) {
					var idx = this.eventDetectors.indexOf( detectorStrategy );

					if ( idx > -1 ) {
						this.eventDetectors.splice(idx, 1);
					}

					if ( !this.eventDetectors.length ) {
						this.gestureManager.unregister(this);
					}

					return this;
				},

				/**
				 * Triggers the gesture event
				 * @method trigger
				 * @param {string} gesture gesture name
				 * @param {Object} eventInfo data provided to event object
				 * @member ns.event.gesture.Instance
				 */
				trigger: function( gesture, eventInfo ) {
					events.trigger(this.element, gesture, eventInfo);
				},

				/**
				 * Get HTML element assigned to gesture event instance
				 * @method getElement
				 * @member ns.event.gesture.Instance
				 */
				getElement: function() {
					return this.element;
				},

				/**
				 * Get gesture event detectors assigned to instance
				 * @method getGestureDetectors
				 * @member ns.event.gesture.Instance
				 */
				getGestureDetectors: function() {
					return this.eventDetectors;
				},

				/**
				 * Destroy instance
				 * @method destroy
				 * @member ns.event.gesture.Instance
				 */
				destroy: function( ) {
					this.element = null;
					this.eventHandlers = {};
					this.gestureManager = null;
					this.eventSender = null;
					this.eventDetectors.length = 0;
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} ( ns, window ) );
