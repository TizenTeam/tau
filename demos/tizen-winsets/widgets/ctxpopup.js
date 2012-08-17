$("#pop_js").live("vclick", function ( e ) {
	if ( $(e.target).is(".ui-btn-ctxpopup-close") ) {
		$(this).popupwindow("close");
	}
	if ( $(e.target).is("#ctxpopup_update") ) {
		$("#btn_js").text("Peekaboo!");
		$("#btn_js").buttonMarkup("refresh");
	}
});
