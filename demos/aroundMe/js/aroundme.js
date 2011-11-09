AroundMe = {
	init : function() {
		$.mobile.showPageLoadingMsg();
		Favorite.create();

		this.initUi();
		this.initSearchSettings();
		this.initGoogle();
		$.mobile.hidePageLoadingMsg();
	},
	
	initUi : function() {
		$("#firstPage").bind('pagebeforeshow', function() {
			console.log("a");
			Map.getCurrentLocation( AroundMe.firstSearch );
		});

		$("#favoritePage").bind( 'pagebeforeshow', function() {
			var list = Favorite.getWholeList();
			if ( list.length > 0 ) {
				List.setListFromPlacesSearch( $("#favoriteList"), Favorite.getWholeList(), true );	
			} else {
				popSmallPopup( "Error", "No favorite locations added." );
			}			
		});	
		
		$("#detailSearchBtn").bind( 'vclick', function() {
			$(this).attr("href", "http://www.google.com/?q=" + $("#detailTitle").text() );
		});

		$("#sendBtn").bind( 'vclick', function() {
			$(this).attr("href", Send.toWACHref());
		});

		$("#favoriePage").bind( 'pagebeforehide', function() {
			$("#editFavoriteHeader").hide();
		});
		
		$("#queryInput")
			.live( "change", function(events, ui) {
				AroundMe.executeSearch( events.target.value );
			});
	
		$("#listBtn").bind( "vclick", function(events, ui) {
			window.history.back();
		});

		$("#mapSearchBtn").bind( "vclick", function(events, ui) {
			Map.showListMap( $("#searchList") );
		});

		$("#mapBtn").bind( "vclick", function(events, ui) {
			Map.showListMap( $("#aroundmeList") );
			Map.getCurrentLocation( Map.setCenter );
		});

		$("#editFavoriteHeader").hide();
		$("#toggleEditBtn").bind( "vclick", function(events, ui) {
			List.toggleList( $("#favoriteList") );			
		});
	
		$("#editSelectAllBtn").bind( "vclick", function(events, ui) {
			var checks = $("#favoriteList").find('input');
			for ( var i = 0; i < checks.length; i++ ) {
				$(checks[i]).prop("checked", true );
				$(checks[i]).checkboxradio('refresh');
			};
		});

		$("#editDeleteBtn").bind( "vclick", function(events, ui) {
			var dels = new Array();
			var checks = $("#favoriteList").find('input[type="checkbox"]');
			for ( var i = 0; i < checks.length; i++ ) {
				if( $(checks[i]).prop("checked") ) {
					dels.push( $(checks[i]).parent().parent().parent().attr("data-id") );
				}
			}
			Favorite.remove.apply( Favorite, dels );
			List.setListFromPlacesSearch( $("#favoriteList"), Favorite.getWholeList(), true );
		});
	
		this.initSearchCategoryList();
	},
	
	initSearchCategoryList : function() {
		var li = $("#searchCategoryList").find('li');
	
		for ( var i = 0; i < li.length; i++ ) {
			$(li[i]).bind("vclick", function() {
				AroundMe.executeSearch( $(this).attr("data-query") );
			});
		}
	}, 

	initSearchSettings : function() {
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
					$("#segmentAll").prop("checked", true);
					break;
				case 'art':
					$("#segmentArt").prop("checked", true);
					break;
				case 'education':
					$("#segmentEducation").prop("checked", true);
					break;
				case 'travel':
					$("#segmentTravel").prop("checked", true);
					break;
				case 'restaurants':
					$("#segmentRestaurants").prop("checked", true);
					break;
				case 'bar':
					$("#segmentBar").prop("checked", true);
					break;
				}
			} else {
				$("#segmentAll").prop("checked", true);
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
	}, 

	initGoogle : function() {
		Map.init($("#map"));	
	},

	firstSearch : function( lat, lng ) {
		meLocation = new google.maps.LatLng( lat, lng );
	
		var parm = { 
			location: meLocation,
			radius: 5000,
			types: ['store']
		}
		
		Map.placesSearch( parm, AroundMe.onFirstSearch );
	},

	noLocationInfo : function() {
		console.log( "Cannot retreive your current location" );
	
		firstSearch( ME_LOCATION_LAT, ME_LOCATION_LNG );
	},

	onFirstSearch : function(results, status) {
		if ( status == google.maps.places.PlacesServiceStatus.OK ) {
			List.setListFromPlacesSearch( $("#aroundmeList"), results, true );
		
		} else if ( status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS ) {
			$("#aroundmeList").append("<li>No Results</li>");
			popSmallPopup( "Error", "No Results" );
		} else {
			console.log( "Exception on PlacesSearch" );
		}
	}, 

	onSearch : function(results, status) {	
		if ( status == google.maps.places.PlacesServiceStatus.OK ) {
			$.mobile.changePage("#searchResultPage");
			List.setListFromPlacesSearch( $("#searchList"), results, true );

		} else if ( status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS ) {
			popSmallPopup( "Error", "No Results" );
			console.log( "No Results" );
		} else {
			console.log( "Exception on PlacesSearch" );
		}
	},

	executeSearch : function( query ) {
		var param = { 
			radius: $("#searchRadius").val(),
			keyword: query
		}

		Map.placesSearch( param, AroundMe.onSearch );
	}	
}
