 'use strict';
(function(angular){

	// routes configuration 
	angular.module('supplyhubApp').config(routes);

	routes.$inject = ["$routeProvider"];

	function routes($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'views/main.html',
			controller: 'MainCtrl',
			reloadOnSearch: false
		})
		.otherwise({
			redirectTo: '/'
		});
	}

})(angular);