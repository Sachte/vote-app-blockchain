'use strict';
module.exports = function(app) {
  var todoList = require('../controllers/todoListController');

  // todoList Routes
  app.route('/party')
  .get(todoList.get_parties); //returns list of all parties

  app.route('/party/:json')
    .post(todoList.create_a_party); // creates party. Json format {name1:, name2:}

  app.route('/vote/:partyID')
    .get(todoList.read_a_party) //get votes of partyID
    .put(todoList.update_a_party) // vote for a party
};
