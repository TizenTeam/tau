/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($, window, undefined) {
	$.widget("todons.progressing", $.mobile.widget, {

		bar: [],
		index: 0,
		interval: 0,
		running: false,

		show: function () {
			this.bar[this.index].height('100%');
		},

		hide: function () {
			this.bar[this.index].height('0%');
		},

		increase: function () {
			this.index++;

			if (this.index == 30)
				this.index = 0;
		},

		start: function () {
			if (this.running) {
				return;
			}

			this.running = true;
		},

		stop: function () {
			if (!this.running) {
				return;
			}

			this.running = false;
		},

		_create: function () {
			var container;
			var img = '';

			for (var i = 0; i < 30; i++) {
				var text;

				text = '<div class="ui-progressingImg_' + (i + 1)
					+ '"></div>';
				img += text;
			}

			var html = $('<div class="ui-progressing">' +
					img + '</div>');

			$(this.element).append(html);

			container = $(this.element).find(".ui-progressing");

			for (var i = 0; i < 30; i++) {
				var elm = 'div.ui-progressingImg_' + (i + 1);
				this.bar[i] = container.find(elm);
				this.bar[i].height('0%');
			}

			this.bar[0].height('100%');
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate", function (e) {
		$(e.target).find(":jqmData(role='progressing')").progressing();
	});
})(jQuery, this);
