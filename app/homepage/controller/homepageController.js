angular.module('shell')
	.controller('homepageController',["$rootScope", "$scope", "$location", "commService", "commConst", "userService" , "$aside", 
	                               function($rootScope, $scope, $location, commService, commConst, userService, aside){

		$scope.isActive = function (viewLocation) { 
			return viewLocation === $location.path();
		};
		
		$scope.urlState = commConst.urlState;
		if(userService.isLoggedIn())
			$scope.loggedIn = $rootScope.globals.currentUser;
		
		setMenu();
		
		$rootScope.$watch('globals.currentUser', function(newVal, oldVal){
			setMenu();
		}, true);

		function setMenu(){
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
										"text": "首頁",
										"click": "clickShow('" + commConst.urlState.HOMEPAGE.pathUrl + "')"
									},
									{
										"text": "登入",
										"click": "clickShow('" + commConst.urlState.LOGIN.pathUrl + "')"
									}
								   
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
		//banner
		$scope.pic = ["content/images/Chip-n-Dale1.jpg", "content/images/Chip-n-Dale2.jpg", "content/images/Chip-n-Dale3.jpg"];
		$scope.pic2 = ["content/images/Chip-n-Dale1.jpg", "content/images/Chip-n-Dale2.jpg", "content/images/Chip-n-Dale3.jpg"];
		//$scope.icon = ["content/images/icon_appledaily.png", "content/images/icon_businessnext.png", "content/images/icon_career.png", 
		//"content/images/icon_chinatimes.png", "content/images/icon_cmoney.png", "content/images/icon_tvbs.png", "content/images/icon_udn.png"];

		$scope.icon = ["content/images/icon_appledaily.png", "content/images/icon_cmoney.png", "content/images/icon_udn.png", 
		"content/images/icon_chinatimes.png", "content/images/icon_businessnext.png", "content/images/icon_tvbs.png"];

		$scope.customer = ["content/images/芽芽媽.png", "content/images/c2.png", "content/images/c3.png"];

		$scope.team = ["content/images/t1.png", "content/images/t2.png", "content/images/t3.png", "content/images/t4.png", "content/images/t5.png", "content/images/t6.png"];
		$scope.farmer = ["content/images/林明德.png", "content/images/林秋木.png", "content/images/柯春輝.png", "content/images/黃友德.png"];
		$scope.farmerTitle = ["雲林水林鄉-黃友德", "屏東-易毅成", "苗栗泰安鄉-柯春輝", "苗栗卓蘭-蔡維忠"];

		$scope.farmerFruit = ["栽種水果", "栽種水果", "栽種水果", "栽種水果"];
		$scope.farmerFruitPho = ["玉女小番茄", "有機火龍果", "紅肉李", "新興梨"];
		$scope.farmerDesc = ["玉女小番茄", "有機火龍果", "紅肉李", "新興梨"];


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

		//var myAside = $aside({title: 'My Title', content: 'My Content', show: true});
		//var myOtherAside = $aside({scope: $scope, template: 'aside/docs/aside.demo.tpl.html'});
		//myOtherAside.$promise.then(function() {
		//    myOtherAside.show();
		//})
		//Modified By: Fainy (end)
	}]);