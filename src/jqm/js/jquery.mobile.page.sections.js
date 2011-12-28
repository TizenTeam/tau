/*
* jQuery Mobile Framework : This plugin handles theming and layout of headers, footers, and content areas
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
* Authors: Jinhyuk Jun <jinhyuk.jun@samsung.com>

*/

/**
 * Page can be created using the calendarpicker() method or by adding a
 * data-role="page" attribute to an element.
 *
 * Page has 3 main sub element. Header, Footer, Content
 * 3 sub element can be created using <div> element
 *
 * Attribute:
 *
 *    data-back-Btn-Text : determine which text is displayed in back button
 *    data-add-Back-Btn : Defines if header/footer has back button or not(default "false")
 *    data-back-Btn-Theme : defines back button's theme
 *    data-header-Theme = defines header <div>'s theme
 *    data-footer-Theme = defines footer <div>'s theme
 *    data-content-Theme = defines content <div>'s theme
 *    data-footer-Exist =  defines to show default footer or not in each page (SLP default true)
 *    data-footer-User-Control-Theme = defines to show default footer in whole page(SLP default false. if true, all document do not has footer)
 *
 * Examples:
 * 
 *     HTML markup for creating Page:
 *     <div data-role="page">
 *
 *     How to show back button
 *     <div data-role="page" id="no-contents-0" data-add-back-btn="true">
 *
 *     How to  remove footer of specific page
 *     <div data-role="page" id="no-contents-0" data-footer-Exist="false">
 *
 *     How to  remove footer of whole page
 *     <div data-role="page" id="no-contents-0" data-footer-User-Control="true">
*/

(function( $, undefined ) {

$.mobile.page.prototype.options.backBtnText  = "Back";
$.mobile.page.prototype.options.addBackBtn   = false;
$.mobile.page.prototype.options.backBtnTheme = null;
$.mobile.page.prototype.options.headerTheme  = "a";
$.mobile.page.prototype.options.footerTheme  = "a";
$.mobile.page.prototype.options.contentTheme = null;
$.mobile.page.prototype.options.footerExist = true; /* SLP Default Footer : Jinhyuk */
$.mobile.page.prototype.options.footerUserControl = false; /* SLP Default Footer : Jinhyuk */

$( ":jqmData(role='page'), :jqmData(role='dialog')" ).live( "pagecreate", function( e ) {
	
	var $page = $( this ),
		o = $page.data( "page" ).options,
		pageTheme = o.theme;
	
	$( ":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')", this ).each(function() {
		var $this = $( this ),
			role = $this.jqmData( "role" ),
			theme = $this.jqmData( "theme" ),
			contentTheme = theme || o.contentTheme || pageTheme,
			$headeranchors,
			leftbtn,
			rightbtn,
			normalFooter, /* SLP Default Footer : Jinhyuk */
			backBtn,
			footerExist = $this.jqmData("footerexist");  /* Footer on / off option : Wongi */
		
		if (footerExist != undefined && (footerExist == true || footerExist == false))
		{
			/*$.mobile.page.prototype.options.footerExist = footerExist;*/
			o.footerExist = footerExist;
		}
			
		$this.addClass( "ui-" + role );	

		//apply theming and markup modifications to page,header,content,footer
		if ( role === "header" || role === "footer" ) {
			
			var thisTheme = theme || ( role === "header" ? o.headerTheme : o.footerTheme ) || pageTheme;

			$this
				//add theme class
				.addClass( "ui-bar-" + thisTheme )
				// Add ARIA role
				.attr( "role", role === "header" ? "banner" : "contentinfo" );

			// Right,left buttons
			$headeranchors	= $this.children( "a" );
			leftbtn	= $headeranchors.hasClass( "ui-btn-left" );
			rightbtn = $headeranchors.hasClass( "ui-btn-right" );

			leftbtn = leftbtn || $headeranchors.eq( 0 ).not( ".ui-btn-right" ).addClass( "ui-btn-left" ).length;
			
			rightbtn = rightbtn || $headeranchors.eq( 1 ).addClass( "ui-btn-right" ).length;
			
			if(o.footerUserControl)
				$.mobile.page.prototype.options.footerUserControl = "true";
			
			// Auto-add back btn on pages beyond first view
			if ( o.addBackBtn && 
				o.footerExist && /* SLP Default Footer : Jinhyuk */
				(role === "footer"  ) &&
//				$( ".ui-page" ).length > 1 &&
				$this.jqmData( "url" ) !== $.mobile.path.stripHash( location.hash ) &&
				!leftbtn ) {

				// SLP -- start jinhyuk.. remove arrow-l, change left btn to back
				//backBtn = $( "<a href='#' class='ui-btn-left' data-"+ $.mobile.ns +"rel='back' data-"+ $.mobile.ns +"icon='arrow-l'>"+ o.backBtnText +"</a>" )
				backBtn = $( "<a href='#' class='ui-btn-back' data-"+ $.mobile.ns +"rel='back' data-"+ $.mobile.ns +"icon='header-back-btn'></a>" )
				// SLP --end
					// If theme is provided, override default inheritance
					.attr( "data-"+ $.mobile.ns +"theme", o.backBtnTheme || thisTheme )
					.prependTo( $this );

				// SLP --start back btn : 11/14 jqm back btn has a bug.... temporary fix.
				backBtn.bind( "vclick", function( event ) {
					window.history.back();
					return false;
				});
				// SLP --end

			}

			// Page title
			$this.children( "h1, h2, h3, h4, h5, h6" )
				.addClass( "ui-title" )
				// Regardless of h element number in src, it becomes h1 for the enhanced page
				.attr({
					"tabindex": "0",
					"role": "heading",
					"aria-level": "1"
				});
			//SLP -- start
			// prevent winset selection for header & footer
			$this.preventDefaultBehaviour();
			//SLP -- end

		} else if ( role === "content" ) {
			if ( contentTheme ) {
			    $this.addClass( "ui-body-" + ( contentTheme ) );
			}

			// Add ARIA role
			$this.attr( "role", "main" );

			/* Add default footer to add backbtn */
			thisTheme = "s";
			if(o.footerExist){
				backBtn = $( "<a href='#' class='ui-btn-back' data-"+ $.mobile.ns +"rel='back' data-"+ $.mobile.ns +"icon='header-back-btn'></a>" )
					.attr( "data-"+ $.mobile.ns +"theme", o.backBtnTheme || thisTheme );

				if($page.find("div:jqmData(role='footer')").length != 0){
					if(!$page.find("div:jqmData(role='footer')").find("jqmData(role='navbar')").is("jqmData(style='tabbar')")){				
						backBtn.appendTo($page.find("div:jqmData(role='footer')"));	
					}
				}
				else{
					if(!$.mobile.page.prototype.options.footerUserControl) {
						normalFooter = $("<div data-role='footer' class='ui-footer ui-bar-s ui-footer-fixed fade ui-fixed-overlay' data-position='fixed'></div>")
						.insertAfter($page.find( ".ui-content" ));
						backBtn.appendTo(normalFooter);						
					}											
				}	
				if(backBtn){
					backBtn.bind( "vclick", function( event ) {
							window.history.back();
							return false;
					});			
				}		
			}
		}
	});
});

})( jQuery );
