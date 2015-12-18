'use strict';
angular.module('checkout')
	.controller('checkoutController',
			["$scope", "$document", "$window", "commService", '$q', "checkoutService",
			 "logService", "savedSessionService", "authenticationService","userService",
			 "facebookLoginService","$location",
		function(
				$scope, $document, $window, commService,
				$q, checkoutService, logService, savedSessionService, 
				authenticationService, userService, facebookLoginService,
				$location){
				
		var ctrl = this;
		$scope.isLoggedIn = userService.isLoggedIn();
		$scope.myInterval = false;
		$scope.imageNum = getImageNum();
		$scope.maxUnlikeCount = 10;
		$scope.order = {};
		$scope.order.allowForeignFruits = 'Y';
		$scope.user = {};
		$scope.countyList = {};
		$scope.towershipList = {};
		$scope.villageList = {};
		$scope.receiverCountyList = {};
		$scope.receiverTowershipList = {};
		$scope.receiverVillageList = {};
		$scope.order.slides = [];
		
		$scope.itemClick = itemClick;
		$scope.scrollElement = scrollElement;
		$scope.scrollElement($document, $scope, $window, commService);
		$scope.onCheckoutSubmit = onCheckoutSubmit;
		$scope.change = change;
		$scope.countyChange = countyChange;
		$scope.towershipChange = towershipChange;
		$scope.receiverCountyChange = receiverCountyChange;
		$scope.receiverTowershipChange = receiverTowershipChange;
		$scope.range = range;
		$scope.getImageName = getImageName;
		$scope.fruitLeft = fruitLeft;
		$scope.fruitRight = fruitRight;
		$scope.setLikeDegree = setLikeDegree;
		$scope.periodChoose = periodChoose;
		$scope.unselectAllRemoveProdcut = unselectAllRemoveProdcut;
		$scope.isEmailExisted =isEmailExisted;
		$scope.changeForeignFruit = changeForeignFruit;
		$scope.checkLoginState = checkLoginState;
		
		(function(){
			
			var oneChain = commService.getAllProducts()
				.then(function(result){
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
							obj.likeDegree = 5; 
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
				});
			
			var twoChain = commService
				.getAllCounties()
				.then(setCountiesData)
				.then(setTowershipsData)
				.then(setVillagesData);
			
			var threeChain = commService
				.getAllCounties()
				.then(setReceiverCountiesData)
				.then(setReceiverTowershipsData)
				.then(setReceiverVillagesData);
			
			var fourChain = commService
				.getAllOrderPlatforms()
				.then(function(result){
					$scope.order.orderPlatform = result[0];
				});
			
			var fiveChain = commService
				.getAllOrderPrograms()
				.then(function(result){
					$scope.orderPrograms = result;
				});
			
			var sixChain = commService
				.getAllOrderStatuses()
				.then(function(result){
					console.log(result);
				});
			
			var sevenChain = commService
				.getAllPaymentModes()
				.then(function(result){
					$scope.paymentModes = result;
				});
			
			var eightChain = commService
				.getAllShipmentPeriods()
				.then(function(result){
					$scope.shipmentPeriods = result;
					//週期預設單周配送
					$scope.order.shipmentPeriod = result[0];
				});
			
			var nineChain = commService
				.getConstant(1)
				.then(function(result){
					$scope.order.receiveWay = result.constOptions[0];
					$scope.receiveWay = result;
				});
			
			var tenChain = commService
				.getConstant(2)
				.then(function(result){
					$scope.order.shipmentTime = result.constOptions[0];
					$scope.shipmentTime = result;
				});
			
			var elevenChain = commService
				.getConstant(3)
				.then(function(result){
					$scope.order.comingFrom = result.constOptions[0];
					$scope.comingFrom = result;
				});
			
			var twelveChain = commService
				.getConstant(4)
				.then(function(result){
					$scope.order.receiptWay = result.constOptions[0];
					$scope.receiptWay = result;
				});
			
			$q.all([oneChain, twoChain, threeChain, fourChain, fiveChain,
			        sixChain, sevenChain, eightChain, nineChain, tenChain,
			        elevenChain, twelveChain])
			        .then(function(){
			        	if(savedSessionService.getObject("checkout.order")){
			    			$scope.order = savedSessionService.getObject("checkout.order");
			    			setVillageLoopByVillage($scope.order.village,
			    					"receiverCounty", "receiverTowershipList", "receiverTowership",
			    					"receiverVillageList", "receiverVillage");
			        	}
			    		
			        	//若session已有存著上次填過的紀錄
			    		if(savedSessionService.getObject("checkout.user")){
			    			$scope.user = savedSessionService.getObject("checkout.user");
			    			setVillageLoopByVillage(
			    					$scope.user.village,
			    					"county", "towershipList", "towership",
			    					"villageList", "village");
			    		//舊的使用者資訊
			    		}else{
			    			authenticationService.getUser()
			    			.then(function(user){
			    				if(user){
			    					user = removeUnnecessaryFields(user);
			    					$scope.user = user;
			    					setVillageLoopByVillage(
			    							user.village,
					    					"county", "towershipList", "towership",
					    					"villageList", "village");
			    				}
			    			});
			    		}
			        });
			
		})();
		
		function isEmailExisted(){
			userService.isEmailExisted($scope.user.email)
				.then(function(result){
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
					$scope.order.orderPreferences[i].likeDegree = 5; 
				}
			};
		}
		
		function periodChoose(periodId){
			for (var i = 0; i < $scope.shipmentPeriods.length; i++) {
				if(periodId == $scope.shipmentPeriods[i].periodId)
					$scope.order.shipmentPeriod = $scope.shipmentPeriods[i];
			}
		}
		
		function setLikeDegree(orderPreference){
			if(orderPreference.likeDegree == 5){
				if(isReachMaxUnlikeMount()){
					logService.showInfo("已到達上限囉!");
					return;
				}
				$scope.isAllChosen = false;
				orderPreference.likeDegree = 0;
			}else{
				orderPreference.likeDegree = 5;
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
		
		function setReceiverCountiesData(counties, county){
			$scope.receiverCountyList = counties;
			if(county){
				return county;
			}else{
				return setDefaultCounty(counties);
			}			
		}
		
		function setCountiesData(counties){
			$scope.countyList = counties;
			return setDefaultCounty(counties);
		}
		
		function setDefaultCounty(counties){
			for(var i = 0; i < counties.length; i ++){
				if(counties[i].id == 63)
					return counties[i];
			}
		}
		
		function setTowershipsData(county){
			$scope.county = county;
			return setTowership(county ,function(towerships){
				$scope.towershipList = towerships;
				$scope.towership = towerships[0];
			});
		}
		
		function setReceiverTowershipsData(county){
			$scope.receiverCounty = county;
			return setTowership(county ,function(towerships){
				$scope.receiverTowershipList = towerships;
				$scope.receiverTowership = towerships[0];
			});
		}
		
		function setTowership(county, callback){
			var anotherDeferred = $q.defer();
			commService
				.getTowerships(county.id)
				.then(function(towerships){
					callback(towerships);
					anotherDeferred.resolve(towerships[0]);
				});
			return anotherDeferred.promise;
		}
		
		function setVillagesData(towership){
			$scope.towership = towership;
			setVillage(towership, function(villages){
				$scope.villageList = villages;
				$scope.village = villages[0];
			});
		}
		
		function setReceiverVillagesData(towership){
			$scope.receiverTowership = towership;
			setVillage(towership, function(villages){
				$scope.receiverVillageList = villages;
				$scope.receiverVillage = villages[0];
			});
		}
		
		function setVillage(towership, callback){
			commService
				.getVillages(towership.id)
				.then(callback);
		}
		
		function countyChange(){
			$q.when($scope.county)
				.then(setTowershipsData)
				.then(setVillagesData);
		}
		
		function receiverCountyChange(){
			$q.when($scope.receiverCounty)
				.then(setReceiverTowershipsData)
				.then(setReceiverVillagesData);
		}

		function towershipChange(){
			$q.when($scope.towership)
				.then(setVillagesData);
		}
		
		function receiverTowershipChange(){
			$q.when($scope.receiverTowership)
				.then(setReceiverVillagesData);
		}
		
		function onCheckoutSubmit(){
			$scope.checkoutForm.$setValidity("checked", true);
			if ($scope.checkoutForm.$valid) {   
				if(!$scope.confirmContract){
					console.log($scope.checkoutForm.confirmContract);
					$scope.checkoutForm.$setValidity("checked", false);
					logService.showDanger("請同意我們的使用條款");
					return;
				}
				
				setSubmitData();
				savedSessionService.setObject("checkout.order", $scope.order);
				savedSessionService.setObject("checkout.user", $scope.user);
				checkoutService.checkout($scope.user, $scope.order)
					.then(function(result){
						console.log(result);
						//貨到付款
						if(result && result.paymentMode.paymentModeId == 2){
							logService.showSuccess("訂單完成結帳");
							$location.path('/index/checkoutCreditCardSuccess');
						//刷卡成功
						}else if(result){
							 
							savedSessionService.removeObject("checkout.order");
							savedSessionService.removeObject("checkout.user");
							document.getElementById("orderId").value = result.orderId;
							document.getElementById("price").value = result.orderProgram.price;
							document.getElementById("programId").value = result.orderProgram.programId;
							document.getElementById("duration").value = result.shipmentPeriod.duration;
							document.getElementById("allpayCheckoutForm").submit();
						}else{
							logService.showDanger("無預期錯誤發生");
						}
					});
			
			}else {
				//if form is not valid set $scope.addContact.submitted to true     
				$scope.checkoutForm.submitted=true;  			
			};
		}
		
		function setSubmitData(){
			setSubmitVillages();
		}
		
		function setSubmitVillages(){
			$scope.user.village = $scope.village;
			$scope.user.village.county = $scope.county;
			$scope.user.village.towership = $scope.towership;
			$scope.user.village.villageCode = $scope.village.id;
			
			$scope.order.village = $scope.receiverVillage;
			$scope.order.village.county = $scope.receiverCounty;
			$scope.order.village.towership = $scope.receiverTowership;
			$scope.order.village.villageCode = $scope.receiverVillage.id;
		}
		
		function checkLoginState(){
	    	facebookLoginService.login()
	    		.then(function(response){
					if(response){
						var user = {};
						user.firstName = response.first_name ? response.first_name : response.name;
						user.email = response.email;
						user.fbId = response.id;
						user.lastName = response.last_name;
						if(response.gender == 'male'){
							user.gender = 'M';
						}else if (response.gender == 'female'){
							user.gender = 'F';
						}
						authenticationService.fbLogin(user)
							.then(function(result){
								console.log(result);
								if(result){
									$location.path('/index/checkout');
						            location.reload();
								}
							});
						
					} else {
		                flashService.error(result);
		                user.dataLoading = false;
		            }
					
				});
        }
		
		function changeForeignFruit(){
			if($scope.order.allowForeignFruits == 'Y'){
				$scope.order.allowForeignFruits = 'N';
			}else{
				$scope.order.allowForeignFruits = 'Y';
			}
			console.log($scope.order.allowForeignFruits);
		}
		
		function change(){
			if($scope.confirmed){
				if($scope.checkoutForm.$valid){
					$scope.order.receiverFirstName = $scope.user.firstName;
					$scope.order.receiverLastName = $scope.user.lastName;
					$scope.order.receiverCellphone = $scope.user.cellphone;
					$scope.order.receiverHousePhone = $scope.user.housePhone;
					$scope.order.receiverAddress = $scope.user.address;
					$scope.order.receiverGender = $scope.user.gender;
					$scope.order.receiverGender = $scope.user.gender;
					setFromUserToReceiverVillage();
				}else{
					$scope.checkoutForm.submitted=true;  
					$scope.confirmed = false;
				}
			}
		}
		
		function setFromUserToReceiverVillage(){
			setVillageLoop($scope.county, $scope.towership, $scope.village,
					"receiverCounty", "receiverTowershipList", "receiverTowership",
					"receiverVillageList", "receiverVillage");
		}
		
		function setVillageLoopByVillage(village, 
				$scopeToCountyName, $scopeToTowershipListName, $scopeToTowershipName,
				$scopeToVillageListName, $scopeToVillageName){
			setVillageLoop(village.county, village.towership, village,
					$scopeToCountyName, $scopeToTowershipListName, $scopeToTowershipName,
					$scopeToVillageListName, $scopeToVillageName)
		}
		
		function setVillageLoop($scopeCounty, $scopeTowership, $scopeVillage,
				$scopeToCountyName, $scopeToTowershipListName, $scopeToTowershipName,
				$scopeToVillageListName, $scopeToVillageName){
			$scope[$scopeToCountyName] = $scopeCounty;
			commService
				.getTowerships($scopeCounty.id)
				.then(function(towerships){
					$scope[$scopeToTowershipListName] = towerships;
					$scope[$scopeToTowershipName] = $scopeTowership;
					return $scopeTowership;
				})
				.then(function(towership){
					commService
						.getVillages(towership.id)
						.then(function(villages){
							$scope[$scopeToVillageListName] = villages;
							$scope[$scopeToVillageName] = $scopeVillage;
						});
				});
		}
		
		function itemClick(programId){
			for (var i = 0; i < $scope.orderPrograms.length; i++) {
				if($scope.orderPrograms[i].programId==programId)
					$scope.order.orderProgram = $scope.orderPrograms[i];
			}
		}
		
		function removeUnnecessaryFields(user){
			user.customerOrders = null;
			return user;
		}
		
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
		
	}]);