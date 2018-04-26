'use strict';
module.exports = function(app) {
  var imageSearch = require('../controllers/imageSearchController');

  // todoList Routes
  app.route('/imageSearch')
    .get(imageSearch.get_related_products);
}