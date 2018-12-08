'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PartyScheme = new Schema({
  name1: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  name2: {
    type: String
  },
  votes: {
    type: Integer,
    default: 0
  }
});

module.exports = mongoose.model('Party', PartyScheme);
