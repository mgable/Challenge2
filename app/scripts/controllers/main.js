'use strict';

/**
 * @ngdoc function
 * @name supplyhubApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the supplyhubApp
 */
angular.module('supplyhubApp')
.controller('MainCtrl', ["$scope", "Search", "$location", "$routeParams", "CONFIG", "$q", function ($scope, Search, $location, $routeParams, CONFIG, $q) {

	$scope.results = null;
	$scope.count = -1;
	$scope.product = $routeParams.product || null;
	$scope.currentPage = $routeParams.currentPage || 1;
	$scope.maxSize = CONFIG.data.maxSize;
	$scope.totalItems = CONFIG.data.limit;

	$scope.searchFor = startSearch;

	if ($scope.product){
		searchFor($scope.product);
	}

	$scope.setPage = function (pageNo){
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function(){
		if ($scope.count === -1){return;}
		if (!$scope.product){reset(); return;}
		search();
		$location.search({'currentPage': $scope.currentPage, 'product': $scope.product});
	};

	function startSearch (product){
		$scope.currentPage = 1;
		searchFor(product);
	}

	function reset(){
		$scope.currentPage = 1;
		$scope.count = -1;
		$scope.results = null;
		$location.search({});
	}

	function search(){
		return Search.searchFor($scope.product, ($scope.currentPage - 1) * $scope.totalItems).then(function(data){
			if (data.statusCode === 404){
				$scope.results = null;
			} else {
				$scope.results = data;
			}			
		});
	}

	function count(){
		return Search.getCountFor($scope.product).then(function(data){
 			$scope.count = data;
 		});
	}

	function setCurrentPage(){
		var defer = $q.defer();
		$scope.currentPage = $routeParams.currentPage || 1;
		defer.resolve($scope.currentPage);
		return defer.promise;
	}

	function searchFor(product){
		if (!product) {reset(); return;}
		$scope.product = product;
		count().then(setCurrentPage).then(search);
 		
 		$location.search({'currentPage': $scope.currentPage, 'product': $scope.product});
	}
}]);
 
