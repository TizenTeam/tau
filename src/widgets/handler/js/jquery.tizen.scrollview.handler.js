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
 * "Handler" is a widget helping a user to scroll a window or panel.
 * It is different from the scrollview feature in that the handler has a fixed size
 * and disappears when a scroll size is smaller than a parent window's size.
 * If the handler widget is activated, a scroll bar on the screen will be deactivated.
 * The handler widget supports scrolling up and down and indicates the position of the scrolled window.
 *
 * HTML Attributes:
 *
 *		data-handler : This attribute is indicating that whether enable.
 *						If you want to use, you will set 'true'.
 *		data-handler-theme : Set the widget theme ( optional )
 *
 * APIs:
 *
 *		enableHandler ( boolean )
 *			: Get or set the use of handler widget.
 *			If the value is "true", it will be run handler widget.
 *			If the value is "false", it will be not run handler widget.
 *			If no value is specified, will act as a getter.
 *
 * Events:
 *
 * Examples:
 *
 *		<div data-role="content" data-scroll="y" data-handler="true">
 *			<ul data-role="listview">
 *				<li data-role="list-divider">A</li>
 *				<li><a href="#">Adam Kinkaid</a></li>
 *					...
 *			</ul>
 *		</div>
 */

/**
	@class handler
	The handler widget enables the user to vertically scroll through a page or panel using a fixed-size handle. The widget indicates the position of the scrolled window, and only appears on the screen if the parent page or panel's scroll size is larger than the screen size. <br/> To add a handler widget to the application, use the following code:

		<div data-role="content" data-scroll="y" data-handler="true">
			<ul data-role="listview">
				<li data-role="list-divider">A</li>
				<li><a href="#">Adam Kinkaid</a></li>
					...
			</ul>
		</div>
	
	You can use the enableHandler method with the handler widget to get (if no value is defined) or set the handler usage status. If the [enable] value is true, the handler is enabled; otherwise the handler is not used.

		$("#.selector").scrollview("enableHandler", [enable]);
*/
/**
	@property {Boolean} data-handler
	Enables the handler widget. The value must be set to true.
*/
/**
	@property {String} data-handler-theme
	Sets the handler widget theme.
*/
( function ( $, document, undefined ) {
	// The options of handler in scrollview
	$.tizen.scrollview.prototype.options.handler = false;
	$.tizen.scrollview.prototype.options.handlerTheme = "s";

	var originSetOption = $.tizen.scrollview.prototype._setOption,
		createHandler = function ( target ) {
			var $view = target,
				prefix = "<div class=\"ui-handler ui-handler-direction-",
				suffix = "\"><div class=\"ui-handler-track\"><div class=\"ui-handler-thumb\"></div></div></div>",
				scrollview = $view.data( "scrollview" ),
				options = scrollview.options,
				direction = options.direction,
				parentTheme = $.mobile.getInheritedTheme( scrollview, "s" ),
				theme = options.theme || parentTheme,
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
				dragMoveEvt = ( isTouchable ? "touchmove" : "mousemove" ) + ".handler",
				dragStopEvt = ( isTouchable ? "touchend" : "mouseup" ) + ".handler",
				calculateLength = function () {
					clipLength = ( isHorizontal ? _$clip.width() : _$clip.height() );
					viewLength = ( isHorizontal ? _$view.outerWidth( true ) : _$view.outerHeight( true ) ) - clipLength;
					trackLength = clipLength - handlerHeight - handlerMargin * 2;
				},
				setHanderPostion = function ( scrollPos ) {
					var handlerPos = Math.round( ( isHorizontal ? scrollPos.x : scrollPos.y ) / viewLength * trackLength );
					handlerThumb.css( isHorizontal ? "left" : "top", handlerPos );
				};

			if ( $view.find( ".ui-handler-thumb" ).length !== 0 || typeof direction !== "string" ) {
				return;
			}

			$view.addClass( " ui-handler-" + theme ).append( [ prefix, direction, suffix ].join( "" ) );
			handler = $view.find( ".ui-handler" );
			handlerThumb = $view.find( ".ui-handler-thumb" ).hide();
			handlerHeight = ( isHorizontal ? handlerThumb.width() : handlerThumb.height() );
			handlerMargin = ( isHorizontal ? parseInt( handler.css( "right" ), 10 ) : parseInt( handler.css( "bottom" ), 10 ) );

			$.extend( $view, {
				moveData : null
			});

			// handler drag
			handlerThumb.bind( dragStartEvt, {
				e : handlerThumb
			}, function ( event ) {
				scrollview._stopMScroll();

				var target = event.data.e,
					t = ( isTouchable ? event.originalEvent.targetTouches[0] : event );

				target.css( "opacity", 1.0 );

				$view.moveData = {
					target : target,
					X : parseInt( target.css( 'left' ), 10 ) || 0,
					Y : parseInt( target.css( 'top' ), 10 ) || 0,
					pX : t.pageX,
					pY : t.pageY
				};
				calculateLength();

				_$view.trigger( "scrollstart" );
				event.preventDefault();
				event.stopPropagation();

				$( document ).bind( dragMoveEvt, function ( event ) {
					var moveData = $view.moveData,
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

					$view.attr( "display", "none" );
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
					$view.attr( "display", "inline" );

					event.preventDefault();
					event.stopPropagation();
				}).bind( dragStopEvt, function ( event ) {
					$( document ).unbind( dragMoveEvt ).unbind( dragStopEvt );

					$view.moveData = null;
					_$view.trigger( "scrollstop" );

					event.preventDefault();
				});
			});

			$( document ).bind( dragMoveEvt, function ( event ) {
				var isVisible = false,
					vclass = "ui-scrollbar-visible";

				if ( scrollview._$vScrollBar ) {
					isVisible = scrollview._$vScrollBar.hasClass( vclass );
				} else if ( scrollview._$hScrollBar ) {
					isVisible = scrollview._$hScrollBar.hasClass( vclass );
				}

				if ( isVisible || $view.moveData !== null ) {
					if ( handlerThumb.hasClass( "ui-handler-visible" ) ) {
						_$view.trigger( "scrollupdate" );
					} else {
						_$view.trigger( "scrollstop" );
					}
				}
			}).bind( dragStopEvt, function ( event ) {
				if ( handlerThumb.hasClass( "ui-handler-visible" ) ) {
					_$view.trigger( "scrollstop" );
				}
			});

			$view.bind( "scrollstart", function ( event ) {
				if ( !scrollview.enableHandler() ) {
					return;
				}
				calculateLength();

				if ( clipLength > viewLength || trackLength < ( handlerHeight * 4 / 3 ) ) {
					return;
				}

				handlerThumb.addClass( "ui-handler-visible" )
							.stop( true, true )
							.fadeIn( 'fast' );

				event.preventDefault();
				event.stopPropagation();
			}).bind( "scrollupdate", function ( event, data ) {
				if ( !scrollview.enableHandler() || clipLength > viewLength || trackLength < ( handlerHeight * 4 / 3 ) ) {
					return;
				}

				setHanderPostion( scrollview.getScrollPosition() );

				event.preventDefault();
				event.stopPropagation();
			}).bind( "scrollstop", function ( event ) {
				if ( !scrollview.enableHandler() || clipLength > viewLength ) {
					return;
				}

				if ( scrollview._handlerTimer ) {
					clearTimeout( scrollview._handlerTimer );
					scrollview._handlerTimer = 0;
				}
				scrollview._handlerTimer = setTimeout( function () {
					if ( scrollview._timerID === 0 && $view.moveData === null ) {
						handlerThumb.removeClass( "ui-handler-visible" )
									.stop( true, true )
									.css( "opacity", 1.0 )
									.fadeOut( 'fast' );
						scrollview._handlerTimer = 0;
					}
				}, 1000 );

				event.preventDefault();
			}).bind( "mousewheel", function ( event ) {
				handlerThumb.removeClass( "ui-handler-visible" ).hide();
				setHanderPostion( scrollview.getScrollPosition() );
			});
		};

	$.extend( $.tizen.scrollview.prototype, {
		enableHandler: function ( enabled ) {
			if ( typeof enabled === 'undefined' ) {
				return this.options.handler;
			}

			this.options.handler = !!enabled;

			var view = this.element;
			if ( this.options.handler ) {
				if ( view.find( ".ui-handler" ).length === 0 ) {
					createHandler( view );
				}

				view.find( ".ui-scrollbar" ).hide();
				view.find( ".ui-handler" ).show();
			} else {
				view.find( ".ui-handler" ).hide();
				view.find( ".ui-scrollbar" ).show();
			}
		},

		_setHandlerTheme: function ( handlerTheme ) {
			if ( !handlerTheme ) {
				return;
			}

			var oldClass = "ui-handler-" + this.options.handlerTheme,
				newClass = "ui-handler-" + handlerTheme;

			this.element.removeClass( oldClass ).addClass( newClass );
			this.options.handlerTheme = handlerTheme;
		},

		_setOption: function ( key, value ) {
			switch ( key ) {
			case "handler":
				this.enableHandler( value );
				break;
			case "handlerTheme":
				this._setHandlerTheme( value );
				break;
			default:
				originSetOption.call( this, key, value );
			}
		},

		_handlerTimer : 0
	});

	$( document ).delegate( ":jqmData(scroll)", "scrollviewcreate", function () {
		var widget = $( this );
		if ( widget.attr( "data-" + $.mobile.ns + "scroll" ) === "none"
				|| widget.jqmData( "handler" ) !== true ) {
			return;
		}
		widget.scrollview( "enableHandler", "true" );
	});
} ( jQuery, document ) );
