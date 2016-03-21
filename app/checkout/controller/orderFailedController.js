'use strict';
angular.module('checkout')
	.controller('orderFailedController',
			["$scope", "orderService", "spinService", "$window", "logService",
		function(
				$scope, orderService, spinService, $window, logService){
		
		if(!getURLParameter('id'))
			return;
		
		$scope.finished = false;
		spinService.startSpin("系統處理中，請稍後");
		orderService.getOrder(getURLParameter('id'))
			.then(function(result){
				console.log(result);
				spinService.stop();
				if(result && result.orderStatus.orderStatusId == 4){
					$scope.finished = true;
					logService.debug(result);
					$scope.order = result;
				}
			});
		
		function getURLParameter(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
		}

	}]);