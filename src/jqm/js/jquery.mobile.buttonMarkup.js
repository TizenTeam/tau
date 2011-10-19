/*
* jQuery Mobile Framework : plugin for making button-like links
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
( function( $, undefined ) {

$.fn.buttonMarkup = function( options ) {
	return this.each( function() {
		var el = $( this ),
			o = $.extend( {}, $.fn.buttonMarkup.defaults, {
				icon: el.jqmData( "icon" ),
				iconpos: el.jqmData( "iconpos" ),
				iconbg: el.jqmData( "iconbg"),	/* wongi_1018 : icon BG : default : block. Add circle & nobg */
				theme: el.jqmData( "theme" ),
				inline: el.jqmData( "inline" )
			}, options ),

			// Classes Defined
			innerClass = "ui-btn-inner",
			buttonClass, iconClass,
			textClass,	/* wongi_1018 : For text positioning with Icon */
			themedParent, wrap;

		if ( attachEvents ) {
			attachEvents();
		}
		
		// if not, try to find closest theme container
		if ( !o.theme ) {
			themedParent = el.closest( "[class*='ui-bar-'],[class*='ui-body-']" );
			o.theme = themedParent.length ?
				/ui-(bar|body)-([a-z])/.exec( themedParent.attr( "class" ) )[2] :
				"c";
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
		if (o.iconbg == "circle")	/* Circle BG Button. */
		{
			/* wongi_1018 : Icon pos : no text, Icon only */
			buttonClass += " ui-btn-corner-circle";
		}
		else if (o.iconbg == "nobg")
		{
			/* wongi_1018 : Icon pos : no text, Icon only, no bg */
			buttonClass += " ui-btn-icon-nobg";
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
			}
			else
			{
				if (o.iconbg == "circle")	/* Circle BG Button. */
				{
					/* wongi_1018 : Icon pos : no text, Icon only */
					innerClass += " ui-btn-corner-circle";
				}
				else if (o.iconbg == "nobg")
				{
					/* wongi_1018 : Icon pos : no text, Icon only, no bg */
					innerClass += " ui-btn-icon-nobg";
				}

				/* wongi_1018 : Icon Only : No padding on button-inner. */
				innerClass += " ui-btn-icon-only";
			}
		}
		else	/* Text Only */
		{
			/* Do nothing */
		}
		
		
		wrap = ( "<D class='" + innerClass + "' aria-hidden='true'><D class='" + textClass + "'></D>" +
			( o.icon ? "<span class='" + iconClass + "'></span>" : "" ) +
			"</D>" ).replace( /D/g, o.wrapperEls );

		el.wrapInner( wrap );
	});
};

$.fn.buttonMarkup.defaults = {
	corners: true,
	shadow: true,
	iconshadow: true,
	inline: false,
	wrapperEls: "span"
};

function closestEnabledButton( element ) {
	while ( element ) {
		var $ele = $( element );
		if ( $ele.hasClass( "ui-btn" ) && !$ele.hasClass( "ui-disabled" ) ) {
			break;
		}
		/* wongi_1013 : SLP Button */
		else if( $ele.hasClass( "ui-slp-btn" ) && !$ele.hasClass( "ui-disabled" ) ) {
			break;
		}
		element = element.parentNode;
	}
	return element;
}

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

//links in bars, or those with  data-role become buttons
//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){

	$( ":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a", e.target )
		.not( ".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')" )
		.buttonMarkup();
});
})( jQuery );
