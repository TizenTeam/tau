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
 */
/*
* jQuery Mobile Framework : "textinput" plugin for text inputs, textareas
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
* Authors: Jinhyuk Jun <jinhyuk.jun@samsung.com>
*          Wongi Lee <wongi11.lee@samsung.com>
*/

/**
 * Searchbar can be created using <input> element with type=search
 * <input type="search" name="search" id="search1" value=""  />
 *
 * Searchbar can be inserted 3 cases
 * content : seachbar behave same as content element
 * header : searchbar placed below title(header), It doesn't move when scrolling page
 * inside optionheader : Searchbar placed inside optionheader, searchbar can be seen only expand optionheader
 *
 * Examples:
 *
 *	HTML markup for creating Searchbar
 *		<input type="search"/>
 *
 *	How to make searchbar in content
 *		<input type="search" name="" id="" value=""  />
 *
 *	How to make searchbar in title
 *		<div data-role="header" data-position ="fixed" >
 *			<h1>Searchbar</h1>
 *			<input type="search" name="" id="" value=""  />
 *		</div>
 *
 *	How to make searchbar inside optionheader
 *		<div data-role="header" data-position ="fixed" >
 *			<h1>Searchbar</h1>
 *			<div id="myoptionheader2" data-role="optionheader">
 *				<input type="search" name="" id="" value=""  />
 *			</div>
 *		</div>
*/

(function ( $, undefined ) {

	$.widget( "tizen.searchbar", $.mobile.widget, {
		options: {
			theme: null,
			initSelector: "input[type='search'],:jqmData(type='search'), input[type='tizen-search'],:jqmData(type='tizen-search')"
		},

		_create: function () {
			var input = this.element,
				o = this.options,
				theme = o.theme || $.mobile.getInheritedTheme( this.element, "c" ),
				themeclass  = " ui-body-" + theme,
				focusedEl,
				clearbtn,
				currentPage = input.closest( ".ui-page" ),
				searchicon,
				cancelbtn,
				defaultText,
				defaultTextClass,
				trimedText,
				newClassName,
				newStyle,
				newDiv,
				inputedText,
				extraLineHeight,
				keyupTimeoutBuffer,
				keyup,
				keyupTimeout;

			function toggleClear() {
				if ( !input.val() ) {
					clearbtn.addClass( "ui-input-clear-hidden" );
				} else {
					clearbtn.removeClass( "ui-input-clear-hidden" );
				}
			}

			function showCancel() {
				focusedEl
					.addClass( "ui-input-search-default" )
					.removeClass( "ui-input-search-wide" );
				cancelbtn
					.addClass( "ui-btn-cancel-show" )
					.removeClass( "ui-btn-cancel-hide" );
				searchicon.hide();
			}

			function hideCancel() {
				focusedEl
					.addClass( "ui-input-search-wide" )
					.removeClass( "ui-input-search-default" );
				cancelbtn
					.addClass( "ui-btn-cancel-hide" )
					.removeClass( "ui-btn-cancel-show" );

				if ( input.val() == "" ) {
					searchicon.show();
				}

				toggleClear();
			}

			$( "label[for='" + input.attr( "id" ) + "']" ).addClass( "ui-input-text" );

			focusedEl = input.addClass( "ui-input-text ui-body-" + theme );

			// XXX: Temporary workaround for issue 785 (Apple bug 8910589).
			//      Turn off autocorrect and autocomplete on non-iOS 5 devices
			//      since the popup they use can't be dismissed by the user. Note
			//      that we test for the presence of the feature by looking for
			//      the autocorrect property on the input element. We currently
			//      have no test for iOS 5 or newer so we're temporarily using
			//      the touchOverflow support flag for jQM 1.0. Yes, I feel dirty. - jblas
			if ( typeof input[0].autocorrect !== "undefined" && !$.support.touchOverflow ) {
				// Set the attribute instead of the property just in case there
				// is code that attempts to make modifications via HTML.
				input[0].setAttribute( "autocorrect", "off" );
				input[0].setAttribute( "autocomplete", "off" );
			}

			focusedEl = input.wrap( "<div class='ui-input-search ui-shadow-inset ui-corner-all ui-btn-shadow" + themeclass + "'></div>" ).parent();
			clearbtn = $( "<a href='#' class='ui-input-clear' title='clear text'>clear text</a>" )
				.tap( function ( event ) {
					if ( input.attr( "disabled" ) == "disabled" ) {
						return false;
					}
					event.preventDefault();
					event.stopPropagation();

					input.val( "" )
						.blur()
						.focus()
						.trigger( "change" )
						.trigger( "input" );
					clearbtn.addClass( "ui-input-clear-hidden" );
				} )
				.appendTo( focusedEl )
				.buttonMarkup({
					icon: "deleteSearch",
					iconpos: "notext",
					corners: true,
					shadow: true
				} );

			toggleClear();

			input.keyup( toggleClear );

			input.bind( 'paste cut keyup focus change blur', toggleClear );

			//SLP --start search bar with cancel button
			focusedEl.wrapAll( "<div class='input-search-bar'></div>" );

			input.tap( function ( event ) {
				if ( input.attr( "disabled" ) == "disabled" ) {
					return false;
				}
				inputedText = input.val();
				input
					.blur()
					.focus();
			} );

			searchicon = $("<div class='ui-image-search ui-image-searchfield'></div>");
			searchicon
				.tap( function ( event ) {
					if ( input.attr( "disabled" ) == "disabled" ) {
						return false;
					}
					searchicon.hide();

					input
						.blur()
						.focus();
				} )
				.appendTo( focusedEl );

			cancelbtn = $( "<a href='#' class='ui-input-cancel' title='clear text'>Cancel</a>" )
				.tap(function ( event ) {
					if ( input.attr( "disabled" ) == "disabled" ) {
						return false;
					}
					event.preventDefault();
					event.stopPropagation();

					input
						.val( "" )
						.blur()
						.trigger( "change" );

					hideCancel();
				} )
				.appendTo( focusedEl.parent() )
				.buttonMarkup( {
					iconpos: "cancel",
					corners: true,
					shadow: true
				} );

			// Input Focused
			input.focus( function () {
				if ( input.attr( "disabled" ) == "disabled" ) {
					return false;
				}
				showCancel();
				focusedEl.addClass( "ui-focus" );
			} );

			// Input Blured
			/* When user touch on page, it's same to blur */
			$( "div.input-search-bar" ).tap( function ( event ) {
				if ( input.attr( "disabled" ) == "disabled" ) {
					return false;
				}
				input.focus();
				event.stopPropagation();
			} );

			$( currentPage ).bind("tap", function ( e ) {
				if ( input.attr( "disabled" ) == "disabled" ) {
					return;
				}

				if ( $( input ).is( ":focus" ) ) {
					focusedEl.removeClass( "ui-focus" );
					hideCancel();
					input.blur();
				}
			} );

			// Autogrow
			if ( input.is( "textarea" ) ) {
				extraLineHeight = 15;
				keyupTimeoutBuffer = 100;
				keyup = function () {
					var scrollHeight = input[ 0 ].scrollHeight,
						clientHeight = input[ 0 ].clientHeight;

					if ( clientHeight < scrollHeight ) {
						input.height(scrollHeight + extraLineHeight);
					}
				};

				input.keyup( function () {
					clearTimeout( keyupTimeout );
					keyupTimeout = setTimeout( keyup, keyupTimeoutBuffer );
				});

				// binding to pagechange here ensures that for pages loaded via
				// ajax the height is recalculated without user input
				$( document ).one( "pagechange", keyup );

				// Issue 509: the browser is not providing scrollHeight properly until the styles load
				if ( $.trim( input.val() ) ) {
					// bind to the window load to make sure the height is calculated based on BOTH
					// the DOM and CSS
					$( window ).load( keyup );
				}
			}

			// Default Text
			defaultText = input.jqmData( "default-text" );

			if ( ( defaultText != undefined ) && ( defaultText.length > 0 ) ) {
				defaultTextClass = "ui-input-default-text";
				trimedText = defaultText.replace(/\s/g, "");

				/* Make new class for default text string */
				newClassName = defaultTextClass + "-" + trimedText;
				newStyle = $( "<style>" + '.' + newClassName + ":after" + "{content:" + "'" + defaultText + "'" + "}" + "</style>" );
				$( 'html > head' ).append( newStyle );

				/* Make new empty <DIV> for default text */
				newDiv = $( "<div></div>" );

				/* Add class and append new div */
				newDiv.addClass( defaultTextClass );
				newDiv.addClass( newClassName );
				newDiv.tap( function ( event ) {
					input.blur();
					input.focus();
				} );

				input.parent().append( newDiv );

				/* When focus, default text will be hide. */
				input
					.focus( function () {
						input.parent().find( "div.ui-input-default-text" ).addClass( "ui-input-default-hidden" );
					} )
					.blur( function () {
						var inputedText = input.val();
						if ( inputedText.length > 0 ) {
							input.parent().find( "div.ui-input-default-text" ).addClass( "ui-input-default-hidden" );
						} else {
							input.parent().find( "div.ui-input-default-text" ).removeClass( "ui-input-default-hidden" );
						}
					} );
			}
		},

		disable: function () {
			this.element.attr( "disabled", true );
			this.element.parent().addClass( "ui-disabled" );
			this.element.parent().parent().find(".ui-input-cancel").addClass( "ui-disabled" );
			$( this.element ).blur();
		},

		enable: function () {
			this.element.attr( "disabled", false );
			this.element.parent().removeClass( "ui-disabled" );
			this.element.parent().parent().find(".ui-input-cancel").removeClass( "ui-disabled" );
			$( this.element ).focus();
		}
	} );

	//auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$.tizen.searchbar.prototype.enhanceWithin( e.target );
	} );

}( jQuery ) );
