// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from 'ethers';

const PlasticResourceModule = buildModule("PlasticResourceModule", (m) => {
  const plasticResource = m.contract("Resource", [
    "Waste Plastic",
    "WPS",
    "ecofusion_plastic_resource",
    m.getAccount(0),
    18,
    ethers.parseEther("100000000"),
    10_000
  ]);

  return { plasticResource };
});

export default PlasticResourceModule;
