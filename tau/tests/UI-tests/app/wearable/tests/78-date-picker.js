/*global tau */
(function () {
	var page = document.getElementById("78-date-picker"),
		element = page.querySelector(".ui-date-picker"),
		widget = null;

	function init() {
		widget = tau.widget.DatePicker(element);
		widget.value(new Date(2015, 11, 20));
	}

	function onPageHide() {
		widget.destroy();
	}

	page.addEventListener("pagebeforeshow", init);
	page.addEventListener("pagehide", onPageHide);
}());
