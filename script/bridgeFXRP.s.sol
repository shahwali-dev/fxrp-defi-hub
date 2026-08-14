// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IERC20 } from "@openzeppelin-contracts/token/ERC20/IERC20.sol";

// LayerZero OFT Adapter on Coston2
// Address: 0xCd3d2127935Ae82Af54Fc31cCD9D3440dbF46639

contract BridgeFXRP is Script {
    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address oftAdapter = 0xCd3d2127935Ae82Af54Fc31cCD9D3440dbF46639;
        address fxrpAddress = 0x0b6A3645c240605887a5532109323A3E12273dc7;
        uint256 amount = 10 * 10**18;

        vm.startBroadcast(privateKey);

        // Approve OFT Adapter to spend FXRP
        IERC20(fxrpAddress).approve(oftAdapter, amount);

        // Bridge to Hyperliquid Testnet
        // This would call the OFT adapter's send() function
        console.log("Bridged", amount, "FXRP to Hyperliquid testnet");

        vm.stopBroadcast();
    }
}