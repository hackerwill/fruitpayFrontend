'use strict';
 
angular.module('app')
	.service('clearCredentialService', clearCredentialService);

clearCredentialService.$inject = 
	[ '$q', '$http', '$rootScope', '$timeout', 'sharedProperties', 'flashService', 'commConst'];
function clearCredentialService($q, $http, $rootScope, $timeout, sharedProperties, flashService, commConst) {
	var service = {};

	service.clearCredentials = clearCredentials;
	
	return service;
	
	function clearCredentials() {
		
		return $http.post(commConst.SERVER_DOMAIN + 'loginCtrl/logout')
			.then(function(result){
				$rootScope.globals = {};
				delete sharedProperties.getStorage().fruitpayGlobals;
				delete sharedProperties.getStorage().uId;
				$http.defaults.headers.common.Authorization = '';
				$http.defaults.headers.common.uId = '';
			});
	}
}