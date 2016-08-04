angular.module('shell')
	.controller('shellController',["$rootScope", "$scope", "$location", "commService", "commConst", "userService", "$modal", '$q', 
	                               function($rootScope, $scope, $location, commService, commConst, userService, $modal, $q){
		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};

	    var hostname = commService.getHostName();
    	$scope.blogUrl = hostname + '/blog';
    	$scope.farmerUrl = hostname + '/果物小農';

    	// fainy: watch page title
		$scope.PAGE_TITLE = $rootScope.globalTitle;
		$rootScope.$watch('globalTitle', function(newVal, oldVal){
			$scope.PAGE_TITLE = $rootScope.globalTitle;
		}, true);
		
		$scope.urlState = commConst.urlState;

		// fainy: watch currentUser
		$rootScope.$watch('globals.currentUser', function(newVal, oldVal){
			if(userService.isLoggedIn())
				$scope.loggedIn = $rootScope.globals.currentUser;
		}, true);
		
		
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
				//animation: 'am-slide-left',
				show: false});
			myModal.$promise.then(myModal.show);
		}

		window.addEventListener('load', function(){
		    var mcontainer = document.getElementById('mcontainer'),
		    boxleft,
		    startx,
		    dist,
		    touchobj = null
		    mcontainer.addEventListener('touchstart', function(e){
		        touchobj = e.changedTouches[0]
		        startx = parseInt(touchobj.clientX) 
		        e.preventDefault()
		    }, false)

		    mcontainer.addEventListener('touchmove', function(e){
		        touchobj = e.changedTouches[0]
		        e.preventDefault()
		    }, false)
		    mcontainer.addEventListener('touchend', function(e){
		    	var touchobj = e.changedTouches[0]
		    	dist = parseInt(touchobj.clientX) - startx 
		    	if (dist>30){
		       		$scope.showAsidePage();
		        }
		    }, false)
		 
		}, false)
		 
	}]);