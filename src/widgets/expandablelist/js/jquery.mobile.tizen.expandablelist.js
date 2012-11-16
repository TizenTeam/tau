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
/**
 * Displays vertical multi-level list.
 *
 * To apply, add the attribute data-expandable="true" and id="parentid" to a <li> element for parent list item
 * and add the arrribute data-expanded-by="parentid" to a <li> element for child list item.
 *
 * HTML Attributes:
 *		data-expandable: Parent list item must have 'true' value for this attribute
 *		data-expanded-by: Child list item expanded by parent list item must have 'true' value for this attribute
 *		data-initial-expansion: If you want expandable list to be expanded initially, set this value as 'true'
 *
 * Example:
 *     <li data-expandable="true" id="exp1" data-initial-expansion="true">Parent</li>
 *     <li data-expanded-by="exp1">Child</li>
 */

/**
	@class Expandablelist
	The expandable list widget shows a parent list view where the list items expand into child lists. When the list is in a collapsed state, only the parent list items are shown. If the user clicks a list item, the child list for that list item is displayed with a transition effect. If the user clicks the parent list item again, the child list collapses and is hidden.<br/><br/>Each child list is created as part of its parent expandable list item so that the child list and its parent expandable list item share the same ID. The child list ID is defined with the data-expanded-by option.
	
		<li data-expandable="true" id="exp1" data-initial-expansion="true">Parent</li>
		// Rest of the parent list items
		<li data-expanded-by="exp1">Child</li>
*/
/**
	@property {String} data-expanded-by
	Specifies the ID of the parent expandable list item
*/
/**
	@property {Boolean} data-initial-expansion
	Defines whether the child list is expanded when the parent expandable list is loaded.
*/
/**
	@property {Boolean} data-expandable
	Defines whether the list item can be expanded in to a child list.
*/
( function ( $, undefined ) {

	$.widget( "tizen.expandablelist", $.mobile.widget, {
		options: {
			initSelector: ":jqmData(expandable='true')"
		},

		_hide: function ( e ) {
			$( e ).removeClass( 'ui-li-expand-transition-show' )
				.addClass( 'ui-li-expand-transition-hide' );
		},
		_show: function ( e ) {
			$( e ).removeClass( 'ui-li-expand-transition-hide' )
				.addClass( 'ui-li-expand-transition-show' );
		},
		_hide_expand_img: function ( e ) {
			$( e ).removeClass( 'ui-li-expandable-hidden' )
				.addClass( 'ui-li-expandable-shown' );

			$( e ).find( ".ui-li-expand-icon" )
				.addClass( "ui-li-expanded-icon" )
				.removeClass( "ui-li-expand-icon" );
		},
		_show_expand_img: function ( e ) {
			$( e ).removeClass( 'ui-li-expandable-shown' )
				.addClass( 'ui-li-expandable-hidden' );

			$( e ).find( ".ui-li-expanded-icon" )
				.addClass( "ui-li-expand-icon" )
				.removeClass( "ui-li-expanded-icon" );
		},

		_set_expand_arrow: function ( self, e, parent_is_expanded ) {
			if ( parent_is_expanded ) {
				self._hide_expand_img( e );
			} else {
				self._show_expand_img( e );
			}
			if ( $( e[0] ).data( "expandable" ) && parent_is_expanded == false ) {
				var children = $( e ).nextAll( ":jqmData(expanded-by='" + $( e ).attr( 'id' ) + "')" );
				children.each( function ( idx, child ) {
					self._set_expand_arrow( self, child, e.is_expanded );
				} );
			}
		},

		_toggle: function ( self, e, parent_is_expanded ) {
			if ( ! parent_is_expanded ) {
				self._show( e );
			} else {
				self._hide( e );
				if ( $( e ).data( "expandable" ) && e.is_expanded == true ) {
					var children = $( e ).nextAll( ":jqmData(expanded-by='" + $( e ).attr( 'id' ) + "')" );
					children.each( function ( idx, child ) {
						self._toggle( self, child, e.is_expanded );
					} );
					e.is_expanded = false;
				}
			}
		},
		_is_hidden: function ( e ) {
			return ( $( e ).height( ) == 0);
		},

		refresh: function () {
			if ( this._handler ) {
				this.element.unbind();
				this._handler = null;
			}
			this._create();
		},

		_create: function ( ) {

			var children = $( this.element ).nextAll( ":jqmData(expanded-by='" + $( this.element ).attr( 'id' ) + "')" ),
				e = this.element,
				self = this,
				expanded = e.nextAll( ":jqmData(expanded-by='" + e[0].id + "')" ),
				initial_expansion = e.data( "initial-expansion" ),
				is_expanded = false,
				parent_id = null;

			if ( children.length == 0 ) {
				return;
			}

			if ( initial_expansion == true ) {
				parent_id = e.data( "expanded-by" );
				if ( parent_id ) {
					if ( $( "#" + parent_id ).is_expanded == true) {
						is_expanded = true;
					}
				} else {
					is_expanded = true;
				}
			}

			e[0].is_expanded = is_expanded;
			if ( e[0].is_expanded ) {
				self._hide_expand_img( e );
				$(e).append( "<div class='ui-li-expanded-icon'></div>" );
			} else {
				self._show_expand_img( e );
				$(e).append( "<div class='ui-li-expand-icon'></div>" );
			}

			if ( e[0].is_expanded ) {
				expanded.each( function ( i, e ) { self._show( e ); } );
			} else {
				expanded.each( function ( i, e ) { self._hide( e ); } );
			}

			expanded.addClass( "ui-li-expanded" );

			this._handler = e.bind( 'vclick', function ( ) {
				var _is_expanded = e[0].is_expanded;
				expanded.each( function ( i, e ) { self._toggle( self, e, _is_expanded ); } );
				e[0].is_expanded = ! e[0].is_expanded;

				self._set_expand_arrow( self, e, e[0].is_expanded );
			});
		}


	});	// end: $.widget()


	$( document ).bind( "pagecreate create", function ( e ) {
		$( $.tizen.expandablelist.prototype.options.initSelector, e.target )
			.not( ":jqmData(role='none'), :jqmData(role='nojs')" )
			.expandablelist( );
	});

} ( jQuery ) );
