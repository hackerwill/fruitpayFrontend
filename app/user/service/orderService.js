'use strict';
 
	angular
        .module('app')
		.factory('orderService', orderService);
	
	orderService.$inject = ['$http','logService'];
	function orderService($http, logService){
		var service = {};
		
		service.getOrderByCustomerId = getOrderByCustomerId;
		
		return service;
		
		function getOrderByCustomerId(customerId){
			return $http.get('CustomerDataCtrl/' + customerId + '/getOrder/')
				.then(logService.successCallback, logService.errorCallback);
		}
		
	}