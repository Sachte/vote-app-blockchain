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
var url;
var MongoClient;
var Voting = contract(votingArtifacts)
console.log(Voting)
let candidates = { 'Rama': 'candidate-1', 'Nick': 'candidate-2', 'Jose': 'candidate-3' }

var http = require('http');

//create a server object:
http.createServer(function (req, res) {
  var obj = JSON.parse(req);
  if(obj.type=='createParty')
  {
    window.createParty(obj.candidates);
  }
  if(obj.type=='vote')
  {
    window.vote(obj.partyID);
  }
  if(obj.type=='getParty')
  {
    var result = window.getParty(obj.partyID);
    res.write(JSON.stringify(result));
  }
  if(obj.type=='getVotes')
  {
    var result = window.getVotes(obj.partyID);
    res.write(JSON.stringify(result));
  }
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080


window.getVotes(partyID)
{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var query = { _id: partyID};
    dbo.collection("parties").find(query).toArray(function(err, result) {
      if (err) throw err;
      return result.votes;
      db.close();
    });
  });
}
window.getParty(partyID)
{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var query = { _id: partyID};
    dbo.collection("parties").find(query).toArray(function(err, result) {
      if (err) throw err;
      return result.candidates;
      db.close();
    });
  });
}
window.createParty = function (candidates) {
  try {
    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
    Voting.deployed().then(function (contractInstance) {
      contractInstance.createParty(partyID, { gas: 140000, from: web3.eth.accounts[0] }).then(function () {
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("mydb");
          var myobj = { candidates: candidates, votes: 0 };
          dbo.collection("parties").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
        });
      })
    })
    
  } catch (err) {
    console.log(err)
  }
}
window.vote = function (partyID) {
  try {

    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
    Voting.deployed().then(function (contractInstance) {
      contractInstance.vote(partyID, { gas: 140000, from: web3.eth.accounts[0] }).then(function () {
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("mydb");
          var myquery = { _id: partyID };

          dbo.collection("parties").find(query).toArray(function(err, result) {
            if (err) throw err;
            var newvalues = { $set: {votes: result.votes+1 } };
            dbo.collection("parties").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
            });
          });
          
        });
      })
    })
    
  } catch (err) {
    console.log(err)
  }
}

$(document).ready(function () {
  MongoClient = require('mongodb').MongoClient;
  url = "mongodb://localhost:27017/mydb";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("parties", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
    
  });
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
