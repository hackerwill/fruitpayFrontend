'use strict';
angular.module('user')
	.controller('orderController',
			["$scope",
			 "$rootScope", 
			 "commService", 
			 "orderService",
			 'authenticationService',
			 '$location',
			 function($scope, $rootScope, commService, orderService, authenticationService, $location){
					
		$rootScope.globalTitle = '訂單紀錄';
		if(commService.getWindowSize().width >= 768){
			$scope.keepShowTitle = true;
		}else{
			$scope.keepShowTitle = false;
		}
		
		$scope.getOrder = getOrder;
		
		function getOrder(){
			authenticationService.getUser()
				.then(function(user){
					if(user){
						return orderService.getOrderByCustomerId(user.customerId);
					}else{
						$location.path(commConst.urlState.LOGIN.pathUrl);
						return false;
					}
				}).then(function(result){
					if(result)
						$scope.userOrders = result;
				});
		}
		
	}]);
