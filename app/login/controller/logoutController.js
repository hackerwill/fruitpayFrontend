'use strict';
angular.module('login')
	.controller('logoutController', logoutController);

logoutController.$inject = ['$scope', '$location', '$timeout', 'authenticationService', 'logService', 'commConst'];	
function logoutController($scope, $location, $timeout, authenticationService, logService, commConst){
		
	authenticationService.clearCredentials()
		.then(function(result){
			logService.showSuccess("登出成功");
			console.log(1);
			window.location.href = 'http://fruitpay.com.tw';
		});
}

