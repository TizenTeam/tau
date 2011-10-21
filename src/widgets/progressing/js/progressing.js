/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($, window, undefined) {
	$.widget("todons.progressing", $.mobile.widget, {

		running: false,

		_show: function () {
			this.html_hide.detach();
			$(this.element).append(this.html);
		},

		_hide: function () {
			this.html.detach();
			$(this.element).append(this.html_hide);
		},

		start: function () {
			if (this.running) {
				return;
			}

			this.running = true;
			this._show();
		},

		stop: function () {
			if (!this.running) {
				return;
			}

			this.running = false;
			this._hide();
		},

		_create: function () {
			this.html = $('<div class="ui-progressing-bg">' +
					 '<div class="ui-progressing">' +
					 '<div class="ui-progressingImg"></div>' +
					 '</div></div>');
			this.html_hide = $('<div class="ui-progressing-bg">' +
					 '<div class="ui-progressing">' +
					 '<div class="ui-progressingImg-stop"></div>' +
					 '</div></div>');
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate", function (e) {
		$(e.target).find(":jqmData(role='progressing')").progressing();
	});
})(jQuery, this);
