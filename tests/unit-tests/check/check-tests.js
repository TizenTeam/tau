/*
 * Unit Test: Checkbox
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 */

$( "#checkpage" ).live( "pageinit", function( event ){

	module("checkbox");

	var unit_check = function ( widget, type ) {
		var checkbox,
			label,
			checkClass,
			classPrefix = "ui-checkbox";

		widget.checkboxradio();
		checkbox = widget.parent();
		ok( checkbox.hasClass(classPrefix) , "Create - Checkbox" );

		checkClass = classPrefix + "-on";
		if( !widget.is(":checked") ){
			checkClass = classPrefix + "-off";
		}

		if( widget.hasClass( "favorite" )){
			ok( checkbox.hasClass( "favorite" ), "Style - Favorite" );
		}

		label = checkbox.children().last();
		equal ( label.text(), type, "label, type string must be same" );

		label.trigger( "vclick" );
		if( !widget.is( ":disabled" ) ) {
			checkClass = classPrefix + "-on";
			ok( label.hasClass( checkClass ) , "Click - Normal Checkbox On" );

			checkClass = classPrefix + "-off";
			label.trigger( "vclick" );
			ok( label.hasClass( checkClass ) , "Click - Normal Checkbox Off" );
		} else {
			ok( label.hasClass( checkClass ) , "Click - Disable Checkbox" );
		}
	};

	test( "checkbox - Normal" , function () {
		unit_check( $( "#checkbox-1" ), "Normal" );
	});

	test( "checkbox - Checked, Disabled" , function () {
		unit_check( $( "#checkbox-2" ), "Checked, Disabled" );
	});

	test( "checkbox - Disabled" , function () {
		unit_check( $( "#checkbox-3" ), "Disabled" );
	});

	test( "Favorite - Favorite" , function () {
		unit_check( $( "#checkbox-4" ), "Favorite" );
	});

	test( "Favorite - Favorite Checked, Disabled" , function () {
		unit_check( $( "#checkbox-5" ), "Favorite Checked, Disabled" );
	});

	test( "Favorite - Favorite, Disabled" , function () {
		unit_check( $( "#checkbox-6" ), "Favorite, Disabled" );
	});

});
