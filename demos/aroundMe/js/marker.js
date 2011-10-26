
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
        if (!div) 
        {
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
            if (gSource == 'google')
            {
                markerPointer = 14;
                markerPointerHeight = 42;
            }
            else if (gSource == 'foursquare')
            {
                markerPointer = 14;
                markerPointerHeight = 42;
            }
            else
            {
            }
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


