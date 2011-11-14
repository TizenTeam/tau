function initDB(){
	/* ?_=ts code for no cache mechanism */
	$.getScript(pb_dbsrc + "?_=ts2477874287", function(data, textStatus)
	{
		$("ul").filter(function(){return $(this).data("role")=="virtuallistview";}).addClass("vlLoadSucess");
	
		/* Set counts */
		nb_contacts = window[pb_dbtable].length;
		nb_groups = 0;
	
		Phonebook.pushContactsTitle("#all_contacts_header h1", "tmpl_contacts_title", nb_contacts);
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