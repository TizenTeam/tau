/*
* Authors: Wonseop Kim ( wonseop.kim@samsung.com )
*/

/**
 * splitview is a widget that lets the user to see both a form and
 * a web-page at the same time.
 * To apply, add the attribute data-role="splitview" to an <div> field.
 *
 * HTML Attributes:
 *
 *	- splitview
 *		data-role : splitview
 *		data-theme ( null ): jQM UI theme.
 *		data-fixed ( false ): if true, the panel's position is fixed.
 *							if false, the panel's position is moveable.
 *		data-direction ( "horizontal" ) : the display direction of panels.
 *
 *	- panel
 *		data-role : panel
 *		data-id : <div> element that has "data-role=panel" must have ID attribute.
 *		data-size : the percentage of parent( splitview )( as a decimal between 0 and 1 ).
 *
 *	- Linked elements of panel
 *		data-target : The ID of target panel.
 *
 * APIs:
 *
 *		fixed ( [boolean] )
 *			: Gets or sets the fixed mode of the splitview.
 *			  The first argument is a fixed state of the splitview.
 *			  if first argument state is true, the panel's position is fixed.
 *			  if first argument state is false, the panel's position is moveable.
 *			  if no first argument is specified, will act as a getter.
 *
 *		addPanel ( string, [number] )
 *			: Add a new panel.
 *			  The first argument is ID of the panel to be added.
 *			  The second argument is the index of the panel to be added.
 *			  If no second argument is specified, will append new one to the last panel.
 *
 *		removePanel ( [string] )
 *			: Remove a panel.
 *			  The first argument is ID of the panel to be removed.
 *			  if no first argument is specified, will remove the last panel.
 *
 *		length ( void )
 *			:  Retrieve the number of panels.
 *
 *		direction ( [boolean] )
 *			: Gets or sets the direction of the splitview.
 *			  If no first argument is specified, will act as a getter.
 *
 *		size ( string, [number] )
 *			: Gets or sets the percentage of parent( splitview )( as a decimal between 0 and 1 ).
 *			  The first argument is ID of the panel to be resized.
 *			  The second argument is the percentage.
 *			  If no second argument is specified, will act as a getter.
 *
 * Events:
 *
 *		none.
 *
 * Examples:
 *
 *		<div data-role="splitview" data-direction="horizontal" data-fixed="false">
 *			<div data-role="panel" data-id="menu" data-size="0.3">
 *				<ul data-role="listview">
 *					<li><a href="ANY_URL" data-target="main">TEST</a></li>
 *					...
 *				<ul>
 *			</div>
 *			<div data-role="panel" data-id="main" data-size="0.7">
 *			</div>
 *		</div>
 *
 */

( function ( $, window, document, undefined ) {
	$.widget( "tizen.splitview", $.mobile.widget, {
		options : {
			theme : null,
			fixed : false,
			direction : "horizontal", // "horizontal", "vertical".
			initSelector : ":jqmData(role='splitview')"
		},

		_create : function () {
			var self = this,
				$el = this.element,
				opt = this.options,
				parentTheme = $.mobile.getInheritedTheme( $el, "s" ),
				theme = this.options.theme || parentTheme,
				$panels = $el.children( ":jqmData(role='panel')" ).addClass( "ui-panel" ),
				spliters = [],
				sizes = [];

			$panels.each( function ( i ) {
				var $panel = $( this ),
					listViews = $panel.find( ":jqmData(role='listview')" ),
					handle = null;

				if ( i < $panels.length - 1 ) {
					spliters[i] = $( "<div class=\"ui-spliter\"></div>" ).insertAfter( $panel );
					handle = $( "<a href='#' class=\"ui-spliter-handle\"></a>" ).appendTo( spliters[i] );
					self._movable( spliters[i] );
				}

				if ( listViews.length > 0 ) {
					listViews.find( "li a[data-target]" ).each( function ( i ) {
						var $a = $( this );
						if ( $a.attr( "href" ) ) {
							$a.attr( "data-href", $a.attr( "href" ) ).attr( "href", "" ).bind( "vclick", function ( e ) {
								var href = $a.attr( "data-href" ),
									target = $a.attr( "data-target" );
								self._changePanel( href, target );
							});
						}
					});
				}
			});

			self._collectSizes();

			$.extend( this, {
				moveTarget : null,
				moveData : {},
				spliters : spliters,
				panels : $panels,
				sizes : sizes
			});

			$el.addClass( "ui-splitview ui-direction-" + opt.direction );

			$( document ).bind( "pageshow.splitview", function ( e ) {
				self._fitContentArea( $( e.target ) );
				self._collectSizes();
				self._layout();
			});

			$( window ).bind( "orientationchange.splitview", function ( e ) {
				self._fitContentArea( $( e.target ) );
				self._layout();
			});

		},
		_fitContentArea: function ( page, parent ) {
			if ( typeof parent == "undefined" ) {
				parent = window;
			}

			var $page = $( page ),
				$content = $page.children( ".ui-content:visible:first" ),
				hh = $page.children( ".ui-header:visible" ).outerHeight() || 0,
				fh = $page.children( ".ui-footer:visible" ).outerHeight() || 0,
				pt = parseFloat( $content.css( "padding-top" ) ),
				pb = parseFloat( $content.css( "padding-bottom" ) ),
				wh = $(parent).height(),
				height = wh - ( hh + fh ) - ( pt + pb );

			$content.offset( {
				top : ( hh + pt )
			}).height( height );
		},
		_layout : function () {
			var self = this,
				$el = self.element,
				opt = self.options,
				isHorizontal = (opt.direction === "horizontal"),
				$parent = $el.parent(),
				$panels = self.panels,
				spliters = self.spliters,
				spliterWidth = ( isHorizontal ?
								 $( spliters[0] ).outerWidth(true) :
								 $( spliters[0] ).outerHeight(true) ),
				parentWidth = $parent.width(),
				parentHeight = $parent.height(),
				panelsLength = $panels.length,
				availableWidth = ( isHorizontal ?
								  ( parentWidth - ( isHorizontal ? ( spliterWidth * ( panelsLength - 1 ) ) : 0 ) ) :
								  ( parentHeight - ( !isHorizontal ? ( spliterWidth * ( panelsLength - 1 ) ) : 0 ) ) ),
				sizeCumulation = 0,
				noSizeCount = 0,
				currentAvailable = 0;

			$el.css( {
				"width" : parentWidth,
				"height" : parentHeight
			});

			$panels.each( function ( i ) {
				var $panel = $( this ),
					panelWidth = availableWidth * self.sizes[i];

				if ( panelWidth <= 0 ) {
					noSizeCount += 1;
				} else {
					$panel.css( ( isHorizontal ? "width" :  "height" ), panelWidth );
					sizeCumulation += panelWidth;
				}
			});
			currentAvailable = availableWidth - sizeCumulation;
			$panels.each( function ( i ) {
				var $panel = $( this ),
					panelWidth = ( isHorizontal ? $panel.width() : $panel.height() ),
					prevPanel = ( ( i !== 0 ) ? $panels.eq( i - 1 ) : null );

				if ( self.sizes[i] === 0 && noSizeCount !== 0 ) {
					panelWidth = currentAvailable / noSizeCount;
					sizeCumulation += panelWidth;
				}
				if ( i === ( panelsLength - 1 ) ) {
					panelWidth += ( availableWidth - sizeCumulation );
				}

				self.sizes[i] = Math.max( panelWidth / availableWidth, 0 );
				$panel.css( {
					"width" : (isHorizontal ? panelWidth : parentWidth),
					"height" : (isHorizontal ? parentHeight : panelWidth)
				});

				if ( isHorizontal ) {
					$panel.css( {
						"width" : panelWidth,
						"height" : parentHeight,
						"left" : ( prevPanel !== null ? parseInt( prevPanel.css( "left" ), 10 ) + prevPanel.width() + spliterWidth : 0 )
					});
				} else {
					$panel.css( {
						"width" : parentWidth,
						"height" : panelWidth,
						"top" : ( prevPanel !== null ? parseInt( prevPanel.css( "top" ), 10 ) + prevPanel.height() + spliterWidth : 0 )
					});
				}
			});

			$.each( spliters, function ( i ) {
				var spliter = $( this ),
					prevPanel = $panels.eq( i ),
					handle = spliter.find( ".ui-spliter-handle" );
				if ( isHorizontal ) {
					spliter.height( parentHeight ).css( "left", parseInt( prevPanel.css( "left" ), 10 ) + prevPanel.width() );
					if ( handle ) {
						handle.css( "top", ( parentHeight - spliterWidth ) / 2 );
					}
				} else {
					spliter.width( parentWidth ).css( "top", parseInt( prevPanel.css( "top" ), 10 ) + prevPanel.height() );
					if ( handle ) {
						handle.css( "left", ( parentWidth - spliterWidth ) / 2 );
					}
				}
			});
			self._resize();
		},
		_resize : function () {
			var self = this,
				$el = self.element,
				opt = self.options,
				$parent = $el.parent(),
				$panels = self.panels,
				spliters = self.spliters,
				parentWidth = parseInt( $parent.css( "width" ), 10 ),
				parentHeight = parseInt( $parent.css( "height" ), 10 ),
				spliterWidth = ( ( opt.direction === "horizontal" ) ?
								$( spliters[0] ).outerWidth() :
								$( spliters[0] ).outerHeight() ),
				diffWidth = parentWidth - parseInt( $el.css( "width" ), 10 ),
				diffHeight = parentHeight - parseInt( $el.css( "height" ), 10 );

			$el.css( {
				"width" : parentWidth,
				"height" : parentHeight
			});

			if ( diffWidth !== 0 ) {
				$panels.each( function ( i ) {
					var $panel = $( this );
					$panel.css( "width", parentWidth );
				});
				if ( opt.direction === "vertical" ) {
					$.each( spliters, function ( i ) {
						var $spliter = $( this );
						$spliter.css( "width", parentWidth );
						$spliter.find( ".ui-spliter-handle" ).css( "left", ( parentWidth - spliterWidth ) / 2 );

					});
				}
			}

			if ( diffHeight !== 0 ) {
				$panels.each( function ( i ) {
					var $panel = $( this );
					$panel.css( "height", parentHeight );
				});
				if ( opt.direction === "horizontal" ) {
					$.each( spliters, function ( i ) {
						var $spliter = $( this );
						$spliter.css( "height", parentHeight );
						$spliter.find( ".ui-spliter-handle" ).css( "top", ( parentHeight - spliterWidth ) / 2 );
					});
				}
			}

			$el.find( ":jqmData(role='splitview')" ).splitview( "refresh", false );
		},
		_collectSizes : function () {
			var self = this,
				$el = this.element,
				$panels = $el.children( ":jqmData(role='panel')" ),
				sizes = [];

			self.sizes = null;
			$panels.each( function ( i ) {
				var $panel = $( this ),
					size = parseFloat( $panel.attr( "data-size" ) );
				sizes[i] = size || 0;
			});

			self.sizes = sizes;
		},
		_changePanel : function ( href, target ) {
			var $targetPanel = $( "[data-role='panel']:jqmData(id='" + target + "')" );

			$targetPanel.empty().html(
				"<iframe class='ui-splitview-iframe' scrolling='yes' src='" + href + "' " + "></iframe>"
			);

			$targetPanel.fadeIn( 'fast' );
		},
		_movable : function ( elem ) {
			var self = this, opt = self.options;

			elem.find( ".ui-spliter-handle" ).bind( 'vmousedown', { e : elem }, function ( event ) {
				var target = event.data.e,
					prev = target.prev(),
					next = target.next(),
					prevSV = prev.find( ":jqmData(role='splitview')" ),
					nextSV = next.find( ":jqmData(role='splitview')" ),
					spliterWidth = ( ( opt.direction === "horizontal" ) ?
									$( self.spliters[0] ).outerWidth() :
									$( self.spliters[0] ).outerHeight() );

				self.moveTarget = target;
				self.moveData = {
					spliterWidth : spliterWidth || 0,
					prev : prev,
					next : next,
					prevSplitview : prevSV,
					nextSplitview : nextSV,
					prevX : parseInt( prev.css( 'left' ), 10 ) || 0,
					prevY : parseInt( prev.css( 'top' ), 10 ) || 0,
					prevW : parseInt( prev.css( 'width' ), 10 ) || prev[0].scrollWidth || 0,
					prevH : parseInt( prev.css( 'height' ), 10 ) || prev[0].scrollHeight || 0,
					nextX : parseInt( next.css( 'left' ), 10 ) || 0,
					nextY : parseInt( next.css( 'top' ), 10 ) || 0,
					nextW : parseInt( next.css( 'width' ), 10 ) || next[0].scrollWidth || 0,
					nextH : parseInt( next.css( 'height' ), 10 ) || next[0].scrollHeight || 0,
					X : parseInt( target.css( 'left' ), 10 ) || 0,
					Y : parseInt( target.css( 'top' ), 10 ) || 0,
					pX : event.pageX,
					pY : event.pageY
				};

				target.addClass( "ui-spliter-active" );

				$( ".ui-splitview-iframe" ).css( "pointer-events", "none" );

				$( document ).bind( "vmousemove.splitview", function ( event ) {
					self._drag( event );

					event.preventDefault();
					event.stopPropagation();
				}).bind( "vmouseup.splitview", function ( event ) {
					self._stop( event );

					event.preventDefault();
					event.stopPropagation();
				});

				event.preventDefault();
				event.stopPropagation();
			});
		},
		_drag : function ( e ) {
			var self = this,
				opt = self.options,
				moveData = self.moveData,
				target = self.moveTarget,
				prev = moveData.prev,
				next = moveData.next,
				prevSV = moveData.prevSplitview,
				nextSV = moveData.nextSplitview,
				handerPos = null,
				spliterWidth = moveData.spliterWidth,
				displayAttr = this.element.attr( "display" ),
				movement = null,
				nextPos = null,
				prevWidth = null,
				nextWidth = null;

			if ( typeof moveData == "undefined" ) {
				return;
			}
			displayAttr = this.element.attr( "display" );
			this.element.attr( "display", "none" );

			if ( opt.direction === "horizontal" ) {
				movement = ( e.pageX - moveData.pX );
				nextPos = moveData.nextX + movement;
				prevWidth = Math.max( moveData.prevW + movement, 0 );
				nextWidth = Math.max( moveData.nextW - movement, 0 );
				handerPos = moveData.X + movement;

				if ( handerPos > moveData.prevX && handerPos < moveData.nextX + moveData.nextW - spliterWidth ) {
					target.css( {
						left : handerPos
					});
					prev.css( {
						width : prevWidth
					});
					next.css( {
						width : nextWidth,
						left : nextPos
					});
				}

			} else if ( opt.direction === "vertical" ) {
				movement = ( e.pageY - moveData.pY );
				nextPos = moveData.nextY + movement;
				prevWidth = Math.max( moveData.prevH + movement, 0 );
				nextWidth = Math.max( moveData.nextH - movement, 0 );
				handerPos = moveData.Y + movement;

				if ( handerPos > moveData.prevY && handerPos < moveData.nextY + moveData.nextH - spliterWidth ) {
					target.css( {
						top : handerPos
					});
					prev.css( {
						height : prevWidth
					});
					next.css( {
						height : nextWidth,
						top : nextPos
					});
				}
			}

			this.element.attr( "display", displayAttr );

			if ( prevSV.length !== 0 ) {
				prevSV.splitview( "refresh", false );
			}

			if ( nextSV.length !== 0 ) {
				nextSV.splitview( "refresh", false );
			}
		},
		_stop : function ( e ) {
			var self = this,
				opt = self.options,
				isHorizontal = (opt.direction === "horizontal"),
				moveData = self.moveData,
				$panels = self.panels,
				$el = self.element,
				$parent = $el.parent(),
				parentWidth = $parent.width(),
				parentHeight = $parent.height(),
				spliterWidth = moveData.spliterWidth,
				panelsLength = $panels.length,
				availableWidth = ( isHorizontal ?
								  ( parentWidth - ( isHorizontal ? ( spliterWidth * ( panelsLength - 1 ) ) : 0 ) ) :
								  ( parentHeight - ( !isHorizontal ? ( spliterWidth * ( panelsLength - 1 ) ) : 0 ) ) ),
				target = self.moveTarget;

			if ( typeof moveData == "undefined" ) {
				return;
			}

			$( document ).unbind( "vmousemove.splitview vmouseup.splitview" );
			$( ".ui-splitview-iframe" ).css( "pointer-events", "" );
			target.removeClass( "ui-spliter-active" );

			// size calculation
			$panels.each( function ( i ) {
				var $panel = $( this ),
					panelWidth = ( isHorizontal ? $panel.width() : $panel.height() );
				self.sizes[i] = panelWidth / availableWidth;
			});
			self.moveData = null;
		},
		refresh : function ( bInit ) {
			if ( typeof bInit == "undefined" ) {
				bInit = true;
			}

			if ( bInit ) {
				this._layout();
			} else {
				this._resize();
			}
		},
		fixed : function ( isFix ) {
			var self = this, spliters = self.spliters;

			this._setOption( "fixed", isFix );

			$.each( spliters, function ( i ) {
				var $spliter = $( this );

				if ( isFix ) {
					$spliter.addClass( "ui-fixed" );
				} else {
					$spliter.removeClass( "ui-fixed" );
				}
			});

			self._layout();
		},
		destroy : function () {
			$( window ).unbind( "orientationchange.splitview" );
			$( document ).unbind( "orientationchange.splitview" );
		},
		addPanel : function ( id, index ) {
			if ( typeof id == 'undefined' || id === null || this.element.children( "[data-role='panel']:jqmData(id='" + id + "')" ).length !== 0 ) {
				return null;
			}

			var self = this,
				$el = self.element,
				opt = self.options,
				$panels = $el.children( ":jqmData(role='panel')" ),
				panel = $( "<div data-role=\"panel\" data-id=\"" + id + "\" class=\"ui-panel\"></div>" ),
				spliter = $( "<div class=\"ui-spliter\"><a href='#' class=\"ui-spliter-handle\"></a></div>" ),
				panelLength = $panels.length;

			if ( typeof index == 'undefined' || index === null ) {
				$panels.last().after( panel ).after( spliter );
				self.sizes.push( 0 );
			} else {
				if ( index > panelLength ) {
					index = panelLength;
				}
				$panels.eq( index ).before( panel ).before( spliter );
				self.sizes.splice( index, 0, 0 );
			}

			self.panels = $el.children( ".ui-panel" );
			self.spliters = $el.children( ".ui-spliter" ).toArray();

			self._movable( spliter );
			this._layout();

			return panel;
		},
		removePanel : function ( id ) {
			var self = this,
				$el = self.element,
				$spliters = self.spliters,
				$spliter = null,
				$panel = null,
				index = 0;

			if ( typeof id !== "string" ) {
				return;
			}

			$panel = $el.children( "[data-role='panel']:jqmData(id='" + id + "')" );

			if ( typeof $panel == "undefined" || $panel === null || $panel.length < 1 || $spliters.length < 1 ) {
				return;
			}
			$spliter = ( $spliters.length == 1 ) ? $spliters[0] : $panel.prev( ".ui-spliter" );
			self.panels.each( function ( i ) {
				var panel = $( this );

				if ( panel.attr( "data-id" ) == id ) {
					self.sizes.splice( i, 1 );
				}
			});
			if ( typeof $spliter != "undefined" && $spliter !== null ) {
				$spliter.remove();
			}

			$panel.remove();

			self.panels = $el.children( ".ui-panel" );
			self.spliters = $el.children( ".ui-spliter" );

			this._layout();
		},
		length : function () {
			return this.panels.length();
		},
		direction : function ( dir ) {
			if ( arguments.length < 1 ) {
				return this.options.direction;
			}

			if ( dir == "vertical" || dir == "horizontal" ) {
				this._setOption( "direction", dir );
			}

			this._layout();
		},
		size : function ( id, size ) {
			var self = this, result = 0;
			if ( arguments.length === 1 ) {
				self.panels.each( function ( i ) {
					var panel = $( this );

					if ( panel.attr( "data-id" ) == id ) {
						result = self.sizes[i];
					}
				});
				return result;
			}

			if ( arguments.length === 2 ) {
				self.panels.each( function ( i ) {
					var panel = $( this );

					if ( panel.attr( "data-id" ) == id ) {
						self.sizes[i] = parseFloat( size );
					}
				});

				self._layout();
			}
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
		$.tizen.splitview.prototype.enhanceWithin( e.target );
	});
} ( jQuery, window, document ) );
