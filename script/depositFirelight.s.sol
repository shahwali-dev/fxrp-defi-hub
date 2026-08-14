// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { MyHackathonProject } from "../src/MyHackathonProject.sol";
import { IERC20 } from "@openzeppelin-contracts/token/ERC20/IERC20.sol";

contract DepositFirelight is Script {
    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address projectAddress = vm.envAddress("PROJECT_ADDRESS");
        uint256 amount = 10 * 10**18;

        vm.startBroadcast(privateKey);

        MyHackathonProject project = MyHackathonProject(projectAddress);
        
        address fxrpAddress = address(project.fxrp());
        
        IERC20(fxrpAddress).approve(projectAddress, amount);

        project.depositFXRP(amount);

        project.depositFirelight(amount);

        console.log("Deposited", amount, "FXRP to Firelight vault");

        vm.stopBroadcast();
    }
}