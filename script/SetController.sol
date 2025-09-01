// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@forge-std/Script.sol";
import "../src/safe-controller/SafeController.sol";

contract SetController is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address signerAddress = vm.addr(deployerPrivateKey);
        console.log("Signer address:", signerAddress);

        address multisigAddress = vm.envAddress("MULTISIG_ADDRESS");
        console.log("Multisig address:", multisigAddress);

        address safeControllerAddress = vm.envAddress(
            "SAFE_CONTROLLER_ADDRESS"
        );
        SafeController safeController = SafeController(safeControllerAddress);
        safeController.setController(multisigAddress);

        vm.stopBroadcast();
    }
}
