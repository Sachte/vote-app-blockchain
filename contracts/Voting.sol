pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Party.sol";

contract Voting is Ownable, Party{

    // all the parties up for voting
    Party[] public list;

    uint256[] partyIds;

    mapping (uint256 => uint256) listToIndex;

    modifier onlyOwner {
        require(isOwner(), "Not Admin");
        _;
    }
    
    event PartyAdded(uint indexed id, string[] names);

    constructor () public payable {
    }

    //create a party function
    function createParty(string[] names) public onlyOwner payable{

        Party party = new Party(names);

        uint id = list.push(party) - 1;
        uint256 key = partyIds.push(id) - 1;
        listToIndex[id] = key;

        emit PartyAdded(id, names);
    }

    //get all the parties
    function getParties() public payable returns(Party[]){
        return list;
    }

    //vote for the party
    function vote(uint256 _id) public {
        Party name = Party(_id);
        name.vote();
    }

    //get votes for a party
    function votes(uint256 _id) public view onlyOwner returns(uint256){
        Party name = Party(_id);
        return name.getVotes();
    }


    //get names for a party
    function getNames(uint256 _id) public view returns(string[]){
        Party name = Party(_id);
        return name.getNames();
    }
    
    //get type for a party
    function isSenator(uint256 _id) public view returns(bool){
        Party name = Party(_id);
        return name.isSenator();
    }
}