import { ethers, run } from "hardhat";
import { expect } from "chai";
import { DeployResult } from "../types";

describe("Main Test Suite", function () {
  let signers;

  let deployResult: DeployResult;
  let plasticReserveAddress: string;
  let rubberResourceAddress: string;

  before(async function () {
    signers = await ethers.getSigners();
  });

  it("should be able to deploy contracts", async function () {
    deployResult = await run("deploy-contract");
    expect(deployResult.ecoFusionAddress).to.not.be.undefined;
    expect(deployResult.ecoFusionAddress).to.not.be.null;
    expect(deployResult.plasticResourceAddress).to.not.be.undefined;
    expect(deployResult.plasticResourceAddress).to.not.be.null;
    expect(deployResult.rubberResourceAddress).to.not.be.undefined;
    expect(deployResult.rubberResourceAddress).to.not.be.null;
  });

  // it("should be able to provide liquidity for plastic", async function () {
  //     plasticReserveAddress = await run("provide-liquidity", {
  //         ecoFusionAddress: deployResult.ecoFusionAddress,
  //         resourceAddress: deployResult.plasticResourceAddress
  //     });
  //     expect(plasticReserveAddress).to.not.be.undefined;
  //     expect(plasticReserveAddress).to.not.be.null;
  // });

  // it("should be able to provide liquidity for rubber", async function () {
  //     rubberResourceAddress = await run("provide-liquidity", {
  //         ecoFusionAddress: deployResult.ecoFusionAddress,
  //         resourceAddress: deployResult.rubberResourceAddress
  //     });
  //     expect(rubberResourceAddress).to.not.be.undefined;
  //     expect(rubberResourceAddress).to.not.be.null;
  // });
});
