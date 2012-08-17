$( document ).bind("pagecreate", function () {

	$("#genBackToFooter").bind("vmousedown", function (e) {
			$(".ui-page-active").find(".ui-footer").barlayout("addBackBtn");
   });

	$("#genBackToFooter2").bind("vmousedown", function (e) {
			$(".ui-page-active").find(".ui-header").barlayout("addBackBtn");
   });

	$("#backButtonDemo5").bind("vmousedown", function (e) {
			$(".ui-page-active").find(".ui-footer").hide();
   });
});
