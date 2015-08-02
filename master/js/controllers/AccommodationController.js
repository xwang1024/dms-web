App.controller('AccommodationController', [
    '$scope', '$http', '$state','$filter','ngTableParams','$resource', '$timeout', 'ngTableDataService', 'ngDialog', 'ShareService', 'AccommodationService',
    function($scope, $http, $state, $filter, ngTableParams, $resource, $timeout, ngTableDataService, ngDialog, ShareService, AccommodationService) {
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
    $scope.selectedStatus = "";
    $scope.searchKeywords = "";
    // ----------------------------
    // ============================

    var showTableData = function($defer, params) {
        var searchedData = searchData(data);
        var orderedData = params.sorting() ? $filter('orderBy')(searchedData, params.orderBy()) : searchedData;
        params.total(orderedData.length);
        $defer.resolve($scope.accommodationItems = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }

    vm.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: 0, // length of data
        counts: [10, 20, 50],
        getData: function($defer, params) {
            if(!data) {
                AccommodationService.queryFullList({
                    success : function(response) {
                        if(response.status) {
                            data = AccommodationService.preprocessData(response.result);
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
    $scope.selectStatus = function(status) {
        $scope.selectedStatus = status;
        $scope.statusOpen = false;
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
        if($scope.selectedStatus) filterData = $filter('filter')(filterData, { statusCN : $scope.selectedStatus });
        return filterData;
    }
    // ======================================

    // ========== 表格Checkbox ==========
    $scope.checkboxes = { 'checked': false, items: {} };
    // 总checkbox
    $scope.$watch('checkboxes.checked', function(value) {
        angular.forEach($scope.accommodationItems, function(item) {
            if (angular.isDefined(item.accommodations[0].accommodationId)) {
                $scope.checkboxes.items[item.accommodations[0].accommodationId] = value;
            }
        });
    });
    // 子checkbox
    $scope.$watch('checkboxes.items', function(values) {
        if (!$scope.accommodationItems) {
            return;
        }
        var checked = 0, unchecked = 0,
        total = $scope.accommodationItems.length;
        angular.forEach($scope.accommodationItems, function(item) {
            checked   +=  ($scope.checkboxes.items[item.accommodations[0].accommodationId]) || 0;
            unchecked += (!$scope.checkboxes.items[item.accommodations[0].accommodationId]) || 0;
        });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        // grayed checkbox
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);
    // ===================================

    // 每一行的修改按钮
    $scope.modify = function($user) {
    }
}]);
