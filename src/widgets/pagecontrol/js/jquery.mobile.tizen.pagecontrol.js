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
 *	Author: Youmin Ha <youmin.ha@samsung.com>
 */

/**
 * Pagecontrol widget shows number bullets, receives touch event for each bullet,
 * and runs your callback for each touch event.
 *
 * HTML Attributes:
 *
 *		Pagecontrol widget uses <div> element as an element itself. It takes following attributes.
 *
 *		data-role:	This widget must have 'pagecontrol' as data-role value.
 *		data-max:	Maximum nimber of pagecontrol bullets. This property must not exceed 10.
 *		data-value:	Initially selected value of the pagecontrol widget. Must between 1 and data-max. If this attribute is not given, initial value is set to 1.
 *
 * APIs:
 *
 *		setValue( value )
 *			: Set current value. Actually triggers 'change' event to the widget with given value.
 *			@param[in] value	A value to be changed.
 *
 *		getValue( )
 *			: Get current value.
 *			@return		Current value.
 *
 * Events:
 *
 *		change:	Raised when a value is changed, by setting it by javascript, or by user's touch event.
 *
 * Examples:
 *
 *		<div id="foo" data-role="pagecontrol" data-max="10"></div>
 *		...
 *		<script language="text/javascript">
 *
 *		// Bind callback to value change
 *		$('foo').bind('change', function (event, value) {
 *			// event: 'change'
 *			// value: changed value
 *		});
 *
 *		// Set a value to 3
 *		$('foo').trigger('change', 3);
 *		</script>
 */

(function ($, undefined) {
	$.widget( "tizen.pagecontrol", $.mobile.widget, {
		options: {
			initSelector: ":jqmData(role='pagecontrol')"
		},

		// subroutine: find a child by value
		_getBtn: function ( value ) {
			return $( this.element ).children( ":jqmData(value='" + value + "')" );
		},

		// subroutine: change active button by value
		_changeActiveBtn: function ( newNum ) {
			var oldNum = $( this.element ).data( 'value' );

			// Check value
			if ( newNum < 1 || newNum > $( this.element ).data( "max" ) ) {
				return false;
			}

			this._getBtn( oldNum ).removeClass( 'page_n_' + oldNum )
					.addClass( 'page_n_dot' );
			this._getBtn( newNum ).removeClass( 'page_n_dot' )
					.addClass( 'page_n_' + newNum );
		},

		_triggerChange: function ( event ) {
			// Trigger change event
			$( this ).trigger( 'change', $( this ).data( 'value' ) );
		},

		_create: function ( ) {
		},

		_init: function ( ) {
			var self = this,
				e = this.element,
				maxVal = e.data( "max" ),
				value = e.attr( "data-value" ),
				i = 0,
				btn = null,
				buf = null,
				page_margin_class = 'page_n_margin_44';


			// Set default values
			if ( ! maxVal ) {
				maxVal = 1;
			} else if ( maxVal > 10 ) {
				maxVal = 10;
			}
			e.data( "max", maxVal );

			if ( ! value ) {
				value = 1;
			}
			e.data( "value", value );

			// Set pagecontrol class
			e.addClass( 'pagecontrol' );

			// Set empty callback variable
			self.changeCallback = null;

			// Calculate left/right margin
			if ( maxVal <= 7 ) {
				page_margin_class = 'page_n_margin_44';
			} else if ( maxVal == 8 ) {
				page_margin_class = 'page_n_margin_35';
			} else if ( maxVal == 9 ) {
				page_margin_class = 'page_n_margin_26';
			} else {
				page_margin_class = 'page_n_margin_19';
			}


			// Add dot icons
			for ( i = 1; i <= maxVal; i++ ) {
				btn = $( '<div class="page_n page_n_dot ' + page_margin_class + '" data-value="' + i + '"></div>' );
				e.append( btn );
				if ( i == value ) {
					btn.removeClass( 'page_n_dot' )
						.addClass( 'page_n_' + i );
				}
				// bind vclick event to each icon
				btn.bind( 'vclick', this._triggerChange );
			}

			// pagecontrol element's change event
			e.bind( 'change', function ( event, value ) {
				// 1. Change activated button
				self._changeActiveBtn( value );

				// 2. Store new value (DO NOT change this order!)
				e.data( 'value', value );

			});
		},

		value: function ( val ) {
			var pc = $( this.element );

			if ( val && typeof val == "number" ) {
				this._changeActiveBtn( val );
				pc.data( 'value', val );
			} else {
				return pc.data( "value" );
			}
		}

	});	// end: $.widget()


	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.pagecontrol.prototype.options.initSelector, e.target )
			.not( ":jqmData(role='none'), :jqmData(role='nojs')" )
			.pagecontrol( );
	});

} ( jQuery ) );

