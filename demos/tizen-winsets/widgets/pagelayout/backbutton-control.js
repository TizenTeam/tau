$( document ).bind("pagecreate", function () {
	$("#genBackToFooter").bind("vmousedown", function (e) {
		$(".ui-page-active").page( "addBackBtn", "footer" );
	});

	$("#genBackToFooter2").bind("vmousedown", function (e) {
		$(".ui-page-active").page( "addBackBtn", "header" );
	});

	$("#backButtonDemo5").bind("vmousedown", function (e) {
		$(".ui-page-active").find(".ui-footer").hide();
	});
});
