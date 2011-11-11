function initDB(){
	/* ?_=ts code for no cache mechanism */
	$.getScript(pb_dbsrc + "?_=ts2477874287", function(data, textStatus)
	{
		$("ul").filter(function(){return $(this).data("role")=="virtuallistview";}).addClass("vlLoadSucess");
	});
};

$("#queryInput").live( "input", function(events) {
	
	var query = "";
	query = ".*" + $("#queryInput").val();

	Phonebook.search(window[pb_dbtable], pb_searchField, query);
});

$("#all_contacts_list li").live("click", function()
{
	Phonebook.getDetailview(window[pb_dbtable], $(this).data("pbid"));
});

/* Start Phonebook App initialization */
initDB();