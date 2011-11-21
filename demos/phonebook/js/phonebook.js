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
		var savedLocationList = {};
		var groupedList = {};
		
		/* Make 2 dimension associated array */
		$.each(savedLocationListDB, function(){
			savedLocationList[this] = {};
		});
		
		$.each(groups, function() {
			var vSavedLocation = this.savedlocation;
			var vName = this.group;

			if (savedLocationList[vSavedLocation][vName])	{
				savedLocationList[vSavedLocation][vName].count++;
			}
			else {
				savedLocationList[vSavedLocation][vName] = {count: 1};
			}
		});
		
		return savedLocationList;
	},
	
	pushGourpedList: function(listSelector, expandableTitleTmpl, expandableItemTmpl, LocationGroupData)
	{
		var LocationGroup = LocationGroupData;
		var $titleTemplate = $(expandableTitleTmpl);
		var $itemTemplate = $(expandableItemTmpl);
		var clonedList = $(listSelector).clone();
		
		/* Traverse Grouped list */
		$.each(savedLocationListDB, function(){
			var Nb_items_in_location = 0;
			$.each(LocationGroup[this], function(){
				Nb_items_in_location +=this.count;
			});
				
			var locationData = {savedLocation:this, savedLocationCount:Nb_items_in_location};
			var titleHtmlData = $titleTemplate.tmpl(locationData);
			
			$(clonedList).append(titleHtmlData);
			
			var groupList = LocationGroup[this];
			
			/* Add "All contacts at first */
			var itemData = {groupName:allContacts, savedLocation:locationData.savedLocation,groupCount:Nb_items_in_location};
			var itemHtmlData = $itemTemplate.tmpl(itemData);
			$(clonedList).append(itemHtmlData);
			
			/* Append each Saved Location's groups */
			$.each(groupList, function(myGroupName, data){
				var thisGroupName = (myGroupName.length<=0)?noGroup:myGroupName;
				var itemData = {groupName:thisGroupName, savedLocation:locationData.savedLocation,groupCount:data.count};
				var itemHtmlData = $itemTemplate.tmpl(itemData);
				
				/* Find "Not assigned" and mark it */
				if (thisGroupName == noGroup)
				{
					$(itemHtmlData).addClass("noGroup");
				}

				$(clonedList).append(itemHtmlData);		
			});
			
			/* Find "Not assigned" and move it to the last */
			var move2last = $(clonedList).find(".noGroup").detach();
			move2last.removeClass("noGroup");
			$(clonedList).append(move2last);
		});
		
		/* Update grouped list */
		$(listSelector).replaceWith(clonedList);
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






















