var foundationRoutes = [
{"name":"settings","url":"/settings-this-is-cool","animationIn":"slideFromLeft","animationOut":"slideFromLeft","path":"templates/settings.html"},
{"name":"home","url":"/","path":"templates/home.html"}]

/**********************************routes for loading template************************************************/
app.config(function($routeProvider) {
       $routeProvider
     .when("/unauthenticate", {
    templateUrl : "login.html"
  })
  .when("/loadmain", {
    templateUrl : "main.html"
  })
  .when("/loadhome", {
    templateUrl : "home.html"
  })
  .when("/loadrooms", {
    templateUrl : "rooms.html"
  });    
});