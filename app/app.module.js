'use strict';
var app = angular.module('app',[
	'ui.router',
	'ngDialog',
	'ngAnimate',
	'ngSanitize',
	'duScroll',
	'shell',
	'checkout',
	'login',
	'user'])
	.config(appRouter)
	.run(run); 

appRouter.$inject = ['$stateProvider','$urlRouterProvider', '$locationProvider'];
function appRouter($stateProvider, $urlRouterProvider, $locationProvider){
	//去除#記號
	if(window.history && window.history.pushState){
		$locationProvider.html5Mode(true);
	}
	//預設首頁路徑
	$stateProvider.state('index', {
			stateName : 'index',
			fullUrl: '/index',
            url: "/index",
            templateUrl: 'layout/shell.html',
			controller:'shellController'
        });
    $urlRouterProvider.otherwise("/index");
}

run.$inject = ['$rootScope', '$location', '$http', '$timeout', 'sharedProperties', 'runtimeStates', 'commConst'];
function run( $rootScope, $location, $http, $timeout, sharedProperties, runtimeStates, commConst) {
	
	//dynamically add state
	for(var key in commConst.urlState){
		var thisUrlState = commConst.urlState[key];
		//INDEX已預先加入，這邊不用再加入
		if(thisUrlState === commConst.urlState.INDEX)
			continue;
		runtimeStates.addState(thisUrlState.stateName, thisUrlState);
	}
	
    // keep user logged in after page refresh
	$rootScope.globals = {};
	if(sharedProperties.getStorage().fruitpayGlobals){
		$rootScope.globals = JSON.parse(sharedProperties.getStorage().fruitpayGlobals) || {};
	}
	
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

	/**
	 *  redirect to login page if not logged in and trying to access a restricted page
	 */
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var loggedIn = $rootScope.globals.currentUser || null;
        if (toState.authenticate && !loggedIn) {
			$timeout(function () {				
				$location.path('/index/login');
			});
        }
        
    });
}

app.animation('.slide-toggle', ['$animateCss', function($animateCss) {
    return {
        addClass: function(element, className, doneFn) {
            if (className == 'ng-hide') {
                var animator = $animateCss(element, {                    
                    to: {height: '0px', opacity: 0}
                });
                if (animator) {
                    return animator.start().finally(function() {
                        element[0].style.height = '';
                        doneFn();
                    });
                }
            }
            doneFn(); 
        },
        removeClass: function(element, className, doneFn) {
            if (className == 'ng-hide') {
                var height = element[0].offsetHeight;
                var animator = $animateCss(element, {
                    from: {height: '0px', opacity: 0},
                    to: {height: height + 'px', opacity: 1}
                });
                if (animator) {
                 return animator.start().finally(doneFn);
                }
            }
            doneFn();
        }
    };
}]);