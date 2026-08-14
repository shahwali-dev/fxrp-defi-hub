// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Script, console } from "forge-std/Script.sol";
import { HelloWorld } from "src/HelloWorld.sol";

contract DeploySimple is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        HelloWorld hello = new HelloWorld("Hello from Flare!");

        console.log("HelloWorld deployed to:", address(hello));

        vm.stopBroadcast();
    }
}