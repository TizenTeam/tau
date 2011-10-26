
var firstLauning = true;
var showingview = "";
var requestNo = 0;
var gpsResponse = 0;
var cellidResponse = 0;
var locationResponse = 0;
var mapIsOk = false;

initAroundme();

// init, js start
function initAroundme()
{
	showView("aroundmeListView");
	loadMapScript();
}

//Loading google localsearch API
function loadSearchScript()
{
	showLoadingScreen();

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://www.google.com/uds/api?file=uds.js&v=1.0&callback=loadLocalScripts";
    document.body.appendChild(script);
}

//Loading google Map V3 API
function loadMapScript()
{
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.google.com/maps/api/js?sensor=true&language=en&region=GB&libraries=geometry&callback=loadSearchScript";
	document.body.appendChild(script);
}

// callback for google loader
function loadLocalScripts()
{
	for (var i = 0; i < gScriptArr.length; i++)
	{
		var oHead = document.getElementsByTagName('HEAD').item(0); 
		var oScript= document.createElement("script"); 
		oScript.type = "text/javascript"; 
		oScript.src = gScriptArr[i]; 
		oHead.appendChild(oScript); 
	}
	googlePreload();
}

function firstSearch(lat, lng)
{
    meLocation = new google.maps.LatLng(lat, lng);
    //meLocation = new google.maps.LatLng(ME_LOCATION_LAT, ME_LOCATION_LNG);

	//The first view is search result list, so don't initialize the map here.
	//The map can be initialized after the searching is over.
	initGoogleMap();

	initLocalSearch();

	// search first enter results
	//executeSearch("category:restaurants");
	if (gLocalSearch.results != undefined)	
    {
        gLocalSearch.clearResults();
    }
    
    gLocalSearch.setCenterPoint(meLocation);
	gLocalSearch.execute("category:restaurants");       
	setSearchCategoryList();
}

function noLocationInfo()
{
    console.log("Cannot get your current location");

    //ME_LOCATION_LAT, ME_LOCATION_LNG
    meLocation = new google.maps.LatLng(ME_LOCATION_LAT, ME_LOCATION_LNG);
    //meLocation = new google.maps.LatLng(0, 0);

	//The first view is search result list, so don't initialize the map here.
	//The map can be initialized after the searching is over.
	//initGoogleMap();

	initLocalSearch();

	// search first enter results
	//executeSearch("category:restaurants");
	if (gLocalSearch.results != undefined)	
    {
        gLocalSearch.clearResults();
    }
    
    gLocalSearch.setCenterPoint(meLocation);
	gLocalSearch.execute("category:restaurants");
    
	setSearchCategoryList();
}

// Set up the map and the local searcher.
function googlePreload() {

	gMeIcon = new google.maps.MarkerImage(
                            		"image/maps_marker.png",
                            		new google.maps.Size(60, 60),
                            		new google.maps.Point(-11, 0),
                            		null);
	// suwon samsung (ME_LOCATION_LAT, ME_LOCATION_LNG)
	//Get current location.
	getCurrentLocation(firstSearch, noLocationInfo);	

    //The part is used to response the search bar enter key event temporarily.
    //If the IME of webkit is ok, then the part can be removed based on RIA FW's modification.
	$("#searchriaId").click(function(){
            gSearchKeyword = "";
            gSearchKeyword = $(this).parent().find("input").val();
            if (gSearchKeyword == "")
            {
            	//alert(" the key word is not null!");
            }
            if (gSource == "google")
            {
            	executeSearch(gSearchKeyword);
            }
            else 
            {
                fqCategorySearch = true;
            	executeFoursquareSearch(gSearchKeyword);
            }
            //switchSearchResult("searchListPlace");
            //$("#searchListCategory").hide();
        });
}

function initLocalSearch()
{
	gSource = "google";
	// Initialize the local searcher
	gLocalSearch = new GlocalSearch();
	gLocalSearch.setResultSetSize(GSearch.LARGE_RESULTSET);
	gLocalSearch.setSearchCompleteCallback(null, OnLocalSearch);
}

function initGoogleMap()
{
    if (mapIsOk) {
        return;
    }
    
    var zoomLevel;
	if (gSource == "google")
	{
		zoomLevel = 13;
	}
	else 
	{
		zoomLevel = 13;
	}

	// Initialize the map with default UI.
	gMap = new google.maps.Map(document.getElementById("map"), 
	                {
	                    //Get current location with the first seach location.
                		center: meLocation,
                		zoom: zoomLevel,
                		disableDefaultUI: true,
                		scrollwheel: false,
                		mapTypeId: google.maps.MapTypeId.ROADMAP
                	});

	myhide($("#aroundmeMapView"));

	// Add Me button
	var homeControlDiv = document.createElement('DIV');
	$(homeControlDiv).addClass("me_button");
	var homeControl = new HomeControl(homeControlDiv, gMap);

	homeControlDiv.index = 1;
	gMap.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(homeControlDiv);

    mapIsOk = true;
}

//The list is used to create the search categories for google or foursquare local searcher.
//It is similar with setFqSearchCategoryList() in foursquare.js.
function setSearchCategoryList()
{
	switchSearchResult("aroundmeListPlace");
	// create search category list
	if ($('#searchListCategoryName'))
	{
		$('#searchListCategoryName').remove();
	}
    
	var mylist = new genlist("searchListCategoryName", "1line-texticon50");
	$('#searchListCategory').append(mylist);
    
	for (var i = 0; i < gGoogleCategory.length; i++)
	{	   		 
		var listContent = {
        			id: "searchListCategoryId" + i,
        			href: "#",
        			title: gGoogleCategory[i],
        			imgSrc: "image/" + gGoogleCategoryImage[i]
    			};

		addListItem(mylist, listContent);

		$(mylist).find('li').last().click(function(){
				var tIndex = parseInt($(this).attr("id").substr(20,1));
				var query = gGoogleCategoryQuery[tIndex];

				executeSearch(query);
				//switchSearchResult("searchListPlace");
				//$("#searchListCategory").hide();
			});
	}
}

function setGoogleAroundmeList()
{
	// create around me list regarding google localsearch result
	if ($('#aroundmeListPlaceName'))
	{
		$('#aroundmeListPlaceName').remove();
	}
    
	var myPlacelist = new genlist("aroundmeListPlaceName", "2line-texticoninfo");
	$('#aroundmeListPlace').append(myPlacelist);
    
	for (var i = 0; i < gLocalSearch.results.length; i++)
	{	   		 

        var address = ((gLocalSearch.results[i].streetAddress.length > 0) ? (gLocalSearch.results[i].streetAddress + ", ") : "")
            + ((gLocalSearch.results[i].city.length > 0) ? (gLocalSearch.results[i].city + ", ") : "")
            + ((gLocalSearch.results[i].region.length > 0) ? (gLocalSearch.results[i].region + ", ") : "")
            + ((gLocalSearch.results[i].country.length > 0) ? (gLocalSearch.results[i].country) : "");

        if(address.lastIndexOf(",") == address.length - 2)
        {
            address = address.substr(0, address.length - 2);
        }
    	var listContent = {
            		id: "aroundmeListPlaceId" + i,
            		href: "#",
            		title: gLocalSearch.results[i].title,
            		info: gDistance[i],
            		subTitle: address,
            		imgSrc: "image/" + gGoogleCategoryImage[i % 6]
        		};

    	addListItem(myPlacelist, listContent);
    	$(myPlacelist).find('li').last().click(function(){
    			var tIndex = parseInt($(this).attr("id").substr(19,1));
    			gIndex = tIndex;

                //Show the selected locations and its ballon directly, and show the other unselected locations.
    			showMapInfo();
    			showView("aroundmeMapView");
    		});
	}
}

function setGoogleSearchList()
{
	// create search list regarding google localsearch result
	if ($('#searchListPlaceName'))
	{
		$('#searchListPlaceName').remove();
	}
    
	var myPlacelist = new genlist("searchListPlaceName", "2line-texticoninfo");
	$('#searchListPlace').append(myPlacelist);
    
	for (var i = 0; i < gLocalSearch.results.length; i++)
	{	   	
	    var address = ((gLocalSearch.results[i].streetAddress.length > 0) ? (gLocalSearch.results[i].streetAddress + ", ") : "")
            + ((gLocalSearch.results[i].city.length > 0) ? (gLocalSearch.results[i].city + ", ") : "")
            + ((gLocalSearch.results[i].region.length > 0) ? (gLocalSearch.results[i].region + ", ") : "")
            + ((gLocalSearch.results[i].country.length > 0) ? (gLocalSearch.results[i].country) : "");

        if(address.lastIndexOf(",") == address.length - 2)
        {
            address = address.substr(0, address.length - 2);
        }
        
    	var listContent = {
                	id: "searchListPlaceId" + i,
                	href: "#",
                	title: gLocalSearch.results[i].title,
                	info: gDistance[i],
                	subTitle: address,
                	imgSrc: "image/" + gGoogleCategoryImage[i % 6]
                };
    	
    	addListItem(myPlacelist, listContent);
        
    	$(myPlacelist).find('li').last().click(function(){       
    			var tIndex = parseInt($(this).attr("id").substr(17,1));
    			gIndex = tIndex;

                //Show the selected locations and its ballon directly, and show the other unselected locations.
    			showMapInfo();
    			showView("aroundmeMapView");			
		});
	}
}

function executeSearch(query)
{
    showLoadingScreen();
    function realSearch(lat, lng)
    {        
        //meLocation = new google.maps.LatLng(ME_LOCATION_LAT, ME_LOCATION_LNG);
        meLocation = new google.maps.LatLng(lat, lng);
        
        if (gLocalSearch.results != undefined)	
        {
            gLocalSearch.clearResults();
        }
        gLocalSearch.setCenterPoint(meLocation);
    	gLocalSearch.execute(query);
    }

    getCurrentLocation(realSearch, null);	
}

// Called when Local Search results are returned, we clear the old
// results and load the new ones.
function OnLocalSearch() {
    
    if (!gLocalSearch.results || gLocalSearch.results.length == 0) 
    {   
        //Show no search result view
        alert("No search result");
    }
    else
    {
    	for (var i = 0; i < gLocalSearch.results.length; i++)
    	{
    		gDistance[i] = calcDistance(gLocalSearch.results[i].lat, gLocalSearch.results[i].lng);
    		gIsFavoriteBtnOn_google[i] = false;
			gIsFavoriteBtnOn_4s[i] = false;
    	}
        
    	setGoogleAroundmeList();
    	setGoogleSearchList();

        switchSearchResult("searchListPlace");
        $("#searchListCategory").hide();
    }

    hideLoadingScreen();
    showView("aroundmeListView");

    if(firstLauning)
    {        
        //initGoogleMap();        
        getFavoriteList();
        firstLauning = false;        
    }
}

function showMapInfo()
{
	setAutoZoom(gMap, gLocalSearch.results);
	setSearchLocation(gLocalSearch.results, gIndex);

	// Move the map to the selected result
	var selected = gLocalSearch.results[gIndex];
	gMap.setCenter(new google.maps.LatLng(parseFloat(selected.lat),
										parseFloat(selected.lng)));
}

// me button
function HomeControl(controlDiv, map) {

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

function OnMeAddress()
{
	if (!gMeSearch.results) 
    {   
        return;
    }
    var meStr = ((gMeSearch.results[0].streetAddress.length > 0) ? (gMeSearch.results[0].streetAddress + ", ") : "")
            + ((gMeSearch.results[0].city.length > 0) ? (gMeSearch.results[0].city + ", ") : "")
            + ((gMeSearch.results[0].region.length > 0) ? (gMeSearch.results[0].region + ", ") : "")
            + ((gMeSearch.results[0].country.length > 0) ? (gMeSearch.results[0].country) : "");

    if(meStr.lastIndexOf(",") == meStr.length - 2)
    {
        meStr = meStr.substr(0, meStr.length - 2);
    }
    
	var meName = gMeSearch.results[0].title;

	$("#meAddress").addClass("me_Address_info");
	$("#meAddress").text(meStr);
}

// me button
function hideMeInfo()
{
	//$("#meAddress").css("display", "none");
	//$("#meBG").css("background-color", "");
	$("#meImage").css("display", "inline-block");
	//gMeMarker.setMap(null);
}

// fake show for map div, it can not actually hide
function myshow(element)
{
    element.css("left", "0px");
    element.css("top", "0px");
    element.css("position", "relative");
}

// fake hide for map div, it can not actually hide
function myhide(element)
{
    element.css("left", "-600px");
    element.css("top", "-1024px");
    element.css("position", "absolute");
}

// global view control
function showView(viewName)
{
    showingview = viewName;
	if (viewName == "aroundmeMapView")
	{	    
		gEnterMap = true;
		$('#mapVsList').text("List");
		$("#page").css("display", "block");
		$("#searchListView").css("display", "none");
		$("#searchView").css("display", "none");
		$("#favoriteView").css("display", "none");
		//$("#detailView").css("display", "none");
        myshow($("#aroundmeMapView"));
        myhide($("#aroundmeListView"));
	}
	else if (viewName == "searchListView")
	{
		$('#mapVsList').text("Map");
		$("#page").css("display", "block");
		$("#searchListView").css("display", "block");
		$("#searchView").css("display", "none");
		$("#favoriteView").css("display", "none");
        myhide($("#aroundmeMapView"));
        myhide($("#aroundmeListView"));
	}
	else if (viewName == "searchView")
	{
		$('#mapVsList').text("Map");
		$("#page").css("display", "block");
		$("#searchListView").css("display", "none");
		$("#searchView").css("display", "block");
		$("#favoriteView").css("display", "none");
		myhide($("#aroundmeMapView"));
        myhide($("#aroundmeListView"));

		switchSearchResult("searchListCategory");
		$("#searchListCategory").show();
	}
	else if (viewName == "favoriteView")
	{
		gEnterFavorite = true;
		$('#mapVsList').text("Remove");
		$("#page").css("display", "block");
		$("#searchListView").css("display", "none");
		$("#searchView").css("display", "none");
		$("#favoriteView").css("display", "block");
		myhide($("#aroundmeMapView"));
        myhide($("#aroundmeListView"));
		enterFavoriteList();

	}
	else if (viewName == "aroundmeListView")
	{
		$(document.body).find("[data-role='footer']").find("a").each(function(){
			$(this).removeClass("slp-ui-button-tabbar-focus");
		});
		$(document.body).find("[data-role='footer']").find("a").eq(0).addClass("slp-ui-button-tabbar-focus");
		$('#mapVsList').text("Map");
		$("#page").css("display", "block");
		$("#searchListView").css("display", "none");
		$("#searchView").css("display", "none");
		$("#favoriteView").css("display", "none");
		switchSearchResult("aroundmeListPlace");
		myhide($("#aroundmeMapView"));
		myshow($("#aroundmeListView"));
		$(document.body).find("[data-role='footer']").find("a").each(function(){
			$(this).removeClass("slp-ui-button-tabbar-focus");
		});
		$(document.body).find("[data-role='footer']").find("a").eq(0).addClass("slp-ui-button-tabbar-focus");
		
	}
	else if (viewName == "detailView")
	{
		$("#page").css("display", "none");
        myhide($("#aroundmeMapView"));
        myhide($("#aroundmeListView"));
	}
	else
	{
		$("#page").css("display", "block");
		$("#searchListView").css("display", "none");
		$("#searchView").css("display", "block");
		$("#favoriteView").css("display", "none");
		myhide($("#aroundmeMapView"));
        myhide($("#aroundmeListView"));
	}
}

// in search view, search category and search list switch
function switchSearchResult(viewName)
{
	if (viewName=="searchListPlace")
	{
		$("#searchListPlace").css("display", "block");
		$("#aroundmeListPlace").css("display", "none");
		$("#searchListCategory").css("display", "none");
	}
	else if (viewName=="aroundmeListPlace")
	{
		$("#searchListPlace").css("display", "none");
		$("#aroundmeListPlace").css("display", "block");
		$("#searchListCategory").css("display", "none");
	}
	else if (viewName=="searchListCategory")
	{
		$("#searchListPlace").css("display", "none");
		$("#aroundmeListPlace").css("display", "none");
		$("#searchListCategory").css("display", "block");
	}
}

// top right button
function goToList()
{
    switch(showingview)
        {
            case "favoriteView":
                {
            		if ($('#mapVsList').text() != "Done")
            		{
            			$('#mapVsList').text("Done");
            			enterFavoriteEditList();
            		}
            		else
            		{
            			$('#mapVsList').text("Remove");
            			DoneBtFn();
            		}
            	}
                break;
                
            case "aroundmeMapView":   
            case "aroundmeListView": 
            default:
                if (gEnterMap == false)
            	{
            		gEnterMap = true;
            		gEnterFavorite = false;
            		showView("aroundmeMapView");
            		$('#mapVsList').text("List");
            		gMap.setCenter(meLocation);
            		showMapInfo();
            	}
            	else
            	{
            		gEnterMap = false;
            		gEnterFavorite = false;
            		showView("aroundmeListView");
            		$('#mapVsList').text("Map");
            		gLocalSearch.setCenterPoint(meLocation);
            	}
                break;
        }	
}

// input box search
function searchByKeywordFn()
{
	var keyEvent=event || window.event;  
	var key=keyEvent.keyCode; 
	switch(key)  
	{
		// TODO make sure enter key code is 13
		 case 13:
		 	gSearchKeyword = "";
		 	gSearchKeyword = $("#queryInput").val();
			if (gSearchKeyword == "")
			{
				//alert(" the key word is not null!");
			}
			if (gSource == "google")
			{
				//search from google
				//gLocalSearch.setCenterPoint(gMap.getCenter());
				executeSearch(gSearchKeyword);
			}
			else 
			{
				//search from google
				//gLocalSearch.setCenterPoint(gMap.getCenter());
				executeFoursquareSearch(gSearchKeyword);
			}
			//switchSearchResult("searchListPlace");
			//$("#searchListCategory").hide();
			break;
		default:
			break;
	}
}

// set search results in the map
function setAutoZoom(map,markers)
{
	var i = markers.length;
	var bounds = new google.maps.LatLngBounds();

	if (gSource == "google")
	{
		while(i--) {
			bounds.extend(new google.maps.LatLng(markers[i].lat,markers[i].lng));
		}
	}
	else
	{
		while(i--) {
			bounds.extend(new google.maps.LatLng(markers[i].geolat,markers[i].geolong));
		}
	}
    gMap.fitBounds(bounds);

    if(gMap.getZoom() == 20)
    {
        gMap.setZoom(19);
    }   
}

// calculate distance to me location
function calcDistance(lat, lng)
{
	var distance = google.maps.geometry.spherical.computeDistanceBetween(meLocation, new google.maps.LatLng(lat, lng));
	distance = Math.floor(distance);
	if (distance > 999)
	{
		distance = Math.round(distance/1000);
		return distance+"km";
	}
	else
	{
		return distance+"m";
	}
}

function enter_detailview(){
	if (gEnterFavorite == false)
		setDetailViewData();
}

/* loading */
var imgNum = 1;
var g_timer;

function showLoadingScreen(){
	clearInterval(g_timer);
	$('#loading_screen').show();
	g_timer = setInterval("changeProgress()", 50);
	setTimeout(hideLoadingScreen,60000);
}

function changeProgress()
{
	if (imgNum<1 || imgNum>30)
		imgNum=1;

	if (imgNum<10)
	{
		var imagePrefixWhite = "image/process/00_winset_list_process_0";
	}
	else
	{
		var imagePrefixWhite = "image/process/00_winset_list_process_";
	}
	
	$('#loading_content_img').attr('src', imagePrefixWhite+imgNum+'.png');

	imgNum++;
}

function hideLoadingScreen(){
	clearInterval(g_timer);
	$('#loading_screen').hide();
}

/*
 * Get current location with GPS or CellId.
 */
function getLocationWithCellId(successCellIdCallback, errorCellIdCallback)
{
    function onCellIdRetrieved(cellinfo) {
        var cellIdinfo = {
                "version": "1.1.0" ,
                "host": "maps.google.com",
                "access_token": "2:k7j3G6LaL6u_lafw:4iXOeOpTh1glSXe",
                "home_mobile_country_code": 460,
                "home_mobile_network_code":0,
                "address_language": "en",
                "radio_type": "gsm",
                "request_address": true ,
                "cell_towers":[
                        {
                            "cell_id":36526,
                            "location_area_code":14556,
                            "mobile_country_code":460,
                            "mobile_network_code":0,
                            "timing_advance":5555
                        }
                    ]
            };

        var locRequest = new XMLHttpRequest();

        function updateLocation() 
        {
            if (locRequest.readyState == 4)
            {
                if(locRequest.status == 200)
                {
                    var response = locRequest.responseText;
                    var latLng = eval("(" + response + ")");

                    successCellIdCallback(latLng.location.latitude, latLng.location.longitude);
                    return;
                }
                else
                {
                    errorCellIdCallback();
                }
            }
        }                               

        function prepareJson(cellinfo) 
        {
            cellIdinfo.home_mobile_country_code = cellinfo.mcc;
            cellIdinfo.home_mobile_network_code = cellinfo.mnc;
            cellIdinfo.radio_type = cellinfo.rat;

            cellIdinfo.cell_towers[0].cell_id = cellinfo.cellid;
            cellIdinfo.cell_towers[0].location_area_code = cellinfo.lac;
            cellIdinfo.cell_towers[0].mobile_country_code = cellinfo.mcc;
            cellIdinfo.cell_towers[0].mobile_network_code = cellinfo.mnc;
        }

        function toString(obj)
        {
            var isArray = obj instanceof Array;
            var r = [];
            for(var i in obj)
            {
                var value = obj[i];
                if(typeof value == 'string')
                {
                    value = '"' + value + '"';
                }
                else if(value != null && typeof value == 'object')
                {
                    value = toString(value);
                }
                r.push((isArray?'':i+':')+value);
            }
            if(isArray)
            {
                return '['+r.join(',')+']';
            }
            else
            {
                return '{'+r.join(',')+'}';
            }
        }
    
        try
        {
            if (null != cellinfo)
            {
                prepareJson(cellinfo);
                locRequest.open("POST", "http://www.google.com/loc/json", true);
                locRequest.onreadystatechange = updateLocation;
                locRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                locRequest.send(toString(cellIdinfo));
            }
            else
            {
                errorCellIdCallback();
            }
        }
        catch(e)
        {
            //alert("Cannot get cellid information!");
            errorCellIdCallback();
        }
    }

    try {
        deviceapis.devicestatus.getPropertyValue(onCellIdRetrieved, 
                                                    function() {
                                                        //alert("An error occurred " + e.message);
                                                    },
                                                    {property:"cellid", aspect:"CellularNetwork"});
    }
    catch(exp) {
        //alert("getPropertyValue Exception :[" + exp.code + "] " + exp.message);
        errorCellIdCallback();
    }
}
 /*
function getLocationWithCellId(successCellIdCallback, errorCellIdCallback)
{
    var cellIdinfo = {
                "version": "1.1.0" ,
                "host": "maps.google.com",
                "access_token": "2:k7j3G6LaL6u_lafw:4iXOeOpTh1glSXe",
                "home_mobile_country_code": 460,
                "home_mobile_network_code":0,
                "address_language": "en",
                "radio_type": "gsm",
                "request_address": true ,
                "cell_towers":[
                        {
                            "cell_id":36526,
                            "location_area_code":14556,
                            "mobile_country_code":460,
                            "mobile_network_code":0,
                            "timing_advance":5555
                        }
                    ]
            };

    var locRequest = new XMLHttpRequest();

    function updateLocation() 
    {
        if (locRequest.readyState == 4)
        {
            if(locRequest.status == 200)
            {
                var response = locRequest.responseText;
                var latLng = eval("(" + response + ")");

                successCellIdCallback(latLng.location.latitude, latLng.location.longitude);
                return;
            }
            else
            {
                errorCellIdCallback();
            }
        }
    }                               

    function prepareJson(cellinfo) 
    {
        cellIdinfo.home_mobile_country_code = cellinfo.mcc;
        cellIdinfo.home_mobile_network_code = cellinfo.mnc;
        cellIdinfo.radio_type = cellinfo.rat;

        cellIdinfo.cell_towers[0].cell_id = cellinfo.cellid;
        cellIdinfo.cell_towers[0].location_area_code = cellinfo.lac;
        cellIdinfo.cell_towers[0].mobile_country_code = cellinfo.mcc;
        cellIdinfo.cell_towers[0].mobile_network_code = cellinfo.mnc;
    }

    function toString(obj)
    {
        var isArray = obj instanceof Array;
        var r = [];
        for(var i in obj)
        {
            var value = obj[i];
            if(typeof value == 'string')
            {
                value = '"' + value + '"';
            }
            else if(value != null && typeof value == 'object')
            {
                value = toString(value);
            }
            r.push((isArray?'':i+':')+value);
        }
        if(isArray)
        {
            return '['+r.join(',')+']';
        }
        else
        {
            return '{'+r.join(',')+'}';
        }
    }
    
    var cellinfo;
    try
    {
        cellinfo = deviceapis.deviceinteraction.getCellInfo();

        if (null != cellinfo)
        {
            prepareJson(cellinfo);
            locRequest.open("POST", "http://www.google.com/loc/json", true);
            locRequest.onreadystatechange = updateLocation;
            locRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            locRequest.send(toString(cellIdinfo));
        }
        else
        {
            errorCellIdCallback();
        }
    }
    catch(e)
    {
        //alert("Cannot get cellid information!");
        errorCellIdCallback();
    }
}
*/

function getCurrentLocation(sucesscb, errorcb)
{
    requestNo++;
    locationResponse = gpsResponse = cellidResponse = requestNo;

    if(navigator.geolocation) 
    {
        function successCallback(position) 
        {
            if(locationResponse == 0)
            {
                //Current location is set with cellid response.
                return;
            }
            
            locationResponse = 0;   
            if (sucesscb) {
                sucesscb(position.coords.latitude, position.coords.longitude);
            }
        }

        function errorCallback() 
        {
            //alert("[Location]Response Error");
            if (errorcb) {
                errorcb();
            }
        }
        
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        //navigator.geolocation.watchPosition(successCallback, errorCallback);
    }
    
    if(true) 
    {
        function successCellIdCallback(lat, lng)
        {
            //alert("lat = " + lat + ", lng = " + lng);
            if(locationResponse == 0) {
                //Current location is set with cellid response.
                return;
            }
            
            locationResponse = 0;                
            
            if (sucesscb) {
                sucesscb(lat, lng);
            }
        }

        function errorCellIdCallback()
        {
            //alert("[Location]Response Error");
            if (errorcb) {
                errorcb();
            }
        }

        getLocationWithCellId(successCellIdCallback, errorCellIdCallback);
    }
}

/* loading end*/

