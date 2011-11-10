function initDB(){
	/* ?_=ts code for no cache mechanism */
	$.getScript(pb_dbsrc + "?_=ts2477874287", function(data, textStatus)
	{
		$("ul").filter(function(){return $(this).data("role")=="virtuallistview";}).addClass("vlLoadSucess");
	});
};

$("#queryInput").live( "input", function(events, ui) {
	
	var query = "";
	query = ".*" + $("#queryInput").val();

	search(window[pb_dbtable], pb_searchField, query);
});

/* Start Phonebook App initialization */
initDB();