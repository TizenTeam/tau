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
 * Authors: Wonseop Kim ( wonseop.kim@samsung.com )
*/

/**
 * ‘Handler’ is a widget helping a user to scroll a window or panel.
 * It is different from the scrollview feature in that the handler has a fixed size
 * and disappears when a scroll size is smaller than a parent window's size.
 * If the handler widget is activated, a scroll bar on the screen will be deactivated.
 * The handler widget supports scrolling up and down and indicates the position of the scrolled window.
 *
 * HTML Attributes:
 *
 *		data-handler : This attribute is indicating that whether enable.
 *						If you want to use, you will set 'true'.
 *		data-handlertheme : Set the widget theme ( optional )
 *
 * APIs:
 *
 *		enableHandler ( boolean )
 *			: Get or set the use of Handler.
 *			If the value is ‘true’, it will be run Handler.
 *			If the value is ‘false’, it will be not run Handler.
 *			If no value is specified, will act as a getter.
 *
 * Events:
 *
 * Examples:
 *
 *		<div data-role="content" data-scroll="y" data-handler="true">
 *			<ul data-role="listview">
 *				<li data-role="list-divider">A</li>
 *				<li><a href="../../docs/lists/index.html">Adam Kinkaid</a></li>
 *				<li><a href="../../docs/lists/index.html">Alex Wickerham</a></li>
 *				<li><a href="../../docs/lists/index.html">Avery Johnson</a></li>
 *			</ul>
 *		</div>
 */

( function ( $, document, undefined ) {
	// The options of handler in scrollview
	$.tizen.scrollview.prototype.options.handler = false;
	$.tizen.scrollview.prototype.options.handlerTheme = "s";

	$.extend( $.tizen.scrollview.prototype, {
		enableHandler : function ( enabled ) {
			if ( typeof enabled === 'undefined' ) {
				return this.options.handler;
			}

			this.options.handler = !!enabled;

			var view = this.element;
			if ( this.options.handler ) {
				view.find( ".ui-scrollbar" ).hide();
				view.find( ".ui-handler" ).show();
			} else {
				view.find( ".ui-handler" ).hide();
				view.find( ".ui-scrollbar" ).show();
			}
		},
		_handlerTimer : 0
	});

	$( document ).delegate( ":jqmData(scroll)", "scrollviewcreate", function () {
		if ( $( this ).attr( "data-" + $.mobile.ns + "scroll" ) === "none" ) {
			return;
		}

		var self = this,
			$this = $( this ),
			scrollview = $this.data( "scrollview" ),
			prefix = "<div class=\"ui-handler ui-handler-",
			suffix = "\"><div class=\"ui-handler-track\"><div class=\"ui-handler-thumb\"></div></div></div>",
			direction = scrollview.options.direction,
			isHorizontal = ( scrollview.options.direction === "x" ),
			_$view = scrollview._$view,
			_$clip = scrollview._$clip,
			handler = null,
			handlerThumb = null,
			viewLength = 0,
			clipLength = 0,
			handlerHeight = 0,
			handlerMargin = 0,
			trackLength = 0,
			isTouchable = $.support.touch,
			dragStartEvt = ( isTouchable ? "touchstart" : "mousedown" ) + ".handler",
			dragMoveEvtDefault = ( isTouchable ? "touchmove" : "mousemove" ),
			dragMoveEvt = dragMoveEvtDefault + ".handler",
			dragStopEvt = ( isTouchable ? "touchend" : "mouseup" ) + ".handler";

		if ( $this.find( ".ui-handler-thumb" ).length !== 0 || typeof direction !== "string" ) {
			return;
		}

		$this.append( prefix + direction + suffix );
		handler = $this.find( ".ui-handler" );
		handlerThumb = $this.find( ".ui-handler-thumb" ).hide();
		handlerHeight = ( isHorizontal ? handlerThumb.width() : handlerThumb.height() );
		handlerMargin = ( isHorizontal ? parseInt( handler.css( "right" ), 10 ) : parseInt( handler.css( "bottom" ), 10 ) );

		scrollview.enableHandler( scrollview.options.handler );

		$.extend( self, {
			moveData : null
		});

		// handler drag
		handlerThumb.bind( dragStartEvt, {
			e : handlerThumb
		}, function ( event ) {
			scrollview._stopMScroll();

			var target = event.data.e, t = ( isTouchable ? event.originalEvent.targetTouches[0] : event );

			self.moveData = {
				target : target,
				X : parseInt( target.css( 'left' ), 10 ) || 0,
				Y : parseInt( target.css( 'top' ), 10 ) || 0,
				pX : t.pageX,
				pY : t.pageY
			};
			clipLength = ( isHorizontal ? _$clip.width() : _$clip.height() );
			viewLength = ( isHorizontal ? _$view.outerWidth( true ) : _$view.outerHeight( true ) ) - clipLength;
			trackLength = clipLength - handlerHeight - handlerMargin;

			_$view.trigger( "scrollstart" );
			event.preventDefault();
			event.stopPropagation();

			$( document ).bind( dragMoveEvt, function ( event ) {
				var moveData = self.moveData,
					handlePos = 0,
					scrollPos = 0,
					t = ( isTouchable ? event.originalEvent.targetTouches[0] : event );

				handlePos = ( isHorizontal ? moveData.X + t.pageX - moveData.pX : moveData.Y + t.pageY - moveData.pY );

				if ( handlePos < 0 ) {
					handlePos = 0;
				}

				if ( handlePos > trackLength ) {
					handlePos = trackLength;
				}
				scrollPos = - Math.round( handlePos / trackLength * viewLength );

				$this.attr( "display", "none" );
				if ( isHorizontal ) {
					scrollview._setScrollPosition( scrollPos, 0 );
					moveData.target.css( {
						left : handlePos
					});
				} else {
					scrollview._setScrollPosition( 0, scrollPos );
					moveData.target.css( {
						top : handlePos
					});
				}
				$this.attr( "display", "inline" );

				event.preventDefault();
				event.stopPropagation();
			}).bind( dragStopEvt, function ( event ) {
				$( document ).unbind( dragMoveEvt ).unbind( dragStopEvt );

				self.moveData = null;
				_$view.trigger( "scrollstop" );

				event.preventDefault();
			});
		});

		$( document ).bind( dragMoveEvtDefault, function ( event ) {
			var isVisible = false,
				vclass = "ui-scrollbar-visible";

			if ( scrollview._$vScrollBar ) {
				isVisible = scrollview._$vScrollBar.hasClass( vclass );
			} else if ( scrollview._$hScrollBar ) {
				isVisible = scrollview._$hScrollBar.hasClass( vclass );
			}

			if ( isVisible || self.moveData !== null ) {
				if ( handlerThumb.hasClass( "ui-handler-visible" ) ) {
					_$view.trigger( "scrollupdate" );
				} else {
					_$view.trigger( "scrollstart" );
				}
			}
		});

		$this.bind( "scrollstart", function ( event ) {
			if ( !scrollview.enableHandler() ) {
				return;
			}
			clipLength = ( isHorizontal ? _$clip.width() : _$clip.height() );
			viewLength = ( isHorizontal ? _$view.outerWidth( true ) : _$view.outerHeight( true ) ) - clipLength;
			trackLength = clipLength - handlerHeight - handlerMargin;

			if ( clipLength > viewLength || trackLength < ( handlerHeight * 4 / 3 ) ) {
				return;
			}

			handlerThumb.addClass( "ui-handler-visible" );
			handlerThumb.stop().fadeIn( 'fast' );

			event.preventDefault();
			event.stopPropagation();
		}).bind( "scrollupdate", function ( event, data ) {
			if ( !scrollview.enableHandler() || clipLength > viewLength || trackLength < ( handlerHeight * 4 / 3 ) ) {
				return;
			}

			var scrollPos = scrollview.getScrollPosition(), handlerPos = 0;

			handlerThumb.stop( true, true ).hide().css( "opacity", 1.0 );

			if ( isHorizontal ) {
				handlerPos = Math.round( scrollPos.x / viewLength * trackLength );
				handlerThumb.css( "left", handlerPos );
			} else {
				handlerPos = Math.round( scrollPos.y / viewLength * trackLength );
				handlerThumb.css( "top", handlerPos );
			}

			handlerThumb.show();

			event.preventDefault();
			event.stopPropagation();
		}).bind( "scrollstop", function ( event ) {
			if ( !scrollview.enableHandler() || clipLength > viewLength ) {
				return;
			}

			scrollview._handlerTimer = setTimeout( function () {
				if ( scrollview._timerID === 0 && self.moveData === null ) {
					handlerThumb.removeClass( "ui-handler-visible" );
					handlerThumb.stop( true, true ).fadeOut( 'fast' );
					clearTimeout( scrollview._handlerTimer );
					scrollview._handlerTimer = 0;
				}
			}, 1000 );

			event.preventDefault();
		});
	});
} ( jQuery, document ) );
