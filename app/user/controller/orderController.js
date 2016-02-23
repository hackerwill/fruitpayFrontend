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
						$scope.userOrders = user.customerOrders;
					}else{
						$location.path(commConst.urlState.INDEX.pathUrl);
					}
				});
		}
		
	}]);
