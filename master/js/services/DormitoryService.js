App.service('DormitoryService', ['$rootScope', '$q', '$http',  function($rootScope, $q, $http) {

  var url = "server/dormitory-list.json";
  var preprocessDataMap = {
    "GROUP_MALE" : "集体宿舍 - 男",
    "MALE" : "男"
  };
  var postprocessDataMap = {
    "集体宿舍 - 男" : "GROUP_MALE",
    "男" : "MALE" 
  };

  this.queryData = function(callback) {
    $http.get(url).success(callback.success).error(callback.error);
  }

  this.preprocessData = function(data) {
    angular.forEach(data, function(item) {
      // 生成详细地址，保留原来的信息
      item.dormitory.addressDetail = item.dormitory.campus + " - " + item.dormitory.address + " - " + item.dormitory.floor + " - " + item.dormitory.doorplate;
      // 生成类型信息，保留原来的信息
      item.dormitory.type = preprocessDataMap[item.dormitory.type];
      angular.forEach(item.employees, function(employee) {
        employee.gender = preprocessDataMap[employee.gender];
      });
    });
    return data;
  }
}]);
