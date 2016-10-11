var app =angular.module("myApp");
var cuplace;
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
     $scope.addPlace = function()
     {
         $http({
         method:'post',
         url:'/api/place',
         data:{'name':$scope.newplace},
         headers:{'Content-Type':'application/json','x-access-token':localStorage.getItem('token')}
         }).then(function(data,status,header){
             alert($scope.newplace+" added");
             $scope.getPlaceDetails();
             $scope.newplace ="";
         },function (data, status, header) {
             alert(data.status+" Error: "+data.data.message);
         });
      }
      $scope.deletePlace = function (myplace) {

          $http({
              method: 'DELETE',
              url: '/api/place/'+myplace ,
              data:{'name':myplace},
              headers:{'Content-Type':'application/json','x-access-token':localStorage.getItem('token')}
              }).then(function (data,status,header) {
              alert(myplace+" deleted");
          },function (data, status, header) {
              alert(data.status+" Error: "+data.data.message);
          })
      }


})
    .controller('RoomCtrl', ['$scope', '$routeParams', '$http', function RoomCtrl($scope, $routeParams, $http) {
        this.name = 'RoomCtrl';
        this.params = $routeParams;
        this.getRoomDetails = function (myplace) {
            $http({
                method: 'GET',
                url: '/api/room/' + myplace,
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                $scope.rooms = data.data;
                cuplace = myplace;
                console.log($scope.rooms);
            });
        }
        console.log(this.params);
        this.getRoomDetails(this.params.placeName);
        $scope.deleteRoom = function (myplace) {
            $http({
                method: 'DELETE',
                url: '/api/room/'+cuplace+'/'+myplace,
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data,status,header) {
                alert(myplace+"is deleted");
            },function (data, status, header) {
                alert(data.status+" Error: "+data.data.message);
            })
        }

    }])

    .controller('PlaceCtrl', ['$scope', '$routeParams', '$http', function RoomCtrl($scope, $routeParams, $http) {
        this.name = 'PlaceCtrl';
        this.params = $routeParams;
        this.getPlaceDetails = function () {
            $http({
                method: 'GET',
                url: '/api/place',
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                $scope.places = data.data;
            });
        };
        this.getPlaceDetails();
    }])

;
