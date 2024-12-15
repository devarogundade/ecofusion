// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from 'ethers';

const RubberResourceModule = buildModule("RubberResourceModule", (m) => {
  const rubberResource = m.contract("Resource", [
    "Waste Rubber",
    "WRB",
    "ecofusion_rubber_resource",
    m.getAccount(0),
    18,
    ethers.parseEther("100000000"),
    10_000
  ]);

  return { rubberResource };
});

export default RubberResourceModule;
