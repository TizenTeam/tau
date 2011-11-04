var ITEM_KEY_PREFIX = "AMF_";
var ITEM_SP = ":::";

function saveFavoriteList( list ) {
	try {
		for ( var i = 0; i < list.length; i++ ) {
			var keyString = ITEM_KEY_PREFIX + i;
			var toSaveString = list.toSaveString();
			widget.preferences.setItem( keyString, toSaveString );
		}
		
		var keyString = ITEM_KEY_PREFIX + "LENGTH";
		widget.preferences.setItem( keyString, list.length );
		
	} catch ( e ) {
		alert( "Cannot save favorite list. " + e );	
	}
}

function loadFavoriteList() {
	var keyString = ITEM_KEY_PREFIX = "LENGTH";
	var listLength = widget.preferences.getItem( keyString );
	
	var list = new FavoriteItem[ listLength ];

	for ( var i = 0; i < list.length; i++ ) {
		var contentString = widget.preferences.getItem( ITEM_KEY_PREFIX + i );
		var temp = new FavoriteItem( contentString );
		list.push( temp );
	} 			
	
	return list;
}

var FavoriteItem = function( object ) {

	if ( object instanceof String ) {
		var splitContent = object.split( ITEM_SP );
		this.id = splitContent[0];
		this.title = splitConent[1];
		this.phoneNumbers = splitContent[2];
		this.lat = splitContent[3];
		this.lng = splitContent[4];
		this.url = splitContent[5];
		this.staticMapUrl = splitContent[6];
		this.streetAddress = splitContent[7];
		this.city = splitContent[8];
		this.region = splitContent[9];
		this.country = splitContent[10];
	} else if ( object.title ) {
		this.title = object.title;
		this.phoneNumbers = object.phoneNumbers.length > 0 ? object.phoneNumbers[0].numbers : " ";
		this.lat = object.lat.length > 0 ? object.lat.length : " ";
		this.lng = object.lng.length > 0 ? object.lng.length : " ";
		this.url = object.url.length > 0 ? object.url.length : " ";
		this.staticMapUrl = object.staticMapUrl.length > 0 ? object.staticMapUrl : " ";
		this.streetAddress = object.streetAddress.length > 0 ? object.streetAddress : " ";
		this.city = object.city.length > 0 ? object.city : " ";
		this.region = object.region.length > 0 ? object.region : " ";
		this.country = object.country.length > 0 ? object.country : " ";
	}			
}

FavoriteItem.prototype.toHTMLString = function( id ) {
		var item = '<li class="ui-li-3-2-13"' + ( this.id ? (' id="' + this.id + '"' ) : "" ) + '>' + 
				'<span class="ui-li-text-main">' + this.title + '</span>' + 
				'<span class="ui-li-text-sub">' + this.streetAddress + ", " + this.city + ", " + this.region + ", " + this.country + '</span>' +
				'<img src="' + "" + '" class="ui-li-bigicon">' + '</li>';
		return item;
	}
	
FavoriteItem.prototype.toSaveString = function() {
	var id = this.id || " ";
	var title = this.title || " ";
	var phoneNumbers = this.phoneNumbers || " ";
	var lat = this.lat || " ";
	var lng = this.lng || " ";
	var url = this.url || " ";
	var staticMapUrl = this.staticMapUrl || " ";
	var streetAddress = this.streetAddress || " ";
	var city = this.city || " ";
	var region = this.region || " ";
	var country = this.country || " ";
	
	return title + ITEM_SP + 
			phoneNumbers + ITEM_SP + 
			lat + ITEM_SP + 
			lng + ITEM_SP + 
			url + ITEM_SP + 
			staticMapUrl + ITEM_SP + 
			streetAddress + ITEM_SP + 
			city + ITEM_SP + 
			region + ITEM_SP + 
			country;					
}
