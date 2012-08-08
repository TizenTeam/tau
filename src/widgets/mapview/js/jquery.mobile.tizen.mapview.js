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
 *		location ( string, function )
 *			: The location method can move to specific location by location name.
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

		_geomap: $.geo.geomap.prototype,
		_METERS_PER_UNIT: {
			"m" : 1.0,
			"km" : 0.0001,
			"ft" : 3.2808399,
			"mi" : 0.000621371192
		},
		_supportedSevices: [
			// OSM
			[ {
				"class": "osm",
				type: "tiled",
				src: function ( view ) {
					return "http://tile.openstreetmap.org/" + view.zoom + "/" + view.tile.column + "/" + view.tile.row + ".png";
				},
				attr : "&copy; OpenStreetMap &amp; contributors, CC-BY-SA"
			} ],
			// Mapquest-open
			[ {
				"class" : "mapquest-open",
				type : "tiled",
				src : function ( view ) {
					return "http://otile" + ( ( view.index % 4 ) + 1 ) + ".mqcdn.com/tiles/1.0.0/osm/" + view.zoom + "/" + view.tile.column + "/" + view.tile.row + ".png";
				},
				attr : "<p>Tiles Courtesy of <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png'></p>"
			} ]
		],
		_markerList : {},

		_createWidget: function ( options, element ) {
			var self = this,
				geomap = self._geomap;

			$.data( element, this.widgetName, this );
			this.element = $( element );
			this.options = $.extend( true, {},
				this.options,
				this._getCreateOptions(),
				options );

			this.element.bind( "remove." + this.widgetName, function () {
				self.destroy();
			});

			self._redefineMethods( element );
			geomap._createWidget.apply( geomap, arguments );
			self.options  = self._convertOption( self.options );
			geomap._setOptions( self.options );
		},

		_create: function () {
			var self = this,
				$view = self.element;

			if ( !$view.hasClass( "geo-map" ) || $view.hasClass( "ui-mapview" ) ) {
				return;
			}

			$view.addClass( "ui-mapview" );

			self._createControl();
			self._addEvent();
		},

		_redefineMethods: function ( element ) {
			var self = this,
				geomap = self._geomap,
				originCreate = geomap._create,
				originSetOption = geomap._setOption,
				originSetZoom = geomap._setZoom,
				originTouchstart = geomap._eventTarget_touchstart,
				originTouchmove = geomap._dragTarget_touchmove,
				originTouchend = geomap._dragTarget_touchstop,
				originRefreshDrawing = geomap._refreshDrawing,
				geographics = $.geo.geographics.prototype,
				originDrawPoint = geographics.drawPoint,
				eventClone = {},
				supportTouch = $.support.touch,
				startTime = 0,
				isMove = false;

			geomap._create = function () {
				originCreate.call( this );
				self._create.call( self );
			};

			geomap._setOption = function ( key, value, refresh ) {
				var tempTilingScheme;

				if ( key === "servicesProvider" ) {
					key = "services";
					value = ( value === "mapquest-open" ) ? self._supportedSevices[1] : self._supportedSevices[0];
				}

				if ( key === "tileWidth" ) {
					tempTilingScheme = this._options.tilingScheme;
					tempTilingScheme.tileWidth = tempTilingScheme.tileHeight = parseInt( value, 10 );
					key = "tilingScheme";
					value = tempTilingScheme;
				}

				originSetOption.call( this, key, value, refresh );
				self._setOptionState.call( self, key, value );
			};

			geomap._setZoom = function ( value, trigger, refresh ) {
				originSetZoom.call( this, value, trigger, refresh );
				self.options.zoom = value;
				self._updateZoomState( this._options.zoom );
				self._updateScaleState();
			};

			geomap._eventTarget_touchstart = function ( e ) {
				eventClone = ( supportTouch ? e.originalEvent.targetTouches[0] : e );
				startTime = new Date().getTime();
				isMove = false;
				originTouchstart.call( this, e );
			};

			geomap._dragTarget_touchmove = function ( e ) {
				// for jquerygeo's exception handling
				if ( supportTouch && ( !this._multiTouchAnchor || !this._multiTouchAnchor[0] ) ) {
					return ;
				}

				isMove = true;
				originTouchmove.call( this, e );
			};

			geomap._dragTarget_touchstop = function ( e ) {
				// for jquerygeo's exception handling
				if ( supportTouch && ( !this._multiTouchAnchor || !this._multiTouchAnchor[0] ) ) {
					return;
				}

				if ( !isMove && ( new Date().getTime() - startTime ) > 750 && !this._isMultiTouch ) {
					if ( !this._mouseDown ) {
						e.currentTarget = this._$eventTarget;
						this._eventTarget_touchstart( e );
					}
					if ( eventClone ) {
						self._trigger( "taphold", eventClone, {
							x : eventClone.pageX,
							y : eventClone.pageY
						});
					}
				}
				originTouchend.call( this, e );
			};

			geomap._refreshDrawing = function () {
				// for jquerygeo's exception handling
				if ( this._$drawContainer.hasOwnProperty( "geographics" ) ) {
					originRefreshDrawing.call( this );
				}
			};

			geographics.drawPoint = function ( coordinates, style ) {
				var option = self.options,
					context,
					marker,
					image,
					width,
					height,
					markerColor;

				if ( !coordinates || isNaN( coordinates[0] ) || isNaN( coordinates[1] ) ) {
					return;
				}

				if ( !option.useMarker ) {
					originDrawPoint.call( this, coordinates, style );
					return;
				}

				context = this._context;
				markerColor = ( style && style.markerColor ) ? style.markerColor : "red";
				marker = self._markerList[ markerColor ];

				coordinates[0] += parseInt( marker.css( "margin-left" ), 10 );
				coordinates[1] += parseInt( marker.css( "margin-top" ), 10 );
				width = parseInt( marker.css( "width" ), 10 );
				height = parseInt( marker.css( "height" ), 10 );

				if ( marker[0].src !== self._getNativeURL( marker.css( "backgroundImage" ) ) ) {
					marker.one( "load", function () {
						context.drawImage( marker[0], coordinates[0], coordinates[1], width, height );
					});
					marker[0].src =  self._getNativeURL( marker.css( "backgroundImage" ) );
				} else {
					context.drawImage( marker[0], coordinates[0], coordinates[1], width, height );
				}
			};
		},

		_convertOption: function ( options ) {
			var opt = $.extend( {}, options ),
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

			$( document ).bind( "pagechange.mapview", function ( e ) {
				var $page = $( e.target );
				if ( $page.find( $view ).length > 0 ) {
					self.resize();
				}
			});

			$( window ).bind( "resize.mapview orientationchange.mapview", function ( e ) {
				self.resize();
			});

			$view.bind( "geomapshape.mapview", function ( e, ui ) {
				if ( ui.type === "Point" ) {
					self.append( ui );
				}
				self._trigger( "shape", e );
			}).bind( "geomapmove.mapview", function ( e, ui ) {
				self._trigger( "move", e );
			}).bind( "geomapclick.mapview", function ( e, ui ) {
				self._trigger( "click", e );
			}).bind( "geomapdbclick.mapview", function ( e, ui ) {
				self._trigger( "dbclick", e );
			}).bind( "geomapbboxchange.mapview", function ( e, ui ) {
				self._trigger( "bboxchange", e );
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
				maxLevel = geomap._options.tilingScheme.levels - 1,
				zoomGuideTop = 0,
				zoomrate = 1;

			if ( zoomBar.length === 0 ) {
				return;
			}

			if ( !isNormalize ) {
				value = ( value < 0 ) ? 0 : ( value > maxLevel ) ? maxLevel : value;
			}

			zoomrate = 1 - ( isNormalize ? value : ( value / maxLevel ) );

			zoomGuideTop = parseInt( zoomGuide.offset().top, 10 );
			handleMarginTop = parseInt( zoomGuideHeight * zoomrate, 10 ) - parseInt( handleHeight / 2, 10 );
			zoomHandle.css( "margin-top", handleMarginTop );
			zoomValue.height( parseInt( zoomGuideHeight * zoomrate, 10 ) );
		},

		_setZoomLevel: function ( value ) {
			var self = this,
				geomap = self._geomap,
				maxLevel = geomap._options.tilingScheme.levels - 1;

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

		destroy: function () {
			this._geomap.destroy.call( this._geomap );
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
		},

		resize: function () {
			this._geomap.resize.call( this._geomap );
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
		},

		location: function ( name, callback ) {
			var self = this,
				geomap = self._geomap,
				serviceURL = null;

			if ( !name || typeof name !== "string" ) {
				return;
			}

			if ( self.options.serviceProvider === "mapquest-open" ) {
				serviceURL = "http://open.mapquestapi.com/nominatim/v1/search";
			} else {
				serviceURL = "http://nominatim.openstreetmap.org/search";
			}

			$.ajax({
				url : serviceURL,
				data : {
					format : "json",
					q : name
				},
				dataType : "jsonp",
				jsonp : "json_callback",
				success : function ( results ) {
					if ( results.length > 0 ) {
						self.option( "center", [
							parseFloat( results[0].lon, 10 ),
							parseFloat( results[0].lat, 10 )
						]);
					}

					if ( callback ) {
						callback( results );
					}
				}
			});
		}
	});

	$( document ).bind( "pagecreate create", function ( e ) {
		$( ":jqmData(role='mapview')" ).mapview();
	});

} ( jQuery, document, window ) );