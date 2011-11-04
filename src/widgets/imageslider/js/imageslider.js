/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Minkyu Kang <mk7.kang@samsung.com>
 */

(function ($, window, undefined) {
	$.widget("todons.imageslider", $.mobile.widget, {

		moving: false,
		max_width: 0,
		max_height: 0,
		rel_x: 0,
		org_x: 0,
		cur_img: null,
		prev_img: null,
		next_img: null,

		_drag: function (_x) {
			if (!this.moving)
				return;

			var coord_x = _x - rel_x;

			this.cur_img.css('left', coord_x + 'px');
			if (this.next_img.length)
				this.next_img.css('left', coord_x + max_width + 'px');
			if (this.prev_img.length)
				this.prev_img.css('left', coord_x - max_width + 'px');
		},

		_move: function (_x) {
			if (!this.moving)
				return;

			var delta = org_x - _x;
			var flip = 0;

			if (delta > 0)
				flip = delta < (max_width * 0.45) ? 0 : 1;
			else
				flip = -delta < (max_width * 0.45) ? 0 : 1;

			if (flip) {
				if (delta > 0) {
					/* next */
					if (this.next_img.length) {
						this.prev_img = this.cur_img;
						this.cur_img = this.next_img;
						this.next_img = this.next_img.next();
					}
				} else {
					/* prev */
					if (this.prev_img.length) {
						this.next_img = this.cur_img;
						this.cur_img = this.prev_img;
						this.prev_img = this.prev_img.prev();
					}
				}
			}

			this.cur_img.animate({left: 0}, 400);
			if (this.next_img.length)
				this.next_img.animate({left: max_width}, 400);
			if (this.prev_img.length)
				this.prev_img.animate({left: -max_width}, 400);
		},

		_add_event: function () {
			var self = this;
			var container = $(this.element).find(".ui-imageslider");

			container.bind('vmousemove', function (e) {
				if (!self.moving)
					return;

				self._drag(e.pageX);

				e.preventDefault();
			});

			container.bind('vmousedown', function (e) {
				self.moving = true;

				var c = targetRelativeCoordsFromEvent(e);
				rel_x = c.x;
				org_x = e.pageX;

				e.preventDefault();
			});

			container.bind('vmouseup', function (e) {
				self._move(e.pageX);
				self.moving = false;
			});
		},

		align: function (type) {
			var temp_img = this.cur_img;
			var img_top = 0;

			if (type == "top" || (type != "middle" && type != "bottom"))
				return;

			while (1) {
				if (!temp_img.length)
					break;

				if (type == "middle")
					img_top = (max_height - temp_img.height()) / 2;
				else if (type == "bottom")
					img_top = max_height - temp_img.height();
				else
					img_top = 0;

				if (img_top < 0)
					img_top = 0;

				temp_img.css('top', img_top + 'px');
				temp_img = temp_img.next();
			}
		},

		_create: function () {
			$(this.element).wrapInner('<div class="ui-imageslider"></div>');
			$('img').wrap('<div class="ui-imageslider-bg"></div>');

			var container = $(this.element).find(".ui-imageslider");

			max_width = window.innerWidth;
			max_height = window.innerHeight - 100 - 30;
			container.css('height', max_height);

			this.cur_img = $('div').find(".ui-imageslider-bg:first");
			this.next_img = this.cur_img.next();

			var temp_img = this.next_img;
			while (1) {
				if (!temp_img.length)
					break;

				temp_img.css('left', max_width + 'px');
				temp_img = temp_img.next();
			}

			this._add_event();
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate", function (e) {
		$(e.target).find(":jqmData(role='imageslider')").imageslider();
	});
})(jQuery, this);
