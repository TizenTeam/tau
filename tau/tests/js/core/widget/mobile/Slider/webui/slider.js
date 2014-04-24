/*
 * Unit Test : Toggle Switch
 *
 *
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$( document ).ready( function ( ) {
	module("toggleswitch" );

	var unit_toggleswitch = function ( widget ) {
		var toggleswitch ;

		/* Create */
		toggleswitch = widget.parent( ).find('.ui-slider-switch') ;
		ok( toggleswitch, "Create" );

		/* Class Check*/
		equal( toggleswitch.hasClass('ui-slider'), true , "Class check" );

		/*Markup check*/
		equal( toggleswitch.find('span.ui-slider-label').length, 2 , "makrup check : 2 options present" );
		equal( toggleswitch.find('span.ui-slider-label')[1].innerHTML, "On" , "makrup check : correct text in option" );
		equal( toggleswitch.find('span.ui-slider-label')[0].innerHTML , "Off" , "makrup check : correct text in option" );
		ok( toggleswitch.find('a.ui-slider-handle') , "makrup check : toggle handle present" );
		equal( toggleswitch.find('a.ui-slider-handle').attr('title'), 'On', "makrup check : handle present" );
		equal( toggleswitch.find('span.ui-slider-label')[1].style.width, '100%', "makrup check : 2 options present" );

		/*check control after firing events*/
		toggleswitch.trigger('vmousedown') ;
		toggleswitch.trigger('vmouseup') ;
		equal( toggleswitch.find('a.ui-slider-handle').attr('title'), 'Off', "Markup check after firing click event first time" );
		equal( toggleswitch.find('span.ui-slider-label')[0].style.width, '100%', "Markup check after firing click event first time" );
		equal( toggleswitch.find('span.ui-slider-label')[1].style.width, '0%', "Markup check after firing click event first time" );

		toggleswitch.trigger('vmousedown') ;
		toggleswitch.trigger('vmouseup') ;
		equal( toggleswitch.find('a.ui-slider-handle').attr('title'), 'On', "Markup check after firing click event second time" );
		equal( toggleswitch.find('span.ui-slider-label')[0].style.width, '0%', "Markup check after firing click event second time" );
		equal( toggleswitch.find('span.ui-slider-label')[1].style.width, '100%', "Markup check after firing click event second time" );

		/* Check Enable , Disbale */
		widget.slider("disable");
		toggleswitch.trigger('vmousedown') ;
		toggleswitch.trigger('vmouseup') ;
		equal( toggleswitch.find('a.ui-slider-handle').attr('title'), 'On', "Markup check after firing click event after switch was disabled" );
		equal( toggleswitch.find('span.ui-slider-label')[1].style.width, '100%', "Markup check after firing click event after switch was disabled" );
		equal( toggleswitch.find('span.ui-slider-label')[0].style.width, '0%', "Markup check after firing click event after switch was disabled" );

		widget.slider("enable");
		toggleswitch.trigger('vmousedown') ;
		toggleswitch.trigger('vmouseup') ;
		equal( toggleswitch.find('a.ui-slider-handle').attr('title'), 'Off', "Markup check after firing click event after switch was re enabled" );
		equal( toggleswitch.find('span.ui-slider-label')[0].style.width, '100%', "Markup check after firing click event after switch was re enabled" );
		equal( toggleswitch.find('span.ui-slider-label')[1].style.width, '0%', "Markup check after firing click event after switch was re enabled" );

		/*refresh */
		widget.find('option')[1].innerHTML = "False" ;
		equal( toggleswitch.find('a.ui-slider-handle').attr('title'), 'Off', "API Refresh : Stoggleswitch is not modified before refresh is called" );
		widget.slider('refresh') ;
		equal( toggleswitch.find('a.ui-slider-handle').attr('title'), 'False', "API Refresh : Stoggleswitch is modified after refresh is called" );
	};

	test( "normal toggleswitch", function ( ) {
		$('#toggleswitch1').page( ) ;
		unit_toggleswitch( $("#newslider" ) );
	} );

	test( "normal toggleswitch -dynamic", function ( ) {
		var createEvent = false,
			handle,
			toggleHTML = "<select data-role='slider' name='slider' id='dynamicslider' data-texton='true'>" +
										"<option value='on'>On</option>" +
										"<option value='off'>Off</option>" +
									"</select>";

		$('#toggleswitch2').find(":jqmData(role=content)").append( toggleHTML );
		$('#dynamicslider').slider( {create : function ( ) {
			createEvent = true ;
		}} ) ;
		handle = $('#toggleswitch2').find(":jqmData(role=content)" );
		ej.utils.events.trigger(handle[0], 'create');
		equal( createEvent, true, "Create Event");
		unit_toggleswitch( $("#dynamicslider"));
	} );
} );
