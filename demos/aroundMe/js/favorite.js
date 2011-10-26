function addFavorite()
{
	//TODO
	//alert("add to favorite.");
	if (gSource == "google")
	{
		if (gIsFavoriteBtnOn_google[gIndex] == false)
		{
			gIsFavoriteBtnOn_google[gIndex] = true;
			$("#ImgFavoriteOn").attr("src", "image/00_winset_icon_favorite_on.png");
			gFavoriteList.push(gLocalSearch.results[gIndex]);//gIndex
			gFavoriteIndex.push(gIndex);
            gFavoriteType.push("google");
		}
		else
		{
			gIsFavoriteBtnOn_google[gIndex] = false;
			$("#ImgFavoriteOn").attr("src", "image/00_winset_icon_favorite_off.png");
			gFavoriteList.pop();
			gFavoriteIndex.pop();
            gFavoriteType.pop();
		}
	}
	else
	{
		if (gIsFavoriteBtnOn_4s[gIndex] == false)
		{
			gIsFavoriteBtnOn_4s[gIndex] = true;
			$("#ImgFavoriteOn").attr("src", "image/00_winset_icon_favorite_on.png");
			gFavoriteList.push(gFqSearch[gIndex]);
			gFavoriteIndex.push(gIndex);
            gFavoriteType.push("foursquare");
		}
		else
		{
			gIsFavoriteBtnOn_4s[gIndex] = false;
			$("#ImgFavoriteOn").attr("src", "image/00_winset_icon_favorite_off.png");
			gFavoriteList.pop();
			gFavoriteIndex.pop();
            gFavoriteType.pop();
		}
	}

    saveFavoriteList();
}

function setFavoriteIcon()
{
	if (gSource == "google")
	{
		if (gIsFavoriteBtnOn_google[gIndex] == false)
		{
			$("#ImgFavoriteOn").attr("src", "image/00_winset_icon_favorite_off.png");
		}
		else
		{
			$("#ImgFavoriteOn").attr("src", "image/00_winset_icon_favorite_on.png");
		}
	}
	else
	{
		if (gIsFavoriteBtnOn_4s[gIndex] == false)
		{
			$("#ImgFavoriteOn").attr("src", "image/00_winset_icon_favorite_off.png");
		}
		else
		{
			$("#ImgFavoriteOn").attr("src", "image/00_winset_icon_favorite_on.png");
		}
	}
}

/* help function */
/*
Array.prototype.remove=function(dx)
{
	if(isNaN(dx)||dx>this.length){return false;}
	for(var i=0,n=0;i<this.length;i++)
	{
	    if(i == dx)
	    {
	        for(var j= i; j < this.length; j++)
	        {
	        	this[j] = this[j+1];
	        }
	    }
	}
	this.length-=1;
}
*/

function removeItemFromArray(obj, dx)
{
	if(isNaN(dx) || dx > obj.length)
    {
        return false;
    }
    
	for(var i = 0, n = 0; i < obj.length; i++)
	{
	    if(i == dx)
	    {
	        for(var j = i; j < obj.length; j++)
	        {
	        	obj[j] = obj[j + 1];
	        }
	    }
	}
	obj.length -= 1;
}

function enterFavoriteList()
{
	setFavoriteList();
	switchFavoriteView("favoriteList");
}

function enterFavoriteEditList()
{
	setFavoriteEditList();
	switchFavoriteView("favoriteEditList");
}

function setFavoriteList()
{

	if (gFavoriteList.length==0)
	{
		$('#favoriteList').html('<div class="favoriteViewNoContentText">No Favorites</div>');		
		return;
	}

	if ($('#favoriteList'))
	{
		$('#favoriteList').html("");
	}

	if ($('#favoriteListName'))
	{
		$('#favoriteListName').remove();
	}
	var favoriteList = new genlist("favoriteListName", "2line-texticoninfo");
	$('#favoriteList').append(favoriteList);

	for (var i=0; i < gFavoriteList.length; i++)
	{
		if (gFavoriteType[i] == "google")
		{
		    var address = ((gFavoriteList[i].streetAddress.length > 0) ? (gFavoriteList[i].streetAddress + ", ") : "")
                + ((gFavoriteList[i].city.length > 0) ? (gFavoriteList[i].city + ", ") : "")
                + ((gFavoriteList[i].region.length > 0) ? (gFavoriteList[i].region + ", ") : "")
                + ((gFavoriteList[i].country.length > 0) ? (gFavoriteList[i].country) : "");

            if(address.lastIndexOf(",") == address.length - 2)
            {
                address = address.substr(0, address.length - 2);
            }
        
			var listContent = {
				id: "favoriteListId"+i,
				href: "#",
				title: gFavoriteList[i].title,
				info: calcDistance(gFavoriteList[i].lat,gFavoriteList[i].lng),
				subTitle: address,
				imgSrc: "image/"+gGoogleCategoryImage[i%6]
				};
		}
		else
		{
		    var address = ((gFavoriteList[i].address.length > 0) ? (gFavoriteList[i].address + ", ") : "")
                + ((gFavoriteList[i].city.length > 0) ? (gFavoriteList[i].city + ", ") : "")
                + ((gFavoriteList[i].state.length > 0) ? (gFavoriteList[i].state + ", ") : "");

            if(address.lastIndexOf(",") == address.length - 2)
            {
                address = address.substr(0, address.length - 2);
            }
            
			var listContent = {
				id: "favoriteListId"+i,
				href: "#",
				title: gFavoriteList[i].name,
				info: gFavoriteList[i].distance + " m",
				subTitle: address,
				imgSrc: "image/"+gGoogleCategoryImage[i%6]
				};
		}
		var temp = "#favoriteListId"+i;
		
		addListItem(favoriteList, listContent);

		$(favoriteList).find('li').last().find("a").attr("href", "detailview/detailview.html");
		//setDetailViewData(ginfoIndex);

		$(favoriteList).find('li').last().click(function(){
				var tIndex = parseInt($(this).attr("id").substr(14,1));
				//ginfoIndex = gFavoriteIndex[tIndex];
				//setDetailViewData(ginfoIndex);
				setFavoriteDetailViewData(tIndex);
				//showView("detailView");
			});
	}
}

function setFavoriteEditList()
{
	if (gFavoriteList.length == 0)
	{
		$('#favoriteEditList').html('<div class="favoriteViewNoContentText">No Favorites</div>');		
		return;
	}

	if ($('#favoriteEditList'))
	{
		$('#favoriteEditList').html("");
	}

	if ($('#favoriteEditListName'))
	{
		$('#favoriteEditListName').remove();
	}
	myFavoriteList = new genlist("favoriteEditListName", "editmode-icon");

	$('#favoriteEditList').append(myFavoriteList);
	for (var i=0; i < gFavoriteList.length; i++)
	{
			if (gFavoriteType[i] == "google")
			{
	    var address = ((gFavoriteList[i].streetAddress.length > 0) ? (gFavoriteList[i].streetAddress + ", ") : "")
                + ((gFavoriteList[i].city.length > 0) ? (gFavoriteList[i].city + ", ") : "")
                + ((gFavoriteList[i].region.length > 0) ? (gFavoriteList[i].region + ", ") : "")
                + ((gFavoriteList[i].country.length > 0) ? (gFavoriteList[i].country) : "");

        if(address.lastIndexOf(",") == address.length - 2)
        {
            address = address.substr(0, address.length - 2);
        }
            
		var listContent = {
	    href: "#",
		id: "list" + i,
	    title: gFavoriteList[i].title,
	    subTitle: address,
	    imgSrc: "image/"+gGoogleCategoryImage[i%6],
	    inputGroup:"yourcheckbox" + i,
	    inputId: "test" + i
	    };
	}
	else
			{
			var address = ((gFavoriteList[i].address.length > 0) ? (gFavoriteList[i].address + ", ") : "")
                + ((gFavoriteList[i].city.length > 0) ? (gFavoriteList[i].city + ", ") : "")
                + ((gFavoriteList[i].state.length > 0) ? (gFavoriteList[i].state + ", ") : "");

            if(address.lastIndexOf(",") == address.length - 2)
            {
                address = address.substr(0, address.length - 2);
            }
			
			var listContent = {
	    href: "#",
		id: "list" + i,
	    title: gFavoriteList[i].name,
	    subTitle: address,
	    imgSrc: "image/"+gGoogleCategoryImage[i%6],
	    inputGroup:"yourcheckbox" + i,
	    inputId: "test" + i
	    };

		}
	
		addListItem(myFavoriteList, listContent);
	}
}

function DoneBtFn()
{
    var toDelArr = "";
	var delCount = 0;
	var toDelIndex;
	var toDelFavoriteType;

	if (gFavoriteList.length == 0)
	{
		enterFavoriteList();
		return;
	}

	if ($(myFavoriteList).find("#myselect3").attr("checked") == true)
	{
	    toDelArr.length = 0;
		//displayList();
		return;
	}
	toDelArr = gFavoriteList;
	toDelIndex = gFavoriteIndex;
	toDelFavoriteType = gFavoriteType;

	$(myFavoriteList).find('input').each(
		function()
		{
			if ($(this).attr("checked") == true)
			{
				var tIndex = parseInt($(this).attr("id").substr(4, $(this).attr("id").length -4));

                removeItemFromArray(toDelArr, tIndex-delCount);
                removeItemFromArray(toDelIndex, tIndex-delCount);
				removeItemFromArray(toDelFavoriteType, tIndex-delCount);
				//toDelArr.remove(tIndex-delCount);
				//toDelIndex.remove(tIndex-delCount);
				delCount++;
			}
		}
	);//each end
	gFavoriteList = toDelArr;
	gFavoriteIndex = toDelIndex;
	gFavoriteType = toDelFavoriteType;

    saveFavoriteList();

	enterFavoriteList();
	//save list
/*	if (currentList == "wishlist")
	{
		jsPrint("in  DeleteBtFn  for wish list  ");
		saveWishListFn();
	}
	else if (currentList == "historylist")
	{
		jsPrint("in  DeleteBtFn  for history list  ");
		saveHistoryFn();
	}
	else
	{
		return;
	}
*/
}

function switchFavoriteView(viewName)
{
	if (viewName == "favoriteList")
	{
		$("#favoriteList").css("display", "block");
		$("#favoriteEditList").css("display", "none");
	}
	else if (viewName == "favoriteEditList")
	{
		$("#favoriteList").css("display", "none");
		$("#favoriteEditList").css("display", "block");
	}
	else
	{}
}

function setFavoriteDetailViewData(infoindex)
{
	//TODO
	gDetailViewData = null;
	//addFavorite();
	setFavoriteIcon();
	if (gFavoriteType[infoindex] == "google")
	{
		if (gFavoriteList.length == 0) return;
		gDetailViewData = gFavoriteList[infoindex];//gIndex
		contactInfo.name= gDetailViewData.title;
		contactInfo.phonenumber =(gDetailViewData.phoneNumbers.length > 0) ? gDetailViewData.phoneNumbers[0].number : "";
        
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
        
		$("#InfoDistanceDiv").text(gDistance[infoindex]);//gIndex
		$("#InfoCategoryDiv").text("");
		$("#InfoDetailsDiv").text("");
		var tmpSrc = gDetailViewData.staticMapUrl;
		tmpSrc = tmpSrc.replace("150x100", "480x230");
		$("#ImgStaticMap").attr("src", tmpSrc);
	}
	else if (gFavoriteType[infoindex] == "foursquare")
	{
		gDetailViewData = gFavoriteList[infoindex];//gIndex
		contactInfo.name = gDetailViewData.name;
		contactInfo.phonenumber = (gDetailViewData.phone != undefined) ? gDetailViewData.phone : "";

        contactInfo.address = ((gDetailViewData.address.length > 0) ? (gDetailViewData.address + ", ") : "")
            + ((gDetailViewData.city.length > 0) ? (gDetailViewData.city + ", ") : "")
            + ((gDetailViewData.state.length > 0) ? (gDetailViewData.state + ", ") : "");

        if(contactInfo.address.lastIndexOf(",") == contactInfo.address.length - 2)
        {
            contactInfo.address = contactInfo.address.substr(0, contactInfo.address.length - 2);
        }
        
		contactInfo.category = gDetailViewData.fullpathname;
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
        
		$("#InfoDistanceDiv").text(gDetailViewData.distance + "m");
		$("#InfoCategoryDiv").text(contactInfo.category);
		$("#InfoDetailsDiv").text("");
		//$("#ImgStaticMap").css("src", gDetailViewData.staticMapUrl);
	}
	else
	{

	}
}

var favoriteListLengthKey = "favoritelistlength";
var favoriteItemPrefix = "favoriteitem";

function saveFavoriteList()
{
    //save favorite with widget.preferences.setItem
    try
    {
        for(var index = 0; index < gFavoriteList.length; index++)
        {
            var toSaveString = "";
            if(gFavoriteType[index] == 'google')
            {
                toSaveString = 
                            'type-google' + ":::" +
                            gFavoriteIndex[index] + ":::" +
        					((gFavoriteList[index].title) ? gFavoriteList[index].title : " ") + ':::' +
        					((gFavoriteList[index].phoneNumbers) ? ((gFavoriteList[index].phoneNumbers.length > 0) ? gFavoriteList[index].phoneNumbers[0].number : " ") : " ") + ':::' +
        					((gFavoriteList[index].lat) ? gFavoriteList[index].lat : " ") + ':::' +
        					((gFavoriteList[index].lng) ? gFavoriteList[index].lng : " ") + ':::' +
        					((gFavoriteList[index].url) ? gFavoriteList[index].url : " ") + ':::' +
        					((gFavoriteList[index].staticMapUrl) ? gFavoriteList[index].staticMapUrl : " ") + ':::' +
        					((gFavoriteList[index].streetAddress) ? gFavoriteList[index].streetAddress : " ") + ':::' +
        					((gFavoriteList[index].city) ? gFavoriteList[index].city : " ") + ':::' +
        					((gFavoriteList[index].region) ? gFavoriteList[index].region : " ") + ':::' +
        					((gFavoriteList[index].country) ? gFavoriteList[index].country : " ");
            }            
            else
            {
                toSaveString = 
                            'type-foursquare' + ":::" +
                            gFavoriteIndex[index] + ":::" +
        					((gFavoriteList[index].name) ? gFavoriteList[index].name : " ") + ':::' +
        					((gFavoriteList[index].phone) ? gFavoriteList[index].phone : " ") + ':::' +
        					((gFavoriteList[index].geolat) ? gFavoriteList[index].geolat : " ") + ':::' +
        					((gFavoriteList[index].geolong) ? gFavoriteList[index].geolat : " ") + ':::' +        					
        					((gFavoriteList[index].address) ? gFavoriteList[index].address : " ") + ':::' +
        					((gFavoriteList[index].city) ? gFavoriteList[index].city : " ") + ':::' +
        					((gFavoriteList[index].state) ? gFavoriteList[index].state : " ") + ':::' +        					
        					((gFavoriteList[index].fullpathname) ? gFavoriteList[index].fullpathname : " ") + ':::' +
        					((gFavoriteList[index].distance) ? gFavoriteList[index].distance : " ");
            }
            var keyString = favoriteItemPrefix + index;
            widget.preferences.setItem(keyString, toSaveString);
        }

        widget.preferences.setItem(favoriteListLengthKey, gFavoriteList.length);    
    }
    catch(e)
    {
        //alert("Cannot save data");
    }
}

function getFavoriteList()
{
    try
    {
        //get favorite with widget.preferences.getItem
        var listLength = widget.preferences.getItem(favoriteListLengthKey);

        for(var index = 0; index < listLength; index++)
        {
            var keyString = favoriteItemPrefix + index;
            var contentString = widget.preferences.getItem(keyString);

            var splitContent = contentString.split(':::');

            var item = {};

            if(splitContent[0] == 'type-google')
            {
                //alert("google");
                gFavoriteType.push("google");
                gFavoriteIndex.push(parseInt(splitContent[1]));
                
                item = {
            			title: splitContent[2],
            			phoneNumbers: [{number:splitContent[3]}],
            			lat: parseFloat(splitContent[4]),
            			lng: parseFloat(splitContent[5]),
            			url: splitContent[6],
            			staticMapUrl: splitContent[7],
            			streetAddress: splitContent[8],
            			city: splitContent[9],
            			region: splitContent[10],
            			country: splitContent[11]
        			};			
            }
            else if(splitContent[0] == 'type-foursquare')
            {
                //alert("foursquare");
                gFavoriteType.push("foursquare");
                gFavoriteIndex.push(parseInt(splitContent[1]));
                item = {
            			name: splitContent[2],
            			phone: splitContent[3],
            			geolat: parseFloat(splitContent[4]),
            			geolong: parseFloat(splitContent[5]),            			
            			address: splitContent[6],
            			city: splitContent[7],
            			state: splitContent[8],
            			fullpathname: splitContent[9],
            			distance: splitContent[10]
        			};    			
            }
            else
            {
                continue;
            }

            gFavoriteList.push(item);
        }  

    }
    catch(e)
    {
        //alert("Cannot get data");
    }

    //widget.preferences.setItem(favoriteListLengthKey, 0);
}

