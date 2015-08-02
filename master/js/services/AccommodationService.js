App.service('AccommodationService', ['$rootScope', '$q', '$http', function($rootScope, $q, $http) {
	var url = "server/accommodation-list.json";
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
	this.queryFullList = function(callback) {
		 $http.get(url).success(callback.success).error(callback.error);
	}

	this.preprocessData = function(data) {
        angular.forEach(data, function(item) {
            // 生成详细地址，保留原来的信息
            item.dormitory.addressDetailCN = item.dormitory.campus + " - " + item.dormitory.address + " - " + item.dormitory.floor + " - " + item.dormitory.doorplate;
            // 生成类型信息，保留原来的信息
            item.dormitory.typeCN = preprocessDataMap[item.dormitory.type];

            angular.forEach(item.accommodations, function(accommodation) {
                var employee = accommodation.employee;
                employee.genderCN = preprocessDataMap[employee.gender];
                employee.spouseTypeCN = preprocessDataMap[employee.spouseType];
                employee.outsideSpouse.genderCN = preprocessDataMap[employee.outsideSpouse.gender];
            });
            if(item.dormitory.type == "COUPLE") {
                if(item.accommodations[0].employee.spouseType == "INNER") {
                    console.log(item);
                    item.accommodations[0].employee.innerSpouse = item.accommodations[1].employee;
                    item.accommodations[1].employee.innerSpouse = item.accommodations[0].employee;
                }
            }
            item.statusCN = item.accommodations[0].checkOutDate ? "已迁出" : "在住";
        });
        return data;
    }

    this.postprocessData = function(data) {
        
        return data;
    }
}]);