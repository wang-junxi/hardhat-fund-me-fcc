// import
// main func
// calling of main func

const { network } = require("hardhat")
const { networkConfig, devChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

// function deployFunc() {
//     console.log("Hi!")
// }

// module.exports.default = deployFunc

// module.exports = async (hre) => {
//     const { deployments, getNamedAccounts } = hre
// }

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    console.log(">>> ", chainId)
    // // const priceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    // console.log(">>> ", priceFeedAddress)

    let priceFeedAddress
    if (devChains.includes(network.name)) {
        const ethUsdPriceFeed = await get("MockV3Aggregator")
        priceFeedAddress = ethUsdPriceFeed.address
    } else {
        priceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // well what happens if we want to change chains?
    // when going to localhost or hardhat-network we want to use a mock
    const args = [priceFeedAddress]
    console.log("Hits HERE!!!", args)

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put priceFeedAddress
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args)
    }
    log("------------------------------------")
}

module.exports.tags = ["all", "fundme"]
