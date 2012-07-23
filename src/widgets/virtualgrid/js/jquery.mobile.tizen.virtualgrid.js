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
 *	Author: Kangsik Kim <kangsik81.kim@samsung.com>
*/

/**
 * In the web environment, it is challenging to display a large amount of data in a grid.
 * When an application needs to show, for example, image gallery with over 1,000 images,
 * the same enormous data must be inserted into a HTML document.
 * It takes a long time to display the data and manipulating DOM is complex.
 * The virtual grid widget supports storing unlimited data without performance issues
 * by reusing a limited number of grid elements.
 * The virtual grid widget is based on the jQuery.template plug-in 
 * For more information, see jQuery.template.
 *
 * HTML Attributes:
 *
 *		data-role:  virtualgridview
 *		data-template :	Has the ID of the jQuery.template element.
 *						jQuery.template for a virtual grid must be defined.
 *						Style for template would use rem unit to support scalability.
 *		data-dbtable :	Has the window object name. 
 *						Window [dbtable] object must exist as a JSON array.
 *		data-itemcount : Number of column elements. (Default : 3)
 *		data-direction : This option define the direction of the scroll.
 *						You must choose one of the 'x' and 'y' (Default : y)
 *		data-rotation : This option defines whether or not the circulation of the data.
 *						If option is 'true' and scroll is reached the last data,
 *						Widget will present the first data on the screen.
 *						If option is ‘false’, Widget will operate like a scrollview.
 *
 *		ID : <UL> element that has "data-role=virtualgrid" must have ID attribute.
 *		Class : <UL> element that has "data-role=virtualgrid" should have "vgLoadSuccess" class to guaranty DB loading is completed.
 *
 * APIs:
 *
 *		create ( void )
 *			: Create VirtualGrid widget. At this moment, _create method is called internally.
 *		centerTo ( String )
 *			: Find a DOM Element with the given class name.
 *			This element will be centered on the screen.
 *			Serveral elements were found, the first element is displayed.
 *
 * Events:
 *		scrollstart : : This event triggers when a user begin to move the scroll on VirtualGrid.
 *		scrollupdate : : This event triggers while a user moves the scroll on VirtualGrid.
 *		scrollstop : This event triggers when a user stop the scroll on VirtualGrid.
 *		select : This event triggers when a cell is selected.
 *
 * Examples:
 *
 *			<script id="tizen-demo-namecard" type="text/x-jquery-tmpl">
 *				<div class="ui-demo-namecard">
 *					<div class="ui-demo-namecard-pic">
 *						<img class="ui-demo-namecard-pic-img" src="${TEAM_LOGO}"  />
 *					</div>
 *					<div class="ui-demo-namecard-contents">
 *						<span class="name ui-li-text-main">${NAME}</span>
 *						<span class="active ui-li-text-sub">${ACTIVE}</span>
 *						<span class="from ui-li-text-sub">${FROM}</span>
 *					</div>
 *				</div>
 *			</script>
 *			<div id="virtualgrid-demo" data-role="virtualgrid" data-itemcount="3" data-template="tizen-demo-namecard" data-dbtable="JSON_DATA" >
 *			</div>
 *
 */

// most of following codes are derived from jquery.mobile.scrollview.js
( function ($, window, document, undefined) {

	function circularNum (num, total) {
		var n = num % total;
		if (n < 0) {
			n = total + n;
		}
		return n;
	}

	function setElementTransform ($ele, x, y) {
		var v = "translate3d( " + x + "," + y + ", 0px)";
		$ele.css ({
			"-moz-transform" : v,
			"-webkit-transform" : v,
			"transform" : v
		});
	}

	function MomentumTracker (options) {
		this.options = $.extend({}, options);
		this.easing = "easeOutQuad";
		this.reset();
	}

	var tstates = {
		scrolling : 0,
		done : 1
	};

	function getCurrentTime () {
		return (new Date()).getTime();
	}

	$.extend (MomentumTracker.prototype, {
		start : function (pos, speed, duration) {
			this.state = (speed !== 0 ) ? tstates.scrolling : tstates.done;
			this.pos = pos;
			this.speed = speed;
			this.duration = duration;

			this.fromPos = 0;
			this.toPos = 0;

			this.startTime = getCurrentTime();
		},

		reset : function () {
			this.state = tstates.done;
			this.pos = 0;
			this.speed = 0;
			this.duration = 0;
		},

		update : function () {
			var state = this.state, duration, elapsed, dx, x;

			if (state == tstates.done) {
				return this.pos;
			}
			duration = this.duration;
			elapsed = getCurrentTime () - this.startTime;
			elapsed = elapsed > duration ? duration : elapsed;
			dx = this.speed * (1 - $.easing[this.easing] (elapsed / duration, elapsed, 0, 1, duration) );
			x = this.pos + dx;
			this.pos = x;

			if (elapsed >= duration) {
				this.state = tstates.done;
			}

			return this.pos;
		},

		done : function () {
			return this.state == tstates.done;
		},

		getPosition : function () {
			return this.pos;
		}

	});

	jQuery.widget ("mobile.virtualgrid", jQuery.mobile.widget, {
		options : {
			// virtualgrid option
			dbtable : "JSON",
			template : "",

			direction : "y",
			rotation : false,
			itemcount : 3
		},

		create : function () {
			this._create();
		},

		_create : function () {
			$.extend(this, {
				// view
				_$view : null,
				_$clip : null,
				_$items : null,
				_tracker : null,
				_viewSize : 0,
				_clipSize : 0,
				_itemSize : 0,

				// timer
				_timerInterval : 0,
				_timerID : 0,
				_timerCB : null,
				_lastMove : null,

				// Data
				_totalItemCnt : 0,
				_totalRowCnt : 0,
				_dataSet : null,
				_template : null,
				_maxViewSize : 0,
				_modifyViewPos : 0,
				_maxSize : 0,

				// axis - ( true : x , false : y )
				_direction : false,
				_didDrag : true,
				_reservedPos : 0,
				_scalableSize : 0,
				_eventPos : 0,
				_nextPos : 0,
				_movePos : 0,
				_lastY : 0,
				_speedY : 0,
				_lastX : 0,
				_speedX : 0,
				_itemsPerView : 0
			});

			var widget = this,
				opts = widget.options,
				totalRowCnt = 0,
				clipHeight = 0,
				$child = null;

			if ( ! (widget.element.hasClass("vgLoadSuccess") ) ) {
				return ;
			}

			if ( $(widget.element).find(".ui-scrollview-view").length >= 1) {
				$(widget.element).find(".ui-scrollview-view").remove();
			}

			widget._dataSet = window[opts.dbtable];
			widget._totalItemCnt = widget._dataSet.length;
			totalRowCnt = parseInt(widget._totalItemCnt / opts.itemcount , 10 );
			widget._totalRowCnt = widget._totalItemCnt % opts.itemcount === 0 ? totalRowCnt : totalRowCnt + 1;
			widget._template = $( "#" + opts.template );

			if ( !widget._template ) {
				return ;
			}

			// set direction.
			widget._direction = opts.direction === 'x' ? true : false;

			widget._$clip = $(widget.element).addClass("ui-scrollview-clip");

			widget._clipSize =  widget._calcClipHeihgt();
			$child = widget._makeBlocks( 1 );
			widget._$clip.append($child);

			widget._$view = $child;
			widget._$list = $child;
			widget._$clip.css("overflow", "hidden");
			widget._$view.css("overflow", "hidden");

			widget._timerID = 0;
			widget._timerCB = function () {
				widget._handleMomentumScroll();
			};
			widget.refresh();
			widget._blockScroll = widget._itemsPerView > widget._totalRowCnt;
			widget._maxSize = ( widget._totalRowCnt - widget._itemsPerView ) * widget._itemSize;
			widget._maxViewSize = ( widget._itemsPerView ) * widget._itemSize;
			widget._relayoutflag = false;
			widget._modifyViewPos = -widget._itemSize;
			if ( widget._clipSize < widget._maxViewSize ) {
				widget._modifyViewPos = (-widget._itemSize) + ( widget._clipSize - widget._maxViewSize );
			}

			widget._scrollView = $.tizen.scrollview.prototype;
			widget._scrollView.options.moveThreshold = 10;
			widget._tracker = new MomentumTracker(widget._scrollView.options);
			widget._initScrollView();
			widget._timerInterval = 1000 / widget.options.fps;

			widget._makePositioned(widget._$clip);
			widget._addBehaviors();
			widget._createScrollBar();
			widget._currentItemCount = 0;

			$(document).one("pageshow", function (event) {
				var $page = $(widget.element).parents(".ui-page"),
					$header = $page.find( ":jqmData(role='header')" ),
					$footer = $page.find( ":jqmData(role='footer')" ),
					$content = $page.find( ":jqmData(role='content')" ),
					footerHeight = $footer ? $footer.height() : 0,
					headerHeight = $header ? $header.height() : 0;

				if ( $page && $content ) {
					$content.height(window.innerHeight - headerHeight - footerHeight);
				}
			});
		},

		refresh : function () {
			var widget = this,
				footerHeight = 0,
				itemsPerView = 0,
				$child,
				$item,
				attributeName,
				itemWidth = 0;

			if ( widget._direction ) {
				// x-axis
				widget._viewSize = widget._$view.width();
				$item = widget._$list.children().first().children().first();
				widget._itemSize = $item.outerWidth(true);
				widget._itemOtherSize = $item.outerHeight(true);
				attributeName = "width";
			} else {
				// y-axis
				widget._viewSize = widget._$view.height();
				$item = widget._$list.children().first().children().first();
				widget._itemSize = $item.outerHeight(true);
				widget._itemOtherSize = $item.outerWidth(true);
				attributeName = "height";
			}
			itemsPerView = widget._clipSize / widget._itemSize;
			itemsPerView = Math.ceil( itemsPerView );
			widget._itemsPerView = parseInt( itemsPerView, 10);

			widget._$list.children().remove();
			$child = widget._makeBlocks( itemsPerView + 2 );
			$(widget._$list).append($child.children());
			widget._$list.children().css(attributeName, widget._itemSize + "px");
			widget._$items = widget._$list.children().detach();

			widget._reservedPos = -widget._itemSize;
			widget._scalableSize = -widget._itemSize;

			widget._initLayout();
			widget._$view.delegate(".virtualgrid-item", "click", function (event) {
				var $selectedItem = $(this);
				$selectedItem.trigger("select", this);
			});
		},

		_initScrollView : function () {
			var widget = this;
			if ( widget._direction ) {
				widget._hTracker = widget._tracker;
				widget._$clip.width(widget._clipSize);
			} else {
				widget._vTracker = widget._tracker;
				widget._$clip.height(widget._clipSize);
			}
			$.extend(widget.options, widget._scrollView.options);
			widget.options.showScrollBars = false;
			widget._getScrollHierarchy = widget._scrollView._getScrollHierarchy;
			widget._makePositioned =  widget._scrollView._makePositioned;
			widget._set_scrollbar_size = widget._scrollView._set_scrollbar_size;
		},

		_hideScrollBars : function () {
			var widget = this,
				vclass = "ui-scrollbar-visible";

			if ( widget.options.rotation ) {
				return ;
			}

			if ( widget._vScrollBar ) {
				widget._vScrollBar.removeClass( vclass );
			} else {
				widget._hScrollBar.removeClass( vclass );
			}
		},

		_showScrollBars : function () {
			var widget = this,
				vclass = "ui-scrollbar-visible";

			if ( widget.options.rotation ) {
				return ;
			}

			if ( widget._vScrollBar ) {
				widget._vScrollBar.addClass( vclass );
			} else {
				widget._hScrollBar.addClass( vclass );
			}
		},

		_setScrollBarPosition : function ( di, duration ) {
			var widget = this,
				$sbt = null,
				x = "0px",
				y = "0px";

			if ( widget.options.rotation ) {
				return ;
			}

			widget._currentItemCount = widget._currentItemCount + di;
			if ( widget._vScrollBar ) {
				$sbt = widget._vScrollBar .find(".ui-scrollbar-thumb");
				y = ( widget._currentItemCount * widget._itemScrollSize ) + "px";
			} else {
				$sbt = widget._hScrollBar .find(".ui-scrollbar-thumb");
				x = ( widget._currentItemCount * widget._itemScrollSize ) + "px";
			}
			setElementTransform( $sbt, x, y, duration );
		},

		_createScrollBar : function () {
			var widget = this,
				$scrollBar = null,
				scrollBarSize = 0,
				prefix = "<div class=\"ui-scrollbar ui-scrollbar-",
				suffix = "\"><div class=\"ui-scrollbar-track\"><div class=\"ui-scrollbar-thumb\"></div></div></div>";

			if ( widget.options.rotation ) {
				return ;
			}

			scrollBarSize = parseInt( widget._maxViewSize / widget._clipSize , 10);
			scrollBarSize = scrollBarSize < 30 ? 30 : scrollBarSize;
			widget._itemScrollSize = parseFloat( ( widget._clipSize - ( scrollBarSize ) ) / ( widget._totalRowCnt - widget._itemsPerView ) );
			widget._itemScrollSize = Math.round(widget._itemScrollSize * 100) / 100;
			if ( widget._direction ) {
				widget._$clip.append( prefix + "x" + suffix );
				widget._hScrollBar = $(widget._$clip.children(".ui-scrollbar-x"));
				widget._hScrollBar.css("width", widget._clipSize);
				widget._hScrollBar.find(".ui-scrollbar-thumb").css("width", scrollBarSize);
			} else {
				widget._$clip.append( prefix + "y" + suffix );
				widget._vScrollBar = $(widget._$clip.children(".ui-scrollbar-y"));
				widget._vScrollBar.css("height", widget._clipSize);
				widget._vScrollBar.find(".ui-scrollbar-thumb").css("height", scrollBarSize);
			}
		},

		centerTo: function ( selector ) {
			var widget = this,
				i,
				newX = 0,
				newY = 0;

			if ( !widget.options.rotation ) {
				return;
			}

			for ( i = 0; i < widget._$items.length; i++ ) {
				if ( $( widget._$items[i]).hasClass( selector ) ) {
					if ( widget._direction ) {
						newX = -( i * widget._itemSize - widget._clipSize / 2 + widget._itemSize * 2 );
					} else {
						newY = -( i * widget._itemSize - widget._clipSize / 2 + widget._itemSize * 2 );
					}
					widget.scrollTo( newX, newY );
					return;
				}
			}
		},

		scrollTo: function ( x, y, duration ) {
			var widget = this;
			if ( widget._direction ) {
				widget._sx = widget._reservedPos;
				widget._reservedPos = x;
			} else {
				widget._sy = widget._reservedPos;
				widget._reservedPos = y;
			}
			widget._scrollView.scrollTo.apply( this, [ x, y, duration ] );
		},

		getScrollPosition: function () {
			if ( this.direction ) {
				return { x: -this._ry, y: 0 };
			}
			return { x: 0, y: -this._ry };
		},

		_calcClipHeihgt : function () {
			var widget = this,
				view = $(widget.element),
				documentHeight = widget._direction ? $(window).width() : $(window).height(),
				$parent = $(widget.element).parent(),
				header = null,
				footer = null,
				clipHeight = 0;

			if ( widget._direction ) {
				clipHeight =  $(widget.element).width();
			} else {
				clipHeight =  $(widget.element).height();
			}

			// Tizen...
			if ( isNaN(clipHeight) || clipHeight > documentHeight || clipHeight <= 0 ) {
				clipHeight = documentHeight;
				if ( !widget._direction && $parent.hasClass("ui-content") ) {
					clipHeight = clipHeight - parseInt($parent.css("padding-top"), 10);
					clipHeight = clipHeight - parseInt($parent.css("padding-bottom"), 10);
					header = $parent.siblings(".ui-header");
					footer = $parent.siblings(".ui-footer");

					if ( header ) {
						if ( header.outerHeight(true) === null ) {
							clipHeight = clipHeight - ( $(".ui-header").outerHeight() || 0 );
						} else {
							clipHeight = clipHeight - header.outerHeight(true);
						}
					}
					if ( footer ) {
						clipHeight = clipHeight - footer.outerHeight(true);
					}
				}
			}
			return clipHeight;
		},

		_initLayout: function () {
			var widget = this,
				opts = widget.options,
				i,
				$item;

			for ( i = -1; i < widget._itemsPerView + 1; i += 1 ) {
				$item = widget._$items[ circularNum( i, widget._$items.length ) ];
				widget._$list.append( $item );
			}
			widget._setElementTransform( -widget._itemSize );

			widget._replaceBlock(widget._$list.children().first(), widget._totalRowCnt - 1);
			if ( opts.rotation && widget._itemsPerView >= widget._totalRowCnt ) {
				widget._replaceBlock(widget._$list.children().last(), 0);
			}

			if ( widget._direction ) {
				widget._$view.width( widget._itemSize * ( widget._itemsPerView + 2 ) );
				widget._viewSize = widget._$view.width();
			} else {
				widget._$view.height( widget._itemSize * ( widget._itemsPerView + 2 ) );
				widget._viewSize = widget._$view.height();
			}
		},

		_startMScroll: function ( speedX, speedY ) {
			var widget = this;
			if ( widget._direction  ) {
				widget._sx = widget._reservedPos;
			} else {
				widget._sy = widget._reservedPos;
			}
			widget._scrollView._startMScroll.apply(widget, [speedX, speedY]);
		},

		_stopMScroll: function () {
			this._scrollView._stopMScroll.apply(this);
		},

		_handleMomentumScroll: function () {
			var widget = this,
				opts = widget.options,
				keepGoing = false,
				v = this._$view,
				x = 0,
				y = 0,
				t = widget._tracker;

			if ( t ) {
				t.update();
				if ( widget._direction ) {
					x = t.getPosition();
				} else {
					y = t.getPosition();
				}
				keepGoing = !t.done();
			}

			widget._setScrollPosition( x, y );
			if ( !opts.rotation ) {
				keepGoing = !t.done();
				widget._reservedPos = widget._direction ? x : y;
				// bottom
				widget._reservedPos = widget._reservedPos <= (-(widget._maxSize - widget._modifyViewPos)) ? ( - ( widget._maxSize + widget._itemSize) ) : widget._reservedPos;
				// top
				widget._reservedPos = widget._reservedPos > -widget._itemSize ? -widget._itemSize : widget._reservedPos;
			} else {
				widget._reservedPos = widget._direction ? x : y;
			}
			widget._$clip.trigger( widget.options.updateEventName, [ { x: x, y: y } ] );

			if ( keepGoing ) {
				widget._timerID = setTimeout( widget._timerCB, widget._timerInterval );
			} else {
				widget._stopMScroll();
			}
		},

		_setScrollPosition: function ( x, y ) {
			var widget = this,
				sy = widget._scalableSize,
				distance = widget._direction ? x : y,
				dy = distance - sy,
				di = parseInt( dy / widget._itemSize, 10 ),
				i = 0,
				idx = 0,
				isSkip = true,
				$item = null;

			if ( widget._blockScroll ) {
				return ;
			}

			if ( ! widget.options.rotation ) {
				if ( dy > 0 && distance >= -widget._itemSize && widget._scalableSize >= -widget._itemSize ) {
					// top 
					widget._stopMScroll();
					widget._scalableSize = -widget._itemSize;
					widget._setElementTransform( -widget._itemSize );
					isSkip = false;
				} else if ( (dy < 0 && widget._scalableSize <= -(widget._maxSize + widget._itemSize) )) {
					// bottom
					widget._stopMScroll();
					widget._scalableSize = -(widget._maxSize + widget._itemSize);
					widget._setElementTransform( widget._modifyViewPos );
					isSkip = false;
				}
			}

			if ( isSkip ) {
				if ( di > 0 ) { // scroll up
					for ( i = 0; i < di; i++ ) {
						idx = -parseInt( ( sy / widget._itemSize ) + i + 3, 10 );
						$item = widget._$list.children( ).last( ).detach( );
						widget._replaceBlock( $item, circularNum( idx, widget._totalRowCnt ) );
						widget._$list.prepend( $item );
						widget._setScrollBarPosition(-1);
					}
				} else if ( di < 0 ) { // scroll down
					for ( i = 0; i > di; i-- ) {
						idx = widget._itemsPerView - parseInt( ( sy / widget._itemSize ) + i, 10 );
						$item = widget._$list.children().first().detach();
						widget._replaceBlock($item, circularNum( idx, widget._totalRowCnt ) );
						widget._$list.append( $item );
						widget._setScrollBarPosition(1);
					}
				}
				widget._scalableSize += di * widget._itemSize;
				widget._setElementTransform( distance - widget._scalableSize - widget._itemSize );
			}
		},

		_setElementTransform : function ( value ) {
			var widget = this,
				x = 0,
				y = 0;

			if ( widget._direction ) {
				x = value + "px";
			} else {
				y = value + "px";
			}
			setElementTransform( widget._$view, x, y );
		},

		_enableTracking: function () {
			$(document).bind( this._dragMoveEvt, this._dragMoveCB );
			$(document).bind( this._dragStopEvt, this._dragStopCB );
		},

		_disableTracking: function () {
			$(document).unbind( this._dragMoveEvt, this._dragMoveCB );
			$(document).unbind( this._dragStopEvt, this._dragStopCB );
		},

		_handleDragStart: function ( e, ex, ey ) {
			var widget = this;
			widget._scrollView._handleDragStart.apply( this, [ e, ex, ey ] );
			widget._eventPos = widget._direction ? ex : ey;
			widget._nextPos = widget._reservedPos;
		},

		_handleDragMove: function ( e, ex, ey ) {
			var widget = this,
				dx = ex - widget._lastX,
				dy = ey - widget._lastY,
				x = 0,
				y = 0;

			widget._lastMove = getCurrentTime();
			widget._speedX = dx;
			widget._speedY = dy;

			widget._didDrag = true;

			widget._lastX = ex;
			widget._lastY = ey;

			if ( widget._direction ) {
				widget._movePos = ex - widget._eventPos;
				x = widget._nextPos + widget._movePos;
			} else {
				widget._movePos = ey - widget._eventPos;
				y = widget._nextPos + widget._movePos;
			}
			widget._showScrollBars();
			widget._setScrollPosition( x, y );
			return false;
		},

		_handleDragStop: function ( e ) {
			var widget = this;

			widget._reservedPos = widget._movePos ? widget._nextPos + widget._movePos : widget._reservedPos;
			widget._scrollView._handleDragStop.apply( this, [ e ] );
			return widget._didDrag ? false : undefined;
		},

		_addBehaviors: function () {
			var widget = this;

			if ( widget.options.eventType === "mouse" ) {
				widget._dragStartEvt = "mousedown";
				widget._dragStartCB = function ( e ) {
					return widget._handleDragStart( e, e.clientX, e.clientY );
				};

				widget._dragMoveEvt = "mousemove";
				widget._dragMoveCB = function ( e ) {
					return widget._handleDragMove( e, e.clientX, e.clientY );
				};

				widget._dragStopEvt = "mouseup";
				widget._dragStopCB = function ( e ) {
					return widget._handleDragStop( e, e.clientX, e.clientY );
				};

				widget._$view.bind( "vclick", function (e) {
					return !widget._didDrag;
				} );
			} else { //touch
				widget._dragStartEvt = "touchstart";
				widget._dragStartCB = function ( e ) {
					var t = e.originalEvent.targetTouches[0];
					return widget._handleDragStart(e, t.pageX, t.pageY );
				};

				widget._dragMoveEvt = "touchmove";
				widget._dragMoveCB = function ( e ) {
					var t = e.originalEvent.targetTouches[0];
					return widget._handleDragMove(e, t.pageX, t.pageY );
				};

				widget._dragStopEvt = "touchend";
				widget._dragStopCB = function ( e ) {
					return widget._handleDragStop( e );
				};
			}
			widget._$view.bind( widget._dragStartEvt, widget._dragStartCB );
		},

		_makeBlocks : function ( count ) {
			var widget = this,
				opts = widget.options,
				index = 0,
				$item = null,
				$wrapper = null;

			$wrapper = $(document.createElement("div"));
			$wrapper.addClass("ui-scrollview-view");
			for ( index = 0; index < count ; index += 1 ) {
				$item = widget._makeWrapBlock( widget._template, widget._dataSet, index );
				if ( widget._direction ) {
					$item.css("top", 0).css("left", ( index * widget._itemSize ));
				}
				$wrapper.append($item);
			}
			$wrapper.children().first().addClass("rotation-head");
			return $wrapper;
		},

		// make a single row block
		_makeWrapBlock : function ( myTemplate, dataTable, rowIndex ) {
			var widget = this,
				opts = widget.options,
				index = rowIndex * opts.itemcount,
				htmlData = null,
				colIndex = 0,
				attrName = widget._direction ? "top" : "left",
				blockClassName = widget._direction ? "ui-virtualgrid-wrapblock-x" : "ui-virtualgrid-wrapblock-y",
				blockAttrName = widget._direction ? "top" : "left",
				wrapBlock = $( document.createElement( "div" ));

			wrapBlock.addClass( blockClassName );
			for ( colIndex = 0; colIndex < opts.itemcount; colIndex++ ) {
				if ( dataTable[index] ) {
					htmlData = myTemplate.tmpl( dataTable[index] );
					$(htmlData).css(attrName, ( colIndex * widget._itemOtherSize )).addClass("virtualgrid-item");
					wrapBlock.append( htmlData );
					index += 1;
				}
			}
			return wrapBlock;
		},

		_replaceBlock : function ( block, index ) {
			var widget = this,
				opts = widget.options,
				$items = null,
				$item = null,
				data = null,
				htmlData = null,
				myTemplate = null,
				idx = 0,
				dataIdx = 0,
				tempBlocks = null;

			$items = $(block).children();
			if ( $items.length !== opts.itemcount ) {
				tempBlocks = $(widget._makeWrapBlock( widget._template, widget._dataSet, index ));
				$(block).append(tempBlocks.children());
				tempBlocks.remove();
				return ;
			}

			dataIdx = index * opts.itemcount;
			for ( idx = 0; idx < opts.itemcount ; idx += 1) {
				$item = $items[idx];
				data = widget._dataSet[dataIdx];
				if ( $item && data ) {
					myTemplate = widget._template;
					htmlData = myTemplate.tmpl( data );
					widget._replace( $item, htmlData, false );
					dataIdx ++;
				}
			}
		},

		/* Text & image src replace function */
		// @param oldItem   : prev HtmlDivElement
		// @param newItem   : new HtmlDivElement for replace
		// @param key       :
		_replace : function ( oldItem, newItem, key ) {
			$( oldItem ).find( ".ui-li-text-main", ".ui-li-text-sub", "ui-btn-text" ).each( function ( index ) {
				var oldObj = $( this ),
					newText = $( newItem ).find( ".ui-li-text-main", ".ui-li-text-sub", "ui-btn-text" ).eq( index ).text();

				$( oldObj ).contents().filter( function () {
					return ( this.nodeType == 3 );
				}).get( 0 ).data = newText;
			});

			$( oldItem ).find( "img" ).each( function ( imgIndex ) {
				var oldObj = $( this ),
					newImg = $( newItem ).find( "img" ).eq( imgIndex ).attr( "src" );

				$( oldObj ).attr( "src", newImg );
			});
			if ( key ) {
				$( oldItem ).data( key, $( newItem ).data( key ) );
			}
		}
	} );

	$( document ).bind( "pagecreate create", function ( e ) {
		$(":jqmData(role='virtualgrid')").virtualgrid();
	} );
} (jQuery, window, document) );
