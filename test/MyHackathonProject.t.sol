// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import { Test } from "forge-std/Test.sol";
import { MyHackathonProject } from "../src/MyHackathonProject.sol";

contract MyHackathonProjectTest is Test {
    MyHackathonProject project;
    address fxrp = 0x0b6A3645c240605887a5532109323A3E12273dc7;
    address firelight = 0xC90D6847747b85d1fa2E07859869fb9fB72c0361;
    address upshift = 0x24c1a47cD5e8473b64EAB2a94515a196E10C7C81;
    address user = address(0x123);
    address ftsoAddress = 0x8a37960CFEec34EB436bf15Ec5DE2F24b412ef4E;

    function setUp() public {
        vm.createSelectFork(vm.envString("COSTON2_RPC_URL"));
        project = new MyHackathonProject(fxrp, firelight, upshift, ftsoAddress);
    }

    function test_DepositFXRP() public {
        vm.startPrank(user);
        // Note: Would need actual FXRP for this test
        vm.stopPrank();
    }

    function test_GetFLRPrice() public view {
        uint256 price = project.getFLRPrice();
        assert(price > 0);
    }

    function test_VaultAddresses() public view {
        assert(address(project.firelightVault()) == firelight);
        assert(address(project.upshiftVault()) == upshift);
    }
}