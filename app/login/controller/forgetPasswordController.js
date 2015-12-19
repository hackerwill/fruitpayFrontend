'use strict';
angular.module('login')
	.controller('forgetPasswordController', forgetPasswordController);

forgetPasswordController.$inject = ['$scope', '$location', '$timeout', 'authenticationService', 'logService'];	
function forgetPasswordController($scope, $location, $timeout, authenticationService, logService){
		console.log(1);
	
	
	$scope.forgetPassword = forgetPassword;
	function forgetPassword(){
		var user = {
				'email' : $scope.email
			};
			
		authenticationService.forgetPassword(user)
			.then(function(result){
				logService.debug(result);
				if(result){
					logService.showSuccess('密碼變更通知已寄到您的信箱，請前往收信，三秒後導回登入頁面');
					$timeout(setLocation, 3000);
					
				}
			});
	}
	
	function setLocation(){
		$location.path('/index/user');
	}
	    
}

