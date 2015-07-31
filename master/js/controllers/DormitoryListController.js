App.controller('DormitoryListController', [
    '$scope', '$http', '$state','$filter','ngTableParams','$resource', '$timeout', 'ngTableDataService', 'ngDialog', 'ShareService', 'DormitoryService', 
    function($scope, $http, $state, $filter, ngTableParams, $resource, $timeout, ngTableDataService, ngDialog, ShareService, DormitoryService) {

    'use strict';
    var vm = this;
    // ========== 数据区 ==========
    
    var data = null;
    $scope.addressTree = {};

    // -------- 搜索关键词 --------
    $scope.selectedCampus = "";
    $scope.selectedAddress = "";
    $scope.selectedFloor = "";
    $scope.searchKeywords = "";
    // ----------------------------
    // ============================
    var showTableData = function($defer, params) {
        var searchedData = searchData(data);
        var orderedData = params.sorting() ? $filter('orderBy')(searchedData, params.orderBy()) : searchedData;
        params.total(orderedData.length);
        $defer.resolve($scope.dormitories = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }

    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
        total: 0,
        counts: [10, 20, 50],
        getData: function($defer, params) {
            if(!data) {
                DormitoryService.queryData({
                    success : function(response) {
                        if(response.status) {
                            data = DormitoryService.preprocessData(response.result);
                            showTableData($defer, params);
                        } else {
                            alert("列表获取失败");
                        }
                        console.log("success", data);
                    },
                    error : function(data, status, headers, config) {
                        alert("GET Error");
                    }
                });
            } else {
                showTableData($defer, params);
            }            
        }
    });

    // ========== 区域监听 ==========
    $scope.$watch("searchKeywords", function () {
        vm.tableParams.reload();
    });
    // ==============================

    // ========== 下拉框内a标签的click动作 ==========
    $scope.selectCampus = function(campus) {
        $scope.selectedCampus = campus;
        $scope.campusOpen = false;
        $scope.selectedAddress = "";
        $scope.selectedFloor = "";
        vm.tableParams.reload();
    }
    $scope.selectAddress = function(address) {
        $scope.selectedAddress = address;
        $scope.addressOpen = false;
        $scope.selectedFloor = "";
        vm.tableParams.reload();
    }
    $scope.selectFloor = function(floor) {
        $scope.selectedFloor = floor;
        $scope.floorOpen = false;
        vm.tableParams.reload();
    }
    // ==============================

    // ========== 数据相关操作 ==========
    var initAddressTree = function() {
        var path = "server/address-tree.json";
        $http.get(path)
        .success(function(response) {
            $scope.addressTree = response;
        })
        .error(function(data, status, headers, config) {
          alert("Address Tree init failure!");
        });
    }
    initAddressTree();

    var searchData = function() {
        var filterData = data;
        if($scope.searchKeywords) {
            var keywords = $scope.searchKeywords.split(" ");
            var i;
            for(i in keywords) {
                filterData = $filter('filter')(filterData, keywords[i]);
            }
        }
        if($scope.selectedCampus)filterData = $filter('filter')(filterData, { dormitory : { campus : $scope.selectedCampus}});
        if($scope.selectedAddress) filterData = $filter('filter')(filterData, { dormitory : { address : $scope.selectedAddress}});
        if($scope.selectedFloor) filterData = $filter('filter')(filterData, { dormitory : { floor : $scope.selectedFloor}});
        return filterData;
    }
    // ======================================

    // ========== 表格Checkbox ==========
    $scope.checkboxes = { 'checked': false, items: {} };
    // 监视总checkbox
    $scope.$watch('checkboxes.checked', function(value) {
        angular.forEach($scope.dormitories, function(item) {
            if (angular.isDefined(item.id)) {
                $scope.checkboxes.items[item.id] = value;
            }
        });
    });
    // 监视子checkbox
    $scope.$watch('checkboxes.items', function(values) {
        if (!$scope.dormitories) {
            return;
        }
        var checked = 0, unchecked = 0,
        total = $scope.dormitories.length;
        angular.forEach($scope.dormitories, function(item) {
            checked   +=  ($scope.checkboxes.items[item.id]) || 0;
            unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        // grayed checkbox
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);
    // ===================================

    // ========== 表格内按钮 ==========
    $scope.showEmployee = function($employee) {
        ShareService.setData(angular.copy($employee));

        ngDialog.open({
            template: 'app/views/dialogs/show-employee.html',

            controller: function ($scope, ngDialog, ShareService) {
                $scope.employee = ShareService.getData();
                console.log($scope.employee);
                $scope.cancel = function() {
                    ngDialog.close();
                }
            }
        });
    }
    $scope.addHouseHolder = function($item) {
        ShareService.setData(angular.copy($item));

        ngDialog.open({
            template: 'app/views/dialogs/check-in.html',

            controller: function ($scope, ngDialog, ShareService) {
                $scope.item = ShareService.getData();
                $scope.selectedApplication = null;
                $scope.showApplication = false;
                console.log($scope.item);
                $scope.applications = [{
                    "id" : 1,
                    "employees" : [{
                        "id" : 1,
                        "name" : "王婷",
                        "gender" : "FEMAEL",
                        "idNum" : "34262319900205659X",
                        "department" : "幼儿园",
                        "dutyDate" : "2015-07-07",
                        "workCampus" : "鼓楼",
                        "workLocationDetail" : "南京大学幼儿园",
                        "spouseType" : "NONE",
                        "outsideSpouse" : {}
                    }],
                    "date" : "2015-03-04",
                    "type" : "GROUP_FEMALE",
                    "content" : "申请理由1",
                    "status" : "APPROVED"
                },{
                    "id" : 1,
                    "employees" : [{
                        "id" : 1,
                        "name" : "夏娜",
                        "gender" : "FEMAEL",
                        "idNum" : "34262319940205659X",
                        "department" : "幼儿园",
                        "dutyDate" : "2015-07-07",
                        "workCampus" : "鼓楼",
                        "workLocationDetail" : "南京大学幼儿园",
                        "spouseType" : "NONE",
                        "outsideSpouse" : {}
                    }],
                    "date" : "2015-03-05",
                    "type" : "GROUP_FEMALE",
                    "content" : "申请理由2",
                    "status" : "APPROVED"
                }];
                $scope.$watch("$select.selected", function (value) {
                    console.log($scope.selectedApplication);
                });
                $scope.updateSelectionStatus = function(value) {
                    $scope.selectedApplication = value;
                }
                $scope.cancel = function() {
                    ngDialog.close();
                }
            }
        });
    }
    $scope.modifyDormitory = function($dormitory) {
        ShareService.setData(angular.copy($dormitory));

        ngDialog.open({
            template: 'app/views/dialogs/edit-dormitory.html',

            controller: function ($scope, ngDialog, ShareService) {
                $scope.dormitory = ShareService.getData();
                $scope.dormitoryTypes = ["集体宿舍 - 男", "集体宿舍 - 女"];
                $scope.submitModify = function () {
                    console.log($scope.dormitory);
                    $scope.submitted = true;
                    if ($scope.modifyDormitoryForm.$valid) {
                        console.log('Submitted!!');
                    } else {
                        console.log('Not valid!!');
                        return false;
                    }
                };

                $scope.cancel = function() {
                    ngDialog.close();
                }

            }
        });
    }
    // ================================
}]);