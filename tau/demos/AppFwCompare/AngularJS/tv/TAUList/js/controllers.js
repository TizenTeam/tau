var helloApp = angular.module('helloApp', []);

helloApp.controller('HelloController', function ($scope) {
	$scope.players = null;
	//$scope.players = JSON_DATA;
	$scope.loadPlayers = function () {
		console.time("templ-a");
		console.time("templ-tau");
		$scope.players = JSON_DATA;
	};

	$scope.$watch("players", function (oldValue, newValue) {
		var list = tau.widget.Listview(document.getElementById("listviewtest"));

		if (list) {
			setTimeout(function () {
				console.timeEnd("templ-a");
				list.refresh();
				console.timeEnd("templ-tau");
			}, 0);
		}
	});
});