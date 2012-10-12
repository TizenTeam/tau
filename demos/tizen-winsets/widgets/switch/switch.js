$("#switch-demo").live("pageshow", function(e) {
	$("#switch-1-coord").bind("change", function(e) {
		$("#switch-2-coord").toggleswitch("option", "checked", $("#switch-1-coord").toggleswitch("option", "checked"));
	});
	$("#switch-2-coord").bind("change", function(e) {
		$("#switch-1-coord").toggleswitch("option", "checked", $("#switch-2-coord").toggleswitch("option", "checked"));
	});
});
