'use strict';
	angular
        .module('app')
		.factory('orderService', orderService);
	
	orderService.$inject = ['$http','logService', 'commConst', '$q'];
	function orderService($http, logService, commConst, $q){
		var service = {};
		
		service.getOrderByCustomerId = getOrderByCustomerId;
		service.getOrder = getOrder;
		service.getOrderAndSendEmail = getOrderAndSendEmail;
		service.getConstant = getConstant;
		service.addShipmentChange = addShipmentChange;

		return service;
		
		function getOrder(orderId){
			return $http.get(commConst.SERVER_DOMAIN + 'orderCtrl/order/' + orderId)
				.then(logService.successCallback, logService.errorCallback);
		}

		function getOrderAndSendEmail(orderId){
			return $http.get(commConst.SERVER_DOMAIN + 'orderCtrl/orderSendEmail/' + orderId)
				.then(logService.successCallback, logService.errorCallback);
		}
		
		function getOrderByCustomerId(customerId){
			return $http.get(commConst.SERVER_DOMAIN + 'customerDataCtrl/customer/' + customerId + '/orders')
				.then(logService.successCallback, logService.errorCallback);
		}

		function getConstant(constantId){
            return $q(function(resolve, reject){
                $http.get(commConst.SERVER_DOMAIN +'staticDataCtrl/constants/' + constantId)
	                .then(function(res){
	                    resolve(res);
	                });	
            });
        }
        //http://localhost:8081/fruitpay/staticDataCtrl/constants/11

        function addShipmentChange(shipmentChange, order){
            shipmentChange.customerOrder = order;
            return $q(function(resolve, reject){
                $http.post(commConst.SERVER_DOMAIN+'shipmentCtrl/shipmentChange/', shipmentChange)
                    .then(function(res){
                        resolve(res);
                    });
            });
        }
	}