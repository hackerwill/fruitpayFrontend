'use strict';
angular.module('app')
	.factory('commConst', commConst);

function commConst(){
	var service = {};
	
	service.SERVER_DOMAIN = "http://localhost:8081/fruitpay/";
	
	return service;
}
