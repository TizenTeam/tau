/*
 * Unit Test: Radio
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 *
 */
$( "#radiopage" ).live( "pageinit", function(event) {

	module("Radio");

	/* Single Radio */
	var unit_radio = function ( input , type ) {
		var radio,
			label,
			checkClass,
			labelSpan,
			radioClassPrefix = "ui-radio";

		radio = input.parent();
		ok( radio.hasClass( radioClassPrefix ) , "Create - Single Radio Button" );

		label = radio.find( "label" );
		label.trigger( "vclick" );
		checkClass = radioClassPrefix + "-on";
		if( !input.is( ":checked" ) ) {
			checkClass = radioClassPrefix + "-off";
		}
		ok( label.hasClass( checkClass ), "Click - Radio button" );

		labelSpan = label.children().children();
		ok( labelSpan.first().is( ".ui-btn-text, .ui-btn-text-padding-left" ), "Okay - Label Padding" );

		if ( !input.is( ":disabled" ) ) {
			label.trigger( "vclick" );
		}

		// Text Trim, Cause jQueryMobile(JQM) 1.1 forced to add - "\u00a0" in buttonIcon(ButtonMarkup)
		// JQM 1.1 buttonMarkup code :
		// - if( buttonIcon ) buttonIcon.appendChild( document.createTextNode( "\u00a0" ) );
		equal( labelSpan.text().trim(), input.val(), "Label Text" );
	};

	/* Group Radio */
	var unit_radio_group = function ( fieldset , type ) {
		var type,
			radios,
			label,
			labels;

		type = fieldset.jqmData( "type" );
		if( type === undefined ) {
			type = "vertical";
		}
		ok( fieldset.is( ".ui-corner-all, .ui-controlgroup, .ui-controlgroup-" + type ) , "Create - ControlGroup" );

		if( type == "horizontal" ) {
			labels = fieldset.find( "span.ui-btn-text" ).each( function () {
				ok( ( $( this ).siblings().length == 0 && $( this ).hasClass( "ui-btn-text" ) ) ? true : false, "Alignment - ControlGroup(Horizontal, Single Radio)" );
			});
		}

		radios = fieldset.find( "input[type='radio']" );
		radios.each( function() {
			unit_radio( $( this ) , "Normal" );
		});

		ok( function() {
				try{
					for ( i = 0 ; i < raidos.lenght ; i++ ) {
						label = radios[i].find( "label" );
						label.trigger( "vclick" );
						if( !label.hasClass( "ui-radio-on" ) ){
							throw "error - other button activate";
						}
						for ( j = 0 ; j < radios.lenght ; j++) {
							if( i == j) continue;
							label = radios[j].find( "label" );
							if( label.hasClass( "ui-radio-on" ) ) {
								throw "error - other button activate";
							}
						}
					}
				} catch ( Exception ) {
					return false;
				}
				return true;
		}, "Click - Radio Button( Group )" );
	};

	test( "radiobutton - Single" , function () {
		unit_radio( $("#radio-single-1") , "Normal" );
	});

	test( "radiobutton - Single, Checked, Disabled" , function () {
		unit_radio( $("#radio-single-2") , "Checked, Disabled" );
	});

	test( "radiobutton - Single, Disabled" , function () {
		unit_radio( $("#radio-single-3") , "Disabled" );
	});

	test( "radiobutton - Group" , function() {
		unit_radio_group( $("#controlgroup") , "Group" );
	});

	test( "radiobutton - Group, Horizontal" , function() {
		unit_radio_group( $("#controlgroup2") , "Group - horizontal" );
	});
});
