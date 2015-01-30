var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/brewster');

module.exports = mongoose.model('Favorite', { brewery: String, beer: String });
