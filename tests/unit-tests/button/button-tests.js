/*
 * Unit Test: Button
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 *
 */
$( "#checkboxpage" ).live( "pageinit",function(event){

	module("button");

	var unit_button = function ( widget, type ) {
		var buttonClassPrefix = "ui-btn",
			buttonText = type,
			icon,
			position,
			buttonStyle,
			hasClass;

		ok( widget.hasClass(buttonClassPrefix), "Create - Button" );

		if( widget.jqmData( "inline" ) ) {
			ok( widget.hasClass( buttonClassPrefix + "-inline"), "Style - Inline");
		}else{
			ok( !widget.hasClass( buttonClassPrefix + "-inline"), "Style - Non Inline");
		}

		if( !widget.children().first().hasClass( buttonClassPrefix + "-hastxt" ) ) {
			buttonText = "";
		}
		equal( widget.text() , buttonText , "Button Text" );

		icon = widget.jqmData("icon");
		if( icon !== undefined ) {
			ok( widget.children().children().hasClass("ui-icon-" + icon ) , "Style - Button Icon" );
		}
		if( icon !== undefined && buttonText != ""){
			position = widget.jqmData("iconpos");
			if( position === undefined ) {
				position = "left";
			}
			ok( widget.children().children().first().hasClass( buttonClassPrefix + "-text-padding-" + position ) , "Style - Button Icon, Text Position" );
		}

		buttonStyle= widget.jqmData( "style" );
		if( buttonStyle !== undefined ) {
			switch( buttonStyle ){
				case "circle" :
					hasClass = " .ui-btn-corner-circle, .ui-btn-icon_only";
				break;
				case "edit" :
					hasClass = " .ui-btn-edit";
				break;
				case "nobg" :
					hasClass = " .ui-btn-icon-nobg, .ui-btn-icon_only";
				break;
			}
			ok( widget.children().is( hasClass ) );
		}
	};

	test ( "Button" , function() {
		unit_button( $("#button-0"), "Text Button" );
	});

	test ( "Button - Inline" , function() {
		unit_button( $("#button-1"), "Text Button Inline" );
	});

	test ( "Button - Inline, Icon" , function() {
		unit_button( $("#button-2"), "Call Icon" );
	});

	test ( "Button - Inline, Call Icon, Icon Position(Right)" , function() {
		unit_button( $("#button-3"), "Icon Text" );
	});

	test ( "Button - Inline, Only Icon(Reveal)" , function() {
		unit_button( $("#button-4"), "Non Text Button" );
	});

	test ( "Button - Inline, Only Icon(Send), circle" , function() {
		unit_button( $("#button-5"), "Non Text Button" );
	});

	test ( "Button - Inline, Only Icon(Favorite), nobackground" , function() {
		unit_button( $("#button-6"), "Non Text Button" );
	});

});
