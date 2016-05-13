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

appRouter.$inject = ['$stateProvider','$urlRouterProvider', '$locationProvider', '$httpProvider'];
function appRouter($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
	//去除#記號
	if(window.history && window.history.pushState){
		$locationProvider.html5Mode(true);
	}
	
    $urlRouterProvider.otherwise("/app");
	//預設首頁路徑
	$stateProvider.state('app', {
			stateName : 'app',
			fullUrl: "${GULP_CLIENT_DOMAIN}" + "app",
            url: "/app",
            templateUrl: 'layout/shell.html',
			controller:'shellController'
        });

	//轉換日期格式從字串轉為日期
	$httpProvider.defaults.transformResponse.push(function(responseData){
		convertDateStringsToDates(responseData);
		return responseData;
	});

	var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

	function convertDateStringsToDates(input) {
		// Ignore things that aren't objects.
		if (typeof input !== "object") return input;

		for (var key in input) {
			if (!input.hasOwnProperty(key)) continue;

			var value = input[key];
			var match;
			// Check for string properties which look like dates.
			// TODO: Improve this regex to better match ISO 8601 date strings.
			if (typeof value === "string" && checkDateNameConstrants(key) && (match = value.match(regexIso8601))) {
				// Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
				var milliseconds = Date.parse(match[0]);
				if (!isNaN(milliseconds) ) {
					input[key] = new Date(milliseconds);
				}
			} else if(checkDateNameConstrants(key)
				&& !isNaN(value)){
				input[key] = new Date(value);
			}else if (typeof value === "object") {
				// Recurse into object
				convertDateStringsToDates(value);
			}
		}
	}
	
	function checkDateNameConstrants(key){
		//限制key結尾包含 date 或 time 或 day 則檢查型態才能轉成日期
		return key.toLowerCase().endsWith('day') || key.toLowerCase().endsWith('date') || key.toLowerCase().endsWith('time');
	}

	
}

run.$inject = ['$rootScope', '$location', '$http', '$timeout', 'sharedProperties', 'runtimeStates', 'commConst', 'authenticationService', '$state', '$window'];
function run( $rootScope, $location, $http, $timeout, sharedProperties, runtimeStates, commConst, authenticationService, $state, $window) {
	
	$window.ga('create', '${GA_ID}', 'auto');
	//$window.fbq('init', '1014059405324390'); 
	$window.fbq('init', '447916538711500');
	
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
		$http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.authdata; // jshint ignore:line
	}
	
	if(sharedProperties.getStorage().uId){
		var uid = sharedProperties.getStorage().uId;
		$http.defaults.headers.common['uId'] = uid;
	}

	/**
	 *  redirect to login page if not logged in and trying to access a restricted page
	 */
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var currentUser = $rootScope.globals.currentUser || null;

		if (toState.authenticate) {
			
			if(!currentUser){	
				$location.path(commConst.urlState.LOGIN.pathUrl);
			}else{
				authenticationService.validateToken()
				.then(function(result){
					if(!result){
						$location.path(commConst.urlState.LOGIN.pathUrl);
					}
				});
			}
			
        }
    });
	
	// record page view on each state change
	$rootScope.$on('$stateChangeSuccess', function (event) {
		$window.ga('send', 'pageview', $location.path());
		$window.fbq.push(['track', "PageView", $location.path()]);
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