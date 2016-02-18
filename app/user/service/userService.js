'use strict';
 
	angular
        .module('app')
		.factory('userService', userService);
	
	userService.$inject = ['$http','logService', '$rootScope', 'commConst'];
	function userService($http, logService, $rootScope, commConst){
		var service = {};
		
		service.signup = signup;
		service.login = login;
		service.fbLogin = fbLogin;
		service.loginById = loginById;
		service.update = update;
		service.changePassword = changePassword;
		service.forgetPassword = forgetPassword;
		service.isLoggedIn = isLoggedIn;
		service.isEmailExisted = isEmailExisted;
		service.isFbIdExisted = isFbIdExisted;
		service.checkEmailPasswordMatch = checkEmailPasswordMatch;
		
		return service;
		
		function isLoggedIn(){
			return $rootScope.globals != null && $rootScope.globals.currentUser != null;
		}
		
		function forgetPassword(user){
			return $http.post(commConst.SERVER_DOMAIN + 'loginCtrl/forgetPassword', user)
				.then(logService.successCallback, logService.errorCallback);
		}
		
		function changePassword(pwd){
			return $http.post(commConst.SERVER_DOMAIN + 'loginCtrl/changePassword', pwd)
				.then(logService.successCallback, logService.errorCallback);
		}
		
		function fbLogin(user){
			return $http.post(commConst.SERVER_DOMAIN + 'loginCtrl/fbLogin', user)
			.then(logService.successCallback, logService.errorCallback);
		}
		
		function signup(user){
			return $http.post(commConst.SERVER_DOMAIN + 'loginCtrl/signup', user)
			.then(logService.successCallback, logService.errorCallback);
		}
		
		function login(user){
			return $http.post(commConst.SERVER_DOMAIN + 'loginCtrl/login', user)
			.then(logService.successCallback, logService.errorCallback);
		}
		
		function checkEmailPasswordMatch(user){
			return $http.post(commConst.SERVER_DOMAIN + 'loginCtrl/match', user)
			.then(logService.successCallback, logService.errorCallback);
		}
		
		function loginById(user){
			return $http.post(commConst.SERVER_DOMAIN + 'loginCtrl/loginById', user)
			.then(logService.successCallback, logService.errorCallback);
		}
		
		function update(user){
			return $http.post(commConst.SERVER_DOMAIN + 'customerDataCtrl/update', user)
			.then(logService.successCallback, logService.errorCallback);
		}

		function isEmailExisted(email){
			return $http.get(commConst.SERVER_DOMAIN + 'customerDataCtrl/isEmailExisted/'+ email + '/')
				.then(logService.successCallback, logService.errorCallback);
		}
		
		function isFbIdExisted(fbId){
			return $http.post(commConst.SERVER_DOMAIN + 'customerDataCtrl/isFbIdExisted/'+ fbId)
				.then(logService.successCallback, logService.errorCallback);
		}
		
	}