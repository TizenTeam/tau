(function() {
	var page = document.getElementById("popupPage");

	page.addEventListener("pageshow", function(ev) {
		var closePopup = tau.closePopup.bind(tau, null);

		document.getElementById('1btnPopup-cancel').addEventListener('vclick', closePopup, false);
		document.getElementById('2btnPopup-cancel').addEventListener('vclick', closePopup, false);
		document.getElementById('2btnPopup-ok').addEventListener('vclick', closePopup, false);
		document.getElementById('radioPopup-close').addEventListener('vclick', closePopup, false);
		document.getElementById('checkPopup-close').addEventListener('vclick', closePopup, false);
		document.getElementById('listPopup-cancel').addEventListener('vclick', closePopup, false);
		document.getElementById('listNoTitlePopup-cancel').addEventListener('vclick', closePopup, false);
	}, false);

}());
