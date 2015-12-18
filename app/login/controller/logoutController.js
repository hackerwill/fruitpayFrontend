'use strict';
angular.module('login')
	.controller('logoutController', logoutController);

logoutController.$inject = ['$scope', '$location', '$timeout', 'authenticationService', 'logService' ];	
function logoutController($scope, $location, $timeout, authenticationService, logService){
		
	var logout = logout;
	
	(function (){
		authenticationService.clearCredentials();
		$location.path('/index');
		location.reload();
	})();
	
	    
}

