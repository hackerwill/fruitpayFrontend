'use strict';
angular.module('user')
	.controller('orderController',
			["$scope",
			 "orderService",
			 'authenticationService',
			 function($scope, orderService, authenticationService){
					
		$scope.getOrder = getOrder;
		
		function getOrder(){
			authenticationService.getUser()
				.then(function(user){
					if(user){
						$scope.userOrders = user.customerOrders;
					}else{
						$location.path('/index');
					}
				});
		}
		
	}]);
