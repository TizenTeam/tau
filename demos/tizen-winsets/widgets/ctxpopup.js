$("#pop_js").live("vclick", function ( e ) {
	if ( $(e.target).is("#ctxpopup_update") ) {
		$("#btn_js").text("Peekaboo!");
		$("#btn_js").buttonMarkup("refresh");
	}
});

var popupTest = function()
{
	$("#pop_text_only").popup("open");
	return false;
};