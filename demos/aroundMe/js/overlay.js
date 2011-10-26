
var overlay;

//Get the Address with Google Geocoder API.
function getGeocoderAddress(latlng, address) 
{
    var geocoder = new google.maps.Geocoder();
    if (geocoder) 
    {
        //jsPrint("[getGeocoderAddress] geocoder is available");

        geocoder.geocode({	'latLng': latlng}, 
                function(results, status) 
                {
                if(status == google.maps.GeocoderStatus.OK) 
                {
                    if(results[0]) 
                    {
                        address.innerHTML = results[0].formatted_address;
                    } 
                    else 
                    {
                        //jsPrint("[Geocoder]No results found");
                    }
                }
                else 
                {
                    //jsPrint("Geocoder failed due to: " + status);
                }
            });
    }
}

//Set marker and show the corresponding overlay UI for AUL mash up cases.
function setMarkers(GoogleMapsApp, locations) 
{
    //jsPrint("setMarkers is invoked!");
    var markerImage;
    var markerImageWidth;
    var markerImageHeight;
    var markerPoint;

    var person = locations[0];
    if(overlay)
    {
        overlay.setMap(null);
        overlay = null;
    }
    if(GoogleMapsApp.marker)
    {
        GoogleMapsApp.marker.setMap(null);
        GoogleMapsApp.marker = null;
    }	

    var myLatLng = new google.maps.LatLng(person[1], person[2]);		

    var image = new google.maps.MarkerImage(markerImage,	     
    new google.maps.Size(markerImageWidth, markerImageHeight),	     
    new google.maps.Point(0, 0),	     
    new google.maps.Point(markerPoint, markerImageHeight),
    new google.maps.Size(markerImageWidth, markerImageHeight));

    GoogleMapsApp.marker = new google.maps.Marker({
        position: myLatLng,
        map: gMap,
        icon:image,
        });

    google.maps.event.addListener( GoogleMapsApp.marker, 
        'click', 
        function() 
        {
            SLPGoogleMapObject.PlaySound();
            if(overlay)
            {
                overlay.setMap(null);
                overlay = null;
            }
            else
            {
                var myLatLng = new google.maps.LatLng(person[1], person[2]);
                gMap.setCenter(myLatLng);
                overlay = new AULOverlay(myLatLng, person, gMap);
            }
        });	
}

//Set marker for the current locations. (GPS is blue dot, CellId is gray dot)
function setCurrentLocation(GoogleMapsApp, locations) 
{		
    var markerImage;
    var markerPoint;
    var markerImageWidth;
    var markerImageHeight;
    var currentLoc = locations[0];

    /*
    var shadow;
    var shadowImage;
    var shadowPoint;
    var shadowImageWidth;
    var shadowImageHeight;
    */

    if(curmarker)
    {
        curmarker.setMap(null);
        curmarker = null;
    }

    var myLatLng = new google.maps.LatLng(currentLoc[1], currentLoc[2]);

    var image = new google.maps.MarkerImage(markerImage,	     
    new google.maps.Size(markerImageWidth, markerImageHeight),	     
    new google.maps.Point(0, 0),	     
    new google.maps.Point((markerImageWidth + 1)/2, (markerImageHeight + 1)/2),
    new google.maps.Size(markerImageWidth, markerImageHeight));

    if(currentLoc[7] == false)
    {
        curmarker = new google.maps.Marker({
            position: myLatLng,
            map: gMap,
            //shadow: shadow,
            icon: image,
            });		
    }
    else
    {
        curmarker = new google.maps.Marker({
            position: myLatLng,
            map: gMap,
            icon: image,
            });
    }

}

function setSearchLocation(locations, selected) 
{
    var overlayImage;	
    var markerImage;
    var markerPoint;
    var markerImageWidth;
    var markerImageHeight;
    var index = 0;
    var validChoose = false;

    if(overlay)
    {
        overlay.setMap(null);
        overlay = null;
    }

    if(searchMarker)
    {
        var arrayLen = searchMarker.length;
        while (index < arrayLen)
        {
            searchMarker[index].setMap(null);
            searchMarker[index] = null;
            index++;
        }
        
        searchMarker.splice(0);
        index = 0;
    }

    if(searchInfoWindow)
    {
        var arrayLen = searchInfoWindow.length;
        while (index < arrayLen)
        {
            searchInfoWindow[index].setMap(null);
            searchInfoWindow[index] = null;
            index++;
        }
        
        searchInfoWindow.splice(0);
        index = 0;
    }

    var count = locations.length;
    var indexText;
    var isShow = false;

    while(index < count)
    {
        var currentLoc = locations[index];	
        isShow = false;
        if(index == selected)
        {
            isShow = true;
        }
        switch(index)
        {
            case 0 : 
                indexText = "A";
                break;
            case 1 : 
                indexText = "B";
                break;
            case 2 : 
                indexText = "C";
                break;
            case 3 : 
                indexText = "D";
                break;
            case 4 : 
                indexText = "E";
                break;
            case 5 : 
                indexText = "F";
                break;
            case 6 : 
                indexText = "G";
                break;
            case 7 : 
                indexText = "H";
                break;

            default :
                indexText = "";
                break;
        }

		if (gSource == "google")
		{
        	var myLatLng = new google.maps.LatLng(currentLoc.lat, currentLoc.lng);
			var locName = currentLoc.title;
			var locAddress = currentLoc.streetAddress;
	        searchInfoWindow[index] = new CustomInfoWindow(myLatLng, locName, locAddress, isShow, index);
	        searchMarker[index] = new CustomMarker(searchInfoWindow[index], myLatLng, indexText);	

		}
		else 
		{
        	var myLatLng = new google.maps.LatLng(currentLoc.geolat, currentLoc.geolong);
			var locName = currentLoc.name;
			var locAddress = currentLoc.address?currentLoc.address:"";
	        searchInfoWindow[index] = new CustomInfoWindow(myLatLng, locName, locAddress, isShow, index);
	        searchMarker[index] = new CustomMarker(searchInfoWindow[index], myLatLng, indexText);		
		}


        google.maps.event.addListener(searchMarker[index], 'click', searchMarker[index].toggle);

        index++;
    }
}

