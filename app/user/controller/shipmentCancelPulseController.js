'use strict';
angular.module('user')
		.controller('shipmentCancelPulseController', 
			['commService', '$state', '$scope', 'orderService', '$q', 'shipemntDate', 'orderid', 
	
	function (commService, $state, $scope, orderService, $q, shipemntDate, orderid) {
		$scope.order = orderid;
		$scope.shipemntDate = shipemntDate;
		$scope.closeModal = function() {
			$scope.$hide();
		}

    //得到取消暫停原因
    commService.getConstant(14)
      .then(function(result){
        $scope.shipmentChangeReason = result;
        console.log($scope.shipmentChangeReason);
      });

    $scope.selected = [];
    $scope.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
      console.log(list);
    };

    $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };


		//得到運送異動項目
		orderService.getConstant(11)
			.then(function(result){
				$scope.shipmentChange = result.data;
			}),
		$scope.addChange = function(type){
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
						$scope.$hide();
						//TO DO
						location.reload();
					}
				});
		}
	}]);