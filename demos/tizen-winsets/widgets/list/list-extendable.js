$("#genlist_extendable_page").one("pagecreate", function ( el ) {
	/*?_=ts code for no cache mechanism*/
	$.getScript( "./virtuallist-db-demo.js", function ( data, textStatus ) {
		$("ul").filter( function () {
			return $( this ).data("role") == "extendablelist";
		}).addClass("elLoadSuccess");
		$("ul.ui-extendable-list-container").extendablelist("create");
		// TODO: 'create' is called twice!!
	});
});