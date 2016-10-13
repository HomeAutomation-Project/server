var app =angular.module("myApp");
var cplace;
var croom;
app.controller('myController', function($scope, $routeParams,$http,$location) {
    $scope.reg = false;
    var flag=false;
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
//                 alert("Welcome "+$scope.username+" to the Portal")
                 if (typeof(Storage) !== "undefined") {
                   localStorage.setItem("username", $scope.username);
                   localStorage.setItem("token", data.data.token);
                   $scope.getUserDetails();
                   $location.path('/dashboard');
                   flag=true;
                } else {
                    alert("Your Browser is not Supported!");
                }
            }

        },function(data,status,header){
                alert("Login Failure!");
        })
        }
    $scope.getUserDetails = function()
    {
      if(flag==true)
        {
          $location.path('/');
        }
        else
          {
      $http({
            method:'GET',
            url: '/api/user',
            headers:{'Content-Type':'application/json','x-access-token':localStorage.getItem('token')}
        }).then(function(data,status,header){
        localStorage.setItem('email',data.data.email);
        localStorage.setItem('admin',data.data.admin);
        localStorage.setItem('first',data.data.name.first);
        localStorage.setItem('last',data.data.name.last);

        console.log(localStorage.getItem('email'));
        console.log(localStorage.getItem('admin'));
        console.log(localStorage.getItem('first'));
        console.log(localStorage.getItem('last'));
        console.log(localStorage.getItem('token'));

        $scope.uname=data.data.username;
        $scope.mail=data.data.email;
        $scope.firstname=data.data.name.first;
        $scope.lastname=data.data.name.last;

      },function(data,status,header){
        console.log(data+status+header);
      });
          }
    }
     $scope.update = function()
     {

       $http({
             method:'PUT',
             url:'/api/user',
             data:{'username':$scope.username,'email':$scope.mail,'first':$scope.firstname,'last':$scope.lastname},
             headers:{'Content-Type':'application/json','x-access-token':localStorage.getItem('token')}
             }).then(function(data,status,header){
                 console.log(data);
             });
     }
     $scope.logout = function()
     {
       $http({
             url:'/#',
             }).then(function(){
             localStorage.removeItem("token");
             localStorage.removeItem("email");
             localStorage.removeItem("admin");
             localStorage.removeItem("first");
             localStorage.removeItem("last");
             $scope=null;
             console.log(localStorage.getItem('email'));
             console.log(localStorage.getItem('admin'));
             console.log(localStorage.getItem('first'));
             console.log(localStorage.getItem('last'));
             console.log(localStorage.getItem('token'));

       });
     }
})
    .controller('RoomCtrl', ['$scope', '$routeParams', '$http', function RoomCtrl($scope, $routeParams, $http) {
        var rm =  this;
        rm.name = 'RoomCtrl';
        rm.params = $routeParams;
        rm.getRoomDetails = function (myplace) {
            $http({
                method: 'GET',
                url: '/api/room/' + myplace,
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                $scope.rooms = data.data;
                cplace = myplace;
                console.log($scope.rooms);
            });
        }
        rm.deleteRoom = function (myroom) {
            $http({
                method: 'DELETE',
                url: '/api/room/'+cplace+'/'+myroom,
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert(myroom + " deleted");
                rm.getRoomDetails(cplace);
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }
        rm.addRoom = function (myroom) {
            $http({
                method: 'post',
                url: '/api/room/'+cplace,
                data: {'name': myroom},
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert(myroom + " added");
                rm.getRoomDetails(cplace);
                rm.newplace = "";
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }
        console.log(this.params);
        rm.getRoomDetails(this.params.placeName);
    }])



    .controller('SwitchCtrl', ['$scope', '$routeParams', '$http', function SwitchCtrl($scope, $routeParams, $http) {
        var sw =  this;
        sw.name = 'SwitchCtrl';
        sw.params = $routeParams;
        sw.getSwitchDetails = function (myroom) {
            $http({
                method: 'GET',
                url: '/api/switch/' + cplace +'/'+myroom,
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                $scope.switch = data.data;
                croom = myroom;
                console.log($scope.switch);
            });
        }
        sw.deleteSwitch = function (myswitch) {
            $http({
                method: 'DELETE',
                url: '/api/switch/'+cplace+'/'+croom+'/'+myswitch,
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert(myswitch + " deleted");
                sw.getSwitchDetails(croom);
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }
        sw.addSwitch = function () {
            $http({
                method: 'post',
                url: '/api/switch/'+cplace+'/'+croom,
                data: {'name': $scope.switchname,'PIR': $scope.pir,'status':$scope.status,'GPIO': $scope.gpio},
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert($scope.switchname + " added");
                sw.getSwitchDetails(croom);
                sw.newplace = "";
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }
        console.log(this.params);
        sw.getSwitchDetails(this.params.roomName);
    }])


    .controller('PlaceCtrl', ['$scope', '$routeParams', '$http', function RoomCtrl($scope, $routeParams, $http) {
        var pc = this;
        pc.name = 'PlaceCtrl';
        pc.params = $routeParams;
        pc.getPlaceDetails = function () {
            $http({
                method: 'GET',
                url: '/api/place',
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                $scope.places = data.data;
            });
        };
        pc.getPlaceDetails();
        pc.deletePlace = function (myplace) {

            $http({
                method: 'DELETE',
                url: '/api/place/' + myplace,
                data: {'name': myplace},
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert(myplace + " deleted");
                pc.getPlaceDetails();
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }

        pc.addPlace = function (myplace) {
            $http({
                method: 'post',
                url: '/api/place',
                data: {'name': myplace},
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert(myplace + " added");
                pc.getPlaceDetails();
                pc.newplace = "";
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }
    }])

;
