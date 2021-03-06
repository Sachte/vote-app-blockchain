'use strict';

// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import votingArtifacts from '../../build/contracts/Voting.json'

var Voting = contract(votingArtifacts)
console.log(Voting)
let candidates = { 'Rama': 'candidate-1', 'Nick': 'candidate-2', 'Jose': 'candidate-3' }


$(document).ready(function () {
  if (typeof web3 !== 'undefined') {
    console.warn('Using web3 detected from external source like Metamask')
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  Voting.setProvider(web3.currentProvider)
  let candidateNames = Object.keys(candidates)

})

var mongoose = require('mongoose'),
  Party = mongoose.model('Party');

  exports.get_parties = function(req, res) {
    try {
      
      Party.find({}, function(err, task) {
        if (err)
          res.send(err);
        res.json(task);
      });
    } catch (err) {
      console.log(err)
    }
  };

exports.create_a_party = function(req, res) {
  try {
    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
    Voting.deployed().then(function (contractInstance) {
      contractInstance.createParty(partyID, { gas: 140000, from: web3.eth.accounts[0] }).then(function () {
        var awesome_instance = new Party({partyID: 123, name1: 'name1', name2: 'name2', votes: 0 });
        awesome_instance.save(function (err) {
          if (err) return handleError(err);
          // saved!
        });
      })
    })
    
  } catch (err) {
    console.log(err)
  }
};


exports.read_a_task = function(req, res) {
  Party.findById(req.params.partyID, function(err, party) {
    if (err)
      res.send(err);
    res.json(party);
  });
};


exports.update_a_party = function(req, res) {
  Voting.deployed().then(function (contractInstance) {
    contractInstance.vote(partyID, { gas: 140000, from: web3.eth.accounts[0] }).then(function () {
      
    })
  })
};
