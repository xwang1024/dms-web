App.controller('DormitoryController', [
    '$scope', '$http', '$state','$filter','ngTableParams','$resource', '$timeout', 'ngTableDataService', 'ngDialog', 'ShareService',
    function($scope, $http, $state, $filter, ngTableParams, $resource, $timeout, ngTableDataService, ngDialog, ShareService) {

    'use strict';
    var vm = this;
    var data = [{id: 1, name: "Moroni", age: 50, money: -10},
                {id: 2, name: "Tiancum", age: 43,money: 120},
                {id: 3, name: "Jacob", age: 27, money: 5.5},
                {id: 4, name: "Nephi", age: 29,money: -54},
                {id: 5, name: "Enos", age: 34,money: 110},
                {id: 6, name: "Tiancum", age: 43, money: 1000},
                {id: 7, name: "Jacob", age: 27,money: -201},
                {id: 8, name: "Nephi", age: 29, money: 100},
                {id: 9, name: "Enos", age: 34, money: -52.5},
                {id: 10, name: "Tiancum", age: 43, money: 52.1},
                {id: 11, name: "Jacob", age: 27, money: 110},
                {id: 12, name: "Nephi", age: 29, money: -55},
                {id: 13, name: "Enos", age: 34, money: 551},
                {id: 14, name: "Tiancum", age: 43, money: -1410},
                {id: 15, name: "Jacob", age: 27, money: 410},
                {id: 16, name: "Nephi", age: 29, money: 100},
                {id: 17, name: "Enos", age: 34, money: -100}];

    vm.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            // 执行搜索
            var searchedData = searchData();

            var orderedData = params.sorting() ? $filter('orderBy')(searchedData, params.orderBy()) : searchedData;
            orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve($scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.$watch("searchDormitory", function () {
        vm.tableParams.reload();
    });

    var searchData = function(){
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

    var inArray = Array.prototype.indexOf ?
    function (val, arr) {
        return arr.indexOf(val)
    } :
    function (val, arr) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === val) return i;
        }
        return -1
    };
    $scope.names = function(column) {
        var def = $q.defer(),
        arr = [],
        names = [];
        angular.forEach(data, function(item){
            if (inArray(item.name, arr) === -1) {
                arr.push(item.name);
                names.push({
                    'id': item.name,
                    'title': item.name
                });
            }
        });
        def.resolve(names);
        return def;
    };

    $scope.checkboxes = { 'checked': false, items: {} };

    // 监视总checkbox
    $scope.$watch('checkboxes.checked', function(value) {
        angular.forEach($scope.users, function(item) {
            if (angular.isDefined(item.id)) {
                $scope.checkboxes.items[item.id] = value;
            }
        });
    });

    // 监视子checkbox
    $scope.$watch('checkboxes.items', function(values) {
        if (!$scope.users) {
            return;
        }
        var checked = 0, unchecked = 0,
        total = $scope.users.length;
        angular.forEach($scope.users, function(item) {
            checked   +=  ($scope.checkboxes.items[item.id]) || 0;
            unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        // grayed checkbox
        angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);

    // 每一行的修改按钮
    $scope.modify = function($user) {
        ShareService.setData(angular.copy($user));
        ngDialog.open({ template: 'modifyDialog', controller: 'DormitoryModifyController', data: {user: $user} });
    }
}]);

App.controller('DormitoryModifyController', [
  "$scope", "ngDialog", "ShareService",
  function ($scope, ngDialog, ShareService) {
  'user strict';
  $scope.modifiyingUser = ShareService.getData();
  $scope.submitModify = function () {
    console.log($scope.modifiyingUser);
  };
  $scope.cancel = function() {
    ngDialog.close();
  }
}]);