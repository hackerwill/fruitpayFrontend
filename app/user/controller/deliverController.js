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

    $scope.showInfo = function(){
      logService.showInfo('月曆上的圓圈, 為您的訂單所有的配送狀態, 綠色待配送狀態可以申請修改, 請點擊要申請的日期編輯即可, 若有一筆訂單以上, 請先選擇訂單編號, 若有任何問題,請聯絡我們客服人員, 謝謝您!', 500);
    }
		$scope.afterShipmentChange = function(data) {
			$scope.highlight = '';
			shipmentChangeService.getShipmentChange($scope.selectedOrder.orderId)
				.then(function(result){
					if(result){
						$scope.userShipmentChange = result;
					}
				});

			shipmentChangeService.getShipmentStatuses($scope.selectedOrder.orderId)
				.then(function(result){
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
					if(result){
            $scope.orders = result;
            if($scope.orders.length == 1){
              $scope.selectedOrder = $scope.orders[0];
              $scope.optionIdChange();
            }
          }
						
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
					if(result){
            $scope.userShipmentChange = result;
          }
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
					color : "#000",
					onSelect: function($modal, date){
						this.showInfo("暫停狀態");
					}.bind(logService)
				}, shipmentCancel : {
					circleClassName : "cancelDate",
					color : "#000",
					onSelect: function($modal, date){
						this.showInfo("取消狀態");
					}.bind(logService)
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
				}, shipmentDelivered : {
					circleClassName : "deliveredDate",
					color : "#000",
					onSelect: function($modal, date){
						this.showInfo("已配送狀態");
					}.bind(logService)
				}, shipmentReady : {
					circleClassName : "readyDate",
					color : "#000",
					onSelect: function($modal, date){
						this.showDanger("訂單配送中 (因為作業流程的關係, 無法修改訂單)");
					}.bind(logService)
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
