app.controller("VendorHomeController", function ($scope, $http, $mdDialog, $cookieStore, $filter, $rootScope, commonService, singleObjService, UI_VENDOR) {
	$scope.user = $cookieStore.get("user");
	$scope.store = "";
	
	$rootScope.pageTitle = "ORDERS";
	
	$scope.UI_VENDOR = UI_VENDOR;
	
	$scope.query = "";
	$scope.query1 = "";
	
	$scope.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	$scope.days = [31,28,31,30,31,30,31,31,30,31,30,31];
	
	var df = new Date();
    var y = df.getFullYear();
    var m = df.getMonth()+1;
    var d = df.getDate();
	
	$scope.presentDay = d;
	$scope.presentMonth = m;
	$scope.presentYear = y;

	$scope.day = $scope.presentDay;
	$scope.month = $scope.presentMonth;
	$scope.year = $scope.presentYear;
	
	$scope.fromDay = $scope.day;
	
	$scope.fromMonth = $scope.month;
	
	$scope.fromYear = $scope.year;
	
	$scope.toDay = $scope.day;
	
	$scope.toMonth = $scope.month;
	
	$scope.toYear = $scope.year;
	
	$scope.filterBy = "day";
	
	$scope.filterType = function(){
		if($scope.filterBy == "day"){
			$scope.clickDay();
		}
		else if($scope.filterBy == "month"){
			$scope.clickMonth();	
		}
		else if($scope.filterBy == "year"){
			$scope.clickYear();
		}
		else if($scope.filterBy == "today"){
			$scope.clickToday();
		}
	}
	
	$scope.clickDay = function(){
		$scope.day = 1;
		$scope.fromDay = $scope.day;
		$scope.toDay = $scope.day;
		$scope.filterWithDate();
	}
	
	$scope.clickToday = function(){
		$scope.day = $scope.presentDay;
		$scope.month = $scope.presentMonth;
		$scope.year = $scope.presentYear;
		
		$scope.fromDay = $scope.day;
		
		$scope.fromMonth = $scope.month;
		
		$scope.fromYear = $scope.year;
		
		$scope.toDay = $scope.day;
		
		$scope.toMonth = $scope.month;
		
		$scope.toYear = $scope.year;
		$scope.filterWithDate();
	}
	
	$scope.clickMonth = function(){
		$scope.fromDay = 1;
		$scope.toDay = $scope.days[$scope.month-1];
		$scope.fromMonth = $scope.month;
		$scope.toMonth = $scope.month;
		$scope.filterWithDate();
	}
	
	$scope.clickYear = function(){
		$scope.fromMonth = 1;
		$scope.toMonth = $scope.months.length-1;
		$scope.fromDay = 1;
		$scope.toDay = $scope.days[$scope.month-1];
		$scope.filterWithDate();
	}
	
	$scope.previous = function(){
		if(($scope.filterBy == "day") || ($scope.filterBy == "today")){
			$scope.filterByDay("prev");
		}
		else if($scope.filterBy == "month"){
			$scope.filterByMonth("prev");
		}
		else if($scope.filterBy == "year"){
			$scope.filterByYear("prev");
		}
		$scope.filterWithDate();
	}
	
	$scope.next = function(){
		if(($scope.filterBy == "day") || ($scope.filterBy == "today")){
			$scope.filterByDay("next");
		}
		else if($scope.filterBy == "month"){
			$scope.filterByMonth("next");
		}
		else if($scope.filterBy == "year"){
			$scope.filterByYear("next");
		}
		$scope.filterWithDate();
	}
	
	$scope.filterByDay = function(dir){
		if(dir == "prev"){
			$scope.day = $scope.day - 1; 
			if($scope.day == 0 ){
				$scope.month = $scope.month - 1;
				if($scope.month == 0){
					$scope.year = $scope.year - 1;
					$scope.month = $scope.months.length;
				}
				$scope.day = $scope.days[$scope.month-1];
			}
		}
		else if(dir == "next"){
			$scope.day = $scope.day + 1; 
			if($scope.day > $scope.days[$scope.month-1]){
				$scope.month = $scope.month + 1;
				if($scope.month == $scope.months.length+1){
					$scope.year = $scope.year + 1;
					$scope.month = 1;
				}
				$scope.day = 1;
			}
		}
		$scope.fromDay = $scope.day;
		$scope.toDay = $scope.day;
		$scope.fromMonth = $scope.month;
		$scope.toMonth = $scope.month;
		$scope.toYear = $scope.year;
		$scope.fromYear = $scope.year;
	}
	
	$scope.filterByMonth = function(dir){
		if(dir == "prev"){
			$scope.month = $scope.month - 1;
			if($scope.month == 0){
				$scope.month = $scope.months.length;
				$scope.year = $scope.year - 1;
			}
		}
		else if(dir == "next"){
			$scope.month = $scope.month + 1;
			if($scope.month > $scope.months.length){
				$scope.month = 1;
				$scope.year = $scope.year + 1;
			}
		}

		$scope.fromMonth = $scope.month;
		$scope.toMonth = $scope.month;
		
		$scope.fromDay = "1";
		$scope.toDay = $scope.days[$scope.month-1];
		
		$scope.toYear = $scope.year;
		$scope.fromYear = $scope.year;
	}
	
	$scope.filterByYear = function(dir){
		if(dir == "prev"){
			$scope.year = $scope.year - 1;
		}
		else if(dir == "next"){
			$scope.year = $scope.year + 1; 
		}

		$scope.fromYear = $scope.year;
		$scope.toYear = $scope.year;
		
		$scope.fromMonth = "1";
		$scope.toMonth = $scope.months.length;
	};
	
	$scope.dateFrom= new Date();
	$scope.dateTo= new Date();
	
	$scope.$watch('$viewContentLoaded', function(){
		$scope.getStores();
		$scope.filterWithDate();
	});
	
	$scope.getCredits = function(dateFrom, dateTo){
		$rootScope.loading = true;
		if(($scope.store == "") || ($scope.store == null)){
			$scope.storeId = "0";
		}
		else{
			$scope.storeId = $scope.store.storeId;
		}
		$http.get($rootScope.baseUrl+'action=getStoreOrders&date_from='+dateFrom+'&date_to='+dateTo+'&store_id='+$scope.storeId+'&user_id=0&vendor_id='+$scope.user.userId).success(function(data) {
			$scope.storeOrders = data.result;
		    $rootScope.loading = false;
		});
		
		$http.get($rootScope.baseUrl+'action=getStoreOrderInfoVdr&date_from='+dateFrom+'&date_to='+dateTo+'&store_id='+$scope.storeId+'&user_id=0&vendor_id='+$scope.user.userId).success(function(data) {
			$scope.storeOrderInfos = data.result;
		    $rootScope.loading = false;
		});
	}
	
	$scope.getStores = function(){
		$http.get($rootScope.baseUrl+'action=getStores&user_id='+$scope.user.userId).success(function(data) {
			$scope.stores = data.result;
		});
	}
	
	$scope.openOrder = function(ev,order) {
		singleObjService.setObj(order);        	
        $mdDialog.show({
          controller: itOrdController,
          templateUrl: 'templates/dialogs/material_order_det_manager.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        
        .then(function(answer) {
        	
        }, function() {
        });
    };
    
    function itOrdController($scope, $rootScope, $mdDialog, singleObjService, UI_VENDOR){
    	$scope.MAT_DET = UI_VENDOR.mat_det;
    	$scope.order = singleObjService.getObj();
    	$scope.user = $rootScope.user;
    	
  	    $scope.hide = function() {
  	      $mdDialog.hide();
  	    };

  	    $scope.cancel = function() {
  	      $mdDialog.cancel();
  	    };
  	    
  	    $scope.answer = function(statusId) {
  	    	$scope.order.paymentAmount = 0;
  	    	for(var i=0;i<$scope.order.orderedMaterials.length;i++){
  	    		$scope.order.paymentAmount = $scope.order.paymentAmount + parseFloat($scope.order.orderedMaterials[i].actualCost);
  	    	}
  	    	$scope.acceptOrder(statusId);
	    };
    	
    	$scope.acceptOrder = function(statusId){
			$http({
	            url : $rootScope.baseUrl+'action=vendorOrderAcpt&status_id='+statusId,
	            method : "POST",
	            data : {data: $scope.order},
	            headers: {
	                'Content-Type': 'application/json'
	            }
	        }).then(function(response) {
	        	$scope.order.status=response.data.result;
	        	commonService.ajsToast(response.data.message);
	  	    	$mdDialog.hide();
	        }, function(response) {
	        });
		}
    }
	
	$scope.filterWithDate = function(){
		var dateFromIn;
		var dateToIn;
		
		if($scope.filterBy != "custom"){
			dateFromIn = $scope.fromYear+ "-" + $scope.fromMonth + "-" + $scope.fromDay;
			dateToIn = $scope.toYear + "-" + $scope.toMonth+ "-"+ $scope.toDay;
		}
		else{
			dateFromIn = $filter('date')($scope.dateFrom,'yyyy-MM-dd');
			dateToIn = $filter('date')($scope.dateTo, "yyyy-MM-dd");
		}
		$scope.getCredits(dateFromIn, dateToIn);		
	}
});