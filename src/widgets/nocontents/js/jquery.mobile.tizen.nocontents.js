/*
	Author: Minkyu Kang <mk7.kang@samsung.com>
*/

/*
 * nocontents widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'nocontents'.
 *  data-text1: top message.
 *  data-text2: bottom message.
 *  data-type: type of nocontents. You can set text, picture, multimedia and unnamed.
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
 * Text Type
 * <div data-role="nocontents" id="nocontents" data-text1="Text1" data-text2="Text2" data-type="text"></div>
 *
 * Picture Type
 * <div data-role="nocontents" id="nocontents" data-text1="Text1" data-text2="Text2" data-type="picture"></div>
 *
 * Multimedia Type
 * <div data-role="nocontents" id="nocontents" data-text1="Text1" data-text2="Text2" data-type="multimedia"></div>
 *
 * Unnamed Type
 * <div data-role="nocontents" id="nocontents" data-text1="Text1" data-text2="Text2"></div>
 * or
 * <div data-role="nocontents" id="nocontents" data-text1="Text1" data-text2="Text2" data-type="unnamed"></div>
 *
 */

(function ( $, window, undefined ) {
	$.widget( "tizen.nocontents", $.mobile.widget, {

		max_height: 0,
		container: null,
		icon_img: null,
		text0_bg: null,
		text1_bg: null,

		_get_height: function () {
			var $page = $('.ui-page'),
				$content = $page.children('.ui-content'),
				$header = $page.children('.ui-header'),
				$footer = $page.children('.ui-footer'),
				header_h = $header.outerHeight() || 0,
				footer_h = $footer.outerHeight() || 0,
				padding_t = parseFloat( $content.css('padding-top') ) || 0,
				padding_b = parseFloat( $content.css('padding-bottom') ) || 0,
				content_h = $(window).height() - header_h - footer_h -
					(padding_t + padding_b) * 2,
				container_h = this.container.height();

			return ( content_h < container_h ? container_h : content_h );
		},

		_align: function () {
			var content_height = this._get_height(),
				icon_height = this.icon_img.height(),
				icon_width = this.icon_img.width(),
				content_gap = 46,
				text0_height = this.text0_bg.height() || 0,
				text1_height = this.text1_bg.height() || 0,
				text_top = 0,
				icon_top = (content_height -
					(icon_height + content_gap +
					 text0_height + text1_height)) / 2;

			if ( icon_top < content_gap ) {
				icon_top = content_gap;
			}

			this.container.height( content_height );

			this.icon_img.css( 'left',
				($(window).width() - icon_width) / 2 );
			this.icon_img.css( 'top', icon_top );

			text_top = icon_top + icon_height + content_gap;

			this.text0_bg.css( 'top', text_top );
			this.text1_bg.css( 'top', text_top + text0_height );
		},

		_create: function () {
			var icon_type = $( this.element ).attr('data-type'),
				text = new Array(2);

			if ( icon_type === undefined ||
					(icon_type !== "picture" &&
					 icon_type !== "multimedia" &&
					 icon_type !== "text") ) {
				icon_type = "unnamed";
			}

			text[0] = $( this.element ).attr('data-text1');
			text[1] = $( this.element ).attr('data-text2');

			if ( text[0] === undefined ) {
				text[0] = "";
			}

			if ( text[1] === undefined ) {
				text[1] = "";
			}

			this.container = $('<div class="ui-nocontents"/>');
			this.icon_img = $('<div class="ui-nocontents-icon-' +
					icon_type + '"/>');

			this.text0_bg = $('<div class="ui-nocontents-text">' +
					text[0] + '<div>');
			this.text1_bg = $('<div class="ui-nocontents-text">' +
					text[1] + '<div>');

			this.container.append( this.icon_img );
			this.container.append( this.text0_bg );
			this.container.append( this.text1_bg );

			$( this.element ).append( this.container );

			this._align();
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
		$( e.target ).find(":jqmData(role='nocontents')").nocontents();
	});
} ( jQuery, this ));
