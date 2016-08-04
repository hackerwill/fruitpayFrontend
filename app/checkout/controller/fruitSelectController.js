'use strict';
angular.module('checkout')
	.controller('fruitSelectController',
			["$scope", "commService", "checkoutService", "commConst", "$modal",
		function($scope, commService, checkoutService, commConst, $modal){
		
		$scope.imageNum = getImageNum();
		$scope.maxUnlikeCount = 10;
		$scope.order = {};
		$scope.order.slides = [];
		$scope.range = range;
		$scope.getImageName = getImageName;
		$scope.fruitLeft = fruitLeft;
		$scope.fruitRight = fruitRight;
		$scope.setLikeDegree = setLikeDegree;
		$scope.unselectAllRemoveProdcut = unselectAllRemoveProdcut;
		
		commService.getAllProducts()
				.then(getAllProductsCallback);

		function unselectAllRemoveProdcut(){
			if($scope.isAllChosen){
				for (var i = 0; i < $scope.order.orderPreferences.length; i++) {
					$scope.order.orderPreferences[i].likeDegree = 3; 
				}
			};
		}

		function setLikeDegree(orderPreference){
			if(orderPreference.likeDegree == 3){
				if(isReachMaxUnlikeMount()){
					return;
				}
				$scope.isAllChosen = false;
				orderPreference.likeDegree = 0;
			}else{
				orderPreference.likeDegree = 3;
			}
			for (var i = 0; i < $scope.order.orderPreferences.length; i++) {
				var thisPreference = $scope.order.orderPreferences[i];
				if(thisPreference.product.productId == orderPreference.product.productId)
					thisPreference.likeDegree = orderPreference.likeDegree;
			}
		}
		
		function isReachMaxUnlikeMount(){
			var totalUnlikeCount = 0;
			for (var i = 0; i < $scope.order.orderPreferences.length; i++) {
				if($scope.order.orderPreferences[i].likeDegree == 0)
					totalUnlikeCount ++;
			}
			if(totalUnlikeCount >= $scope.maxUnlikeCount){
				return true;
			}else{
				return false;
			}
		}
		
		function fruitLeft(){
			$scope.carouselIndex--;
		}
		
		function fruitRight(){
			$scope.carouselIndex++;
		}
		
		function getImageNum(){
			if(commService.getWindowSize().width > 991)
				return 18;
			else
				return 12;
		}
		
		function getImageName(n){
			return "image" + n;
		}
		
		function range(min, max, index, maxLimit){
			var totalAmount = maxLimit - index * max;
			var imageTotal = totalAmount > max ? max : totalAmount;
		    var input = [];
		    for (var i = min; i <= imageTotal; i += 1) {
		      input.push(i);
		    }
		    return input;
		};

		function getAllProductsCallback(result){
			var resizeAppend = '?resize=200%2C150';
			for (var i = 0; i< result.length; i++) {
				if(result[i].imageLink == null || result[i].imageLink.length == 0 || result[i].productName.length == 0)
					delete result[i];
			}
			var orderPreferences = [];
			for (var i = 0; i< result.length; i++) {
				if(result[i]){
					result[i].imageLink = result[i].imageLink + resizeAppend;
					var obj = {};
					obj.likeDegree = 3;
					obj.product = result[i];
					orderPreferences.push(obj);
				}
			}
			for (var i = 0; i< orderPreferences.length; i++) {
				var index = Math.floor(i/$scope.imageNum);
				var num = i%$scope.imageNum + 1;
				if(!$scope.order.slides[index])
					$scope.order.slides[index] = {};
				$scope.order.slides[index]['image' + num] = orderPreferences[i];
			}
			$scope.order.totalImageAmount = orderPreferences.length;
			$scope.order.orderPreferences = orderPreferences;
		}
	}]);