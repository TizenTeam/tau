function initDB(){
	/* ?_=ts code for no cache mechanism */
	$.getScript(pb_dbsrc + "?_=ts2477874287", function(data, textStatus)
	{
		$("ul").filter(function(){return $(this).data("role")=="virtuallistview";}).addClass("vlLoadSuccess");
	
		/* Set counts */
		nb_contacts = window[pb_dbtable].length;
		nb_groups = 0;
	
		Phonebook.pushContactsTitle("#all_contacts_header h1", "#" + "tmpl_contacts_title", nb_contacts);
		
		$("ul.ui-virtual-list-container").virtuallistview("create");
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


/* Groups page : Get group list */
$("#all_groups_page").bind("pagebeforecreate", function(){
	
	/* Set Group list's first item : All contacts (N) */
	Phonebook.pushContactsTitle("#All_contacts_on_groups_list span", "#"+"tmpl_contacts_title", nb_contacts);
	
	/* Make Group list data structure */
	var groupedList = Phonebook.makeGroupList(window[pb_groupdbtable]);
	
	Phonebook.pushGourpedList("#all_groups_list", "#tmpl_groups_expandable_groupName", "#tmpl_groups_expandable_groupItem", groupedList, pb_dbtable);
});

/* Start Phonebook App initialization */
initDB();