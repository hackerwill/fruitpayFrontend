'use strict';
angular.module('checkout')
	.controller('thanksController',
			["$scope", "orderService", "spinService", 
		function(
				$scope, orderService, spinService){
		
		if(!getURLParameter('id'))
			return;
		
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-54050037-3', 'auto');
		ga('send', 'pageview');
		
		ga('require', 'ecommerce', 'ecommerce.js');
		
		$scope.finished = false;
		spinService.startSpin("系統處理中，請稍後");
		orderService.getOrder(getURLParameter('id'))
			.then(function(result){
				console.log(result);
				spinService.stop();
				if(result){
					$scope.finished = true;
					ga('ecommerce:addTransaction', { 
						'id': '"' + result.orderId + '"', // Transaction ID. Required. 
						'affiliation': 'Fruitpay', // Affiliation or store name. 
						'revenue': result.totalPrice, // Grand Total. 
						'shipping': result.shippingCost, // Shipping. 
						'tax': '0', // Tax. 
						'currency': 'TWD' 
					}); 

					ga('ecommerce:addItem', { 
						'id': '"' + result.orderId + '"', // Transaction ID. Required. 
						'name': result.orderProgram.programName, // Product name. Required. 
						'sku': '"' + result.orderProgram.programId + '"', // SKU/code. 
						'category': 'fruitBox', // Category or variation. 
						'price': result.orderProgram.price, // Unit price. 
						'quantity': result.programNum // Quantity. 
					});

					ga('ecommerce:send'); 
				}
				
			});
		
		function getURLParameter(name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
		}

	}]);