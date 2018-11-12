pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract Party {
    //this would be the names of the candidates in the party
    string[] public names;

    //this would be the vote count for this party
    uint256 private voteCount;

    //we define an enum for PVP, SEN
    enum PartyType{PVP, SEN}
    //this would be indicator whether it's a senator or not
    PartyType public partyKind;

    // utility function to get the size of the array
    function getCount(string[] array) public pure returns(uint count) {
        return array.length;
    }

    // to initialise the party with votecount = 0
    constructor (string[] _names) public payable{
        //check whether the size of the names is > 0
        uint256 count = getCount(_names);
        require(count > 0, "No names in the party");
        names = _names;
        voteCount = 0;

        if(count > 1) {
            partyKind = PartyType.PVP;
        } else {
            partyKind = PartyType.SEN;
        }
    }

    //function to vote
    function vote() public payable {
        voteCount += 1;
    }

    //function to get votes
    function getVotes() public view returns(uint256){
        return voteCount;
    }

    //function to get Names
    function getNames() public view returns(string[]) {
        return names;
    }

    //function exposed just to check whether the party is a Senator party
    function isSenator() public view returns(bool) {
        if(partyKind == PartyType.SEN) {
            return true;
        }
        return false;
    }
}

