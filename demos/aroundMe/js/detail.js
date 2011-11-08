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
			Rating: place.rating,
			toString : function() {
				return this.Name + ", " + this.Address + ", " + this.Website + ", " + this.Category + ", " + this.Phone;
			}
		};

		var tpl = $.template( null, $("#detailViewTemplate") );
		$("#detailView").html( $.render( tpl, detail ) );

		$("#detailTitle").text( place.name );
		$("#detailTelBtn").attr('href',"callto:" + place.formatted_phone_number );
		$("#detailWebBtn").attr('href', place.website );

		var favoriteBtnDiv = '<form><input id="detailFavoriteBtn" type="checkbox" data-style="favorite" /></form>';
		$("#detailView").find("div span:nth-child(2)").first().after(favoriteBtnDiv);
		var favoriteBtn = $("#detailFavoriteBtn");
		favoriteBtn.attr("data-key", place.id );
		favoriteBtn.attr("data-store", JSON.stringify( place ) );
		favoriteBtn.checkboxradio();
		favoriteBtn.prop("checked", Favorite.isAlreadyStored( place.id ) );
		favoriteBtn.checkboxradio('refresh');
		favoriteBtn.bind("change", function(events, ui) {
			Detail.toggleFavorite($(this));
		});

		$("#sendPage").bind('pagebeforeshow', function() {
			Send.init( detail.Name, detail.toString() );
		});
	},

	toggleFavorite : function(btn) {
		if ( btn.prop("checked") ) {
			// remove favorite 
			Favorite.remove( $(btn).attr("data-key") );
			popSmallPopup( "Info", $("#detailTitle").text() + ' is removed from favorites.' );
			btn.prop("checked", false );
			btn.checkboxradio('refresh');
		} else {
			// add favorite
			Favorite.add( $(btn).attr("data-key"), $(btn).attr("data-store") );
			popSmallPopup( "Info", $("#detailTitle").text() + ' is added to favorites.' );
			btn.prop("checked", true );
			btn.checkboxradio('refresh');
		}
	}
}
