$( "#colorpicker-demo" ).live("pageshow", function () {
	// default color
	var defaultColor = "#45cc98";
	$("#colortitle").text(defaultColor);
	$("#colortitle").css("color", defaultColor);

	// hsvpicker 
	$("#hsvpicker").bind("colorchanged", function(e, color) {
		 // change palette color
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

	$("#colorpalette").colorpalette("option", "color", defaultColor);
});

