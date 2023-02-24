const { assert } = require("chai")
const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
const { devChains } = require("../../helper-hardhat-config")

devChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe
          let deployer
          const sendValue = ethers.utils.parseUnits("10000", "gwei")

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer

              //   await deployments.fixture(["fundme"])
              //   fundMe = await ethers.getContract("FundMe", deployer)
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  "0xC7FfA4A6d4a1A58EAeeEbc5ebBc88c0Feeb8D2CF",
                  deployer
              )
              console.log(">>>>>>>>>>", fundMe.address)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
