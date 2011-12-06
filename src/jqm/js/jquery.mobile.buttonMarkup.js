/*
* jQuery Mobile Framework : "buttons" plugin - for making button-like links
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
( function( $, undefined ) {

$.fn.buttonMarkup = function( options ) {
	options = options || {};

	for ( var i = 0; i < this.length; i++ ) {
		var el = this.eq( i ),
			e = el[ 0 ],
			o = $.extend( {}, $.fn.buttonMarkup.defaults, {
				icon:       options.icon       !== undefined ? options.icon       : el.jqmData( "icon" ),
				iconpos:    options.iconpos    !== undefined ? options.iconpos    : el.jqmData( "iconpos" ),
				style: el.jqmData( "style"),	/* wongi_1018 : style : default : block. Add circle & nobg */
				theme:      options.theme      !== undefined ? options.theme      : el.jqmData( "theme" ),
				inline:     options.inline     !== undefined ? options.inline     : el.jqmData( "inline" ),
				shadow:     options.shadow     !== undefined ? options.shadow     : el.jqmData( "shadow" ),
				corners:    options.corners    !== undefined ? options.corners    : el.jqmData( "corners" ),
				iconshadow: options.iconshadow !== undefined ? options.iconshadow : el.jqmData( "iconshadow" )
			}, options ),

			// Classes Defined
			innerClass = "ui-btn-inner",
			textClass = "ui-btn-text",
			buttonClass, iconClass,

			// Button inner markup
			buttonInner = document.createElement( o.wrapperEls ),
			buttonText = document.createElement( o.wrapperEls ),
			buttonIcon = o.icon ? document.createElement( "span" ) : null;

		//SLP --start -- attach slp events...
		if ( attachSLPEvents ) {
			attachSLPEvents();
		}
		/*
		if ( attachEvents ) {
			attachEvents();
		}
		*/
		//SLP --end

		// if not, try to find closest theme container
		if ( !o.theme ) {
			o.theme = $.mobile.getInheritedTheme( el, "c" );
		}

		buttonClass = "ui-btn ui-btn-up-" + o.theme;

		if ( o.inline ) {
			buttonClass += " ui-btn-inline";
		}

		if ( o.icon ) {
			o.icon = "ui-icon-" + o.icon;
			o.iconpos = o.iconpos || "left";

			iconClass = "ui-icon " + o.icon;

			if ( o.iconshadow ) {
				iconClass += " ui-icon-shadow";
			}
			
			if ($(el).text().length == 0) /* No text */
			{
				buttonClass += " ui-btn-icon_only";
			}
		}

		if ( o.iconpos ) {
			buttonClass += " ui-btn-icon-" + o.iconpos;

			if ( o.iconpos == "notext" && !el.attr( "title" ) ) {
				el.attr( "title", el.getEncodedText() );
			}
		}

		if ( o.corners ) {
			buttonClass += " ui-btn-corner-all";
			innerClass += " ui-btn-corner-all";
		}

		if ( o.shadow ) {
			buttonClass += " ui-shadow";
		}

		/* Set Button class for Icon BG */
		if (o.style == "circle")	/* Circle BG Button. */
		{
			/* wongi_1018 : style : no text, Icon only */
			buttonClass += " ui-btn-corner-circle";
			buttonClass += " ui-btn-icon_only";
		}
		else if (o.style == "nobg")
		{
			/* wongi_1018 : style : no text, Icon only, no bg */
			buttonClass += " ui-btn-icon-nobg";
			buttonClass += " ui-btn-icon_only";
		}		
		else if (o.style == "edit") /* wongi_1019 : Contact Edit style */
		{
			buttonClass += " ui-btn-edit";
		}
		
		el.attr( "data-" + $.mobile.ns + "theme", o.theme )
			.addClass( buttonClass );

		/* wongi_1018 : Text Class for text positioning with icon. */
		textClass = "ui-btn-text";
		
		if (o.icon)
		{
			if ($(el).text().length > 0)
			{
				(o.iconpos == "right" ? textClass += " ui-btn-text-padding-right" : textClass += " ui-btn-text-padding-left");
				
				innerClass += " ui-btn-hastxt";
			}
			else
			{
				if (o.style == "circle")	/* Circle BG Button. */
				{
					/* wongi_1018 : style : no text, Icon only */
					innerClass += " ui-btn-corner-circle";
				}
				else if (o.style == "nobg")
				{
					/* wongi_1018 : style : no text, Icon only, no bg */
					innerClass += " ui-btn-icon-nobg";
				}

				/* wongi_1018 : Icon Only : No padding on button-inner. */
				innerClass += " ui-btn-icon-only";
			}
		}
		else	/* Text Only */
		{
			if ($(el).text().length > 0)
			{
				innerClass += " ui-btn-hastxt";
			}
		}

		buttonInner.className = innerClass;
		buttonInner.setAttribute("aria-hidden", "true");

		buttonText.className = textClass;
		buttonInner.appendChild( buttonText );

		if ( buttonIcon ) {
			buttonIcon.className = iconClass;
			buttonInner.appendChild( buttonIcon );
		}

		while ( e.firstChild ) {
			buttonText.appendChild( e.firstChild );
		}

		e.appendChild( buttonInner );
		
		// TODO obviously it would be nice to pull this element out instead of
		// retrieving it from the DOM again, but this change is much less obtrusive
		// and 1.0 draws nigh
		el.data( 'textWrapper', $( buttonText ) );
	}

	return this;
};

$.fn.buttonMarkup.defaults = {
	corners: true,
	shadow: true,
	iconshadow: true,
	inline: false,
	wrapperEls: "span"
};

function closestEnabledButton( element ) {
    var cname;

    while ( element ) {
        cname = element.className && element.className.split(' ');
        if ( cname && $.inArray( "ui-btn", cname ) > -1 && $.inArray( "ui-disabled", cname ) < 0 ) {
            break;
        }
        element = element.parentNode;
    }

    return element;
}

//SLP --start -- attach slp events...
var selectedButton = null;
var useScrollview = false;
var attachSLPEvents = function() {
	$( document ).bind( {
		// button click event comes this order : vmouseover -> vmousedown -> vmouseup -> vmouseout
		"vmouseover focus": function( event ) {
			console.log( event.type );
			var $btn, theme;
			// check if there is selected button... if so, make it to "btn-up" state. 
			if ( selectedButton ) {
				$btn = $( selectedButton );
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
				$btn.removeClass( "ui-btn-down-" + theme ).removeClass( "ui-btn-hover-" + theme )
					.addClass( "ui-btn-up-" + theme );
			}

			// new button
			selectedButton = closestEnabledButton( event.target );
			if ( selectedButton ) {
				$btn = $( selectedButton );
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
				$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
			}
		},
		"vmouseout blur": function( event ) {
			//console.log( event.type );
			var $btn, theme;
			if ( selectedButton ) {
				$btn = $( selectedButton );
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
				$btn.removeClass( "ui-btn-hover-" + theme ).removeClass( "ui-btn-down-" + theme ).eddClass( "ui-btn-up-" + theme );
			}
		},
		"vmousedown": function( event ) {
			//console.log( event.type );
			var $btn, theme;

			if ( selectedButton ) {
				$btn = $( selectedButton );
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
				//$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
				$btn.addClass( "ui-btn-down-" + theme );
			}
		},
		"vmousecancel vmouseup": function( event ) {
			//console.log( event.type );
			var $btn, theme;
			if ( selectedButton ) {
				$btn = $( selectedButton );
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
				$btn.removeClass( "ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );

				if ( event.type === "vmousecancel" && useScrollview ) {
					event.preventDefault();
				}
				selectedButton = null;
			}
		},
		"scrollstart scrollview_scroll": function( event ) {
			//console.log( event.type );
			if ( event.type === "scrollview_scroll" )
				useScrollview = true;
			$(this).trigger("vmousecancel");
		}
	});

	attachSLPEvents = null;
};
//SLP --end
/*
var attachEvents = function() {
	$( document ).bind( {
		"vmousedown": function( event ) {
			var btn = closestEnabledButton( event.target ),
				$btn, theme;

			if ( btn ) {
				$btn = $( btn );
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
				$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-down-" + theme );
			}
		},
		"vmousecancel vmouseup": function( event ) {
			var btn = closestEnabledButton( event.target ),
				$btn, theme;

			if ( btn ) {
				$btn = $( btn );
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
				$btn.removeClass( "ui-btn-down-" + theme ).addClass( "ui-btn-up-" + theme );
			}
		},
		"vmouseover focus": function( event ) {
			var btn = closestEnabledButton( event.target ),
				$btn, theme;

			if ( btn ) {
				$btn = $( btn );
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
				$btn.removeClass( "ui-btn-up-" + theme ).addClass( "ui-btn-hover-" + theme );
			}
		},
		"vmouseout blur": function( event ) {
			var btn = closestEnabledButton( event.target ),
				$btn, theme;

			if ( btn ) {
				$btn = $( btn );
				theme = $btn.attr( "data-" + $.mobile.ns + "theme" );
				$btn.removeClass( "ui-btn-hover-" + theme ).addClass( "ui-btn-up-" + theme );
			}
		}
	});

	attachEvents = null;
};
*/
//links in bars, or those with  data-role become buttons
//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){

	$( ":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a", e.target )
		.not( ".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')" )
		.buttonMarkup();
});

})( jQuery );
