'use strict';
angular.module('app')
	.factory('commConst', commConst);

function commConst(){
	var service = {};
	
	service.SERVER_DOMAIN = "http://localhost:8081/fruitpay/";
	
	/**
	 * There are three types : 'INFO', 'DEBUG', 'ERROR'
	 */
	service.INFO_LOG = 'INFO';
	service.DEBUG_LOG = 'DEBUG';
	service.ERROR_LOG = 'ERROR';
	service.allLogModes = [service.INFO_LOG, service.DEBUG_LOG, service.ERROR_LOG];
	
	service.LOG_MODE = service.DEBUG_LOG;
	
	return service;
}
