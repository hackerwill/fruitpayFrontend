'use strict';
angular.module('app')
	.factory('savedSessionService', savedSessionService);

savedSessionService.$inject = ['$http', 'logService', 'sharedProperties', '$q'];
function savedSessionService($http, logService, sharedProperties, $q) {
	var service = {};
	
	service.getObject = getObject;
	service.setObject = setObject;
	service.removeObject = removeObject;
	
	return service;
	
	
	function getObject(name){
		if(!name)
			return null;
		var obj = null;
		try{
			if(sessionStorage.getItem(name))
				obj = JSON.parse(sessionStorage.getItem(name));
		}catch(error){
			console.log(error);
		}
		return obj;
			
	}
	
	function setObject(name, object){
		if(!name)
			return null;
		sessionStorage.setItem(name, JSON.stringify(object));
	}
	
	function removeObject(name){
		sessionStorage.setItem(name, null);
	}
	
}
