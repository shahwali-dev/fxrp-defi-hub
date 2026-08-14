// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MyHackathonProject} from "../src/MyHackathonProject.sol";

contract DeployMyProject is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address fxrpAddress = 0x0b6A3645c240605887a5532109323A3E12273dc7;
        address firelightVaultAddress = 0xC90D6847747b85d1fa2E07859869fb9fB72c0361;
        address upshiftVaultAddress = 0x24c1a47cD5e8473b64EAB2a94515a196E10C7C81;
        address ftsoAddress = 0x8a37960CFEec34EB436bf15Ec5DE2F24b412ef4E;

        MyHackathonProject project =
            new MyHackathonProject(fxrpAddress, firelightVaultAddress, upshiftVaultAddress, ftsoAddress);

        console.log("MyHackathonProject deployed to:", address(project));

        vm.stopBroadcast();
    }
}