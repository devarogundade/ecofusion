import { ethers } from 'ethers';
// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import PlasticResourceModule from "./PlasticResource";
import RubberResourceModule from "./RubberResource";

const EcoFusionModule = buildModule("EcoFusionModule", (m) => {
  const ecoFusion = m.contract("EcoFusion", []);

  const { plasticResource } = m.useModule(PlasticResourceModule);
  const { rubberResource } = m.useModule(RubberResourceModule);

  m.call(ecoFusion, "initReserve", [
    plasticResource,
    ethers.parseEther("0.5")],
    { id: "plastic" }
  );

  m.call(ecoFusion, "initReserve", [
    rubberResource,
    ethers.parseEther("1.2")],
    { id: "rubbber" }
  );

  return { ecoFusion };
});

export default EcoFusionModule;
