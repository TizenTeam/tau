List = {
	setListFromPlacesSearch : function( list, results, refresh ) { 
		list.children().remove();
		list.unbind("vclick");
		var html = "";
		for ( var i = 0; i < results.length; i++ ) {
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

			html += item;
			$(list).data( listContent.id, results[i] );
		}

		list.append( html );
		
		$(list).bind("vclick", function( e ) {
			if ( $(e.target).parent("li") ) {
				Detail.getDetailPage( $(this).data( $(e.target).parent("li").attr("id") ).reference );				
			} else if ( $(e.target).is("li") ) {
				Detail.getDetailPage( $(this).data( $(e.target).attr("id") ).reference );
			}
		});
	
		if ( refresh ) {
			list.listview('refresh');
		}
	},

	toggleList : function( list ) {
		$("#editFavoriteHeader").toggle(); // bug
		var parent = $(list).parent();


		$( list ).find(".ui-li-text-sub2").toggle();
		$(list).detach();	
		li = list.find('li');
		
		if ( li.length > 0 ) {
			var checked = $( li[0] ).hasClass( "ui-li-3-2-14" );
			for ( var i = 0; i < li.length; i++ ) {
				$( li[i] ).toggleClass("ui-li-3-2-14").toggleClass("ui-li-3-2-20");

				if ( checked ) {
					var div = '<form><input type="checkbox" data-style="check" name="' + $( li[i] ).attr("id") + '_check' + '" /></form>';
					$( li[i] ).find( ".ui-li-text-sub" ).after( div );
				} else {
					$( li[i] ).find( 'form' ).remove();
				}
			}
			
			if ( checked ) {
				$( list ).unbind("vclick");
			} else {
				$( list ).bind("vclick", function( e ) {
					if ( $(e.target).parent("li") ) {
						Detail.getDetailPage( $(this).data( $(e.target).parent("li").attr("id") ).reference );				
					} else if ( $(e.target).is("li") ) {
						Detail.getDetailPage( $(this).data( $(e.target).attr("id") ).reference );
					}
				});
			}
				
			list.trigger( 'create' );
	//		list.listview( 'refresh' );

		}

		parent.append( list );
	}


}
