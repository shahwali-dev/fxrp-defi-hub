// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { MyHackathonProject } from "../src/MyHackathonProject.sol";

contract ClaimUpshift is Script {
    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address projectAddress = vm.envAddress("PROJECT_ADDRESS");
        uint256 year = 2026;
        uint256 month = 8;
        uint256 day = 16;

        vm.startBroadcast(privateKey);

        MyHackathonProject project = MyHackathonProject(projectAddress);
        project.claimUpshift(year, month, day);

        console.log("Claimed Upshift redemption for", year, month, day);

        vm.stopBroadcast();
    }
}