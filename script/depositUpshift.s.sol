// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Script, console } from "forge-std/Script.sol";
import { MyHackathonProject } from "../src/MyHackathonProject.sol";
import { IERC20 } from "@openzeppelin-contracts/token/ERC20/IERC20.sol";

contract DepositUpshift is Script {
    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address projectAddress = vm.envAddress("PROJECT_ADDRESS");
        uint256 amount = 10 * 10**18;

        vm.startBroadcast(privateKey);

        MyHackathonProject project = MyHackathonProject(projectAddress);
        
        address fxrpAddress = address(project.fxrp());
        
        IERC20(fxrpAddress).approve(projectAddress, amount);
        
        project.depositFXRP(amount);
        
        project.depositUpshift(amount);

        console.log("Deposited", amount, "FXRP to Upshift vault");

        vm.stopBroadcast();
    }
}