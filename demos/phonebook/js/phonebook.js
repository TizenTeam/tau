Phonebook = {
	search: function(dbArray, fields, regEx)
	{
		/* Search keyword string from dbArray's fields, return an array. */
		var search_result = new Array();
		
		var query = dbArray;/* + "." + fields;*/
		
		$.each(dbArray, function(i, v) {
	        if (v.name_first.search(new RegExp(regEx)) != -1) {
	            search_result.push(v);
	            return;
	        }
	    });
		
		$("ul.ui-virtual-list-container").virtuallistview("recreate", search_result);
		
		$(".titleWithCount").text($(".titleWithCount").text().split("(")[0] + "(" + nb_contacts + ")");

		return search_result;
	},
	
	getDetailview: function(dbArray, luid)
	{
		/* Currently use linear search. Later or Real DB may support SQL query. */ 
		$.each(dbArray, function(i, v) {
	        if (v.Luid == luid) {
	        	
	        	/* Find and make detail view page.*/
	        	Phonebook.makeDetailview(v);
	        }
		});
	},
	
	makeDetailview: function(contact)
	{
		var myTemplate = $("#contacts_detailview_tmpl");
		
		var htmlData = myTemplate.tmpl(contact);
		
		$("#contact_detailview_content").empty();
		
		$("#contact_detailview_content").append((htmlData).data('luid', contact.Luid));
		
		$.mobile.changePage("#contact_detilaview");
	},
	
	pushContactsTitle: function(titleSelector, template, nb_items)
	{
		var myTemplate = $(template);
		var htmlData = myTemplate.tmpl({counts:nb_items});
		
		$(titleSelector).empty().text($(htmlData).text());
	},
	
	makeGroupList: function(groups)
	{
		/* Get Group list and remove duplicated items. */
		var groupedList = {};
		
		$.each(groups, function() {
			var vName = this.groupName;
			
			if (vName.length > 0)
			{
				if($(groupedList[vName]).size() <= 0)
				{
					/* Make 2 dimension array */
					groupedList[vName] = new Array();
				}
				
				groupedList[vName].push(this);
			}
		});
		
		return groupedList;
	},
	
	pushGourpedList: function(listSelector, expandableTitleTmpl, expandableItemTmpl, GroupDataset, ContactsDataset)
	{
		var groupedList = GroupDataset;
		var contactsList = ContactsDataset;
		var $titleTemplate = $(expandableTitleTmpl);
		var $itemTemplate = $(expandableItemTmpl);
		var clonedList = $(listSelector).clone();
		
		/* Traverse Grouped list */
		$.each(groupedList, function(myGroupName, items){
			var groupNameData = {groupName:myGroupName, groupCount:items.length};
			var titleHtmlData = $titleTemplate.tmpl(groupNameData);
			
			$(clonedList).append(titleHtmlData);
			
			/* Append each group's items */
			$.each(items, function(){
				var contactData = Phonebook.searchByLuid(window[pb_dbtable], this.Luid);
				var shownName = contactData.name_first + contactData.name_last;
				var itemData = {groupName:myGroupName, Luid:contactData.Luid, contactName:shownName};
				
				var itemHtmlData = $itemTemplate.tmpl(itemData);
				
				$(clonedList).append(itemHtmlData);
			});
		});
		
		$(listSelector).replaceWith(clonedList);
		
		/*$(listSelector).listview();*/
	},
	
	searchByLuid: function(dbArray, search_id)
	{
		var find_item;
		
		$.each(dbArray, function(i, v) {
	        if (v.Luid == search_id) {
	        	find_item = this;
	        	
	        	return false;
	        }
		});
		
		return find_item;
	}
} ;






















