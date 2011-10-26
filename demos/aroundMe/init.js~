
// indicate the item number of your selection
var gIndex=0;
var gDetailViewData;

var gGoogleCategory = ["All", "Art", "Education", "Restaurants", "Travel", "Bar"];
var gfqCategory = ["", "Art", "Education", "Restaurants", "Travel", "Bar"];
var gGoogleCategoryImage = ["Aroundme_icon_Art.png", "Aroundme_icon_Art.png", "Aroundme_icon_College.png", "Aroundme_icon_Food.png", "Aroundme_icon_Home.png", "Aroundme_icon_Nightlife.png"];
var gGoogleCategoryQuery = ["category:all", "category:art", "category:education", "category:restaurants", "category:travel", "category:bar"];

var gDistance = new Array();

var searchMarker = new Array();
var searchInfoWindow = new Array();
var curmarker = null;
var gCustomInfoWindow;

var ME_LOCATION_LAT = 37.257762;
var ME_LOCATION_LNG = 127.053022;

var gLocalSearch;
var gMap;
var gInfoWindow;
var gSelectedResults = [];
var gCurrentResults = [];
var gSearchForm;
var gEnterMap = false;
var gQuery = "";
var gSearchKeyword = "";

var meLocation;
var gMeAddress;
var gMeMarker = null;
var gMeSearch;
var ME_DISPLAY_TIME = 4000;
var gMeIcon;
var gMeInfoWindow;

////////
var contactInfo=new Object();

////////
var gSource = "google";
var gFqSearch = [];

////////
var gFavoriteList = new Array();
var myFavoriteList;
var gIsFavoriteBtnOn_google = new Array();
var gIsFavoriteBtnOn_4s = new Array();

////////
var ginfoIndex = 0;
var gFavoriteIndex = new Array();
var gEnterFavorite = false;

var gFavoriteType = new Array();

var firstLauning = true;
var showingview = "";
var mapIsOk = false;

initGoogle();

function initGoogle() {
	$.mobile.showPageLoadingMsg();
	loadMapScript();
}

// Loader for google map v3 api
function loadMapScript() {
	var script = document.createElement( "script" );
	script.type = "text/javascript";
	script.src = "http://maps.google.com/maps/api/js?sensor=true&language=en&region=GB&libraries=geometry&callback=loadSearchScript";
	document.head.appendChild( script );
}

// Callback for google loader
function loadSearchScript() {
	var script = document.createElement( "script" );
	script.type = "text/javascript";
	script.src = "http://www.google.com/uds/api?file=uds.js&v=1.0&callback=googlePreload";
	document.head.appendChild( script );
}

function googlePreload() {
	gMeIcon = new google.maps.MarkerImage(
                            		"image/maps_marker.png",
                            		new google.maps.Size(60, 60),
                            		new google.maps.Point(-11, 0),
                            		null);
	getCurrentLocation( firstSearch, noLocationInfo );	
	$.mobile.hidePageLoadingMsg();
	console.log("Done");
}

function firstSearch( lat, lng ) {
	meLocation = new google.maps.LatLng( lat, lng );
	initGoogleMap();
	initLocalSearch();
	if ( gLocalSearch.results != undefined ) {
		gLocalSearch.clearResults();
	}
	gLocalSearch.setCenterPoint(meLocation);
	gLocalSearch.execute("category:restaurants");
	setSearchCategoryList();
}


function noLocationInfo() {
	console.log( "Cannot retreive your current location" );
	
	firstSearch( ME_LOCATION_LAT, ME_LOCATION_LNG );	
}

function initLocalSearch() {
	gSource = "google";

	gLocalSearch = new GlocalSearch();
	gLocalSearch.setResultSetSize( GSearch.LARGE_RESULTSET );
	gLocalSearch.setSearchCompleteCallback( null, OnLocalSearch );
}


function OnLocalSearch() {
	if ( !gLocalSearch.results || gLocalSearch.results.length == 0 ) {
		alert("No search result");
	} else {
		for ( var i = 0; i < gLocalSearch.results.length; i++ ) {
			gDistance[ i ] = calcDistance( gLocalSearch.results[i].lat, gLocalSearch.results[i].lng );
			gIsFavoriteBtnOn_google[ i ] = false;
			gIsFavoriteBtnOn_4s[ i ] = false;
		}
    
		setGoogleAroundmeList();
//		setGoogleSearchList();
		
		
	}
}

function setSearchCategoryList() {
		
	
}

function setGoogleAroundmeList() {
	var aroundmeList = $("#aroundmeList");
	
	for ( var i = 0; i < gLocalSearch.results.length; i++ ) {
		var address = (( gLocalSearch.results[i].streetAddress.length > 0 ) ? (gLocalSearch.results[i].streetAddress + ",") : "")
			+ ((gLocalSearch.results[i].city.length > 0 ) ? (gLocalSearch.results[i].city + ", " ) : "" )
			+ ((gLocalSearch.results[i].region.length > 0 ) ? (gLocalSearch.results[i].region + ", " ) : "" ) 
			+ ((gLocalSearch.results[i].country.length > 0 ) ? (gLocalSearch.results[i].country) : "" );
		if ( address.lastIndexOf(",") == address.length - 2 ) {
			address = address.substr( 0, address.length - 2 );
		}
		var listContent = {
				id: "aroundmeListPlaceId" + i,
				href: "#",
				title: gLocalSearch.results[i].title,
				info: gDistance[i],
				subTitle: address,
				imgSrc: "image/" + gGoogleCategoryImage[i % 6]
			};
		var item = '<li class="ui-li-3-2-14" id="' + listContent.id + '">' + 
				'<span class="ui-li-text-main">' + listContent.title + '</span>' + 
				'<span class="ui-li-text-sub">' + listContent.subTitle + '</span>' +
				'<img src="' + listContent.imgSrc + '" class="ui-li-bigicon">' + 
				'<span class="ui-li-text-sub2">' + listContent.info + '</span>' + '</li>';

		aroundmeList.append( item  );
		
		$(aroundmeList).find('li').last().click(function() {
			var tIndex = parseInt($(this).attr("id").substr(19,1 ));
			gIndex = tIndex;
			
			showMapInfo();
//			showView("aroundmeMapView");
			});
	}

	aroundmeList.listview('refresh');
}

function showMapInfo() {

}

function initGoogleMap() {
	if ( mapIsOk ) {
		return;
	}

	var zoomLevel;
	if ( gSource == "google" ) {
		zoomLevel = 13;
	} else {
		zoomLevel = 13;
	}
	
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
	gMap.controls[ google.maps.ControlPosition.BOTTOM_LEFT].push( homeControlDiv );

	mapIsOk = true;
}

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

// me button
function hideMeInfo()
{
	//$("#meAddress").css("display", "none");
	//$("#meBG").css("background-color", "");
	$("#meImage").css("display", "inline-block");
	//gMeMarker.setMap(null);
}


function calcDistance( lat, lng ) {
	var distance = google.maps.geometry.spherical.computeDistanceBetween( meLocation, new google.maps.LatLng( lat, lng ) );
	distance = Math.floor( distance );
	if ( distance > 999 ) { 
		distance = Math.round( distance / 1000 );
		return distance + "km";
	} else {
		return distance + "m";
	}
}

function getCurrentLocation( successcb, errorcb ) {
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
		navigator.geolocation.getCurrentPosition( successCallback, errorCallback, {timeout: 1000} );
	} else {
		errorcb();
	}	
}
