/*
 * Unit Test: Slider 
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($) {
	module("Slider");

	var unit_slider = function ( widget ) {
		var slider,
			handle,
			handle_left = function ( widget, slider ) {
				var left = widget.val() * slider.width() /
					( widget.attr("max") - widget.attr("min") );
				return Math.floor( left );
			},
			random_move = function ( min, max) {
				return Math.floor( (Math.random() * (max - min + 1)) + min );
			};

		/* Create */
		widget.tizenslider();
		slider = widget.next().children(".ui-slider");
		ok( slider, "Create" );

		/* Check Background */
		equal( slider.parent().attr("class"), "ui-slider-container", "Background" );

		/* Check Parameters */
		handle = slider.find(".ui-slider-handle");

		equal( handle.attr("aria-valuenow"), widget.val(), "Paramter: value" );
		equal( handle.attr("aria-valuemin"), widget.attr("min"), "Paramter: min" );
		equal( handle.attr("aria-valuemax"), widget.attr("max"), "Paramter: max" );

		ok( Math.abs(parseInt( handle.css("left") ) - handle_left( widget, slider ) ) <= 1, "Handle Location: Default" );

		/* Check APIs */
		widget.val( random_move(widget.attr("min"), widget.attr("max")) );
		widget.trigger("change");
		ok( Math.abs(parseInt( handle.css("left") ) - handle_left( widget, slider ) ) <= 1, "Handle Location: Moved" );
	};

	test( "normal slider", function () {
		unit_slider( $("#slider0") );
	});

	test( "icon slider", function () {
		unit_slider( $("#slider1") );
	});

	test( "jqm enhancing", function () {
		ok( $( "#slider3" ).slider(), "JQM slider enhances select elements" );
	});
}( jQuery ));
