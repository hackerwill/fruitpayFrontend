'use strict';
angular.module('user')
	.directive('fdatepickk', fdatepickk);

function fdatepickk(){

	 return {
        restrict: 'EA',
        template: '<div style="height:600px;width:100%;max-width:600px;"></div>',
        replace: true,
        link: function($scope, $element, $attrs){

        	var testPeriods = [  
			   {  
			      "applyDate":"2016-04-25 00:00:00",
			      "shipmentChangeType":{  
			         "optionId":34,
			         "optionName":"shipmentPulse",
			         "optionDesc":"暫停",
			         "validFlag":"1",
			         "orderNo":0
			      }
			   },
			   {  
			      "applyDate":"2016-05-02 00:00:00",
			      "shipmentChangeType":{  
			         "optionId":36,
			         "optionName":"shipmentDeliver",
			         "optionDesc":"需配送",
			         "validFlag":"1",
			         "orderNo":0
			      }
			   },
			   {  
			      "applyDate":"2016-05-09 00:00:00",
			      "shipmentChangeType":{  
			         "optionId":35,
			         "optionName":"shipmentCancel",
			         "optionDesc":"取消",
			         "validFlag":"1",
			         "orderNo":0
			      }
			   }];

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
				highlight: parseToHeightFormat(),
				disabledDates : [new Date(now.getFullYear(),now.getMonth(),1)]
			});		

			function parseToHeightFormat(shipmentPeriods){

				var highlight = [
				{
					dates: [
						{
						start: new Date(now.getFullYear(),now.getMonth(),7),
						end: new Date(now.getFullYear(),now.getMonth(),7)
						},
						{
						start: new Date(now.getFullYear(),now.getMonth(),14),
						end: new Date(now.getFullYear(),now.getMonth(),14)
						}
					],
					legend: '暫停',
					circleClassName : "redDate",
					color : "#BBB"
				},
				{
					dates: [
						{
						start: new Date(now.getFullYear(),now.getMonth(),1),
						end: new Date(now.getFullYear(),now.getMonth(),1)
						},
						{
						start: new Date(now.getFullYear(),now.getMonth(),3),
						end: new Date(now.getFullYear(),now.getMonth(),3)
						}
					],
					legend: '配送中',
					circleClassName : "greenDate"
				}];

				return highlight;

			}	
			
        }
    };
}