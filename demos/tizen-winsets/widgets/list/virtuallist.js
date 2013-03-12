/* Gen list : Dummy DB load */
$("div.virtuallist_demo_page").one("pagecreate", function () {
	/* ?_=ts code for no cache mechanism */
	$.getScript( "virtuallist-db-demo.js", function ( data, textStatus ) {
		$("ul").filter( function () {
			return $( this ).data("role") == "virtuallistview";
		}).addClass("vlLoadSuccess");
		$("ul.ui-virtual-list-container").virtuallistview("create");
	});
});