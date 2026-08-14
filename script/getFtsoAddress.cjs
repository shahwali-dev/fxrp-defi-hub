const { nameToAddress } = require("@flarenetwork/flare-periphery-contract-artifacts");
const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://coston2-api.flare.network/ext/C/rpc");
    const ftsoAddress = await nameToAddress("Ftso", "coston2", provider);
    console.log("Coston2 FTSO Address:", ftsoAddress);
}

main().catch(console.error);
