(function () {
	"use strict";

}());

function doIt() {
	console.time("KnockoutJS");
	var AppPlayersView = function (playersList) {
		this.players = playersList;
		this.title = "NBA Players";
	};

	ko.bindingHandlers.refreshTauWidget = {
		update: function(element, valueAccessor) {
			var listview = tau.engine.instanceWidget(element, "Listview");
			listview.refresh();
			console.timeEnd("KnockoutJS");
		}
	};

	ko.applyBindings(new AppPlayersView(JSON_DATA));
}