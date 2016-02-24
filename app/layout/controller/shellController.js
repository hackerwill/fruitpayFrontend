angular.module('shell')
	.controller('shellController',["$rootScope", "$scope", "$location", "commService", "commConst", "userService",
	                               function($rootScope, $scope, $location, commService, commConst, userService){

		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};
		
		$scope.urlState = commConst.urlState;
		
		if(userService.isLoggedIn())
			$scope.loggedIn = $rootScope.globals.currentUser;
		
		if($scope.loggedIn){
			$scope.dropdown = [
			                   {
			                	   "text": "個人資料",
								   "click": "clickShow('" + commConst.urlState.INFO.pathUrl + "')"
							   },
			                   {
			                		"text": "訂單",
									"click": "clickShow('" + commConst.urlState.ORDERS.pathUrl + "')"
			                   },
        	                   {
        	                    	"text": "登出",
									"click": "clickShow('" + commConst.urlState.LOGOUT.pathUrl + "')"
        	                   }
        	               ];
		}else{
			$scope.dropdown = [
        	                   {
        	                    	"text": "登入",
									"click": "clickShow('" + commConst.urlState.LOGIN.pathUrl + "')"
        	                   }
        	               ];
			
		}
		
		/**
		 * whether to show menu at entering page
		*/
		if(commService.getWindowSize().width > 768){
			$scope.keepShowMenu = true;
			$scope.clickShowMenu = true;
		}else{
			$scope.keepShowMenu = false;
			$scope.clickShowMenu = false;
		}
		
		$scope.clickShow= function(pathUrl){
			if(!$scope.keepShowMenu){
				$scope.clickShowMenu = !$scope.clickShowMenu;
			}
			if(pathUrl){
				$location.path(pathUrl);
			}
		}
		
		/**
		 * check whether to show menu when resize the window
		 */
		window.onresize = commService.windowResizeFunc(
		768, $scope, function(){$scope.keepShowMenu = false;}, function(){$scope.keepShowMenu = true;});
		
		
	}]);