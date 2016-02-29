/**
 * 2015.10.29 Robecca
 * 
 * 
 */

'use strict';

angular.module('app').factory('facebookLoginService', facebookLoginService);


facebookLoginService.$inject = [ '$q', '$modal', "$window", "logService" ];
function facebookLoginService($q, $modal, $window, logService) {

	var service = {};

	service.login = login;
	service.logout = logout;
	service.showFbBindPage = showFbBindPage;

	return service;
	
	function showFbBindPage(user, $scope){
		var myModal = $modal({
			scope: $scope,
			locals : {user :user},
			controller: 'facebookBindController',
			templateUrl: 'login/facebookBind.html', 
			show: false});
		myModal.$promise.then(myModal.show);
	}
	
	function getInfoUser(response){
		var user = {};
		user.firstName = response.first_name ? response.first_name : response.name;
		user.email = response.email;
		user.fbId = response.id;
		user.lastName = response.last_name;
		if(response.gender == 'male'){
			user.gender = 'M';
		}else if (response.gender == 'female'){
			user.gender = 'F';
		}
		
		return user;
	}

	function login() {
		var deferred = $q.defer();
		checkLoginState(deferred);
		return deferred.promise;
	}

	// This function is called when someone finishes with the Login
	// Button. See the onlogin handler attached to it in the sample
	// code below.
	function checkLoginState(deferred) {
		logService.debug("in checkLoginState");
		$window.FB.getLoginStatus(function(response) {
			statusChangeCallback(response, deferred);
		});
	}

	function statusChangeCallback(response, deferred) {
		logService.debug('statusChangeCallback');
		logService.debug(response);
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			logService.debug('aleady login and authorized');
		} else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			logService.debug('Please log into this app.');
		} else {
			// The person is not logged into Facebook, so we're not sure if
			// they are logged into this app or not.
			logService.debug('Please log intoFacebook');
		}
		FBlogin(deferred);
	}

	function FBlogin(deferred) {
		$window.FB.login(function(response) {
			if (response.authResponse) {
				logService.debug('Welcome!  Fetching your information.... ');
				$window.FB.api('/me?fields=id,first_name,last_name,name,email,gender', function(response) {
					logService.debug('Good to see you, ' + response.name + '.');
					logService.debug(response.email);
					logService.debug(response);
					var access = $window.FB.getAuthResponse();
					//logService.debug(access);
					deferred.resolve(getInfoUser(response));
				});
			} else {
				logService.debug('User cancelled login or did not fully authorize.');
				deferred.reject;
			}

			}, {scope: 'email,user_likes'});
	}

	function logout() {
		logService.debug('in logged out ');
		$window.FB.logout(function(response) {
			// Person is now logged out
			logService.debug('already logged out ');
			logService.debug(response);
		});
	}

}