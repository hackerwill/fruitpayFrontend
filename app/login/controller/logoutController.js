'use strict';
angular.module('login')
	.controller('logoutController', logoutController);

logoutController.$inject = ['$scope', '$location', '$timeout', 'authenticationService', 'logService', 'commConst'];	
function logoutController($scope, $location, $timeout, authenticationService, logService, commConst){
		
	var logout = logout;
	
	(function (){
		authenticationService.clearCredentials();
		$location.path(commConst.urlState.INDEX.pathUrl);
		location.reload();
	})();
	
	    
}

