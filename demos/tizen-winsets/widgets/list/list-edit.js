var ContactName = "";

$("#genlist-dialog-edit .ui-li-dialogue-edit .ui-btn").live("vclick", function ( e ) {
	$(e.target).parents(".ui-btn").siblings("input").val("");
});

$(document).bind("pagebeforechange", function ( event , data ) {
	if ( $(event.target).children().is("#genlist-dialog-edit") ) {
		ContactName = $("#genlist-dialog-edit input").eq(4).val();
	}
});

$(document).bind("pagebeforeshow", function ( event , data ) {
	if ( $(event.target).attr("id") == "genlist-dialog-edit" ) {
		$("#genlist-dialog-edit input").eq(4).val(ContactName);
	}
});