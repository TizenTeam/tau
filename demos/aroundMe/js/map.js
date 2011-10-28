function HomeControl( controlDiv, map ) {
	
	// Set CSS styles for the DIV containing the control
	// Setting padding to 8 px will offset the control
	// from the edge of the map

	// Set CSS for the control interior
	var controlText = document.createElement('DIV');
	controlText.style.fontFamily = 'Helvetica Neue, sans-serif';
	controlText.style.textAlign = 'left';
	controlText.style.color = 'white';
	controlText.style.fontSize = '34px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	// Set me image and location info
	controlText.innerHTML = '<div id="meBG" style="width:100%;height:32px;border-width: 12px 11px 16px 11px; -webkit-border-image: url(image/00_list_alert_popup_bg.png) 12 11 16 11 repeat stretch;">' + 
				'<img id="meImage" style="position:relative;top:-5px;padding-left:2px;padding-right:10px;display:inline-block;" src="image/Aroundme_icon_refresh.png">' + 
				'<label id="meAddress"></label></div>';
	
	controlDiv.appendChild(controlText);

	// Setup the click event listeners: simply set the map to meButton
	google.maps.event.addDomListener(controlText, 'click', function()
    {
        function setMeLocation(lat,lng)
        {
            var currentLatLng = new google.maps.LatLng(lat, lng);

            if(gMeMarker)
            {
                gMeMarker.setMap(null);
                gMeMarker = null;
            }

            gMeMarker = new google.maps.Marker({
                            		position: currentLatLng,
                            		icon: gMeIcon, 
                            		map: gMap
                        		});

            gMeSearch = new GlocalSearch();
        	gMeSearch.setSearchCompleteCallback(null, OnMeAddress);
        	gMeSearch.execute(lat +", "+ lng);

        	setTimeout("hideMeInfo()",ME_DISPLAY_TIME);
            gMap.setCenter(currentLatLng);
        }

        getCurrentLocation(setMeLocation, null);
        
    });
}	
function showMapInfo() {
	if ( gMap == undefined ) {
		initGoogleMap();
	}
	setAutoZoom( gMap, gLocalSearch.results );
	setSearchLocation( gLocalSearch.results, gIndex );
	var selected = gLocalSearch.results[gIndex];
	gMap.setCenter( new google.maps.LatLng( parseFloat( selected.lat ), parseFloat( selected.lng ) ) );
}

// set search results in the map
function setAutoZoom(map,markers) {
	var i = markers.length;
	var bounds = new google.maps.LatLngBounds();

	if (gSource == "google") {
		while(i--) {
			bounds.extend(new google.maps.LatLng(markers[i].lat,markers[i].lng));
		}
	} else {
		while(i--) {
			bounds.extend(new google.maps.LatLng(markers[i].geolat,markers[i].geolong));
		}
	}
    gMap.fitBounds(bounds);

    if(gMap.getZoom() == 20) {
        gMap.setZoom(19);
    }   
}

function initGoogleMap() {
	if ( mapIsOk ) {
		return;
	}

	var zoomLevel = 13;
	
	gMap = new google.maps.Map( document.getElementById("map"), {
								center: meLocation,
								zoom: zoomLevel,
								disableDefaultUI: true,
								scrollwheel: false,
								mapTypeId: google.maps.MapTypeId.ROADMAP
							});
	
	var homeControlDiv = document.createElement( 'DIV' );
	$(homeControlDiv).addClass( "me_button" );
	var homeControl = new HomeControl( homeControlDiv, gMap );

	homeControlDiv.index = 1;
	gMap.controls[ google.maps.ControlPosition.BOTTOM_LEFT ].push( homeControlDiv );

	mapIsOk = true;
}

function OnMeAddress() {
	if (!gMeSearch.results) {   
        return;
    }
    var meStr = ((gMeSearch.results[0].streetAddress.length > 0) ? (gMeSearch.results[0].streetAddress + ", ") : "")
            + ((gMeSearch.results[0].city.length > 0) ? (gMeSearch.results[0].city + ", ") : "")
            + ((gMeSearch.results[0].region.length > 0) ? (gMeSearch.results[0].region + ", ") : "")
            + ((gMeSearch.results[0].country.length > 0) ? (gMeSearch.results[0].country) : "");

    if(meStr.lastIndexOf(",") == meStr.length - 2) {
        meStr = meStr.substr(0, meStr.length - 2);
    }
    
	var meName = gMeSearch.results[0].title;

	$("#meAddress").addClass("me_Address_info");
	$("#meAddress").text(meStr);
}

