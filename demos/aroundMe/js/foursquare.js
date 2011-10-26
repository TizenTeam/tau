function switchSource()
{
	if ($('#aroundmeListPlaceName'))
	{
		$('#aroundmeListPlaceName').remove();
	}

	if (gSource == "google")
	{
		gSource = "foursquare";
		$('#googleVsfq').text("Google");
		initFoursquareSearch();
		showView("aroundmeListView");
	}
	else 
	{
		gSource = "google";
		$('#googleVsfq').text("4square");
		showView("aroundmeListView");
		//googlePreload();
        executeSearch("category:restaurants");
        setSearchCategoryList();
	}
}

function initFoursquareSearch()
{    
	executeFoursquareSearch("");
	setFqSearchCategoryList();
}

function executeFoursquareSearch(query)
{
    showLoadingScreen();
	initGoogleMap();

    function foursquareSearchCB (lat, lng)
    {
        gFqSearch = [];
    	var fqUrl;

        meLocation = new google.maps.LatLng(lat, lng);
        //meLocation = new google.maps.LatLng(ME_LOCATION_LAT, ME_LOCATION_LNG);
        
    	if (query == "") {
    		fqUrl = 'http://api.foursquare.com/v1/venues.json?geolat=' + lat + '&geolong=' + lng + '&l=8';
        } else {
    		fqUrl = 'http://api.foursquare.com/v1/venues.json?geolat=' + lat + '&geolong=' + lng + '&l=8&q=' + query;
        }

    	$.ajax({
    		url: fqUrl,
    		async: true,
    		dataType: 'json',
    		type: 'get',
    		success : function(venues){
    			if ((venues == undefined) || (venues.groups == undefined) || (venues.groups.length == 0)) 
    			{
    			    alert("No search result");
                    hideLoadingScreen();
                    fqCategorySearch = false;
    				return;
    			}

    			for(var g=0;g<venues.groups.length;g++) 
    			{
    				var varray=venues.groups[g].venues;
                    /*
                    if(varray.length == 0)
                    {
                        alert("No search result");
                        fqCategorySearch = false;
				        return;
                    }
                    */

    				for(var v=0;v<varray.length;v++) 
    				{
    					var tmpVenue = varray[v];					
    					gFqSearch.push(varray[v]);
    				}
    			}
    			setAutoZoom(gMap, gFqSearch);
    			//setSearchLocation(gFqSearch);
    			setFqAroundmeList();
    			setFqSearchList();

                if(fqCategorySearch == true)
                {
                    switchSearchResult("searchListPlace");
			        $("#searchListCategory").hide();
                }
                
                hideLoadingScreen();
                fqCategorySearch = false;
    		},
    		error: function(){
    			//alert("Network error");
    			gSource = "google";
    			$('#googleVsfq').text("4square");
    			//googlePreload();
    			executeSearch("category:restaurants");
                setSearchCategoryList();

    			if ($('#searchListPlaceName'))
    			{
    				$('#searchListPlaceName').remove();
    			}
    			if ($('#aroundmeListPlaceName'))
    			{
    				$('#aroundmeListPlaceName').remove();
    			}
                fqCategorySearch = false;
    		},
    	});
    }

    function fqSearchErrorCB()
    {
        hideLoadingScreen();
        fqCategorySearch = false;
    }
    
    getCurrentLocation(foursquareSearchCB, fqSearchErrorCB);
	
}

function optimizeDistance(distance)
{
	if (distance > 999 && distance <= 10000)
	{
		return Math.round(distance/100)/10 + 'km';
	}
    else if(distance > 10000)
    {
        return Math.round(distance/1000) + 'km';
    }        
	else
	{
		return distance + 'm';
	}
}

var fqCategorySearch = false;
function setFqSearchCategoryList()
{
	switchSearchResult("aroundmeListPlace");
	// create search category list
	if ($('#searchListCategoryName'))
	{
		$('#searchListCategoryName').remove();
	}
	var mylist = new genlist("searchListCategoryName", "1line-texticon50");
	$('#searchListCategory').append(mylist);
	//alert("test searchListCategory"+gGoogleCategory.length);
	for (var i=0; i < gGoogleCategory.length; i++)
	{	   		 
		var listContent = {
			id: "searchListCategoryId"+i,
			href: "#",
			title: gGoogleCategory[i],
			imgSrc: "image/"+gGoogleCategoryImage[i]
			};
		var temp = "#searchListCategoryId"+i;

		addListItem(mylist, listContent);

		$(mylist).find('li').last().click(function(){
				var tIndex = parseInt($(this).attr("id").substr(20,1));
				var query = gfqCategory[tIndex];

                fqCategorySearch = true;

				executeFoursquareSearch(query);
				//switchSearchResult("searchListPlace");
				//$("#searchListCategory").hide();
			});
	}
}

function showFqMapInfo()
{
	setAutoZoom(gMap, gFqSearch);
	setSearchLocation(gFqSearch, gIndex);

	// Move the map to the selected result
	var selected = gFqSearch[gIndex];
	gMap.setCenter(new google.maps.LatLng(parseFloat(selected.geolat),
										parseFloat(selected.geolong)));
}

function setFqSearchList()
{
	// create search list
	if ($('#searchListPlaceName'))
	{
		$('#searchListPlaceName').remove();
	}
	var myPlacelist = new genlist("searchListPlaceName", "2line-texticoninfo");
	$('#searchListPlace').append(myPlacelist);
	//alert("test searchListPlace"+gLocalSearch.results.length);
	for (var i=0; i < gFqSearch.length; i++)
	{	   		 
	    var address = ((gFqSearch[i].address.length > 0) ? (gFqSearch[i].address + ", ") : "")
                + ((gFqSearch[i].city.length > 0) ? (gFqSearch[i].city + ", ") : "")
                + ((gFqSearch[i].state.length > 0) ? (gFqSearch[i].state + ", ") : "");

        if(address.lastIndexOf(",") == address.length - 2)
        {
            address = address.substr(0, address.length - 2);
        }
            
		var listContent = {
			id: "searchListPlaceId"+i,
			href: "#",
			title: gFqSearch[i].name,
			info: optimizeDistance(gFqSearch[i].distance),
			subTitle: address,
			imgSrc: "image/"+gGoogleCategoryImage[1]
			};
		var temp = "#searchListPlaceId"+i;
		
		addListItem(myPlacelist, listContent);
		$(myPlacelist).find('li').last().click(function(){
				var tIndex = parseInt($(this).attr("id").substr(17,1));
				gIndex=tIndex;
                showFqMapInfo();
				setDetailViewData();
				showView("aroundmeMapView");
			});
	}
}

function setFqAroundmeList()
{
	// create around me list
	if ($('#aroundmeListPlaceName'))
	{
		$('#aroundmeListPlaceName').remove();
	}
	var myPlacelist = new genlist("aroundmeListPlaceName", "2line-texticoninfo");
	$('#aroundmeListPlace').append(myPlacelist);
	//alert("test aroundmeListPlace"+gLocalSearch.results.length);
	for (var i=0; i < gFqSearch.length; i++)
	{
	    var address = ((gFqSearch[i].address.length > 0) ? (gFqSearch[i].address + ", ") : "")
                + ((gFqSearch[i].city.length > 0) ? (gFqSearch[i].city + ", ") : "")
                + ((gFqSearch[i].state.length > 0) ? (gFqSearch[i].state + ", ") : "");

        if(address.lastIndexOf(",") == address.length - 2)
        {
            address = address.substr(0, address.length - 2);
        }
        
		var listContent = {
			id: "searchAMListPlaceId"+i,
			href: "#",
			title: gFqSearch[i].name,
			info: optimizeDistance(gFqSearch[i].distance),
			subTitle: address,
			imgSrc: "image/"+gGoogleCategoryImage[1]
			};
		var temp = "#aroundmeListPlaceId"+i;
		
		addListItem(myPlacelist, listContent);
		$(myPlacelist).find('li').last().click(function(){
				var tIndex = parseInt($(this).attr("id").substr(19,1));
				gIndex=tIndex;
                showFqMapInfo();
				setDetailViewData();
				showView("aroundmeMapView");
			});
	}
}

