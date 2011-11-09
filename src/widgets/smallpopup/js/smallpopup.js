/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($, window, undefined) {
	$.widget("todons.smallpopup", $.mobile.widget, {

		param: null,
		interval: null,
		seconds: null,
		running: false,

		show: function () {
			if (this.running)
				this.hide();

			this.html_none.detach();
			this.html_hide.detach();

			this._update();

			this._append_show();
			this._add_event();

			this.running = true;
		},

		hide: function () {
			if (!this.running)
				return;

			this._del_event();

			this.html_none.detach();
			this.html.detach();

			this._append_hide();

			this.running = false;
		},

		_append_show: function () {
			$(this.element).append(this.html);

			var container = $(this.element).find(".ui-smallpopup");
			container.css('top',
				window.innerHeight - parseInt(container.css('height')));
		},

		_append_hide: function () {
			$(this.element).append(this.html_hide);

			var container = $(this.element).find(".ui-smallpopup-hide");
			container.css('top',
				window.innerHeight - parseInt(container.css('height')));
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

		_update: function () {
			var text = new Array(2);
			var msg;

			text[0] = $(this.element).attr('data-text1');
			text[1] = $(this.element).attr('data-text2');
			this.param = $(this.element).attr('data-param');
			this.seconds = $(this.element).attr('data-interval');

			msg = text[0] + ': ' + text[1];

			this.html = $('<div class="ui-smallpopup">' +
					'<div class="ui-smallpopup-text-bg">' +
					msg + '</div>' +
					'</div>');
			this.html_hide = $('<div class="ui-smallpopup-hide">' +
					'<div class="ui-smallpopup-text-bg">' +
					msg + '</div>' +
					'</div>');
			this.html_none = $('<div class="ui-smallpopup-none ">' +
					'</div>');
		},

		_create: function () {
			this._update();

			$(this.element).append(this.html_none);
			this.running = false;
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate", function (e) {
		$(e.target).find(":jqmData(role='smallpopup')").smallpopup();
	});
})(jQuery, this);
