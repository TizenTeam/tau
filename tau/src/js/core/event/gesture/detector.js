/*global ns, window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Gesture.Detector class
 */
( function ( ns, window, undefined ) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([ "./core",
		"../../utils/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Gesture = ns.event.gesture,
				objectMerge = ns.utils.object.merge,
				Detector = function( strategy, sender ) {
					this.sender = sender;
					this.strategy = strategy.create();
					this.name = this.strategy.name;
					this.index = this.strategy.index || 100;
					this.options = this.strategy.options || {};
				};

			Detector.prototype.detect = function( gestureEvent ) {
				return this.strategy.handler( gestureEvent, this.sender, this.strategy.options );
			};

			Detector.Sender = {
				sendEvent: function(/* eventName, detail */) {}
			};

//define plugin namespace.
			Detector.plugin = {};
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
			Gesture.Detector = Detector;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} ( ns, window ));
