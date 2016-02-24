'use strict';
angular.module('login')
	.controller('loginController', loginController);

loginController.$inject = 
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
	 '$timeout'
	 ];	

function loginController(
		$rootScope, $scope, $location, userService, 
		authenticationService, flashService, 
		logService, sharedProperties, facebookLoginService,
		commConst, $modal, $timeout){
		$scope.isLoginPage = true;
		$scope.user = {};
		$scope.fbLogin = fbLogin;

		/**
		 * 點擊切換註冊及登入頁面
		 * */
		$scope.togglePage = function(){
			$scope.isLoginPage = !$scope.isLoginPage;
		}
		
		/**
		 * 登入
		 * */
		$scope.onLoginSubmit = function() {
			var user = $scope.user;
			user.dataLoading = true;
			
	        authenticationService.login(user)
	        .then(function(result){
	            if (result) {
	            	sharedProperties.setUser(result);
	                $location.path(commConst.urlState.INFO.pathUrl);
	                location.reload();
	            } else {
	                flashService.error(result);
	                user.dataLoading = false;
	            }
	        });
	    };

	    /**
	     * 註冊
	     * */
	    $scope.onSignupSubmit = function() {
	    	var user = $scope.user;
	    	user.dataLoading = true;
			
	        userService.signup(user)
	            .then(function (success) {
	                if (success) {
	                    flashService.success('Registration successful', success);
	                    logService.showSuccess("歡迎您成為我們的會員，請再次點選登入");
						$scope.isLoginPage = true;
	                } else {
	                    flashService.error(success);
	                    user.dataLoading = false;
	                }

	            });
	    }
		
		/**臉書註冊登入**/
	    $scope.checkLoginState = function() {
	    	facebookLoginService.login()
	    		.then(function(result){
					if(!result) return;
					
					var user = result;
					userService.isFbIdExisted(user.fbId)
						.then(function(isFbIdExisted){
							logService.debug(isFbIdExisted);
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
	    /**臉書註冊登出**/
	    $scope.FBlogout = function() {
	    	facebookLoginService.FBlogout();
        }
	    
	    $scope.isSavePermanently = function(){
	    	localStorage.savePermanently = $scope.user.remember;
	    }
		
		$scope.directToForgetPassword = function(){
			window.open(commConst.urlState.FORGET_PASSWORD.fullUrl);
		}
		
		function fbLogin(user){
			return authenticationService.fbLogin(user)
				.then(function(result){
					if(result){
						$timeout(function(){
							$location.path(commConst.urlState.INFO.pathUrl);
							location.reload();
						}, 2000)
					}
				});
		}
	
}
