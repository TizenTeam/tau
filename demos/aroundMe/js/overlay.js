var overlay;

function setSearchLocation( locations, selected ) {
	var overlayImage;	
    var markerImage;
    var markerPoint;
    var markerImageWidth;
    var markerImageHeight;
    var index = 0;
    var validChoose = false;

    if ( overlay ) {
        overlay.setMap(null);
        overlay = null;
    }

    if ( searchMarker ) {
        var arrayLen = searchMarker.length;
        while ( index < arrayLen ) {
            searchMarker[index].setMap(null);
            searchMarker[index] = null;
            index++;
        }
        
        searchMarker.splice( 0 );
        index = 0;
    }

    if ( searchInfoWindow ) {
        var arrayLen = searchInfoWindow.length;
        while (index < arrayLen) {
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

    while ( index < count ) {
        var currentLoc = locations[index];	
        isShow = false;
        if ( index == selected ) {
            isShow = true;
        }
        switch ( index ) {
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

		var myLatLng = new google.maps.LatLng(currentLoc.lat, currentLoc.lng);
		var locName = currentLoc.title;
		var locAddress = currentLoc.streetAddress;
		searchInfoWindow[index] = new google.maps.OverlayView();//CustomInfoWindow(myLatLng, locName, locAddress, isShow, index);
		searchMarker[index] = new CustomMarker(searchInfoWindow[index], myLatLng, indexText);	
		
		google.maps.event.addListener(searchMarker[index], 'click', searchMarker[index].toggle);

		index++;
    }
}

function CustomMarker(infowindow, latlng, index) 
{
    this.latlng_ = latlng;
    this.index_ = index;
    this.infowindow_ = infowindow;
    this.div_ = null;
    this.setMap(gMap);
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = 
    function() 
    {
        var me = this;
        // Check if the div has been created.
        var div = this.div_;
        if (!div)   {
            // Create a overlay text DIV
            div = this.div_ = document.createElement('DIV');
            // Create the DIV representing our CustomMarker
            div.style.border = "none";
            div.style.position = "absolute";
            div.style.paddingLeft = "0px";

            var img = document.createElement('img');
            img.setAttribute("id", "searchMarker");
			img.src = "image/Aroundme_icon_pin.png";

            div.appendChild(img); 

            var index = document.createElement("DIV");
            index.setAttribute("id", "searchMarkerText");
            index.innerHTML = this.index_;
            div.appendChild(index);

            // Then add the overlay to the DOM
            var panes = this.getPanes();
            panes.overlayImage.appendChild(div);			

            google.maps.event.addDomListener(div, "click", function(event) {google.maps.event.trigger(me, "click")});
        }

        // Position the overlay 
        var overlayProjection = this.getProjection();
        var point = overlayProjection.fromLatLngToDivPixel(this.latlng_);
        if (point) 
        {
            var markerPointer = 0;
            var markerPointerHeight = 0;

            markerPointer = 14;
            markerPointerHeight = 42;
            div.style.left = point.x - markerPointer + 'px';
            div.style.top = point.y - markerPointerHeight + 'px';			
        }		
    };

CustomMarker.prototype.remove = 
    function() 
    {
        // Check if the overlay was on the map and needs to be removed.
        if (this.div_) 
        {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
        }
    };

CustomMarker.prototype.hide = 
    function() 
    {	
        //jsPrint("\n CustomMarker.prototype.hide is invoked \n");
        if (this.infowindow_) 
        {
            this.infowindow_.hide();
        }
    };

CustomMarker.prototype.show = 
    function() 
    {
        //jsPrint("\n CustomMarker.prototype.show is invoked \n");
        if (this.infowindow_) 
        {
            this.infowindow_.show();
        }
    };

CustomMarker.prototype.toggle = 
    function() 
    {
        //jsPrint("\n CustomMarker.prototype.toggle is invoked \n");
        if (this.infowindow_) 
        {
            this.infowindow_.toggle();
        }
    };


