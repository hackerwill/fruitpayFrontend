'use strict';
angular
.module('app')
.service('sharedProperties', sharedProperties);

function sharedProperties(){

	var that = this;
	
	var user = null;
	var countyList = null;
	var towershipMap = null;
	var villageMap = null;
	var storage = null;
	
    return {
        getUser: function () {
            return that.user;
        },
        setUser: function(user) {
        	that.user = user;
        },
        getCountyList: function () {
            return that.countyList;
        },
        setCountyList: function() {
        	that.countyList = countyList;
        },
        getTowershipList: function (key) {
        	if(!that.towershipMap)
        		that.towershipMap = {};
        	if (! key in that.towershipMap)
        		return null;
        	return that.towershipMap[key];
        },
        setTowershipList: function(key, list) {
        	that.towershipMap[key] = list;
        },
        getVillageList: function (key) {
        	if(!that.villageMap)
        		that.villageMap = {};
        	if (! key in that.villageMap)
        		return null;
            return that.villageMap[key];
        },
        setVillageList: function(key, list) {
        	that.villageMap[key] = list;
        },
        getStorage: function(){
        	if(localStorage.savePermanently == 'true')
        		return localStorage;
        	else 
        		return sessionStorage;
        },
        isFBLogin: function(){
        	var flag = false;
        	if(that.user && that.user.fbId){
        		flag = true;
        	}
        	return flag;
        }
    };
	
}
