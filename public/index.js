// Generated by CoffeeScript 1.9.2
(function() {
  angular.module('nbaAGC', ['ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap']).config([
    '$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(true);
      return $routeProvider.when('/', {
        templateUrl: 'views/home.html'
      }).when('/registerBar', {
        templateUrl: 'views/register.html',
        controller: 'BarController'
      }).when('/registerOthers', {
        templateUrl: 'views/others.html',
        controller: 'OthersController'
      }).when('/checkout', {
        templateUrl: 'views/checkout.html',
        controller: 'CheckoutController'
      }).when('/callback', {
        templateUrl: 'views/callback.html',
        controller: 'CallbackController'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]).factory('Api', [
    '$http', function($http) {
      var mService;
      mService = {
        url: '/api',
        getAmountDue: function(data) {
          return $http.post(this.url + "/amountDue", data).then(function(r) {
            return r.data;
          });
        }
      };
      return mService;
    }
  ]).factory('Session', [
    '$window', function($window) {
      var prefix;
      prefix = "___NBA_AGC___";
      return {
        get: function(key) {
          return $window.sessionStorage.getItem("" + prefix + key);
        },
        set: function(key, value) {
          return $window.sessionStorage.setItem("" + prefix + key, value);
        },
        clear: function(key) {
          return $window.sessionStorage.removeItem("" + prefix + key);
        }
      };
    }
  ]).controller('NavbarCtrl', [
    '$scope', '$location', function($scope, $location) {
      return $scope.showBack = function() {
        return $location.path() !== '/';
      };
    }
  ]).controller('BarController', [
    '$scope', '$alert', 'Session', '$location', function($scope, $alert, Session, $location) {
      var k, results;
      $scope.years = (function() {
        results = [];
        for (k = 2014; k >= 1960; k--){ results.push(k); }
        return results;
      }).apply(this);
      $scope.d = {};
      return $scope.checkout = function() {
        var ref;
        if ($scope.d.name_changed && !((ref = $scope.d.newname) != null ? ref.length : void 0)) {
          return $alert({
            title: 'Error!',
            content: 'Please enter your current name (after it was changed)',
            placement: 'top-right',
            type: 'danger',
            duration: 5
          });
        } else {
          Session.set("registrantData", JSON.stringify($scope.d));
          return $location.path('/checkout');
        }
      };
    }
  ]).controller('OthersController', ['$scope', function($scope) {}]).controller('CheckoutController', [
    '$scope', 'Api', 'Session', '$window', function($scope, Api, Session, $window) {
      $scope.data = JSON.parse(Session.get('registrantData'));
      Api.getAmountDue($scope.data).then(function(d) {
        return $scope.txn = d;
      });
      return $scope.callbackUrl = function() {
        return $window.location.origin + "/callback";
      };
    }
  ]);

  String.prototype.hexEncode = function() {
    var hex, i, k, ref, result;
    result = "";
    for (i = k = 0, ref = this.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      hex = this.charCodeAt(i).toString(16);
      result += ("000" + hex).slice(-4);
    }
    return result;
  };

  String.prototype.hexDecode = function() {
    var back, hexes, j, k, ref;
    hexes = this.match(/.{1,4}/g) || [];
    back = "";
    for (j = k = 0, ref = hexes.length - 1; 0 <= ref ? k <= ref : k >= ref; j = 0 <= ref ? ++k : --k) {
      back += String.fromCharCode(parseInt(hexes[j], 16));
    }
    return back;
  };

  Array.prototype.repeat = function(what, L) {
    while (L) {
      this[--L] = what;
    }
    return this;
  };

}).call(this);
