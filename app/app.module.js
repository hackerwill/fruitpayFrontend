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

appRouter.$inject = ['$stateProvider','$urlRouterProvider'];
function appRouter($stateProvider, $urlRouterProvider){
	var urlStates = [
		{
			stateName : 'index',
			fullUrl: '/index',
            url: "/index",
            templateUrl: 'layout/shell.html',
			controller:'shellController'
        },
		{
			stateName : 'index.checkout',
			fullUrl: "/index/checkout",
            url: "/checkout",
            templateUrl: 'checkout/checkout.html',
            controller:'checkoutController'
        },
		{
			stateName : 'index.login',
			fullUrl: "/index/login",
            url: "/login",
            templateUrl: 'login/login.html',
            controller:'loginController'
        },
		{
			stateName : 'index.logout',
			fullUrl: "/index/logout",
            url: "/logout",
            templateUrl: 'login/logout.html',
            controller:'logoutController'
        },
		{
			stateName : 'index.forgetPassword',
			fullUrl: "/index/forgetPassword",
            url: "/forgetPassword",
            templateUrl: 'login/forgetPassword.html',
			controller:'forgetPasswordController',
        },
		{
			stateName : 'index.user',
			fullUrl: "/index/user",
            url: "/user",
            templateUrl: 'user/user.html',
            controller:'userController',
            authenticate: true
        },
		{
			stateName : 'index.user.orders',
			fullUrl: "/index/user/orders",
            url: "/orders",
            templateUrl: 'user/order.html',
            controller:'orderController',
            authenticate: true
        },
		{
			stateName : 'index.user.info',
			fullUrl: "/index/user/info",
			url: "/info",
            templateUrl: 'user/info.html',
            controller:'infoController',
            authenticate: true
        },
		{
			stateName : 'index.checkoutCreditCardSuccess',
			fullUrl: "/index/checkoutCreditCardSuccess",
			url: "/checkoutCreditCardSuccess",
            templateUrl: 'checkout/checkoutCreditCardSuccess.html'
		}
	];
	console.log(urlStates);
	for(var i = 0 ; i < urlStates.length; i ++){
		var urlState = urlStates[i];
		console.log(urlState);
		$stateProvider.state(urlState.stateName, urlState);
	}
    $urlRouterProvider.otherwise("/index");
}

run.$inject = ['$rootScope', '$location', '$http', '$timeout', 'sharedProperties'];
function run( $rootScope, $location, $http, $timeout, sharedProperties) {
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


app.constant('TEST_CASE', 'testCAse');