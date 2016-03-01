'use strict';
angular.module('user')
	.controller('orderController',
			["$scope",
			 "orderService",
			 'authenticationService',
			 '$location',
			 function($scope, orderService, authenticationService, $location){
					
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
