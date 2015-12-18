'use strict';
angular
.module('app')
.factory('logService', logService);

logService.$inject = ['$alert'];
function logService($alert){
	
	var service = {};
	service.successCallback = successCallback;
	service.errorCallback = errorCallback;
	service.showSuccess = showSuccess;
	service.showDanger = showDanger;
	service.showInfo = showInfo;
		
	return service;
	
	function showInfo(message){
		$alert({
			title: message,
			placement: 'top',
			type: 'info',
			duration: '3',
			animation: 'am-fade-and-scale'
		});
	}
	
	function showDanger(message){
		$alert({
			title: message,
			placement: 'top',
			type: 'danger',
			duration: '3',
			animation: 'am-fade-and-scale'
		});
	}
	
	function showSuccess(message){
		$alert({
			title: message,
			placement: 'top',
			type: 'success',
			duration: '3',
			animation: 'am-fade-and-scale'
		});
	}
	
	function successCallback(response){
		var returnData = response.data;
		return returnData;
	}
			
	function errorCallback(response){
		console.log(response);
		var returnData = response.data;
		$alert({
			title: returnData ? returnData.message : '請確認網路連線',
			placement: 'top',
			type: 'danger',
			duration: '3',
			animation: 'am-fade-and-scale'
		});
		return false;
	}
}