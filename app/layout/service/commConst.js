'use strict';
angular.module('app')
	.factory('commConst', commConst);

function commConst(){
	var service = {};
	/**
	 * Server connection domain
	 */
	service.SERVER_DOMAIN = "${GULP_SERVER_DOMAIN}";
	service.CLINET_DOMAIN = "${GULP_CLIENT_DOMAIN}";
	
	service.DAY_OF_WEEK = {
		1 : '一',
		3 : '三'
	}
	
	/**
	 * There are three types : 'INFO', 'DEBUG', 'ERROR'
	 */
	service.INFO_LOG = 'INFO';
	service.DEBUG_LOG = 'DEBUG';
	service.ERROR_LOG = 'ERROR';
	service.allLogModes = [service.INFO_LOG, service.DEBUG_LOG, service.ERROR_LOG];
	/**
	 * Current Mode 
	 */
	service.LOG_MODE = service.DEBUG_LOG;
	
	service.urlState = {
		INDEX : {
			stateName : 'app',
			fullUrl: service.CLINET_DOMAIN + 'app',
            url: "/app",
			pathUrl : "/app",
            templateUrl: 'layout/shell.html',
			controller:'shellController'
        },
		CHECKOUT : {
			stateName : 'app.checkout',
			fullUrl: service.CLINET_DOMAIN + "app/checkout",
            url: "/checkout",
			pathUrl : "/app/checkout",
            templateUrl: 'checkout/checkout.html',
            controller:'checkoutController'
        },
		LOGIN : {
			stateName : 'app.login',
			fullUrl: service.CLINET_DOMAIN + "app/login",
            url: "/login",
			pathUrl : "/app/login",
            templateUrl: 'login/login.html',
            controller:'loginController'
        },
		LOGOUT : {
			stateName : 'app.logout',
			fullUrl: service.CLINET_DOMAIN + "app/logout",
            url: "/logout",
			pathUrl : "/app/logout",
            templateUrl: 'login/logout.html',
            controller:'logoutController'
        },
		FORGET_PASSWORD : {
			stateName : 'app.forgetPassword',
			fullUrl: service.CLINET_DOMAIN + "app/forgetPassword",
            url: "/forgetPassword",
			pathUrl : "/app/forgetPassword",
            templateUrl: 'login/forgetPassword.html',
			controller:'forgetPasswordController',
        },
		USER : {
			stateName : 'app.user',
			fullUrl: service.CLINET_DOMAIN + "app/user",
            url: "/user",
			pathUrl : "/app/user",
            templateUrl: 'user/user.html',
            controller:'userController',
            authenticate: true
        },
		ORDERS : {
			stateName : 'app.user.orders',
			fullUrl: service.CLINET_DOMAIN + "app/user/orders",
			url: "/orders",
            pathUrl: "/app/user/orders",
            templateUrl: 'user/order.html',
            controller:'orderController',
            authenticate: true
        },
		INFO : {
			stateName : 'app.user.info',
			fullUrl: service.CLINET_DOMAIN + "app/user/info",
			url: "/info",
			pathUrl: "/app/user/info",
            templateUrl: 'user/info.html',
            controller:'infoController',
            authenticate: true
        },
		CHECKOUT_CREDIT_CARD_SUCCESS : {
			stateName : 'app.checkoutCreditCardSuccess',
			fullUrl: service.CLINET_DOMAIN + "app/checkoutCreditCardSuccess",
			url: "/checkoutCreditCardSuccess",
			pathUrl: "/app/checkoutCreditCardSuccess",
            templateUrl: 'checkout/checkoutCreditCardSuccess.html'
		}
	};
	
	return service;
}
