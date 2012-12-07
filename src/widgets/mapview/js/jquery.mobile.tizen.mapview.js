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
 *	Author: Wonseop Kim <wonseop.kim@samsung.com>
*/

/**
 * 'MapView' is a geospatial mapping widget which uses various geographic web services.
 * A user can select a specific geographic web service and control it with MapView widget APIs.
 * MapView supports the features as follows.
 * - Zoom-in/out
 * - Watch point panning
 * - Marking a point or a polygon on the map.
 * MapView wraps jQueryGeo plug-in and fully supports jQueryGeo APIs.
 * All of geo-data format is based on GeoJSON specification.
 * The max and min values of latitude are 90 and -90, and the equator value is 0 on the Geodetic coordinates.
 * The max and min values of longitude are 180 and -180, and 0 means the position of Greenwich observatory.
 *
 * HTML Attributes:
 *
 *		data-control : Appear(true) or disappear the belonging controller.
 *		data-bbox : bounds of the currently visible viewport.
 *		data-bboxMax : bounds of maximum viewport for non-tiled maps.
 *		data-center : center of the currently visible viewport.
 *		data-zoom : zoom level of the currently visible viewport.
 *		data-mode : determines how the map, user, & developer interact.
 *		data-pannable : allow or prohibit map panning.
 *		data-measure-labels : format to apply to label while measuring.
 *		data-services-provider : determin the content of the map.
 *		data-tile-width : define how tiles are placed in the viewport.
 *		data-axisLayout : Determines direction of the coordinate system axes. It can be "map" or "image".
 *
 * APIs:
 *
 *		toMap ( array [, boolean ] )
 *			: The toMap method takes a single pixel position,
 *			an array of pixel positions, an array of arrays of pixel positions,
 *			or an array of arrays of arrays of pixel positions.
 *			It returns the map coordinates for all of the pixel positions.
 *		toPixel ( array [, boolean ] )
 *			: The toPixel method takes a single GeoJSON position,
 *			an array of GeoJSON positions, an array of arrays of positions,
 *			or an array of arrays of arrays of positions.
 *			It returns the pixel coordinates for all of the map positions.
 *		zoom ( nummber )
 *			: The zoom method can zoom the map in or out by a given number of zoom levels.
 *			Positive values zoom the map in, negative values zoom the map out.
 *		refresh ( void )
 *			: This method refreshes all services and graphics in the map.
 *		resize ( void )
 *			: This method tells the widget to recalculate its frame
 *			and adjust its bbox to fit a new size
 *		destroy ( void )
 *			: Call destroys to turn your interactive map back to a boring old div.
 *		opacity ( number )
 *			: This method sets the value of the opacity property of service objects.
 *		append ( object( GeoJSON object ) | array [ , object ] [ , string ] [ , boolean ] )
 *			: The append method adds one shape or an array of shapes to the map.
 *		remove ( object( GeoJSON object ) | array [ , boolean ] )
 *			: The remove method removes a shape (or array of shapes) that you have
 *			previously added with the append method.
 *		empty ( [ boolean ] )
 *			: The empty method removes all shapes previously added with the append method.
 *		find ( object ( GeoJSON point ), number ) or
 *		find ( string )
 *			: The find method allows you to search for shapes appended to the map
 *			and/or services.
 *
 * Events:
 *		move
 *			: The move event triggers when the user moves the mouse cursor while the cursor is over the map.
 *		click
 *			: The click event triggers when the user clicks or taps a point on the map and then lets go at the same point within a short time threshold.
 *		dblclick
 *			: The dblclick event triggers when the user double-clicks or double-taps a point on the map.
 *		taphold
 *			: Triggers after a held complete touch event (close to one second).
 *		bboxchange
 *			: The bboxchange event triggers any time user interaction causes a change in the current bbox of the map widget.
 *		shape
 *			: The shape event triggers when the user measures a length, or area, or draws a point, line or polygon.
 *
 * Examples:
 *
 *		<div data-role="mapview" style="height:360px;"
 *			data-zoom="8"
 *			data-center="126.981354,37.589207">
 *		</div>
 */

( function ( $, document, window, undefined ) {

	var geoOrigin = {
			geomap: $.extend( {}, $.geo.geomap.prototype ),
			geographics: $.extend( {}, $.geo.geographics.prototype ),
			geotiled: $.extend( {}, $.geo._serviceTypes.tiled ),
			geoShingled: $.extend( {}, $.geo._serviceTypes.shingled ),
		};

	$.widget( "tizen.mapview", $.mobile.widget, {
		options: {
			theme : null,
			center : [ 0, 0 ],
			zoom : 0,
			pannable : true,
			control : true,
			bbox : null,
			bboxMax : null,
			mode : "pan",
			servicesProvider : "osm",
			useMarker: true
		},

		_geomap: undefined,
		_METERS_PER_UNIT: {
			"m" : 1.0,
			"km" : 0.0001,
			"ft" : 3.2808399,
			"mi" : 0.000621371192
		},
		_TOUCHHOLDTIME: 750,
		_supportedSevices: {
			"osm" : [ {
				"class": "osm",
				type: "tiled",
				src: function ( view ) {
					return "http://tile.openstreetmap.org/" + view.zoom + "/" + view.tile.column + "/" + view.tile.row + ".png";
				},
				attr : "&copy; OpenStreetMap &amp; contributors, CC-BY-SA"
			} ],
			"mapquest-open" : [ {
				"class" : "mapquest-open",
				type : "tiled",
				src : function ( view ) {
					return "http://otile" + ( ( view.index % 4 ) + 1 ) + ".mqcdn.com/tiles/1.0.0/osm/" + view.zoom + "/" + view.tile.column + "/" + view.tile.row + ".png";
				},
				attr : "<p>Tiles Courtesy of <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png'></p>"
			} ]
		},
		_markerList: {},
		_mouseDown: {},

		_create: function () {
			var self = this,
				$view = self.element,
				geomap = self._geomap = $.extend( {}, geoOrigin.geomap );

			self._redefineMethods( $view );
			self.options = self._convertOption( self.options );
			geomap._createWidget.call( geomap, self.options, $view[0] );

			if ( $view.hasClass( "ui-mapview" ) ) {
				return;
			}

			$view.addClass( "ui-mapview" );

			self._createControl();
			self._updateScaleState();
			self._addEvent();
		},

		_redefineMethods: function ( element ) {
			var self = this,
				geomap = self._geomap,
				geomapOrigin = geoOrigin.geomap,
				geographics = $.geo.geographics.prototype,
				geographicsOrigin = geoOrigin.geographics,
				eventClone = {},
				supportTouch = $.support.touch,
				startTime = 0,
				isMove = false,
				delayCount = 0,
				maxDelayCount = 10;

			$.extend( geomap, {
				_setOption: function ( key, value, refresh ) {
					var tempTilingScheme;

					if ( key === "tileWidth" ) {
						tempTilingScheme = this._options.tilingScheme;
						tempTilingScheme.tileWidth = tempTilingScheme.tileHeight = parseInt( value, 10 );
						key = "tilingScheme";
						value = tempTilingScheme;
					}

					if ( key === "servicesProvider" ) {
						key = "services";
						value = self._supportedSevices[value] || self._supportedSevices.osm ;
						this._options.zoomMin = 0;
						this._options.zoomMax = 18;
						this._options.tilingScheme.levels = 19;
					}

					geomapOrigin._setOption.call( this, key, value, refresh );
					self._setOptionState.call( self, key, value );
				},

				_setZoom: function ( value, trigger, refresh ) {
					geomapOrigin._setZoom.call( this, value, trigger, refresh );
					self.options.zoom = value;
					self._updateZoomState( this._options.zoom );
					self._updateScaleState();
				},

				_eventTarget_touchstart: function ( e ) {
					eventClone = ( supportTouch ? e.originalEvent.targetTouches[0] : e );
					startTime = new Date().getTime();
					isMove = false;
					self._mouseDown = true;
					geomapOrigin._eventTarget_touchstart.call( this, e );
				},

				_dragTarget_touchmove: function ( e ) {
					// for jquerygeo's exception handling
					if ( supportTouch && ( !this._multiTouchAnchor || !this._multiTouchAnchor[0] ) ) {
						return ;
					}

					isMove = true;
					geomapOrigin._dragTarget_touchmove.call( this, e );
				},

				_dragTarget_touchstop: function ( e ) {
					// for jquerygeo's exception handling
					if ( supportTouch && ( !this._multiTouchAnchor || !this._multiTouchAnchor[0] ) ) {
						return;
					}

					if ( !isMove
							&& ( new Date().getTime() - startTime ) > self._TOUCHHOLDTIME
								&& !this._isMultiTouch ) {
						if ( self._mouseDown && eventClone ) {
							self._trigger( "taphold", eventClone, {
								x : eventClone.pageX,
								y : eventClone.pageY
							});
						}
					}
					self._mouseDown = false;
					geomapOrigin._dragTarget_touchstop.call( this, e );
				},

				_refreshDrawing: function () {
					// for jquerygeo's exception handling
					if ( this._$drawContainer && this._$drawContainer.hasOwnProperty( "geographics" ) ) {
						geomapOrigin._refreshDrawing.call( this );
					}
				}
			});

			$.extend( geographics, {
				drawPoint : function ( coordinates, style ) {
					var currentGeographics = this,
						option = self.options,
						context,
						marker,
						image,
						width,
						height,
						markerColor;

					style = this._getGraphicStyle( style );

					if ( !coordinates || isNaN( coordinates[0] ) || isNaN( coordinates[1] ) ) {
						return;
					}

					if ( !option.useMarker ) {
						geographicsOrigin.drawPoint.call( this, coordinates, style );
						return;
					}

					context = this._context;

					if ( style.markerSrc ) {
						marker = $( new Image() );
						width = ( style.markerWidth ) ? parseInt( style.markerWidth, 10 ) : parseInt( style.width, 10 );
						height = ( style.markerHeight ) ? parseInt( style.markerHeight, 10 ) : parseInt( style.height, 10 );
						coordinates[0] -= width / 2;
						coordinates[1] -= height;
						marker.one( "load", function () {
							context.drawImage( marker[0], coordinates[0], coordinates[1], width, height );
							currentGeographics._end();
						}).attr( "src", style.markerSrc );
					} else {
						markerColor = style.markerColor || "red";
						marker = self._markerList[ markerColor ];

						if ( !marker ) {
							geographicsOrigin.drawPoint.call( this, coordinates, style );
							return;
						}

						coordinates[0] += parseInt( marker.css( "margin-left" ), 10 );
						coordinates[1] += parseInt( marker.css( "margin-top" ), 10 );
						width = ( style.markerWidth ) ? parseInt( style.markerWidth, 10 ) : parseInt( marker.css( "width" ), 10 );
						height = ( style.markerHeight ) ? parseInt( style.markerHeight, 10 ) : parseInt( marker.css( "height" ), 10 );

						if ( marker[0].src !== self._getNativeURL( marker.css( "backgroundImage" ) ) ) {
							marker.one( "load", function () {
								context.drawImage( marker[0], coordinates[0], coordinates[1], width, height );
							}).attr( "src", self._getNativeURL( marker.css( "backgroundImage" ) ) );
						} else {
							context.drawImage( marker[0], coordinates[0], coordinates[1], width, height );
						}
					}
				}
			});
		},

		_convertOption: function ( options ) {
			var self = this,
				tempValue,
				opt = $.extend( true, {}, self._geomap.options, options ),
				convertNumberAll = function ( name ) {
					if ( typeof opt[ name ] !== "string" ) {
						return;
					}
					opt[ name ] = opt[ name ].split( ',' );
					$.each( opt[ name ], function ( i ) {
						var member = this;
						$.trim( member );
						opt[ name ][ i ] = parseFloat( member, 10 );
					});
				};

			$.each( options, function ( key, value ) {
				if ( !value ) {
					delete opt[ key ];
				}

				if ( key === "servicesProvider" ) {
					opt = $.extend( opt, { services : self._supportedSevices[value] || self._supportedSevices.osm } );
					opt.zoomMin = 0;
					opt.zoomMax = 18;
					opt.tilingScheme.levels = 19;
				}

				if ( key === "zoom" ) {
					value = parseInt( value, 10 );
				}
			});

			convertNumberAll( "center" );
			convertNumberAll( "bbox" );
			convertNumberAll( "bboxMax" );

			return opt;
		},

		_setOptionState: function ( key, value ) {
			var self = this;

			switch (key) {
			case "zoom" :
				self._updateZoomState( value );
				break;
			}

			self._updateScaleState();
		},

		_setOption: function ( key, value ) {
			var self = this,
				geomap = self._geomap;

			geomap._setOption( key, value );
			$.Widget.prototype._setOption.apply( self, arguments );
		},

		_createControl: function () {
			var self = this,
				$view = self.element,
				zoomControl = $( "<div class='ui-mapview-control ui-mapview-zoom-control'></div>" ),
				zoomPlus = $( "<div class='ui-button ui-button-plus'></div>" ),
				zoomBar = $( "<div class='ui-zoom-bar'></div>" ),
				zoomGuide = $( "<span class='ui-zoom-guide'></span>" ),
				zoomValue = $( "<span class='ui-zoom-value'></divspan" ),
				zoomHandle = $( "<span class='ui-zoom-handle'></span>" ),
				zoomMinus = $( "<div class='ui-button ui-button-minus'></div>" ),
				scaleControl = $( "<div class='ui-mapview-control ui-mapview-scale-control'></div>" ),
				scaleLineTop = $( "<div class='ui-scaleline-top'></div>" ),
				scaleLineBottom = $( "<div class='ui-scaleline-bottom'></div>" ),
				marker = $( "<img></img>" ),
				markerCopy,
				markerColors = ["red", "blue", "gray", "purple", "yellow"],
				markerSrc,
				i,
				className;

			if ( !self.options.control ) {
				return;
			}

			for ( i = 0; i < markerColors.length; i += 1 ) {
				className = "ui-mapview-marker-" + markerColors[i];
				marker.addClass( className );
				markerCopy = marker.clone();
				$view.append( markerCopy );
				markerSrc = self._getNativeURL( markerCopy.css( "backgroundImage" ) );
				markerCopy.attr( "src", markerSrc ).css( "display", "none" );
				self._markerList[ markerColors[i] ] = markerCopy;
				marker.removeClass( className );
			}

			zoomBar.append( zoomGuide ).append( zoomValue ).append( zoomHandle );
			zoomControl.append( zoomPlus ).append( zoomBar ).append( zoomMinus );
			scaleControl.append( scaleLineTop ).append( scaleLineBottom );

			$view.append( zoomControl ).append( scaleControl );
		},

		_addEvent: function () {
			var self = this,
				$view = self.element,
				geomap = self._geomap,
				zoomBar = $view.find( "div.ui-zoom-bar" ),
				zoomGuide = zoomBar.children( "span.ui-zoom-guide" ),
				zoomPlus = $view.find( "div.ui-button-plus" ),
				zoomMinus = $view.find( "div.ui-button-minus" );

			$( document ).unbind( ".mapview" ).bind( "pagechange.mapview", function ( e ) {
				var $page = $( e.target ),
					widget = $page.find( ".ui-mapview" );
				if ( $page.find( ".ui-mapview" ).length > 0 ) {
					widget.mapview( "resize" );
				}
			});

			$( window ).unbind( ".mapview" ).bind( "resize.mapview orientationchange.mapview", function ( e ) {
				$( e.target ).find( ".ui-mapview" ).mapview( "resize" );
			});

			$view.bind( "geomapshape.mapview", function ( e, geo ) {
				if ( geo.type === "Point" ) {
					self.append( geo );
				}
				self._trigger( "shape", e, geo );
			}).bind( "geomapmove.mapview", function ( e, geo ) {
				self._trigger( "move", e, geo );
			}).bind( "geomapclick.mapview", function ( e, geo ) {
				self._trigger( "click", e, geo );
			}).bind( "geomapdbclick.mapview", function ( e, geo ) {
				self._trigger( "dbclick", e, geo );
			}).bind( "geomapbboxchange.mapview", function ( e, geo ) {
				self._trigger( "bboxchange", e, geo );
				self.options.zoom = geomap._options.zoom;
				self._updateZoomState( self.options.zoom );
				self._updateScaleState();
			});

			zoomBar.bind( "vmousedown.mapview", function ( e ) {
				var baseY = e.clientY,
					zoomGuideTop = zoomGuide.offset().top,
					zoomGuideHeight = zoomGuide.height(),
					currentZoom = 1 - ( baseY - zoomGuideTop ) / zoomGuideHeight;

				self._setZoomLevel( currentZoom );

				e.preventDefault();
				e.stopPropagation();

				$( document ).bind( "vmousemove.mapview", function ( e ) {
					var currentY = e.clientY,
						currentZoom = 1 - ( currentY - zoomGuideTop ) / zoomGuideHeight;

					self._setZoomLevel( currentZoom );

					e.preventDefault();
					e.stopPropagation();
				}).bind( "vmouseup.mapview", function () {
					$( document ).unbind( "vmousemove.mapview vmouseup.mapview" );
				});
			});

			zoomPlus.bind( "vclick.mapview", function ( e ) {
				self.zoom( +1 );
				e.preventDefault();
				e.stopPropagation();
			});

			zoomMinus.bind( "vclick.mapview", function ( e ) {
				self.zoom( -1 );
				e.preventDefault();
				e.stopPropagation();
			});
		},

		_updateZoomState: function ( value, isNormalize ) {
			var self = this,
				$view = self.element,
				geomap = self._geomap,
				zoomBar = $view.find( "div.ui-zoom-bar" ),
				zoomGuide = zoomBar.children( ".ui-zoom-guide" ),
				zoomValue = zoomBar.children( ".ui-zoom-value" ),
				zoomHandle = zoomBar.children( ".ui-zoom-handle" ),
				handleHeight = zoomHandle.height(),
				zoomGuideHeight = zoomGuide.height(),
				handleMarginTop = 0,
				minLevel = geomap._options.zoomMin,
				maxLevel = geomap._options.zoomMax,
				zoomGuideTop = 0,
				zoomrate = 1;

			if ( zoomBar.length === 0 ) {
				return;
			}

			if ( !isNormalize ) {
				value = ( value < minLevel ) ? minLevel : ( value > maxLevel ) ? maxLevel : value;
			}

			zoomrate = 1 - ( isNormalize ? value : ( ( value - minLevel ) / ( maxLevel - minLevel ) ) );

			zoomGuideTop = parseInt( zoomGuide.offset().top, 10 );
			handleMarginTop = parseInt( zoomGuideHeight * zoomrate, 10 ) - parseInt( handleHeight / 2, 10 );
			zoomHandle.css( "margin-top", handleMarginTop );
			zoomValue.height( parseInt( zoomGuideHeight * zoomrate, 10 ) );

			self._trigger( "zoomchange", window.event, { zoomlevel : value } );
		},

		_setZoomLevel: function ( value ) {
			var self = this,
				geomap = self._geomap,
				maxLevel = geomap._options.zoomMax;

			value = ( value < 0 ) ? 0 : ( value > 1 ) ? 1 : value;
			geomap._setZoom.call( this._geomap, value * maxLevel, false, true );
		},

		_updateScaleState: function () {
			var self = this,
				$view = self.element,
				units = self._METERS_PER_UNIT,
				scaleControl = $view.find( "div.ui-mapview-scale-control" ),
				scaleLineTop = scaleControl.find( "div.ui-scaleline-top" ),
				scaleLineBottom = scaleControl.find( "div.ui-scaleline-bottom" ),
				basePoint = self._geomap._toMap( [ 0, 0 ] ),
				maxPoint = self._geomap._toMap( [ 100, 0 ] ),
				measureShape = {
					type : "LineString",
					coordinates : [ basePoint, maxPoint ]
				},
				maxLength =  $.geo.length( measureShape, true ),
				roundValue = self._getScaleLineDisplayLength( maxLength ),
				topWidth = 0,
				bottomWidth = 0,
				topValue = 0,
				bottomValue = 0,
				topUnit = "m",
				bottomUnit = "ft";

			if ( roundValue > 10000 ) {
				topUnit = "km";
				bottomUnit = "mi";
			}

			topValue = parseInt( roundValue * units[ topUnit ], 10 );
			bottomValue = self._getScaleLineDisplayLength( maxLength *  units[ bottomUnit ] );
			topWidth = roundValue * 100 / maxLength;
			bottomWidth = bottomValue * 100 / maxLength / units[ bottomUnit ];

			scaleLineTop.text( topValue + topUnit ).width( topWidth );
			scaleLineBottom.text( bottomValue + bottomUnit ).width( bottomWidth );
		},

		_getScaleLineDisplayLength: function ( maxLength ) {
			var exponent = parseInt( Math.log( maxLength ) / Math.log( 10 ), 10 ),
				multiple = Math.pow( 10, exponent ),
				firstDigit = parseInt( maxLength / multiple, 10 ),
				lineLength = ( ( firstDigit > 5 ) ? 5 : ( ( firstDigit > 2 ) ? 2 : 1 ) );

			return lineLength * multiple;
		},

		_getNativeURL: function ( url ) {
			var markerUriExp = /url\(*/;
			if ( markerUriExp.test( url ) ) {
				url = url.replace( markerUriExp, "" ).replace( /\)$/, "" );
			}
			return url;
		},

		toMap: function ( p, isGeodetic ) {
			if ( typeof isGeodetic === "undefined" ) {
				isGeodetic = true;
			}

			return this._geomap[ ( isGeodetic ? "toMap" : "_toMap" ) ].call( this._geomap, p );
		},

		toPixel: function ( p, isGeodetic ) {
			if ( typeof isGeodetic === "undefined" ) {
				isGeodetic = true;
			}

			return this._geomap[ ( isGeodetic ? "toPixel" : "_toPixel" ) ].call( this._geomap, p );
		},

		opacity: function ( value ) {
			this._geomap.opacity.apply( this._geomap, arguments );
		},

		zoom: function ( numberOfLevels ) {
			if ( numberOfLevels ) {
				this.options.zoom += numberOfLevels;
				this._geomap._setZoom.call( this._geomap, this.options.zoom, false, true );
			}
		},

		refresh: function () {
			this._geomap.refresh.call( this._geomap );
			this._updateZoomState( this.options.zoom );
		},

		resize: function () {
			this._geomap.resize.call( this._geomap );
			this.refresh();
		},

		append: function ( shape, style, label, refresh ) {
			this._geomap.append.apply( this._geomap, arguments );
		},

		empty: function ( refresh ) {
			this._geomap.empty.apply( this._geomap, arguments );
		},

		find: function ( selector, pixelTolerance ) {
			return this._geomap.find.call( this._geomap, selector, pixelTolerance  );
		},

		remove: function ( shape, refresh ) {
			this._geomap.remove.apply( this._geomap, arguments );
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
		$( ":jqmData(role='mapview')" ).mapview();
	});

} ( jQuery, document, window ) );