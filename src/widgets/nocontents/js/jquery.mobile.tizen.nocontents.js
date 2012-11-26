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
 *	Author: Minkyu Kang <mk7.kang@samsung.com>
 */

/*
 * nocontents widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'nocontents'.
 *  data-type: type of nocontents. You can set text, picture, multimedia and unnamed.
 *
 *  Deprecated in Tizen 2.0 beta : data-text1, data-text2
 *
 * APIs
 *
 *  N/A
 *
 * Events
 *
 *  N/A
 *
 * Examples
 *
 * Default
 * <div data-role="nocontents" id="nocontents">
 *		<p> Unnamed Type </p>
 *		<p> Text </p>
 * </div>
 *
 *
 * Text Type
 * <div data-role="nocontents" id="nocontents" data-type="text"></div>
 *
 * Picture Type
 * <div data-role="nocontents" id="nocontents" data-type="picture"></div>
 *
 * Multimedia Type
 * <div data-role="nocontents" id="nocontents" data-type="multimedia"></div>
 *
 * Unnamed Type
 * <div data-role="nocontents" id="nocontents"></div>
 * or
 * <div data-role="nocontents" id="nocontents" data-type="unnamed"></div>
 *
 */
/**
	@class NoContents
	The no contents widget is used if a list has no items.
	To add a no contents widget to the application, use the following code:

		<div data-role="nocontents" data-type="Picture">
			<p>Main Text</p>
			<p>Sub Text</p>
		</div>

*/
/**
	@property {String} data-type
	Defines the no contents widget type. The type options are text, picture, multimedia, and unnamed.
	The default value is unnamed.
*/
(function ( $, window, undefined ) {
	$.widget( "tizen.nocontents", $.mobile.widget, {
		max_height: 0,
		icon_img: null,
		text_bg: null,

		_get_height: function () {
			var $page = $('.ui-page-active'),
				$content = $page.children('.ui-content'),
				$header = $page.children('.ui-header'),
				$footer = $page.children('.ui-footer'),
				$view = $content.children('.ui-scrollview-view'),
				header_h = $header.outerHeight() || 0,
				footer_h = $footer.outerHeight() || 0,
				padding_t = (parseFloat( $content.css('padding-top') ) || 0) +
						(parseFloat( $view.css('padding-top') ) || 0),
				padding_b = (parseFloat( $content.css('padding-bottom') ) || 0) +
						(parseFloat( $view.css('padding-bottom') ) || 0),
				content_h = $( window ).height() - header_h - footer_h -
					(padding_t + padding_b);

			$content.height( content_h );

			return content_h;
		},

		_align: function () {
			var content_height = this._get_height(),
				icon_height = this.icon_img.height(),
				text_height = 0,
				content_gap = 0,
				text_top = 0,
				icon_top = 0,
				i;

			if ( this.text_bg.length ) {
				text_height = $( this.text_bg[0] ).height() * this.text_bg.length;
				content_gap = $( this.text_bg[0] ).height();
			}

			icon_top = ( content_height - ( icon_height + content_gap + text_height ) ) / 2;

			if ( icon_top < content_gap ) {
				icon_top = content_gap;
			}

			this.icon_img.css( 'top', icon_top );

			text_top = icon_top + icon_height + content_gap;

			for ( i = 0; i < this.text_bg.length; i++ ) {
				$( this.text_bg[i] ).css( 'top', text_top );
				text_top += $( this.text_bg[i] ).height();
			}
		},

		_create: function () {
			var elem = this.element,
				icon_type = $( this.element ).jqmData('type');

			switch ( icon_type ) {
			case "picture":
			case "multimedia":
			case "text":
				break;
			default:
				icon_type = "unnamed";
				break;
			}

			$( elem ).addClass( "ui-nocontents" );
			this.icon_img = $('<div class="ui-nocontents-icon-' +
					icon_type + '">');

			this.text_bg = $( elem ).find("p").addClass("ui-nocontents-text");

			$( elem ).prepend( this.icon_img );

			this._align();

			$( window ).bind( 'resize', function () {
				$( elem ).nocontents( 'refresh' );
			});
		},

		refresh: function () {
			this._align();
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
		$( e.target ).find(":jqmData(role='nocontents')").nocontents();
	});
}( jQuery, this ));
