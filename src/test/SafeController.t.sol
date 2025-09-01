// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../safe-controller/SafeController.sol";

contract SafeControllerTest is Test {
    SafeController public sc;
    address public owner;
    address public controller;
    address public other;

    function setUp() public {
        sc = new SafeController();
        owner = address(this);
        controller = address(0x1234);
        other = address(0xABCD);
    }

    function testChangeController() public {
        assertEq(sc.ticker(), 0);

        console.log("initial config - owner is the controller");
        (
            address _owner,
            address _controller,
            address _sender,
            uint256 ticker
        ) = sc.tick();
        assertEq(_owner, owner);
        assertEq(_controller, owner);
        assertEq(_sender, owner);
        assertEq(ticker, 1);
        assertEq(sc.ticker(), 1);

        console.log("change controller");
        sc.setController(controller);
        assertEq(sc.controller(), controller);

        console.log("new controller can call tick()");
        vm.prank(controller);
        (, _controller, _sender, ticker) = sc.tick();
        assertEq(_controller, controller);
        assertEq(_sender, controller);
        assertEq(ticker, 2);
        assertEq(sc.ticker(), 2);

        console.log("old controller cannot call tick()");
        vm.prank(owner);
        vm.expectRevert("Only controller can call this method");
        sc.tick();

        console.log("other cannot change controller");
        vm.prank(other);
        vm.expectRevert("Only owner can call this method");
        sc.setController(other);

        console.log("owner can change controller again");
        vm.prank(owner);
        sc.setController(other);
        vm.prank(other);
        (, _controller, , ) = sc.tick();
        assertEq(_controller, other);
    }
}
