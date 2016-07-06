'use strict';
angular.module('app')
	.factory('commService', commService);

commService.$inject = ['$http', 'logService', 'sharedProperties', '$q', 'commConst'];
function commService($http, logService, sharedProperties, $q, commConst) {
	var service = {};
	
	service.windowResizeFunc = windowResizeFunc;
	service.getWindowSize = getWindowSize;
	service.getAllPostCodes = getAllPostCodes;
	service.getAllProducts = getAllProducts;
	service.getAllOrderPlatforms = getAllOrderPlatforms;
	service.getAllOrderPrograms = getAllOrderPrograms;
	service.getAllOrderStatuses = getAllOrderStatuses;
	service.getAllPaymentModes = getAllPaymentModes;
	service.getAllShipmentPeriods = getAllShipmentPeriods;
	service.getAllConstants = getAllConstants;
	service.getConstant = getConstant;
  service.nowTime = nowTime;
	
	return service;

  function nowTime(){
    return $http.get(commConst.SERVER_DOMAIN + 'staticDataCtrl/nowTime')
    .then(logService.successCallback, logService.errorCallback);
  }
	
	function getAllProducts(){
		return $http.get(commConst.SERVER_DOMAIN + 'staticDataCtrl/getAllProducts')
		.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllPostCodes(){
		return $http.get(commConst.SERVER_DOMAIN + 'staticDataCtrl/getAllPostalCodes')
		.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllOrderPlatforms(){
		return $http.get(commConst.SERVER_DOMAIN + 'staticDataCtrl/orderPlatforms')
			.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllOrderPrograms(){
		return $http.get(commConst.SERVER_DOMAIN + 'staticDataCtrl/orderPrograms')
			.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllOrderStatuses(){
		return $http.get(commConst.SERVER_DOMAIN + 'staticDataCtrl/orderStatuses')
			.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllPaymentModes(){
		return $http.get(commConst.SERVER_DOMAIN + 'staticDataCtrl/paymentModes')
			.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllShipmentPeriods(){
		return $http.get(commConst.SERVER_DOMAIN + 'staticDataCtrl/shipmentPeriods')
			.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllConstants(){
		return $http.get(commConst.SERVER_DOMAIN + 'staticDataCtrl/constants')
		.then(logService.successCallback, logService.errorCallback);
	}
	
	function getConstant(constantId){
		return $http.get(commConst.SERVER_DOMAIN + 'staticDataCtrl/constants/' + constantId)
		.then(logService.successCallback, logService.errorCallback);
	}
	
	function getWindowSize(){
		var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		x = w.innerWidth || e.clientWidth || g.clientWidth,
		y = w.innerHeight|| e.clientHeight|| g.clientHeight;
		return {
			width : x,
			height : y
		}
	}

	function windowResizeFunc(divideSize, $scope, maxThanFunc, minThanFunc){
		var data = {
			divideValue : divideSize,
			widthTemp : 0,
			maxThanDevideValue : function(){
				return this.widthTemp < this.divideValue && window.innerWidth >= this.divideValue;
			},
			minThanDevideValue : function(){
				return this.widthTemp > this.divideValue && window.innerWidth <= this.divideValue;
			}
		};
				
		return function(){
			$scope.$apply(function(){
				if(data.maxThanDevideValue()){
					maxThanFunc();
				};
				if(data.minThanDevideValue()){
					minThanFunc();
				};
				data.widthTemp = window.innerWidth;
			});						
		}	
	}
}
