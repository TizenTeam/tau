/*
* jQuery Mobile Framework : "navbar" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

(function( $, undefined ) {

$.widget( "mobile.navbar", $.mobile.widget, {
	options: {
		iconpos: "top",
		grid: null,
		initSelector: ":jqmData(role='navbar')"
	},

	_create: function(){

		var $navbar = this.element,
			$navbtns = $navbar.find( "a" ),
			iconpos = $navbtns.filter( ":jqmData(icon)" ).length ?
									this.options.iconpos : undefined;

		$navbar.addClass( "ui-navbar" )
			.attr( "role","navigation" )
			.find( "ul" )
				.grid({ grid: this.options.grid });

		if ( !iconpos ) {
			$navbar.addClass( "ui-navbar-noicons" );
		}

		$navbtns.buttonMarkup({
			corners:	false,
			shadow:		false,
			iconpos:	iconpos
		});

		$navbar.delegate( "a", "vclick", function( event ) {
			$navbtns.not( ".ui-state-persist" ).removeClass( $.mobile.activeBtnClass );
			$( this ).addClass( $.mobile.activeBtnClass );
		});
		
		
		/* Jinhyuk_ControlBar */
		var style = this.element.attr( "data-style" );

		if( style === "tabbar" )
		{
			footer = this.element.closest( ":jqmData(role='footer')" );
			footer.removeClass( "ui-toolbar-" + $.mobile.listview.prototype.options.theme  );
			footer.removeClass( "ui-bar-" + $.mobile.listview.prototype.options.theme  );
			footer.addClass( "ui-controlbar-" + $.mobile.listview.prototype.options.theme  );	
		}
		else if( style === "toolbar" )
		{
			footer = this.element.closest( ":jqmData(role='footer')" );
			footer.removeClass( "ui-bar-" + $.mobile.listview.prototype.options.theme  );
			footer.addClass( "ui-controlbar-" + $.mobile.listview.prototype.options.theme  );	
			footer.addClass( "ui-toolbar-" + $.mobile.listview.prototype.options.theme  );			
		}		
		else if( style === "left" )
		{
			this.element		
			.addClass( "ui-controlbar-left" )
			.end();
		}
		else if( style === "right" )
		{
			this.element		
			.addClass( "ui-controlbar-right" )
			.end();
		}		
		//SLP --end		
		
		
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( $.mobile.navbar.prototype.options.initSelector, e.target ).navbar();
});

/* Jinhyuk_Controlbar */

$(document).bind( "pagebeforeshow", function( e, ui ){
	var linkURL = this.URL.split("#");
	var linkid = linkURL[1]; 
	var	element_count = $("#"+linkid).find(":jqmData(role='navbar')").find('li').length;

	var navbar_filter = $("#"+linkid).find(":jqmData(role='navbar')");
	var direction = navbar_filter.jqmData( "style" );
	
	if(direction == "toolbar" || direction == "tabbar")
	{
		if(!(navbar_filter.find(".ui-btn-inner").children().is(".ui-icon")))
		{
			navbar_filter.find(".ui-btn-inner")
				.css("padding-top","1.8em")
				.css("padding-bottom","1.8em");
		}
	}

	var nav_Top = $(document).find(".ui-page-active").find(".ui-header").height();
	var nav_Height = ($(document).find(".ui-page-active").height() - nav_Top);
	var list_Height = nav_Height/element_count;
	
	$(document).find(".ui-controlbar-"+direction)
		.css('top', nav_Top)
		.css('height', nav_Height)
		.find("ul").css('height', nav_Height);
	$(".ui-controlbar-"+direction).find('li')
		.css('height',list_Height )
		.find('.ui-btn').css('height',list_Height );
});
})( jQuery );
