$( document ).bind( "pagecreate", function () {
	$("#pinch_page").bind( "pageshow", function () {
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

		$("#pinch_demo").bind( "pinch", function ( e, p ) {
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

		$("#pinch_demo").bind( "pinchstart", function ( e, p ) {
		});

		$("#pinch_demo").bind( "pinchend", function ( e, p ) {
			last_ratio = get_ratio( p.ratio );
		});
	});

	$("#pinch_page").bind( "pagebeforehide", function () {
		$("#pinch_demo").unbind("pinch")
				.unbind("pinchstart")
				.unbind("pinchend");
	});
});
