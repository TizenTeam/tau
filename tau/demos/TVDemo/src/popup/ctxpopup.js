(function() {
	var page = document.getElementById("ctxpopupPage");

	page.addEventListener("pageshow", function(ev) {
		var closePopup = tau.closePopup.bind(tau, null);

		document.getElementById("option1").addEventListener("vclick", closePopup, false);
		document.getElementById("option2").addEventListener("vclick", closePopup, false);
		document.getElementById("option3").addEventListener("vclick", closePopup, false);
		document.getElementById("downButton").addEventListener("vclick", closePopup, false);
		document.getElementById("upButton").addEventListener("vclick", closePopup, false);
	}, false);

}());
