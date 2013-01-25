$(document).delegate("#main", "pageinit", function() {
	if ( tizen && tizen.application ) {
		$("#main .ui-btn-back").bind("vclick", function() {
			tizen.application.getCurrentApplication().exit();
			return false;
		});
	}
});

