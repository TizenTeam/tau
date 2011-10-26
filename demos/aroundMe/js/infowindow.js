
function CustomInfoWindow(latlng, name, address, isShow, index) 
{
    //alert("CustomInfoWindow is invoked");
    this.div_ = null;
	this.name_ = name;
	this.address_ = address;
	this.latlng_ = latlng;
	this.index_ = index;
	this.isShow_ = isShow;
    this.setMap(gMap);
}
initCustomInfoWindow();

function initCustomInfoWindow()
{
	CustomInfoWindow.prototype = new google.maps.OverlayView();
}

CustomInfoWindow.prototype.onAdd = 
    function() 
    {
        //overlay info window image.
        //var div = document.createElement('DIV');
        if (this.isOn_) return;

		var div = new ctxpopup("popupOverlayName" + this.name_, "ctxpop_mapstyle");
        this.div_ = div;

		var mybutton = new button("reveal", null, "test" + this.name_);
		//var sbbutton = new button("text1Style", "SearchBar_hideButton(this);", null);

		var infoWinName = document.createElement('DIV');
		var infoWinAddress = document.createElement('DIV');
		div.appendChild(infoWinName);
		div.appendChild(infoWinAddress);
		div.appendChild(mybutton);
		$(infoWinName).addClass("infowin_name");
		$(infoWinName).attr("id", "infoWinName");
		$(infoWinName).text(this.name_);

		$(infoWinAddress).addClass("infowin_address");		
		$(infoWinAddress).attr("id", "infoWinAddress");
		$(infoWinAddress).text(this.address_);

		$(mybutton).css("position", "absolute");
		$(mybutton).css("top", "15px");
		$(mybutton).css("left", "290px");
		$(mybutton).attr("href","detailview/detailview.html");

		$(mybutton).data("myindex",this.index_);
		
		$(mybutton).click(function(){
			//CustomInfoWindow.prototype.hide();
			//ginfoIndex = $(mybutton).data("myindex");
			gIndex = $(mybutton).data("myindex");
			
			//gIsFavoriteBtnOn = $(mybutton).data("isfavoriteon");			
			setDetailViewData();
			//showView("detailView");
		});

        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
    };

CustomInfoWindow.prototype.draw = 
    function() 
    {
        var overlayProjection = this.getProjection();
        var point = overlayProjection.fromLatLngToDivPixel(this.latlng_);
        var div = this.div_;
        var markerPointer = 0;
        var markerPointerHeight = 0;
        var bgHeight = 0;

		if (gSource == "google")
		{
			var xOffset=-144;
			var yOffset=-200;
		}
		else 
		{
			var xOffset=-144;
			var yOffset=-200;
		}
        div.style.left = point.x + xOffset + 'px';
        div.style.top = point.y + yOffset + 'px';

        if(this.isShow_ != true)
        {
            this.div_.style.visibility = "hidden";
            this.isShow_ = true;
        }
		div.style.position = 'absolute';
        div.style.zIndex = '100';
    };

CustomInfoWindow.prototype.onRemove = 
function() 
{
    //jsPrint("CustomInfoWindow.prototype.onRemove");
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

CustomInfoWindow.prototype.hide = 
function() 
{	
    //jsPrint("CustomInfoWindow.prototype.hide");
    if (this.div_) 
    {
        this.div_.style.visibility = "hidden";
    }
};

CustomInfoWindow.prototype.show = 
function() 
{
    //jsPrint("CustomInfoWindow.prototype.show");
    if (this.div_) 
    {
        this.div_.style.visibility = "visible";
    }
};

CustomInfoWindow.prototype.toggle = 
function() 
{
    //jsPrint("CustomInfoWindow.prototype.toggle");
    if (this.div_) 
    {
        if(this.div_.style.visibility == "hidden") 
        {
            var count = searchInfoWindow.length;
            var index = 0;

            while(index < count)
            {
                searchInfoWindow[index].hide();
                index++;
            }
            this.div_.style.visibility = "visible";
            gMap.setCenter(this.latlng_);
        } 
        else 
        {
            this.div_.style.visibility = "hidden";
        }
    }
};

function setDetailViewData()
{
	//TODO
	gDetailViewData = null;
	//addFavorite();
	setFavoriteIcon();
	if (gSource == "google")
	{
		if (gLocalSearch.results.length == 0) return;
		gDetailViewData = gLocalSearch.results[gIndex];//gIndex
		contactInfo.name=gDetailViewData.title;
		contactInfo.phonenumber=(gDetailViewData.phoneNumbers.length > 0)?gDetailViewData.phoneNumbers[0].number:"";

        contactInfo.address = ((gDetailViewData.streetAddress.length > 0) ? (gDetailViewData.streetAddress + ", ") : "")
            + ((gDetailViewData.city.length > 0) ? (gDetailViewData.city + ", ") : "")
            + ((gDetailViewData.region.length > 0) ? (gDetailViewData.region + ", ") : "")
            + ((gDetailViewData.country.length > 0) ? (gDetailViewData.country) : "");

        if(contactInfo.address.lastIndexOf(",") == contactInfo.address.length - 2)
        {
            contactInfo.address = contactInfo.address.substr(0, contactInfo.address.length - 2);
        }
        
		$("#InfoAddressDiv").text(contactInfo.address);
		$("#InfoTitleDiv").text(contactInfo.name);
		$("#detailViewNumber").text(contactInfo.phonenumber);

        if(contactInfo.phonenumber.length > 0)
        {
            $("#InfoNumberDiv").attr('href', "tel:" + contactInfo.phonenumber);
        }
        else
        {
            $("#InfoNumberDiv").attr('href', "#");
        }

        contactInfo.url = gDetailViewData.url;

        if(contactInfo.url.length > 0)
        {
            $("#moredetail").attr('href', contactInfo.url);
        }
        else
        {
            $("#moredetail").attr('href', "#");
        }
        
		$("#InfoDistanceDiv").text(gDistance[gIndex]);//gIndex
		$("#InfoCategoryDiv").text("");
		$("#InfoDetailsDiv").text("");
		var tmpSrc = gDetailViewData.staticMapUrl;
		tmpSrc = tmpSrc.replace("150x100", "480x230");
		$("#ImgStaticMap").attr("src", tmpSrc);
	}
	else if (gSource == "foursquare")
	{
		gDetailViewData = gFqSearch[gIndex];//gIndex
		contactInfo.name = gDetailViewData.name;
		contactInfo.phonenumber=(gDetailViewData.phone != undefined)?gDetailViewData.phone:"";

        contactInfo.address = ((gDetailViewData.address.length > 0) ? (gDetailViewData.address + ", ") : "")
            + ((gDetailViewData.city.length > 0) ? (gDetailViewData.city + ", ") : "")
            + ((gDetailViewData.state.length > 0) ? (gDetailViewData.state + ", ") : "");

        if(contactInfo.address.lastIndexOf(",") == contactInfo.address.length - 2)
        {
            contactInfo.address = contactInfo.address.substr(0, contactInfo.address.length - 2);
        }
        
		contactInfo.category=gDetailViewData.fullpathname;
		$("#InfoAddressDiv").text(contactInfo.address);
		$("#InfoTitleDiv").text(contactInfo.name);
		$("#detailViewNumber").text(contactInfo.phonenumber);

        if(contactInfo.phonenumber.length > 0)
        {
            $("#InfoNumberDiv").attr('href', "tel:" + contactInfo.phonenumber);
        }
        else
        {
            $("#InfoNumberDiv").attr('href', "#");
        }
/*
        contactInfo.url = gDetailViewData.url;

        if(contactInfo.url.length > 0)
        {
            $("#moredetail").attr('href', "http:" + contactInfo.url);
        }
        else
        {
            $("#moredetail").attr('href', "#");
        }
        */
        
		$("#InfoDistanceDiv").text(gDetailViewData.distance+"m");
		$("#InfoCategoryDiv").text(contactInfo.category);
		$("#InfoDetailsDiv").text("");
		//$("#ImgStaticMap").css("src", gDetailViewData.staticMapUrl);
	}
	else
	{

	}
}

