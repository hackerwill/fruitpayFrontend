'use strict';
angular.module('login')
	.controller('facebookBindController', facebookBindController);
	
facebookBindController.$inject = 
	['$rootScope', 
	 '$scope', 
	 '$location', 
	 'userService', 
	 'authenticationService', 
	 'flashService',  
	 'logService',
	 'sharedProperties',
	 'facebookLoginService',
	 'commConst',
	 'user'
	 ];	
	 
function facebookBindController(
		$rootScope, $scope, $location, userService, 
		authenticationService, flashService, 
		logService, sharedProperties, facebookLoginService,
		commConst, user){
			
		$scope.user = user;
		$scope.openForgetPasswordPage = openForgetPasswordPage;
		
		function openForgetPasswordPage(){
			window.open(commConst.urlState.FORGET_PASSWORD.fullUrl);
		}
		
		$scope.onLoginSubmit = function(){
			if ($scope.loginForm.$valid) {   
				userService.login(user)
					.then(function(result){
						logService.debug(result);
						if(result){
							$scope.loginForm.$setValidity("matched", true);
							result = setFbInfo(user, result);
							userService.update(result)
								.then(function(result){
									logService.debug("update finished.", result);
									logService.showSuccess("帳號綁定成功");
									$scope.$parent.fbLogin(result);
									$scope.$hide();
								});
						}
				});
			}else{
				$scope.loginForm.submitted=true;
			}
		}
						
		function setFbInfo(user, result){
			result.fbId = user.fbId;
			if(result.firstName.length == 0) result.firstName = user.firstName;
			if(result.lastName.length == 0) result.lastName = user.lastName;
			if(result.gender.length == 0) result.gender = user.gender;
			return result;
		}
			
}