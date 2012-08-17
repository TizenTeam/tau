/*
* jQuery Mobile Framework : scrollview plugin
* Copyright (c) 2010 Adobe Systems Incorporated - Kin Blas (jblas@adobe.com)
* Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
* Note: Code is in draft form and is subject to change
* Modified by Koeun Choi <koeun.choi@samsung.com>
* Modified by Minkyu Kang <mk7.kang@samsung.com>
*/

(function ( $, window, document, undefined ) {

	function resizePageContentHeight( page ) {
		var $page = $( page ),
			$content = $page.children(".ui-content"),
			hh = $page.children(".ui-header").outerHeight() || 0,
			fh = $page.children(".ui-footer").outerHeight() || 0,
			pt = parseFloat( $content.css("padding-top") ),
			pb = parseFloat( $content.css("padding-bottom") ),
			wh = $( window ).height();

		$content.height( wh - (hh + fh) - (pt + pb) );
	}

	function MomentumTracker( options ) {
		this.options = $.extend( {}, options );
		this.easing = "easeOutQuad";
		this.reset();
	}

	var tstates = {
		scrolling: 0,
		overshot:  1,
		snapback:  2,
		done:      3
	};

	function getCurrentTime() {
		return ( new Date() ).getTime();
	}

	jQuery.widget( "tizen.scrollview", jQuery.mobile.widget, {
		options: {
			fps:               60,    // Frames per second in msecs.
			direction:         null,  // "x", "y", or null for both.

			scrollDuration:    2000,  // Duration of the scrolling animation in msecs.
			overshootDuration: 250,   // Duration of the overshoot animation in msecs.
			snapbackDuration:  500,   // Duration of the snapback animation in msecs.

			moveThreshold:     30,   // User must move this many pixels in any direction to trigger a scroll.
			moveIntervalThreshold:     150,   // Time between mousemoves must not exceed this threshold.

			scrollMethod:      "translate",  // "translate", "position"
			startEventName:    "scrollstart",
			updateEventName:   "scrollupdate",
			stopEventName:     "scrollstop",

			eventType:         $.support.touch ? "touch" : "mouse",

			showScrollBars:    true,
			overshootEnable:   false,
		},

		_makePositioned: function ( $ele ) {
			if ( $ele.css("position") === "static" ) {
				$ele.css( "position", "relative" );
			}
		},

		_create: function () {
			var $page = $('.ui-page'),
				direction,
				self = this;

			this._$clip = $( this.element ).addClass("ui-scrollview-clip");
			this._$view = this._$clip.wrapInner("<div></div>").children()
							.addClass("ui-scrollview-view");

			if ( this.options.scrollMethod === "translate" ) {
				if ( this._$view.css("transform") === undefined ) {
					this.options.scrollMethod = "position";
				}
			}

			this._$clip.css( "overflow", "hidden" );
			this._makePositioned( this._$clip );

			this._makePositioned( this._$view );
			this._$view.css( { left: 0, top: 0 } );
			this._view_height = this._$view.height();

			this._sx = 0;
			this._sy = 0;

			direction = this.options.direction;

			this._hTracker = ( direction !== "y" ) ?
					new MomentumTracker( this.options ) : null;
			this._vTracker = ( direction !== "x" ) ?
					new MomentumTracker( this.options ) : null;

			this._timerInterval = 1000 / this.options.fps;
			this._timerID = 0;

			this._timerCB = function () {
				self._handleMomentumScroll();
			};

			this._add_event();
			this._add_scrollbar();
		},

		_startMScroll: function ( speedX, speedY ) {
			var keepGoing = false,
				duration = this.options.scrollDuration,
				ht = this._hTracker,
				vt = this._vTracker,
				c,
				v;

			this._stopMScroll();
			this._showScrollBars();

			this._$clip.trigger( this.options.startEventName );

			if ( ht ) {
				c = this._$clip.width();
				v = this._$view.width();

				ht.start( this._sx, speedX,
					duration, (v > c) ? -(v - c) : 0, 0 );
				keepGoing = !ht.done();
			}

			if ( vt ) {
				c = this._$clip.height();
				v = this._$view.height() +
					parseFloat( this._$view.css("padding-top") );

				vt.start( this._sy, speedY,
					duration, (v > c) ? -(v - c) : 0, 0 );
				keepGoing = keepGoing || !vt.done();
			}

			if ( keepGoing ) {
				this._timerID = setTimeout( this._timerCB, this._timerInterval );
			} else {
				this._stopMScroll();
			}
		},

		_stopMScroll: function () {
			if ( this._timerID ) {
				this._$clip.trigger( this.options.stopEventName );
				clearTimeout( this._timerID );
			}
			this._timerID = 0;

			if ( this._vTracker ) {
				this._vTracker.reset();
			}

			if ( this._hTracker ) {
				this._hTracker.reset();
			}

			this._hideScrollBars();
		},

		_handleMomentumScroll: function () {
			var keepGoing = false,
				x = 0,
				y = 0,
				vt = this._vTracker,
				ht = this._hTracker;

			if ( this._outerScrolling ) {
				return;
			}

			if ( vt ) {
				vt.update( this.options.overshootEnable );
				y = vt.getPosition();
				keepGoing = !vt.done();
			}

			if ( ht ) {
				ht.update( this.options.overshootEnable );
				x = ht.getPosition();
				keepGoing = keepGoing || !ht.done();
			}

			this._setScrollPosition( x, y );
			this._$clip.trigger( this.options.updateEventName,
					[ { x: x, y: y } ] );

			if ( keepGoing ) {
				this._timerID = setTimeout( this._timerCB, this._timerInterval );
			} else {
				this._stopMScroll();
			}
		},

		_setElementTransform: function ( $ele, x, y, duration ) {
			var translate,
				transition;

			if ( !duration || duration === undefined ) {
				transition = "none";
			} else {
				transition =  "-webkit-transform " + duration / 1000 + "s";
			}

			if ( $.support.cssTransform3d ) {
				translate = "translate3d(" + x + "," + y + ", 0px)";
			} else {
				translate = "translate(" + x + "," + y + ")";
			}

			$ele.css({
				"-moz-transform": translate,
				"-webkit-transform": translate,
				"-ms-transform": translate,
				"-o-transform": translate,
				"transform": translate,
				"-webkit-transition": transition
			});
		},

		_setCalibration: function ( x, y ) {
			if ( this.options.overshootEnable ) {
				this._sx = x;
				this._sy = y;
				return;
			}

			var $v = this._$view,
				$c = this._$clip,
				dirLock = this._directionLock,
				scroll_height = 0,
				scroll_width = 0;

			if ( dirLock !== "y" && this._hTracker ) {
				scroll_width = $v.width() - $c.width();

				if ( x >= 0 ) {
					this._sx = 0;
				} else if ( x < -scroll_width ) {
					this._sx = -scroll_width;
				} else {
					this._sx = x;
				}

				if ( scroll_width < 0 ) {
					this._sx = 0;
				}
			}

			if ( dirLock !== "x" && this._vTracker ) {
				scroll_height = $v.height() - $c.height() +
					parseFloat( $c.css("padding-top") ) +
					parseFloat( $c.css("padding-bottom") );

				this._outerScroll( y, scroll_height );

				if ( y >= 0 ) {
					this._sy = 0;
				} else if ( y < -scroll_height ) {
					this._sy = -scroll_height;
				} else {
					this._sy = y;
				}

				if ( scroll_height < 0 ) {
					this._sy = 0;
				}
			}
		},

		_setScrollPosition: function ( x, y, duration ) {
			var $v = this._$view,
				sm = this.options.scrollMethod,
				$vsb = this._$vScrollBar,
				$hsb = this._$hScrollBar,
				$sbt;

			this._setCalibration( x, y );

			if ( this._outerScrolling ) {
				return;
			}

			x = this._sx;
			y = this._sy;

			if ( sm === "translate" ) {
				this._setElementTransform( $v, x + "px", y + "px", duration );
			} else {
				$v.css( {left: x + "px", top: y + "px"} );
			}

			if ( $vsb ) {
				$sbt = $vsb.find(".ui-scrollbar-thumb");

				if ( sm === "translate" ) {
					this._setElementTransform( $sbt, "0px",
						-y / $v.height() * $sbt.parent().height() + "px",
						duration );
				} else {
					$sbt.css( "top", -y / $v.height() * 100 + "%" );
				}
			}

			if ( $hsb ) {
				$sbt = $hsb.find(".ui-scrollbar-thumb");

				if ( sm === "translate" ) {
					this._setElementTransform( $sbt,
						-x / $v.width() * $sbt.parent().width() + "px", "0px",
						duration);
				} else {
					$sbt.css("left", -x / $v.width() * 100 + "%");
				}
			}
		},

		_outerScroll: function ( y, scroll_height ) {
			var self = this,
				top = $( window ).scrollTop(),
				sy = 0,
				duration = this.options.snapbackDuration,
				start = getCurrentTime(),
				tfunc;

			if ( this._$clip.jqmData("scroll") !== "y" ) {
				return;
			}

			if ( this._outerScrolling ) {
				return;
			}

			if ( y >= 0 ) {
				sy = -y;
			} else if ( y < -scroll_height ) {
				sy = -y - scroll_height;
			} else {
				return;
			}

			sy *= 10;

			tfunc = function () {
				var elapsed = getCurrentTime() - start;

				if ( elapsed >= duration ) {
					window.scrollTo( 0, top + sy );
					self._outerScrolling = undefined;
				} else {
					ec = $.easing.easeOutQuad( elapsed / duration, elapsed, 0, 1, duration );

					window.scrollTo( 0, top + ( sy * ec ) );
					self._outerScrolling = setTimeout( tfunc, self._timerInterval );
				}
			};
			this._outerScrolling = setTimeout( tfunc, self._timerInterval );

			/* skip the srollview dragging */
			this._skip_dragging = true;
		},

		_scrollTo: function ( x, y, duration ) {
			var self = this,
				start = getCurrentTime(),
				efunc = $.easing.easeOutQuad,
				sx = this._sx,
				sy = this._sy,
				dx = x - sx,
				dy = y - sy,
				tfunc;

			x = -x;
			y = -y;

			tfunc = function () {
				var elapsed = getCurrentTime() - start,
				    ec;

				if ( elapsed >= duration ) {
					self._timerID = 0;
					self._setScrollPosition( x, y );
				} else {
					ec = efunc( elapsed / duration, elapsed, 0, 1, duration );

					self._setScrollPosition( sx + ( dx * ec ), sy + ( dy * ec ) );
					self._timerID = setTimeout( tfunc, self._timerInterval );
				}
			};

			this._timerID = setTimeout( tfunc, this._timerInterval );
		},

		scrollTo: function ( x, y, duration ) {
			this._stopMScroll();

			if ( !duration || this.options.scrollMethod === "translate" ) {
				this._setScrollPosition( x, y, duration );
			} else {
				this._scrollTo( x, y, duration );
			}
		},

		getScrollPosition: function () {
			return { x: -this._sx, y: -this._sy };
		},

		_getScrollHierarchy: function () {
			var svh = [],
				d;

			this._$clip.parents( ".ui-scrollview-clip").each( function () {
				d = $( this ).jqmData("scrollview");
				if ( d ) {
					svh.unshift( d );
				}
			} );
			return svh;
		},

		_getAncestorByDirection: function ( dir ) {
			var svh = this._getScrollHierarchy(),
				n = svh.length,
				sv,
				svdir;

			while ( 0 < n-- ) {
				sv = svh[n];
				svdir = sv.options.direction;

				if (!svdir || svdir === dir) {
					return sv;
				}
			}
			return null;
		},

		_handleDragStart: function ( e, ex, ey ) {
			this._stopMScroll();

			this._didDrag = false;

			var target = $( e.target ),
				self = this,
				$c = this._$clip,
				svdir = this.options.direction;

			/* should skip the dragging when click the button */
			this._skip_dragging = target.is( '.ui-btn-text' ) ||
					target.is( '.ui-btn-inner' ) ||
					target.is( '.ui-btn-inner .ui-icon' );

			if ( this._skip_dragging ) {
				return;
			}

			/*
			 * We need to prevent the default behavior to
			 * suppress accidental selection of text, etc.
			 */
			this._shouldBlockEvent = !( target.is(':input') ||
					target.parents(':input').length > 0 );

			if ( this._shouldBlockEvent ) {
				if ( this.options.eventType === "mouse" ) {
					e.preventDefault();
				}
			} else {
				target.one( "resize.scrollview", function () {
					if ( ey > $c.height() ) {
						self.scrollTo( -ex, self._sy - ey + $c.height(),
							self.options.snapbackDuration );
					}
				});

				return;
			}

			this._lastX = ex;
			this._lastY = ey;
			this._startY = ey;
			this._doSnapBackX = false;
			this._doSnapBackY = false;
			this._speedX = 0;
			this._speedY = 0;
			this._directionLock = "";

			this._lastMove = 0;
			this._enableTracking();

			this._set_scrollbar_size();
		},

		_propagateDragMove: function ( sv, e, ex, ey, dir ) {
			this._hideScrollBars();
			this._disableTracking();
			sv._handleDragStart( e, ex, ey );
			sv._directionLock = dir;
			sv._didDrag = this._didDrag;
		},

		_handleDragMove: function ( e, ex, ey ) {
			if ( this._skip_dragging ) {
				return;
			}

			if ( !this._dragging ) {
				return;
			}

			if ( this._shouldBlockEvent ) {
				e.preventDefault();
			}

			var mt = this.options.moveThreshold,
				dx = ex - this._lastX,
				dy = ey - this._lastY,
				svdir = this.options.direction,
				dir = null,
				x,
				y,
				sv,
				scope,
				newX,
				newY,
				dirLock;

			if ( Math.abs( this._startY - ey ) < mt && !this._didDrag ) {
				return;
			}

			this._lastMove = getCurrentTime();

			if ( !this._directionLock ) {
				x = Math.abs( dx );
				y = Math.abs( dy );

				if ( x < mt && y < mt ) {
					return false;
				}

				if ( x < y && (x / y) < 0.5 ) {
					dir = "y";
				} else if ( x > y && (y / x) < 0.5 ) {
					dir = "x";
				}

				if ( svdir && dir && svdir !== dir ) {
					/*
					 * This scrollview can't handle the direction the user
					 * is attempting to scroll. Find an ancestor scrollview
					 * that can handle the request.
					 */

					sv = this._getAncestorByDirection( dir );
					if ( sv ) {
						this._propagateDragMove( sv, e, ex, ey, dir );
						return false;
					}
				}

				this._directionLock = svdir || (dir || "none");
			}

			newX = this._sx;
			newY = this._sy;
			dirLock = this._directionLock;

			if ( dirLock !== "y" && this._hTracker ) {
				x = this._sx;
				this._speedX = dx;
				newX = x + dx;

				this._doSnapBackX = false;

				scope = ( newX > 0 || newX < this._maxX );

				if ( scope && dirLock === "x" ) {
					sv = this._getAncestorByDirection("x");
					if ( sv ) {
						this._setScrollPosition( newX > 0 ?
								0 : this._maxX, newY );
						this._propagateDragMove( sv, e, ex, ey, dir );
						return false;
					}

					newX = x + ( dx / 2 );
					this._doSnapBackX = true;
				}
			}

			if ( dirLock !== "x" && this._vTracker ) {
				y = this._sy;
				this._speedY = dy;
				newY = y + dy;

				this._doSnapBackY = false;

				scope = ( newY > 0 || newY < this._maxY );

				if ( scope && dirLock === "y" ) {
					sv = this._getAncestorByDirection("y");
					if ( sv ) {
						this._setScrollPosition( newX,
								newY > 0 ? 0 : this._maxY );
						this._propagateDragMove( sv, e, ex, ey, dir );
						return false;
					}

					newY = y + ( dy / 2 );
					this._doSnapBackY = true;
				}
			}

			if ( this.options.overshootEnable === false ) {
				this._doSnapBackX = false;
				this._doSnapBackY = false;
			}

			this._didDrag = true;
			this._lastX = ex;
			this._lastY = ey;

			this._setScrollPosition( newX, newY );

			this._showScrollBars();
		},

		_handleDragStop: function ( e ) {
			if ( this._skip_dragging ) {
				return;
			}

			var l = this._lastMove,
				t = getCurrentTime(),
				doScroll = (l && (t - l) <= this.options.moveIntervalThreshold),
				sx = ( this._hTracker && this._speedX && doScroll ) ?
						this._speedX : ( this._doSnapBackX ? 1 : 0 ),
				sy = ( this._vTracker && this._speedY && doScroll ) ?
						this._speedY : ( this._doSnapBackY ? 1 : 0 ),
				svdir = this.options.direction,
				x,
				y;

			if ( sx || sy ) {
				this._startMScroll( sx, sy );
			} else {
				this._hideScrollBars();
			}

			this._disableTracking();

			return !this._didDrag;
		},

		_enableTracking: function () {
			this._dragging = true;
		},

		_disableTracking: function () {
			this._dragging = false;
		},

		_showScrollBars: function () {
			var vclass = "ui-scrollbar-visible";

			if ( !this.options.showScrollBars ) {
				return;
			}
			if ( this._scrollbar_showed ) {
				return;
			}

			if ( this._$vScrollBar ) {
				this._$vScrollBar.addClass( vclass );
			}
			if ( this._$hScrollBar ) {
				this._$hScrollBar.addClass( vclass );
			}

			this._scrollbar_showed = true;
		},

		_hideScrollBars: function () {
			var vclass = "ui-scrollbar-visible";

			if ( !this.options.showScrollBars ) {
				return;
			}
			if ( !this._scrollbar_showed ) {
				return;
			}

			if ( this._$vScrollBar ) {
				this._$vScrollBar.removeClass( vclass );
			}
			if ( this._$hScrollBar ) {
				this._$hScrollBar.removeClass( vclass );
			}

			this._scrollbar_showed = false;
		},

		_add_event: function () {
			var self = this,
				$c = this._$clip,
				$v = this._$view;

			if ( this.options.eventType === "mouse" ) {
				this._dragEvt = "mousedown mousemove mouseup click mousewheel";

				this._dragCB = function ( e ) {
					switch ( e.type ) {
					case "mousedown":
						return self._handleDragStart( e,
								e.clientX, e.clientY );

					case "mousemove":
						return self._handleDragMove( e,
								e.clientX, e.clientY );

					case "mouseup":
						return self._handleDragStop( e );

					case "click":
						return !self._didDrag;

					case "mousewheel":
						var old = self.getScrollPosition();
						self.scrollTo( -old.x,
							-(old.y - e.originalEvent.wheelDelta) );
						break;
					}
				};
			} else {
				this._dragEvt = "touchstart touchmove touchend click";

				this._dragCB = function ( e ) {
					var t;

					switch ( e.type ) {
					case "touchstart":
						t = e.originalEvent.targetTouches[0];
						return self._handleDragStart( e,
								t.pageX, t.pageY );

					case "touchmove":
						t = e.originalEvent.targetTouches[0];
						return self._handleDragMove( e,
								t.pageX, t.pageY );

					case "touchend":
						return self._handleDragStop( e );

					case "click":
						return !self._didDrag;
					}
				};
			}

			$v.bind( this._dragEvt, this._dragCB );

			if ( $c.jqmData("scroll") !== "y" ) {
				return;
			}

			$c.bind( "updatelayout", function ( e ) {
				var $page = $c.parentsUntil("ui-page"),
					sy,
					vh;

				if ( !$c.height() || !$v.height() ) {
					self.scrollTo( 0, 0, 0 );
					return;
				}

				sy = $c.height() - $v.height();
				vh = $v.height() - self._view_height;

				self._view_height = $v.height();

				if ( vh == 0 || vh > $c.height() / 2 ) {
					return;
				}

				if ( self._sy - sy <= -vh ) {
					self.scrollTo( 0, self._sy,
						self.options.snapbackDuration );
				} else if ( self._sy - sy <= vh + self.options.moveThreshold ) {
					self.scrollTo( 0, sy,
						self.options.snapbackDuration );
				}
			});

			$( window ).bind( "resize", function ( e ) {
				var $page = $c.parentsUntil("ui-page"),
					focused;

				if ( !$c.height() || !$v.height() ) {
					return;
				}

				focused = $c.find(".ui-focus");

				if ( focused ) {
					focused.trigger("resize.scrollview");
				}

				/* calibration */
				if ( self._sy < $c.height() - $v.height() ) {
					self.scrollTo( 0, self._sy,
						self.options.snapbackDuration );
				}

				self._view_height = $v.height();
			});
		},

		_add_scrollbar: function () {
			var $c = this._$clip,
				prefix = "<div class=\"ui-scrollbar ui-scrollbar-",
				suffix = "\"><div class=\"ui-scrollbar-track\"><div class=\"ui-scrollbar-thumb\"></div></div></div>";

			if ( !this.options.showScrollBars ) {
				return;
			}

			if ( this._vTracker ) {
				$c.append( prefix + "y" + suffix );
				this._$vScrollBar = $c.children(".ui-scrollbar-y");
			}
			if ( this._hTracker ) {
				$c.append( prefix + "x" + suffix );
				this._$hScrollBar = $c.children(".ui-scrollbar-x");
			}

			this._scrollbar_showed = false;
		},

		_set_scrollbar_size: function () {
			var $c = this._$clip,
				$v = this._$view,
				cw = 0,
				vw = 0,
				ch = 0,
				vh = 0,
				thumb;

			if ( !this.options.showScrollBars ) {
				return;
			}

			if ( this._hTracker ) {
				cw = $c.width();
				vw = $v.width();
				this._maxX = cw - vw;

				if ( this._maxX > 0 ) {
					this._maxX = 0;
				}
				if ( this._$hScrollBar && vw ) {
					thumb = this._$hScrollBar.find(".ui-scrollbar-thumb");
					thumb.css( "width", (cw >= vw ? "100%" :
							(Math.floor(cw / vw * 100) || 1) + "%") );
				}
			}

			if ( this._vTracker ) {
				ch = $c.height();
				vh = $v.height();
				this._maxY = ch - vh;

				if ( this._maxY > 0 ) {
					this._maxY = 0;
				}
				if ( this._$vScrollBar && vh ) {
					thumb = this._$vScrollBar.find(".ui-scrollbar-thumb");
					thumb.css( "height", (ch >= vh ? "100%" :
							(Math.floor(ch / vh * 100) || 1) + "%") );
				}
			}
		}
	});

	$.extend( MomentumTracker.prototype, {
		start: function ( pos, speed, duration, minPos, maxPos ) {
			var tstate = ( pos < minPos || pos > maxPos ) ?
					tstates.snapback : tstates.scrolling,
				pos_temp;

			this.state = ( speed !== 0 ) ? tstate : tstates.done;
			this.pos = pos;
			this.speed = speed;
			this.duration = ( this.state === tstates.snapback ) ?
					this.options.snapbackDuration : duration;
			this.minPos = minPos;
			this.maxPos = maxPos;

			this.fromPos = ( this.state === tstates.snapback ) ? this.pos : 0;
			pos_temp = ( this.pos < this.minPos ) ? this.minPos : this.maxPos;
			this.toPos = ( this.state === tstates.snapback ) ? pos_temp : 0;

			this.startTime = getCurrentTime();
		},

		reset: function () {
			this.state = tstates.done;
			this.pos = 0;
			this.speed = 0;
			this.minPos = 0;
			this.maxPos = 0;
			this.duration = 0;
		},

		update: function ( overshootEnable ) {
			var state = this.state,
				cur_time = getCurrentTime(),
				duration = this.duration,
				elapsed =  cur_time - this.startTime,
				dx,
				x,
				didOverShoot;

			if ( state === tstates.done ) {
				return this.pos;
			}

			elapsed = elapsed > duration ? duration : elapsed;

			if ( state === tstates.scrolling || state === tstates.overshot ) {
				dx = this.speed *
					( 1 - $.easing[this.easing]( elapsed / duration,
								elapsed, 0, 1, duration ) );

				x = this.pos + dx;

				didOverShoot = ( state === tstates.scrolling ) &&
					( x < this.minPos || x > this.maxPos );

				if ( didOverShoot ) {
					x = ( x < this.minPos ) ? this.minPos : this.maxPos;
				}

				this.pos = x;

				if ( state === tstates.overshot ) {
					if ( elapsed >= duration ) {
						this.state = tstates.snapback;
						this.fromPos = this.pos;
						this.toPos = ( x < this.minPos ) ?
								this.minPos : this.maxPos;
						this.duration = this.options.snapbackDuration;
						this.startTime = cur_time;
						elapsed = 0;
					}
				} else if ( state === tstates.scrolling ) {
					if ( didOverShoot && overshootEnable ) {
						this.state = tstates.overshot;
						this.speed = dx / 2;
						this.duration = this.options.overshootDuration;
						this.startTime = cur_time;
					} else if ( elapsed >= duration ) {
						this.state = tstates.done;
					}
				}
			} else if ( state === tstates.snapback ) {
				if ( elapsed >= duration ) {
					this.pos = this.toPos;
					this.state = tstates.done;
				} else {
					this.pos = this.fromPos + (( this.toPos - this.fromPos ) *
						$.easing[this.easing]( elapsed / duration,
							elapsed, 0, 1, duration ));
				}
			}

			return this.pos;
		},

		done: function () {
			return this.state === tstates.done;
		},

		getPosition: function () {
			return this.pos;
		}
	});

	$( document ).bind( 'pagecreate create', function ( e ) {
		var $page = $( e.target ),
			content_scroll = $page.find(".ui-content").jqmData("scroll");

		/* content scroll */
		if ( $.support.scrollview === undefined ) {
			$.support.scrollview = true;
		}

		if ( $.support.scrollview === true && content_scroll === undefined ) {
			content_scroll = "y";
		}

		if ( content_scroll !== "y" ) {
			content_scroll = "none";
		}

		$page.find(".ui-content").attr( "data-scroll", content_scroll );

		$page.find(":jqmData(scroll):not(.ui-scrollview-clip)").each( function () {
			if ( $( this ).hasClass("ui-scrolllistview") ) {
				$( this ).scrolllistview();
			} else {
				var st = $( this ).jqmData("scroll"),
					dir = st && ( st.search(/^[xy]/) !== -1 ) ? st.charAt(0) : null,
					opts;

				if ( st === "none" ) {
					return;
				}

				opts = {
					direction: dir || undefined,
					scrollMethod: $( this ).jqmData("scroll-method") || undefined
				};

				$( this ).scrollview( opts );
			}
		});
	});

	$( document ).bind( 'pageshow', function ( e ) {
		var $page = $( e.target ),
			scroll = $page.find(".ui-content").jqmData("scroll");

		if ( scroll === "y" ) {
			resizePageContentHeight( e.target );
		}
	});

}( jQuery, window, document ) );
