'use strict';
angular.module('login')
	.controller('logoutController', logoutController);

logoutController.$inject = ['$scope', '$location', '$timeout', 'authenticationService', 'logService', 'commConst'];	
function logoutController($scope, $location, $timeout, authenticationService, logService, commConst){
		
	authenticationService.clearCredentials()
		.then(function(result){
			logService.showSuccess("登出成功");
			$location.path(commConst.urlState.INDEX.pathUrl);
		});
}

