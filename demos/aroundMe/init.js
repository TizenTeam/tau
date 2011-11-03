
// indicate the item number of your selection
var gIndex=0;
var gDetailViewData;

var searchMarker = new Array();
var searchInfoWindow = new Array();
var curmarker = null;
var gCustomInfoWindow;

var ME_LOCATION_LAT = 37.257762;
var ME_LOCATION_LNG = 127.053022;

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
	gMap = $("#map").gmap();
	googlePreload();
}

function googlePreload() {
	getCurrentLocation( firstSearch, noLocationInfo );
	initSearchCategoryList();	
	$.mobile.hidePageLoadingMsg();
	
	$("#queryInput")
		.live( "change", function(events, ui) {
			executeSearch( $("#queryInput").val() );
		})
	
	$("#listBtn").bind( "vclick", function(events, ui) {
		window.history.back();
	});

	$("#mapSearchBtn").bind( "vclick", function(events, ui) {
		showListMap( $("#searchList") );
	});

	$("#mapBtn").bind( "vclick", function(events, ui) {
		showListMap( $("#aroundmeList") );
	});

	$("#mapDetailBtn").bind( "vclick", function(events, ui) {
		showDetailMap();
	});	
}

function showListMap( list ) {
	// because jquery data stores its data into $.cache, 
	// save somewhere else before change pages
	console.log( list );
	var li = list.find('li');
	var ll = new Array();
	for ( var i = 0; i < li.length; i++ ) {
		ll.push( $(list).data( $( li[i] ).attr("id") ) );
	}

	var title = $.mobile.activePage.find(".ui-title").text();
	$("#mapTitle").text( title );
	$.mobile.changePage("#mapPage");
	gMap.gmap('clear', 'markers' );
	gMap.gmap('set', 'bounds', undefined );
	gMap.gmap('refresh');
	for ( var i = 0; i < ll.length; i++ ) {
		$("#map").gmap( 'addMarker', {
			'position' : ll[i].geometry.location
		} );
		$("#map").gmap( 'addBounds', ll[i].geometry.location );
	}
}

function showDetailMap() {
	console.log("ShowDetailMap Called");
}

function firstSearch( lat, lng ) {
	meLocation = new google.maps.LatLng( lat, lng );
	
	gMap.gmap( 'placesSearch', { 
		location: meLocation,
		radius: 5000,
		types: ['store']
		}, onFirstSearch );	
}


function noLocationInfo() {
	console.log( "Cannot retreive your current location" );
	
	firstSearch( ME_LOCATION_LAT, ME_LOCATION_LNG );	
}


function onFirstSearch(results, status) {
	if ( status == google.maps.places.PlacesServiceStatus.OK ) {
		setListFromPlacesSearch( $("#aroundmeList"), results, true );
	
		
	} else if ( status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS ) {
		$("#aroundmeList").append("<li>No Results</li>");
		popSmallPopup( "Error", "No Results" );
	} else {
		console.log( "Exception on PlacesSearch" );
	}
//    	setListFromLocalSearch( $("#aroundmeList"), true );
}


function initSearchCategoryList() {
	
	var li = $("#searchCategoryList").find('li');
	
	for ( var i = 0; i < li.length; i++ ) {
		$(li[i]).bind("vclick", function() {
			executeSearch( $(this).attr("data-query") );
		});
	}
}

function setListFromPlacesSearch( list, results, refresh ) { 
	list.children().remove();

	for ( var i = 0; i < results.length; i++ ) {
		console.log( results[i] );
		var listContent = {
				id: "listItemId-" + i,
				href: "#",
				title: results[i].name,
				info: calcDistance(results[i].geometry.location),
				subTitle: results[i].vicinity,
				imgSrc: results[i].icon
			};
		
		// is this only option for these things? can we make it these to better way?
		var item = '<li class="ui-li-3-2-14" id="' + listContent.id + '">' + 
				'<span class="ui-li-text-main">' + listContent.title + '</span>' + 
				'<span class="ui-li-text-sub">' + listContent.subTitle + '</span>' +
				'<img src="' + listContent.imgSrc + '" class="ui-li-bigicon">' + 
				'<span class="ui-li-text-sub2">' + listContent.info + '</span>' + '</li>';

		list.append( item  );

		$(list).data( listContent.id, results[i] );

		$(list).find('li').last().bind("vclick", function() {
			getDetailPage( $(list).data( $(this).attr("id") ).reference );
		});
	}
	if ( refresh ) {
		list.listview('refresh');
	}
}

function test() {
	for ( var i = 0; i < gLocalSearch.results.length; i++ ) {
		var temp = new FavoriteItem( gLocalSearch.results[i] );
		console.log( temp.toSaveString() );
		console.log( temp.toHTMLString() );
	}
}

function getDetailPage( reference ) {
	gMap.gmap( 'placesDetail', { 'reference': reference }, showDetailPage );
}

function showDetailPage( place, status ) {
	if ( status == google.maps.places.PlacesServiceStatus.OK ) {
		$("#detailTitle").text( place.name );
		if ( place.website ) { 
			$("#detailWeb").text( place.website ); 
		}
		if ( place.formatted_address ) {
			$("#detailAddress").text( place.formatted_address );
		}
		if ( place.types.length > 0 ) {
			var category = "";
			for ( var i = 0; i < place.types.length; i++ ) {
				category += place.types[i] + " ";
			}
			$("#detailCategory").text( category );
		}
		if ( place.formatted_phone_number ) {
			$("#detailTel").text( place.formatted_phone_number );
		}
		if ( place.rating ) {
			$("#detailRating").text( place.rating );
		}
		$.mobile.changePage("#detailPage");
		console.log( place );
	} else {
		alert( 'no results' );
	}
}

function popSmallPopup( message1, message2 ) {
	var popupdiv = '<div data-role="smallpopup" id="resultPopup" data-text1="denis" data-text2="hello" data-param="aaaaa"></div>';
	$.mobile.activePage.find('[data-role="content"]').append( popupdiv );
	var popup = $("#resultPopup");		
	popup.smallpopup();
	popup.smallpopup('show');
}

function onSearch(results, status) {	
	if ( status == google.maps.places.PlacesServiceStatus.OK ) {
		$.mobile.changePage("#searchResultPage");
		setListFromPlacesSearch( $("#searchList"), results, true );

	} else if ( status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS ) {
		popSmallPopup( "Error", "No Results" );
		console.log( "No Results" );
	} else {
		console.log( "Exception on PlacesSearch" );
	}
}

function executeSearch( query ) {
	//showLoading
	function realSearch( lat, lng ) {
		meLocation = new google.maps.LatLng( lat, lng );
	
		gMap.gmap( 'placesSearch', { 
			location: meLocation,
			radius: 5000,
			keyword: query
		}, onSearch );			
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


function calcDistance( latlng ) {
	var distance = google.maps.geometry.spherical.computeDistanceBetween( meLocation, latlng );
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
