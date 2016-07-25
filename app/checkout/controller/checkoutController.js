'use strict';
angular.module('checkout')
	.controller('checkoutController',
			["$scope", "$rootScope", "$document", "$window", "commService", '$q', "checkoutService",
			 "logService", "savedSessionService", "authenticationService","userService",
			 "facebookLoginService","$location","commConst", '$sce', "spinService", "$modal",
		function(
				$scope, $rootScope, $document, $window, commService,
				$q, checkoutService, logService, savedSessionService, 
				authenticationService, userService, facebookLoginService,
				$location, commConst, $sce, spinService, $modal){
		var ctrl = this;
		
		$window.fbq.push(['track', 'AddToCart']);
		$scope.totalTimes = 4
    $scope.CREDIT_CARD_PERIOD = 28
		$scope.checkoutUrl = $sce.trustAsResourceUrl(commConst.SERVER_DOMAIN + 'allpayCtrl/checkout');
		$scope.isLoggedIn = userService.isLoggedIn();
		$scope.myInterval = false;
		$scope.imageNum = getImageNum();
		$scope.maxUnlikeCount = 10;
		$scope.order = {};
		$scope.order.allowForeignFruits = 'Y';
		$scope.order.programNum = 1;
		$scope.order.slides = [];
		$scope.order.coupons = [];
		$scope.user = {};
		
		$scope.itemClickThenCaculateTotalPrice = itemClickThenCaculateTotalPrice;
		$scope.onCheckoutSubmit = onCheckoutSubmit;
		$scope.change = change;
		$scope.range = range;
		$scope.getImageName = getImageName;
		$scope.fruitLeft = fruitLeft;
		$scope.fruitRight = fruitRight;
		$scope.setLikeDegree = setLikeDegree;
		$scope.periodChoose = periodChoose;
		$scope.unselectAllRemoveProdcut = unselectAllRemoveProdcut;
		$scope.isEmailExisted =isEmailExisted;
		$scope.changeForeignFruit = changeForeignFruit;
		$scope.deliveryDayChange = deliveryDayChange;
		$scope.onCouponChange = onCouponChange;
		$scope.onCouponBlur = onCouponBlur;
		$scope.calulateTotalPrice = calulateTotalPrice;
		$scope.checkProgramNumThenCalulateTotalPrice = checkProgramNumThenCalulateTotalPrice;
		$scope.dialogSetUser = dialogSetUser;
		$scope.login = login;
		
		//確保需要登入
		login();
		
		$rootScope.$watch('globals.currentUser', function(newVal, oldVal){
			$scope.isLoggedIn = userService.isLoggedIn();
		}, true);
		
		$q.all([
      commService.nowTime()
        .then(function(result) {
          $scope.order.orderDate = result;
          console.log('$scope.order', $scope.order)
        }),
      //得到所有產品
			commService.getAllProducts()
				.then(getAllProductsCallback),
			//得到所有郵遞區號
			commService.getAllPostCodes()
				.then(function(result){
					//加上請選擇選項
					var pleaseSelect = {
						postId : "",
						fullName : "--請選擇--"
					};
					result.unshift(pleaseSelect);
					$scope.postalCodeList = result;
					$scope.user.postalCode = result[0];
					$scope.order.postalCode = result[0];
				}), 
			//得到所有訂購平台
			commService.getAllOrderPlatforms()
				.then(function(result){
					$scope.order.orderPlatform = result[0];
				}),
			//得到所有訂購產品
			commService.getAllOrderPrograms()
				.then(function(result){
					$scope.orderPrograms = result;
				}),
			//得到所有訂購方式
			commService.getAllPaymentModes()
				.then(function(result){
          //暫時移除貨到付款
          result = result.slice(0, 1)
					$scope.order.paymentMode = result[0];
					$scope.paymentModes = result;
				}), 
			//得到所有運送週期
			commService.getAllShipmentPeriods()
				.then(function(result){
					$scope.shipmentPeriods = result;
					//週期預設單周配送
					$scope.order.shipmentPeriod = result[0];
				}), 
			//得到收貨方式
			commService.getConstant(1)
				.then(function(result){
					$scope.order.receiveWay = result.constOptions[0];
					$scope.receiveWay = result;
				}), 
			//得到運送時間
			commService.getConstant(2)
				.then(function(result){
					$scope.order.shipmentTime = result.constOptions[0];
					$scope.shipmentTime = result;
				}),
			//得到從哪個平台來
			commService.getConstant(3)
				.then(function(result){
					$scope.order.comingFrom = result.constOptions[0];
					$scope.comingFrom = result;
				}),
			//得到收據方式
			commService.getConstant(4)
				.then(function(result){
					$scope.order.receiptWay = result.constOptions[0];
					$scope.receiptWay = result;
				}),
			//得到配送日
			commService.getConstant(6)
				.then(function(result){
					$scope.order.deliveryDay = result.constOptions[0];
					$scope.deliveryDay = result;
					setDeliveryDayDetail($scope.order.deliveryDay);
				}),
			]).then(getAllRequiredDataCallback);
				
		function getAllRequiredDataCallback(){
			if(savedSessionService.getObject("checkout.order")){
				$scope.order = savedSessionService.getObject("checkout.order");
			}
			
			//若session已有存著上次填過的紀錄
			if(savedSessionService.getObject("checkout.user")){
				$scope.user = savedSessionService.getObject("checkout.user");
			//舊的使用者資訊
			}else{
				authenticationService.getUser()
					.then(function(user){
						if(user){
							user = removeUnnecessaryFields(user);
							$scope.user = user;
							if(!$scope.user.postalCode){
								$scope.user.postalCode = $scope.postalCodeList[0];
							}
						}
					});
			}
		}
		
		function dialogSetUser(loginUser){
			//若結帳頁面上有值 以結帳頁面為主 若沒有值 以使用者註冊的為主
			for(var key in loginUser){
				if($scope.user[key] == null || $scope.user[key].length == 0)
					continue;
				loginUser[key] = $scope.user[key];
			}
			
			logService.debug(loginUser);
			$scope.user = loginUser;
		}
		
		function showLoginPage(){
			var myModal = $modal({
				scope: $scope,
				controller: 'loginDialogController',
				templateUrl: 'login/loginDialog.html', 
				backdrop: 'static',
				keyboard: false,
				show: false});
			myModal.$promise.then(myModal.show);
			
		}
		
		function checkProgramNumThenCalulateTotalPrice(){
			if(!$scope.order.programNum || $scope.order.programNum == 0){
				$scope.order.programNum = 1;
				return;
			}
			
			if(!isInt($scope.order.programNum))
				$scope.order.programNum = 1;
			calulateTotalPrice();
		}
		
		function isInt(n){
			return n % 1 === 0;
		}
		
		function onCouponBlur(){
			if(!$scope.order.orderProgram){
				logService.showDanger("您的方案尚未選擇喔");
				delete $scope.couponInput;
			}
			if($scope.couponInput){
				checkoutService.getCoupon($scope.couponInput)
						.then(function(result){
							if(!result){
								logService.showDanger("查無此優惠券");
								delete $scope.couponInput;
							}
						});
			}
		}
		
		function onCouponChange(){
			if(!$scope.order.orderProgram){
				logService.showDanger("您的方案尚未選擇喔");
				delete $scope.couponInput;
			}
				
			if($scope.couponInput){
				checkoutService.getCoupon($scope.couponInput)
					.then(function(result){
						logService.debug(result);
						if(result){
							logService.showSuccess("您使用了 " + result.couponDesc + " 優惠券");
							$scope.order.coupons = [];
							$scope.order.coupons.push(result);
							calulateTotalPrice();
							//針對第一次優惠另外跳出通知
							firstTimeNotification(result);
						}
					});
			}
		}
		
		function firstTimeNotification(coupon){
			if(coupon.couponType.optionName.indexOf("FirstTime")!= -1){
				logService.showInfo("您使用了 " + coupon.couponDesc + " 優惠券，因與第三方金流串接的作業問題，結帳時仍是顯示原價，但系統會於作業成功後再退刷優惠金額，待您下期信用卡卡帳單就可以看到喔~", 60);	
			}
		}
		
		function calulateTotalPrice(){
			calTotalPriceWithoutShipment();
			calTotalPrice();
			calCoupon();
		}
		
		function calCoupon(){
			for(var i = 0; i < $scope.order.coupons.length; i++){
				calCouponAsyc($scope.order.coupons[i])();
			}
		}
		
		function calCouponAsyc(coupon){
			return function(){
				checkoutService.couponDiscountAmount(coupon.couponId, 
					$scope.order.orderProgram.price * $scope.order.programNum)
						.then(function(result){
							if(!isNaN(result))
								coupon.discountAmount = result;
						})
			}
		}
		
		function calTotalPriceWithoutShipment(){
			return checkoutService.getTotalPriceWithoutShipment($scope.order)
				.then(function(result){
					if(result)
						$scope.totalPriceWithoutShipment = result;
				});
		}
		
		function calTotalPrice(){
			return checkoutService.getTotalPrice($scope.order)
				.then(function(result){
					if(result)
						$scope.totalPrice = result;
				});
		}
		
		function deliveryDayChange(){
			setDeliveryDayDetail($scope.order.deliveryDay);
		}
		
		function setDeliveryDayDetail(deliveryDate){
			logService.debug(deliveryDate);
			$scope.dayOfWeek = commConst.DAY_OF_WEEK[deliveryDate.optionName];
			//得到收到的日期
			checkoutService.getReceiveDay(deliveryDate.optionName)
				.then(function(result){
					$scope.firstReceiveDay = result.date;
				})
		}
		
		function isEmailExisted(){
			userService.isEmailExisted($scope.user.email)
				.then(function(result){
					logService.debug(result);
					if(result){
						$scope.checkoutForm.email.$setValidity("alreadyExisted", false);
					}else{
						$scope.checkoutForm.email.$setValidity("alreadyExisted", true);
					}
				});
		}
		
		function unselectAllRemoveProdcut(){
			if($scope.isAllChosen){
				for (var i = 0; i < $scope.order.orderPreferences.length; i++) {
					$scope.order.orderPreferences[i].likeDegree = 3; 
				}
			};
		}
		
		function periodChoose(periodId){
			for (var i = 0; i < $scope.shipmentPeriods.length; i++) {
				if(periodId == $scope.shipmentPeriods[i].periodId) {
          $scope.order.shipmentPeriod = $scope.shipmentPeriods[i];
          $scope.totalTimes = $scope.CREDIT_CARD_PERIOD / $scope.order.shipmentPeriod.duration
        }
			}
		}
		
		function setLikeDegree(orderPreference){
			if(orderPreference.likeDegree == 3){
				if(isReachMaxUnlikeMount()){
					logService.showInfo("已達" + $scope.maxUnlikeCount + "種水果上限囉!");
					return;
				}
				$scope.isAllChosen = false;
				orderPreference.likeDegree = 0;
			}else{
				orderPreference.likeDegree = 3;
			}
			for (var i = 0; i < $scope.order.orderPreferences.length; i++) {
				var thisPreference = $scope.order.orderPreferences[i];
				if(thisPreference.product.productId == orderPreference.product.productId)
					thisPreference.likeDegree = orderPreference.likeDegree;
			}
		}
		
		function isReachMaxUnlikeMount(){
			var totalUnlikeCount = 0;
			for (var i = 0; i < $scope.order.orderPreferences.length; i++) {
				if($scope.order.orderPreferences[i].likeDegree == 0)
					totalUnlikeCount ++;
			}
			if(totalUnlikeCount >= $scope.maxUnlikeCount){
				return true;
			}else{
				return false;
			}
		}
		
		function fruitLeft(){
			$scope.carouselIndex--;
		}
		
		function fruitRight(){
			$scope.carouselIndex++;
		}
		
		function getImageNum(){
			if(commService.getWindowSize().width > 991)
				return 18;
			else
				return 12;
		}
		
		function getImageName(n){
			return "image" + n;
		}
		
		function range(min, max, index, maxLimit){
			var totalAmount = maxLimit - index * max;
			var imageTotal = totalAmount > max ? max : totalAmount;
		    var input = [];
		    for (var i = min; i <= imageTotal; i += 1) {
		      input.push(i);
		    }
		    return input;
		};
		
		function login(){
			if(!userService.isLoggedIn()){
				showLoginPage();
			}
		}
		
		function onCheckoutSubmit(){
		
			$scope.checkoutForm.$setValidity("checked", true);
			//if form is not valid set $scope.addContact.submitted to true     
			$scope.checkoutForm.submitted=true; 
			
			if ($scope.checkoutForm.$valid) {   
			
			    if(!$scope.user.postalCode.postId || !$scope.order.postalCode.postId){
					logService.showDanger("您的郵遞區號還沒有選擇喔");
					return;
				}
				
				if(!$scope.order.orderProgram){
					logService.debug("not select order Program yet.");
					$scope.checkoutForm.$setValidity("orderProgram", false);
					return;
				}
				if(!$scope.confirmContract){
					logService.debug($scope.checkoutForm.confirmContract);
					$scope.checkoutForm.$setValidity("checked", false);
					logService.showDanger("請同意我們的使用條款");
					return;
				}
				
				savedSessionService.setObject("checkout.order", $scope.order);
				savedSessionService.setObject("checkout.user", $scope.user);
				
				if(!userService.isLoggedIn()){
					showLoginPage();
					return;
				}
				
				spinService.startSpin("結帳中，請稍等");
				
				checkoutService.checkout($scope.user, $scope.order)
					.then(function(result){
						logService.debug(result);
						//貨到付款
						if(result && result.paymentMode.paymentModeId == 2){
							logService.showSuccess("訂單完成結帳");
							$location.path(commConst.urlState.THANKS.pathUrl)
								.search({id: result.orderId});
						//刷卡成功
						}else if(result){
							document.getElementById("orderId").value = result.orderId;
							document.getElementById("price").value = result.totalPrice;
							document.getElementById("programId").value = result.orderProgram.programId;
							document.getElementById("duration").value = result.shipmentPeriod.duration;
							document.getElementById("allpayCheckoutForm").submit();
						}else{
							logService.showDanger("無預期錯誤發生");
						}
						savedSessionService.removeObject("checkout.order");
						savedSessionService.removeObject("checkout.user");
						spinService.stop();
					});
			
			}
		}
		
		function changeForeignFruit(){
			if($scope.order.allowForeignFruits == 'Y'){
				$scope.order.allowForeignFruits = 'N';
			}else{
				$scope.order.allowForeignFruits = 'Y';
			}
			logService.debug($scope.order.allowForeignFruits);
		}
		
		function change(){
			if($scope.confirmed){
				console.log($scope.user.postalCode.postId);
				if($scope.checkoutForm.$valid && $scope.user.postalCode.postId){
					$scope.order.receiverFirstName = $scope.user.firstName;
					$scope.order.receiverLastName = $scope.user.lastName;
					$scope.order.receiverCellphone = $scope.user.cellphone;
					$scope.order.receiverHousePhone = $scope.user.housePhone;
					$scope.order.receiverAddress = $scope.user.address;
					$scope.order.receiverGender = $scope.user.gender;
					$scope.order.postalCode = $scope.user.postalCode;
				}else{
					logService.showDanger("您的訂購人資訊還沒寫完喔");
					$scope.confirmed = false;
				}
			}
		}
		
		function itemClickThenCaculateTotalPrice(programId, e){
			//目前暫時寫法,避免重覆呼叫事件
			var id = e.target.id;
			if(id == 'programNumInput')
				return;
			for (var i = 0; i < $scope.orderPrograms.length; i++) {
				if($scope.orderPrograms[i].programId==programId){
					$scope.checkoutForm.$setValidity("orderProgram", true);
					$scope.order.orderProgram = $scope.orderPrograms[i];
				}
			}
			calulateTotalPrice();
		}
		
		function removeUnnecessaryFields(user){
			user.customerOrders = null;
			return user;
		}
		
		function getAllProductsCallback(result){
			var resizeAppend = '?resize=200%2C150';
			
			//check null elements and set resize parameter
			for (var i = 0; i< result.length; i++) {
				if(result[i].imageLink == null || result[i].imageLink.length == 0 || result[i].productName.length == 0)
					delete result[i];
			}
			
			var orderPreferences = [];
			for (var i = 0; i< result.length; i++) {
				if(result[i]){
					result[i].imageLink = result[i].imageLink + resizeAppend;
					
					var obj = {};
					obj.likeDegree = 3; //一般的訂為3
					obj.product = result[i];
					orderPreferences.push(obj);
				}
			}
			
			/**
			 * 
			 * 計算方法範例
			 * 
			 * slides[0]['image1'] = result[0]; 0/3, 0%3 + 1 
			 * slides[0]['image2'] = result[1]; 1/3, 1%3 + 1
			 * slides[0]['image3'] = result[2]; 2/3, 2%3 + 1
			 * slides[1]['image1'] = result[3]; 3/3, 3%3 + 1
			 * slides[1]['image2'] = result[4]; 4/3, 4%3 + 1
			 * slides[1]['image3'] = result[5]; 5/3, 5%3 + 1
			 * 
			 * */
			for (var i = 0; i< orderPreferences.length; i++) {
				var index = Math.floor(i/$scope.imageNum);
				var num = i%$scope.imageNum + 1;
				if(!$scope.order.slides[index])
					$scope.order.slides[index] = {};
				$scope.order.slides[index]['image' + num] = orderPreferences[i];
			}
			$scope.order.totalImageAmount = orderPreferences.length;
			$scope.order.orderPreferences = orderPreferences;
		}
		
	}]);