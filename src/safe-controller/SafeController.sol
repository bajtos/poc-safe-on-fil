// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract SafeController {
    address public owner;
    address public controller;
    uint256 public ticker = 0;

    event Ticked(uint256 ticker, address indexed sender);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this method");
        _;
    }

    modifier onlyController() {
        require(
            msg.sender == controller,
            "Only controller can call this method"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        controller = owner;
    }

    function setController(address newController) public onlyOwner {
        require(
            newController != address(0),
            "New controller is the zero address"
        );
        controller = newController;
    }

    function tick()
        public
        onlyController
        returns (
            address _owner,
            address _controller,
            address _sender,
            uint256 _ticker
        )
    {
        ticker += 1;
        emit Ticked(ticker, msg.sender);
        return (owner, controller, msg.sender, ticker);
    }
}
