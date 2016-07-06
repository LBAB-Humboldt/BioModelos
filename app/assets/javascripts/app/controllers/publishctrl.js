angular.module('biomodelos')
    .controller('publishCtrl' , ['$scope', function($scope) {

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
    $scope.isActive = false;
    $scope.activeButton = function() {
    	$scope.isActive = !$scope.isActive;
    };

}]);