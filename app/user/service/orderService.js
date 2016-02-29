'use strict';
	angular
        .module('app')
		.factory('orderService', orderService);
	
	orderService.$inject = ['$http','logService', 'commConst'];
	function orderService($http, logService, commConst){
		var service = {};
		
		service.getOrderByCustomerId = getOrderByCustomerId;
		service.getOrder = getOrder;
		
		return service;
		
		function getOrder(orderId){
			return $http.get(commConst.SERVER_DOMAIN + 'orderCtrl/order/' + orderId)
				.then(logService.successCallback, logService.errorCallback);
		}
		
		function getOrderByCustomerId(customerId){
			return $http.get(commConst.SERVER_DOMAIN + 'CustomerDataCtrl/' + customerId + '/getOrder/')
				.then(logService.successCallback, logService.errorCallback);
		}
		
	}