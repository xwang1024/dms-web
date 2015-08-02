App.service('DormitoryApplicationService', ['$rootScope', '$q', '$http', function($rootScope, $q, $http) {
	var url = "server/dormitory-application-list.json";
    var preprocessDataMap = {
        "GROUP_MALE" : "集体宿舍 - 男",
        "GROUP_FEMALE" : "集体宿舍 - 女",
        "COUPLE" : "夫妻房",
        "MALE" : "男",
        "FEMALE" : "女",
        "UNKNOWN" : "其他",
        "MALE" : "男",
        "NONE" : "没有登记配偶",
        "INNER" : "集团员工",
        "OUTER" : "非集团员工"
    };
    var postprocessDataMap = {
        "集体宿舍 - 男" : "GROUP_MALE",
        "集体宿舍 - 女" : "GROUP_FEMALE",
        "夫妻房" : "COUPLE",
        "男" : "MALE",
        "女" : "FEMALE",
        "其他" : "UNKNOWN",
        "没有登记配偶" : "NONE",
        "集团员工" : "INNER",
        "非集团员工" : "OUTER"
    };
	this.queryApplicationList = function(callback) {
		 $http.get(url).success(callback.success).error(callback.error);
	}

	this.preprocessData = function(data) {
        return data;
    }

    this.postprocessData = function(data) {
        
        return data;
    }
}]);