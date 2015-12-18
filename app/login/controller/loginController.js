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
	 "facebookLoginService"];	

function loginController(
		$rootScope, $scope, $location, userService, 
		authenticationService, flashService, 
		logService, sharedProperties, facebookLoginService){
		$scope.isLoginPage = true;
		$scope.user = {};

		
		(function(){
			if($rootScope.globals.currentUser || null){
				$location.path('/index/user');
			}
		})();

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
	                $location.path('/index/user');
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
	    		.then(function(response){
					if(response){
						var user = {};
						user.firstName = response.first_name ? response.first_name : response.name;
						user.email = response.email;
						user.fbId = response.id;
						user.lastName = response.last_name;
						if(response.gender == 'male'){
							user.gender = 'M';
						}else if (response.gender == 'female'){
							user.gender = 'F';
						}
						authenticationService.fbLogin(user)
							.then(function(result){
								if(result){
									$location.path('/index/user');
						            location.reload();
								}
							});
						
					} else {
		                flashService.error(result);
		                user.dataLoading = false;
		            }
					
				});
        }
	    /**臉書註冊登出**/
	    $scope.FBlogout = function() {
	    	facebookLoginService.FBlogout();
        }
	    
	    $scope.isSavePermanently = function(){
	    	localStorage.savePermanently = $scope.user.remember;
	    }
	
}
