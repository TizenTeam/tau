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
			this.element.removeClass( "ui-toolbar-" + $.mobile.listview.prototype.options.theme  );
			this.element.removeClass( "ui-bar-" + $.mobile.listview.prototype.options.theme  );
			this.element.addClass( "ui-controlbar-" + $.mobile.listview.prototype.options.theme  );
			this.element.addClass( "ui-tabbar-" + $.mobile.listview.prototype.options.theme  );	
		}
		else if( style === "toolbar" )
		{
			this.element.removeClass( "ui-tabbar-" + $.mobile.listview.prototype.options.theme  );
			this.element.removeClass( "ui-bar-" + $.mobile.listview.prototype.options.theme  );
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

		$(".ui-navbar li").bind({
			vclick: function(event, ui) {
				$(event.target).parents("a").addClass("ui-btn-active");
			}
		});
		
		$( document ).bind( "pageshow", function( e, ui ){
			var navbar_filter = $(".ui-page-active").find(":jqmData(role='footer')").find(":jqmData(role='navbar')");
			var element_count = navbar_filter.find('li').length;					
			
			var style = navbar_filter.jqmData( "style" );
		
			if(!(navbar_filter.find("div").is("ui-btn-animation")) && style != "toolbar"){					
				navbar_filter.children().append("<div></div>")
					.find("div").addClass("ui-btn-animation")	
					.removeClass("ui-btn-ani-verticalendposition")
					.removeClass("ui-btn-ani-endposition");
		
				if(style =="tabbar"){
					
							
					navbar_filter.find("div")						
						.css("width", navbar_filter.width()/element_count )
						.css("height",navbar_filter.css("height"))
						.css("top", "0px" );

					if(navbar_filter.find(".ui-btn-active").length ==0)
						navbar_filter.find("div").css("left","0px" );			
					else	
						navbar_filter.find("div").css("left",navbar_filter.find(".ui-btn-active").parent("li").index() * $(".ui-page").find('.ui-navbar').width()/element_count )
						
				}
				else {
					navbar_filter.find("div")						
						.css("width", "92px" )   /* Need to change for guideline */
						.css("height",(document.documentElement.clientHeight  - $(".ui-page-active").find(".ui-header").height())/element_count )
						.css("top", $(".ui-page-active").find(".ui-header").height() )
						.css(style, "0px");
				}
			}
		});
		
		$( document ).bind( "pagebeforeshow", function( event, ui ) {  /* Fixed header modify for theme-s : Jinhyuk */
			var footer_filter = $(event.target).find(":jqmData(role='footer')");
			var navbar_filter = footer_filter.find(":jqmData(role='navbar')");

			var element_count = navbar_filter.find('li').length;			
			
			var style = navbar_filter.jqmData( "style" );
			
			if(style == "toolbar" || style == "tabbar")
			{
				if(!(navbar_filter.find(".ui-btn-inner").children().is(".ui-icon"))){
					navbar_filter.find(".ui-btn-inner").addClass("ui-navbar-textonly");
					navbar_filter.css("height", "99px"); 
				}			
				footer_filter
					.css("position", "fixed")
					.css("height", navbar_filter.height())
					.css("top",document.documentElement.clientHeight  - footer_filter.height());			
			}
			else if(style == "left" || style == "right"){	
				var nav_Top = $(".ui-page-active").find(".ui-header").height();
				var nav_Height = (document.documentElement.clientHeight  - nav_Top);
				var list_Height = nav_Height/element_count;		
			
				if(style == "left")
					$(event.target).find(".ui-content").css("padding-"+style, "105px");
				else
					$(event.target).find(".ui-content").css("padding-"+style, "80px");		
				
				$(event.target).find(".ui-controlbar-"+style)
					.css('top', nav_Top)
					.css('height', nav_Height)
					.find("ul").css('height', nav_Height);
				$(".ui-controlbar-"+style).find('li')
					.css('height',list_Height )
					.find('.ui-btn').css('height',list_Height );	
			}
			
			/* initialize animation class */
			if(navbar_filter.find("div").is(".ui-btn-animation")){
				$(".ui-btn-animation")
				.removeClass("ui-btn-ani-verticalendposition")
				.removeClass("ui-btn-ani-endposition");				
				navbar_filter.find(".ui-btn-animation").remove();
			}		
		});	

		 $(".ui-navbar").bind({
			vclick: function() {	
				var	element_count = $(".ui-page-active").find('.ui-navbar').find('li').length;
				var Nextlist_index = $(".ui-page-active").find('li .ui-btn-active').parent().index();				

				style = $(".ui-page-active").find(".ui-navbar").jqmData( "style" );

				if(style == "tabbar"){
					var list_width = $(".ui-page-active").find('.ui-navbar').width()/element_count;
					
					$(".ui-page-active").find(".ui-btn-animation")
						.css("width", list_width )
						.css("height","123px" )
						.css("bottom", "0px")
					.css("left", Nextlist_index *list_width );

					$(".ui-btn-ani-startposition").css("-webkit-transform","translateX("+Prevlist_index *list_width+")");
					$(".ui-page-active").find(".ui-btn-animation").addClass("ui-btn-ani-startposition");
					
					var t=setTimeout("",10);
					$(".ui-btn-ani-endposition").css("-webkit-transform","translateX("+Nextlist_index *list_width+")");
					$(".ui-page-active").find(".ui-btn-animation").removeClass("ui-btn-ani-startposition");
					$(".ui-page-active").find(".ui-btn-animation").addClass("ui-btn-ani-endposition");
				}					
				else if(style == "left" || style == "right" ){
					var list_height = (document.documentElement.clientHeight  - $(document).find(".ui-page-active").find(".ui-header").height())/element_count;

					$(".ui-page-active").find(".ui-btn-animation")
						.css("width", "92px" ) /* Need to change guideline */
						.css("height",list_height )
						.css("top", Nextlist_index *list_height + $(document).find(".ui-page-active").find(".ui-header").height() )
						.css(style, "0px");
					
					$(".ui-btn-ani-verticalstartposition").css("-webkit-transform","translateY("+Prevlist_index *list_height+")");
					$(".ui-page-active").find(".ui-btn-animation").addClass("ui-btn-ani-verticalstartposition");
					
					var t=setTimeout("",10);

					$(".ui-btn-ani-verticalendposition").css("-webkit-transform","translateY("+Nextlist_index *list_height+")");
					$(".ui-page-active").find(".ui-btn-animation").removeClass("ui-btn-ani-verticalstartposition");
					$(".ui-page-active").find(".ui-btn-animation").addClass("ui-btn-ani-verticalendposition");
				}
				
				Prevlist_index = Nextlist_index;	 			
			}
		})
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( $.mobile.navbar.prototype.options.initSelector, e.target ).navbar();
});


			
})( jQuery );
