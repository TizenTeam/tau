/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Minkyu Kang <mk7.kang@samsung.com>
 *          Koeun Choi <koeun.choi@samsung.com>
 */

(function ($, window, undefined) {
	$.widget("todons.tickernoti", $.mobile.widget, {
		btn: null,
		param: null,
		interval: null,
		seconds: null,
		running: false,

		show: function () {
			if (this.running)
				this.hide();

			this._update();

			this._add_event();

			this.running = true;
			$(this.html).addClass( "show" ).removeClass( "hide" );
		},

		hide: function () {
			if (!this.running)
				return;

			$(this.html).addClass( "hide" ).removeClass( "show" );
			this._del_event();

			this.running = false;
		},

		_add_event: function () {
			var self = this;
			var container = $(this.element).find(".ui-ticker");
			var bg_container = container.find(".ui-ticker-body");
			var btn_container = container.find(".ui-ticker-btn");

			btn_container.append(this.btn);

			this.btn.bind('vmouseup', function () {
				self.hide();
			});

			bg_container.bind('vmouseup', function () {
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
			var container = $(this.element).find(".ui-ticker");
			var bg_container = container.find(".ui-ticker-body");

			this.btn.unbind('vmouseup');
			bg_container.unbind('vmouseup');
			clearInterval(this.interval);
		},

		_update: function () {
			var text = new Array(2);

			text[0] = $(this.element).attr('data-text1');
			text[1] = $(this.element).attr('data-text2');
			this.param = $(this.element).attr('data-param');
			this.seconds = $(this.element).attr('data-interval');

			if (this.html)
				this.html.detach();

			this.html = $('<div class="ui-ticker">' +
					'<div class="ui-ticker-bg">' +
					'<div class="ui-ticker-icon"></div>' +
					'<div class="ui-ticker-text1-bg">' +
					text[0] + '</div>' +
					'<div class="ui-ticker-text2-bg">' +
					text[1] + '</div>' +
					'<div class="ui-ticker-body"></div>' +
					'<div class="ui-ticker-btn"></div>' +
					'</div>' +
					'</div>');

			$(this.element).append(this.html);
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
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate create", function (e) {
		$(e.target).find(":jqmData(role='tickernoti')").tickernoti();
	});
})(jQuery, this);
