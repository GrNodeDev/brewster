angular.module('myApp', ['ngRoute', 'ngResource'])

  .factory('Breweries', ['$resource', function($resource) {
    return $resource('/api/breweries?name=:name', null, {});
  }])

  .factory('Beers', ['$resource', function($resource) {
    return $resource('/api/beers?name=:name', null, {});
  }])

  .factory('Favorites', ['$resource', function($resource) {
    return $resource('/api/favorites', null, {});
  }])

  .controller('mainCtrl', ['$scope', 'Breweries', 'Beers', 'Favorites', function($scope, Breweries, Beers, Favorites) {
    $scope.breweries = [];
    $scope.beers = [];
    $scope.brewery = null;

    $scope.search = function() {
      $scope.breweries = Breweries.query({name: $scope.breweryName});
    };

    $scope.showBeers = function(brewery) {
      $scope.beers = Beers.query({name: brewery});

      $scope.brewery = brewery;
    };

    $scope.favorite = function(beer) {

      beer.favorite = true;

      Favorites.save({ brewery: $scope.brewery, beer: beer.name }, function () {
        var beer2 = $scope.beers.filter(function(x) {
          return x.name === beer.name;
         });

         console.log(beer2);
      });
    };
  }]);
