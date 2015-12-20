'use strict';
angular.module('user')
	.controller('userController',
			["$scope", 
			 "sharedProperties", 
			 "$location", 
			 "authenticationService", 
			 "flashService",
			 "orderService",
			 function($scope, sharedProperties, $location, authenticationService, 
					 flashService, orderService){
		
		authenticationService.getUser()
			.then(function(user){
				if(user){
					$scope.user = user;
				}else{
					$location.path(commConst.urlState.INDEX.fullUrl);
				}
			});
		
	}]);