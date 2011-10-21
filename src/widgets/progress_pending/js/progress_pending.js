/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($, window, undefined) {
	$.widget("todons.progress_pending", $.mobile.widget, {

		bar: null,
		running: false,
		height: 0,

		_show: function () {
			this.bar.height(this.height);
		},

		_hide: function () {
			this.height = this.bar.height();
			this.bar.height(0);
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
			var container;
			var html = $('<div class="ui-pending">' +
					'<div class="ui-pending-bar"></div>' +
					'</div>');

			$(this.element).append(html);

			container = $(this.element).find(".ui-pending");
			this.bar = container.find("div.ui-pending-bar");

			this.height = this.bar.height();
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate", function (e) {
		$(e.target).find(":jqmData(role='progress_pending')").progress_pending();
	});
})(jQuery, this);
