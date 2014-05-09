/*global ns, window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Gesture.Instance class
 */
( function ( ns, window, undefined ) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([ "./core",
			"./manager",
			"./detector",
			"../../utils/events",
			"../../utils/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Gesture = ns.events.gesture,

				Detector = ns.events.gesture.Detector,

				Manager = ns.events.gesture.Manager,
				merge = ns.utils.object.merge,
				events = ns.utils.events;

			Gesture.Instance = function( element, options ) {

				this.element = element;
				this.eventDetectors = [];

				this.options = merge({}, Gesture.defaults, options);
				this.gestureManager = null;

				this._init();
			};

			Gesture.Instance.prototype = {

				_init: function() {
					this.gestureManager = Manager.getInstance();
					this.eventSender = merge({}, Detector.Sender, {
						sendEvent: this.trigger.bind(this)
					});
				},

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

				setOptions: function( options ) {
					merge(this.options, options);
					return this;
				},

				addDetector: function( detectorStrategy ) {
					var detector = new Detector( detectorStrategy, this.eventSender ),
						alreadyHasDetector = !!this.eventDetectors.length;

					this.eventDetectors.push(detector);

					if ( !!this.eventDetectors.length && !alreadyHasDetector ) {
						this.gestureManager.register(this);
					}

					return this;
				},

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

				trigger: function( gesture, eventInfo ) {
					events.trigger(this.element, gesture, eventInfo);
				},

				getElement: function() {
					return this.element;
				},

				getGestureDetectors: function() {
					return this.eventDetectors;
				},

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