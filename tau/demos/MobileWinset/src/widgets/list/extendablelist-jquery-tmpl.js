$("#genlist_extendable_page").one("pagecreate", function ( el ) {
	/*?_=ts code for no cache mechanism*/
	$.getScript( "./virtuallist-db-demo.js", function ( data, textStatus ) {
		$("ul.ui-extendable-list-container").extendablelist("create", {
			listItemUpdater: function ( idx ) {
				return JSON_DATA[ idx ];
			},
			dataLength: JSON_DATA.length
		});
	});
});