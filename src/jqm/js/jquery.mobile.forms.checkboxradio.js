/*
* jQuery Mobile Framework : "checkboxradio" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/

/**
 * Usages of checkbox, radio button are same as jQM except style.
 *
 * HTML Attributes:
 *
 *		data-style:	This is only for checkbox. When user does not declare, It uses default style.
 *                  "favorite" : Star shape checkbox
 *                  "onoff"    : Switch style on-off checkbox
 *
 * APIs:
 *		Same as jQM
 *
 * Events:
		Same as jQM
 *
 * Examples:
 *
 *			<input type="checkbox" name="mycheck" id="check-test" data-style="favorite"/>
 *			<label for="check-test">Favorite</label>
 *
 *			<input type="checkbox" name="check-favorite" id="check-test2"
 *					checked="checked" disabled="disabled" data-style="favorite"/>
 *			<label for="check-test2">Favorite Checked, Disabled</label>
 *
 * Note:
 */


(function( $, undefined ) {

$.widget( "mobile.checkboxradio", $.mobile.widget, {
	options: {
		theme: null,
		initSelector: "input[type='checkbox'],input[type='radio']"
	},
	_create: function() {
		var self = this,
			input = this.element,
			// NOTE: Windows Phone could not find the label through a selector
			// filter works though.
			label = input.closest( "form,fieldset,:jqmData(role='page')" ).find( "label" ).filter( "[for='" + input[ 0 ].id + "']"),
			inputtype = input.attr( "type" ),
			checkedState = inputtype + "-on",
			uncheckedState = inputtype + "-off",
			icon = input.parents( ":jqmData(type='horizontal')" ).length ? undefined : uncheckedState,
			activeBtn = icon ? "" : " " + $.mobile.activeBtnClass,
			checkedClass = "ui-" + checkedState + activeBtn,
			uncheckedClass = "ui-" + uncheckedState,
			checkedicon = "ui-icon-" + checkedState,
			uncheckedicon = "ui-icon-" + uncheckedState,
			//SLP --start - press state
			checkedpressedicon = checkedicon + "-press",
			uncheckedpressedicon = uncheckedicon + "-press";
			//SLP --end

		if ( inputtype !== "checkbox" && inputtype !== "radio" ) {
			return;
		}
		//SLP --start - fake label
		if ( label.length == 0 ) {
			//fake label
			label = $("<label for='" + input[ 0 ].id  + "' style='display:block;width:1px;height:1px;'></label>");
		}
		//SLP --end 

		// Wrap the input + label in a div
		input.add( label )
			.wrapAll( "<div class='ui-" + inputtype + "'></div>" );

		// Expose for other methods
		$.extend( this, {
			label: label,
			inputtype: inputtype,
			checkedClass: checkedClass,
			uncheckedClass: uncheckedClass,
			checkedicon: checkedicon,
			uncheckedicon: uncheckedicon,
			//SLP --start - press state
			checkedpressedicon: checkedpressedicon,
			uncheckedpressedicon: uncheckedpressedicon
			//SLP --end
		});

		// If there's no selected theme...
		if( !this.options.theme ) {
			this.options.theme = this.element.jqmData( "theme" );
		}

		label.buttonMarkup({
			theme: this.options.theme,
			icon: icon,
			shadow: false
		});

		//SLP --start - checkbox style : favorite, onoff
		var style = "";
		// support data-style & class... 
		// TODO : support either data-style or class...
		style = input.jqmData( "style" );
		if ( input.hasClass( "favorite" ) ) {
			style = "favorite";
		}
		else if ( input.hasClass( "onoff" ) ) {
			style = "onoff";
		}
		switch ( style ) {
			case "onoff":
				label.find( ".ui-icon" ).append("<span class='onoff-text'></span>");
		}
		//for all styles..
		input.parent().addClass( style ).end();
		//SLP --end

		label.bind({
			vmousedown: function() {
				self.press();
			},
			vmouseup: function() {
				self.unpress();
			},


			vmouseover: function( event ) {
				if ( $( this ).parent().is( ".ui-disabled" ) ) {
					event.stopPropagation();
				}
			},

			vclick: function( event ) {
				console.log("Label Mouse Click");
				if ( input.is( ":disabled" ) ) {
					event.preventDefault();
					return;
				}

				self._cacheVals();

				input.prop( "checked", inputtype === "radio" && true || !input.prop( "checked" ) );

				// trigger click handler's bound directly to the input as a substitute for
				// how label clicks behave normally in the browsers
				// TODO: it would be nice to let the browser's handle the clicks and pass them
				//       through to the associate input. we can swallow that click at the parent
				//       wrapper element level
				input.triggerHandler( 'click' );

				// Input set for common radio buttons will contain all the radio
				// buttons, but will not for checkboxes. clearing the checked status
				// of other radios ensures the active button state is applied properly
				self._getInputSet().not( input ).prop( "checked", false );

				self._updateAll();
				return false;
			}

		});

		input
			.bind({
				vmousedown: function() {
					self._cacheVals();
				},

				vclick: function() {
					var $this = $(this);

					// Adds checked attribute to checked input when keyboard is used
					if ( $this.is( ":checked" ) ) {

						$this.prop( "checked", true);
						self._getInputSet().not($this).prop( "checked", false );
					} else {

						$this.prop( "checked", false );
					}

					self._updateAll();
				},

				focus: function() {
					label.addClass( "ui-focus" );
				},

				blur: function() {
					label.removeClass( "ui-focus" );
				}
			});

		this.refresh();
	},

	_cacheVals: function() {
		this._getInputSet().each(function() {
			var $this = $(this);

			$this.jqmData( "cacheVal", $this.is( ":checked" ) );
		});
	},

	//returns either a set of radios with the same name attribute, or a single checkbox
	_getInputSet: function(){
		if(this.inputtype == "checkbox") {
			return this.element;
		}

		return this.element.closest( "form,fieldset,:jqmData(role='page')" )
			.find( "input[name='"+ this.element.attr( "name" ) +"'][type='"+ this.inputtype +"']" );
	},

	_updateAll: function() {
		var self = this;

		this._getInputSet().each(function() {
			var $this = $(this);

			if ( $this.is( ":checked" ) || self.inputtype === "checkbox" ) {
				$this.trigger( "change" );
			}
		})
		.checkboxradio( "refresh" );
	},

	//SLP --start - press state
	press: function() {
		var input = this.element,
			label = this.label,
			icon = label.find( ".ui-icon" );

		if ( !$( input[ 0 ] ).is( ":disabled" ) ) {
			if ( $( input[ 0 ] ).prop( "checked" ) ) {
				icon.addClass( this.uncheckedpressedicon ).removeClass( this.checkedicon );
			} else {
				icon.removeClass( this.uncheckedicon ).addClass( this.checkedpressedicon );
			}
		}
	},

	unpress: function() {
		var input = this.element,
			label = this.label,
			icon = label.find( ".ui-icon" );

		if ( !$( input[ 0 ] ).is( ":disabled" ) ) {
			if ( $( input[ 0 ] ).prop( "checked" ) ) {
				icon.removeClass( this.uncheckedpressedicon ).addClass( this.uncheckedicon );
			} else {
				icon.addClass( this.checkedicon ).removeClass( this.checkedpressedicon );
			}
		}
	},
	//SLP --end

	refresh: function() {
		var input = this.element,
			label = this.label,
			icon = label.find( ".ui-icon" );

		// input[0].checked expando doesn't always report the proper value
		// for checked='checked'
		if ( $( input[ 0 ] ).prop( "checked" ) ) {

			label.addClass( this.checkedClass ).removeClass( this.uncheckedClass );
			icon.addClass( this.checkedicon ).removeClass( this.uncheckedicon );
			//SLP - start : for onoff text on icon
//			if ( icon.find( ".onoff" ) )
//				var textOnOff = icon.find( ".onoff-text" );
//				textOnOff.text( "On" );
			//SLP - end

		} else {

			label.removeClass( this.checkedClass ).addClass( this.uncheckedClass );
			icon.removeClass( this.checkedicon ).addClass( this.uncheckedicon );
			//SLP - start : for onoff text on icon
//			if ( label.find( ".onoff" ) )
//				var textOnOff = icon.find( ".onoff-text" );
//				textOnOff.text( "Off" );
			//SLP - end
		}

		if ( input.is( ":disabled" ) ) {
			this.disable();
		} else {
			this.enable();
		}
	},

	disable: function() {
		this.element.prop( "disabled", true ).parent().addClass( "ui-disabled" );
	},

	enable: function() {
		this.element.prop( "disabled", false ).parent().removeClass( "ui-disabled" );
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$.mobile.checkboxradio.prototype.enhanceWithin( e.target );
});

})( jQuery );
