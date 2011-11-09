/*
* jQuery Mobile Framework : "fixHeaderFooter" plugin - on-demand positioning for headers,footers
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

(function( $, undefined ) {

var slideDownClass = "ui-header-fixed ui-fixed-inline fade",
	slideUpClass = "ui-footer-fixed ui-fixed-inline fade",

	slideDownSelector = ".ui-header:jqmData(position='fixed')",
	slideUpSelector = ".ui-footer:jqmData(position='fixed')";

$.fn.fixHeaderFooter = function( options ) {

	if ( !$.support.scrollTop || ( $.support.touchOverflow && $.mobile.touchOverflowEnabled ) ) {
		return this;
	}

	return this.each(function() {
		var $this = $( this );

		if ( $this.jqmData( "fullscreen" ) ) {
			$this.addClass( "ui-page-fullscreen" );
		}

		// Should be slidedown
		$this.find( slideDownSelector ).addClass( slideDownClass );

		// Should be slideup
		$this.find( slideUpSelector ).addClass( slideUpClass );
	});
};

// single controller for all showing,hiding,toggling
$.mobile.fixedToolbars = (function() {

	if ( !$.support.scrollTop || ( $.support.touchOverflow && $.mobile.touchOverflowEnabled ) ) {
		return;
	}

	var stickyFooter, delayTimer,
		currentstate = "inline",
		autoHideMode = false,
		showDelay = 100,
		ignoreTargets = "a,input,textarea,select,button,label,.ui-header-fixed,.ui-footer-fixed",
		toolbarSelector = ".ui-header-fixed:first, .ui-footer-fixed:not(.ui-footer-duplicate):last",
		// for storing quick references to duplicate footers
		supportTouch = $.support.touch,
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = supportTouch ? "touchend" : "mouseup",
		stateBefore = null,
		scrollTriggered = false,
		touchToggleEnabled = true;

	function showEventCallback( event ) {
		// An event that affects the dimensions of the visual viewport has
		// been triggered. If the header and/or footer for the current page are in overlay
		// mode, we want to hide them, and then fire off a timer to show them at a later
		// point. Events like a resize can be triggered continuously during a scroll, on
		// some platforms, so the timer is used to delay the actual positioning until the
		// flood of events have subsided.
		//
		// If we are in autoHideMode, we don't do anything because we know the scroll
		// callbacks for the plugin will fire off a show when the scrolling has stopped.


		/* resize test : Jinhyuk    */
		var footer_filter = $(document).find(":jqmData(role='footer')");		
		
		footer_filter
			.css("top",document.documentElement.clientHeight  - footer_filter.height())
			.show();		
		/* resize test : Jinhyuk    */

		if ( !autoHideMode && currentstate === "overlay" ) {
			if ( !delayTimer ) {
				/* Fixed header modify for theme-s : Jinhyuk */
				if(!($( event.target).find( ":jqmData(role='header')" ).is(":jqmData(position='fixed')")&&
				$( event.target).find( ":jqmData(role='header')" ).is(".ui-bar-s")))				
					$.mobile.fixedToolbars.hide( true );
			}
			$.mobile.fixedToolbars.startShowTimer(); 
		}
	}

	$(function() {
		var $document = $( document ),
			$window = $( window );

		$document
			.bind( "vmousedown", function( event ) {
				if ( touchToggleEnabled ) {
					stateBefore = currentstate;
				}
			})
			.bind( "vclick", function( event ) {
				if ( touchToggleEnabled ) {

					if ( $(event.target).closest( ignoreTargets ).length ) {
						return;
					}

					if ( !scrollTriggered ) {
						$.mobile.fixedToolbars.toggle( stateBefore );
						stateBefore = null;
					}
				}
			})
			.bind( "silentscroll", showEventCallback );


		// The below checks first for a $(document).scrollTop() value, and if zero, binds scroll events to $(window) instead.
		// If the scrollTop value is actually zero, both will return zero anyway.
		//
		// Works with $(document), not $(window) : Opera Mobile (WinMO phone; kinda broken anyway)
		// Works with $(window), not $(document) : IE 7/8
		// Works with either $(window) or $(document) : Chrome, FF 3.6/4, Android 1.6/2.1, iOS
		// Needs work either way : BB5, Opera Mobile (iOS)

		( ( $document.scrollTop() === 0 ) ? $window : $document )
			.bind( "scrollstart", function( event ) {
				/* Fixed header modify for theme-s : Jinhyuk */
				if(!$( event.target).find( ":jqmData(role='header')" ).is(":jqmData(position='fixed')"))
				{
					scrollTriggered = true;
	
					if ( stateBefore === null ) {
						stateBefore = currentstate;
					}
	
					// We only enter autoHideMode if the headers/footers are in
					// an overlay state or the show timer was started. If the
					// show timer is set, clear it so the headers/footers don't
					// show up until after we're done scrolling.
					var isOverlayState = stateBefore == "overlay";
	
					autoHideMode = isOverlayState || !!delayTimer;
	
					if ( autoHideMode ) {
						$.mobile.fixedToolbars.clearShowTimer();
	
						if ( isOverlayState ) {
								$.mobile.fixedToolbars.hide( true );
						}
					}	 		
				}
			})

			.bind( "scrollstop", function( event ) {
				if ( $( event.target ).closest( ignoreTargets ).length ) {
					return;
				}

				scrollTriggered = false;

				if ( autoHideMode ) {
					$.mobile.fixedToolbars.startShowTimer();
					autoHideMode = false;
				}
				stateBefore = null;
			});

			$window.bind( "resize", showEventCallback );
	});

	// 1. Before page is shown, check for duplicate footer
	// 2. After page is shown, append footer to new page
	$( ".ui-page" )  /* Fixed header modify for theme-s : Jinhyuk */
		.live( "pagebeforeshow", function( event, ui ) {
			var s_theme_header = $( event.target ).find(":jqmData(role='header')");
			
				if(s_theme_header.find(".ui-option-header").length == 0 && s_theme_header.is(".ui-header-fixed") && s_theme_header.is(".ui-bar-s")){
					s_theme_header
						.css("position", "fixed")
						.css("top", "0px");
					if(s_theme_header.find(":jqmData(role='fieldcontain')").length == 0){				
						if(s_theme_header.find("a").length == 1 || s_theme_header.find("a").length == 2){}
						else if(s_theme_header.find("a").length == 3){
							s_theme_header.find("a").eq(1).removeClass("ui-btn-right");
							s_theme_header.find("a").eq(1).addClass("ui-title-normal-3btn");					
							s_theme_header.find("a").eq(2).addClass("ui-btn-right");
						} else {/* Need to implement new layout */}
						
						$( event.target ).find(".ui-content").addClass("ui-title-content-normal-height");
						
					}
					else{
						var group_length = s_theme_header.find(":jqmData(role='fieldcontain')").find(".ui-radio").length;
						
						s_theme_header.addClass("ui-title-extended-height");
						s_theme_header.find(":jqmData(role='fieldcontain')").find(".ui-controlgroup")
							.addClass("ui-title-extended-controlgroup");
							
						s_theme_header.find(":jqmData(role='fieldcontain')")						
							.addClass("ui-title-extended-segment-style");
	
						if(group_length == 2)
							s_theme_header.find(":jqmData(role='fieldcontain')").find(".ui-controlgroup").addClass("ui-title-extended-controlgroup-2btn");
						else if(group_length == 3)
							s_theme_header.find(":jqmData(role='fieldcontain')").find(".ui-controlgroup").addClass("ui-title-extended-controlgroup-3btn");
						else { /* Need to implement new layout */}
						
						$( event.target ).find(".ui-content").addClass("ui-title-content-extended-height");
					}		
				}	

				var page = $( event.target ),
				footer = page.find( ":jqmData(role='footer')" ),
				id = footer.data( "id" ),
				prevPage = ui.prevPage,
				prevFooter = prevPage && prevPage.find( ":jqmData(role='footer')" ),
				prevFooterMatches = prevFooter.length && prevFooter.jqmData( "id" ) === id;

				if ( id && prevFooterMatches ) {
					stickyFooter = footer;
//					setTop( stickyFooter.removeClass( "fade in out" ).appendTo( $.mobile.pageContainer ) );
					stickyFooter.removeClass( "fade in out" ).appendTo( $.mobile.pageContainer );
					stickyFooter
						.css("position", "fixed")
						.css("top", $(".ui-page").find(":jqmData(role='footer')").eq(0).css("top"));
					
				}									
			/* Header position fix : Jinhyuk */
			var next_id = $( event.target).attr("id");
			$("#"+next_id).find(":jqmData(role='header')").removeClass( "fade in out" ).appendTo($.mobile.pageContainer);
											
		})

		.live( "pageshow", function( event, ui ) {
			/* Fixed header modify for theme-s : Jinhyuk */
			if(($( event.target ).find( ":jqmData(role='header')" ).is(".ui-header-fixed")&&
			$( event.target ).find( ":jqmData(role='header')" ).is(".ui-bar-s"))){	
				$( event.target ).find( ":jqmData(role='header')" )
					.css("position", "fixed")
					.css("top", "0px");
				 (( $( document ).scrollTop() === 0 ) ? $( window ) : $( document ) )
					.unbind( "scrollstart")
					.unbind( "silentscroll")
					.unbind( "scrollstop");
			}

			var $this = $( this );

			if ( stickyFooter && stickyFooter.length ) {

				setTimeout(function() {
					setTop( stickyFooter.appendTo( $this ).addClass( "fade" ) );
					stickyFooter = null;
				}, 500);
			}

			$.mobile.fixedToolbars.show( true, this );					

			/* Header position fix : Jinhyuk */
			$("body").children(":jqmData(role='header')").insertBefore($(event.target).find(":jqmData(role='content')").eq(0));
		})

		.live( "vclick", function( event, ui ) {
/*
			var previous_index = $(".ui-page-active").find(":jqmData(role='footer')" ).find(".ui-state-persist").parents("li").index();
			var active_index = $(event.target).parents("li").index();
			var navbar_filter = $(".ui-page-active").find(":jqmData(role='footer')" ).find(":jqmData(role='navbar')");
			var element_count = navbar_filter.find('li').length;
			var style = navbar_filter.jqmData( "style" );
			var list_width = $(".ui-page-active").find('.ui-navbar').width()/element_count;
			
			var next_link = $(event.target).parents("a").attr("href");
			
			
			$(".ui-page-active").addClass("ui-btn-hide-style");


			if(navbar_filter.find(".ui-btn-animation").length == 0 && style != "toolbar"){					
				$('<div class="ani-focus"></div>').appendTo(navbar_filter.children());
				$(".ani-focus")
					.addClass("ui-btn-animation")	
					.removeClass("ui-btn-ani-verticalendposition")
					.removeClass("ui-btn-ani-endposition");

			}					
				$(".ani-focus")				
					.css("width", navbar_filter.width()/element_count )
					.css("height",navbar_filter.css("height"))	
					.css("left", previous_index * list_width);


				$(".ui-btn-ani-startposition").css("-webkit-transform","translateX("+previous_index *list_width+")");
				$(".ani-focus").addClass("ui-btn-ani-startposition");
				
				var t=setTimeout("",10);
				$(".ui-btn-ani-endposition").css("-webkit-transform","translateX("+active_index *list_width+")");
				$(".ani-focus").removeClass("ui-btn-ani-startposition");
				$(".ani-focus").addClass("ui-btn-ani-endposition");
*/
		});
		

	// When a collapsiable is hidden or shown we need to trigger the fixed toolbar to reposition itself (#1635)
	$( ".ui-collapsible-contain" ).live( "collapse expand", showEventCallback );

	// element.getBoundingClientRect() is broken in iOS 3.2.1 on the iPad. The
	// coordinates inside of the rect it returns don't have the page scroll position
	// factored out of it like the other platforms do. To get around this,
	// we'll just calculate the top offset the old fashioned way until core has
	// a chance to figure out how to handle this situation.
	//
	// TODO: We'll need to get rid of getOffsetTop() once a fix gets folded into core.

	function getOffsetTop( ele ) {
		var top = 0,
			op, body;

		if ( ele ) {
			body = document.body;
			op = ele.offsetParent;
			top = ele.offsetTop;

			while ( ele && ele != body ) {
				top += ele.scrollTop || 0;

				if ( ele == op ) {
					top += op.offsetTop;
					op = ele.offsetParent;
				}

				ele = ele.parentNode;
			}
		}
		return top;
	}

	function setTop( el ) {
		if(!(el.parents(".ui-page").find( ":jqmData(role='header')" ).is(".ui-header-fixed")&&
		el.parents(".ui-page").find( ":jqmData(role='header')" ).is(".ui-bar-s"))){				
			var fromTop = $(window).scrollTop(),
				thisTop = getOffsetTop( el[ 0 ] ), // el.offset().top returns the wrong value on iPad iOS 3.2.1, call our workaround instead.
				thisCSStop = el.css( "top" ) == "auto" ? 0 : parseFloat(el.css( "top" )),
				screenHeight = window.innerHeight,
				thisHeight = el.outerHeight(),
				useRelative = el.parents( ".ui-page:not(.ui-page-fullscreen)" ).length,
				relval;
	
			if ( el.is( ".ui-header-fixed" ) ) {
	
				relval = fromTop - thisTop + thisCSStop;
	
				if ( relval < thisTop ) {
					relval = 0;
				}
	
				return el.css( "top", useRelative ? relval : fromTop );
			} else {
				// relval = -1 * (thisTop - (fromTop + screenHeight) + thisCSStop + thisHeight);
				// if ( relval > thisTop ) { relval = 0; }
				relval = fromTop + screenHeight - thisHeight - (thisTop - thisCSStop );
	
				return el.css( "top", useRelative ? relval : fromTop + screenHeight - thisHeight );
			}
		}

	}

	// Exposed methods
	return {

		show: function( immediately, page ) {

			$.mobile.fixedToolbars.clearShowTimer();

			currentstate = "overlay";

			var $ap = page ? $( page ) :
					( $.mobile.activePage ? $.mobile.activePage :
						$( ".ui-page-active" ) );

			return $ap.children( toolbarSelector ).each(function() {

				var el = $( this ),
					fromTop = $( window ).scrollTop(),
					// el.offset().top returns the wrong value on iPad iOS 3.2.1, call our workaround instead.
					thisTop = getOffsetTop( el[ 0 ] ),
					screenHeight = window.innerHeight,
					thisHeight = el.outerHeight(),
					alreadyVisible = ( el.is( ".ui-header-fixed" ) && fromTop <= thisTop + thisHeight ) ||
														( el.is( ".ui-footer-fixed" ) && thisTop <= fromTop + screenHeight );

				// Add state class
				el.addClass( "ui-fixed-overlay" ).removeClass( "ui-fixed-inline" );

				if ( !alreadyVisible && !immediately ) {
					el.animationComplete(function() {
						el.removeClass( "in" );
					}).addClass( "in" );
				}
				setTop(el);
			});
		},

		hide: function( immediately ) {

			currentstate = "inline";

			var $ap = $.mobile.activePage ? $.mobile.activePage :
									$( ".ui-page-active" );

			return $ap.children( toolbarSelector ).each(function() {

				var el = $(this),
					thisCSStop = el.css( "top" ),
					classes;

				thisCSStop = thisCSStop == "auto" ? 0 :
											parseFloat(thisCSStop);

				// Add state class
				el.addClass( "ui-fixed-inline" ).removeClass( "ui-fixed-overlay" );

				if ( thisCSStop < 0 || ( el.is( ".ui-header-fixed" ) && thisCSStop !== 0 ) ) {

					if ( immediately ) {
						el.css( "top", 0);
					} else {

						if ( el.css( "top" ) !== "auto" && parseFloat( el.css( "top" ) ) !== 0 ) {

							classes = "out reverse";

							el.animationComplete(function() {
								el.removeClass( classes ).css( "top", 0 );
							}).addClass( classes );
						}
					}
				}
			});
		},

		startShowTimer: function() {

			$.mobile.fixedToolbars.clearShowTimer();

			var args = [].slice.call( arguments );

			delayTimer = setTimeout(function() {
				delayTimer = undefined;
				$.mobile.fixedToolbars.show.apply( null, args );
			}, showDelay);
		},

		clearShowTimer: function() {
			if ( delayTimer ) {
				clearTimeout( delayTimer );
			}
			delayTimer = undefined;
		},

		toggle: function( from ) {
			if ( from ) {
				currentstate = from;
			}
			return ( currentstate === "overlay" ) ? $.mobile.fixedToolbars.hide() :
								$.mobile.fixedToolbars.show();
		},

		setTouchToggleEnabled: function( enabled ) {
			touchToggleEnabled = enabled;
		}
	};
})();

//auto self-init widgets
$( document ).bind( "pagecreate create", function( event ) {

	if ( $( ":jqmData(position='fixed')", event.target ).length ) {

		$( event.target ).each(function() {

			if ( !$.support.scrollTop || ( $.support.touchOverflow && $.mobile.touchOverflowEnabled ) ) {
				return this;
			}

			var $this = $( this );

			if ( $this.jqmData( "fullscreen" ) ) {
				$this.addClass( "ui-page-fullscreen" );
			}

			// Should be slidedown
			$this.find( slideDownSelector ).addClass( slideDownClass );

			// Should be slideup
			$this.find( slideUpSelector ).addClass( slideUpClass );

		})

	}
});

})( jQuery );
