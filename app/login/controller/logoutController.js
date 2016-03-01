'use strict';
angular.module('login')
	.controller('logoutController', logoutController);

logoutController.$inject = ['$scope', '$location', '$timeout', 'authenticationService', 'logService', 'commConst', '$window'];	
function logoutController($scope, $location, $timeout, authenticationService, logService, commConst, $window){
		
	authenticationService.clearCredentials()
		.then(function(result){
			logService.showSuccess("登出成功");
			var hostname = $location.protocol() + "://" + $location.host() + ($location.port() ? ":" +$location.port() : "");
			$window.location.href = hostname;
		});
}

