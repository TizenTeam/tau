/*
 * Unit Test: Slider 
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("Slider");

	var unit_slider = function ( widget ) {
		var slider,
			slider_bg = function ( widget ) {
				if ( widget.jqmData("icon") !== undefined ) {
					return "ui-slider-icon-bg";
				}
				return "ui-slider-bg";
			},
			handle,
			handle_left = function ( widget ) {
				var left = widget.val() * 100 /
					( widget.attr("max") - widget.attr("min") );
				return left + "%";
			},
			random_move = function ( min, max) {
				return Math.floor( (Math.random() * (max - min + 1)) + min );
			};

		/* Create */
		widget.tizenslider();
		slider = widget.next().children(".ui-slider");
		ok( slider, "Create" );

		/* Check Background */
		equal( slider.parent().attr("class"), slider_bg( widget ), "Background" );

		/* Check Parameters */
		handle = slider.find(".ui-slider-handle");

		equal( handle.attr("aria-valuenow"), widget.val(), "Paramter: value" );
		equal( handle.attr("aria-valuemin"), widget.attr("min"), "Paramter: min" );
		equal( handle.attr("aria-valuemax"), widget.attr("max"), "Paramter: max" );

		equal( handle.css("left"), handle_left(widget), "Handle Location: Default" );

		/* Check APIs */
		widget.val( random_move(widget.attr("min"), widget.attr("max")) );
		widget.trigger("change");
		equal( handle.css("left"), handle_left(widget), "Handle Location: Moved" );
	};

	test( "normal slider", function () {
		unit_slider( $("#slider0") );
	});

	test( "icon slider", function () {
		unit_slider( $("#slider1") );
	});
}( jQuery ));
