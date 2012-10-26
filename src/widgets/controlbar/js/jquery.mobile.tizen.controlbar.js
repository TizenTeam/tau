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
 * jQuery Mobile Framework : "controlbar" plugin
 * Copyright (c) jQuery Project
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * Authors: Jinhyuk Jun <jinhyuk.jun@samsung.com>
*/

/**
 *  Controlbar can be created using data-role = "controlbar" inside footer 
 *  Framework determine which controlbar will display with controlbar attribute
 *
 * Attributes:
 *
 *     data-style : determine which controlbar will use ( tabbar / toolbar )
 *                    tabbar do not have back button, toolbar has back button 
 *
 * Examples:
 *         
 *     HTML markup for creating tabbar: ( 2 ~ 5 li item available )
 *     icon can be changed data-icon attribute
 *         <div data-role="footer"data-position ="fixed">
 *              <div data-role="controlbar" data-style="tabbar" >
 *                     <ul>
 *                            <li><a href="#" data-icon="ctrlbar-menu" class="ui-btn-active">Menu</a></li>
 *                            <li><a href="#" data-icon="ctrlbar-save" >Save</a></li>
 *                            <li><a href="#" data-icon="ctrlbar-share" >Share</a></li>
 *                     </ul>
 *             </div>
 *      </div>
 *
 *     HTML markup for creating toolbar: ( 2 ~ 5 li item available )
 *     icon can be changed data-icon attribute
 *         <div data-role="footer" data-position ="fixed">
 *              <div data-role="controlbar" data-style="toolbar" >
 *                     <ul>
 *                            <li><a href="#" data-icon="ctrlbar-menu" class="ui-btn-active">Menu</a></li>
 *                            <li><a href="#" data-icon="ctrlbar-save" >Save</a></li>
 *                            <li><a href="#" data-icon="ctrlbar-share" >Share</a></li>
 *                     </ul>
 *             </div>
 *      </div>
*/

(function ( $, undefined ) {

	$.widget( "tizen.controlbar", $.mobile.widget, {
		options: {
			iconpos: "top",
			grid: null,
			initSelector: ":jqmData(role='controlbar')"
		},

		_create: function () {

			var $controlbar = this.element,
				$navbtns = $controlbar.find( "a" ),
				iconpos = $navbtns.filter( ":jqmData(icon)" ).length ?
										this.options.iconpos : undefined,
				theme = $.mobile.listview.prototype.options.theme,	/* Get current theme */
				style = $controlbar.attr( "data-style" ),
				ww = window.innerWidth || $( window ).width(),
				wh = window.innerHeight || $( window ).height(),
				isLandscape;

			isLandscape = ww > wh && ( ww - wh );

			if ( isLandscape ) {
				$controlbar.removeClass( "ui-portrait-controlbar" ).addClass( "ui-landscape-controlbar" );
			} else {
				$controlbar.removeClass( "ui-landscape-controlbar" ).addClass( "ui-portrait-controlbar" );
			}

			if ( style === "left" || style === "right" ) {
				$controlbar
					.parents( ".ui-content" )
					.css( 'padding', '0' );
			} else {
				$controlbar
					.addClass( "ui-navbar" )
					.attr( "role", "navigation" )
					.find( "ul" )
						.grid( { grid: this.options.grid } );
			}

			if ( !iconpos ) {
				$controlbar.addClass( "ui-navbar-noicons" );
			}

			$navbtns.buttonMarkup({
				corners:	false,
				shadow:		false,
				iconpos:	iconpos
			});

			if ( $controlbar.find( ".ui-state-persist" ).length ) {
				$controlbar.addClass( "ui-controlbar-persist" );
			}

			$controlbar.delegate( "a", "vclick", function ( event ) {
				$navbtns.not( ".ui-state-persist" ).removeClass( $.mobile.activeBtnClass );
				$( this ).addClass( $.mobile.activeBtnClass );
			});

			if ( style === "tabbar" || style === "toolbar" ) {
				$controlbar
					.addClass( "ui-controlbar-" + theme )
					.addClass( "ui-" + style + "-" + theme );
			} else {
				$controlbar
					.addClass( "ui-controlbar-" + style )
					.end();
			}

			$( document ).bind( "pagebeforeshow", function ( event, ui ) {
				var footer_filter = $( event.target ).find( ":jqmData(role='footer')" ),
					controlbar_filter = footer_filter.find( ":jqmData(role='controlbar')" ),
					style = controlbar_filter.jqmData( "style" );

				if ( style == "toolbar" || style == "tabbar" ) {
					/* Need to add text only style */
					if ( !(controlbar_filter.find(".ui-btn-inner").children().is(".ui-icon")) ) {
						controlbar_filter.find( ".ui-btn-inner" ).addClass( "ui-navbar-textonly" );
					} else {
						if ( controlbar_filter.find( ".ui-btn-text" ).text() == "" ) {
							controlbar_filter.find( ".ui-btn" ).addClass( "ui-ctrlbar-icononly" );
						}
					}
					footer_filter
						.css( "position", "fixed" )
						.css( "bottom", 0 )
						.css( "height", controlbar_filter.height() );
					if ( style == "toolbar" ) {
						controlbar_filter
							.css( "width", window.innerWidth - controlbar_filter.siblings(".ui-btn").width() - parseInt(controlbar_filter.siblings(".ui-btn").css("right"), 10) * 2 );
					}
				}
			});

			$( document ).bind( "pageshow", function ( e, ui ) {
				var controlbar_filter = $( ".ui-page-active" ).find( ":jqmData(role='footer')" ).eq( 0 ).find( ":jqmData(role='controlbar')" ),
					element_width = 0,
					element_count = controlbar_filter.find( 'li' ).length;

				if ( controlbar_filter.find(".ui-btn-active").length == 0 ) {
					controlbar_filter.find( "div" ).css( "left", "0px" );
				} else {
					controlbar_filter.find( "div" ).css( "left", controlbar_filter.find( ".ui-btn-active" ).parent( "li" ).index() * controlbar_filter.width() / element_count );
				}

				if ( controlbar_filter.length ) {
					element_width = controlbar_filter.find("li:first").width();
					controlbar_filter.find("li:last").width( controlbar_filter.width() - element_width * ( element_count - 1 ) );
				}
			});

			$( window ).bind( "resize", function ( e ) {
				var controlbar_filter = $( ".ui-page-active" ).find( ":jqmData(role='footer')" ).eq( 0 ).find( ":jqmData(role='controlbar')" ),
					element_width = 0,
					element_count = controlbar_filter.find( 'li' ).length;

				if ( controlbar_filter.length ) {
					element_width = controlbar_filter.find("li:first").width();
					controlbar_filter.find("li:last").width( controlbar_filter.width() - element_width * ( element_count - 1 ) );
				}
			});

			this._bindControlbarEvents();
		},

		_bindControlbarEvents: function () {
			var $controlbar = this.element;

			$( window ).bind( "orientationchange", function ( e, ui ) {
				var ww = window.innerWidth || $( window ).width(),
					wh = window.innerHeight || $( window ).height(),
					isLandscape = ww > wh && ( ww - wh );

				if ( isLandscape ) {
					$controlbar.removeClass( "ui-portrait-controlbar" ).addClass( "ui-landscape-controlbar" );
				} else {
					$controlbar.removeClass( "ui-landscape-controlbar" ).addClass( "ui-portrait-controlbar" );
				}
			});

		},

		_setDisabled: function ( value, cnt ) {
			this.element.find( "li" ).eq( cnt ).attr( "disabled", value );
			this.element.find( "li" ).eq( cnt ).attr( "aria-disabled", value );
		},

		disable: function ( cnt ) {
			this._setDisabled( true, cnt );
			this.element.find( "li" ).eq( cnt ).addClass( "ui-disabled" );
		},

		enable: function ( cnt ) {
			this._setDisabled( false, cnt );
			this.element.find( "li" ).eq( cnt ).removeClass( "ui-disabled" );
		}
	});

	//auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.controlbar.prototype.options.initSelector, e.target ).controlbar();
	});
}( jQuery ) );
