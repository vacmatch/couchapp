(function () {
  'use strict';

  angular.module('app.home')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope', '$http'];
  
  function HomeCtrl($scope, $http) {

    $scope.matches = {};

    $http.get('http://localhost:5984/vacmatch/_design/simple/_view/matches_summary?group=true&group_level=3').success(function(data) {

      function create_dict (d, keys) {
        if(keys.length) {
          if(!d.hasOwnProperty(keys[0])) {
            d[keys[0]] = {};
          }
          create_dict (d[keys[0]], keys.slice(1));
        }
      }

      function set_deep (d, keys, val) {
        if (keys.length > 1) {
          set_deep (d[keys[0]], keys.slice(1), val);
        } else {
          d[keys[0]] = val;
        }
      }

      $scope.matches = [];
      var matches = {};

      for(var i = 0; i < data.rows.length; i++) {
        var key = data.rows[i].key;
        var val = data.rows[i].value;

        create_dict(matches, key);
        set_deep(matches, key, val);

      }

      $scope.matches = matches;

    });

    $scope.orderProp = 'created';

  }
}());
