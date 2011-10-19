/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($, window, undefined) {
	$.widget("todons.progress_pending", $.mobile.widget, {

		bar: [],
		index: 0,
		interval: 0,
		running: false,

		show: function () {
			this.bar[this.index].height('100%');
		},

		hide: function (i) {
			this.bar[this.index].height('0%');
		},

		increase: function () {
			this.index++;

			if (this.index == 2)
				this.index= 0;
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

		/*
		 * function: loads the html divs from progressbar.prototype.html
		 * and sets the value to the initial value specified in options
		 */
		_create: function () {
			var container;
			var html = $('<div class="ui-progress_pending">' +
					'<div class="ui-pendingImg_1"></div>' +
					'<div class="ui-pendingImg_2"></div>' +
					'</div>');

			$(this.element).append(html);

			container = $(this.element).find(".ui-progress_pending");
			this.bar[0] = container.find("div.ui-pendingImg_1");
			this.bar[1] = container.find("div.ui-pendingImg_2");

			this.bar[0].height('100%');
			this.bar[1].height('0%');
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate", function (e) {
		$(e.target).find(":jqmData(role='progress_pending')").progress_pending();
	});
})(jQuery, this);
