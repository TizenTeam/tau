/*
 * Unit Test: Color Picker
 *
 * Hyunjung Kim <hjnim.kim@samsung.com>
 *
 */
$( "#colorpage" ).live( "pageinit", function(event){

	module("Color Picker");

	var cutHex = function( h ){ return ( h.charAt(0)=="#" ) ? h.substring(1,7):h}
	var hexToRgb = function( h ) {
		var r = parseInt((cutHex(h)).substring( 0, 2 ),16), g = parseInt((cutHex(h)).substring( 2, 4),16), b = parseInt((cutHex(h)).substring( 4, 6), 16);
		return "rgb("+r+", "+g+", "+b+")";
	}
	var makeRandomColor = function(){
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
	    	color += letters[Math.round(Math.random() * 15)];
		}
	    return color.toLowerCase();
	}
	var colorchange = function( widget, colorcode ){
		 if( widget.attr("data-color") == colorcode) return true;
		 else return false;
	}
	var testHsvpicker = function( widget ) {
		var	wgSiblings,
			hsvpicker,
			chan,
			hsvIdx,
			max,
			step,
			colorcode;

		widget = $("#hsvpicker");
		widget.hsvpicker();
		wgSiblings = widget.siblings();
		hsvpicker = wgSiblings.last();

		ok( widget.is(":hidden") &&
			hsvpicker.hasClass("ui-hsvpicker") &&
			hsvpicker.children().length == 3
			, "Create - Hue-Saturation-Value");

		ok( function ( ) {
			var i,
				varArray,
				leftbutton,
				rightbutton,
				view,
				width,
				nowvar,
				indicator,
				result = true,
				hue,
				sat,
				val,
				dragging_hsv = [0,0,0];

			for( i = 0 ; i < hsvpicker.children().length; i++ ){
				varArray = hsvpicker.children();
				nowvar = varArray.eq(i);
				leftbutton = nowvar.children().eq(0);
				view = nowvar.children().eq(1);
				rightbutton = nowvar.children().eq(2);
				indicator = nowvar.children().eq(1).children().eq(3);

				while(true) {
					chan = leftbutton.find("a").attr( "data-" + ( $.mobile.ns || "" ) + "target" );
					leftbutton.find("a").trigger( "vclick" );
					if( parseInt( indicator.css("left") ) <= 0 ){
						break;
					}
				}

				hsvIdx = ( "hue" === chan ) ? 0 :
							( "sat" === chan) ? 1 : 2;
				dragging_hsv = [ 0, 0, 0];

				while(true) {
					rightbutton.children().first().trigger( "vclick" );
					width = view.first().width();
					max = ( 0 == hsvIdx ? 360 : 1 );
					step = 0.05 * max;
					dragging_hsv[hsvIdx] = dragging_hsv[hsvIdx] + step;
					dragging_hsv[hsvIdx] = Math.min( max, Math.max( 0.0, dragging_hsv[hsvIdx] ) );
					hue = varArray.eq(0).children().eq(1).children();
					val = varArray.eq(1).children().eq(1).children();
					sat = varArray.eq(2).children().eq(1).children();
					switch(hsvIdx){
						case 0:
							if( indicator.css("background-color") != val.last().css("background-color") ||
								indicator.css("background-color") != sat.last().css("background-color"))
								result = false;
						break;
						case 1:
							if( parseFloat( dragging_hsv[1] ).toFixed(2) != parseFloat(hue.eq(1).css("opacity")).toFixed(2) ||
								indicator.css("background-color") != sat.last().css("background-color"))
								result = false;
						break;
						case 2:
							if(parseFloat( 1 - dragging_hsv[2] ).toFixed(2) , parseFloat(hue.eq(2).css("opacity")).toFixed(2) ||
								parseFloat( 1 - dragging_hsv[2] ).toFixed(2) , parseFloat(val.eq(2).css("opacity")).toFixed(2))
								result = false;
						break;
					}
					if( parseInt( indicator.css("left") ) >= parseInt( width ) || !result){
						break;
					}
				}
			}
			return result;
		}," Click - Color match, Hue-Saturation-Value " );

		colorcode = makeRandomColor();
		widget.hsvpicker( { color : colorcode });

		ok( colorchange(widget, colorcode),
			"Option : Color change")
	}

	test( "Color Title" , function ( ) {
		var wgSiblings,
			colorHex,
			widget,
			colorcode;

		widget = $("#colortitle");

		wgSiblings = widget.siblings();
		ok( widget.is(":hidden") &&
			wgSiblings.length == 2 &&
			wgSiblings.last().is(".ui-colortitle, .jquery-mobile-ui-widget"),
			"Create - Color Title" );

		colorHex = widget.jqmData("color");
		equal( wgSiblings.last().css("color"), hexToRgb(colorHex), "Compare - Color" );
		equal( wgSiblings.last().text().trim(), colorHex, "Compare - Text" );

		colorcode = makeRandomColor();
		widget.colortitle({ color : colorcode });

		ok( colorchange( widget, colorcode ),
			"Option : Color change");
	});

	test( "Color palette" , function () {
		var widget,
			palette,
			palettePreview,
			wgSiblings,
			colorChoice,
			i,
			colorcode,
			palettePrefix = ".colorpalette";

		widget = $("#colorpalette");

		wgSiblings = widget.siblings();
		palette = wgSiblings.last();
		ok( widget.is(":hidden") &&
			wgSiblings.length == 2 &&
			palette.is(".ui-colorpalette, .jquery-mobile-ui-widget"),
			"Create - Color palette" );

		if( palette.find( palettePrefix + "-preview-container").length ){
			palettePreview = palette.find( palettePrefix +"-preview-container");
		}
		colorChoice = palette.find( palettePrefix + "-table").children().find( "div[class^='colorpalette-choice-container-']" );
		equal( colorChoice.length ,
				palette.jqmData("n-choices") , "Count - Color choice container" );

		ok( function(){
				var i = 0,
					result = true;
				for(i = 0 ; i < colorChoice.length; i++ ){
					$(colorChoice[i]).children().trigger("vclick");
					if( palettePreview.children().css("background-color") == $(colorChoice[i]).children().css("background-color") ){
						result = false;
						break;
					}
				}
			return result;
		}, "Click - Palette Active check" );

		colorcode = makeRandomColor();
		widget.colorpalette({ color: colorcode });

		ok( colorchange( widget, colorcode ),
			"Option : Color change");
	});

	test( "Color picker button-noform" , function () {
		var widget,
			wgSiblings,
			colorpickerbutton,
			colorcode,
			popwindow,
			hsvpicker;

		widget = $("#colorpickerbutton-noform");
		widget.colorpickerbutton();
		wgSiblings = widget.siblings();
		colorpickerbutton = wgSiblings.last();

		ok( widget.is(":hidden") &&
			wgSiblings.last().jqmData("role") == "button" &&
			wgSiblings.last().attr("aria-haspopup") == "true",
			"Create - Color picker" );

		widget.colorpickerbutton("open");
		popwindow = $("#colorpage").children().last();

		ok( parseInt( popwindow.css("top") ) > 0, "Open - Popupwindow");
		hsvpicker = popwindow.children().children().first();
		testHsvpicker(hsvpicker);

		widget.colorpickerbutton("close");
		equal( hexToRgb( hsvpicker.jqmData("color") ),
				colorpickerbutton.children().children().children().css("color") );

		colorcode = makeRandomColor();
		widget.colorpicker({ color: colorcode });

		ok( colorchange( widget, colorcode ),
			"Option : Color change");
	});

	test( "Hue-Saturation-Value" , function () {
		testHsvpicker( "#hsvpicker" );
	});

	test( "Hue-Saturation-Lightnewss" , function() {
		var widget,
		wgSiblings,
		colorpicker,
		colorcode;

		widget = $("#colorpicker");
		widget.colorpicker();
		wgSiblings = widget.siblings();
		colorpicker = wgSiblings.last();

		ok( widget.is(":hidden") &&
			colorpicker.hasClass("ui-colorpicker") &&
			colorpicker.children().length == 3
			, "Create - Hue-Saturation-Lightness");

		colorcode = makeRandomColor();
		widget.colorpicker({ color: colorcode });

		ok( colorchange( widget, colorcode ),
			"Option : Color change");
	});
});