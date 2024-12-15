import "@nomicfoundation/hardhat-toolbox";
import { task } from "hardhat/config";
import { TaskArgs } from "./types";
import * as dotenv from "dotenv";
dotenv.config();

const { HEDERA_RPC_URL, PRIVATE_KEY } = process.env;

task("deploy-contract", async () => {
  const deployContract = await import("./scripts/deployContract");
  return deployContract.default();
});

task("provide-liquidity", async (taskArgs: TaskArgs) => {
  const provideLiquidity = await import("./scripts/provideLiquidity");
  return provideLiquidity.default(
    taskArgs.ecoFusionAddress,
    taskArgs.resourceAddress
  );
});

module.exports = {
  mocha: {
    timeout: 3600000,
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      viaIR: true,
    },
  },
  defaultNetwork: "hedera",
  networks: {
    hedera: {
      url: HEDERA_RPC_URL,
      chainId: 296,
      accounts: [PRIVATE_KEY],
    },
  },
};
