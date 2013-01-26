$(document).delegate("#main", "pageinit", function() {
	if ( window.tizen && window.tizen.application ) {
		$("#main .ui-btn-back").bind("vclick", function() {
			window.tizen.application.getCurrentApplication().exit();
			return false;
		});
	}
});

