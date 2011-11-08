Map = {
	map : undefined,

	init : function( base ) {
		this.map = $(base).gmap();
	},

	showListMap : function( list ) {
		// because jquery data stores its data into $.cache, 
		// save somewhere else before change pages
		var li = list.find('li');
		var ll = new Array();
		for ( var i = 0; i < li.length; i++ ) {
			ll.push( $(list).data( $( li[i] ).attr("id") ) );
		}

		var title = $.mobile.activePage.find( ".ui-title" ).text();
		$("#mapTitle").text( title );

		$.mobile.changePage("#mapPage");
		
		this.map.gmap( 'clear', 'markers' ); // reset marker
		this.map.gmap( 'set', 'bounds', undefined );	// reset bounds
		this.map.gmap( 'refresh' );
	
		for ( var i = 0; i < ll.length; i++ ) {
			var marker = new google.maps.Marker( {
				'icon': 'image/maps_marker.png',
				'title': ll[i].name,
				'position' : ll[i].geometry.location,
				'detailReference' : ll[i].reference // custom
			});

			google.maps.event.addListener( marker, 'click', function() {
				Detail.getDetailPage( this.detailReference );
			} );

			this.map.gmap( 'addMarker', marker );
			this.map.gmap( 'addBounds', ll[i].geometry.location );
		}


		this.map.gmap( 'addMarker', {
			'position' : new google.maps.LatLng( ME_LOCATION_LAT, ME_LOCATION_LNG ),
			'icon' : 'image/11Aroundme_icon_refresh.png'
		});
	}, 

	getDetail : function( reference, callback ) {
		this.map.gmap( 'placesDetail', { 'reference': reference }, callback );
	}, 

	placesSearch : function( query, callback ) {
		if ( query.location ) {
			this.map.gmap( 'placesSearch', query, callback );
		} else {
			function realSearch( lat, lng ) {
				meLocation = new google.maps.LatLng( lat, lng );
				query.location = meLocation;
				Map.map.gmap( 'placesSearch', query, callback );
			}
			Map.getCurrentLocation( realSearch, null );
		}
	},

	getCurrentLocation : function( successcb, errorcb ) {
		
		successcb( ME_LOCATION_LAT, ME_LOCATION_LNG );	//@FIXME FOR TEST
		return;//@FIXME for test
		console.log("ahahaha");
		if ( navigator.geolocation ) {
			function successCallback( position ) {
				console.log("succeed");
				if ( successcb ) {
					successcb( position.coords.latitude, position.coords.longitude );
				}
			}
		
			function errorCallback() {
				console.log("failed");
				//alert("[Location]Response Error");
				if ( errorcb ) {
					errorcb();
				}
			}
			console.log("getCurrent");
			navigator.geolocation.getCurrentPosition( successCallback, errorCallback );
		} else {
			errorcb();
		}	
	},

	calcDistance : function( from, to ) {
		var distance = google.maps.geometry.spherical.computeDistanceBetween( from, to );
		distance = Math.floor( distance );
		if ( distance > 999 ) { 
			distance = Math.round( distance / 1000 );
			return distance + "km";
		} else {
			return distance + "m";
		}
	}

}
