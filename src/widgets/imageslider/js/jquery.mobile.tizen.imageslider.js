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
 * Imageslider widget
 *
 * HTML Attributes
 *
 *  data-role: set to 'imageslider'
 *  data-index: start index
 *  data-vertical-align: set to top or middle or bottom.
 *
 * APIs
 *
 *  add(file): add the image (parameter: url of iamge)
 *  remove(index): remove the image (parameter: index of image)
 *  refresh(index): refresh the widget, should be called after add or remove. (parameter: start index)
 *
 * Events
 *
 *  N/A
 *
 * Example
 *
 * <div data-role="imageslider" id="imageslider" data-index="3" data-vertical-align="middle">
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
 *	$('#imageslider').imageslider('remove');
 * });
 *
 */

(function ( $, window, undefined ) {
	$.widget( "tizen.imageslider", $.mobile.widget, {
		options: {
			flicking: false,
			duration: 500
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
		images: [],
		images_hold: [],
		index: 0,
		align_type: null,
		direction: 1,
		container: null,
		loader: [],

		_resize: function ( index ) {
			var img = this.images[index],
				width = this.images[index].width(),
				height = this.images[index].height(),
				margin = 0,
				ratio,
				img_max_width = this.max_width - margin,
				img_max_height = this.max_height - margin;

			ratio = height / width;

			if ( width > img_max_width ) {
				img.width( img_max_width );
				img.height( img_max_width * ratio );
			}

			height = img.height();

			if ( height > img_max_height ) {
				img.height( img_max_height );
				img.width( img_max_height / ratio );
			}
		},

		_align: function ( index, obj ) {
			var img = this.images[index],
				img_top = 0;

			if ( !obj) {
				return;
			}
			if ( !obj.length ) {
				return;
			}

			if ( this.align_type == "middle" ) {
				img_top = ( this.max_height - img.height() ) / 2;
			} else if ( this.align_type == "bottom" ) {
				img_top = this.max_height - img.height();
			} else {
				img_top = 0;
			}

			obj.css( 'top', img_top + 'px' );
		},

		_attach: function ( index, obj ) {
			var self = this,
				processing = function () {
					self._resize( index );
					self._align( index, obj );
				};

			if ( !obj) {
				return;
			}
			if ( !obj.length ) {
				return;
			}
			if ( index < 0 ) {
				return;
			}
			if ( index >= this.images.length ) {
				return;
			}

			obj.css( "display", "block" );
			obj.append( this.images[index] );

			if ( this.images[index].height() ) {
				processing();
			} else {
				this.loader[index] = setInterval( function () {
					if ( !self.images[index].height() ) {
						return;
					}

					processing();
					clearInterval( self.loader[index] );
				}, 10);
			}
		},

		_detach: function ( index, obj ) {
			if ( !obj) {
				return;
			}
			if ( !obj.length ) {
				return;
			}
			if ( index < 0 ) {
				return;
			}
			if ( index >= this.images.length ) {
				return;
			}

			obj.css( "display", "none" );
			this.images[index].removeAttr("style");
			this.images[index].detach();

			clearInterval( this.loader[index] );
		},

		_drag: function ( _x ) {
			var delta,
				coord_x;

			if ( !this.dragging ) {
				return;
			}

			if ( this.options.flicking === false ) {
				delta = this.org_x - _x;

				// first image
				if ( delta < 0 && !this.prev_img.length ) {
					return;
				}
				// last image
				if ( delta > 0 && !this.next_img.length ) {
					return;
				}
			}

			coord_x = _x - this.org_x;

			this.cur_img.css( 'left', coord_x + 'px' );
			if ( this.next_img.length ) {
				this.next_img.css( 'left', coord_x + this.window_width + 'px' );
			}
			if ( this.prev_img.length ) {
				this.prev_img.css( 'left', coord_x - this.window_width + 'px' );
			}
		},

		_move: function ( _x ) {
			var delta = this.org_x - _x,
				flip = 0,
				drag_time,
				sec,
				self;

			if ( delta == 0 ) {
				return;
			}

			if ( delta > 0 ) {
				flip = delta < ( this.max_width * 0.45 ) ? 0 : 1;
			} else {
				flip = -delta < ( this.max_width * 0.45 ) ? 0 : 1;
			}

			if ( !flip ) {
				drag_time = Date.now() - this.org_time;

				if ( Math.abs( delta ) / drag_time > 1 ) {
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
						this.next_img.css( 'left', this.window_width + 'px' );
						this._attach( this.index + 1, this.next_img );
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
						this.prev_img.css( 'left', -this.window_width + 'px' );
						this._attach( this.index - 1, this.prev_img );
					}

					this.direction = -1;
				}
			}

			sec = this.options.duration;
			self = this;

			this.moving = true;

			setTimeout( function () {
				self.moving = false;
			}, sec - 50 );

			this.cur_img.animate( { left: 0 }, sec );
			if ( this.next_img.length ) {
				this.next_img.animate( { left: this.window_width }, sec );
			}
			if ( this.prev_img.length ) {
				this.prev_img.animate( { left: -this.window_width }, sec );
			}
		},

		_add_event: function () {
			var self = this,
				date;

			this.container.bind( 'vmousemove', function ( e ) {
				e.preventDefault();

				if ( self.moving ) {
					return;
				}
				if ( !self.dragging ) {
					return;
				}

				self._drag( e.pageX );
			} );

			this.container.bind( 'vmousedown', function ( e ) {
				e.preventDefault();

				if ( self.moving ) {
					return;
				}

				self.dragging = true;

				self.org_x = e.pageX;

				self.org_time = Date.now();
			} );

			this.container.bind( 'vmouseup', function ( e ) {
				if ( self.moving ) {
					return;
				}

				self.dragging = false;

				self._move( e.pageX );
			} );

			this.container.bind( 'vmouseout', function ( e ) {
				if ( self.moving ) {
					return;
				}
				if ( !self.dragging ) {
					return;
				}

				if ( ( e.pageX < 20 ) ||
						( e.pageX > ( self.max_width - 20 ) ) ) {
					self._move( e.pageX );
					self.dragging = false;
				}
			} );
		},

		_del_event: function () {
			this.container.unbind( 'vmousemove' );
			this.container.unbind( 'vmousedown' );
			this.container.unbind( 'vmouseup' );
			this.container.unbind( 'vmouseout' );
		},

		_show: function () {
			/* resizing */
			this.window_width = $( window ).width();
			this.max_width = this._get_width();
			this.max_height = this._get_height();
			this.container.css( 'height', this.max_height );

			this.cur_img = $( 'div' ).find( '.ui-imageslider-bg:eq(' + this.index + ')' );
			this.prev_img = this.cur_img.prev();
			this.next_img = this.cur_img.next();

			this._attach( this.index - 1, this.prev_img );
			this._attach( this.index, this.cur_img );
			this._attach( this.index + 1, this.next_img );

			if ( this.prev_img.length ) {
				this.prev_img.css( 'left', -this.window_width + 'px' );
			}

			this.cur_img.css( 'left', '0px' );

			if ( this.next_img.length ) {
				this.next_img.css( 'left', this.window_width + 'px' );
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

		_get_width: function () {
			var $page = $( this.element ).parentsUntil( 'ui-page' ),
				$content = $page.children( '.ui-content' ),
				padding = parseFloat( $content.css( 'padding-left' ) )
					+ parseFloat( $content.css( 'padding-right' ) ),
				content_w = $( window ).width() - padding;

			return content_w;
		},

		_get_height: function () {
			var $page = $( this.element ).parentsUntil( 'ui-page' ),
				$content = $page.children( '.ui-content' ),
				header_h = $page.children( '.ui-header' ).outerHeight() || 0,
				footer_h = $page.children( '.ui-footer' ).outerHeight() || 0,
				padding = parseFloat( $content.css( 'padding-top' ) )
					+ parseFloat( $content.css( 'padding-bottom' ) ),
				content_h = $( window ).height() - header_h - footer_h - padding;

			return content_h;
		},

		_create: function () {
			var temp_img,
				self = this,
				index,
				i = 0;

			$( this.element ).wrapInner( '<div class="ui-imageslider"></div>' );
			$( this.element ).find( 'img' ).wrap( '<div class="ui-imageslider-bg"></div>' );

			this.container = $( this.element ).find('.ui-imageslider');

			temp_img = $( 'div' ).find( '.ui-imageslider-bg:first' );

			while ( temp_img.length ) {
				this.images[i] = temp_img.find( 'img' );
				temp_img = temp_img.next();
				i++;
			}

			for ( i = 0; i < this.images.length; i++ ) {
				this.images[i].detach();
			}

			index = parseInt( $( this.element ).jqmData( 'index' ), 10 );
			if ( !index ) {
				index = 0;
			}
			if ( index < 0 ) {
				index = 0;
			}
			if ( index >= this.images.length ) {
				index = this.images.length - 1;
			}

			this.index = index;

			this.align_type = $( this.element ).jqmData( 'vertical-align' );

			$( window ).bind( 'resize', function () {
				self.refresh();
			});
		},

		_update: function () {
			var image_file,
				bg_html,
				temp_img;

			while ( this.images_hold.length ) {
				image_file = this.images_hold.shift();

				bg_html = $( '<div class="ui-imageslider-bg"></div>' );
				temp_img = $( '<img src="' + image_file + '"></div>' );

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

		add: function ( file ) {
			this.images_hold.push( file );
		},

		remove: function ( index ) {
			var temp_img;

			if ( index === undefined ) {
				index = this.index;
			}

			if ( index < 0 || index >= this.images.length ) {
				return;
			}

			if ( index == this.index ) {
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
						this.prev_img.css( 'left', -this.window_width );
						this._attach( index - 2, this.prev_img );
					}
					this.index--;
				} else {
					this.cur_img = this.next_img;
					this.next_img = this.next_img.next();
					if ( this.next_img.length ) {
						this.next_img.css( 'left', this.window_width );
						this._attach( index + 2, this.next_img );
					}
				}

				this.cur_img.animate( { left: 0 }, this.options.duration );

			} else if ( index == this.index - 1 ) {
				temp_img = this.prev_img;
				this.prev_img = this.prev_img.prev();
				if ( this.prev_img.length ) {
					this.prev_img.css( 'left', -this.window_width );
					this._attach( index - 1, this.prev_img );
				}
				this.index--;

			} else if ( index == this.index + 1 ) {
				temp_img = this.next_img;
				this.next_img = this.next_img.next();
				if ( this.next_img.length ) {
					this.next_img.css( 'left', this.window_width );
					this._attach( index + 1, this.next_img );
				}

			} else {
				temp_img = $( 'div' ).find( '.ui-imageslider-bg:eq(' + index + ')' );
			}

			this.images.splice( index, 1 );
			temp_img.detach();
		}
	}); /* End of widget */

	// auto self-init widgets
	$( document ).bind( "pagecreate", function ( e ) {
		$( e.target ).find( ":jqmData(role='imageslider')" ).imageslider();
	});

	$( document ).bind( "pageshow", function ( e ) {
		$( e.target ).find( ":jqmData(role='imageslider')" ).imageslider( 'show' );
	});

	$( document ).bind( "pagebeforehide", function ( e ) {
		$( e.target ).find( ":jqmData(role='imageslider')" ).imageslider( 'hide' );
	} );

}( jQuery, this ) );
