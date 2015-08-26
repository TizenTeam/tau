(function () {
	"use strict";
	var AppViewModel = function () {
		this.worldName = "Tizen";
	};

	document.addEventListener("DOMContentLoaded", function () {
		ko.applyBindings(new AppViewModel());
	});
}());