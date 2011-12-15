domReady(function(){
	

function initDB(){
	/* ?_=ts code for no cache mechanism */
	$.getScript(pb_dbsrc + "?_=ts2477874287", function(data, textStatus)
	{
		$("ul").filter(function(){return $(this).data("role")=="virtuallistview";}).addClass("vlLoadSuccess");
		
		/* DB Outer Join */
		/* It's just sample app that use not real DB, but JSON Array. */
		/* Later, real db system can support DB join by simple SQL query. */
		$(window[pb_dbtable]).each(function(index)
		{
			this.group = window[pb_groupdbtable][index].group;
			this.savedlocation = window[pb_groupdbtable][index].savedlocation;
		});

		/* Set counts */
		nb_contacts = window[pb_dbtable].length;
		nb_groups = 0;
	
		Phonebook.pushContactsTitle("#all_contacts_header h1", "#" + "tmpl_contacts_title", nb_contacts);
		
		$("ul.ui-virtual-list-container").virtuallistview("create");
	});
};

/* All contacts list */
$("#all_contacts_queryInput").live( "input", function(events) {
	
	var query = "";
	query = ".*" + $(this).val();

	Phonebook.search(window[pb_dbtable], query, "#all_contacts_list");
});

$("#all_contacts_list li, #contacts_list_main li").live("click", function()
{
	Phonebook.getDetailview(window[pb_dbtable], $(this).data("luid"));
});

/* After Create / Delete */
$("#all_contacts_page").live("pagebeforeshow", function(){
	if (db_changed == true)
	{
		/* Refresh Title */
		var nb_contacts = window[pb_dbtable].length;
		
		Phonebook.pushContactsTitle("#all_contacts_header h1", ".tmpl_title_with_count", nb_contacts);
		
		/* Refresh virtual list */
		$("#all_contacts_list").virtuallistview("create");
		
		/* clear flag */
		db_changed = false;
	}
});


/*$("#contacts_list_page").live("pagebeforeshow", function(){
	if (db_changed == true)
	{
		 Refresh Title 
		var nb_contacts = window[pb_dbtable].length;
		
		Phonebook.pushContactsTitle("#all_contacts_header h1", ".tmpl_title_with_count", nb_contacts);
		
		 Refresh virtual list 
		$(this).find("ul.ui-virtual-list-container").virtuallistview("create");
		
		
		 clear flag 
		db_changed = false;
	}
});
*/

/* Contacts list */
$("#contacts_list_queryInput").live( "input", function(events) {
	
	var query = "";
	query = ".*" + $(this).val();

	Phonebook.search(window[pb_dbtable], query, "#contacts_list_main");
});

/* Selected group's contacts list */
$("#all_groups_list li.ui-li-expanded.ui-li-expand-transition-show").live("click", function(event)
{
	/* Get Title and count */
	var titleString = $(this).text();
	var selectedGroup = $(this).attr("id");
	var selectedSaveLocation = $(this).data("expanded-by");
	
	/* Make selected group's contacts list */
	var contacts_in_group = Phonebook.makeContactlist(window[pb_dbtable], window[pb_groupdbtable], selectedSaveLocation, selectedGroup);
	
	/* Push data and page transition */
	Phonebook.pushContactList("#contacts_list_page", "#contacts_list_header h1", "#contacts_list_main", titleString, contacts_in_group);
}); 

/* Groups page : Get group list */
$("#all_groups_page").bind("pagebeforecreate", function(){
	
	/* Set Group list's first item : All contacts (N) */
	Phonebook.pushContactsTitle("#All_contacts_on_groups_list span", "#"+"tmpl_contacts_title", nb_contacts);
	
	/* Make Group list data structure */
	var groupedList = Phonebook.makeGroupList(window[pb_groupdbtable]);
	
	Phonebook.pushGourpedList("#all_groups_list", "#tmpl_groups_expandable_savedLocationName", "#tmpl_groups_expandable_groupName", groupedList);
});

/* Create contact page */
$("#create_contact_page").bind("pagebeforecreate", function(){
	$("#create_contact_cancel").bind("click", function(){
		window.history.back();
	});
});





/* Start Phonebook App initialization */
initDB();

}); //End of Dom Ready