/*
 * Unit Test: Button
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 *
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$("#checkboxpage").live ("pageinit", function ( event ) {

	module ("button") ;

	var unit_button = function ( widget, type ) {
		var buttonClassPrefix = "ui-btn",
			buttonText = type,
			icon,
			position,
			buttonStyle,
			hasClass;

		ok ( widget.hasClass ( buttonClassPrefix ) , "Create - Button") ;

		if ( widget.jqmData ("inline") ) {
			ok ( widget.hasClass ( buttonClassPrefix + "-inline") , "Style - Inline") ;
		} else {
			ok ( !widget.hasClass ( buttonClassPrefix + "-inline") , "Style - Non Inline") ;
		}

		if ( !widget.children ( ).first ( ).hasClass ( buttonClassPrefix + "-hastxt") ) {
			buttonText = "";
		}

		// Text Trim, CausejQueryMobile ( JQM ) 1.1 forced to add -"\u00a0"in buttonIcon ( ButtonMarkup )
		// JQM 1.1 buttonMarkup code :
		// - if ( buttonIcon ) buttonIcon.appendChild ( document.createTextNode ("\u00a0") ) ;
		equal ( widget.text ( ).trim ( ) , buttonText , "Button Text") ;
		icon = widget.jqmData ("icon") ;
		if ( icon !== undefined ) {
			ok ( widget.children ( ).children ( ).hasClass ("ui-icon-" + icon ) , "Style - Button Icon") ;
		}
		if ( icon !== undefined && buttonText != "") {
			position = widget.jqmData ("iconpos") ;
			if ( position === undefined ) {
				position = "left";
			}
			ok ( widget.children ( ).children ( ).first ( ).hasClass ( buttonClassPrefix + "-text-padding-" + position ) , "Style - Button Icon, Text Position") ;
		}

		buttonStyle = widget.jqmData ("style") ;
		if ( buttonStyle !== undefined ) {
			switch ( buttonStyle ) {
			case "circle":
				hasClass = ".ui-btn-corner-circle, .ui-btn-icon_only";
				break;
			case "edit":
				hasClass = ".ui-btn-edit";
				break;
			case "nobg":
				hasClass = ".ui-btn-icon-nobg, .ui-btn-icon_only";
				break;
			}
			ok ( widget.children ( ).is ( hasClass ) ) ;
		}

		// Check APIs
		widget.button ( ).button ("disable") ;
		equal ( widget.attr ("disabled") , "disabled", "button disable test") ;

		widget.button ( ).button ("enable") ;
		equal ( widget.attr ("disable") , undefined, "button enable test") ;
	},

		unit_button_events = function ( ) {

			var createEvent = false,
				clickEvent = false,
				buttonClassPrefix = "ui-btn",
				widget,
				markup ;

			//remove all controls form content
			$('#checkboxpage').find(":jqmData(role=contents)").empty( ) ;
			markup = '<div data-role="button"id="button-0">Text Button Dynamic</div>';
			$('#checkboxpage').find(":jqmData(role=contents)").append( markup ) ;
			widget = $("#button-0") ;

			/*Bind Event*/
			widget.button( {create: function ( ) {
				createEvent = true ;
			}} ) ;

			widget.bind("click", function ( ) {
				clickEvent = true ;
			} ) ;

			$('#checkboxpage').find(":jqmData(role=contents)").trigger('create') ;
			widget.button ( ) ;

			/*Check Event*/
			$('#checkboxpage').find(":jqmData(role=contents)").trigger('create') ;
			ok( widget.hasClass ( buttonClassPrefix ) , "Create - Button") ;
			ok( createEvent , "Button Create Event") ;
			widget.trigger ('click') ;
			ok( clickEvent , "Button Click Event") ;
		};

	test ("Button", function ( ) {
		unit_button ( $("#button-0") , "Text Button") ;
	} ) ;

	test ("Button - Inline", function ( ) {
		unit_button ( $("#button-1") , "Text Button Inline") ;
	} ) ;

	test ("Button - Inline, Icon", function ( ) {
		unit_button ( $("#button-2") , "Call Icon") ;
	} ) ;

	test ("Button - Inline, Call Icon, Icon Position ( Right )", function ( ) {
		unit_button ( $("#button-3") , "Icon Text") ;
	} ) ;

	test ("Button - Inline, Only Icon ( Reveal )", function ( ) {
		unit_button ( $("#button-4") , "Non Text Button") ;
	} ) ;

	test ("Button - Inline, Only Icon ( Send ) , circle", function ( ) {
		unit_button ( $("#button-5") , "Non Text Button") ;
	} ) ;

	test ("Button - Inline, Only Icon ( Favorite ) , nobackground", function ( ) {
		unit_button ( $("#button-6") , "Non Text Button") ;
	} ) ;

	test ("Button", function ( ) {
		var markup;
		//remove all controls form content
		$('#checkboxpage').find (":jqmData(role=contents)").empty ( ) ;

		markup = '<div data-role = "button" id = "button-0">Text Button Dynamic</div>';
		$('#checkboxpage').find (":jqmData(role=contents)").append ( markup ) ;
		$('#checkboxpage').find (":jqmData(role=contents)").trigger ( 'create' ) ;
		unit_button ( $("#button-0") , "Text Button Dynamic") ;
	} ) ;

	test ("Button - Inline", function ( ) {
		var markup ;
		//remove all controls form content
		$('#checkboxpage').find (":jqmData(role=contents)").empty ( ) ;

		markup = '<div data-role = "button" id = "button-1">Text Button Inline Dynamic</div>';
		$('#checkboxpage').find (":jqmData(role=contents)").append ( markup ) ;
		$('#checkboxpage').find (":jqmData(role=contents)").trigger ('create') ;
		unit_button ( $("#button-1") , "Text Button Inline Dynamic") ;

	} ) ;

	test ("Button - Inline, Icon", function ( ) {
		var markup;
		//remove all controls form content
		$('#checkboxpage').find (":jqmData(role=contents)").empty ( ) ;

		markup = '<div data-role = "button" id = "button-2">Call Icon Dynamic</div>';
		$('#checkboxpage').find (":jqmData(role=contents)").append ( markup ) ;
		$('#checkboxpage').find (":jqmData(role=contents)").trigger ('create') ;
		unit_button ( $("#button-2") , "Call Icon Dynamic") ;

	} ) ;

	test ("Button - Inline, Call Icon, Icon Position ( Right )", function ( ) {
		var markup;
		//remove all controls form content
		$('#checkboxpage').find (":jqmData(role=contents)").empty ( ) ;

		markup = '<div data-role = "button" id = "button-3">Icon Text Dynamic</div>';
		$('#checkboxpage').find (":jqmData(role=contents)").append ( markup ) ;
		$('#checkboxpage').find (":jqmData(role=contents)").trigger ('create') ;
		unit_button ( $("#button-3") , "Icon Text Dynamic") ;

	} ) ;

	test ("Button - Inline, Only Icon ( Reveal )", function ( ) {
		var markup;
		//remove all controls form content
		$('#checkboxpage').find (":jqmData(role=contents)").empty ( ) ;

		markup = '<div data-role = "button" id = "button-4">Non Text Button Dynamic</div>';
		$('#checkboxpage').find (":jqmData(role=contents)").append ( markup ) ;
		$('#checkboxpage').find (":jqmData(role=contents)").trigger ('create') ;
		unit_button ( $("#button-4") , "Non Text Button Dynamic") ;

	} ) ;

	test ("Button - Inline, Only Icon ( Send ) , circle", function ( ) {
		var markup;
		//remove all controls form content
		$('#checkboxpage').find (":jqmData(role=contents)").empty ( ) ;

		markup = '<div data-role = "button" id = "button-5">Non Text Button Dynamic</div>';
		$('#checkboxpage').find (":jqmData(role=contents)").append ( markup ) ;
		$('#checkboxpage').find (":jqmData(role=contents)").trigger ('create') ;
		unit_button ( $("#button-5") , "Non Text Button Dynamic") ;

	} ) ;

	test ("Button - Inline, Only Icon ( Favorite ) , nobackground", function ( ) {
		var markup;
		//remove all controls form content
		$('#checkboxpage').find (":jqmData(role=contents)").empty ( ) ;

		markup = '<div data-role = "button" id = "button-6">Non Text Button Dynamic</div>';
		$('#checkboxpage').find (":jqmData(role=contents)").append ( markup ) ;
		$('#checkboxpage').find (":jqmData(role=contents)").trigger ('create') ;
		unit_button ( $("#button-6") , "Non Text Button Dynamic") ;

	} ) ;

	test ("Button", function ( ) {
		//remove all controls form content
		$('#checkboxpage').find (":jqmData(role=contents)").empty ( ) ;
		unit_button_events ( ) ;
	} ) ;

} ) ;
