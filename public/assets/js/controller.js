var app = angular.module("myApp", ["ngRoute", "ngMobile"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/dashboard", {
            templateUrl: "dashboard.html",
            controller: 'myController'
        })

        .when("/users", {
            templateUrl: "user.html",
            controller: 'myController'

        })
        .when("/homes", {
            templateUrl: "home.html",
            controller: 'PlaceCtrl',
            controllerAs: 'pc'
        })
        .when("/schedule", {
            templateUrl: "schedule.html",
            controller: 'myController'
        })
        .when("/notification", {
            templateUrl: "notifications.html",
            controller: 'myController'
        })
        .when("/room/:placeName", {
            templateUrl: "rooms.html",
            controller: 'RoomCtrl',
            controllerAs: 'rm'
        })
        .when("/room/:placeName/:roomName", {
            templateUrl: "switches.html",
            controller: 'SwitchCtrl',
            controllerAs: 'sw'
        })
        .when("/schedule", {
            templateUrl: "schedule.html",
            controller: 'ScheduleCtrl',
            controllerAs: 'sch'
        })
        .otherwise({
            templateUrl: "login.html",
            controller: 'myController'

        });
});
app.run(
    function ($rootScope, $location) {
        isAuthed = function () {
            var token = localStorage['token'];
            if (token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                var params = JSON.parse(atob(base64));
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        }
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if (isAuthed() && ($location.url() == "" || $location.url() == "/")) {
                $location.path("/dashboard");
            }
            else if (isAuthed()) {
                //do nothing
            }
            else {
                $location.path("/");
            }
        });

    }
);
var app =angular.module("myApp");
var cplace;
var croom;
app.controller('myController', function($scope, $routeParams,$http,$location) {
    $scope.reg = false;
    $scope.active = 1;
    var flag=false;
    $scope.isActive = function (x) {
        if (x == localStorage.getItem("active")) {
            return true;
        }
        else {
            return false;
        }
    };
    $scope.changeActive = function (x) {
        localStorage.setItem("active", x);
    }
    $scope.setTab=function(x)
    {
      $scope.reg=x;
    }
    $scope.register = function () {
        console.log("uname"+$scope.username+"password"+$scope.password);
        $http({
            method: 'post',
            url: '/api/register/',
            data: {'username': $scope.username,'password':$scope.password,'first':$scope.first,'last':$scope.last,'email':$scope.email},
            headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
        }).then(function (data, status, header) {
            alert($scope.username + " added");
            $location.path('/');
        }, function (data, status, header) {
            alert(data.status + " Error: " + data.data.message);
        });
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
                     window.location.reload();
                     localStorage.setItem("active", 1);
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
           $location.path("/")
       });
     };
    $scope.isAuthed = function () {
        var token = localStorage['token'];
        if (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            var params = JSON.parse(atob(base64));
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        } else {
            return false;
        }
    }
    $scope.getUserDetails();
})
    .controller('RoomCtrl', ['$scope', '$routeParams', '$http', function RoomCtrl($scope, $routeParams, $http) {
        var rm =  this;
        var apikey="";
        rm.name = 'RoomCtrl';
        rm.params = $routeParams;
        rm.setPir = function (x) {
            $scope.pir = x;
        }
        rm.getRoomKey = function (id) {
            rm.apikey=id;

        }
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
            var are_you_sure = confirm("Are you sure you want to delete "+ myroom+" ?");
            if(are_you_sure)
            {
                $http({
                method: 'DELETE',
                url: '/api/room/'+this.params.placeName+'/'+myroom,
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert(myroom + " deleted");
                rm.getRoomDetails(cplace);
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
            }
        }
        rm.addRoom = function () {
            console.log($scope.pir);
            $http({
                method: 'post',
                url: '/api/room/'+this.params.placeName,
                data: {'name': $scope.newroom,'PIR':$scope.pir},
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert($scope.newroom + " added");
                rm.getRoomDetails(cplace);
                rm.newplace = "";
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }
        rm.getRoom = function (room) {
            $scope.roomToBeEdited = room;
        }
        rm.editRoom = function (newroom) {
            $http({
                method: 'PUT',
                url: '/api/room/'+this.params.placeName+'/'+$scope.roomToBeEdited,
                data: {'name': newroom},
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert(newroom + "is updated");
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }
        console.log(this.params);
        rm.getRoomDetails(this.params.placeName);
    }])


    .controller('SwitchCtrl', ['$scope', '$routeParams', '$http', '$location', function SwitchCtrl($scope, $routeParams, $http, $location) {
        var sw =  this;
        sw.name = 'SwitchCtrl';
        sw.params = $routeParams;
        sw.isNotFree = function (x) {
            if (sw.room) {
                if (sw.room[x]) {
                    return false;
                }
                return true;
            }
            else {
                //do nothing!
            }
        }
        sw.setGpio = function (x) {
            $scope.gpio = x;
        }
        sw.isPIR = function (status) {
            if (status === 'PIR') {
                return true;
            }
            else {
                return false;
            }
        }
        sw.getSwitchDetails = function (myroom) {
            var currLocation = $location.path();
            var oldData;
            var t = setInterval(function () {
                if (currLocation != $location.path()) {
                    console.log("Path Changed");
                    clearTimeout(t);
                }
                else {
                    $http({
                        method: 'GET',
                        url: '/api/switch/' + sw.params.placeName + '/' + (myroom || sw.params.roomName),
                        headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
                    }).then(function (data, status, header) {
                        if (_.isEqual(data.data, oldData)) {
                            console.log("Same Data");
                        }
                        else {
                            oldData = JSON.parse(JSON.stringify(data.data));
                            $scope.switch = data.data;
                            console.log($scope.switch);
                        }
                    });
                }
            }, 1500)
        }
        sw.deleteSwitch = function (myswitch) {
            if (confirm("Are you sure you want to delete " + myswitch)) {
                $http({
                    method: 'DELETE',
                    url: '/api/switch/' + sw.params.placeName + '/' + sw.params.roomName + '/' + myswitch,
                    headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
                }).then(function (data, status, header) {
                    alert(myswitch + " deleted");
                    sw.getSwitchDetails(sw.params.roomName);
                    sw.getRoomDetails(this.params.roomName);
                }, function (data, status, header) {
                    alert(data.status + " Error: " + data.data.message);
                });
            }
        }
        sw.addSwitch = function () {
            $http({
                method: 'post',
                url: '/api/switch/' + this.params.placeName + '/' + this.params.roomName,
                data: {'name': $scope.switchname,'status':$scope.status,'GPIO': $scope.gpio},
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert($scope.switchname + " added");
                sw.getSwitchDetails(sw.params.roomName);
                sw.newplace = "";
                sw.sform.setPristine();
                sw.getRoomDetails(sw.params.roomName);
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        };
        sw.operateSwitch = function (myswitch , togglestatus) {
            if(togglestatus == true)
            {
                $http({
                    method: 'GET',
                    url: '/api/switch/'+this.params.placeName+'/'+this.params.roomName+'/'+myswitch+'/ON',
                    headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
                }).then(function (data,status,header) {
                    demo.showNotification('top','center','ON', myswitch);
                })
            }
            else
            {
                $http({
                    method: 'GET',
                    url: '/api/switch/'+this.params.placeName+'/'+this.params.roomName+'/'+myswitch+'/OFF',
                    headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
                }).then(function (data,status,header) {
                    demo.showNotification('top','center','OFF', myswitch);
                })
            }
        }
        sw.getStatus = function (mystatus) {
            if(mystatus == 'OFF')
            {
                return false;
            }
            else
                return true;
        }
        sw.getSwitch = function (swit) {
            $scope.switchToBeEdited =swit;
        }
        sw.editSwitch = function (newswitch) {
            $http({
                method: 'PUT',
                url: '/api/switch/'+this.params.placeName+'/'+this.params.roomName+'/'+$scope.switchToBeEdited,
                data: {'name': newswitch},
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert(newswitch + "is updated");
                sw.getRoomDetails(this.params.roomName);
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }
        sw.getRoomDetails = function (myplace) {
            $http({
                method: 'GET',
                url: '/api/room/' + this.params.placeName + '/' + myplace,
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                sw.room = data.data.GPIOs;
                console.log($scope.room);
            });
        };
        sw.setStatus = function (x) {
            $scope.status = x;
        };
        console.log(this.params);
        sw.getRoomDetails(this.params.roomName);
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
            var are_you_sure= confirm("Are you Sure you want to delete "+myplace+" ?");
            if(are_you_sure)
            {
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
        pc.getPlace = function (place) {
            $scope.placeToBeEdited = place;
        }
        pc.editPlace = function (neplace) {
            $http({
                method: 'PUT',
                url: '/api/place/' + $scope.placeToBeEdited,
                data: {'name': neplace},
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert(neplace + "is updated");
                pc.getPlaceDetails();
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }
    }])
    .controller('ScheduleCtrl', ['$scope', '$routeParams', '$http', '$location', function RoomCtrl($scope, $routeParams, $http, $location) {
    var sch = this;
    var cplace;
        sch.selectSch = function (x) {
            console.log();
            sch.schToBeEdited = $scope.task[x].name;
            sch.newName = sch.schToBeEdited;
            sch.newTimeDate = $scope.task[x].taskTimeDate;
            sch.newStatus = $scope.task[x].status;
        }
        sch.editSch = function () {
            console.log(sch.schToBeEdited + " : " + sch.newName + " : " + sch.newTimeDate + " : " + sch.newStatus);
            $http({
                method: 'PUT',
                url: '/api/task/'+sch.schToBeEdited,
                data: {'name':sch.newName,'status':sch.newStatus,'taskTimeDate':sch.newTimeDate},
                headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
            }).then(function (data, status, header) {
                alert(sch.newName + " Changed");
                sch.getTask();
            }, function (data, status, header) {
                alert(data.status + " Error: " + data.data.message);
            });
        }
    sch.name = 'ScheduleCtrl';
    sch.params = $routeParams;
    sch.getPlaceList = function () {
        $http({
            method: 'GET',
            url: '/api/place',
            headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
        }).then(function (data, status, header) {
            $scope.places = data.data;
        });
    }
    sch.getRoomList = function (myplace) {
        $http({
            method: 'GET',
            url: '/api/room/' + myplace,
            headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
        }).then(function (data, status, header) {
            $scope.rooms = data.data;
            cplace=myplace;
            console.log($scope.rooms);
        });
    }
    sch.getSwitchList = function (myroom) {
        $http({
            method: 'GET',
            url: '/api/switch/' + cplace + '/' + (myroom || sw.params.roomName),
            headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
        }).then(function (data, status, header) {
            $scope.switch = data.data;
            console.log($scope.switch);
        });
    }
    sch.addTask = function () {
        $http({
            method: 'post',
            url: '/api/task',
            data: {
                'name': $scope.taskname,
                'switch': $scope.switch,
                'status': $scope.status,
                'taskTimeDate': $scope.timedate,
                'Repeat': $scope.Repeat,
                'repeat': $scope.repeat
            },
            headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
        }).then(function (data, status, header) {
            alert($scope.taskname + " added");
            sch.getTask();
        }, function (data, status, header) {
            alert(data.status + " Error: " + data.data.message);
        });
    }
    sch.getTask = function () {
        var oldData;
        var currLocation = $location.path();
        var t = setInterval(function () {
            if (currLocation != $location.path()) {
                console.log("Path Changed");
                clearInterval(t);
            }
            else {
                $http({
                    method: 'GET',
                    url: '/api/task',
                    headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
                }).then(function (data, status, header) {
                    if (_.isEqual(oldData, data.data)) {
                        console.log("Same Task");
                    }
                    else {
                        oldData = JSON.parse(JSON.stringify(data.data));
                        $scope.task = data.data;
                        for (let i = 0; i < $scope.task.length; i++) {
                            $scope.task[i].taskTimeDate = new Date($scope.task[i].taskTimeDate);
                        }
                        console.log($scope.task);
                    }
                });
            }
        }, 1500);
        }
        sch.setPlace = function (x) {
            $scope.place = x;
        }
        sch.setRoom = function (x) {
            $scope.room = x;
        }
        sch.setSwitch = function (x, y) {
            $scope.switch = x;
            $scope.switch1 = y;
        }
        sch.setStatus = function (x) {
            $scope.status = x;
        };
        sch.setStatus1 = function (x) {
            sch.newStatus = x;
        }
        sch.setRepeat = function (x) {
            $scope.Repeat = x;
        };
        sch.delTask = function (x) {
            var are_you_sure = confirm("Are you sure you want to delete "+ x+" ?");
            if (x && are_you_sure) {
                $http({
                    method: 'DELETE',
                    url: '/api/task/' + x,
                    headers: {'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('token')}
                }).then(function (data, status, header) {
                    console.log(data);
                    sch.getTask();
                });
            }
        }
        sch.getCompleted= function(comp)
        {
            if(comp)
                return "<i class='fa fa-check' aria-hidden='true'></i>";
            else
                return "<i class='fa fa-times' aria-hidden='true'></i>";
        }
        sch.getTask();
    }]);