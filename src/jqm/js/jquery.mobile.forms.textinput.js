/*
* jQuery Mobile Framework : "textinput" plugin for text inputs, textareas
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

(function( $, undefined ) {

$.widget( "mobile.textinput", $.mobile.widget, {
	options: {
		theme: null,
		initSelector: "input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='time'], input[type='date'], input[type='month'], input[type='week'], input[type='datetime'], input[type='datetime-local'], input[type='color'], input:not([type])"
	},

	_create: function() {

		var input = this.element,
			o = this.options,
			theme = o.theme || $.mobile.getInheritedTheme( this.element, "c" ),
			themeclass  = " ui-body-" + theme,
			focusedEl, clearbtn;

		/* wongi_1215 : default text */
		var defaultText = input.jqmData("default-text");
		
		if ((defaultText != undefined) && (defaultText.length > 0))
		{
			var defaultTextClass = "ui-input-default-text";
			var trimedText = defaultText.replace(/\s/g, "");

			/* Make new class for default text string */
			var newClassName = defaultTextClass + "-" + trimedText;
			var newStyle = $("<style>" + '.' + newClassName + ":after" + "{content:" + "'" + defaultText + "'"+ "}" + "</style>");
			$('html > head').append(newStyle);

			/* Make new empty <DIV> for default text */
			var newDiv = $("<div></div>");			
			
			/* Add class and append new div */
			newDiv.addClass(defaultTextClass);
			newDiv.addClass(newClassName);
			
			input.parent().append(newDiv);
			
			/* When focus, default text will be hide. */
			input.focus(function() {
				input.parent().find("div.ui-input-default-text").addClass( "ui-input-default-hidden" );
			})
			.blur(function(){
				var inputedText = input.val();
				if (inputedText.length > 0)	{
					input.parent().find("div.ui-input-default-text").addClass( "ui-input-default-hidden" );
				}
				else {
					input.parent().find("div.ui-input-default-text").removeClass( "ui-input-default-hidden" );
				}
			});			
		}
		
		
		$( "label[for='" + input.attr( "id" ) + "']" ).addClass( "ui-input-text" );

		focusedEl = input.addClass("ui-input-text ui-body-"+ theme );

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


		//"search" input widget
		if ( input.is( "[type='search'],:jqmData(type='search')" ) ) {

				focusedEl = input.wrap( "<div class='ui-input-search ui-shadow-inset ui-corner-all ui-btn-shadow" + themeclass + "'></div>" ).parent();
				clearbtn = $( "<a href='#' class='ui-input-clear' title='clear text'>clear text</a>" )
				.tap(function( event ) {
					input.val( "" ).focus();
					input.trigger( "change" );
					input.trigger( "input" );	//wongi_1124
					clearbtn.addClass( "ui-input-clear-hidden" );
					event.preventDefault();
				})
				.appendTo( focusedEl )
				.buttonMarkup({
					icon: "delete",
					iconpos: "notext",
					corners: true,
					shadow: true
				});
	
				function toggleClear() {
					if ( !input.val() ) {
						clearbtn.addClass( "ui-input-clear-hidden" );
					} else {
						clearbtn.removeClass( "ui-input-clear-hidden" );
					}
				}
				toggleClear();
				input.keyup( toggleClear );
			
				//SLP --start search bar with cancel button
				focusedEl.wrapAll( "<div class='input-search-bar'></div>" );

				var searchicon = $("<div class='ui-icon-search ui-icon-searchfield'></div>")
				.tap(function( event ) {
					searchicon.hide();
					input.focus();
				})
				.appendTo( focusedEl );

				var cancelbtn = $( "<a href='#' class='ui-input-cancel' title='clear text'>Cancel</a>" )
				.tap(function( event ) {
					input.val( "" );
					hideCancel();
					input.trigger( "change" );
					event.preventDefault();
				})
				.appendTo( focusedEl.parent() )
				.buttonMarkup({
					iconpos: "cancel",
					corners: true,
					shadow: true
				});
				function showCancel() {
					focusedEl.addClass( "ui-input-search-default" )
					.removeClass( "ui-input-search-wide" );
					cancelbtn.addClass( "ui-btn-cancel-show" )
					.removeClass( "ui-btn-cancel-hide" );
					searchicon.hide();
				}
				function hideCancel() {
					focusedEl.addClass( "ui-input-search-wide" )
					.removeClass( "ui-input-search-default" );
					cancelbtn.addClass( "ui-btn-cancel-hide" )
					.removeClass( "ui-btn-cancel-show" );
					searchicon.show();
					toggleClear();
					input.blur();					
				}
				input.focus( showCancel );
				//SLP --end

			} else {
				input.addClass( "ui-corner-all ui-shadow-inset" + themeclass );
			}

			input.focus(function() {
				focusedEl.addClass( "ui-focus" );
			})
			.blur(function(){
				focusedEl.removeClass( "ui-focus" );
			});

		// Autogrow
		if ( input.is( "textarea" ) ) {
			var extraLineHeight = 15,
				keyupTimeoutBuffer = 100,
				keyup = function() {
					var scrollHeight = input[ 0 ].scrollHeight,
						clientHeight = input[ 0 ].clientHeight;

					if ( clientHeight < scrollHeight ) {
						input.css({
							height: (scrollHeight + extraLineHeight)
						});
					}
				},
				keyupTimeout;

				input.keyup(function() {
					clearTimeout( keyupTimeout );
					keyupTimeout = setTimeout( keyup, keyupTimeoutBuffer );
				});
			}
		},

	disable: function(){
		( this.element.attr( "disabled", true ).is( "[type='search'],:jqmData(type='search')" ) ?
			this.element.parent() : this.element ).addClass( "ui-disabled" );
	},

	enable: function(){
		( this.element.attr( "disabled", false).is( "[type='search'],:jqmData(type='search')" ) ?
			this.element.parent() : this.element ).removeClass( "ui-disabled" );
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.textinput.prototype.enhanceWithin( e.target );
});

})( jQuery );
