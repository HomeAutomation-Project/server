var app =angular.module("myApp");

app.controller('myController', function($scope, $routeParams,$http,$location) {
    $scope.reg = false;
    $scope.setTab=function(x)
    {
      $scope.reg=x;
    }
    $scope.SendData = function () {
        
        $http({
            method:'POST',
            url: '/api/authenticate',
            data :{'username':$scope.username, 'password':$scope.password},
            headers:{'Content-Type':'application/json'}
        }).then(function(data,status,header){
            console.log("Sucess Data"+JSON.stringify(data)+" Status"+JSON.stringify(status)+" header"+header);
            if(data.data.success)
            {
                alert("Welcome"+$scope.username+" to the Portal")
                $location.path() === '/dashboard'
            }
            
        },function(data,status,header){
                alert("Login Failure!");
        })
        }
    
 });
