import { ethers } from "hardhat";
import { DeployResult } from "../types";

const deployContract = async (): Promise<DeployResult | null> => {
  const wallet = (await ethers.getSigners())[0];

  const Resource = await ethers.getContractFactory("Resource", wallet);

  const plasticResource = await Resource.deploy(
    "Waste Plastic", // name
    "WPS", // symbol
    2, // decimals
    7_776_000, // expiry
    { value: ethers.parseEther("5") }
  );

  const rubberResource = await Resource.deploy(
    "Waste Rubber", // name
    "WRB", // symbol
    2, // decimals
    7_776_000, // expiry
    { value: ethers.parseEther("5") }
  );

  const plasticReceipt = await plasticResource.deploymentTransaction()?.wait();
  const rubberReceipt = await rubberResource.deploymentTransaction()?.wait();

  console.log("plasticReceipt", plasticReceipt?.contractAddress);
  console.log("rubberReceipt", rubberReceipt?.contractAddress);

  await plasticResource.mint(ethers.parseUnits("100", 2), wallet.address);
  await rubberResource.mint(ethers.parseUnits("100", 2), wallet.address);

  if (!plasticReceipt || !plasticReceipt.contractAddress) return null;
  if (!rubberReceipt || !rubberReceipt.contractAddress) return null;

  const EcoFusion = await ethers.getContractFactory("EcoFusion", wallet);

  const ecoFusion = await EcoFusion.deploy({ value: ethers.parseEther("5") });
  const ecoFusionReceipt = await ecoFusion.deploymentTransaction()?.wait();

  console.log("ecoFusionReceipt", ecoFusionReceipt?.contractAddress);

  //   await ecoFusion.registerAsFirm(JSON.stringify({ name: "Dangote" }));

  //   await ecoFusion.initReserve(
  //     plasticReceipt.contractAddress,
  //     ethers.parseEther("0.5"),
  //     { value: ethers.parseEther("10") }
  //   );

  //   await ecoFusion.initReserve(
  //     rubberReceipt.contractAddress,
  //     ethers.parseEther("1.2"),
  //     { value: ethers.parseEther("10") }
  //   );

  if (!ecoFusionReceipt || !ecoFusionReceipt.contractAddress) return null;

  return {
    ecoFusionAddress: ecoFusionReceipt.contractAddress,
    plasticResourceAddress: plasticReceipt.contractAddress,
    rubberResourceAddress: rubberReceipt.contractAddress,
  };
};

export default deployContract;
