( function ( $, window ) {

	$( "#mapview-demo-page" ).bind( "pageshow", function ( e ) {
		var mapView = $( "#sampleMap" ),
			menuPopup = $( "#map_menu_popup" ),
			routeFromButton = $( "#routeFrom" ),
			routeToButton = $( "#routeTo" ),
			getAddressButton = $( "#getAddress" ),
			resultPopup = $( "#map_result_popup" ),
			closeButton = $( "#map_close_btn" ),
			targetPoint = null,
			routePoints = {
				from : null,
				to : null
			},
			measureRoute = function () {
				var measureShape, length, displayLength;

				measureShape = {
					type : "LineString",
					coordinates : [ routePoints.from.geometry.coordinates,
									routePoints.to.geometry.coordinates ]
				};

				length =  $.geo.length( measureShape, true );
				if ( length > 1000 ) {
					displayLength = ( length / 1000 ).toFixed( 6 ) + " km";
				} else {
					displayLength = length.toFixed( 6 ) + " m";
				}

				mapView.mapview( "append", measureShape, length.toFixed( 2 ) + "m" );
				resultPopup.find( "p" ).text( "Route distance = " +  displayLength );
				resultPopup.popup( "open" );
			},
			checkRoute = function ( role ) {
				menuPopup.popupwindow( "close" );

				if ( routePoints[ role ] ) {
					mapView.mapview( "remove", routePoints[ role ] );
					routePoints[ role ] = null;
				}

				routePoints[ role ] = {
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: mapView.mapview( "toMap", targetPoint, false )
					}
				};

				if ( role === "from" ) {
					mapView.mapview( "append", routePoints[ role ], {
						markerColor: "blue"
					});
				} else {
					mapView.mapview( "append", routePoints[ role ], {
						markerColor: "red"
					});
				}

				if ( routePoints.from && routePoints.to ) {
					measureRoute();
				}
			};

		mapView.bind( "mapviewtaphold", function ( e, position ) {
			var offset = mapView.offset(),
				pageX = position.x,
				pageY = position.y;

			targetPoint = [ pageX - offset.left, pageY - offset.top ];
			menuPopup.popupwindow( "open", pageX, pageY );
		});

		routeFromButton.bind( "vclick", function ( e ) {
			checkRoute( "from" );
		});

		routeToButton.bind( "vclick", function ( e ) {
			checkRoute( "to" );
		});

		getAddressButton.bind( "vclick", function ( e ) {
			var targetCoordinate = mapView.mapview( "toMap", targetPoint );

			menuPopup.popupwindow( "close" );

			$.ajax({
				url : "http://nominatim.openstreetmap.org/reverse",
				data : {
					format : "json",
					lat : String( targetCoordinate[1] ),
					lon : String( targetCoordinate[0] ),
					addressdetails : String( 1 )
				},
				dataType : "jsonp",
				jsonp : "json_callback",
				success : function ( results ) {
					mapView.mapview( "option", {
						center : targetCoordinate,
						zoom : 15
					});
					resultPopup.find( "p" ).text( results.display_name );
					resultPopup.popup( "open" );
				}
			});
		});

		closeButton.bind( "vclick", function ( e ) {
			resultPopup.popup( "close" );
		});

		resultPopup.bind( "popupafterclose", function ( e ) {
			resultPopup.find( "p" ).text( "" );
			mapView.mapview( "empty" );
			routePoints.from = routePoints.to = null;
		});
	});

} ( jQuery, window ) );
