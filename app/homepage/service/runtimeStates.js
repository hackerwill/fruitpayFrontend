'use strict';
angular.module('app')
	.provider('runtimeStates', runtimeStates);

runtimeStates.$inject = ['$stateProvider'];
function runtimeStates($stateProvider){
	
  this.$get = function() { // for example
    return { 
      addState: function(name, state) { 
        $stateProvider.state(name, state);
      }
    }
  }
}