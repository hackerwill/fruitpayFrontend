'use strict';
	angular
        .module('app')
		.factory('shipmentChangeService', shipmentChangeService);
	
	shipmentChangeService.$inject = ['$http','logService', 'commConst', '$q'];
	function shipmentChangeService($http, logService, commConst, $q){
		var service = {};
		
		service.getShipmentChange = getShipmentChange;
		service.getShipmentStatuses = getShipmentStatuses;
		
		return service;
		
		function getShipmentChange(orderId){
			return $http.get(commConst.SERVER_DOMAIN + 'shipmentCtrl/shipmentChange/' + orderId)
				.then(logService.successCallback, logService.errorCallback);
		}
		
        function getShipmentStatuses(orderId){
            return $http.get(commConst.SERVER_DOMAIN+'shipmentCtrl/shipmentPeriod/' + orderId)
            	.then(logService.successCallback, logService.errorCallback);
		}
	}