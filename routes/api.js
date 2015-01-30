var express = require('express');
var router = express.Router();
var request = require('request');
var Favorite = require('../models/favorite');

router.get('/breweries', function(req, res) {
    var name = req.param('name');
    request('http://api.brewerydb.com/v2/breweries?name=*' + name + '*&key=97a8f227772df4da1b8335e2051da34f', function (error, response, body) {
        var json = JSON.parse(body);

        if (!json.data) {
            return res.send(400, 'No breweries found');
        }

        var breweries = [];

        for (var i = 0; i < json.data.length; i++) {
            breweries.push(json.data[i].name);
        }

        res.send(breweries);
    });
});

router.get('/beers', function(req, res) {
    var name = req.param('name');
    request('http://api.brewerydb.com/v2/breweries?name=' + name + '&key=97a8f227772df4da1b8335e2051da34f', function (error, response, body) {
        var json = JSON.parse(body);

        if (!json.data || json.data.length === 0) {
            return res.send(400, 'Invalid brewery');
        }

        var breweryId = json.data[0].id;

        request('http://api.brewerydb.com/v2/brewery/' + breweryId + '/beers?&key=97a8f227772df4da1b8335e2051da34f', function (error, response, body) {
            var beers = [];

            json = JSON.parse(body);

            if (json.data) {

              Favorite.find({ brewery: name}, function(err, favorites) {
                for (var i = 0; i < json.data.length; i++) {
                  beers.push({
                    name: json.data[i].name,
                    favorite: favorites.filter(function(fav) {
                        return fav.brewery == name && json.data[i].name == fav.beer;
                      }).length > 0
                  });
                }

                res.send(beers);
              });
            }
        });
    });
});

router.post('/favorites', function(req, res) {
    var brewery = req.param('brewery');
    var beer = req.param('beer');

    var fav = new Favorite({ brewery: brewery, beer: beer });
    fav.save(function(err) {
      if (err) { return res.error(err); }
      res.send();
    });
});

module.exports = router;
