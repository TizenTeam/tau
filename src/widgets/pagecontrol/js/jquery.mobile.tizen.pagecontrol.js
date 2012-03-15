/*
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
 *		data-initVal:	Initially selected value of the pagecontrol widget. Must between 1 and data-max. If this attribute is not given, initial value is set to 1.
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

		_create: function ( ) {
		},

		_init: function ( ) {
			var self = this,
				e = this.element,
				maxVal = e.data( "max" ),
				currentVal = e.attr( "data-initVal" ),
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

			if ( ! currentVal ) {
				currentVal = 1;
			}
			e.data( "current", currentVal );

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

			// subroutine: find a child by value
			function getBtn( value ) {
				return e.children( ":jqmData(value='" + value + "')" );
			}

			// subroutine: change active button by value
			function changeActiveBtn( newNum ) {
				var oldNum = e.data( 'current' );

				// Check value
				if ( newNum < 1 || newNum > e.max ) {
					return false;
				}

				getBtn( oldNum ).removeClass( 'page_n_' + oldNum )
						.addClass( 'page_n_dot' );
				getBtn( newNum ).removeClass( 'page_n_dot' )
						.addClass( 'page_n_' + newNum );
			}

			function triggerChange( event ) {
				// Trigger change event
				e.trigger( 'change', $( this ).data( 'value' ) );
			}

			// Add dot icons
			for ( i = 1; i <= maxVal; i++ ) {
				btn = $( '<div class="page_n page_n_dot ' + page_margin_class + '" data-value="' + i + '"></div>' );
				e.append( btn );
				if ( i == currentVal ) {
					btn.removeClass( 'page_n_dot' )
						.addClass( 'page_n_' + i );
				}
				// bind vclick event to each icon
				btn.bind( 'vclick', triggerChange );
			}

			// pagecontrol element's change event
			e.bind( 'change', function ( event, value ) {
				// 1. Change activated button
				changeActiveBtn( value );

				// 2. Store new value (DO NOT change this order!)
				e.data( 'current', value );

			});
		}
	});	// end: $.widget()


	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.pagecontrol.prototype.options.initSelector, e.target )
			.not( ":jqmData(role='none'), :jqmData(role='nojs')" )
			.pagecontrol( );
	});

} ( jQuery ) );

