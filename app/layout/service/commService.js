'use strict';
angular.module('app')
	.factory('commService', commService);

commService.$inject = ['$http', 'logService', 'sharedProperties', '$q'];
function commService($http, logService, sharedProperties, $q) {
	var service = {};
	
	service.windowResizeFunc = windowResizeFunc;
	service.getWindowSize = getWindowSize;
	service.getAllCounties = getAllCounties;
	service.getTowerships = getTowerships;
	service.getVillages = getVillages;
	service.getAllProducts = getAllProducts;
	service.getAllOrderPlatforms = getAllOrderPlatforms;
	service.getAllOrderPrograms = getAllOrderPrograms;
	service.getAllOrderStatuses = getAllOrderStatuses;
	service.getAllPaymentModes = getAllPaymentModes;
	service.getAllShipmentPeriods = getAllShipmentPeriods;
	service.getAllConstants = getAllConstants;
	service.getConstant = getConstant;
	
	return service;
	
	function getAllProducts(){
		return $http.get('staticDataCtrl/getAllProducts')
		.then(logService.successCallback, logService.errorCallback);
	}
	
	function getVillages(towershipCode){
		if(towershipCode == null || towershipCode.length == 0)
			return null;
		
		if(sharedProperties.getVillageList() != null){
			return $q.when(sharedProperties.getVillageList());
		}else{
			return $http.get('staticDataCtrl/getVillages/' + towershipCode)
			.then(logService.successCallback, logService.errorCallback)
			.then(function(result){
				if(result)
					sharedProperties.setVillageList(result);
				return result;
			})
		}
	}
	
	function getTowerships(countyCode){
		if(countyCode == null || countyCode.length == 0)
			return null;
		if(sharedProperties.getTowershipList(countyCode) != null){
			return $q.when(sharedProperties.getTowershipList(countyCode));
		}else{
			return $http.get('staticDataCtrl/getTowerships/' + countyCode)
			.then(logService.successCallback, logService.errorCallback)
			.then(function(result){
				if(result)
					sharedProperties.setTowershipList(countyCode, result);
				return result;
			});
		}
	}
	
	function getAllCounties(){
		if(sharedProperties.getCountyList() != null){
			return $q.when(sharedProperties.getCountyList());
		}else{
			return $http.get('staticDataCtrl/getAllCounties')
			.then(logService.successCallback, logService.errorCallback)
			.then(function(result){
				if(result)
					sharedProperties.setCountyList(result);
				return result;
			});
		}
	}
	
	function getAllOrderPlatforms(){
		return $http.get('staticDataCtrl/orderPlatforms')
			.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllOrderPrograms(){
		return $http.get('staticDataCtrl/orderPrograms')
			.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllOrderStatuses(){
		return $http.get('staticDataCtrl/orderStatuses')
			.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllPaymentModes(){
		return $http.get('staticDataCtrl/paymentModes')
			.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllShipmentPeriods(){
		return $http.get('staticDataCtrl/shipmentPeriods')
			.then(logService.successCallback, logService.errorCallback);
	}
	
	function getAllConstants(){
		return $http.get('staticDataCtrl/constants')
		.then(logService.successCallback, logService.errorCallback);
	}
	
	function getConstant(constantId){
		return $http.get('staticDataCtrl/constants/' + constantId)
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
