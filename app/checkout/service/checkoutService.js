'use strict';
 
	angular
        .module('app')
		.factory('checkoutService', checkoutService);
	
	checkoutService.$inject = ['$http', 'logService', 'commConst'];
	function checkoutService($http, logService, commConst){
		var service = {};
		
		service.checkout = checkout;
		service.checkoutTest = checkoutTest;
		
		return service;
		
		function checkout(user, order){
			var sendObj = {};
			var userSend= angular.copy(user);
			var orderSend= angular.copy(order);
			sendObj.customer = userSend;
			sendObj.customerOrder = orderSend;
			sendObj = removeUnnecessarySendObjField(sendObj);
			console.log(sendObj);
			console.log(JSON.stringify(sendObj));
			return $http.post(commConst.SERVER_DOMAIN + 'checkoutCtrl/checkout', sendObj)
				.then(logService.successCallback, logService.errorCallback);
		}
		
		function removeUnnecessarySendObjField(sendObj){
			sendObj.customer.village.id = null;
			sendObj.customer.village.name = null;
			sendObj.customer.village.county = null;
			sendObj.customer.village.towership = null;
			sendObj.customerOrder.slides = null;
			sendObj.customerOrder.totalImageAmount = null;
			sendObj.customerOrder.village.id = null;
			sendObj.customerOrder.village.name = null;
			sendObj.customerOrder.village.county = null;
			sendObj.customerOrder.village.towership = null;
			return sendObj;
		}
		
		function checkoutTest(){
			var sendObj = {};
			
			var user = {
					  "lastName": "徐",
					  "firstName": "瑋志",
					  "gender": "M",
					  "email": "tiger_6_40@yahoo.com.tw",
					  "password": "123456",
					  "confirmPassword": "123456",
					  "cellphone": "0933370691",
					  "address": "同安村西畔巷66弄40號",
					  "village": {
					    "countyCode":10007,
					    "countyName":"彰化縣",
					    "towershipCode": "1000716",
					    "towershipName":"永靖鄉",
					    "villageCode":"1000716-019",
					    "villageName":"同安村"
					  },
					  "birthday": "1990-06-04"
					};
			
			var order = {
					  "orderProgram": {
						    "programId": 1,
						    "programName": "小農箱-家庭",
						    "programDesc": "含進口水果",
						    "price": 699
						  },
						  "receiverFirstName": "瑋志",
						  "receiverLastName": "徐",
						  "receiverPhone": "0933370691",
						  "receiverAddress": "九鄰西畔巷66弄40號",
						  "receiverGender": "M",
						  "orderPlatform":{
						    "platformId": 1
						  },
						  "village": {
						    "countyCode": 10007,
						    "countyName": "彰化縣",
						    "towershipCode": "1000716",
						    "towershipName": "永靖鄉",
						    "villageCode": "1000716-019",
						    "villageName": "同安村"
						  },
						  "paymentMode": {
						    "paymentModeId" : 1
						  },
						  "orderDate": "2015-11-08",
						  "shipmentDay": {
						    "shipmentDaysId": 2
						  },
						  "orderStatus" : {
						    "orderStatusId": 1
						  },
						  "shipmentPeriod" : {
							  "duration": 7,
							  "periodDesc": "每周配送一次",
							  "periodId": 1,
							  "periodName": "單周配送"
						  },
						  "orderPreferences" : 
							  [{"likeDegree":5,"id":{"productId":41}},{"likeDegree":5,"id":{"productId":42}},{"likeDegree":5,"id":{"productId":43}},{"likeDegree":5,"id":{"productId":44}},{"likeDegree":5,"id":{"productId":45}},{"likeDegree":5,"id":{"productId":46}},{"likeDegree":5,"id":{"productId":47}},{"likeDegree":5,"id":{"productId":48}},{"likeDegree":5,"id":{"productId":49}},{"likeDegree":5,"id":{"productId":50}},{"likeDegree":5,"id":{"productId":51}},{"likeDegree":5,"id":{"productId":52}},{"likeDegree":5,"id":{"productId":53}},{"likeDegree":5,"id":{"productId":54}},{"likeDegree":5,"id":{"productId":55}},{"likeDegree":5,"id":{"productId":56}},{"likeDegree":5,"id":{"productId":57}},{"likeDegree":5,"id":{"productId":58}},{"likeDegree":5,"id":{"productId":59}},{"likeDegree":5,"id":{"productId":60}},{"likeDegree":5,"id":{"productId":61}},{"likeDegree":5,"id":{"productId":62}},{"likeDegree":5,"id":{"productId":63}},{"likeDegree":5,"id":{"productId":64}},{"likeDegree":5,"id":{"productId":65}},{"likeDegree":5,"id":{"productId":66}},{"likeDegree":5,"id":{"productId":67}},{"likeDegree":5,"id":{"productId":68}},{"likeDegree":5,"id":{"productId":69}},{"likeDegree":5,"id":{"productId":70}},{"likeDegree":5,"id":{"productId":71}},{"likeDegree":5,"id":{"productId":72}},{"likeDegree":5,"id":{"productId":73}},{"likeDegree":5,"id":{"productId":74}},{"likeDegree":5,"id":{"productId":75}},{"likeDegree":5,"id":{"productId":76}},{"likeDegree":5,"id":{"productId":77}}]
						};
				
			
			sendObj.customer = user;
			sendObj.customerOrder = order;
			console.log(sendObj);
			return $http.post(commConst.SERVER_DOMAIN + 'checkoutCtrl/checkout', sendObj)
			.then(logService.successCallback, logService.errorCallback);
		}
	}