
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

function scrollElement($document, $scope, $window, commService){
			
	if(commService.getWindowSize().width < 1000)
		return;
	
	var onePageElements = document.getElementsByClassName("onepageElement");
	var returnObj = {};
	
	returnObj.scrollToNext = scrollToNext;
	returnObj.scrollToPrevious = scrollToPrevious;
	triggerScrollElement();
	
	return returnObj;
	
	function triggerScrollElement(){
		//bind scroll up and down event
		angular.element($window).bind('DOMMouseScroll mousewheel onmousewheel', 
			function(event) {
				event.returnValue = false;
				// for Chrome and Firefox
				if(event.preventDefault) {
					event.preventDefault();                        
				}
				// cross-browser wheel delta
				var event = window.event || event; // old IE support
				var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
		
				if(delta > 0) {
					returnObj.scrollToPrevious();   
				}else{
					returnObj.scrollToNext();
				}	
		});
	}
	
	function scrollToNext(){
		moveToAnotherOne(1);
	}
	
	function scrollToPrevious(){
		moveToAnotherOne(-1);
	}
	
	function currentActiveIndex(){
		for(var i = 0; i < onePageElements.length ; i++){
			var currentIndex = null;
			var onePageElement = onePageElements[i];
			if(onePageElement.className.indexOf("active") != -1){
				currentIndex = i;
				break;
			}	
		}
		return i;
	}
	
	function moveToAnotherOne(i){
		var activeIndex = currentActiveIndex();
		var currentElement = onePageElements[activeIndex];
		var nextElement = onePageElements[activeIndex+i];
		if(nextElement){
			activeIndex = activeIndex + i;
			$document.scrollToElementAnimated(onePageElements[activeIndex]);
			//set timeout to prevent the scroll event trigger many times
			setTimeout(function(){
				for(var i = 0; i < onePageElements.length ; i++){
					onePageElements[i].className = 
					replaceAll("active|\sactive", "", onePageElements[i].className);
				}
				nextElement.className = nextElement.className.trim();
				if(nextElement.className.indexOf("active") == -1)
					nextElement.className = nextElement.className + " active";
					
			}, 1000);
		}
	}
	
	function replaceAll(find, replace, str) {
		return str.replace(new RegExp(find, 'g'), replace);
	}

}