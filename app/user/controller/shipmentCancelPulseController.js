'use strict';
angular.module('user')
		.controller('shipmentCancelPulseController',
			['commService','spinService', '$state', '$scope', 'orderService', '$q', 'shipemntDate', 'orderid', 
	function (commService, spinService, $state, $scope, orderService, $q, shipemntDate, orderid) {
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
		$scope.addChange = function(){
      var type = $scope.type;
			var sendChange = {};
			for(var i = 0; i < $scope.shipmentChange.constOptions.length; i++){
				var option = $scope.shipmentChange.constOptions[i];
				if(option.optionName == type){
					sendChange.shipmentChangeType = option;
				}
			}
			sendChange.applyDate = shipemntDate;
      sendChange.reason = getReason();

      console.log(sendChange);
			
      spinService.startSpin("處理中，請稍等");
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

    function getReason(){
      //原因
      var reasonArray = [];
      for (var i = 0; i < $scope.selected.length; i++) {
        var reason = $scope.selected[i];
        if(reason.content){
          reasonArray.push(reason.content);
        }else if(reason.optionDesc){
          reasonArray.push(reason.optionDesc);
        }
      };

      var reasonStr = null;
      if(reasonArray.length) {
        reasonStr = reasonArray.join(",");
      }
      return reasonStr;
    }
	}]);