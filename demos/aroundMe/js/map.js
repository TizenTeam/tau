Map = {
	map : undefined,

	init : function( base ) {
		this.map = $(base).gmap();
		$("#mapPage").bind( 'pageshow', function() {
			Map.map.gmap('refresh');
		});
	},

	setCenter : function( lat, lng ) {
		Map.map.gmap( 'setCenter', lat, lng );
	},

	showDetailMap: function( detail ) {
		console.log(detail);
		var title = $.mobile.activePage.find( ".ui-title" ).text();
		$("#mapTitle").text( title );

		$.mobile.changePage("#mapPage");

		this.map.gmap( 'clear', 'markers' ); // reset marker
		this.map.gmap( 'set', 'bounds', undefined );	// reset bounds
		var marker = new google.maps.Marker( {
			'icon': 'image/maps_marker.png',
			'title': detail.name,
			'position' : new google.maps.LatLng(detail.geometry.location.Oa, detail.geometry.location.Pa),
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

		$.mobile.changePage("#mapPage");
		
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
			Map.getCurrentLocation( realSearch );
		}
	},

	getCurrentLocation : function( successcb, options ) {
		if ( document.location.href.match(/debug=true/) ) {
			successcb( ME_LOCATION_LAT, ME_LOCATION_LNG );	// FOR TEST.
			return;
		}
		console.log("Warn: location api called, if you are at behind firewall, this won't be working correctly.");
		console.log("Warn: to solve above problem, add '?debug=true' after aroundMe's address.");
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
