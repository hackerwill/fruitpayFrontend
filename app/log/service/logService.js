'use strict';
angular
.module('app')
.factory('logService', logService);

logService.$inject = ['$alert', 'commConst', "clearCredentialService", '$location'];
function logService($alert, commConst, clearCredentialService, $location){
	
	var service = {};
	service.successCallback = successCallback;
	service.errorCallback = errorCallback;
	service.showSuccess = showSuccess;
	service.showDanger = showDanger;
	service.showInfo = showInfo;
	service.info = info;
	service.debug = debug;
	service.error = error;
		
	return service;
	
	function info(object){
		showLogIfNeccessary(commConst.INFO_LOG, object);
	}
	
	function debug(object){
		showLogIfNeccessary(commConst.DEBUG_LOG, object);
	}
	
	function error(object){
		showLogIfNeccessary(commConst.ERROR_LOG, object);
	}
	
	function showLogIfNeccessary(logMode, object){
		if(object == null)
			return;
		for(var i = 0; i < commConst.allLogModes.length; i ++){
			var mode = commConst.allLogModes[i];
			if(mode == logMode)
				console.log(logMode + ':', object);
			if(mode == commConst.LOG_MODE)
				break;
		}
	}
	
	function showInfo(message, duration){
		$alert({
			title: message,
			placement: 'top',
			type: 'info',
			duration: duration ? duration : '3',
			animation: 'am-fade-and-scale'
		});
	}
	
	function showDanger(message, duration){
		$alert({
			title: message,
			placement: 'top',
			type: 'danger',
			duration: duration ? duration : '3',
			animation: 'am-fade-and-scale'
		});
	}
	
	function showSuccess(message, duration){
		$alert({
			title: message,
			placement: 'top',
			type: 'success',
			duration: duration ? duration : '3',
			animation: 'am-fade-and-scale'
		});
	}
	
	function successCallback(response){
		var returnData = response.data || response.data == false ? response.data : true;
		return returnData;
	}
			
	function errorCallback(response){
		debug(response);
		var returnData = response.data;
		
		$alert({
			title: returnData ? returnData.message : '請確認網路連線',
			placement: 'top',
			type: 'danger',
			duration: '3',
			animation: 'am-fade-and-scale'
		});
		
		//若狀態是必須重新登入，則刷掉原本紀錄之後，導回登入頁面
		if(returnData != null && returnData.errorCode == -2){
			clearCredentialService.clearCredentials()
				.then(function(result){
					$location.path(commConst.urlState.INFO.pathUrl);
				});
		}
		
		return false;
	}
}