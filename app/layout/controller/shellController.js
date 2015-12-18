angular.module('shell')
	.controller('shellController',["$rootScope", "$scope", "$location", "commService",
	                               function($rootScope, $scope, $location, commService){

		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};
		
		$scope.loggedIn = $rootScope.globals.currentUser || null;
		
		if($scope.loggedIn){
			$scope.dropdown = [
			                   {
			                	   "text": "個人資料",
			                	   "href": "#/index/user/info"
							   },
			                   {
			                		"text": "訂單",
			                		"href": "#/index/user/orders"
			                   },
        	                   {
        	                    	"text": "登出",
        	                    	"href": "#/index/logout"
        	                   }
        	               ];
		}else{
			$scope.dropdown = [
        	                   {
        	                    	"text": "登入",
        	                    	"href": "#/index/login"
        	                   }
        	               ];
			
		}
		
		/**
		 * whether to show menu at entering page
		*/
		if(commService.getWindowSize().width > 768){
			$scope.isShowMenu = true;
		}else{
			$scope.isShowMenu = false;
		}
		
		/**
		 * check whether to show menu when resize the window
		 */
		window.onresize = commService.windowResizeFunc(
		768, $scope, function(){$scope.isShowMenu = false;}, function(){$scope.isShowMenu = true;});
		
		
	}]);