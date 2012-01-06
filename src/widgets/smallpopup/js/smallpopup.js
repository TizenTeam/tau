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
 * smallpopup widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'smallpopup'.
 *  data-text: message to show.
 *  data-param: parameter for 'tapped' event.
 *  data-interval: time to showing. If don't set, will show infinitely.
 *
 * APIs
 *
 *  show(): show the smallpopup.
 *  hide(): hide the smallpopup.
 *
 * Events
 *
 *  tapped: When you tap or click the smallpopup, this event will be raised.
 *
 * Examples
 *
 * <div data-role="smallpopup" id="smallpopup" data-text="Message" data-param="parameters" data-interval="3000"></div>
 *
 * $('#smallpopup-demo').bind('tapped', function (e, m) {
 *	alert('smallpopup is tapped\nparameter:"' + m + '"');
 * });
 *
 */

(function ( $, window ) {
	$.widget( "todons.smallpopup", $.mobile.widget, {
		param: null,
		interval: null,
		seconds: null,
		running: false,

		_refresh: function () {
			this._del_event();
			this._update();
			this._add_event();

			$( this.html ).addClass("fix");
		},

		show: function () {
			if ( this.running ) {
				this._refresh();
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

		_add_event: function () {
			var self = this,
				container = $(this.element).find(".ui-smallpopup");

			container.bind( 'vmouseup', function () {
				self.element.trigger( 'tapped', self.param );
				self.hide();
			});

			if ( this.seconds !== undefined && this.second !== 0 ) {
				this.interval = setInterval(function () {
					self.hide();
				}, this.seconds);
			}
		},

		_del_event: function () {
			var container = $( this.element ).find(".ui-smallpopup");

			container.unbind('vmouseup');
			clearInterval( this.interval );
		},

		_get_position: function ( height ) {
			var $page = $('.ui-page'),
				$footer = $page.children('.ui-footer'),
				footer_h = $footer.outerHeight() || 0,
				position = window.innerHeight - height - footer_h;

			return position;
		},

		_update: function () {
			var msg = $( this.element ).attr('data-text');

			this.param = $( this.element ).attr('data-param');
			this.seconds = $( this.element ).attr('data-interval');

			if ( this.html ) {
				this.html.detach();
			}

			this.html = $('<div class="ui-smallpopup">' +
					'<div class="ui-smallpopup-text-bg">' +
					msg + '</div>' +
					'</div>');

			$( this.element ).append( this.html );

			var container = $( this.element ).find(".ui-smallpopup"),
				container_h = parseFloat( container.css('height') );

			container.css( 'top', this._get_position(container_h) );
		},

		_create: function () {
			this._update();
			this.running = false;
		}
	}); // End of widget

	// auto self-init widgets
	$( document ).bind( "pagecreate create", function ( e ) {
		$( e.target ).find(":jqmData(role='smallpopup')").smallpopup();
	});

	$( document ).bind( "pagebeforehide", function ( e ) {
		$( e.target ).find(":jqmData(role='smallpopup')").smallpopup('close');
	});
}( jQuery, this ));
