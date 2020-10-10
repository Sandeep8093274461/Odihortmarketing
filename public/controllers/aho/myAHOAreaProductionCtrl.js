app.controller('myAHOAreaProductionCtrl', function ($scope, $http, $filter) {

    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

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
        $http.get('http://localhost:3000/aho/getCategories').then(function success(response) {
            $scope.categories = response.data;
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    };

    $scope.getCropDetails = function () {
        if ($scope.ddlFinancialYear !== null && $scope.ddlFinancialYear !== undefined && $scope.ddlEstimate !== null && $scope.ddlEstimate !== undefined && $scope.ddlCategories !== null && $scope.ddlCategories !== undefined) {
            $http.get('http://localhost:3000/aho/getCropDetails?categoryID=' + $scope.ddlCategories + '&estimate=' + $scope.ddlEstimate + '&financialYear=' + $scope.ddlFinancialYear).then(function success(response) {

                $scope.cropDetails = response.data;

                if ($scope.ddlEstimate == 'All') {
                    var data = Enumerable.From(response.data)
                        .GroupBy(function (item) { return item.ItemName; })
                        .Select(function (item, index) {

                            item.source[0].ItemName = item.source[0].ItemName;
                            item.source[0].TotalArea = item.source[0].TotalArea + item.source[1].TotalArea;
                            item.source[0].FruitsBearingArea = item.source[0].FruitsBearingArea + item.source[1].FruitsBearingArea ;
                            item.source[0].Production = item.source[0].Production + item.source[1].Production;
                            item.source[0].productivity = item.source[0].productivity + item.source[1].productivity;
                            

                            return item.source[0]
                        })
                        .ToArray();
                    $scope.cropDetails = data;

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
        }
    };

    $scope.submitAP = function (type) {
        if ($scope.ddlFinancialYear !== null && $scope.ddlFinancialYear !== undefined && $scope.ddlEstimate !== null && $scope.ddlEstimate !== undefined && $scope.ddlEstimate !== 'All' && $scope.ddlCategories !== null && $scope.ddlCategories !== undefined) {
            var counter = 0;
            if ($scope.ddlCategories == 1 || $scope.ddlCategories == 4) {
                angular.forEach($scope.cropDetails, function (i) {
                    if (i.hasOwnProperty('TotalArea') && i.hasOwnProperty('FruitsBearingArea') && i.hasOwnProperty('Production')) {
                        if (i.TotalArea !== null && i.TotalArea !== undefined && i.TotalArea !== '' && i.FruitsBearingArea !== null && i.FruitsBearingArea !== undefined && i.FruitsBearingArea !== '' && i.Production !== null && i.Production !== undefined && i.Production !== '') {
                            counter++;
                        }
                    }
                });
            }
            else {
                angular.forEach($scope.cropDetails, function (i) {
                    if (i.hasOwnProperty('TotalArea') && i.hasOwnProperty('Production')) {
                        if (i.TotalArea !== null && i.TotalArea !== undefined && i.TotalArea !== '' && i.Production !== null && i.Production !== undefined && i.Production !== '') {
                            counter++;
                        }
                    }
                });
            }
            if (counter == $scope.cropDetails.length) {
                var count = 0;
                if ($scope.ddlCategories == 1 || $scope.ddlCategories == 4) {
                    angular.forEach($scope.cropDetails, function (i) {
                        if (i.hasOwnProperty('TotalArea') && i.hasOwnProperty('FruitsBearingArea')) {
                            if (i.FruitsBearingArea <= i.TotalArea) {
                                count++;
                            }
                        }
                    });
                }
                else {
                    angular.forEach($scope.cropDetails, function (i) {
                        i.FruitsBearingArea = null;
                        count++;
                    });
                }
                if (count == $scope.cropDetails.length) {
                    var myObj = {
                        financialYear: $scope.ddlFinancialYear,
                        estimate: $scope.ddlEstimate,
                        type: type
                    };
                    $http.post('http://localhost:3000/aho/submitAreaProduction', { data: { arr: $scope.cropDetails, obj: myObj } }, { credentials: 'same-origin', headers: { 'CSRF-Token': token } }).then(function success(response) {
                        var result = response.data;
                        if (result == true) {
                            alert('The Area & Production details are submitted successfully.');
                            $scope.getCropDetails();
                        }
                        else {
                            alert('An error occurred... Please contact the administrator.');
                        }
                    }).catch(function error(err) {
                        console.log('An error occurred...', err);
                    });
                }
                else {
                    alert('Fruits Bearing Area cannot be more than Total Area.');
                }
            }
            else {
                alert('Please enter all the fields containing Total Area, Fruits Bearing Area (where required) & Production');
            }
        }
        else {
            alert('Please select the Financial Year, Estimate & Category.');
        }
    };



    $scope.estimasewiseItemDetails = function (i) {
        $scope.iteamName = i.ItemName;
        $scope.allDetails = {}
        $scope.allDetails.firstEstimate = [];
        $scope.allDetails.secondEstimate = [];
        $scope.allDetails.thirdEstimate = [];

        $http.get('http://localhost:3000/aho/estimasewiseItemDetails?ItemID=' + i.ItemID + '&financialYear=' + $scope.ddlFinancialYear).then(function success(response) {
            response.data.forEach(e => {
                if (e.FinancialYear == "2019-20") {
                    if (e.Estimate === '1st Estimate - 10th December 2019') {
                        if (e.FruitsBearingArea == null) {
                            e.productivity = (parseFloat(e.Production / e.TotalArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.TotalArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.TotalArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        else {
                            e.productivity = (parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        $scope.allDetails.firstEstimate.push({ FruitsBearingArea: e.FruitsBearingArea, Production: e.Production, TotalArea: e.TotalArea, ItemID: e.ItemID, Unit: e.Unit, productivity: e.productivity })

                    }
                    if (e.Estimate === '2nd Estimate - 10th May 2020') {
                        if (e.FruitsBearingArea == null) {
                            e.productivity = (parseFloat(e.Production / e.TotalArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.TotalArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.TotalArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        else {
                            e.productivity = (parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        $scope.allDetails.secondEstimate.push({ FruitsBearingArea: e.FruitsBearingArea, Production: e.Production, TotalArea: e.TotalArea, ItemID: e.ItemID, Unit: e.Unit, productivity: e.productivity })

                    }
                    if (e.Estimate === '3rd Estimate - 10th August 2020') {
                        if (e.FruitsBearingArea == null) {
                            e.productivity = (parseFloat(e.Production / e.TotalArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.TotalArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.TotalArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        else {
                            e.productivity = (parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        $scope.allDetails.thirdEstimate.push({ FruitsBearingArea: e.FruitsBearingArea, Production: e.Production, TotalArea: e.TotalArea, ItemID: e.ItemID, Unit: e.Unit, productivity: e.productivity })

                    }
                }
                else {

                    if (e.Estimate === '1st Estimate - 10th December 2020') {
                        if (e.FruitsBearingArea == null) {
                            e.productivity = (parseFloat(e.Production / e.TotalArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.TotalArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.TotalArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        else {
                            e.productivity = (parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        $scope.allDetails.firstEstimate.push({ FruitsBearingArea: e.FruitsBearingArea, Production: e.Production, TotalArea: e.TotalArea, ItemID: e.ItemID, Unit: e.Unit, productivity: e.productivity })

                    }
                    if (e.Estimate === '2nd Estimate - 10th May 2021') {
                        if (e.FruitsBearingArea == null) {
                            e.productivity = (parseFloat(e.Production / e.TotalArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.TotalArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.TotalArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        else {
                            e.productivity = (parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        $scope.allDetails.secondEstimate.push({ FruitsBearingArea: e.FruitsBearingArea, Production: e.Production, TotalArea: e.TotalArea, ItemID: e.ItemID, Unit: e.Unit, productivity: e.productivity })

                    }
                    if (e.Estimate === '3rd Estimate - 10th August 2021') {
                        if (e.FruitsBearingArea == null) {
                            e.productivity = (parseFloat(e.Production / e.TotalArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.TotalArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.TotalArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        else {
                            e.productivity = (parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "NaN" || parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) == "Infinity") ? null : parseFloat(e.Production / e.FruitsBearingArea).toFixed(2) + ' ' + e.Unit + ' / Ha.';

                        }
                        $scope.allDetails.thirdEstimate.push({ FruitsBearingArea: e.FruitsBearingArea, Production: e.Production, TotalArea: e.TotalArea, ItemID: e.ItemID, Unit: e.Unit, productivity: e.productivity })

                    }
                }

            })
        }, function error(response) {
            console.log(response.status);
        }).catch(function err(error) {
            console.log('An error occurred...', error);
        });
    }

});