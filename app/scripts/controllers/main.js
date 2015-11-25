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

	var product = {};
	product.name = $routeParams.product || null;
	product.results = null;
	product.count = -1;

	$scope.currentPage = $routeParams.currentPage || 1;
	$scope.maxSize = CONFIG.data.maxSize;

	$scope.searchFor = startSearch;
	$scope.getResults = getResults;
	$scope.getCount = getCount;
	$scope.getProduct = getProduct;
	$scope.pageChanged = pageChanged;

	init();

	function pageChanged (){
		if (product.count === -1){return;}
		search(product).then(setLocation);
	}

	function init(){
		if (product.name){
			searchFor(product);
		}
	}

	function getCount(){
		return product.count;
	}

	function getResults(){
		return product.results;
	}

	function getProduct(){
		return product.name;
	}

	function startSearch(name){
		if (!product) {return;}
		reset();
		product.name = name;
		searchFor(product);
	}

	function reset(){
		product.count = -1;
		product.results = null;
		$scope.currentPage = 1;
		$location.search({});
	}

	function search(product){
		return Search.searchFor(product.name, ($scope.currentPage - 1) * CONFIG.data.limit).then(
			function(data){
				product.results = (data.statusCode === 404) ? null : data;
				product.currentPage = $scope.currentPage;
				return product;
			}
		);
	}

	function count(product){
		return Search.getCountFor(product.name).then(function(data){
 			product.count = data;
 			return product;
 		});
	}

	function setCurrentPage(product){
		var defer = $q.defer();
		$scope.currentPage = $routeParams.currentPage || 1;
		product.currentPage = $scope.currentPage;
		defer.resolve(product);
		return defer.promise;
	}

	function setLocation(product){
		$location.search({'currentPage': product.currentPage, 'product': product.name});
	}

	function searchFor(product){
		count(product).then(setCurrentPage).then(search).then(setLocation);
	}
}]);
 
