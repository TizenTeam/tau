/*
	Copyright (c) 2011 Samsung Electronics Co., Ltd All Rights Reserved

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.

	Author: Minkyu Kang <mk7.kang@samsung.com>
*/

/*
 * tickernoti widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'tickernoti'.
 *  data-text1: top message.
 *  data-text2: bottom message.
 *  data-param: parameter for 'tapped' event.
 *  data-interval: time to showing. If don't set, will show infinitely.
 *
 * APIs
 *
 *  show(): show the tickernoti.
 *  hide(): hide the tickernoti.
 *
 * Events
 *
 *  tapped: When you tap or click the tickernoti, this event will be raised.
 *
 * Examples
 *
 * <div data-role="tickernoti" id="tickernoti" data-text1="Text1" data-text2="Text2" data-param="parameters" data-interval="3000"></div>
 *
 * $('#tickernoti-demo').bind('tapped', function (e, m) {
 *	alert('tickernoti is tapped\nparameter:"' + m + '"');
 * });
 *
 */

(function ( $, window ) {
	$.widget( "todons.tickernoti", $.mobile.widget, {
		btn: null,
		param: null,
		interval: null,
		seconds: null,
		running: false,

		show: function () {
			if ( this.running ) {
				this.hide();
			}

			this._update();

			this._add_event();

			this.running = true;
			$(this.html).addClass("show").removeClass("hide");
		},

		hide: function () {
			if ( !this.running ) {
				return;
			}

			$(this.html).addClass("hide").removeClass("show");
			this._del_event();

			this.running = false;
		},

		close: function () {
			$( this.html ).removeClass("show").removeClass("hide");
			this._del_event();

			this.running = false;
		},

		_add_event: function () {
			var self = this,
				container = $(this.element).find(".ui-ticker"),
				bg_container = container.find(".ui-ticker-body"),
				btn_container = container.find(".ui-ticker-btn"),
				btn_inner = btn_container.find(".ui-btn-inner");

			btn_container.append( this.btn );

			btn_inner.css( "padding", "0.3em 0.7em" );

			this.btn.bind( "vmouseup", function () {
				self.hide();
			});

			bg_container.bind( "vmouseup", function () {
				self.element.trigger( "tapped", self.param );
				self.hide();
			});

			if ( this.seconds !== undefined && this.second !== 0 ) {
				this.interval = setInterval(function () {
					self.hide();
				}, this.seconds);
			}
		},

		_del_event: function () {
			var container = $(this.element).find(".ui-ticker"),
				bg_container = container.find(".ui-ticker-body");

			this.btn.unbind("vmouseup");
			bg_container.unbind("vmouseup");
			clearInterval( this.interval );
		},

		_update: function () {
			var text = new Array(2);

			if ( this.html ) {
				this.html.detach();
			}

			text[0] = $(this.element).attr('data-text1');
			text[1] = $(this.element).attr('data-text2');
			this.param = $(this.element).attr('data-param');
			this.seconds = $(this.element).attr('data-interval');

			this.html = $('<div class="ui-ticker">' +
					'<div class="ui-ticker-icon"></div>' +
					'<div class="ui-ticker-text1-bg">' +
					text[0] + '</div>' +
					'<div class="ui-ticker-text2-bg">' +
					text[1] + '</div>' +
					'<div class="ui-ticker-body"></div>' +
					'<div class="ui-ticker-btn"></div>' +
					'</div>' +
					'</div>');

			$( this.element ).append( this.html );
		},

		_create: function () {
			this.btn = $("<a href='#' class='ui-input-cancel' title='close' data-theme='s'>Close</a>")
				.tap(function(event) {
					event.preventDefault();
				})
				.buttonMarkup({
					inline: true,
					corners: true,
					shadow: true
				});

			this._update();

			this.running = false;
		}
	}); // End of widget

	// auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( e.target ).find(":jqmData(role='tickernoti')").tickernoti();
	});

	$( document ).bind( "pagebeforehide", function ( e ) {
		$( e.target ).find(":jqmData(role='tickernoti')").tickernoti('close');
	});
}( jQuery, this ));
