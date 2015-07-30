App.service('DormitoryService', ['$rootScope', '$q', '$http',  function($rootScope, $q, $http) {

  var url = "server/dormitory-list.json";
  var trans = {
    "GROUP_MALE" : "集体宿舍 - 男"
  };

  this.queryData = function(callback) {
    $http.get(url).success(callback.success).error(callback.error);
  }

  this.preprocessData = function(data) {
    angular.forEach(data, function(item) {
        // 生成详细地址，保留原来的信息
        item.dormitory.addressDetail = item.dormitory.campus + " - " + item.dormitory.address + " - " + item.dormitory.floor + " - " + item.dormitory.doorplate;
        // 生成类型信息，保留原来的信息
        item.dormitory.typeTrans = trans[item.dormitory.type];
    });
    return data;
  }
}]);
