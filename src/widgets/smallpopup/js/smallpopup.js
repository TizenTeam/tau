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
*/

(function ($, window, undefined) {
	$.widget("todons.smallpopup", $.mobile.widget, {

		param: null,
		interval: null,
		seconds: null,
		running: false,

		_refresh: function () {
			this._del_event();
			this._update();
			this._add_event();

			$(this.html).addClass("fix");
		},

		show: function () {
			if (this.running) {
				this._refresh();
				return;
			}

			this._update();

			this._add_event();

			this.running = true;
			$(this.html).addClass("show");
		},

		hide: function () {
			if (!this.running)
				return;

			$(this.html).addClass("hide");
			$(this.html).removeClass("show").removeClass("fix");
			this._del_event();

			this.running = false;
		},

		_add_event: function () {
			var self = this;
			var container = $(this.element).find(".ui-smallpopup");

			container.bind('vmouseup', function () {
				self.element.trigger('tapped', self.param);
				self.hide();
			});

			if (this.seconds !== undefined && this.second != 0) {
				this.interval = setInterval(function () {
					self.hide();
				}, this.seconds);
			}
		},

		_del_event: function () {
			var container = $(this.element).find(".ui-smallpopup");

			container.unbind('vmouseup');
			clearInterval(this.interval);
		},

		_get_position: function ( height ) {
			var $page = $('.ui-page'),
				$footer = $page.children('.ui-footer'),
				footer_h = $footer.outerHeight() || 0,
				position = window.innerHeight - height - footer_h;

			return position;
		},

		_update: function () {
			var msg;
			var container;

			msg = $(this.element).attr('data-text');
			this.param = $(this.element).attr('data-param');
			this.seconds = $(this.element).attr('data-interval');

			if (this.html)
				this.html.detach();

			this.html = $('<div class="ui-smallpopup">' +
					'<div class="ui-smallpopup-text-bg">' +
					msg + '</div>' +
					'</div>');

			$(this.element).append(this.html);

			container = $(this.element).find(".ui-smallpopup");
			container.css( 'top',
				this._get_position(parseInt(container.css('height'))) );
		},

		_create: function () {
			this._update();

			this.running = false;
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate", function (e) {
		$(e.target).find(":jqmData(role='smallpopup')").smallpopup();
	});
})(jQuery, this);
