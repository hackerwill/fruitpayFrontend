'use strict';
angular.module('login')
	.controller('logoutController', logoutController);

logoutController.$inject = ['commService', '$scope', '$location', '$timeout', 'authenticationService', 'logService', 'commConst', '$window'];	
function logoutController(commService, $scope, $location, $timeout, authenticationService, logService, commConst, $window){
		
	authenticationService.clearCredentials()
		.then(function(result){
			logService.showSuccess("登出成功");
			$window.location.href = commService.getHostName() + commConst.urlState.HOMEPAGE.pathUrl;
		});
}

