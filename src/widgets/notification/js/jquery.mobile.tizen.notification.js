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
 *  data-text1: top text for tickernoti, text to show for smallpopup.
 *  data-text2: bottom text for tickernoti, smallpopup will ignore this text.
 *  data-param: parameter for 'tapped' event.
 *  data-interval: time to showing. If don't set, will show infinitely.
 *
 * APIs
 *
 *  show(): show the notification.
 *  hide(): hide the notification.
 *
 * Events
 *
 *  tapped: When you tap or click the smallpopup, this event will be raised.
 *
 * Examples
 *
 * // tickernoti
 * <div data-role="notification" id="notification" data-type="ticker" data-text1="text1" data-text2="text2" data-param="parameters" data-interval="3000"></div>
 *
 * // smallpopup
 * <div data-role="notification" id="notification" data-type="popup" data-text1="text1" data-param="parameters" data-interval="3000"></div>
 *
 * // event
 * $('#notification-demo').bind('tapped', function (e, m) {
 *	alert('notification is tapped\nparameter:"' + m + '"');
 * });
 *
 */

(function ( $, window ) {
	$.widget( "tizen.notification", $.mobile.widget, {
		btn: null,
		param: null,
		interval: null,
		seconds: null,
		running: false,

		refresh: function () {
			this._del_event();
			this._update();
			this._add_event();

			$( this.html ).addClass("fix");
		},

		show: function () {
			if ( this.running ) {
				this.refresh();
				return;
			}

			this._update();

			this._add_event();

			this.running = true;
			$( this.html ).addClass("show");
		},

		hide: function () {
			if ( !this.running ) {
				return;
			}

			$( this.html ).addClass("hide");
			$( this.html ).removeClass("show").removeClass("fix");
			this._del_event();

			this.running = false;
		},

		close: function () {
			$( this.html ).removeClass("show").removeClass("hide").removeClass("fix");
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
				self.element.trigger( 'tapped', self.param );
				self.hide();
			});

			if ( this.seconds !== undefined && this.second !== 0 ) {
				this.interval = setInterval( function () {
					self.hide();
				}, this.seconds );
			}
		},

		_del_event: function () {
			var container = this._get_container();

			if ( this.type === 'ticker' ) {
				this.btn.unbind("vmouseup");
			}
			container.unbind('vmouseup');
			clearInterval( this.interval );
		},

		_set_position: function () {
			var container = this._get_container(),
				container_h = parseFloat( container.css('height') ),
				$page = $('.ui-page'),
				$footer = $page.children('.ui-footer'),
				footer_h = $footer.outerHeight() || 0,
				position = $(window).height() - container_h - footer_h;

			container.css( 'top', position );
		},

		_update: function () {
			var text = new Array(2);

			if ( this.html ) {
				this.html.detach();
			}

			text[0] = $(this.element).jqmData('text1');
			text[1] = $(this.element).jqmData('text2');
			this.param = $(this.element).jqmData('param');
			this.seconds = $(this.element).jqmData('interval');
			this.type = $(this.element).jqmData('type') || 'popup';

			if ( this.type === 'ticker' ) {
				this.html = $('<div class="ui-ticker">' +
						'<div class="ui-ticker-icon"></div>' +
						'<div class="ui-ticker-text1-bg">' +
						text[0] + '</div>' +
						'<div class="ui-ticker-text2-bg">' +
						text[1] + '</div>' +
						'<div class="ui-ticker-body"></div>' +
						'<div class="ui-ticker-btn"></div>' +
						'</div>');

				$( this.element ).append( this.html );
			} else {
				this.html = $('<div class="ui-smallpopup">' +
						'<div class="ui-smallpopup-text-bg">' +
						text[0] + '</div>' +
						'</div>');

				$( this.element ).append( this.html );

				this._set_position();
			}
		},

		_create: function () {
			var self = this;

			this.btn = $("<a href='#' class='ui-input-cancel' title='close' data-theme='s'>Close</a>")
				.tap( function ( event ) {
					event.preventDefault();
				})
				.buttonMarkup({
					inline: true,
					corners: true,
					shadow: true
				});

			this._update();
			this.running = false;

			$( window ).bind( "resize", function () {
				if ( self.running ) {
					self.refresh();
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
