Detail = {


	getDetailPage : function( reference ) {
		Map.getDetail( reference, this.pushDetailPage );
	},

	pushDetailPage : function( place, status ) {
		if ( status == google.maps.places.PlacesServiceStatus.OK ) {
			$.mobile.changePage("#detailPage");
			Detail.showDetailPage( place );
		} else {
			alert( 'no results' );
		}
	},

	showDetailPage : function( place ) {
		var category = "";
	
		var detail = {
			Name: place.name,
			Address: place.formatted_address,
			Website: place.website,
			Category: place.types.join(", "),
			Phone: place.formatted_phone_number,
			Rating: place.rating
		};

		var tpl = $.template( null, $("#detailViewTemplate") );
		$("#detailView").html( $.render( tpl, detail ) );

		$("#detailTitle").text( place.name );
		$("#detailTelBtn").attr('href',"callto:" + place.formatted_phone_number );
		$("#detailWebBtn").attr('href', place.website );

		var favoriteBtnDiv = '<form><input type="checkbox" data-style="favorite" /></form>';
		$("#detailView").find("div span:first-child").first().append(favoriteBtnDiv);
		var favoriteBtn = $("#detailView").find("input");
		favoriteBtn.attr("data-key", place.id );
		favoriteBtn.attr("data-store", JSON.stringify( place ) );
		favoriteBtn.attr("checked", Favorite.isAlreadyStored( place.id ) );
		favoriteBtn.checkboxradio();
		favoriteBtn.bind("change", function(events, ui) {
			Detail.toggleFavorite($("#detailView").find("input"));
		});
		console.log("ch2ef");
	},

	toggleFavorite : function(btn) {
		console.log("toggle");
		console.log(btn);
		if ( btn.attr("checked") == 'true' ) {
			// remove favorite 
			Favorite.remove( $(btn).attr("data-key") );
			popSmallPopup( "Info", $("#detailTitle").text() + ' is removed from favorites.' );
			btn.attr("checked", false ).checkboxradio('refresh');
		} else {
			// add favorite
			Favorite.add( $(btn).attr("data-key"), $(btn).attr("data-store") );
			btn.attr("checked", true ).checkboxradio('refresh');
			popSmallPopup( "Info", $("#detailTitle").text() + ' is added to favorites.' );
		}
	}
}
