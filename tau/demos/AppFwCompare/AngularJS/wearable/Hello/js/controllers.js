var helloApp = angular.module('helloApp', []);

helloApp.controller('HelloController', function ($scope) {
	$scope.keyword = "Mars";
});