﻿'use strict';
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
	 'commConst',
	 '$modal',
	 'spinService'
	 ];	
	 
function loginDialogController(
		$rootScope, $scope, $location, userService, 
		authenticationService, flashService, 
		logService, sharedProperties, facebookLoginService,
		commConst, $modal, spinService){
		$scope.user = {};
		$scope.fbLogin = fbLogin;
		$scope.openForgetPasswordPage = openForgetPasswordPage;
		
		function openForgetPasswordPage(){
			window.open(commConst.urlState.FORGET_PASSWORD.fullUrl);
		}
		
		$scope.onFbLogin = function(){
			spinService.startSpin("臉書登入中");
			facebookLoginService.login()
	    		.then(function(result){
					logService.debug(result);
					if(!result) return;
					
					var user = result;
					userService.isFbIdExisted(user.fbId)
						.then(function(isFbIdExisted){
							$scope.$hide();
							if(isFbIdExisted || !user.email){
								fbLogin(user);
							}else{
								userService.isEmailExisted(user.email)
									.then(function(isMailExisted){
										logService.debug(isMailExisted);
										//已有信箱存在
										if(isMailExisted){
											facebookLoginService.showFbBindPage(user, $scope);
										//新帳號
										}else{
											fbLogin(user);
										}
									});
							};
						});
					
				});
		}
		
		$scope.onLoginSubmit = function(){
			if ($scope.loginForm.$valid) {  
				if($scope.hasAccount){
					login($scope.user);
				}else{
					$scope.user.firstName = $scope.$parent.user.firstName;
					$scope.user.lastName = $scope.$parent.user.lastName;
					signup($scope.user);
				}
			}else{
				$scope.loginForm.submitted=true;
			}
		}
		
		function login(user){
			spinService.startSpin("登入中"); 
			authenticationService.login(user)
				.then(function(result){
					spinService.stop();
					if (result) {
						logService.showSuccess("您已成功登入");
						sharedProperties.setUser(result);
						$scope.$parent.dialogSetUser(result);
						if ($scope.$parent.checkoutForm.$valid) {   
							$scope.$parent.onCheckoutSubmit();
						}
						$scope.$hide();
					}
				});
		}
		
		function signup(user){
			spinService.startSpin("註冊中"); 
			userService.signup(user)
	            .then(function (success) {
					spinService.stop();
	                if (success) {
	                    logService.showSuccess("歡迎您成為我們的會員，請再次點選登入");
						$scope.hasAccount = true;
	                }
	            });
		}
		
		function fbLogin(user){
			authenticationService.fbLogin(user)
				.then(function(result){
					spinService.stop();
					if(result){
						logService.showSuccess("您已成功登入");
						$scope.$parent.dialogSetUser(result);
						if ($scope.$parent.checkoutForm.$valid) {   
							$scope.$parent.onCheckoutSubmit();
						}
						$scope.$parent.onCheckoutSubmit();
					}
				});
		}
	
}