// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@forge-std/Script.sol";
import "../src/safe-controller/SafeController.sol";

contract Tick is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("CONTROLLER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address signerAddress = vm.addr(deployerPrivateKey);
        console.log("Signer address:", signerAddress);

        address deployedContractAddress = vm.envAddress(
            "DEPLOYED_CONTRACT_ADDRESS"
        );
        SafeController safeController = SafeController(deployedContractAddress);
        (
            address owner,
            address controller,
            address sender,
            uint256 ticker
        ) = safeController.tick();
        console.log("Owner:", owner);
        console.log("Controller:", controller);
        console.log("Sender:", sender);
        console.log("Ticker:", ticker);

        vm.stopBroadcast();
    }
}
