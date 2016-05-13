'use strict';
angular.module('user')
	.controller('deliverController',
			["$scope",
			 "orderService",
			 "shipmentChangeService",
			 'authenticationService',
			 '$location',
			 "$modal",
			 function($scope, orderService, shipmentChangeService, authenticationService, $location, $modal){
		
		$scope.getOrder = getOrder;
		$scope.getShipmentChange = getShipmentChange;
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
						$scope.orders = result;
						$scope.userOrders.order = result[0];
				});
		}

		function getShipmentChange(){
			authenticationService.getUser()
				.then(function(user){
					if(user){
						return shipmentChangeService.getShipmentChange(user.customerId);
					}else{
						$location.path(commConst.urlState.LOGIN.pathUrl);
						return false;
					}
				}).then(function(result){
					if(result)
						$scope.userShipmentChange = result;
				});
		}

		$scope.selectedOrder = '';
		$scope.optionIdChange = optionIdChange;
		function optionIdChange(){
			$scope.highlight = "";
			authenticationService.getUser()
				.then(function(user){
					if(user){
						return shipmentChangeService.getShipmentChange($scope.selectedOrder.orderId);
					}else{
						$location.path(commConst.urlState.LOGIN.pathUrl);
						return false;
					}
				}).then(function(result){
					if(result)
						$scope.userShipmentChange = result;
				});

			authenticationService.getUser()
				.then(function(user){
					if(user){
						return shipmentChangeService.getShipmentStatuses($scope.selectedOrder.orderId);
					}else{
						$location.path(commConst.urlState.LOGIN.pathUrl);
						return false;
					}
				}).then(function(result){
					if(result)
						$scope.shipmentStatuses = result.data;
						$scope.highlight = parseToHeightFormat($scope.shipmentStatuses, configMap);
				});
		}

		var configMap = {
				shipmentPulse : {
					circleClassName : "pulseDate",
					color : "#000"
				}, shipmentCancel : {
					circleClassName : "cancelDate",
					color : "#000"
				}, shipmentDeliver : {
					circleClassName : "deliverDate",
					color : "#000",
					onSelect: function($modal, date){
						var myModal = $modal({
							scope: $scope,
							locals: { shipemntDate: date, orderid:  $scope.selectedOrder },
							controller: 'shipmentCancelPulseController',
							templateUrl: 'user/shipmentCancelPulseDialog.html', 
							backdrop: 'static',
							keyboard: false,
							show: false
						});
						myModal.$promise.then(myModal.show);
					}
				}, shipmentOnGoing : {
					circleClassName : "deliveredDate",
					color : "#000"
				}
			};

		function parseToHeightFormat(shipmentPeriods, configMap){
					var heightMap = {};
					for(var i = 0; i < shipmentPeriods.length; i++){
						var shipmentPeriod = shipmentPeriods[i];
						var key = shipmentPeriod.shipmentChangeType.optionName;
						var date = shipmentPeriod.applyDate;
						var dateObject = {
							start : date,
							end : date
						};
						if(!(key in heightMap)){
							heightMap[key] = {};
							heightMap[key].legend = shipmentPeriod.shipmentChangeType.optionDesc;
							heightMap[key].dates = [];
						}
						heightMap[key].dates.push(dateObject);
					};
					for(var key in configMap){
						if(configMap.hasOwnProperty(key) && key in heightMap){
							for(var keyName in configMap[key]){
								if(configMap[key].hasOwnProperty(keyName)){
									heightMap[key][keyName] = configMap[key][keyName]
								}
							}
						}
					}
					var highlight = [];
					for (var key in heightMap) {
						if (heightMap.hasOwnProperty(key)) {
							highlight.push(heightMap[key]);
						}
					}
					return highlight;
				}	
	}]);
