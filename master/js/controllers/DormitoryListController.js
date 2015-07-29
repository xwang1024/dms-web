App.controller('DormitoryListController', [
    '$scope', '$http', '$state','$filter','ngTableParams','$resource', '$timeout', 'ngTableDataService', 'ngDialog', 'ShareService',
    function($scope, $http, $state, $filter, ngTableParams, $resource, $timeout, ngTableDataService, ngDialog, ShareService) {

    'use strict';
    var vm = this;
    // ========== 数据区 ==========
    var data = [{
        "dormitory" : {
            "id" : 10001,
            "campus" : "鼓楼",
            "address" : "陶北新村",
            "floor" : "1层",
            "doorplate" : "101",
            "type" : "GROUP_MALE",
            "capacityCnt" : 5,
            "occupiedCnt" : 2
        },
        "employees" : [{
            "id" : 20001,
            "name" : "胡志刚",
            "gender" : "MALE",
            "idNum" : "342623196505063528",
            "department" : "运输",
            "dutyDate" : "2012-02-04",
            "workCampus" : "鼓楼",
            "workLocationDetail" : "校车管理中心",
            "spouseType" : "NONE",
            "outsideSpouse" : {}
        },{
            "id" : 20002,
            "name" : "王富贵",
            "gender" : "MALE",
            "idNum" : "342623196908163588",
            "department" : "物业",
            "dutyDate" : "2015-03-07",
            "workCampus" : "鼓楼",
            "workLocationDetail" : "教学楼",
            "spouseType" : "NONE",
            "outsideSpouse" : {}
        }]
    },{
        "dormitory" : {
            "id" : 10002,
            "campus" : "鼓楼",
            "address" : "陶北新村",
            "floor" : "1层",
            "doorplate" : "102",
            "type" : "GROUP_MALE",
            "capacityCnt" : 4,
            "occupiedCnt" : 1
        },
        "employees" : [{
            "id" : 20003,
            "name" : "胡志",
            "gender" : "MALE",
            "idNum" : "342623198805063538",
            "department" : "幼儿园",
            "dutyDate" : "2012-02-14",
            "workCampus" : "鼓楼",
            "workLocationDetail" : "南大幼儿园",
            "spouseType" : "NONE",
            "outsideSpouse" : {}
        }]
    }];
    $scope.addressTree = {};

    // -------- 搜索关键词 --------
    $scope.selectedCampus = "";
    $scope.selectedAddress = "";
    $scope.selectedFloor = "";
    $scope.searchKeywords = "";
    // ----------------------------
    // ============================

    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
        total: 0,
        getData: function($defer, params) {
            //queryData();
            // console.log(data);
            var searchedData = searchData(data);
            var orderedData = params.sorting() ? $filter('orderBy')(searchedData, params.orderBy()) : searchedData;
            orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;
            params.total(orderedData.length);
            $defer.resolve($scope.dormitories = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
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
    }
    $scope.selectAddress = function(address) {
        $scope.selectedAddress = address;
        $scope.addressOpen = false;
        $scope.selectedFloor = "";
    }
    $scope.selectFloor = function(floor) {
        $scope.selectedFloor = floor;
        $scope.floorOpen = false;
    }
    // ==============================

    // ========== 数据相关操作 ==========
    var initAddressTree = function() {
        var path = "server/address-tree.json";
        $http.get(path)
        .success(function(items) {
            $scope.addressTree = items;
        })
        .error(function(data, status, headers, config) {
          alert("Address Tree init failure!");
        });
    }
    initAddressTree();

    var queryData = function() {
        $scope.operating = true;
        $http.get("server/dormitory-list.json")
        .success(function(ddd) {
            var resData = {
                "status" : true,
                "message" : "",
                "count" : 2,
                "result" : [{
                    "dormitory" : {
                        "id" : 10001,
                        "campus" : "鼓楼",
                        "address" : "陶北新村",
                        "floor" : "1层",
                        "doorplate" : "101",
                        "type" : "GROUP_MALE",
                        "capacityCnt" : 5,
                        "occupiedCnt" : 2
                    },
                    "employees" : [{
                        "id" : 20001,
                        "name" : "胡志刚",
                        "gender" : "MALE",
                        "idNum" : "342623196505063528",
                        "department" : "运输",
                        "dutyDate" : "2012-02-04",
                        "workCampus" : "鼓楼",
                        "workLocationDetail" : "校车管理中心",
                        "spouseType" : "NONE",
                        "outsideSpouse" : {}
                    },{
                        "id" : 20002,
                        "name" : "王富贵",
                        "gender" : "MALE",
                        "idNum" : "342623196908163588",
                        "department" : "物业",
                        "dutyDate" : "2015-03-07",
                        "workCampus" : "鼓楼",
                        "workLocationDetail" : "教学楼",
                        "spouseType" : "NONE",
                        "outsideSpouse" : {}
                    }]
                },{
                    "dormitory" : {
                        "id" : 10002,
                        "campus" : "鼓楼",
                        "address" : "陶北新村",
                        "floor" : "1层",
                        "doorplate" : "102",
                        "type" : "GROUP_MALE",
                        "capacityCnt" : 4,
                        "occupiedCnt" : 1
                    },
                    "employees" : [{
                        "id" : 20003,
                        "name" : "胡志",
                        "gender" : "MALE",
                        "idNum" : "342623198805063538",
                        "department" : "幼儿园",
                        "dutyDate" : "2012-02-14",
                        "workCampus" : "鼓楼",
                        "workLocationDetail" : "南大幼儿园",
                        "spouseType" : "NONE",
                        "outsideSpouse" : {}
                    }]
                }]
            };


            // console.log(resData);
            if(resData.status) {
                vm.data = resData.result;
            } else {
                alert("2");
            }
        })
        .error(function(data, status, headers, config) {
          alert("1");
        });
    };
    queryData();

    var searchData = function() {
        var filterData = data;
        if($scope.searchDormitory) {
            var keywords = $scope.searchDormitory.split(" ");
            var i;
            for(i in keywords) {
                filterData = $filter('filter')(filterData,keywords[i]);
            }
        }
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
    $scope.showEmployee = function($item) {
        console.log($item);
    }
    $scope.addHouseHolder = function($item) {
        console.log($item);
    }
    $scope.modifyDormitory = function($dormitory) {
        ShareService.setData(angular.copy($dormitory));

        ngDialog.open({
            template: 'modifyDialog',

            controller: function ($scope, ngDialog, ShareService) {
                $scope.dormitory = ShareService.getData();
                $scope.dormitory.addressDetail = $scope.dormitory.campus + " - " + $scope.dormitory.address + " - " + $scope.dormitory.floor;

                $scope.submitModify = function () {
                    console.log($scope.dormitory);
                };

                $scope.cancel = function() {
                    ngDialog.close();
                }

            }, 
            data: $dormitory
        });
    }
    // ================================
}]);