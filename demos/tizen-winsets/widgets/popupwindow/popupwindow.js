$( document ).one( "pageinit", "#popupwindow-demo", function () {
	$("#btn_textbox_popup_cancel").on("vclick", function ( ev ) {
		$("#textbox_popup").find("input").val("");
		$("#textbox_popup").popup("close");
	});
});
