app.controller('myAdminStockOutListCtrl', function ($scope, $http, $filter) {

    $scope.getCategories = function () {
        $http.get('http://localhost:3000/admin/getCategories').then(function success(response) {
            $scope.categories = response.data;
            var categoryAll = { CategoryID: 0, CategoryName: 'All' };
            $scope.categories.unshift(categoryAll);
            $scope.ddlCategories = 0;
            var itemAll = { ItemID: 0, ItemName: 'All' };
            $scope.items = [];
            $scope.items.unshift(itemAll);
            $scope.ddlItems = 0;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getItemsByCategory = function (categoryID) {
        if (categoryID != undefined) {
            $http.get('http://localhost:3000/admin/getItemsByCategory?categoryID=' + categoryID).then(function success(response) {
                $scope.items = response.data;
                var itemAll = { ItemID: 0, ItemName: 'All' };
                $scope.items.unshift(itemAll);
                $scope.ddlItems = 0;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getDistricts = function () {
        $http.get('http://localhost:3000/admin/getDistricts').then(function success(response) {
            $scope.districts = response.data;
            var districtAll = { DistrictCode: 0, DistrictName: 'All' };
            $scope.districts.unshift(districtAll);
            $scope.ddlDistricts = 0;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getStockOutDetails = function () {
        var date = document.getElementById("dateRange").value;
        var dateFrom = '';
        var dateTill = '';
        $scope.displayDate = '';
        if (date !== undefined && date !== null && date !== '') {
            dateFrom = date.split(' - ')[0].split("-").reverse().join("-");
            dateTill = date.split(' - ')[1].split("-").reverse().join("-");
            // $scope.displayDate = new Date(dateFrom).toString().substring(4, 15) + ' - ' + new Date(dateTill).toString().substring(4, 15);
            $scope.displayDate = date.split(' - ')[0].split("-").join("/") + ' - ' + date.split(' - ')[1].split("-").join("/");
        }
        $http.get('http://localhost:3000/admin/getStockOutDetails?districtCode=' + $scope.ddlDistricts + '&categoryID=' + $scope.ddlCategories + '&itemID=' + $scope.ddlItems + '&dateFrom=' + dateFrom + '&dateTill=' + dateTill).then(function success(response) {
            $scope.stockOutDetails = response.data;
            if ($scope.stockOutDetails.length > 0) {
                $scope.districtName = $filter('filter')($scope.districts, { DistrictCode: $scope.ddlDistricts }, true)[0].DistrictName;
                $scope.categoryName = $filter('filter')($scope.categories, { CategoryID: $scope.ddlCategories }, true)[0].CategoryName;
                $scope.itemName = $filter('filter')($scope.items, { ItemID: $scope.ddlItems }, true)[0].ItemName;
                $scope.totalQuintal = 0;
                $scope.totalNo = 0;
                angular.forEach($scope.stockOutDetails, function (i) {
                    if (i.Unit == 'Q') {
                        $scope.totalQuintal += i.SaleQuantity;
                    }
                    else {
                        $scope.totalNo += i.SaleQuantity;
                    }
                })
                $scope.pageSize = 50;
                $scope.search = '';
            }
            else {
                alert('No Stock Out records found!');
            }
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };

    $scope.getStockOutLocationItemDetails = function (i) {
        $scope.iNm = i.ItemName;
        $scope.ut = i.Unit;
        $scope.refNo = i.ReferenceNo;
        $scope.fID = i.FarmerID;
        $http.get('http://localhost:3000/admin/getStockOutLocationItemDetails?referenceNo=' + i.ReferenceNo + '&farmerID=' + i.FarmerID + '&itemID=' + i.ItemID + '&districtCode=' + i.DistrictCode + '&farmerName=' + i.FarmerName + '&farmerMobileNo=' + i.FarmerMobileNo).then(function success(response) {
            $scope.stockOutlocationItemDetails = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

});