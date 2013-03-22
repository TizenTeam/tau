$( document ).one( "pagecreate", "#popupwindow-demo", function () {
	$('input[name="popupwindow-demo-transition-choice"]').on("change", function ( e ) {
		$("#popupContent2").popupwindow("option", "transition", $(this).attr("id").split("-").pop());
	});

	$("#btn_textbox_popup_cancel").on("vclick", function ( ev ) {
		$("#textbox_popup").find("input").val("");
	});
});
