/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($, window, undefined) {
	$.widget("todons.nocontents", $.mobile.widget, {

		max_height: 0,
		container: null,
		icon_img: null,
		text0_bg: null,
		text1_bg: null,

		_get_height: function () {
			var $page = $('.ui-page');
			var $content = $page.children('.ui-content');
			var $header = $page.children('.ui-header');
			var $footer = $page.children('.ui-footer');

			var header_h = $header.outerHeight();
			var footer_h = $footer.outerHeight();
			var padding = parseFloat($content.css('padding-top')) +
					parseFloat($content.css('padding-bottom'));

			var content_h = window.innerHeight - header_h - footer_h - padding;

			return content_h;
		},

		_align: function () {
			var content_height = this._get_height();
			var icon_height = this.icon_img.height();
			var icon_width = this.icon_img.width();
			var content_gap = 54;
			var text_height = this.text0_bg.height();

			var icon_top = (content_height - icon_height) / 2 -
					(content_gap + text_height);

			this.container.height(content_height);

			this.icon_img.css('left',
				(window.innerWidth - icon_width) / 2);
			this.icon_img.css('top', icon_top);

			var text_top = icon_top + icon_height + content_gap;

			this.text0_bg.css('top', text_top);
			this.text1_bg.css('top', text_top + text_height);
		},

		_create: function () {
			var icon_type = $(this.element).attr('data-type');

			if (icon_type === undefined ||
				(icon_type != "picture" &&
				 icon_type != "multimedia" &&
				 icon_type != "text")) {
				icon_type = "unnamed";
			}

			var text = new Array(2);

			text[0] = $(this.element).attr('data-text1');
			text[1] = $(this.element).attr('data-text2');

			if (text[0] === undefined)
				text[0] = "";
			if (text[1] === undefined)
				text[1] = "";

			this.container = $('<div class="ui-nocontents"/>');
			this.icon_img = $('<div class="ui-nocontents-icon-' + icon_type + '"/>');

			this.text0_bg = $('<div class="ui-nocontents-text">' +
					text[0] + '<div>');
			this.text1_bg = $('<div class="ui-nocontents-text">' +
					text[1] + '<div>');

			this.container.append(this.icon_img);
			this.container.append(this.text0_bg);
			this.container.append(this.text1_bg);

			$(this.element).append(this.container);

			this._align();
		},
	});

	$(document).bind("pagecreate create", function (e) {
		$(e.target).find(":jqmData(role='nocontents')").nocontents();
	});
})(jQuery, this);
