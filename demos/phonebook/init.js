$("#queryInput").live( "change", function(events, ui) {
	
});

$("#queryInput").live( "input", function(events, ui) {
	
	var query = "";
	query = ".*" + $("#queryInput").val();
	
	search(phonebookDB, "name_first", query);
});



