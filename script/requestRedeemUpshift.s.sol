// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { MyHackathonProject } from "../src/MyHackathonProject.sol";

contract RequestRedeemUpshift is Script {
    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address projectAddress = vm.envAddress("PROJECT_ADDRESS");
        uint256 shares = 1 * 10**18; // 1 LP token

        vm.startBroadcast(privateKey);

        MyHackathonProject project = MyHackathonProject(projectAddress);
        project.requestRedeemUpshift(shares);

        console.log("Requested redeem of", shares, "Upshift shares");

        vm.stopBroadcast();
    }
}