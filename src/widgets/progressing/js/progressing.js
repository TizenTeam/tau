/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($, window, undefined) {
	$.widget("todons.progressing", $.mobile.widget, {

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

			 var html = $('<div class="ui-progressing-bg">' +
					 '<div class="ui-progressing">' +
					 '<div class="ui-progressingImg"></div>' +
					 '</div></div>');

			$(this.element).append(html);

			container = $(this.element).find(".ui-progressing");
			this.bar = container.find(".ui-progressingImg");

			this.height = this.bar.height();
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate", function (e) {
		$(e.target).find(":jqmData(role='progressing')").progressing();
	});
})(jQuery, this);
