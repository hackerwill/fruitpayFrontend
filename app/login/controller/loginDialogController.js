'use strict';
angular.module('login')
	.controller('loginDialogController', loginDialogController);

loginDialogController.$inject = 
	['$rootScope', 
	 '$scope', 
	 '$location', 
	 'userService', 
	 'authenticationService', 
	 'flashService',  
	 'logService',
	 'sharedProperties',
	 'facebookLoginService',
	 'commConst'
	 ];	
	 
function loginDialogController(
		$rootScope, $scope, $location, userService, 
		authenticationService, flashService, 
		logService, sharedProperties, facebookLoginService,
		commConst){
		$scope.isLoginPage = true;
		$scope.user = {};
		
		logService.debug("enter");
		
		$scope.onLoginSubmit = function(){
			$scope.loginForm.$setValidity("matched", false);
			if ($scope.loginForm.$valid) {   
				logService.debug("fine");
			}else{
				$scope.loginForm.submitted=true;
			}
		}
	
}