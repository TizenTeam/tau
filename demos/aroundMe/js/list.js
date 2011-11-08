List = {
	setListFromPlacesSearch : function( list, results, refresh ) { 
		list.children().remove();

		for ( var i = 0; i < results.length; i++ ) {
			console.log( results[i] );
			var listContent = {
					dataId: results[i].id,
					id: "listItemId-" + i,
					href: "#",
					title: results[i].name,
					info: Map.calcDistance(meLocation, results[i].geometry.location),
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
				Detail.getDetailPage( $(list).data( $(this).attr("id") ).reference );
			});
		}
		if ( refresh ) {
			list.listview('refresh');
		}
	},

	toggleList : function( list ) {
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
					Detail.getDetailPage( $(list).data( $(this).attr("id") ).reference );
				});
			}
		}

		list.trigger( 'create' );
//		list.listview( 'refresh' );
	}


}
