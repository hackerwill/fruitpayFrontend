'use strict';
angular.module('app')
	.factory('commConst', commConst);

function commConst(){
	var service = {};
	/**
	 * Server connection domain
	 */
	service.SERVER_DOMAIN = "http://localhost:8081/fruitpay/";
	service.RECEIVE_DAY = "三";
	
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
			stateName : 'index',
			fullUrl: '/index',
            url: "/index",
            templateUrl: 'layout/shell.html',
			controller:'shellController'
        },
		CHECKOUT : {
			stateName : 'index.checkout',
			fullUrl: "/index/checkout",
            url: "/checkout",
            templateUrl: 'checkout/checkout.html',
            controller:'checkoutController'
        },
		LOGIN : {
			stateName : 'index.login',
			fullUrl: "/index/login",
            url: "/login",
            templateUrl: 'login/login.html',
            controller:'loginController'
        },
		LOGOUT : {
			stateName : 'index.logout',
			fullUrl: "/index/logout",
            url: "/logout",
            templateUrl: 'login/logout.html',
            controller:'logoutController'
        },
		FORGET_PASSWORD : {
			stateName : 'index.forgetPassword',
			fullUrl: "/index/forgetPassword",
            url: "/forgetPassword",
            templateUrl: 'login/forgetPassword.html',
			controller:'forgetPasswordController',
        },
		USER : {
			stateName : 'index.user',
			fullUrl: "/index/user",
            url: "/user",
            templateUrl: 'user/user.html',
            controller:'userController',
            authenticate: true
        },
		ORDERS : {
			stateName : 'index.user.orders',
			fullUrl: "/index/user/orders",
            url: "/orders",
            templateUrl: 'user/order.html',
            controller:'orderController',
            authenticate: true
        },
		INFO : {
			stateName : 'index.user.info',
			fullUrl: "/index/user/info",
			url: "/info",
            templateUrl: 'user/info.html',
            controller:'infoController',
            authenticate: true
        },
		CHECKOUT_CREDIT_CARD_SUCCESS : {
			stateName : 'index.checkoutCreditCardSuccess',
			fullUrl: "/index/checkoutCreditCardSuccess",
			url: "/checkoutCreditCardSuccess",
            templateUrl: 'checkout/checkoutCreditCardSuccess.html'
		}
	};
	
	return service;
}
