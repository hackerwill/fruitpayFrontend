angular.module('shell')
	.controller('asideController',["$rootScope", "$scope", "$location", "commService", "commConst", "userService" , "$aside", 
	                               function($rootScope, $scope, $location, commService, commConst, userService, aside){

    var hostname = commService.getHostName();
    $scope.blogUrl = hostname + '/blog';
    $scope.farmerUrl = hostname + '/果物小農';

		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};
		
		$scope.urlState = commConst.urlState;
		if(userService.isLoggedIn())
			$scope.loggedIn = $rootScope.globals.currentUser;
		
		/**
		 * whether to show menu at entering page
		*/
		if(commService.getWindowSize().width >= 768){
			$scope.keepShowMenu = true;
			$scope.clickShowMenu = true;
		}else{
			$scope.keepShowMenu = false;
			$scope.clickShowMenu = false;
		}
    
		/**
		 * check whether to show menu when resize the window
		 */
		window.onresize = commService.windowResizeFunc(
		768, $scope, 
			function(){
				$scope.keepShowMenu = true;
				$scope.clickShowMenu = true;
			}, 
			function(){
				$scope.keepShowMenu = false;
				$scope.clickShowMenu = false;
			});

		$scope.close= function(){
			$scope.$hide();
		}
		//Modified By: Fainy (end)
	}]);