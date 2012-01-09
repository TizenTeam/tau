$( "#colorpicker-demo" ).live("pageshow", function () {
	// default color
	$("#colortitle").text("#54a12d");
	$("#colortitle").css("color", "#54a12d");

	// hsvpicker 
	$("#hsvpicker").bind("colorchanged", function(e, color) {
		 // cheang palette color
		$("#colorpalette").colorpalette("option", "color", color);
		// show color text
		$("#colortitle").text(color);
		$("#colortitle").css("color", color);
	});

	// color palette
	$("#colorpalette").bind("colorchanged", function(e, color) {
		// change picker color
		$("#hsvpicker").hsvpicker("option", "color", color);
		// show color text
		$("#colortitle").text(color);
		$("#colortitle").css("color", color);
	});
});

