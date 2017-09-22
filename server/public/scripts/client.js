var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider, $mdThemingProvider, $mdGestureProvider) {
  $mdGestureProvider.skipClickHijack();
  $locationProvider.hashPrefix('');
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('amber')
    .warnPalette('red');
  // console.log('myApp -- config')
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/add-client', {
      templateUrl: '/views/templates/add-client.html',
      controller: 'AddClientController as acc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/add-event/:id', {
      templateUrl: '/views/templates/add-event.html',
      controller: 'AddEventController as aec',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/edit-event/:id', {
      templateUrl: '/views/templates/edit-event.html',
      controller: 'EditEventController as eec',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/manage-client/:id', {
      templateUrl: '/views/templates/manage-client.html',
      controller: 'ManageClientController as mcc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/client-list', {
      templateUrl: '/views/templates/client-list.html',
      controller: 'ClientListController as clc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/schedule/:id', {
      templateUrl: '/views/templates/schedule.html',
      controller: 'ScheduleController as sc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .otherwise({
      redirectTo: 'home'
    });    
});
