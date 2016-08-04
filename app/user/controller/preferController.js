'use strict';
angular.module('user')
	.controller('preferController',
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
		getOrder();
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
						$scope.orders = result;
						//console.log(result);
            if($scope.orders.length == 1){
              $scope.selectedOrder = $scope.orders[0];
              $scope.optionIdChange();
            }
				});
		}

		$scope.selectedOrder = '';
		$scope.optionIdChange = optionIdChange;
		function optionIdChange(){
			authenticationService.getUser()
				.then(function(user){
					if(user){
						return orderService.getOrderPreferences($scope.selectedOrder.orderId);
					}else{
						$location.path(commConst.urlState.LOGIN.pathUrl);
						return false;
					}
				}).then(function(result){
					if(result){
            $scope.highlight = result;
            $scope.currentId = $scope.selectedOrder.orderId;
          }
				});
		}
	}]);
