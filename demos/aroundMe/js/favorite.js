var ITEM_SP = ":::";
var ITEM_KEY_PREFIX = "AMF_";
function saveFavoriteList( ) {
	try {
		for ( var i = 0; i < gFavoriteList.length; i++ ) {
			var toSaveString = "";
			var title = gFavoriteList[i].title ? gFavoriteList[i].title : " ";
			var phoneNumbers = gFavoriteList[i].phoneNumbers ? ( gFavoriteList[i].phoneNumbers.length > 0 ? gFavoriteList[i].phoneNumbers[0].number : " " ) : " ";
			var lat = gFavoriteList[i].lat || " ";
			var lng = gFavoriteList[i].lng || " ";
			var url = gFavoriteList[i].url || " ";
			var staticMapUrl = gFavoriteList[i].staticMapUrl || " ";
			var streetAddress = gFavoriteList[i].streetAddress || " ";
			var city = gFavoriteList[i].city || " ";
			var region = gFavoriteList[i].region || " ";
			var country = gFavoriteList[i].country || " ";
			
			toSaveString = title + ITEM_SP + 
						phoneNumbers + ITEM_SP + 
						lat + ITEM_SP + 
						lng + ITEM_SP + 
						url + ITEM_SP + 
						staticMapUrl + ITEM_SP + 
						streetAddress + ITEM_SP + 
						city + ITEM_SP + 
						region + ITEM_SP + 
						country;
			
			var keyString = ITEM_KEY_PREFIX + i;
			
			widget.preferences.setItem( keyString, toSaveString );
		}
		
		var keyString = ITEM_KEY_PREFIX + "LENGTH";
		widget.preferences.setItem( keyString, gFavoriteList.length );
		
	} catch ( e ) {
		alert( "Cannot save favorite list. " + e );	
	}
}

function FavoriteItem( savedString ) {
	
	if ( savedString ) {
		
	} 
				
	this.toHTMLString = function() {
		
	}
	
	this.toSaveString = function() {
		
	}
}
