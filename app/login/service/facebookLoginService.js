/**
 * 2015.10.29 Robecca
 * 
 * 
 */

'use strict';

angular.module('app').factory('facebookLoginService', facebookLoginService);

window.fbAsyncInit = function() {
	FB.init({
		appId : '176554396019336',
		xfbml : true,
		version : 'v2.4'
	});
};

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

facebookLoginService.$inject = [ '$q' ];
function facebookLoginService($q) {

	var service = {};

	service.login = login;

	return service;

	function login() {
		var deferred = $q.defer();
		checkLoginState(deferred);
		return deferred.promise;
	}

	// This function is called when someone finishes with the Login
	// Button. See the onlogin handler attached to it in the sample
	// code below.
	function checkLoginState(deferred) {
		console.log("in checkLoginState");
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response, deferred);
		});
	}

	function statusChangeCallback(response, deferred) {
		console.log('statusChangeCallback');
		console.log(response);
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			console.log('aleady login and authorized');
		} else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			console.log('Please log into this app.');
		} else {
			// The person is not logged into Facebook, so we're not sure if
			// they are logged into this app or not.
			console.log('Please log intoFacebook');
		}
		FBlogin(deferred);
	}

	function FBlogin(deferred) {
		FB.login(function(response) {
			if (response.authResponse) {
				console.log('Welcome!  Fetching your information.... ');
				FB.api('/me?fields=id,first_name,last_name,name,email,gender', function(response) {
					console.log('Good to see you, ' + response.name + '.');
					console.log(response.email);
					console.log(response);
					var access = FB.getAuthResponse();
					//console.log(access);
					deferred.resolve(response);
				});
			} else {
				console.log('User cancelled login or did not fully authorize.');
					deferred.reject;
			}

			});
	}

	function FBlogout() {
		console.log('in logged out ');
		FB.logout(function(response) {
			// Person is now logged out
			console.log('already logged out ');
			console.log(response);
		});
	}

}