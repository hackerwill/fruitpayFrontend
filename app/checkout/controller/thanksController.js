'use strict';
angular.module('checkout')
	.controller('thanksController',
			["$scope", "orderService", "spinService", "$window",
		function(
				$scope, orderService, spinService, $window){
		
		if(!getURLParameter('id'))
			return;
		
		$window.ga('require', 'ecommerce', 'ecommerce.js');
		
		$scope.finished = false;
		spinService.startSpin("系統處理中，請稍後");
		orderService.getOrder(getURLParameter('id'))
			.then(function(result){
				console.log(result);
				spinService.stop();
				if(result){
					$scope.finished = true;
					$window.ga('ecommerce:addTransaction', { 
						'id': '"' + result.orderId + '"', // Transaction ID. Required. 
						'affiliation': 'Fruitpay', // Affiliation or store name. 
						'revenue': result.totalPrice, // Grand Total. 
						'shipping': result.shippingCost, // Shipping. 
						'tax': '0', // Tax. 
						'currency': 'TWD' 
					}); 

					$window.ga('ecommerce:addItem', { 
						'id': '"' + result.orderId + '"', // Transaction ID. Required. 
						'name': result.orderProgram.programName, // Product name. Required. 
						'sku': '"' + result.orderProgram.programId + '"', // SKU/code. 
						'category': 'fruitBox', // Category or variation. 
						'price': result.orderProgram.price, // Unit price. 
						'quantity': result.programNum // Quantity. 
					});

					$window.ga('ecommerce:send'); 
					
					$window.fbq('track', 'Purchase', {
						value: '"' + result.orderProgram.price + '"', 
						currency:'TWD'}
					);
				}
				
			});
		
		function getURLParameter(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
		}

	}]);