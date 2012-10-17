/* ***************************************************************************
 * Copyright (c) 2000 - 2011 Samsung Electronics Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 *	Author: Jinhyuk Jun <jinhyuk.jun@samsung.com>
 */

(function ( $, undefined ) {

	$.widget( "mobile.pagelayout", $.mobile.widget, {
		options: {
			visibleOnPageShow: true,
			disablePageZoom: true,
			transition: "slide", //can be none, fade, slide (slide maps to slideup or slidedown)
			fullscreen: false,
			tapToggle: true,
			tapToggleBlacklist: "a, input, select, textarea, .ui-header-fixed, .ui-footer-fixed",
			hideDuringFocus: "input, textarea, select",
			updatePagePadding: true,
			trackPersistentToolbars: true,
			// Browser detection! Weeee, here we go...
			// Unfortunately, position:fixed is costly, not to mention probably impossible, to feature-detect accurately.
			// Some tests exist, but they currently return false results in critical devices and browsers, which could lead to a broken experience.
			// Testing fixed positioning is also pretty obtrusive to page load, requiring injected elements and scrolling the window
			// The following function serves to rule out some popular browsers with known fixed-positioning issues
			// This is a plugin option like any other, so feel free to improve or overwrite it
			supportBlacklist: function () {
				var w = window,
					ua = navigator.userAgent,
					platform = navigator.platform,
					// Rendering engine is Webkit, and capture major version
					wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ ),
					wkversion = !!wkmatch && wkmatch[ 1 ],
					ffmatch = ua.match( /Fennec\/([0-9]+)/ ),
					ffversion = !!ffmatch && ffmatch[ 1 ],
					operammobilematch = ua.match( /Opera Mobi\/([0-9]+)/ ),
					omversion = !!operammobilematch && operammobilematch[ 1 ];

				if (
						// iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
						( ( platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ) && wkversion && wkversion < 534 )
						||
						// Opera Mini
						( w.operamini && ({}).toString.call( w.operamini ) === "[object OperaMini]" )
						||
						( operammobilematch && omversion < 7458 )
						||
						//Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
						( ua.indexOf( "Android" ) > -1 && wkversion && wkversion < 533 )
						||
						// Firefox Mobile before 6.0 -
						( ffversion && ffversion < 6 )
						||
						// WebOS less than 3
						( "palmGetResource" in window && wkversion && wkversion < 534 )
						||
						// MeeGo
						( ua.indexOf( "MeeGo" ) > -1 && ua.indexOf( "NokiaBrowser/8.5.0" ) > -1 )
				) {
					return true;
				}

				return false;
			},
			initSelector: ":jqmData(role='content')"
		},

		_create: function () {

			var self = this,
				o = self.options,
				$el = self.element;

			// Feature detecting support for
			if ( o.supportBlacklist() ) {
				self.destroy();
				return;
			}

			self._addFixedClass();
			self._addTransitionClass();
			self._bindPageEvents();

			// only content
			self._bindContentControlEvents();
		},

		/* add minimum fixed css style to bar(header/footer) and content
		*  it need to update when core source modified(jquery.mobile.page.section.js)
		*  modified from core source cuz initSelector different */
		_addFixedClass: function () {
			var self = this,
				o = self.options,
				$el = self.element,
				$elHeader = $el.siblings( ":jqmData(role='header')" ),
				$elFooter = $el.siblings( ":jqmData(role='footer')" ),
				$elPage = $el.closest(".ui-page");

			$elHeader.addClass( "ui-header-fixed" );
			$elFooter.addClass( "ui-footer-fixed" );

			// "fullscreen" overlay positioning
			if ( o.fullscreen ) {
				$elHeader.addClass( "ui-header-fullscreen" );
				$elFooter.addClass( "ui-footer-fullscreen" );
				$elPage
					.addClass( "ui-page-header-fullscreen" )
					.addClass( "ui-page-footer-fullscreen" );
			} else {
			// If not fullscreen, add class to page to set top or bottom padding
				$elPage.addClass( "ui-page-header-fixed" )
					.addClass( "ui-page-footer-fixed" );
			}
		},

		/* original core source(jquery.mobile.fixedToolbar.js)
		* never changed */
		_addTransitionClass: function () {
			var tclass = this.options.transition;

			if ( tclass && tclass !== "none" ) {
				// use appropriate slide for header or footer
				if ( tclass === "slide" ) {
					tclass = this.element.is( ".ui-header" ) ? "slidedown" : "slideup";
				}

				this.element.addClass( tclass );
			}
		},


		/* Set default page positon
		* 1. add title style to header
		* 2. Set default header/footer position */
		setHeaderFooter: function ( event ) {
			var $elPage = $( event.target ),
				$elHeader = $elPage.find( ":jqmData(role='header')" ).length ? $elPage.find( ":jqmData(role='header')") : $elPage.siblings( ":jqmData(role='header')"),
				$elFieldcontain = $elHeader.find( ":jqmData(role='fieldcontain')" ),
				$elControlgroup = $elHeader.find( ":jqmData(role='controlgroup')" ),
				$elContent = $elPage.find( ".ui-content" ),
				next_id,
				$elFooter,
				$elFooterGroup,
				gLength,
				footerButton,
				tStyle = "normal",
				headerBtnNum;

			if ( $elFieldcontain.length != 0 || $elControlgroup.length != 0 ) {
				tStyle = "extended";
			}

			if ( $elHeader.jqmData("position") == "fixed" || $.tizen.frameworkData.theme.match(/tizen/) || $elHeader.css("position") == "fixed" ) {
				$elHeader
					.css( "position", "fixed" )
					.css( "top", "0px" );

				if ( $elHeader.children().is(".ui-navbar") ) {
					$elHeader.addClass( "ui-title-controlbar-height" );
					$( event.target ).find( ".ui-content" ).addClass( "ui-title-content-controlbar-height" );
				} else {
					if ( $elHeader.length ) {
						$( event.target ).find( ".ui-content" ).addClass( "ui-title-content-" + tStyle + "-height" );
					} else {
						$( event.target ).find( ".ui-content" ).addClass( "ui-title-content-no-height" );
					}
				}
			}

			if ( $elHeader.children().is(".ui-option-header") ) {
				$elContent.removeClass( "ui-title-content-" + tStyle + "-height" );
				if ( $.tizen.optionheader.prototype.options.collapseOnInit == true ) {
					$elContent.addClass( "ui-title-content-option-header-collapsed-1line-height" );
				} else {
					$elContent.addClass( "ui-title-content-option-header-expanded-1line-height" );
				}
			} else if ( $elHeader.find("input").attr("type") === "search" || $elHeader.find("input").attr("type") === "tizen-search" || $elHeader.find("input").jqmData("type") == "search" || $elHeader.find("input").jqmData("type") == "tizen-search" ) {
				$elContent.removeClass( "ui-title-content-" + tStyle + "-height" ).addClass( "ui-title-content-search" );
			}

			headerBtnNum = $elHeader.children("a").length;
			if ( headerBtnNum > 0  || $elHeader.children().find(".ui-radio").length != 0 ) {
				if ( tStyle != "normal" ) {
					gLength = $elFieldcontain.length ? $elFieldcontain.find( ".ui-radio" ).length : $elControlgroup.find( "a" ).length;

					$elHeader.addClass( "ui-title-extended-height" );

					$elFieldcontain.length ? $elFieldcontain.find( ".ui-controlgroup" ).addClass( "ui-title-extended-controlgroup" ).addClass( "ui-extended-controlgroup" ) : $elControlgroup.addClass( "ui-title-extended-button-controlgroup" ).addClass( "ui-extended-controlgroup" );

					$elFieldcontain.length ? $elFieldcontain.addClass( "ui-title-extended-segment-style" ) : $elControlgroup.addClass( "ui-title-extended-segment-style" );

					if ( gLength == 2 || gLength == 3 || gLength == 4 ) {
						$elFieldcontain.length ? $elFieldcontain.addClass( "ui-title-extended-controlgroup-" + gLength + "btn" ) : $elControlgroup.addClass( "ui-title-extended-controlgroup-" + gLength + "btn" );
					}
				}
				$elContent.addClass( "ui-title-content-" + tStyle + "-height" );
			}

			// divide content mode scrollview and non-scrollview
			// recalculate content area when resize callback occur
			if ( $.support.scrollview ) {
				if ( $elHeader.css( "position" ) != "fixed" ) {
					$elHeader.css( "position", "fixed" );
				}

			} else {
				if ( $elHeader.css("position") != "fixed" ) {
					$elHeader.css( "position", "relative" );
				}
			}

			$elFooter = $( document ).find( ":jqmData(role='footer')" );

			if ( $elFooter.find(".ui-navbar").is(".ui-controlbar-s") ) {
				$elFooter
					.css( "bottom", 0 )
					.show();
			}

			if ( $elFooter.children().find(".ui-radio").length != 0 ) {
				$elFooterGroup = $elFooter.find( ":jqmData(role='fieldcontain')" );
				gLength = $elFooterGroup.find( ".ui-radio" ).length;

				$elFooterGroup.find( ".ui-controlgroup" )
					.addClass( "ui-extended-controlgroup" )
					.addClass( "ui-footer-extended-controlgroup" )
					.css( "display", "inline" );

					/* Groupcontrol cannot initialize inline property at first page */
				$elFooterGroup.addClass( "ui-footer-extended-controlgroup-" + gLength + "btn" );
			}

			footerButton = $elFooter.children( "a" );
			footerButton.each( function ( i ) {
				if ( footerButton.eq( i ).is(".ui-btn") && !footerButton.eq( i ).is(".ui-btn-back") ) {
					footerButton.eq( i )
						.removeClass( "ui-btn-left" )
						.addClass( "ui-btn-footer-right" );
				}
			});

			if ( $elFooter.is(".ui-footer-fixed") ) {
				$elFooter.css( "bottom", 0 );
			}

			$elFooter.show();

			/* Header position fix(remove transition) */
			next_id = $( event.target ).attr( "id" );

			$( "#" + next_id ).find( ":jqmData(role='header')" )
				.removeClass( "fade in out" )
				.appendTo( $.mobile.pageContainer );
		},

		_bindPageEvents: function () {
			var self = this,
				o = self.options,
				$el = self.element;

			//page event bindings
			// Fixed toolbars require page zoom to be disabled, otherwise usability issues crop up
			// This method is meant to disable zoom while a fixed-positioned toolbar page is visible
			$el.closest( ".ui-page" )
				.bind( "pagebeforeshow", function ( event ) {
					if ( o.disablePageZoom ) {
						$.mobile.zoom.disable( true );
					}
					if ( !o.visibleOnPageShow ) {
						self.hide( true );
					}
/* IME concenpt change after alpha2.0 */
/*					self._IMEShown = false;*/
					self.setHeaderFooter( event );
				} )
				.bind( "webkitAnimationStart animationstart updatelayout", function ( e, data ) {
					if ( o.updatePagePadding ) {
						self.updatePagePadding(data);	// FIXME: unused function.
						self.updatePageLayout(data);
					}
				})

				.bind( "pageshow", function ( event ) {
					self.updatePagePadding();			// FIXME: unused function.
					self._updateHeaderArea();
					if ( o.updatePagePadding ) {
						$( window ).bind( "throttledresize." + self.widgetName, function () {
							self.updatePagePadding();	// FIXME: unused function.
/* IME concenpt change after alpha2.0 */
/*							self.layoutPageIME();*/
							self.updatePageLayout();
							self._updateHeaderArea();
						});
					}

					/* Header position fix(remove transition) */
					$( "body" ).children( ":jqmData(role='header')" )
						.insertBefore( $(event.target).find(":jqmData(role='content')").eq( 0 ) );
/* new_header */
				})

				.bind( "pagebeforehide", function ( e, ui ) {
					if ( o.disablePageZoom ) {
						$.mobile.zoom.enable( true );
					}
					if ( o.updatePagePadding ) {
						$( window ).unbind( "throttledresize." + self.widgetName );
					}

					if ( o.trackPersistentToolbars ) {
						var thisFooter = $( ".ui-footer-fixed:jqmData(id)", this ),
							thisHeader = $( ".ui-header-fixed:jqmData(id)", this ),
							nextFooter = thisFooter.length && ui.nextPage && $( ".ui-footer-fixed:jqmData(id='" + thisFooter.jqmData( "id" ) + "')", ui.nextPage ),
							nextHeader = thisHeader.length && ui.nextPage && $( ".ui-header-fixed:jqmData(id='" + thisHeader.jqmData( "id" ) + "')", ui.nextPage );

						nextFooter = nextFooter || $();

						if ( nextFooter.length || nextHeader.length ) {

							nextFooter.add( nextHeader ).appendTo( $.mobile.pageContainer );

							ui.nextPage.one( "pageshow", function () {
								nextFooter.add( nextHeader ).appendTo( this );
							});
						}
					}
				});
		},

		_bindContentControlEvents: function () {
			var self = this,
				o = self.options,
				$el = self.element;

			$el.closest( ".ui-page" )
				.bind( "pagebeforeshow", function ( event ) {

				});
		},

		_updateHeaderArea : function() {
			var $elPage = $( ".ui-page-active" ),
				$elHeader = $elPage.find( ":jqmData(role='header')" ).length ? $elPage.find( ":jqmData(role='header')") : $elPage.siblings( ":jqmData(role='header')"),
				headerBtnNum = $elHeader.children("a").length,
				headerSrcNum = $elHeader.children("img").length;

			$elHeader.find( "h1" ).css( "width", window.innerWidth - $elHeader.children( "a" ).width() * headerBtnNum - $elHeader.children( "a" ).width() / 4 - $elHeader.children( "img" ).width() * headerSrcNum * 3 );
			/* add half width for default space between text and button, and img tag area is too narrow, so multiply three for img width*/
		},

		_visible: true,
/* IME concenpt change after alpha2.0 */
/*		_IMEShown : false,
		_IMEindicatorHeight : window.outerHeight - window.innerHeight,

		layoutPageIME: function () {
			if ( $( document.activeElement ).is( "input" ) || $( document.activeElement ).is( "textarea" )
					|| $(".ui-page-active .ui-header .input-search-bar").length
					|| $(".ui-page-active .ui-content").find("input").length
					|| $(".ui-page-active .ui-content").find("textarea").length) {

				if ( ( window.innerHeight + this._IMEindicatorHeight ) < window.outerHeight && window.innerWidth == window.outerWidth ) {
					if ( this._IMEShown === false ) {
						$( ".ui-page-active .ui-footer" ).hide();
						this._IMEShown = true;
					}
				} else if ( ( window.innerHeight + this._IMEindicatorHeight ) >= window.outerHeight ) {
					if ( this._IMEShown === true ) {
						$( ".ui-page-active .ui-footer" ).show();
						this._IMEShown = false;
					}
				}
			} else {
				if ( ( window.innerHeight + this._IMEindicatorHeight ) >= window.outerHeight ) {
					if ( this._IMEShown === true ) {
						$( ".ui-page-active .ui-footer" ).show();
						this._IMEShown = false;
					}
				}
			}
		},
*/
		// This will set the content element's top or bottom padding equal to the toolbar's height
		updatePagePadding: function (data) {
			var $el = this.element,
				header = $el.is( ".ui-header" );

			// This behavior only applies to "fixed", not "fullscreen"
			if ( this.options.fullscreen ) { return; }

//			$el.closest( ".ui-page" ).css( "padding-" + ( header ? "top" : "bottom" ), $el.outerHeight() );
		},


		/* 1. Calculate toolbar width(only controlbar)
		*  2. Calculate and update content height   */
		updatePageLayout: function ( receiveType ) {
			var $elFooter,
				$elFooterControlbar,
				$elPage = $( document ).find( ".ui-page-active" ),
				$elHeader = $elPage.find( ":jqmData(role='header')" ),
				$elContent = $elPage.find( ":jqmData(role='content')" ),
				resultContentHeight = 0,
				resultFooterHeight = 0,
				resultHeaderHeight = 0;

			if ( $elPage.length ) {
				$elFooter = $( document ).find( ".ui-page-active" ).find( ":jqmData(role='footer')" );
			} else {
				$elFooter = $( document ).find( ":jqmData(role='footer')" ).eq( 0 );
			}
			$elFooterControlbar = $elFooter.find( ".ui-navbar" );

			// calculate footer height
			resultFooterHeight = ( $elFooter.css( "display" ) == "none" ) ? 0 : $elFooter.height();
			resultHeaderHeight = ( $elHeader.css( "display" ) == "none" ) ? 0 : $elHeader.height();

			if (resultFooterHeight != 0 ) {
				$elFooter.css( "bottom", 0 );
			}
			if ( $elFooterControlbar.jqmData("style") == "toolbar" ) {
				$elFooterControlbar.css( "width", window.innerWidth - $elFooterControlbar.siblings( ".ui-btn" ).width() - parseInt($elFooterControlbar.siblings(".ui-btn").css("right"), 10 ) * 2  );
			}

			resultContentHeight = window.innerHeight - resultFooterHeight - resultHeaderHeight;

			if ( $.support.scrollview ) {
				if ( $elHeader.css("position") != "fixed" ) {
					$elHeader.css( "position", "fixed" );
				}

				$elContent.height( resultContentHeight -
						parseFloat( $elContent.css("padding-top") ) -
						parseFloat( $elContent.css("padding-bottom") ) );
			} else {
				if ( $elHeader.css("position") != "fixed" ) {
					$elHeader.css( "position", "relative" );
				} else {
					$elContent.height( resultContentHeight );
				}
			}

			// check this line need
			// because another style title will be not supported to updatePageLayout

			// in case title changed
			if ( receiveType ) {
				$elContent.css( "top", resultHeaderHeight + "px" );
			}
		},

		_useTransition: function ( notransition ) {
			var $win = $( window ),
				$el = this.element,
				scroll = $win.scrollTop(),
				elHeight = $el.height(),
				pHeight = $el.closest( ".ui-page" ).height(),
				viewportHeight = $.mobile.getScreenHeight(),
				tbtype = $el.is( ":jqmData(role='header')" ) ? "header" : "footer";

			return !notransition &&
				( this.options.transition && this.options.transition !== "none" &&
				(
						( tbtype === "header" && !this.options.fullscreen && scroll > elHeight ) ||
						( tbtype === "footer" && !this.options.fullscreen && scroll + viewportHeight < pHeight - elHeight )
					) || this.options.fullscreen
				);
		},

		show: function ( notransition ) {
/*			var hideClass = "ui-fixed-hidden",
				$el = this.element;

			if ( this._useTransition( notransition ) ){
				$el
					.removeClass( "out " + hideClass )
					.addClass( "in" );
			}
			else {
				$el.removeClass( hideClass );
			}
			this._visible = true;*/
		},

		hide: function ( notransition ) {
/*			var hideClass = "ui-fixed-hidden",
				$el = this.element,
				// if it's a slide transition, our new transitions need the reverse class as well to slide outward
				outclass = "out" + ( this.options.transition === "slide" ? " reverse" : "" );

			if ( this._useTransition( notransition ) ){
				$el
					.addClass( outclass )
					.removeClass( "in" )
					.animationComplete( function () {
						$el.addClass( hideClass ).removeClass( outclass );
					});
			}
			else {
				$el.addClass( hideClass ).removeClass( outclass );
			}
			this._visible = false;*/
		},

		toggle: function () {
			this[ this._visible ? "hide" : "show" ]();
		},

		/* support external api for adding backbutton via javascript */
/*		backButton: function ( target, status ){
			this._addBackbutton( target, "external" );
		},
*/
		destroy: function () {
			this.element.removeClass( "ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden" );
			this.element.closest( ".ui-page" ).removeClass( "ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen" );
		}

	});

	//auto self-init widgets
	$( document )
		.bind( "pagecreate create", function ( e ) {
			// DEPRECATED in 1.1: support for data-fullscreen=true|false on the page element.
			// This line ensures it still works, but we recommend moving the attribute to the toolbars themselves.
			if ( $( e.target ).jqmData( "fullscreen" ) ) {
				$( $.mobile.pagelayout.prototype.options.initSelector, e.target ).not( ":jqmData(fullscreen)" ).jqmData( "fullscreen", true );
			}
			$.mobile.pagelayout.prototype.enhanceWithin( e.target );
		});

})( jQuery );
