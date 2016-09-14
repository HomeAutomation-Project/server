
var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "login.html"
    })
    .when("/main", {
        templateUrl : "main.html"
    })
    .when("/home", {
        templateUrl : "home.html"
    })
    .when("/room", {
        templateUrl : "room.html"
    });
});
