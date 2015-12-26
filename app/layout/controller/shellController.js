angular.module('shell')
	.controller('shellController',["$rootScope", "$scope", "$location", "commService", "commConst",
	                               function($rootScope, $scope, $location, commService, commConst){

		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};
		
		$scope.urlState = commConst.urlState;
		
		$scope.loggedIn = $rootScope.globals.currentUser || null;
		if($scope.loggedIn){
			$scope.dropdown = [
			                   {
			                	   "text": "個人資料",
			                	   "href": commConst.CLINET_DOMAIN + commConst.urlState.INFO.fullUrl
							   },
			                   {
			                		"text": "訂單",
			                		"href": commConst.CLINET_DOMAIN + commConst.urlState.ORDERS.fullUrl
			                   },
        	                   {
        	                    	"text": "登出",
        	                    	"href": commConst.CLINET_DOMAIN + commConst.urlState.LOGOUT.fullUrl
        	                   }
        	               ];
		}else{
			$scope.dropdown = [
        	                   {
        	                    	"text": "登入",
        	                    	"href": commConst.CLINET_DOMAIN + commConst.urlState.LOGIN.fullUrl
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