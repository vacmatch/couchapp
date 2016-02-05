(function () {
  'use strict';

  angular.module('app.home')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope', '$http', 'pouchDB'];
  function HomeCtrl($scope, $http, pouchDB) {
    var db = pouchDB('http://admin:secret@localhost:5984/vacmatch', { skip_setup: true });

    $scope.poller = null;
    $scope.matches = {};

    function create_dict (d, keys) {
      if(keys.length) {
        if(!d.hasOwnProperty(keys[0])) {
          d[keys[0]] = {};
        }
        create_dict (d[keys[0]], keys.slice(1));
      }
    }

    function get_deep (d, keys, default_val) {
      if (keys.length > 0) {
        if (d.hasOwnProperty(keys[0])) {
          return get_deep (d[keys[0]], keys.slice(1), default_val);
        } else {
          return default_val;
        }
      } 
      return d || default_val;
    }

    function set_deep (d, keys, val) {
      if (keys.length > 1) {
        set_deep (d[keys[0]], keys.slice(1), val);
      } else {
        d[keys[0]] = val;
      }
    }


    var onInitialMatches = function (data) {

      $scope.matches = [];
      var matches = {};

      for(var i = 0; i < data.rows.length; i++) {
        var key = data.rows[i].key;
        var val = data.rows[i].value;

        create_dict(matches, key);
        set_deep(matches, key, val);

      }

      $scope.matches = matches;

    };

    // We'll use a PouchDB instance, which is just sugar for the comments
    // var db = pouchDB('http://admin:secret@localhost:5984/vacmatch');

    // SAME AS:
    // $http.get('http://localhost:5984/vacmatch/_design/simple/_view/matches_summary?group=true&group_level=3').success(onInitialMatches);


    db.query('simple/matches_summary', {
      group: true,
      group_level: 3,
      reduce: true
    }).then(onInitialMatches);

    // Now we'll listen to changes
    $scope.changes = db.changes({
      live: true,
      since: 'now',
      include_docs: true,
      filter: 'simple/events',
      return_docs: false,
      batch_size: 10,
      query_params: {'query': 'goal,foul'}
    });

    var onEventsChange = function(info) {
      var key = [info.doc.match, info.doc.team, info.doc.eventType];
      create_dict($scope.matches, key);
      var prev = get_deep($scope.matches, key, 0);

      if(info.deleted) {
        // Something deleted? But does not know if it was a related event
        db.query('simple/matches_summary', {
          group: true,
          group_level: 3,
          reduce: true
        }).then(onInitialMatches);
      } else if(info.changes[0].rev.startsWith('1-')) {
        $scope.$apply(function () {
          set_deep($scope.matches, key, prev + 1);
        });
      } else {
        console.log('Err: change unidentified', info);
      }
    };

    $scope.changes.on('change', onEventsChange);
    $scope.changes.on('error', function (err) { console.log('PouchDB changes error:', err); });

      //var changesRsrc = $resource('http://localhost:5984/vacmatch/_changes?filter=simple/events&query=goal,foul');


    $scope.orderProp = 'created';

  }
}());
