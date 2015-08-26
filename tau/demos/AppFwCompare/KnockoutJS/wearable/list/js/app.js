(function () {
	"use strict";
	var AppPlayersView = function (playersList) {
		this.players = playersList;
		this.title = "NBA Players";
	};

	ko.bindingHandlers.fillListview = {
		init: function (element, valueAccessor) {
			console.log("init fillListview bind", element, valueAccessor);
		},
		update: function (element, valueAccessor) {
			console.log("update fillListview bind");
		}
	};

	ko.bindingHandlers.refreshTauWidget = {
		update: function(element, valueAccessor) {
			var listview = tau.engine.instanceWidget(element, "Listview");
			listview.refresh();
		}
	};

	document.addEventListener("DOMContentLoaded", function () {
		ko.applyBindings(new AppPlayersView(JSON_DATA));
	});
}());