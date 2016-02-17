'use strict';
 
angular.module('app')
	.factory('authenticationService', authenticationService);

authenticationService.$inject = 
	[ '$q', '$http', '$rootScope', '$timeout', 'userService', 'sharedProperties', 'flashService', 'commConst', 'logService'];
function authenticationService($q, $http, $rootScope, $timeout, userService, sharedProperties, flashService, commConst, logService) {
	var service = {};

	service.fbLogin = fbLogin;
	service.login = login;
	service.clearCredentials = clearCredentials;
	service.isCredentialsMatch = isCredentialsMatch;
	service.getUser = getUser;
	service.updateUser = updateUser;
	service.changePassword = changePassword;
	service.forgetPassword = forgetPassword;
	service.validateToken = validateToken;
	
	return service;
	
	function forgetPassword(user){
		return userService.forgetPassword(user)
			.then(function(result) {
				if(result)
					return result;
		});
	}
	
	function changePassword(pwd){
		return userService.changePassword(pwd)
			.then(function(result){
				if(result){
					sharedProperties.setUser(result);
					setCredentials(result);
					return result;
				}
			});
	}
	
	function updateUser(user){
		return userService.update(user)
			.then(function(result){
				if(result){
					sharedProperties.setUser(result);
					setCredentials(result);
				}
				return result;
			});
	}
	
	function getUser(){
		var deferred = $q.defer();
		var user = sharedProperties.getUser(); 	
		
		//有登入資料
		if(user){
			deferred.resolve(user);
		//有驗證資料	
		}else if(!user && isCredentialsMatch()){ 
			var user = getDecodedUser();
			if(user){
				loginById(user)
					.then(function(result){
						if (result) {
							user = result;
							sharedProperties.setUser(result);
							deferred.resolve(user);
						} else {
							flashService.error(result);
						}
					});
			}
		}
		
		return deferred.promise;
	}
	
	function fbLogin(user, callback) {
		var uId = getUniqueId(user);
		$http.defaults.headers.common.uId = uId;
		return userService.fbLogin(user).then(function(result) {
			if(result){
				sharedProperties.getStorage().uId = uId;
				setCredentials(result);
			}
			return result;
		});
	}

	function login(user) {
		var uId = getUniqueId(user);
		$http.defaults.headers.common.uId = uId;
		return userService.login(user).then(function(result) {
			if(result){
				sharedProperties.getStorage().uId = uId;
				setCredentials(result);
			}
			return result;
		});
	}
	
	function validateToken(){
		var user = getDecodedUser();
		return $http.post(commConst.SERVER_DOMAIN + 'loginCtrl/validateToken', user)
				.then(logService.successCallback, logService.errorCallback);
		}
	
	function getUniqueId(user){
		var key = user.fbId ? user.fbId : user.email + ':' + user.password;
		var uId = Base64.encode(key + ':' + new Date().getTime());
		return uId;
	}
	
	function loginById(user) {
		logService.debug(user);
		return userService.loginById(user).then(function(result) {
			if(result)
				setCredentials(result);
			return result;
		});
	}
	
	function isCredentialsMatch(){
		var match = false;
		if($rootScope.globals && $http.defaults.headers.common['Authorization']){
			var authData = $rootScope.globals.currentUser.authdata;
			var auth = $http.defaults.headers.common['Authorization'];
			if(authData == auth)
				match = true;
		}
		
		return match;
	}
	
	function getDecodedUser(){
		if(!$rootScope.globals || !$rootScope.globals.currentUser)
			return;
		var user = {};
		user.customerId = $rootScope.globals.currentUser.customerId;
		user.firstName = $rootScope.globals.currentUser.firstName;
		return user;		
	}

	function setCredentials(user) {
		var customerId = user.customerId;
		var fbId = user.fbId;
		var firstName = user.firstName;
		console.log($rootScope.globals.currentUser);
		var authdata = $rootScope.globals.currentUser ? $rootScope.globals.currentUser.authdata : user.token;
		user.token = null;
		$rootScope.globals = {
			currentUser : {
				fbId : fbId,
				customerId : customerId,
				firstName : firstName,
				authdata : authdata
			}
		};
		
		sharedProperties.getStorage().fruitpayGlobals =  JSON.stringify($rootScope.globals);
		$http.defaults.headers.common['Authorization'] = authdata; // jshint ignore:line
	}

	function clearCredentials() {
		$rootScope.globals = {};
		delete sharedProperties.getStorage().fruitpayGlobals;
		delete sharedProperties.getStorage().uId;
		$http.defaults.headers.common.Authorization = '';
		$http.defaults.headers.common.uId = '';
		
		$http.post(commConst.SERVER_DOMAIN + 'loginCtrl/logout')
			.then(function(result){
				logService.debug(result);
			});
	}
}

// Base64 encoding service used by AuthenticationService
var Base64 = {

	keyStr : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

	encode : function(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + this.keyStr.charAt(enc1)
					+ this.keyStr.charAt(enc2) + this.keyStr.charAt(enc3)
					+ this.keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);

		return output;
	},

	decode : function(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
		if (base64test.exec(input)) {
			window
					.alert("There were invalid base64 characters in the input text.\n"
							+ "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"
							+ "Expect errors in decoding.");
		}
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		do {
			enc1 = this.keyStr.indexOf(input.charAt(i++));
			enc2 = this.keyStr.indexOf(input.charAt(i++));
			enc3 = this.keyStr.indexOf(input.charAt(i++));
			enc4 = this.keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";

		} while (i < input.length);

		return output;
	}
};
