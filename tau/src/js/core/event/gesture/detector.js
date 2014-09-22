/*global ns, window, define */
/*jslint nomen: true */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Gesture.Detector class
 * Base class for create detectors in gestures.
 *
 * @class ns.event.gesture.Detector
 */
( function ( ns, window, undefined ) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([ "./core",
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
			var Gesture = ns.event.gesture,
				/**
				 * Alias for method {@link ns.util.object.merge}
				 * @property {Function} objectMerge
				 * @member ns.event.gesture.Detector
				 * @private
				 * @static
				 */
				objectMerge = ns.util.object.merge,

				Detector = function( strategy, sender ) {
					this.sender = sender;
					this.strategy = strategy.create();
					this.name = this.strategy.name;
					this.index = this.strategy.index || 100;
					this.options = this.strategy.options || {};
				};

			/**
			 * Start of gesture detection of given type
			 * @method detect
			 * @param {string} gestureEvent
			 * @return {Object}
			 * @member ns.event.gesture.Detector
			 */
			Detector.prototype.detect = function( gestureEvent ) {
				return this.strategy.handler( gestureEvent, this.sender, this.strategy.options );
			};

			Detector.Sender = {
				sendEvent: function(/* eventName, detail */) {}
			};

			/**
			 * Create plugin namespace.
			 * @property {Object} plugin
			 * @member ns.event.gesture.Detector
			 */
			Detector.plugin = {};

			/**
			 * Methods creates plugin
			 * @method create
			 * @param {Object} gestureHandler
			 * @return {ns.event.gesture.Detector} gestureHandler
			 * @member ns.event.gesture.Detector.plugin
			 */
			Detector.plugin.create = function( gestureHandler ) {

				if ( !gestureHandler.types ) {
					gestureHandler.types = [ gestureHandler.name ];
				}

				var detector = Detector.plugin[ gestureHandler.name ] = function( options ) {
					this.options = objectMerge({}, gestureHandler.defaults, options);
				};

				detector.prototype.create = function() {
					return objectMerge({
						options: this.options
					}, gestureHandler);
				};

				return detector;
			};

			// definition
			Gesture.Detector = Detector;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} ( ns, window ));
