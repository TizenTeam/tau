/* ***************************************************************************
 * Copyright (c) 2000 - 2013 Samsung Electronics Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 *	Author: Minkyu Kang <mk7.kang@samsung.com>
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

( function( $, window, undefined ) {

pinch_event = {
	setup: function () {
		var thisObject = this,
			$this = $( thisObject );

		if ( !$.mobile.support.touch ) {
			return;
		}

		function getDistance( point ) {
			var x = point[0].x - point[1].x,
				y = point[0].y - point[0].y;

			return Math.sqrt( ( x * x ) + ( y * y ) );
		}

		function getParameter( point, ratio ) {
			return { point: point, ratio: ratio };
		}

		$this.bind( "touchstart", function ( event ) {
			var data = event.originalEvent.touches,
				origin,
				last_ratio = 1,
				processing = false;

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
					current,
					ratio,
					delta,
					factor = $( window ).width() / $.mobile.pinch.factor;

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

				delta = getDistance( current ) - getDistance( origin );

				ratio = 1 + delta / factor;

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

$.event.special["pinch"] = pinch_event;

$.mobile.pinch = {
	enabled: true,
	min: 0.1,
	max: 3,
	factor: 4,
	threshold: 0.01,
	interval: 50
};

})( jQuery, this );
