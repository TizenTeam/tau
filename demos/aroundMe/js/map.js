Map = {
	map : undefined,

	init : function( base ) {
		this.map = $(base).gmap();
		$("#mapPage").bind( 'pageshow', function() {
			Map.map.gmap('refresh');
		});
	},

	setCenter : function( location, status ) {
		Map.map.gmap( 'setCenter', location.coords.latitude, location.coords.longitude );
	},

	showDetailMap: function( detail ) {
		console.log(detail);
		var title = $.mobile.activePage.find( ".ui-title" ).text();
		$("#mapTitle").text( title );

		$.mobile.changePage("#mapPage", { 
			'transition': 'flip' 
		});

		this.map.gmap( 'clear', 'markers' ); // reset marker
		this.map.gmap( 'set', 'bounds', undefined );	// reset bounds
		var marker = new google.maps.Marker( {
			'icon': 'image/maps_marker.png',
			'title': detail.name,
			'position' : new google.maps.LatLng( detail.geometry.location[0], detail.geometry.location[1] ),
			'detailReference' : detail.reference // custom
		});

		google.maps.event.addListener( marker, 'click', function() {
			Detail.getDetailPage( this.detailReference );
		} );
		
		this.map.gmap( 'addMarker', marker );
		this.map.gmap( 'addBounds', marker.position );

		
		this.map.gmap( 'addMarker', {
			'position' : meLocation,
			'icon' : 'image/11Aroundme_icon_refresh.png'
		});
		this.map.gmap( 'addBounds', meLocation );

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

		$.mobile.changePage("#mapPage", { 
			'transition' : 'flip'
		});
		
		this.map.gmap( 'clear', 'markers' ); // reset marker
		this.map.gmap( 'set', 'bounds', undefined );	// reset bounds
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
			'position' : meLocation,
			'icon' : 'image/11Aroundme_icon_refresh.png'
		});
		this.map.gmap( 'addBounds', meLocation );
	}, 

	getDetail : function( reference, callback ) {
		this.map.gmap( 'placesDetail', { 'reference': reference }, callback );
	}, 

	placesSearch : function( query, callback ) {
		if ( query.location ) {
			this.map.gmap( 'placesSearch', query, callback );
		} else {
			function realSearch( location, status ) {
				meLocation = new google.maps.LatLng( location.coords.latitude, location.coords.longitude );
				query.location = meLocation;
				Map.map.gmap( 'placesSearch', query, callback );
			}
			Map.getCurrentLocation( realSearch );
		}
	},

	getCurrentLocation : function( successcb, options ) {
		this.map.gmap( 'getCurrentPosition', successcb, options );
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
