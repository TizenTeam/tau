
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
//	googlePreload();
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
	script.src = "http://www.google.com/uds/api?file=uds.js&v=1.0&callback=loadJQueryUIMapScript";
	document.head.appendChild( script );
}

function loadJQueryUIMapScript() {
	S.loadScriptsWithCallback( 'lib/jquery.ui.map.full.min.js', googlePreload );
}

function googlePreload() {
	getCurrentLocation( firstSearch, noLocationInfo );
	$.mobile.hidePageLoadingMsg();

	$("#queryInput")
		.live( "change", function(events, ui) {
			executeSearch( $("#queryInput").val() );
		})
	
	$("#listBtn").bind( "vclick", function(events, ui) {
		window.history.back();
	});

	$("#mapBtn").bind( "vclick", function(events, ui) {
		showListMap();
	});
	
	$("#mapSearchBtn").bind( "vclick", function(events, ui) {
		showListMap();
	});

	$("#mapDetailBtn").bind( "vclick", function(events, ui) {
		showDetailMap();
	});
}

function showListMap() {
	var title = $.mobile.activePage.find(".ui-title").text();
	$("#mapTitle").text( title );
	$.mobile.changePage("#mapPage");
	if ( gMap ) {
		gMap.gmap('refresh');
	} else {
		gMap = $("#map").gmap();	
	}

	for ( var i = 0; i < gLocalSearch.results.length; i++ ) {	
		var ll = new google.maps.LatLng( gLocalSearch.results[i].lat, gLocalSearch.results[i].lng );
		$("#map").gmap( 'addMarker', { 
			'position': ll 
		} );
		$("#map").gmap( 'addBounds', ll );
	}
}

function showDetailMap() {
	console.log("ShowDetailMap Called");
}

function firstSearch( lat, lng ) {
	meLocation = new google.maps.LatLng( lat, lng );
	initLocalSearch();
			
	if ( gLocalSearch.results != undefined ) {
		gLocalSearch.clearResults();
	}

	gLocalSearch.setCenterPoint(meLocation);
	gLocalSearch.setSearchCompleteCallback( null, OnFirstSearch );
	gLocalSearch.execute("category:restaurants");

	initSearchCategoryList();
}


function noLocationInfo() {
	console.log( "Cannot retreive your current location" );
	
	firstSearch( ME_LOCATION_LAT, ME_LOCATION_LNG );	
}

function initLocalSearch() {
	gLocalSearch = new GlocalSearch();
	gLocalSearch.setResultSetSize( GSearch.LARGE_RESULTSET );
}

function OnFirstSearch() {

	if ( !gLocalSearch.results || gLocalSearch.results.length == 0 ) {
		alert("No search result");
	} else {
		for ( var i = 0; i < gLocalSearch.results.length; i++ ) {
			gDistance[ i ] = calcDistance( gLocalSearch.results[i].lat, gLocalSearch.results[i].lng );
			gIsFavoriteBtnOn_google[ i ] = false;
			gIsFavoriteBtnOn_4s[ i ] = false;
		}
    	setListFromLocalSearch( $("#aroundmeList"), true );
	}
}


function initSearchCategoryList() {
	
	var searchCategoryList = $("#searchCategoryList");
	searchCategoryList.children().remove();
	
	for ( var i = 0; i < gGoogleCategory.length; i++ ) {
		var listContent = {
			id: "searchListCategoryId" + i,
			href: "#",
			title: gGoogleCategory[i],
			imgSrc: "image/" + gGoogleCategoryImage[i]
		};
		
		var item = '<li class="ul-li-3-1-10" id="' + listContent.id + '">' +
				'<span class="ui-li-text-main">' + listContent.title + '</span>' + 
				'<img src="' + listContent.imgSrc + '" class="ui-li-bigicon">' + '</li>';
		searchCategoryList.append( item );

		$(searchCategoryList).find('li').last().bind("vclick", function() {
			var tIndex = parseInt($(this).attr("id").substr(20, 1));
			var query = gGoogleCategoryQuery[tIndex];
			
			executeSearch( query );
		});
	}
}

function setListFromLocalSearch( list, refresh ) { 
	console.log( gLocalSearch.results );
	list.children().remove();

	for ( var i = 0; i < gLocalSearch.results.length; i++ ) {
		var address = (( gLocalSearch.results[i].streetAddress.length > 0 ) ? (gLocalSearch.results[i].streetAddress + ",") : "")
			+ ((gLocalSearch.results[i].city.length > 0 ) ? (gLocalSearch.results[i].city + ", " ) : "" )
			+ ((gLocalSearch.results[i].region.length > 0 ) ? (gLocalSearch.results[i].region + ", " ) : "" ) 
			+ ((gLocalSearch.results[i].country.length > 0 ) ? (gLocalSearch.results[i].country) : "" );
		if ( address.lastIndexOf(",") == address.length - 2 ) {
			address = address.substr( 0, address.length - 2 );
		}
		var listContent = {
				id: "listItemId-" + i,
				href: "#",
				title: gLocalSearch.results[i].title,
				info: gDistance[i],
				subTitle: address,
				imgSrc: "image/" + gGoogleCategoryImage[i % 6]
			};
		
		// is this only option for these things? can we make it these to better way?
		var item = '<li class="ui-li-3-2-14" id="' + listContent.id + '">' + 
				'<span class="ui-li-text-main">' + listContent.title + '</span>' + 
				'<span class="ui-li-text-sub">' + listContent.subTitle + '</span>' +
				'<img src="' + listContent.imgSrc + '" class="ui-li-bigicon">' + 
				'<span class="ui-li-text-sub2">' + listContent.info + '</span>' + '</li>';

		list.append( item  );
		
		$(list).find('li').last().bind("vclick", function() {
			var tIndex = parseInt($(this).attr("id").substr(11,1));
			gIndex = tIndex;
			showDetailPage();
		
			});
	}
	if ( refresh ) {
		list.listview('refresh');
	}
}

function showDetailPage() {
	$("#detailTitle").text( gLocalSearch.results[gIndex].title );
	$("#detailAddress").text( gLocalSearch.results[gIndex].addressLines[0] );
	$("#detailTel").text( gLocalSearch.results[gIndex].phoneNumbers[0].number );
	$.mobile.changePage("#detailPage");
}

function OnSearch() {

	$.mobile.changePage("#searchResultPage");

	if ( !gLocalSearch.results || gLocalSearch.results.length == 0 ) {
		alert("No search result");
	} else {
		for ( var i = 0; i < gLocalSearch.results.length; i++ ) {
			gDistance[ i ] = calcDistance( gLocalSearch.results[i].lat, gLocalSearch.results[i].lng );
			gIsFavoriteBtnOn_google[ i ] = false;
			gIsFavoriteBtnOn_4s[ i ] = false;
		}
    	setListFromLocalSearch( $("#searchList"), true );
	}
}

function executeSearch( query ) {
	//showLoading
	function realSearch( lat, lng ) {
		meLocation = new google.maps.LatLng( lat, lng );
		
		if ( gLocalSearch.results != undefined ) {
			gLocalSearch.clearResults();
		}
		gLocalSearch.setSearchCompleteCallback( null, OnSearch );
		gLocalSearch.setCenterPoint( meLocation );
		gLocalSearch.execute( query );
	}
	
	getCurrentLocation( realSearch, null );
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
}
