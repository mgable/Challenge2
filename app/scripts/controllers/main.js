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

	$scope.searchFor = startSearch;

	init();

	$scope.pageChanged = function(){
		if ($scope.count === -1){return;}
		search({'currentPage': $scope.currentPage, 'product':$scope.product, 'count': $scope.count}).then(setLocation);
	};

	function init(){
		if ($scope.product){
			searchFor($scope.product);
		}
	}

	function startSearch (product){
		if (!product) {return;}
		reset();
		$scope.product = product;
		$scope.currentPage = 1;
		searchFor($scope.product);
	}

	function reset(){
		$scope.currentPage = 1;
		$scope.count = -1;
		$scope.results = null;
		$location.search({});
	}

	function search(result){
		return Search.searchFor(result.product, (result.currentPage - 1) * CONFIG.data.limit).then(
			function(data){
				$scope.results = (data.statusCode === 404) ? null : data;
				result["results"] = $scope.results;
				return result;
			}
		);
	}

	function count(product){
		return Search.getCountFor(product).then(function(data){
 			$scope.count = data;
 			return {'count': $scope.count, 'product': product};
 		});
	}

	function setCurrentPage(result){
		var defer = $q.defer();
		$scope.currentPage = $routeParams.currentPage || 1;
		result['currentPage'] = $scope.currentPage;
		defer.resolve(result);
		return defer.promise;
	}

	function setLocation(result){
		$location.search({'currentPage': result.currentPage, 'product': result.product});
	}

	function searchFor(product){
		count(product).then(setCurrentPage).then(search).then(setLocation);
	}
}]);
 
