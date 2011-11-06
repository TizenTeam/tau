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

		var style = this.element.attr( "data-style" );

		if( style === "tabbar" )
		{
			this.element.addClass( "ui-controlbar-" + $.mobile.listview.prototype.options.theme  );
			this.element.addClass( "ui-tabbar-" + $.mobile.listview.prototype.options.theme  );	
		}
		else if( style === "toolbar" )
		{
			this.element.addClass( "ui-controlbar-" + $.mobile.listview.prototype.options.theme  );	
			this.element.addClass( "ui-toolbar-" + $.mobile.listview.prototype.options.theme  );			
		}		
		else  /* Style left or right */
		{
			this.element		
			.addClass( "ui-controlbar-" + style )
			.end();
		}
	
		var Prevlist_index = 100;

  		/* Fixed controlbar modify for theme-s : Jinhyuk */
		$( document ).bind( "pagebeforeshow", function( event, ui ) {
			var footer_filter = $(event.target).find(":jqmData(role='footer')");
			var navbar_filter = footer_filter.find(":jqmData(role='navbar')");

			var element_count = navbar_filter.find('li').length;			
			var style = navbar_filter.jqmData( "style" );
			
			if(style == "toolbar" || style == "tabbar")
			{
				/* Need to add text only style */
				if(!(navbar_filter.find(".ui-btn-inner").children().is(".ui-icon"))){
					navbar_filter.find(".ui-btn-inner").addClass("ui-navbar-textonly");
					navbar_filter.css("height", "99px"); 
				}
				else {
					if(navbar_filter.find(".ui-btn-text").text() == "")
					{
						navbar_filter.find(".ui-btn").css("padding-top", "20px");
					}
				}
				footer_filter
					.css("position", "fixed")
					.css("height", navbar_filter.height())
					.css("top",document.documentElement.clientHeight  - footer_filter.height());		
				
			}
			/* initialize animation class */
/*			if(navbar_filter.find("div").is(".ui-btn-animation")){
				$(".ui-btn-animation")
				.removeClass("ui-btn-ani-verticalendposition")
				.removeClass("ui-btn-ani-endposition");				
				navbar_filter.find(".ui-btn-animation").remove();
			}
*/ 		
		});	

		$( document ).bind( "pageshow", function( e, ui ){
			var navbar_filter = $(".ui-page").find(":jqmData(role='footer')").eq(0).find(":jqmData(role='navbar')");
			var element_count = navbar_filter.find('li').length;								
			var style = navbar_filter.jqmData( "style" );
					

			if(navbar_filter.find(".ui-btn-active").length ==0)
				navbar_filter.find("div").css("left","0px" );			
			else	
				navbar_filter.find("div").css("left",navbar_filter.find(".ui-btn-active").parent("li").index() * navbar_filter.width()/element_count );						

			/* Increase Content size with dummy <div> because of footer height */
			if(navbar_filter.length != 0 && $(".ui-page-active").find(".dummy-div").length == 0){
				$(".ui-page-active").find(":jqmData(role='content')").append('<div class="dummy-div"></div>');
				$(".ui-page-active").find(".dummy-div")	
					.css("width", navbar_filter.width())
					.css("height", navbar_filter.height());		
			}			
		});		
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( $.mobile.navbar.prototype.options.initSelector, e.target ).navbar();
});
})( jQuery );
