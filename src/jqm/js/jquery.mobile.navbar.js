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
					var list_height = (window.innerHeight - $(document).find(".ui-page-active").find(".ui-header").height())/element_count;

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

/* Jinhyuk_Controlbar */
$(document).bind( "pageshow", function( e, ui ){
	var linkURL = this.URL.split("#");
	var linkid = linkURL[1]; 
	var	element_count = $("#"+linkid).find(":jqmData(role='navbar')").find('li').length;

	var navbar_filter = $("#"+linkid).find(":jqmData(role='navbar')");
	var style = navbar_filter.jqmData( "style" );

	if(!($("#"+linkid).find(".ui-navbar div").is("ui-btn-animation")) && style != "toolbar"){					
		$("#"+linkid).find(".ui-navbar").children().append("<div></div>")
			.find("div").addClass("ui-btn-animation")	
			.removeClass("ui-btn-ani-verticalendposition")
			.removeClass("ui-btn-ani-endposition");
	
		if(style =="tabbar"){		
			$("#"+linkid).find(".ui-navbar").find("div")						
				.css("width", $("#"+linkid).find('.ui-navbar').width()/element_count )
				.css("height",$("#"+linkid).find(".ui-navbar").css("height"))
				.css("left", 0 * $("#"+linkid).find('.ui-navbar').width()/element_count )
				.css("top", window.innerHeight-$("#"+linkid).find(".ui-navbar").height() );
		}
		else {
			$("#"+linkid).find(".ui-navbar").find("div")						
				.css("width", "92px" )   /* Need to change for guideline */
				.css("height",(window.innerHeight - $(document).find(".ui-header").height())/element_count )
				.css("top", $(document).find(".ui-page-active").find(".ui-header").height() )
				.css(style, "0px");
		}
	}
});

$(document).bind( "pagebeforeshow", function( e, ui ){
	var linkURL = this.URL.split("#");
	var linkid = linkURL[1]; 
	var	element_count = $("#"+linkid).find(":jqmData(role='navbar')").find('li').length;

	var navbar_filter = $("#"+linkid).find(":jqmData(role='navbar')");
	var style = navbar_filter.jqmData( "style" );
	
	if(style == "toolbar" || style == "tabbar")
	{
		if(!(navbar_filter.find(".ui-btn-inner").children().is(".ui-icon"))){
			navbar_filter.find(".ui-btn-inner").addClass("ui-navbar-textonly");
			$("#"+linkid).find(".ui-controlbar-s").css("height", "99px"); 
			/* Need to change guide line */
		}
		$("#"+linkid).find(".ui-controlbar-s").css("top",window.innerHeight - $("#"+linkid).find(".ui-controlbar-s").height());			
			
	}
	else if(style == "left" || style == "right"){
		var nav_Top = $(document).find(".ui-page-active").find(".ui-header").height();
		var nav_Height = (window.innerHeight - nav_Top);
		var list_Height = nav_Height/element_count;		

		/* list overflow prevent */
		/* Need to change pixel GUI guideline publish */
		if(style == "left")
			$("#"+linkid).find(".ui-content").css("padding-"+style, "105px");
		else
			$("#"+linkid).find(".ui-content").css("padding-"+style, "80px");		
		
		$(document).find(".ui-controlbar-"+style)
			.css('top', nav_Top)
			.css('height', nav_Height)
			.find("ul").css('height', nav_Height);
		$(".ui-controlbar-"+style).find('li')
			.css('height',list_Height )
			.find('.ui-btn').css('height',list_Height );	
	}
	
	/* initialize animation class */
	if($(".ui-navbar").find("div").is(".ui-btn-animation")){
		$(".ui-btn-animation")
			.removeClass("ui-btn-ani-verticalendposition")
			.removeClass("ui-btn-ani-endposition");				
		$(".ui-navbar").find("div").remove();
	}		
});
})( jQuery );
