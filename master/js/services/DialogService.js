App.service('DialogService', ['$rootScope', '$q', '$http', 'ngDialog', 'DormitoryApplicationService','ShareService',
	function($rootScope, $q, $http, ngDialog, DormitoryApplicationService, ShareService) {

		// 员工详细信息展示
		this.openShowEmployeeDialog = function(employee) {
			ShareService.setData(angular.copy(employee));
			ngDialog.open({
	            template: 'app/views/dialogs/show-employee.html',
	            controller: function ($scope, ngDialog, ShareService) {
	                $scope.employee = ShareService.getData();

	                // ===== 对话框操作 ===== 
	                $scope.checkOut = function() {
	                    console.log("Check Out", $scope.employee);
	                    // TODO 发送迁出消息
	                }
	                $scope.cancel = function() {
	                    ngDialog.close();
	                }
	                // ====================== 
	            }
	        });
		};

		// 员工详细信息修改
		this.openModifyEmployeeDialog = function(employee) {
			// TODO
		};

		// 迁入对话框
		this.openCheckInDialog = function(dormitory) {
			ShareService.setData(angular.copy(dormitory));
			ngDialog.open({
	            template: 'app/views/dialogs/check-in.html',
	            controller: function ($scope, ngDialog, ShareService) {
	                $scope.dormitory = ShareService.getData();
	                $scope.selectedApplication = null;
	                $scope.loading = false;
	                $scope.applications = [];

	                // 读取入住申请列表
	                $scope.loading = true;
	                DormitoryApplicationService.queryApplicationList({
	                	success: function(response) {
	                		$scope.loading = false;
	                		if(response.status) {
	                			$scope.applications = response.result;
	                		} else {
	                			alert("列表获取失败");
	                		}
	                	},
	                	error: function() {
	                		$scope.loading = false;
	                		alert("网络出现异常");
	                	}
	                });
	                // ===== 对话框操作 ===== 
	                $scope.updateSelectionStatus = function(value) {
	                    $scope.selectedApplication = value;
	                }
	                $scope.checkIn = function() {
	                	console.log("Check In", $scope.dormitory, $scope.selectedApplication);
	                    // TODO 检查输入，发送迁入消息
	                }
	                $scope.cancel = function() {
	                    ngDialog.close();
	                }
	                // ====================== 
	            }
	        });
		};

		// 迁出确认对话框
		this.openCheckOutConfirmDialog = function(accommodationItem) {
			ShareService.setData(angular.copy(accommodationItem));
			ngDialog.open({
	            template: 'app/views/dialogs/check-out-confirm.html',
	            controller: function ($scope, ngDialog, ShareService) {
	                $scope.accommodationItem = ShareService.getData();
	                console.log($scope.accommodationItem);
	                // ===== 对话框操作 ===== 
	                $scope.submitCheckOut = function () {
	                    $scope.submitted = true;
	                    // TODO 提交迁出操作
	                };

	                $scope.cancel = function() {
	                    ngDialog.close();
	                }
	                // ====================== 
	            }
	        });
		};

		// 修改宿舍对话框
		this.openModifyDormitoryDialog = function(dormitory) {
			ShareService.setData(angular.copy(dormitory));
			ngDialog.open({
	            template: 'app/views/dialogs/edit-dormitory.html',
	            controller: function ($scope, ngDialog, ShareService) {
	                $scope.dormitory = ShareService.getData();
	                $scope.dormitoryTypes = ["集体宿舍 - 男", "集体宿舍 - 女", "夫妻房"];
	                // ===== 对话框操作 ===== 
	                $scope.submitModify = function () {
	                    $scope.submitted = true;
	                    if ($scope.modifyDormitoryForm.$valid) {
	                        // TODO 提交修改
	                    } else {
	                        return false;
	                    }
	                };

	                $scope.cancel = function() {
	                    ngDialog.close();
	                }
	                // ====================== 
	            }
	        });
		}
	}
]);