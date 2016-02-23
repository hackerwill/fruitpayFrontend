'use strict';
angular.module('user')
	.controller('infoController',
			["$scope",
			 "orderService",
			 'authenticationService',
			 'logService',
			 '$modal',
			 function($scope, orderService, 
					 authenticationService, logService, $modal){
					
		$scope.getInfo = getInfo;
		$scope.uneditable = true;
		$scope.toEdit = toEdit;
		$scope.toReadonly = toReadonly;
		$scope.onUserSubmit = onUserSubmit;
		
		function getInfo(){
			authenticationService.getUser()
				.then(function(user){
					if(user){
						logService.debug(user);
						$scope.user = user;
						if(user.fbId)
							$scope.fbId = user.fbId;
					}else{
						$location.path(commConst.urlState.INDEX.pathUrl);
					}
				});
		}
		
		function toEdit(){
			if($scope.uneditable == true){
				$scope.userBackup= angular.copy($scope.user);
				$scope.uneditable = false;
			}
				
		}
		
		function toReadonly(){
			if($scope.uneditable == false){
				angular.copy($scope.userBackup, $scope.user);
				$scope.uneditable = true;
				$scope.userForm.submitted= false;  
			}
		}
		
		function onUserSubmit(){
			if ($scope.userForm.$valid) {   
				authenticationService.updateUser($scope.user)
					.then(function(result){
						if(result){
							$scope.user = result;
							$scope.uneditable = true;
							$scope.userForm.submitted = false;
							
							logService.showSuccess("您的個人資料已經更新");
						}
					});
			}else {   
				$scope.userForm.submitted = true;  			
			}
		}
		
		function MyModalController($scope) {
			authenticationService.getUser()
				.then(function(user){
					if(user){
						$scope.pwd = {};
						$scope.pwd.customerId = user.customerId;
					}else{
						$location.path(commConst.urlState.INDEX.pathUrl);
					}
				});
    		
		    $scope.title = '變更密碼';
		    $scope.pwdChange = function(){
		    	if ($scope.pwdForm.$valid) {  
		    		if($scope.pwd.oldPassword == $scope.pwd.confirmPassword){
		    			logService.showDanger("舊密碼與新密碼相同");
		    			$scope.pwd.oldPassword = "";
		    			$scope.pwd.newPassword = "";
		    			$scope.pwd.confirmPassword = "";
		    			return;
		    		}
		    		
		    		if($scope.pwd.newPassword != $scope.pwd.confirmPassword){
		    			logService.showDanger("舊密碼與新密碼不符合");
		    			$scope.pwd.newPassword = "";
		    			$scope.pwd.confirmPassword = "";
		    			return;
		    		}
		    		
		    		authenticationService.changePassword($scope.pwd)
		    			.then(function(result){
		    				if(result){
		    					logService.showSuccess("修改密碼成功");
		    					$scope.$hide();
		    				}
		    			});
			    	
				}else {
					//if form is not valid set $scope.addContact.submitted to true     
					$scope.pwdForm.submitted=true;  			
				};
		    }
		  }
		  MyModalController.$inject = ['$scope'];
		  var myModal = $modal({
			  controller: MyModalController, 
			  templateUrl: 'user/changePwd.html', 
			  show: false
		  });
		  $scope.showModal = function() {
		    myModal.$promise.then(myModal.show);
		  };
		  $scope.hideModal = function() {
		    myModal.$promise.then(myModal.hide);
		  };
		
	}]);
