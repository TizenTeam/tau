/*
 * Unit Test: Checkbox
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$("#checkpage").live("pageinit", function ( event ) {

	module("checkbox");

	var unit_check = function ( widget, type ) {
		var checkbox,
			label,
			checkClass,
			classPrefix = "ui-checkbox";

		widget.checkboxradio( );
		checkbox = widget.parent( );
		ok( checkbox.hasClass( classPrefix ) , "Create - Checkbox");

		checkClass = classPrefix + "-on";
		if ( !widget.is(":checked") ) {
			checkClass = classPrefix + "-off";
		}
		if ( widget.hasClass("favorite") ) {
			ok( checkbox.hasClass("favorite"), "Style - Favorite");
		}

		// Text Trim, Cause jQueryMobile( JQM ) 1.1 forced to add -"\u00a0"in buttonIcon( ButtonMarkup )
		// JQM 1.1 buttonMarkup code :
		// - if ( buttonIcon ) buttonIcon.appendChild( document.createTextNode("\u00a0") );
		label = checkbox.children( ).last( );
		equal ( label.text( ).trim( ), type, "label, type string must be same");

		label.trigger("vclick");
		if ( !widget.is(":disabled") ) {
			checkClass = classPrefix + "-on";
			ok( label.hasClass( checkClass ) , "Click - Normal Checkbox On");

			checkClass = classPrefix + "-off";
			label.trigger("vclick");
			ok( label.hasClass( checkClass ) , "Click - Normal Checkbox Off");
		} else {
			ok( label.hasClass( checkClass ) , "Click - Disable Checkbox");
			label.trigger("vclick");
			ok( label.hasClass( checkClass ) , "Click - click event doesn't have effect");
		}

		/*markup check */
		ok( label.find('.ui-btn-hastxt'), "Markup check for text");
		ok( label.find('.ui-btn-text') , "Markup check for text");
		equal( label.find('.ui-btn-hastxt span.ui-btn-text').last( ).html( ), type , "Markup check for text value");


		/*API check*/
		widget.checkboxradio('disable') ;
		equal( widget.is(":disabled") , true, "API check disable") ;
		ok( checkbox.hasClass("ui-disabled") , "API disable - Disable Checkbox");

		widget.checkboxradio('enable') ;
		equal( widget.is(":disabled") , false, "API check enable") ;
		equal( checkbox.hasClass("ui-disabled") , false, "API enable - Disable Checkbox");


	},

		unit_check_events = function ( widget, type ) {
			var createEvent = false,
				changeEvent = false,
				checkbox,
				label;

			widget.checkboxradio({create: function ( ) {
				createEvent = true ;
			}}  ) ;
			checkbox = widget.parent( );
			label = checkbox.children( ).last( );

			widget.bind("change", function ( ) {
				changeEvent = true ;
			} ) ;

			$('#checkpage').find(":jqmData(role=controlgroup)").trigger('create') ;
			ok( createEvent , "Checkbox Create Event");

			widget.trigger("click");
			ok( changeEvent , "Checkbox Change Event");
		};

	test("checkbox - Normal", function ( ) {
		unit_check( $("#checkbox-1"), "Normal");
	} );

	test("checkbox - Checked, Disabled", function ( ) {
		unit_check( $("#checkbox-2"), "Checked, Disabled");
	} );

	test("checkbox - Disabled", function ( ) {
		unit_check( $("#checkbox-3"), "Disabled");
	} );

	test("Favorite - Favorite", function ( ) {
		unit_check( $("#checkbox-4"), "Favorite");
	} );

	test("Favorite - Favorite Checked, Disabled", function ( ) {
		unit_check( $("#checkbox-5"), "Favorite Checked, Disabled");
	} );

	test("Favorite - Favorite, Disabled", function ( ) {
		unit_check( $("#checkbox-6"), "Favorite, Disabled");
	} );

	test("checkbox - Normal Dynamic", function ( ) {

		var markup;
		//remove all controls form content
		$('#checkpage').find(":jqmData(role=controlgroup)").empty( );

		markup = '<input type= "checkbox"name= "checkbox-1"id= "checkbox-1"/><label for= "checkbox-1">Normal Dynamic</label>';
		$('#checkpage').find(":jqmData(role=controlgroup)").append( markup ) ;
		$('#checkpage').find(":jqmData(role=controlgroup)").trigger('create') ;

		unit_check( $("#checkbox-1"), "Normal Dynamic");
	} );


	test("checkbox - Checked, Disabled Dynamic", function ( ) {

		var markup;
		//remove all controls form content
		$('#checkpage').find(":jqmData(role=controlgroup)").empty( );

		markup = '<input type= "checkbox"name= "checkbox-2"id= "checkbox-2"checked= "checked"disabled= "true"/><label for= "checkbox-2">Checked, Disabled Dymanic</label>';
		$('#checkpage').find(":jqmData(role=controlgroup)").append( markup ) ;
		$('#checkpage').find(":jqmData(role=controlgroup)").trigger('create') ;
		unit_check( $("#checkbox-2"), "Checked, Disabled Dymanic");
	} );

	test("checkbox - Disabled Dynamic", function ( ) {
		var markup;
		//remove all controls form content
		$('#checkpage').find(":jqmData(role=controlgroup)").empty( );

		markup = '<input type= "checkbox"name= "checkbox-3"id= "checkbox-3"disabled= "true"/><label for= "checkbox-3">Disabled Dynamic</label>';
		$('#checkpage').find(":jqmData(role=controlgroup)").append( markup ) ;
		$('#checkpage').find(":jqmData(role=controlgroup)").trigger('create') ;
		unit_check( $("#checkbox-3"), "Disabled Dynamic");
	} );

	test("Favorite - Favorite Dynamic", function ( ) {
		var markup;
		//remove all controls form content
		$('#checkpage').find(":jqmData(role=controlgroup)").empty( );

		markup = '<input type= "checkbox"name= "checkbox-4"id= "checkbox-4"class= "favorite"/><label for= "checkbox-4">Favorite Dynamic</label>';
		$('#checkpage').find(":jqmData(role=controlgroup)").append( markup ) ;
		$('#checkpage').find(":jqmData(role=controlgroup)").trigger('create') ;
		unit_check( $("#checkbox-4"), "Favorite Dynamic");
	} );

	test("Favorite - Favorite Checked, Disabled Dynamic", function ( ) {
		var markup;
		//remove all controls form content
		$('#checkpage').find(":jqmData(role=controlgroup)").empty( );

		markup = '<input type= "checkbox"name= "checkbox-5"id= "checkbox-5"checked= "checked"disabled= "true"class= "favorite"/><label for= "checkbox-5">Favorite Checked, Disabled Dynamic</label>';
		$('#checkpage').find(":jqmData(role=controlgroup)").append( markup ) ;
		$('#checkpage').find(":jqmData(role=controlgroup)").trigger('create') ;
		unit_check( $("#checkbox-5"), "Favorite Checked, Disabled Dynamic");
	} );

	test("Favorite - Favorite, Disabled Dynamic", function ( ) {
		var markup;
		//remove all controls form content
		$('#checkpage').find(":jqmData(role=controlgroup)").empty( );

		markup = '<input type= "checkbox"name= "checkbox-6"id= "checkbox-6"disabled= "disabled"class= "favorite"/><label for= "checkbox-6">Favorite, Disabled Dynamic</label>';
		$('#checkpage').find(":jqmData(role=controlgroup)").append( markup ) ;
		$('#checkpage').find(":jqmData(role=controlgroup)").trigger('create') ;
		unit_check( $("#checkbox-6"), "Favorite, Disabled Dynamic");
	} );

	test("Favorite - Favorite, Disabled Dynamic Events", function ( ) {
		var markup ;
		//remove all controls form content
		$('#checkpage').find(":jqmData(role=controlgroup)").empty( );

		markup = '<input type= "checkbox"name= "checkbox-6"id= "checkbox-6"disabled= "disabled"class= "favorite"/><label for= "checkbox-6">Favorite, Disabled Dynamic Events</label>';
		$('#checkpage').find(":jqmData(role=controlgroup)").append( markup ) ;
		//$('#checkpage').find(":jqmData(role=controlgroup)").trigger('create') ;
		unit_check_events( $("#checkbox-6"), "Favorite, Disabled Dynamic Events");
	} );

} );
