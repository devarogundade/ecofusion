import type { ContractId, TransactionId } from "@hashgraph/sdk";
import { walletConnectWallet } from "./wallet-connect-client";
import { ContractFunctionParameterBuilder } from "./contract-function-parameter-builder";
import { GAS_LIMIT_CONTRACT_CALL } from "./constants";
import type { ArtisanMetadata, FirmMetadata, ProjectMetadata } from "@/types";
import { ecoFusionId } from "./data";

export const initReserve = async (
  resource: ContractId | string,
  price: number
): Promise<TransactionId | null> => {
  try {
    return walletConnectWallet.executeContractFunction(
      ecoFusionId,
      "initReserve",
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "address",
          name: "resource",
          value: resource,
        })
        .addParam({
          type: "uint256",
          name: "price",
          value: price,
        }),
      GAS_LIMIT_CONTRACT_CALL
    );
  } catch (error) {
    return null;
  }
};

export const trade = async (
  resource: ContractId | string,
  price: number,
  units: number
): Promise<TransactionId | null> => {
  try {
    return walletConnectWallet.executeContractFunction(
      ecoFusionId,
      "trade",
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "address",
          name: "resource",
          value: resource,
        })
        .addParam({
          type: "uint256",
          name: "price",
          value: price,
        })
        .addParam({
          type: "uint256",
          name: "units",
          value: units,
        }),
      GAS_LIMIT_CONTRACT_CALL
    );
  } catch (error) {
    return null;
  }
};

export const registerAsFirm = async (
  metadata: FirmMetadata
): Promise<TransactionId | null> => {
  try {
    return walletConnectWallet.executeContractFunction(
      ecoFusionId,
      "registerAsFirm",
      new ContractFunctionParameterBuilder().addParam({
        type: "string",
        name: "metadata",
        value: JSON.stringify(metadata),
      }),
      GAS_LIMIT_CONTRACT_CALL
    );
  } catch (error) {
    return null;
  }
};

export const registerAsArtisan = async (
  metadata: ArtisanMetadata
): Promise<TransactionId | null> => {
  try {
    return walletConnectWallet.executeContractFunction(
      ecoFusionId,
      "registerAsArtisan",
      new ContractFunctionParameterBuilder().addParam({
        type: "string",
        name: "metadata",
        value: JSON.stringify(metadata),
      }),
      GAS_LIMIT_CONTRACT_CALL
    );
  } catch (error) {
    return null;
  }
};

export const registerAProject = async (
  projectId: number,
  donationMax: number,
  metadata: ProjectMetadata
): Promise<TransactionId | null> => {
  try {
    return walletConnectWallet.executeContractFunction(
      ecoFusionId,
      "registerAProject",
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "uint256",
          name: "projectId",
          value: projectId,
        })
        .addParam({
          type: "uint256",
          name: "donationMax",
          value: donationMax,
        })
        .addParam({
          type: "string",
          name: "metadata",
          value: JSON.stringify(metadata),
        }),
      GAS_LIMIT_CONTRACT_CALL
    );
  } catch (error) {
    return null;
  }
};

export const donateToProject = async (
  projectId: number,
  payableAmount: number
): Promise<TransactionId | null> => {
  try {
    return walletConnectWallet.executeContractFunction(
      ecoFusionId,
      "donateToProject",
      new ContractFunctionParameterBuilder().addParam({
        type: "uint256",
        name: "projectId",
        value: projectId,
      }),
      GAS_LIMIT_CONTRACT_CALL,
      payableAmount
    );
  } catch (error) {
    return null;
  }
};

export const withdrawFromProject = async (
  projectId: number,
  amount: number
): Promise<TransactionId | null> => {
  try {
    return walletConnectWallet.executeContractFunction(
      ecoFusionId,
      "donateToProject",
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "uint256",
          name: "projectId",
          value: projectId,
        })
        .addParam({
          type: "uint256",
          name: "amount",
          value: amount,
        }),
      GAS_LIMIT_CONTRACT_CALL
    );
  } catch (error) {
    return null;
  }
};

export const addLiquidity = async (
  reserve: ContractId | string,
  units: number
): Promise<TransactionId | null> => {
  try {
    return walletConnectWallet.executeContractFunction(
      reserve,
      "addLiquidity",
      new ContractFunctionParameterBuilder().addParam({
        type: "uint256",
        name: "units",
        value: units,
      }),
      GAS_LIMIT_CONTRACT_CALL
    );
  } catch (error) {
    return null;
  }
};

export const removeLiquidity = async (
  reserve: ContractId | string,
  lpAmount: number
): Promise<TransactionId | null> => {
  try {
    return walletConnectWallet.executeContractFunction(
      reserve,
      "removeLiquidity",
      new ContractFunctionParameterBuilder().addParam({
        type: "uint256",
        name: "lpAmount",
        value: lpAmount,
      }),
      GAS_LIMIT_CONTRACT_CALL
    );
  } catch (error) {
    return null;
  }
};
