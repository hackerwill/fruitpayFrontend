'use strict';
angular.module('user')
		.controller('shipmentCancelPulseController', 
			['spinService', '$state', '$scope', 'orderService', '$q', 'shipemntDate', 'orderid', 
	
	function (spinService, $state, $scope, orderService, $q, shipemntDate, orderid) {
		$scope.order = orderid;
		$scope.shipemntDate = shipemntDate;
		$scope.closeModal = function() {
			$scope.$hide();
		}

		//得到運送異動項目
		orderService.getConstant(11)
			.then(function(result){
				$scope.shipmentChange = result.data;
			}),
		$scope.addChange = function(type){
			spinService.startSpin("處理中，請稍等");
			var sendChange = {};
			for(var i = 0; i < $scope.shipmentChange.constOptions.length; i++){
				var option = $scope.shipmentChange.constOptions[i];
				if(option.optionName == type){
					sendChange.shipmentChangeType = option;
				}
			}
			sendChange.applyDate = shipemntDate;
			
			orderService.addShipmentChange(sendChange, $scope.order)
			 	.then(function(result){
			 		if(result){
			 			$scope.shipmentChange = sendChange;
						console.log($scope.shipmentChange);
						$scope.afterShipmentChange(sendChange);
						//$scope.afterShipmentChange(type);
			 			$scope.$hide();
			 		}
				});
		}
	}]);