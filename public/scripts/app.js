'use strict';

/**
 * @ngdoc overview
 * @name perspecticoApp
 * @description
 * # perspecticoApp
 *
 * Main module of the application.
 */
angular
  .module('perspecticoApp', [
    'ngAnimate',
    'ngCookies',
    'ngRoute',
    'angular-md5',
    'countrySelect',
    'ngFileUpload',
    'ngAudio'
  ])

  .constant("requrl","http://localhost:1234")

  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      .when('/emailactivate', {
        templateUrl: 'views/emailactivate.html',
        controller: 'EmailactivateCtrl',
        controllerAs: 'emailactivate'
      })
      .when('/forgotpassword', {
        templateUrl: 'views/forgotpassword.html',
        controller: 'ForgotpasswordCtrl',
        controllerAs: 'forgotpassword'
      })
      .when('/admin', {
        templateUrl: 'views/userdashboard.html',
        controller: 'UserdashboardCtrl',
        controllerAs: 'userdashboard'
      })
      .when('/addmember', {
        templateUrl: 'views/opspanel.html',
        controller: 'OpspanelCtrl',
        controllerAs: 'opspanel'
      })
      .when('/library', {
        templateUrl: 'views/library.html',
        controller: 'LibraryCtrl',
        controllerAs: 'library'
      })
      .when('/members', {
        templateUrl: 'views/members.html',
        controller: 'OpspanelCtrl',
        controllerAs: 'opspanel'
      })
      .when('/modules', {
        templateUrl: 'views/modules.html',
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.hashPrefix('');
  });

