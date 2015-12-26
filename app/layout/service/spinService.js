'use strict';
angular.module('shell')
	.factory('spinService', function(){
		
		 var opts = {
			  lines: 13 // The number of lines to draw
			, length: 32 // The length of each line
			, width: 10 // The line thickness
			, radius: 42 // The radius of the inner circle
			, scale: 1 // Scales overall size of the spinner
			, corners: 0.9 // Corner roundness (0..1)
			, color: '#000' // #rgb or #rrggbb or array of colors
			, opacity: 0.55 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 1 // Rounds per second
			, trail: 60 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '50%' // Top position relative to parent
			, left: '50%' // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
		}
		
		var service = {};
		
		service.startSpin = function(message){
			var target = document.getElementById('spinDiv');
			target.style.display = '';
			var spinner = new Spinner(opts).spin(target);
			var text = document.getElementById('spinDivText');
			text.innerHTML = message;
		}
		
		return service;
	});