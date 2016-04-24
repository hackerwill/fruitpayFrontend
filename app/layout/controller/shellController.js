angular.module('shell')
	.controller('shellController',["$rootScope", "$scope", "$location", "commService", "commConst", "userService", "$modal", '$q',
	                               function($rootScope, $scope, $location, commService, commConst, userService, $modal, $q){


		$location.path(commConst.urlState.HOMEPAGE.pathUrl);

		
		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};
		
		$scope.urlState = commConst.urlState;
		if(userService.isLoggedIn())
			$scope.loggedIn = $rootScope.globals.currentUser;
		
		$rootScope.$watch('globals.currentUser', function(newVal, oldVal){
			setMenu();
		}, true);

		setMenu();
		
		function setMenu(){
			$scope.loggedIn = $rootScope.globals.currentUser;
			if($scope.loggedIn){
				$scope.dropdown = [
								   {
									   "text": "個人資料",
									   //"click": "clickShow('" + commConst.urlState.INFO.pathUrl + "')"
									   "click": "showInfoPage()"
								   },
								   {
										"text": "訂購資料",
										"click": "clickShow('" + commConst.urlState.ORDERS.pathUrl + "')"
								   },
								   {
										"text": "配送查詢",
										"click": "clickShow('" + commConst.urlState.DELIVER.pathUrl + "')"
								   },
								   {
										"text": "喜好管理",
										//"click": "clickShow('" + commConst.urlState.PREFER.pathUrl + "')"
										"click": "showPreferPage()"
								   },
								   {
										"text": "暫停/取消",
										"click": "showRevisePage()"
								   },
								   {
										"text": "登出",
										"click": "clickShow('" + commConst.urlState.LOGOUT.pathUrl + "')"
								   }
							   ];
			}else{
				$scope.dropdown = [
								  // {
									//	"text": "登入",
								//		"click": "showLoginPage()"
								  // }
							   ];
				
			}

		}
		
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
			}
			if(pathUrl){
				$location.path(pathUrl);
			}
			clickShow();
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


		//Modified By: Fainy
		$scope.slideCount2=0;
		$scope.fruitLeft= function() {
			if ($scope.slideCount2<=0){
				$scope.slideCount2=2;
			}
			else {
				$scope.slideCount2--;
			}
		}
		
		$scope.fruitRight= function() {
			if ($scope.slideCount2>=2){
				$scope.slideCount2=0;
			} else {
				$scope.slideCount2++;
			}
		}

		$scope.showLoginPage= function(){
			var myModal = $modal({
				scope: $scope,
				controller: 'loginDialogController',
				templateUrl: 'login/loginDialog.html', 
				backdrop: 'static',
				keyboard: false,
				show: false});
			myModal.$promise.then(myModal.show);
			clickShow();

		}

		$scope.showInfoPage= function(){
			var myModal = $modal({
				scope: $scope,
				controller: 'infoDialogController',
				templateUrl: 'user/infoDialog.html', 
				backdrop: 'static',
				keyboard: false,
				show: false});
			myModal.$promise.then(myModal.show);
			clickShow();

		}

		$scope.showRevisePage= function(){

			var myModal = $modal({
				scope: $scope,
				controller: 'reviseDialogController',
				templateUrl: 'user/reviseDialog.html', 
				backdrop: 'static',
				keyboard: false,
				show: false});
			myModal.$promise.then(myModal.show);
			clickShow();
		}

		$scope.showPreferPage= function(){
			var myModal = $modal({
				scope: $scope,
				controller: 'preferDialogController',
				templateUrl: 'user/preferDialog.html', 
				backdrop: 'static',
				keyboard: false,
				show: false});
			myModal.$promise.then(myModal.show);
			clickShow();

		}
		//Modified By: Fainy (end)

	}]);