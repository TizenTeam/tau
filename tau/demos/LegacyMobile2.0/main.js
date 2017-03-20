/* global $ */

$("#main").on("pageshow", function () {
	// bind callbacks to the H/W keys
	$(window).on("tizenhwkey", function (e) {
		if (e.originalEvent.keyName == "back" && window.tizen && window.tizen.application) {
			window.tizen.application.getCurrentApplication().exit();
			return false;
		}
	});
}).on("pagebeforehide", function () {
	// unbind callbacks to the H/W keys
	$(window).off("tizenhwkey");
});