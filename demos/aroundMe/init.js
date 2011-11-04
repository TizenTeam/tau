
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

initUi();
initSearchSettings();
initGoogle();

function initUi() {
	Favorite.create();
	$.mobile.showPageLoadingMsg();
		
	$("#favoritePage").bind( 'pagebeforeshow', function() {
		setListFromPlacesSearch( $("#favoriteList"), Favorite.getWholeList(), true );
	});	
		
	$("#queryInput")
		.live( "change", function(events, ui) {
			executeSearch( events.target.value );
		});
	
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

	$("#editFavoriteHeader").hide();
	$("#toggleEditBtn").bind( "vclick", function(events, ui) {
		toggleList( $("#favoriteList") );
		$("#editFavoriteHeader").toggle(); // bug
	});
	
	$("#editSelectAllBtn").bind( "vclick", function(events, ui) {
		var checks = $("#favoriteList").find('input');
		for ( var i = 0; i < checks.length; i++ ) {
			checks[i].checked = true;
		};
	});

	$("#editDeleteBtn").bind( "vclick", function(events, ui) {
		var dels = new Array();
		var checks = $("#favoriteList").find('input');
		for ( var i = 0; i < checks.length; i++ ) {
			if( checks[i].checked ) {
				dels.push( $(checks[i]).parent().parent().attr("data-id") );
			}
		}
		Favorite.remove.apply( Favorite, dels );
		setListFromPlacesSearch( $("#favoriteList"), Favorite.getWholeList(), true );
	});

	$("#checkFavorite").change( function(events, ui) {
		switchFavorite();
		console.log(events);
	});

	initSearchCategoryList();
}

function initSearchSettings() {
	if ( window.localStorage ) {
		var radius = window.localStorage.getItem( "searchRadius" );
		if ( radius ) {
			console.log("searchRadius:" + radius);
			$("#searchRadius").attr("value",radius);
		} else {
			console.log("SearchRadius not found");
		}
		var category = window.localStorage.getItem( "searchCategory" );
		if ( category ) {
			switch ( category ) {
			default:
			case 'all':
				$("#segmentAll").val("on").attr("checked", "checked");
				break;
			case 'art':
				$("#segmentArt").val("on").attr("checked", "checked");
				break;
			case 'education':
				$("#segmentEducation").val("on").attr("checked", "checked");
				break;
			case 'travel':
				$("#segmentTravel").val("on").attr("checked", "checked");
				break;
			case 'restaurants':
				$("#segmentRestaurants").val("on").attr("checked", "checked");
				break;
			case 'bar':
				$("#segmentBar").val("on").attr("checked", "checked");
				break;
			}
		} else {
			$("#segmentAll").val("on").attr("checked", "checked");
		}
		$("#searchSettingsConfirmBtn").live( 'vclick', function() {
			window.localStorage.setItem( "searchRadius", $("#searchRadius").val() );
//@FIXME FINDOUT HOW TO GET RADIO OR CHECKED VALUES
			var on = $("#searchCategory").find('[value="on"]');
			console.log( on );

			$("#searchSettingPopup").popupwindow('close');
		});

		$("#searchSettingsCancelBtn").live( 'vclick', function() {
			var radius = window.localStorage.getItem( "searchRadius" );
			if ( radius ) {
				$("#searchRadius").val(radius);
			} else {
				$("#searchRadius").val(5000);
			}

			$("#searchSettingPopup").popupwindow('close');
		});
	} else {
		alert("Can't locate LocalStorage");
	}
}

function initGoogle() {
	gMap = $("#map").gmap();
	googlePreload();
}

function googlePreload() {
	getCurrentLocation( firstSearch, noLocationInfo );

	$.mobile.hidePageLoadingMsg();	
}

function showListMap( list ) {
	// because jquery data stores its data into $.cache, 
	// save somewhere else before change pages
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
				dataId: results[i].id,
				id: "listItemId-" + i,
				href: "#",
				title: results[i].name,
				info: calcDistance(results[i].geometry.location),
				subTitle: results[i].vicinity,
				imgSrc: results[i].icon
			};
		
		// is this only option for these things? can we make it these to better way?
		var item = '<li class="ui-li-3-2-14" data-id="' + listContent.dataId + '" id="' + listContent.id + '">' + 
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

function toggleList( list ) {
	$( list ).find(".ui-li-text-sub2").toggle();
	li = list.find('li');
	for ( var i = 0; i < li.length; i++ ) {
		$( li[i] ).toggleClass("ui-li-3-2-14").toggleClass("ui-li-3-2-20");

		if ( $( li[i] ).hasClass( "ui-li-3-2-20" ) ) {
			var div = '<form><input type="checkbox" data-style="check" name="' + $( li[i] ).attr("id") + '_check' + '" /></form>';
			$(li[i]).find( ".ui-li-text-sub" ).after( div );
			$( li[i] ).unbind("vclick");		
		} else {
			$( li[i] ).find( 'form' ).remove();
			$( li[i] ).bind("vclick", function() {
				getDetailPage( $(list).data( $(this).attr("id") ).reference );
			});
		}
	}

	list.listview( 'refresh' );
}

function switchFavorite() {
	if ( $("#checkFavorite").attr("checked") ) {
		// remove favorite 
		Favorite.remove( $("#checkFavorite").attr("data-key") );
		popSmallPopup( "Info", $("#detailTitle").text() + ' is removed from favorites.' );
		$("#checkFavorite").attr("checked", false );
		$("#checkFavorite").checkboxradio("refresh");
	} else {
		// add favorite
		Favorite.add( $("#checkFavorite").attr("data-key"), $("#checkFavorite").attr("data-store") );
		$("#checkFavorite").attr("checked", true );
		$("#checkFavorite").checkboxradio("refresh");
		popSmallPopup( "Info", $("#detailTitle").text() + ' is added to favorites.' );
	}
}

function getDetailPage( reference ) {
	gMap.gmap( 'placesDetail', { 'reference': reference }, showDetailPage );
}

function showDetailPage( place, status ) {
	if ( status == google.maps.places.PlacesServiceStatus.OK ) {
		$("#detailTitle").text( place.name );
		// set favorite here!
		$("#checkFavorite").attr("data-key", place.id );
		$("#checkFavorite").attr("data-store", JSON.stringify( place ) );
		$("#checkFavorite").attr("checked", Favorite.isAlreadyStored( place.id ) );

		if ( place.website ) { 
			$("#detailWeb").text( place.website ); 
			$("#detailWebBtn").attr("href", place.website );
			$("#detailWebBtn").attr("disabled", "disabled");
		} else {
			$("#detailWeb").text("Unknown");
		}
		if ( place.formatted_address ) {
			$("#detailAddress").text( place.formatted_address );
		} else {
			$("#detailAddress").text("Unknown");
		}
		if ( place.types.length > 0 ) {
			var category = "";
			for ( var i = 0; i < place.types.length; i++ ) {
				category += place.types[i] + " ";
			}
			$("#detailCategory").text( category );
		} else {
			$("#detailCategory").text( "Unknown" );
		}
		if ( place.formatted_phone_number ) {
			$("#detailTel").text( place.formatted_phone_number );
			$("#detailTelBtn").attr("href", "tel:" + place.formatted_phone_number );
		} else {
			$("#detailTel").text( "Unknown" );
			$("#detailTelBtn").attr("disabled", "disabled");
		}
		if ( place.rating ) {
			$("#detailRating").text( place.rating );
		} else {
			$("#detailRating").text( "Unknown" );
		}
		$.mobile.changePage("#detailPage");
		$("#checkFavorite").checkboxradio("refresh");
		console.log( place );
	} else {
		alert( 'no results' );
	}
}

function popSmallPopup( message1, message2 ) {
	var popupdiv = '<div data-role="smallpopup" id="resultPopup" data-text1="' + message1 + '" data-text2="' + message2  + '" data-interval="3000"></div>';
	if ( $("#resultPopup") ) {
		$("#resultPopup").remove();
	}
	$.mobile.activePage.find('[data-role="content"]').append( popupdiv );
	var popup = $("#resultPopup");
	popup.smallpopup();
	popup.smallpopup('show');
	popup.bind('tapped', function() {
		$("#resultPopup").smallpopup('hide');
		$("#resultPopup").remove();
	});
}

function popConfirmPopup( message1 ) {
	var popdiv = '<div id="confirmPopup" data-role="poppupwindow" data-style="center_basic_1btn">' +
				'<p data-role="text">' + 
				message1 + 
				'</p>' +
				'<div id="confirmPopupBtn" data-role="button-bg"><input type="button" value="CONFIRM /></div>' + 
				'</div>';
	if ( $("#confirmPopup") ) {
		$("#confirmPopup").remove();
	}	
	$.mobile.activePage.find('[data-role="content"]').append( popdiv );
	var popup = $("#confirmPopup");
	popup.popupwindow();
	popup.popupwindow('open' );	
	$("#confirmPopupBtn").bind( 'vclick', function() {
		$("#confirmPopup").popupwindow('close');
		$("#confirmPopup").remove();
	});
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
	function realSearch( lat, lng ) {
		meLocation = new google.maps.LatLng( lat, lng );
	
		gMap.gmap( 'placesSearch', { 
			location: meLocation,
			radius: $("#searchRadius").val(),
			keyword: query
		}, onSearch );			
	}
	
	getCurrentLocation( realSearch, null );
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
