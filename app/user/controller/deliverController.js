'use strict';
angular.module('user')
	.controller('deliverController',
			['logService',
			 'spinService',
			 "$scope",
			 "orderService",
			 "shipmentChangeService",
			 'authenticationService',
			 '$location',
			 "$modal",
			 function(logService, spinService, $scope, orderService, shipmentChangeService, authenticationService, $location, $modal){

		$scope.afterShipmentChange = function(data) {
			$scope.highlight = '';
			//console.log($scope.selectedOrder.orderId);
			shipmentChangeService.getShipmentChange($scope.selectedOrder.orderId)
				.then(function(result){
					if(result){
						$scope.userShipmentChange = result;
					}
				});

			shipmentChangeService.getShipmentStatuses($scope.selectedOrder.orderId)
				.then(function(result){
					//console.log(result);
					if(result){
						spinService.stop();
						logService.showSuccess("修改成功");
						$scope.highlight = parseToHeightFormat(result, configMap);
					}
				});

			
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
						$scope.orders = result;
						$scope.userOrders.order = result[0];
				});
		}

		$scope.selectedOrder = '';
		$scope.optionIdChange = optionIdChange;
		function optionIdChange(){
			$scope.highlight = '';
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
						$scope.shipmentStatuses = result;
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
				}, shipmentReady : {
					circleClassName : "readyDate",
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

		function parseToHeightFormatChange(shipmentPeriods, configMap){
					var heightMap = {};
						var shipmentPeriod = shipmentPeriods;
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
