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
			Address: place.formatted_address ? place.formatted_address : "",
			Website: place.website ? place.website : "",
			Category: place.types.join(", "),
			Phone: place.formatted_phone_number ? place.formatted_phone_number : "",
			//Rating: place.rating ? place.rating : "",
			toString : function() {
				return this.Name + ", " + this.Address + ", " + this.Website + ", " + this.Category + ", " + this.Phone;
			}
		};

		var tpl = $.template( null, $("#detailViewTemplate") );
		$("#detailView").html( $.render( tpl, detail ) );
		if ( place.rating ) {
			console.log( this.getRatingStar( place.rating ));
			$("#detailView").find('div span[name="rating"]').append( this.getRatingStar( place.rating ) );
		}

		$("#detailTitle").text( place.name );
		$("#detailTelBtn").attr('href',"callto:" + place.formatted_phone_number );
		$("#detailWebBtn").attr('href', place.website );

		var favoriteBtnDiv = '<form><input id="detailFavoriteBtn" type="checkbox" data-style="favorite" /></form>';
		$("#detailView").find('div span[name="name"]').before(favoriteBtnDiv);
		var favoriteBtn = $("#detailFavoriteBtn");
		favoriteBtn.attr("data-key", place.id );
		favoriteBtn.attr("data-store", JSON.stringify( place ) );
		favoriteBtn.prop("checked", Favorite.isAlreadyStored( place.id ) );
		favoriteBtn.checkboxradio();
		favoriteBtn.bind("change", function(events, ui) {
			Detail.toggleFavorite($(this));
		});

		$("#sendPage").bind('pagebeforeshow', function() {
			Send.init( detail.Name, detail.toString() );
		});

		$("#detailMapBtn").live('vclick', function() {
			Map.showDetailMap( JSON.parse($("#detailFavoriteBtn").attr("data-store")) );
		});
	},

	getRatingStar : function( point ) {
		var divStart = '<div class="star" ';
		var divEnd = '></div>';
		var str = "";
		for ( var rating = parseFloat( point ); rating > 0; rating-=1 ) {
			str += divStart;
			if ( rating < 1 ) {
				str += 'style="width:' + (50 * rating) + 'px;"'; // suppose star width is 50px
			}
			str += divEnd;
		}
		return str;
	},

	toggleFavorite : function(btn) {
		if ( !btn.prop("checked") ) {
			// remove favorite 
			Favorite.remove( $(btn).attr("data-key") );
			popSmallPopup( "Info", $("#detailTitle").text() + ' is removed from favorites.' );

		} else {
			// add favorite
			Favorite.add( $(btn).attr("data-key"), $(btn).attr("data-store") );
			popSmallPopup( "Info", $("#detailTitle").text() + ' is added to favorites.' );

		}
	}
}
