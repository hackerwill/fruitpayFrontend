(function(){
	'use strict';
	angular
		.module('order')
		.directive('fdatepickk', FruitpayDatepickk);
		
	var shipmentPulse = "shipmentPulse";
	var shipmentCancel = "shipmentPulse";
	var shipmentDeliver = "shipmentDeliver";
	var shipmentDelivered = "shipmentDelivered";

	FruitpayDatepickk.$inject = ['$modal'];
	function FruitpayDatepickk($modal){

		var highlight = null;

		return {
			restrict: 'EA',
			scope: { highlight: '=' },
			template: '<div style="height:100%;width:100%;max-width: 600px;"></div>',
			replace: true,
			link: function($scope, $element, $attrs) {

				var now = new Date();
				var demoPicker = new Datepickk({
					container: $element[0],
					inline:true,
					range: false,
					lang : "zh_TW",
					tooltips: {
						date: new Date(),
						text: 'Tooltip'
					},
					disabledDates : [new Date(now.getFullYear(),now.getMonth(),1)]
				});	

				$scope.$watchCollection("highlight", function(newVal, oldVal) {
					var highlight = newVal;
				    demoPicker.highlight = highlight;

				    demoPicker.onSelect = function(checked){
						var state = (checked)?'selected':'unselected';
						var selectDate = new Date(this.toLocaleDateString());
						var sameDateMap = getSameDateMap(selectDate, highlight);

						if(sameDateMap && typeof sameDateMap.onSelect === "function"){
							sameDateMap.onSelect($modal, selectDate);
						}

						function getSameDateMap(selectDate, highlight){
							var sameHighlight = null;
							
							for(var key in highlight){
								if (highlight.hasOwnProperty(key)) {
									var obj = highlight[key];
									for(var i = 0 ; i < obj.dates.length; i ++){
										var date = obj.dates[i].start;
										if(date.getTime() === selectDate.getTime()){
											sameHighlight = highlight[key];
											break;
										}
									}
								}
							}

							return sameHighlight;
						}
					};
				});	
					
			}
		};
	};
	
})();








