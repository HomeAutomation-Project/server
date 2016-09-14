var app =angular.module("myApp");

app.controller('myController', function($scope, $routeParams) {
    $scope.reg = false;
    $scope.setTab=function(x)
    {
      $scope.reg=x;
    }
 });