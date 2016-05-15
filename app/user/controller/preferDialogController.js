'use strict';
angular.module('user')
	.controller('preferDialogController',
			["$scope",
			 "orderService",
			 'authenticationService',
			 'logService',
			 '$modal',
			 "commService", 
			 '$q', 
			 function($scope, orderService, 
					 authenticationService, logService, $modal, commService, $q){
					
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
		
		//Modified By: Fainy
		$scope.closeModal = function() {
			$scope.$hide();
		}

		$q.all([
			//得到所有產品
			commService.getAllProducts()
				.then(getAllProductsCallback),
			]).then(getAllRequiredDataCallback);
				
		function getAllRequiredDataCallback(){
			
		}

		$scope.aa= [];
		function getAllProductsCallback(result){
			
			/*var resizeAppend = '?resize=200%2C150';
			for (var i = 0; i< result.length; i++) {
				if(result[i].imageLink == null || result[i].imageLink.length == 0 || result[i].productName.length == 0)
					delete result[i];
			}*/
			/*
			var orderPreferences = [];
			for (var i = 0; i< result.length; i++) {
				if(result[i]){
					result[i].imageLink = result[i].imageLink + resizeAppend;
					var obj = {};
					obj.likeDegree = 3; //一般的訂為3
					obj.product = result[i];
					orderPreferences.push(obj);

				}
			}*/
			/*
			for (var i = 0; i< orderPreferences.length; i++) {
				var index = Math.floor(i/$scope.imageNum);
				var num = i%$scope.imageNum + 1;
				if(!$scope.order.slides[index])
					$scope.order.slides[index] = {};
				$scope.order.slides[index]['image' + num] = orderPreferences[i];
			}
			$scope.order.totalImageAmount = orderPreferences.length;
			$scope.order.orderPreferences = orderPreferences;
			*/

			for (var i = 0; i< result.length; i++) {
				$scope.aa.push(result[i].productName);
			}
		}
		
		//Modified By: Fainy (end)
			

	}]);
