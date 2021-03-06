App.controller('DormitoryListController', [
    '$scope', '$http', '$state','$filter','ngTableParams','$resource', '$timeout', 'ngTableDataService', 'ngDialog', 'DialogService', 'DormitoryService', 
    function($scope, $http, $state, $filter, ngTableParams, $resource, $timeout, ngTableDataService, ngDialog, DialogService, DormitoryService) {
    'use strict';
    var vm = this;
    // ========== 数据区 ==========
    
    var data = null;
    $scope.addressTree = {};

    // -------- 搜索关键词 --------
    $scope.selectedCampus = "";
    $scope.selectedAddress = "";
    $scope.selectedFloor = "";
    $scope.selectedType = "";
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
    $scope.selectType = function(type) {
        $scope.selectedType = type;
        $scope.typeOpen = false;
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
        if($scope.selectedType) filterData = $filter('filter')(filterData, { dormitory : { typeCN : $scope.selectedType}});
        return filterData;
    }
    // ======================================

    // ========== 表格Checkbox ==========
    $scope.checkboxes = { 'checked': false, items: {} };
    // 总checkbox
    $scope.$watch('checkboxes.checked', function(value) {
        angular.forEach($scope.dormitories, function(item) {
            if (angular.isDefined(item.dormitory.id)) {
                $scope.checkboxes.items[item.dormitory.id] = value;
            }
        });
    });
    // 子checkbox
    $scope.$watch('checkboxes.items', function(values) {
        if (!$scope.dormitories) {
            return;
        }
        var checked = 0, unchecked = 0,
        total = $scope.dormitories.length;
        angular.forEach($scope.dormitories, function(item) {
            checked   +=  ($scope.checkboxes.items[item.dormitory.id]) || 0;
            unchecked += (!$scope.checkboxes.items[item.dormitory.id]) || 0;
        });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        // grayed checkbox
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);
    // ===================================

    // ========== 表格内按钮 ==========
    $scope.showEmployee = function(employee) {
        DialogService.openShowEmployeeDialog(employee);
    }
    $scope.addHouseHolder = function(dormitory) {
        DialogService.openCheckInDialog(dormitory);
    }
    $scope.modifyDormitory = function(dormitory) {
       DialogService.openModifyDormitoryDialog(dormitory);
    }
    // ================================
}]);