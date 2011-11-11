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
		
		return search_result;
	},
	
	getDetailview: function(dbArray, pbid)
	{
		var selectedContact;
		
		$.each(dbArray, function(i, v) {
	        if (v.Luid == pbid) {
	        	alert("Find : " + v.Luid + " : " + v.name_first);
	        	
	        	selectedContact = v;
	        	
	            return;
	        }
		});
	}
} ;