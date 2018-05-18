pragma solidity ^0.4.18;

import './StaxeToken.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract StaxeSale is Ownable {
    StaxeToken public token;
    uint256 public raised;
    uint256 public goal;
    uint256 public start;
    uint256 public deadline;
    mapping(address => uint256) balances;

    event Invested(uint invested, uint totalShares, address investor);

    function StaxeSale(StaxeToken _token, uint256 _goal, uint256 _start, uint256 _deadline) public {
        token = _token;
        goal = _goal;
        start = _start;
        deadline = _deadline;
    }

    function balanceOf(address _investor) public view returns (uint256) {
        return balances[_investor];
    }

    function _addInvestment(address _investor, uint256 _amount) internal {
        balances[_investor] += _amount;
        raised += _amount;
        Invested(_amount, balances[_investor], _investor);
    }

    function receiveApproval(address _sender, uint256 _value, StaxeToken _staxeToken, bytes _extraData) public returns (bool) {
        // require(_start > block.timestamp)
        require(_staxeToken == token);
        require(token.transferFrom(_sender, address(this), _value));

        _addInvestment(_sender, _value);
        return true;
    }

    function getOwner() public constant returns (address) {
        return owner;
    }

    function getAmountRaised() public constant returns (uint256) {
        return raised;
    }

    function getGoal() public constant returns (uint256) {
        return goal;
    }

    function getStartTime() public constant returns (uint256) {
        return start;
    }

    function getDeadline() public constant returns (uint256) {
        return deadline;
    }
}