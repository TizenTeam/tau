/*
 * Unit Test : Slider
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$( document ).ready( function ( ) {
	module("Slider" );
	QUnit.config.reorder = false;
	var unit_slider = function ( widget , options ) {
		var slider,
			popup,
			oldValue,
			slider_bg = function ( widget ) {
				return "ui-slider-container";
			},
			handle,
			handle_left = function ( widget, slider ) {
				var left = widget.val() * slider.width() /
					( widget.attr("max") - widget.attr("min") );
				return Math.floor( left );
			},
			random_move = function ( min, max ) {
				return Math.floor( ( Math.random( ) * ( max - min + 1 ) ) + min );
			},
			checkEquality = function ( val1, val2 ) {
				return ( parseInt( val1, 10 ) - parseInt( val2, 10 ) ) < 5 ? true : false ;
			};

		/* Create */
		widget.tizenslider( );
		slider = widget.next( ).children(".ui-slider" );
		ok( slider, "Create" );

		/* Check Background */
		equal( slider.parent( ).attr("class" ), slider_bg( widget ), "Background" );

		/* Check Parameters */
		handle = slider.find(".ui-slider-handle" );

		equal( handle.attr("aria-valuenow" ), widget.val( ), "Paramter : value" );
		equal( handle.attr("aria-valuemin" ), widget.attr("min" ), "Paramter : min" );
		equal( handle.attr("aria-valuemax" ), widget.attr("max" ), "Paramter : max" );

		equal( parseInt( handle.css("left") ), handle_left( widget, slider ), "Handle Location: Default" );

		/* Check APIs */
		widget.val( random_move( widget.attr("min" ), widget.attr("max" ) ) );
		widget.trigger("change" );
		equal( parseInt( handle.css("left") ), handle_left( widget, slider ), "Handle Location: Moved" );
		if ( widget.jqmData('popup') == true ) {
			popup = slider.find(".ui-slider-handle-press" );
			ok( popup, "Popup present" );
			equal( checkEquality( popup.css("left" ), handle_left( widget, handle ) ) , true, "popup value check Enabled" );
		}

		/*jqm data*/
		if ( options && options.leftText ) {
			equal( widget.jqmData('text-left'), options.leftText, "jqmData left text" );
		}
		if ( options && options.rightText ) {
			equal( widget.jqmData('text-right'), options.rightText, "jqmData right text" );
		}
		if ( options && options.icon ) {
			equal( widget.jqmData('icon'), options.icon, "jqmData icon" );
		}

	};

	test( "normal slider", function ( ) {
		$('#sliderpage1').page( ) ;
		unit_slider( $("#slider0" ) );
	} );

	test( "icon slider", function ( ) {
		$('#sliderpage2').page( ) ;
		unit_slider( $("#slider1" ) );
	} );

} );
