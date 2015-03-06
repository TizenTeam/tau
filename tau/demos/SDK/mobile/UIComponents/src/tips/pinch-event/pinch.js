/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
*
* Licensed under the Flora License, Version 1.1 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://floralicense.org/license/
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
$( document ).one( "pageshow", "#pinch_page", function () {
	var last_ratio = 1,
		current_ratio;

	function get_ratio ( ratio ) {
		var v = last_ratio + ratio - 1;

		if ( v < $.mobile.pinch.min ) {
			v = $.mobile.pinch.min;
		} else if ( v > $.mobile.pinch.max ) {
			v = $.mobile.pinch.max;
		}

		return v;
	}

	$("#pinch_demo").on( "pinch", function ( e, p ) {
		var ratio;

		ratio = get_ratio( p.ratio );

		if ( current_ratio == ratio ) {
			return;
		}

		current_ratio = ratio;

		$("#pinch_demo").find("img")
			.css({
				"-webkit-transform": "scale(" + current_ratio + ")",
				"-webkit-transition": "-webkit-transform 0.15s ease"
			});
	});

	$("#pinch_demo").on( "pinchstart", function ( e, p ) {
	});

	$("#pinch_demo").on( "pinchend", function ( e, p ) {
		last_ratio = get_ratio( p.ratio );
	});

	$( window ).bind( "galleryorientationchanged", function ( e ) {
		last_ratio = 1;
	});
});
