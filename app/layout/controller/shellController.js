angular.module('shell')
	.controller('shellController',["$rootScope", "$scope", "$location", "commService", "commConst", "userService", "$modal", '$q', 
	                               function($rootScope, $scope, $location, commService, commConst, userService, $modal, $q){
		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};

    var hostname = commService.getHostName();
    $scope.blogUrl = hostname + '/blog';
    $scope.farmerUrl = hostname + '/果物小農';

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
		
		$scope.clickShow= function(pathUrl){
			if(!$scope.keepShowMenu){
				$scope.clickShowMenu = !$scope.clickShowMenu;
				$scope.showAsidePage();
			}
			if(pathUrl){
				$location.path(pathUrl);
			}
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

		$scope.showAsidePage= function(){
			var myModal = $modal({
				scope: $scope,
				controller: 'asideController',
				templateUrl: 'layout/aside.html', 
				backdrop: 'static',
				keyboard: false,
				show: false});
			myModal.$promise.then(myModal.show);
		}

	}]);