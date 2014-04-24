/*
 * Unit Test : Progressbar
 *
 * Minkyu Kang <mk7.kang@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
( function ( $ ) {
	module("Progressbar");

	var unit_progressbar = function ( widget ) {
		var progress,
			i,
			value,
			get_width = function ( widget ) {
				return widget.progressbar( "option", "value" );
			},
			changeEvent = false ;

		widget.bind('change', function ( ) {
			changeEvent = true ;
		} );
		widget.progressbar( );

		/* Create */
		equal( widget.hasClass("ui-progressbar" ), true, "Create" );

		/*markup check */
		ok( widget.find(".ui-progressbar-bg" ), "Markup check" );
		ok( widget.find(".ui-progressbar-value" ), "Markup check" );

		/* Value */
		for ( i = 0; i < 5; i++ ) {
			value = Math.floor( Math.random( ) * 100 );
			widget.progressbar( "option", "value", value );
			equal( changeEvent, true, "Change Event : " );
			equal( get_width( widget ), value, "API : value" );
			equal( parseInt( widget.find(".ui-progressbar-value" ).css('width'), 10 ) - parseInt( widget.find(".ui-progressbar-bg" ).css('width'), 10 ) * value / 100 < 5, true , "Markup check after value is changed" );
			changeEvent = false ;
		}
	},

		unit_progress = function ( widget, type ) {
			var progress,
				elem = ".ui-progress-" + type,
				_class = "ui-progress-" + type + "-running";

			widget.progress( );

			/* Create */
			progress = widget.find( elem );
			ok( progress, "Create" );

			/* Option */
			equal( widget.progress( "option", "style" ), type, "Option : style" );

			/* Running */
			widget.progress( "running", true );
			progress = widget.find( elem );
			equal( progress.hasClass( _class ), true, "API : running" );

			/* Stop */
			widget.progress( "running", false );
			progress = widget.find( elem );
			equal( progress.hasClass( _class ), false, "API : stop" );
		};

	test( "progressbar", function ( ) {
		unit_progressbar( $("#progressbar" ) );
	} );

	test( "pending bar", function ( ) {
		unit_progress( $("#pending" ), "pending" );
	} );

	test( "processing circle", function ( ) {
		unit_progress( $("#progressing" ), "circle" );
	} );


	test( "progressbar - dynamic", function ( ) {

		$('#progressbar_demo').find(":jqmData(role=content)" ).empty( );
		var markup = ' <div data-role= "progressbar" id= "progressbar"></div>';
		$('#progressbar_demo').find(":jqmData(role=content)" ).append( markup ).trigger('create') ;
		unit_progressbar( $("#progressbar" ) );
	} );

	test( "pending bar - dynamic", function ( ) {
		$('#progressbar_demo').find(":jqmData(role=content)" ).empty( );
		var markup = ' <div data-role= "progressing" data-style= "pending" id= "pending"></div>';
		$('#progressbar_demo').find(":jqmData(role=content)" ).append( markup ).trigger('create') ;

		unit_progress( $("#pending" ), "pending" );
	} );

	test( "processing circle - dynamic", function ( ) {
		$('#progressbar_demo').find(":jqmData(role=content)" ).empty( );
		var markup = ' <div data-role= "progressing" data-style= "circle" id= "progressing"></div>';
		$('#progressbar_demo').find(":jqmData(role=content)" ).append( markup ).trigger('create') ;

		unit_progress( $("#progressing" ), "circle" );
	} );
} ( jQuery ) );
