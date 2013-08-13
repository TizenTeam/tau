/*
* Module Name : jquery.mobile.tizen.pinch
* Copyright (c) 2013 Samsung Electronics Co., Ltd.
* License : Flora License
*/	
/*
 * Pinch Event
 *
 * Events
 *	pinchstart: triggered when start the touched two points
 *	pinch: triggered when move the touch point after pinchstart event occured
 *	pinchend: triggered when touchend event after pinchstart event occured
 *
 * Parameters
 *	point: touched points
 *	ratio: origin point-to-current point ratio for moving distance
 *
 *	$("#pinch").bind("pinch", function (e, p) {
 *		console.log("point[0].x: " + p.point[0].x);
 *		console.log("point[0].y: " + p.point[0].y);
 *		console.log("point[1].x: " + p.point[1].x);
 *		console.log("point[1].y: " + p.point[1].y);
 *		console.log("ratio: " + p.ratio);
 *	});
 *
 * Options
 *	$.mobile.pinch.enabled: true or false
 *	$.mobile.pinch.min: minimum value of ratio
 *	$.mobile.pinch.max: maximum value of ratio
 *	$.mobile.pinch.factor: scale factor of ratio
 *	$.mobile.pinch.threshold: move threshold of ratio
 *	$.mobile.pinch.interval: interval for pinch event
 */

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Pinch Event
//>>label: Pinch Event
//>>group: Tizen:Core

define( [ 
	'license/FLORA',
	'jquery',
	'jqm/jquery.mobile.core'
	], function ( jQuery ) {

//>>excludeEnd("jqmBuildExclude");

( function ( $, undefined ) {

	var pinch_event = {
		setup: function () {
			var thisObject = this,
				$this = $( thisObject );

			if ( !$.mobile.support.touch ) {
				return;
			}

			function getSize( point ) {
				var x = point[0].x - point[1].x,
					y = point[0].y - point[1].y;

				return Math.abs( x * y );
			}

			function getParameter( point, ratio ) {
				return { point: point, ratio: ratio };
			}

			$this.bind( "touchstart", function ( event ) {
				var data = event.originalEvent.touches,
					origin,
					last_ratio = 1,
					processing = false,
					current;

				if ( !$.mobile.pinch.enabled ) {
					return;
				}

				if ( data.length != 2 ) {
					return;
				}

				origin = [
					{ x: data[0].pageX, y: data[0].pageY },
					{ x: data[1].pageX, y: data[1].pageY }
				];

				$( event.target ).trigger( "pinchstart", getParameter( origin, undefined ) );

				function pinchHandler( event ) {
					var data = event.originalEvent.touches,
						ratio,
						delta;

					if ( processing ) {
						return;
					}

					if ( !origin ) {
						return;
					}

					current = [
						{ x: data[0].pageX, y: data[0].pageY },
						{ x: data[1].pageX, y: data[1].pageY }
					];

					delta = Math.sqrt( getSize( current ) / getSize( origin )  ) ;
					if ( delta ) {
						ratio = delta;
					}

					if ( ratio < $.mobile.pinch.min ) {
						ratio = $.mobile.pinch.min;
					} else if ( ratio > $.mobile.pinch.max ) {
						ratio = $.mobile.pinch.max;
					}

					if ( Math.abs( ratio - last_ratio ) < $.mobile.pinch.threshold ) {
						return;
					}

					$( event.target ).trigger( "pinch", getParameter( current, ratio ) );

					last_ratio = ratio;

					if ( $.mobile.pinch.interval ) {
						processing = true;

						setTimeout( function () {
							processing = false;
						}, $.mobile.pinch.interval );
					}
				}

				$this.bind( "touchmove", pinchHandler )
					.one( "touchend", function ( event ) {
						$this.unbind( "touchmove", pinchHandler );
						$( event.target ).trigger( "pinchend",
									getParameter( undefined, last_ratio ) );

						origin = undefined;
						current = undefined;
						last_ratio = 1;
						processing = false;
					});
			});
		}
	};

	$.event.special.pinch = pinch_event;

	$.mobile.pinch = {
		enabled: true,
		min: 0.1,
		max: 3,
		factor: 4,
		threshold: 0.01,
		interval: 50
	};

}( jQuery, this ) );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
} );
//>>excludeEnd("jqmBuildExclude");
