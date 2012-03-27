/* ***************************************************************************
 * Copyright (c) 2000 - 2011 Samsung Electronics Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 *	Author: Minkyu Kang <mk7.kang@samsung.com>
 */

/*
 * Notification widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'imageslider'
 *  data-start-index: start index
 *  data-vertical-align: set to top or middle or bottom.
 *
 * APIs
 *
 *  add(image_file): add the image (parameter: url of iamge)
 *  del(image_index): delete the image (parameter: index of image)
 *  refresh(): refresh the widget, should be called after add or del.
 *
 * Events
 *
 *  N/A
 *
 * Example
 *
 * <div data-role="imageslider" id="imageslider" data-start-index="3" data-vertical-align="middle">
 *	<img src="01.jpg">
 *	<img src="02.jpg">
 *	<img src="03.jpg">
 *	<img src="04.jpg">
 *	<img src="05.jpg">
 * </div>
 *
 *
 * $('#imageslider-add').bind('vmouseup', function ( e ) {
 *	$('#imageslider').imageslider('add', '9.jpg');
 *	$('#imageslider').imageslider('add', '10.jpg');
 *	$('#imageslider').imageslider('refresh');
 * });
 *
 * $('#imageslider-del').bind('vmouseup', function ( e ) {
 *	$('#imageslider').imageslider('del');
 * });
 *
 */

(function ($, window, undefined) {
	$.widget("tizen.imageslider", $.mobile.widget, {
		options: {
			photoFlicking: false
		},

		dragging: false,
		moving: false,
		max_width: 0,
		max_height: 0,
		org_x: 0,
		org_time: null,
		cur_img: null,
		prev_img: null,
		next_img: null,
		images: null,
		images_hold: null,
		index: 0,
		align_type: null,
		direction: 1,
		container: null,
		interval: null,

		_resize: function ( obj ) {
			var width;
			var height;
			var margin = 40;
			var ratio;
			var img_max_width = this.max_width - margin;
			var img_max_height = this.max_height - margin;

			height = obj.height();
			width = obj.width();

			ratio = height / width;

			if ( width > img_max_width ) {
				obj.width( img_max_width );
				obj.height( img_max_width * ratio );
			}

			height = obj.height();

			if ( height > img_max_height ) {
				obj.height( img_max_height );
				obj.width( img_max_height / ratio );
			}
		},

		_align: function ( obj, img ) {
			var img_top = 0;

			if ( !obj.length )
				return;

			if ( this.align_type == "middle" ) {
				img_top = (this.max_height - img.height()) / 2;
			} else if ( this.align_type == "bottom" ) {
				img_top = this.max_height - img.height();
			} else {
				img_top = 0;
			}

			obj.css( 'top', img_top + 'px' );
		},

		_detach: function ( image_index, obj ) {
			if ( !obj.length ) {
				return;
			}
			if ( image_index < 0 ) {
				return;
			}
			if ( image_index >= this.images.length ) {
				return;
			}

			this.images[image_index].detach();
			obj.css( "display", "none" );
		},

		_attach: function ( image_index, obj ) {
			if ( !obj.length ) {
				return;
			}
			if ( image_index < 0 ) {
				return;
			}
			if ( image_index >= this.images.length ) {
				return;
			}

			obj.css( "display", "block" );
			obj.append( this.images[image_index] );
			this._resize( this.images[image_index] );
			this._align( obj, this.images[image_index] );
		},

		_drag: function ( _x ) {
			if ( !this.dragging ) {
				return;
			}

			if ( this.options.photoFlicking === false ) {
				var delta = this.org_x - _x;

				// first image
				if ( delta < 0 && !this.prev_img.length ) {
					return;
				}
				// last image
				if ( delta > 0 && !this.next_img.length ) {
					return;
				}
			}

			var coord_x = _x - this.org_x;

			this.cur_img.css( 'left', coord_x + 'px' );
			if ( this.next_img.length ) {
				this.next_img.css('left',
						coord_x + this.max_width + 'px');
			}
			if ( this.prev_img.length ) {
				this.prev_img.css('left',
						coord_x - this.max_width + 'px');
			}
		},

		_move: function ( _x ) {
			var delta = this.org_x - _x;
			var flip = 0;

			if ( delta == 0 ) {
				return;
			}

			if ( delta > 0 ) {
				flip = delta < (this.max_width * 0.45) ? 0 : 1;
			} else {
				flip = -delta < (this.max_width * 0.45) ? 0 : 1;
			}

			if ( !flip ) {
				var date = new Date();
				var drag_time = date.getTime() - this.org_time;

				if ( Math.abs(delta) / drag_time > 1 ) {
					flip = 1;
				}
			}

			if ( flip ) {
				if ( delta > 0 && this.next_img.length ) {
					/* next */
					this._detach( this.index - 1, this.prev_img );

					this.prev_img = this.cur_img;
					this.cur_img = this.next_img;
					this.next_img = this.next_img.next();

					this.index++;

					if ( this.next_img.length ) {
						this.next_img.css( 'left',
							this.max_width + 'px' );
						this._attach( this.index + 1,
							this.next_img );
					}

					this.direction = 1;

				} else if ( delta < 0 && this.prev_img.length ) {
					/* prev */
					this._detach( this.index + 1, this.next_img );

					this.next_img = this.cur_img;
					this.cur_img = this.prev_img;
					this.prev_img = this.prev_img.prev();

					this.index--;

					if ( this.prev_img.length ) {
						this.prev_img.css( 'left',
							-this.max_width + 'px' );
						this._attach( this.index - 1,
							this.prev_img );
					}

					this.direction = -1;
				}
			}

			var sec = 500;
			var self = this;

			this.moving = true;

			this.interval = setInterval(function () {
				self.moving = false;
				clearInterval( self.interval );
			}, sec - 50);

			this.cur_img.animate({left: 0}, sec);
			if ( this.next_img.length ) {
				this.next_img.animate({left: this.max_width}, sec);
			}
			if ( this.prev_img.length ) {
				this.prev_img.animate({left: -this.max_width}, sec);
			}
		},

		_add_event: function () {
			var self = this;

			this.container.bind('vmousemove', function ( e ) {
				e.preventDefault();

				if ( self.moving ) {
					return;
				}
				if ( !self.dragging ) {
					return;
				}

				self._drag( e.pageX );
			});

			this.container.bind('vmousedown', function ( e ) {
				e.preventDefault();

				if ( self.moving ) {
					return;
				}

				self.dragging = true;

				self.org_x = e.pageX;

				var date = new Date();
				self.org_time = date.getTime();
			});

			this.container.bind('vmouseup', function (e) {
				if ( self.moving ) {
					return;
				}

				self.dragging = false;

				self._move( e.pageX );
			});

			this.container.bind('vmouseout', function (e) {
				if ( self.moving ) {
					return;
				}
				if ( !self.dragging ) {
					return;
				}

				if ( (e.pageX < 20) ||
					(e.pageX > (self.max_width - 20)) ) {
					self._move( e.pageX );
					self.dragging = false;
				}
			});
		},

		_del_event: function () {
			this.container.unbind('vmousemove');
			this.container.unbind('vmousedown');
			this.container.unbind('vmouseup');
			this.container.unbind('vmouseout');
		},

		_show: function () {
			this.cur_img = $('div').find(
					'.ui-imageslider-bg:eq(' + this.index + ')');
			this.prev_img = this.cur_img.prev();
			this.next_img = this.cur_img.next();

			this._attach( this.index - 1, this.prev_img );
			this._attach( this.index, this.cur_img );
			this._attach( this.index + 1, this.next_img );

			if ( this.prev_img.length ) {
				this.prev_img.css( 'left', -this.max_width + 'px' );
			}

			this.cur_img.css( 'left', 0 + 'px' );

			if ( this.next_img.length ) {
				this.next_img.css( 'left', this.max_width + 'px' );
			}
		},

		show: function () {
			this._show();
			this._add_event();
		},

		_hide: function () {
			this._detach( this.index - 1, this.prev_img );
			this._detach( this.index, this.cur_img );
			this._detach( this.index + 1, this.next_img );
		},

		hide: function () {
			this._hide();
			this._del_event();
		},

		_get_height: function () {
			var $page = $('.ui-page');
			var $content = $page.children('.ui-content');
			var $header = $page.children('.ui-header');
			var $footer = $page.children('.ui-footer');

			var header_h = $header.outerHeight();
			var footer_h = $footer.outerHeight();
			var padding = parseFloat($content.css('padding-top')) +
					parseFloat($content.css('padding-bottom'));

			var content_h = $(window).height() - header_h -
					footer_h - padding * 2;

			return content_h;
		},

		_create: function () {
			this.images = new Array();
			this.images_hold = new Array();

			$( this.element ).wrapInner('<div class="ui-imageslider"></div>');
			$( this.element ).find('img').wrap('<div class="ui-imageslider-bg"></div>');

			this.container = $( this.element ).find('.ui-imageslider');

			this.max_width = $(window).width();
			this.max_height = this._get_height();
			this.container.css( 'height', this.max_height );

			var temp_img = $('div').find('.ui-imageslider-bg:first');

			for ( i = 0; ; i++ ) {
				if ( !temp_img.length ) {
					break;
				}

				this.images[i] = temp_img.find('img');

				temp_img = temp_img.next();
			}

			for ( i = 0; i < this.images.length; i++ ) {
				this.images[i].detach();
			}

			var start_index = parseInt( $(this.element).attr('data-start-index') );
			if ( start_index === undefined ) {
				start_index = 0;
			}
			if ( start_index < 0 ) {
				start_index = 0;
			}
			if ( start_index >= this.images.length ) {
				start_index = this.images.length - 1;
			}

			this.index = start_index;

			this.align_type = $( this.element ).attr('data-vertical-align');
		},

		_update: function () {
			while ( 1 ) {
				if ( !this.images_hold.length ) {
					break;
				}

				var image_file = this.images_hold.shift();

				var bg_html = $('<div class="ui-imageslider-bg"></div>');
				var temp_img = $('<img src="' + image_file + '"></div>');

				bg_html.append( temp_img );
				this.container.append( bg_html );
				this.images.push( temp_img );
			}
		},

		refresh: function ( start_index ) {
			this._update();

			this._hide();

			if ( start_index === undefined ) {
				start_index = this.index;
			}
			if ( start_index < 0 ) {
				start_index = 0;
			}
			if ( start_index >= this.images.length ) {
				start_index = this.images.length - 1;
			}

			this.index = start_index;

			this._show();
		},

		add: function ( image_file ) {
			this.images_hold.push( image_file );
		},

		del: function ( image_index ) {
			var temp_img;

			if ( image_index === undefined ) {
				image_index = this.index;
			}

			if ( image_index < 0 || image_index >= this.images.length ) {
				return;
			}

			if ( image_index == this.index ) {
				temp_img = this.cur_img;

				if ( this.index == 0 ) {
					this.direction = 1;
				} else if ( this.index == this.images.length - 1 ) {
					this.direction = -1;
				}

				if ( this.direction < 0 ) {
					this.cur_img = this.prev_img;
					this.prev_img = this.prev_img.prev();
					if ( this.prev_img.length ) {
						this.prev_img.css( 'left', -this.max_width );
						this._attach( image_index - 2, this.prev_img );
					}
					this.index--;
				} else {
					this.cur_img = this.next_img;
					this.next_img = this.next_img.next();
					if ( this.next_img.length ) {
						this.next_img.css( 'left', this.max_width );
						this._attach( image_index + 2, this.next_img );
					}
				}

				this.cur_img.animate({left: 0}, 500);

			} else if ( image_index == this.index - 1 ) {
				temp_img = this.prev_img;
				this.prev_img = this.prev_img.prev();
				if ( this.prev_img.length ) {
					this.prev_img.css( 'left', -this.max_width );
					this._attach( image_index - 1, this.prev_img );
				}
				this.index--;

			} else if ( image_index == this.index + 1 ) {
				temp_img = this.next_img;
				this.next_img = this.next_img.next();
				if ( this.next_img.length ) {
					this.next_img.css( 'left', this.max_width );
					this._attach( image_index + 1, this.next_img );
				}

			} else {
				temp_img = $('div').find('.ui-imageslider-bg:eq('+ image_index + ')');
			}

			this.images.splice( image_index, 1 );
			temp_img.detach();
		}
	}); /* End of widget */

	// auto self-init widgets
	$( document ).bind("pagecreate", function (e) {
		$( e.target ).find(":jqmData(role='imageslider')").imageslider();
	});

	$( document ).bind("pageshow", function (e) {
		$( e.target ).find(":jqmData(role='imageslider')").imageslider('show');
	});

	$( document ).bind("pagebeforehide", function (e) {
		$ (e.target ).find(":jqmData(role='imageslider')").imageslider('hide');
	});

})( jQuery, this );
