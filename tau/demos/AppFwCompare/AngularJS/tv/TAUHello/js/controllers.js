var helloApp = angular.module('helloApp', []);

helloApp.controller('HelloController', function ($scope) {
	$scope.players = JSON_DATA;

}).directive("playerList", ["$timeout", function ($timeout) {
	return {
		//template: "<li ng-repeat=\"player in players\">{{ player.NAME }}</li>",
		template: '<li ng-repeat=\"player in players\" class="li-has-multiline">'
		+'<span>{{ player.NAME }}</span>'
		+'<span class="li-text-sub" >'
			+'<span>{{ player.FRM }}</span>'
			+'(<span>{{ player.ACTIVE }}</span>)'
		+'</span>'
	+ '</li>',
	compile: function (tElement, tAttrs, transclude) {
			return {
				post: function ($scope) {
					// http://stackoverflow.com/questions/11125078/is-there-a-post-render-callback-for-angular-js-directive
					$timeout(function(){
						tau.engine.run();
					});
				}
			}
		}
	}
}]);