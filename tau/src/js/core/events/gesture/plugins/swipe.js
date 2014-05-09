/*global ns, window, define */
/*jslint nomen: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * Gesture Plugin: swipe
 */
( function ( ns, window, undefined ) {
	"use strict";
    //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
			"../core",
			"../detector"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var Gesture = ns.events.gesture,
				Detector = ns.events.gesture.Detector;

			ns.events.gesture.Swipe = Detector.plugin.create({

				name: "swipe",

				index: 400,

				defaults: {
					timeThreshold: 400,
					velocity: 0.6,
					orientation: Gesture.Orientation.HORIZONTAL
				},

				handler: function( gestureEvent, sender, options ) {
					var ge = gestureEvent,
						result = Gesture.Result.PENDING;

					if ( ge.eventType !== Gesture.Event.END ) {
						return result;
					}

					if ( ( ge.deltaTime > options.timeThreshold ) ||
						( options.orientation !== Gesture.utils.getOrientation( ge.direction ) ) ) {
						result = Gesture.Result.FINISHED;
						return result;
					}

					if( ge.velocityX > options.velocity || ge.velocityY > options.velocity ) {
						sender.sendEvent( this.name, gestureEvent );
						result = Gesture.Result.FINISHED | Gesture.Result.BLOCK;
					}

					return result;
				}
			});
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
} ( ns, window ) );