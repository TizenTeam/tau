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
 * Notification widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'notification'.
 *  data-type: 'ticker' or 'popup'.
 *
 * APIs
 *
 *  show(): show the notification.
 *  hide(): hide the notification.
 *  text(text0, text1): set texts or get texts
 *  setIcon(src): set the icon (tickernoti only)
 *
 * Events
 *
 *  N/A
 *
 * Examples
 *
 * // tickernoti
 * <div data-role="notification" id="notification" data-type="ticker">
 *	<img src="icon01.png">
 *	<p>Hello World</p>
 *	<p>Denis</p>
 * </div>
 *
 * // smallpopup
 * <div data-role="notification" id="notification" data-type="popup">
 *	<p>Hello World</p>
 * </div>
 *
 */

(function ( $, window ) {
	$.widget( "tizen.notification", $.mobile.widget, {
		btn: null,
		text_bg: [],
		icon: [],
		running: false,

		_get_text: function () {
			var text = new Array( 2 );

			if ( this.type === 'ticker' ) {
				text[0] = $( this.text_bg[0] ).text();
				text[1] = $( this.text_bg[1] ).text();
			} else {
				text[0] = $( this.text_bg[0] ).text();
			}

			return text;
		},

		_set_text: function ( text0, text1 ) {
			var _set = function ( elem, text ) {
				if ( !text ) {
					return;
				}
				elem.text( text );
			};

			if ( this.type === 'ticker' ) {
				_set( $( this.text_bg[0] ), text0 );
				_set( $( this.text_bg[1] ), text1 );
			} else {
				_set( $( this.text_bg[0] ), text0 );
			}
		},

		text: function ( text0, text1 ) {
			if ( text0 === undefined && text1 === undefined ) {
				return this._get_text();
			}

			this._set_text( text0, text1 );
		},

		setIcon: function ( src ) {
			if ( src === undefined ) {
				return;
			}

			this.icon.detach();
			this.icon = $( "<img src='" + src + "' class='ui-ticker-icon'>" );
			$( this.element ).find(".ui-ticker").append( this.icon );
		},

		_refresh: function () {
			var container = this._get_container();

			$( container ).addClass("fix")
					.removeClass("show")
					.removeClass("hide");
		},

		show: function () {
			var container = this._get_container();

			if ( this.running ) {
				this._refresh();
				return;
			}

			$( container ).addClass("show")
					.removeClass("hide")
					.removeClass("fix");

			this.running = true;
		},

		hide: function () {
			var container = this._get_container();

			if ( !this.running ) {
				return;
			}

			$( container ).addClass("hide")
					.removeClass("show")
					.removeClass("fix");

			this.running = false;
		},

		close: function () {
			var container = this._get_container();

			$( container ).removeClass("show")
					.removeClass("hide")
					.removeClass("fix");

			this._del_event();

			this.running = false;
		},

		_get_container: function () {
			if ( this.type === 'ticker' ) {
				return $( this.element ).find(".ui-ticker");
			}

			return $( this.element ).find(".ui-smallpopup");
		},

		_add_event: function () {
			var self = this,
				container = this._get_container();

			if ( this.type === 'ticker' ) {
				container.find(".ui-ticker-btn").append( this.btn );

				this.btn.bind( "vmouseup", function () {
					self.hide();
				});
			}

			container.bind( 'vmouseup', function () {
				self.hide();
			});
		},

		_del_event: function () {
			var container = this._get_container();

			if ( this.type === 'ticker' ) {
				this.btn.unbind("vmouseup");
			}
			container.unbind('vmouseup');
		},

		_set_position: function () {
			var container = this._get_container(),
				container_h = parseFloat( container.height() ),
				$page = $('.ui-page'),
				$footer = $page.children('.ui-footer'),
				footer_h = $footer.outerHeight() || 0,
				position = $( window ).height() - container_h - footer_h;

			container.css( 'top', position );
		},

		_create: function () {
			var self = this,
				elem = $( this.element ),
				i;

			this.btn = $("<a href='#' class='ui-input-cancel' title='close' data-theme='s'>Close</a>")
				.tap( function ( event ) {
					event.preventDefault();
				})
				.buttonMarkup({
					inline: true,
					corners: true,
					shadow: true
				});

			this.type = elem.jqmData('type') || 'popup';

			if ( this.type === 'ticker' ) {
				elem.wrapInner("<div class='ui-ticker'></div>");
				elem.find(".ui-ticker").append("<div class='ui-ticker-body'></div>" +
							"<div class='ui-ticker-btn'></div>");
				this.text_bg = elem.find("p");

				if ( this.text_bg.length < 2 ) {
					elem.find(".ui-ticker").append("<p></p><p></p>");
					this.text_bg = elem.find("p");
				} else if ( this.text_bg.length > 2 ) {
					for ( i = 2; i < this.text_bg.length; i++ ) {
						$( this.text_bg[i] ).css( "display", "none" );
					}
				}

				$( this.text_bg[0] ).addClass("ui-ticker-text1-bg");
				$( this.text_bg[1] ).addClass("ui-ticker-text2-bg");

				this.icon = elem.find("img");

				if ( this.icon.length ) {
					$( this.icon ).addClass("ui-ticker-icon");

					for ( i = 1; i < this.icon.length; i++ ) {
						$( this.icon[i] ).css( "display", "none" );
					}
				}
			} else {
				elem.wrapInner("<div class='ui-smallpopup'></div>");
				this.text_bg = elem.find("p").addClass("ui-smallpopup-text-bg");

				if ( this.text_bg.length < 1 ) {
					elem.find(".ui-smallpopup")
						.append("<p class='ui-smallpopup-text-bg'></p>");
					this.text_bg = elem.find("p");
				} else if ( this.text_bg.length > 1 ) {
					for ( i = 1; i < this.text_bg.length; i++ ) {
						$( this.text_bg[i] ).css( "display", "none" );
					}
				}

				this._set_position();
			}

			this._add_event();

			$( window ).bind( "resize", function () {
				if ( self.running ) {
					self._refresh();
				}

				if ( self.type === 'popup' ) {
					self._set_position();
				}
			});
		}
	}); // End of widget

	// auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( e.target ).find(":jqmData(role='notification')").notification();
	});

	$( document ).bind( "pagebeforehide", function ( e ) {
		$( e.target ).find(":jqmData(role='notification')").notification('close');
	});
}( jQuery, this ));
