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
		images: null,
		index: 0,
		align_type: null,

		_resize: function (obj) {
			var width;
			var height;
			var margin = 40;

			height = obj.height();
			width = obj.width();

			if (width >= height)
				obj.width(this.max_width - margin);
			else
				obj.height(this.max_height - margin);
		},

		_detach: function (image_index, obj) {
			if (!obj.length)
				return;
			if (image_index < 0)
				return;
			if (image_index >= this.images.length)
				return;

			this.images[image_index].detach();
			obj.css("display", "none");
		},

		_attach: function (image_index, obj) {
			if (!obj.length)
				return;
			if (image_index < 0)
				return;
			if (image_index >= this.images.length)
				return;

			obj.css("display", "");
			obj.append(this.images[image_index]);
			this._resize(this.images[image_index]);
			this._align(obj);
		},

		_drag: function (_x) {
			if (!this.moving)
				return;

			var coord_x = _x - rel_x;

			this.cur_img.css('left', coord_x + 'px');
			if (this.next_img.length)
				this.next_img.css('left', coord_x + this.max_width + 'px');
			if (this.prev_img.length)
				this.prev_img.css('left', coord_x - this.max_width + 'px');
		},

		_move: function (_x) {
			if (!this.moving)
				return;

			var delta = org_x - _x;
			var flip = 0;

			if (delta > 0)
				flip = delta < (this.max_width * 0.45) ? 0 : 1;
			else
				flip = -delta < (this.max_width * 0.45) ? 0 : 1;

			if (flip) {
				if (delta > 0 && this.next_img.length) {
					/* next */
					this._detach(this.index - 1, this.prev_img);

					this.prev_img = this.cur_img;
					this.cur_img = this.next_img;
					this.next_img = this.next_img.next();

					this.index++;
					this._attach(this.index + 1, this.next_img);

					if (this.next_img.length)
						this.next_img.css('left', this.max_width + 'px');
				} else if (delta < 0 && this.prev_img.length) {
					/* prev */
					this._detach(this.index + 1, this.next_img);

					this.next_img = this.cur_img;
					this.cur_img = this.prev_img;
					this.prev_img = this.prev_img.prev();

					this.index--;
					this._attach(this.index - 1, this.prev_img);

					if (this.prev_img.length)
						this.prev_img.css('left', -this.max_width + 'px');
				}
			}

			this.cur_img.animate({left: 0}, 400);
			if (this.next_img.length)
				this.next_img.animate({left: this.max_width}, 400);
			if (this.prev_img.length)
				this.prev_img.animate({left: -this.max_width}, 400);
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

			container.bind('vmouseout', function (e) {
				if (!self.moving)
					return;

				if ((e.pageX <= 0) || (e.pageX >= self.max_width)) {
					self._move(e.pageX);
					self.moving = false;
				}
			});
		},

		_del_event: function () {
			var container = $(this.element).find(".ui-imageslider");

			container.unbind('vmousemove');
			container.unbind('vmousedown');
			container.unbind('vmouseup');
			container.unbind('vmouseout');
		},

		_align: function (obj) {
			var img_top = 0;

			if (!obj.length)
				return;

			if (this.align_type == "middle")
				img_top = (this.max_height - obj.height()) / 2;
			else if (this.align_type == "bottom")
				img_top = this.max_height - temp_img.height();
			else
				img_top = 0;

			obj.css('top', img_top + 'px');
		},

		show: function () {
			this.cur_img = $('div').find('.ui-imageslider-bg:eq(' + this.index + ')');
			this.prev_img = this.cur_img.prev();
			this.next_img = this.cur_img.next();

			this._attach(this.index - 1, this.prev_img);
			this._attach(this.index, this.cur_img);
			this._attach(this.index + 1, this.next_img);

			if (this.prev_img.length)
				this.prev_img.css('left', -this.max_width + 'px');
			this.cur_img.css('left', 0 + 'px');
			if (this.next_img.length)
				this.next_img.css('left', this.max_width + 'px');

			this._add_event();
		},

		hide: function () {
			this._detach(this.index - 1, this.prev_img);
			this._detach(this.index, this.cur_img);
			this._detach(this.index + 1, this.next_img);

			this._del_event();
		},

		_create: function () {
			this.images = new Array();

			$(this.element).wrapInner('<div class="ui-imageslider"></div>');
			$('img').wrap('<div class="ui-imageslider-bg"></div>');

			var container = $(this.element).find('.ui-imageslider');

			this.max_width = window.innerWidth;
			this.max_height = window.innerHeight - 100 - 30;
			container.css('height', this.max_height);

			var temp_img = $('div').find('.ui-imageslider-bg:first');

			for (i = 0; ; i++) {
				if (!temp_img.length)
					break;

				temp_img.css("display", "none");
				this.images[i] = temp_img.find('img');

				temp_img = temp_img.next();
			}

			for (i = 0; i < this.images.length; i++)
				this.images[i].detach();

			var start_index = parseInt($(this.element).attr('data-start-index'));
			if (start_index === undefined)
				start_index = 0;
			if (start_index < 0)
				start_index = 0;
			if (start_index >= this.images.length)
				start_index = this.images.length - 1;

			this.index = start_index;

			this.align_type = $(this.element).attr('data-vertical-align');
		},
	}); /* End of widget */

	// auto self-init widgets
	$(document).bind("pagecreate create", function (e) {
		$(e.target).find(":jqmData(role='imageslider')").imageslider();
	});

	$(document).bind("pageshow", function (e) {
		$(e.target).find(":jqmData(role='imageslider')").imageslider('show');
	});

	$(document).bind("pagehide", function (e) {
		$(e.target).find(":jqmData(role='imageslider')").imageslider('hide');
	});

})(jQuery, this);
