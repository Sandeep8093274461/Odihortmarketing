app.controller('myDDHAreaProductionCtrl', function ($scope, $http, $filter) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $scope.getBlocks = function () {
        $http.get('http://localhost:3000/ddh/getBlocks').then(function success(response) {
            $scope.blocks = response.data;
            var blockAll = { BlockCode: 0, BlockName: 'All' };
            $scope.blocks.unshift(blockAll);
            $scope.ddlBlocks = 0;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.bindEstimate = function () {
        $scope.ddlEstimate = null;
        if ($scope.ddlFinancialYear == '2019-20') {
            $scope.estimates = [{ 'EstimateID': 'All', 'EstimateName': 'All' }, { 'EstimateID': '1st Estimate - 10th December 2019', 'EstimateName': '1st Estimate - 10th December 2019' }, { 'EstimateID': '2nd Estimate - 10th May 2020', 'EstimateName': '2nd Estimate - 10th May 2020' }, { 'EstimateID': '3rd Estimate - 10th August 2020', 'EstimateName': '3rd Estimate - 10th August 2020' }, { 'EstimateID': 'Final Estimate - 10th December 2020', 'EstimateName': 'Final Estimate - 10th December 2020' }];
        }
        else {
            $scope.estimates = [{ 'EstimateID': 'All', 'EstimateName': 'All' }, { 'EstimateID': '1st Estimate - 10th December 2020', 'EstimateName': '1st Estimate - 10th December 2020' }, { 'EstimateID': '2nd Estimate - 10th May 2021', 'EstimateName': '2nd Estimate - 10th May 2021' }, { 'EstimateID': '3rd Estimate - 10th August 2021', 'EstimateName': '3rd Estimate - 10th August 2021' }, { 'EstimateID': 'Final Estimate - 10th December 2021', 'EstimateName': 'Final Estimate - 10th December 2021' }];
        }
    };

    $scope.getCategories = function () {
        $http.get('http://localhost:3000/ddh/getCategories').then(function success(response) {
            $scope.categories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getItemsByCategory = function (categoryID) {
        if (categoryID != undefined) {
            $http.get('http://localhost:3000/ddh/getItemsByCategory?categoryID=' + categoryID).then(function success(response) {
                $scope.items = response.data;
            }, function error(response) {
                console.log(response.status);
            }).catch(function err(error) {
                console.log('An error occurred...', error);
            });
        }
    };

    $scope.getCropDetails = function () {
        if ($scope.ddlBlocks !== 0) {
            if ($scope.ddlBlocks !== null && $scope.ddlBlocks !== undefined && $scope.ddlFinancialYear !== null && $scope.ddlFinancialYear !== undefined && $scope.ddlEstimate !== null && $scope.ddlEstimate !== undefined && $scope.ddlCategories !== null && $scope.ddlCategories !== undefined) {
                $http.get('http://localhost:3000/ddh/getCropDetails?blockCode=' + $scope.ddlBlocks + '&categoryID=' + $scope.ddlCategories + '&estimate=' + $scope.ddlEstimate + '&financialYear=' + $scope.ddlFinancialYear).then(function success(response) {
                    $scope.cropDetails = response.data;
                    $scope.report = [];
                    if ($scope.ddlItems !== null && $scope.ddlItems !== undefined) {
                        $scope.cropDetails = $filter('filter')($scope.cropDetails, { ItemID: $scope.ddlItems }, true);
                    }
                    if ($scope.cropDetails.length > 0) {
                        angular.forEach($scope.cropDetails, function (i) {
                            if (i.hasOwnProperty('TotalArea') && i.hasOwnProperty('Production')) {
                                var k = (i.TotalArea == undefined || i.TotalArea == null || i.TotalArea == '') ? 0.00 : i.TotalArea;
                                var l = (i.Production == undefined || i.Production == null || i.Production == '') ? 0.00 : i.Production;
                                var m = (i.FruitsBearingArea == undefined || i.FruitsBearingArea == null || i.FruitsBearingArea == '') ? 0.00 : i.FruitsBearingArea;
                                if ($scope.ddlCategories == 1 || $scope.ddlCategories == 4) {
                                    i.productivity = (parseFloat(l / m).toFixed(2) == "NaN" || parseFloat(l / m).toFixed(2) == "Infinity") ? null : parseFloat(l / m).toFixed(2) + ' ' + i.Unit + ' / Ha.';
                                }
                                else {
                                    i.productivity = (parseFloat(l / k).toFixed(2) == "NaN" || parseFloat(l / k).toFixed(2) == "Infinity") ? null : parseFloat(l / k).toFixed(2) + ' ' + i.Unit + ' / Ha.';

                                }
                                // i.productivity = (parseFloat(l / k).toFixed(2) == "NaN" || parseFloat(l / k).toFixed(2) == "Infinity") ? null : parseFloat(l / k).toFixed(2) + ' ' + i.Unit + ' / Ha.';
                            }
                        });
                    }
                    else {
                        alert('No record is found.');
                    }
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
        }
        else {
            $scope.cropDetails = [];
            $scope.report = [];
            $scope.getReport();
        }
    };

    $scope.calculateProductivity = function (i) {
        if (i.hasOwnProperty('TotalArea') && i.hasOwnProperty('Production')) {
            var k = (i.TotalArea == undefined || i.TotalArea == null || i.TotalArea == '') ? 0.00 : i.TotalArea;
            var l = (i.Production == undefined || i.Production == null || i.Production == '') ? 0.00 : i.Production;
            var m = (i.FruitsBearingArea == undefined || i.FruitsBearingArea == null || i.FruitsBearingArea == '') ? 0.00 : i.FruitsBearingArea;
            if ($scope.ddlCategories == 1 || $scope.ddlCategories == 4) {
                i.productivity = (parseFloat(l / m).toFixed(2) == "NaN" || parseFloat(l / m).toFixed(2) == "Infinity") ? null : parseFloat(l / m).toFixed(2) + ' ' + i.Unit + ' / Ha.';
            }
            else {
                i.productivity = (parseFloat(l / k).toFixed(2) == "NaN" || parseFloat(l / k).toFixed(2) == "Infinity") ? null : parseFloat(l / k).toFixed(2) + ' ' + i.Unit + ' / Ha.';

            }
            // i.productivity = (parseFloat(l / k).toFixed(2) == "NaN" || parseFloat(l / k).toFixed(2) == "Infinity") ? null : parseFloat(l / k).toFixed(2) + ' ' + i.Unit + ' / Ha.';
        }
    };

    $scope.getReport = function () {
        if ($scope.ddlItems !== null && $scope.ddlItems !== undefined) {
            if ($scope.ddlBlocks == 0) {
                if ($scope.ddlBlocks !== null && $scope.ddlBlocks !== undefined && $scope.ddlFinancialYear !== null && $scope.ddlFinancialYear !== undefined && $scope.ddlEstimate !== null && $scope.ddlEstimate !== undefined && $scope.ddlCategories !== null && $scope.ddlCategories !== undefined && $scope.ddlItems !== null && $scope.ddlItems !== undefined) {
                    $http.get('http://localhost:3000/ddh/getReport?blockCode=' + $scope.ddlBlocks + '&categoryID=' + $scope.ddlCategories + '&estimate=' + $scope.ddlEstimate + '&financialYear=' + $scope.ddlFinancialYear + '&itemID=' + $scope.ddlItems).then(function success(response) {
                        $scope.report = response.data;
                        $scope.cropDetails = [];
                        if ($scope.report.length > 0) {
                            $scope.sumTotalArea = 0;
                            $scope.sumProduction = 0;
                            $scope.sumFruitsBearingArea = 0;
                            var sumProductivity = 0;
                            var un = $filter('filter')($scope.items, { ItemID: $scope.ddlItems }, true)[0].Unit;
                            $scope.unitName = (un == 'Q') ? 'MT' : 'Lakh Nos.';
                            $scope.categoryName = $filter('filter')($scope.categories, { CategoryID: $scope.ddlCategories }, true)[0].CategoryName;
                            $scope.itemName = $filter('filter')($scope.items, { ItemID: $scope.ddlItems }, true)[0].ItemName;
                            angular.forEach($scope.report, function (i) {
                                if (i.hasOwnProperty('TotalArea') && i.hasOwnProperty('Production')) {
                                    var k = (i.TotalArea == undefined || i.TotalArea == null || i.TotalArea == '') ? 0.00 : i.TotalArea;
                                    var l = (i.Production == undefined || i.Production == null || i.Production == '') ? 0.00 : i.Production;
                                    // i.productivity = (parseFloat(l / k).toFixed(2) == "NaN" || parseFloat(l / k).toFixed(2) == "Infinity") ? 0 : parseFloat(l / k).toFixed(2);
                                    // sumProductivity = sumProductivity + parseFloat(i.productivity);
                                    var m = (i.FruitsBearingArea == undefined || i.FruitsBearingArea == null || i.FruitsBearingArea == '') ? 0.00 : i.FruitsBearingArea;


                                    if ($scope.ddlCategories == 1 || $scope.ddlCategories == 4) {
                                        i.productivity = (parseFloat(l / m).toFixed(2) == "NaN" || parseFloat(l / m).toFixed(2) == "Infinity") ? 0 : parseFloat(l / m).toFixed(2);
                                        sumProductivity = sumProductivity + parseFloat(i.productivity);

                                    }
                                    else {
                                        i.productivity = (parseFloat(l / k).toFixed(2) == "NaN" || parseFloat(l / k).toFixed(2) == "Infinity") ? 0 : parseFloat(l / k).toFixed(2) ;
                                        sumProductivity = sumProductivity + parseFloat(i.productivity);


                                    }
                                }
                                if (i.hasOwnProperty('TotalArea')) {
                                    var m = (i.TotalArea == undefined || i.TotalArea == null || i.TotalArea == '') ? 0.00 : i.TotalArea;
                                    $scope.sumTotalArea = $scope.sumTotalArea + m;
                                }
                                if (i.hasOwnProperty('Production')) {
                                    var n = (i.Production == undefined || i.Production == null || i.Production == '') ? 0.00 : i.Production;
                                    $scope.sumProduction = $scope.sumProduction + n;
                                }
                                if (i.hasOwnProperty('FruitsBearingArea')) {
                                    var o = (i.FruitsBearingArea == undefined || i.FruitsBearingArea == null || i.FruitsBearingArea == '') ? 0.00 : i.FruitsBearingArea;
                                    $scope.sumFruitsBearingArea = $scope.sumFruitsBearingArea + o;
                                }
                            });
                            $scope.avgProductivity = parseFloat(sumProductivity / $scope.report.length).toFixed(2);
                            if ($scope.sumTotalArea == 0 && $scope.sumProduction == 0) {
                                alert('No record is found.');
                                $scope.report = [];
                            }
                        }
                        else {
                            alert('No record is found.');
                        }
                    }, function error(response) {
                        console.log(response.status);
                    }).catch(function err(error) {
                        console.log('An error occurred...', error);
                    });
                }
            }
            else {
                if ($scope.ddlBlocks !== null && $scope.ddlBlocks !== undefined && $scope.ddlFinancialYear !== null && $scope.ddlFinancialYear !== undefined && $scope.ddlEstimate !== null && $scope.ddlEstimate !== undefined && $scope.ddlCategories !== null && $scope.ddlCategories !== undefined) {
                    $http.get('http://localhost:3000/ddh/getCropDetails?blockCode=' + $scope.ddlBlocks + '&categoryID=' + $scope.ddlCategories + '&estimate=' + $scope.ddlEstimate + '&financialYear=' + $scope.ddlFinancialYear).then(function success(response) {
                        $scope.cropDetails = response.data;
                        $scope.report = [];
                        $scope.cropDetails = $filter('filter')($scope.cropDetails, { ItemID: $scope.ddlItems }, true);
                        if ($scope.cropDetails.length > 0) {
                            angular.forEach($scope.cropDetails, function (i) {
                                if (i.hasOwnProperty('TotalArea') && i.hasOwnProperty('Production')) {
                                    var k = (i.TotalArea == undefined || i.TotalArea == null || i.TotalArea == '') ? 0.00 : i.TotalArea;
                                    var l = (i.Production == undefined || i.Production == null || i.Production == '') ? 0.00 : i.Production;
                                    // i.productivity = (parseFloat(l / k).toFixed(2) == "NaN" || parseFloat(l / k).toFixed(2) == "Infinity") ? null : parseFloat(l / k).toFixed(2) + ' ' + i.Unit + ' / Ha.';
                                    var m = (i.FruitsBearingArea == undefined || i.FruitsBearingArea == null || i.FruitsBearingArea == '') ? 0.00 : i.FruitsBearingArea;
                                    if ($scope.ddlCategories == 1 || $scope.ddlCategories == 4) {
                                        i.productivity = (parseFloat(l / m).toFixed(2) == "NaN" || parseFloat(l / m).toFixed(2) == "Infinity") ? null : parseFloat(l / m).toFixed(2) + ' ' + i.Unit + ' / Ha.';
                                    }
                                    else {
                                        i.productivity = (parseFloat(l / k).toFixed(2) == "NaN" || parseFloat(l / k).toFixed(2) == "Infinity") ? null : parseFloat(l / k).toFixed(2) + ' ' + i.Unit + ' / Ha.';

                                    }
                                }
                            });
                        }
                        else {
                            alert('No record is found.');
                        }
                    }, function error(response) {
                        console.log(response.status);
                    }).catch(function err(error) {
                        console.log('An error occurred...', error);
                    });
                }
            }
        }
        else {
            if ($scope.ddlBlocks !== null && $scope.ddlBlocks !== undefined && $scope.ddlFinancialYear !== null && $scope.ddlFinancialYear !== undefined && $scope.ddlEstimate !== null && $scope.ddlEstimate !== undefined && $scope.ddlCategories !== null && $scope.ddlCategories !== undefined) {
                $http.get('http://localhost:3000/ddh/getCropDetails?blockCode=' + $scope.ddlBlocks + '&categoryID=' + $scope.ddlCategories + '&estimate=' + $scope.ddlEstimate + '&financialYear=' + $scope.ddlFinancialYear).then(function success(response) {
                    $scope.cropDetails = response.data;
                    $scope.report = [];
                    if ($scope.cropDetails.length > 0) {
                        angular.forEach($scope.cropDetails, function (i) {
                            if (i.hasOwnProperty('TotalArea') && i.hasOwnProperty('Production')) {
                                var k = (i.TotalArea == undefined || i.TotalArea == null || i.TotalArea == '') ? 0.00 : i.TotalArea;
                                var l = (i.Production == undefined || i.Production == null || i.Production == '') ? 0.00 : i.Production;
                                // i.productivity = (parseFloat(l / k).toFixed(2) == "NaN" || parseFloat(l / k).toFixed(2) == "Infinity") ? null : parseFloat(l / k).toFixed(2) + ' ' + i.Unit + ' / Ha.';
                                var m = (i.FruitsBearingArea == undefined || i.FruitsBearingArea == null || i.FruitsBearingArea == '') ? 0.00 : i.FruitsBearingArea;
                                if ($scope.ddlCategories == 1 || $scope.ddlCategories == 4) {
                                    i.productivity = (parseFloat(l / m).toFixed(2) == "NaN" || parseFloat(l / m).toFixed(2) == "Infinity") ? null : parseFloat(l / m).toFixed(2) ;
                                }
                                else {
                                    i.productivity = (parseFloat(l / k).toFixed(2) == "NaN" || parseFloat(l / k).toFixed(2) == "Infinity") ? null : parseFloat(l / k).toFixed(2) ;

                                }
                            }
                        });
                    }
                    else {
                        alert('Please select the item.');
                    }
                }, function error(response) {
                    console.log(response.status);
                }).catch(function err(error) {
                    console.log('An error occurred...', error);
                });
            }
        }
    };

});