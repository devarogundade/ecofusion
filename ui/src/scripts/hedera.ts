import {
  Hbar,
  type ContractFunctionResult,
  type ContractId,
  type TransactionId,
} from "@hashgraph/sdk";
import { walletConnectWallet } from "./wallet-connect-client";
import { ContractFunctionParameterBuilder } from "./contract-function-parameter-builder";
import { GAS_LIMIT_CONTRACT_CALL } from "./constants";
import type { ArtisanMetadata, FirmMetadata, ProjectMetadata } from "@/types";
import { ecoFusionId } from "./data";

export const initReserve = async (
  resource: string,
  price: number
): Promise<{
  hash: TransactionId | null;
  result: ContractFunctionResult | null;
}> => {
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
      GAS_LIMIT_CONTRACT_CALL,
      new Hbar(10),
      true
    );
  } catch (error) {
    return {
      hash: null,
      result: null,
    };
  }
};

export const trade = async (
  reserve: ContractId | string,
  price: number
): Promise<{
  hash: TransactionId | null;
  result: ContractFunctionResult | null;
}> => {
  try {
    return walletConnectWallet.executeContractFunction(
      ecoFusionId,
      "trade",
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "address",
          name: "reserve",
          value: reserve,
        })
        .addParam({
          type: "uint256",
          name: "price",
          value: price,
        }),
      GAS_LIMIT_CONTRACT_CALL,
      new Hbar(price)
    );
  } catch (error) {
    return {
      hash: null,
      result: null,
    };
  }
};

export const mintToken = async (
  resource: ContractId | string,
  amount: number
): Promise<{
  hash: TransactionId | null;
  result: ContractFunctionResult | null;
}> => {
  try {
    return walletConnectWallet.executeContractFunction(
      resource,
      "mint",
      new ContractFunctionParameterBuilder().addParam({
        type: "int64",
        name: "amount",
        value: amount,
      }),
      GAS_LIMIT_CONTRACT_CALL
    );
  } catch (error) {
    return {
      hash: null,
      result: null,
    };
  }
};

export const registerAsFirm = async (
  metadata: FirmMetadata
): Promise<{
  hash: TransactionId | null;
  result: ContractFunctionResult | null;
}> => {
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
    return {
      hash: null,
      result: null,
    };
  }
};

export const registerAsArtisan = async (
  metadata: ArtisanMetadata
): Promise<{
  hash: TransactionId | null;
  result: ContractFunctionResult | null;
}> => {
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
    return {
      hash: null,
      result: null,
    };
  }
};

export const registerAProject = async (
  projectId: number,
  donationMax: number,
  metadata: ProjectMetadata
): Promise<{
  hash: TransactionId | null;
  result: ContractFunctionResult | null;
}> => {
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
    return {
      hash: null,
      result: null,
    };
  }
};

export const donateToProject = async (
  projectId: number,
  payableAmount: Hbar,
  memo: string
): Promise<{
  hash: TransactionId | null;
  result: ContractFunctionResult | null;
}> => {
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
      payableAmount,
      false,
      memo
    );
  } catch (error) {
    return {
      hash: null,
      result: null,
    };
  }
};

export const withdrawFromProject = async (
  projectId: number,
  amount: number
): Promise<{
  hash: TransactionId | null;
  result: ContractFunctionResult | null;
}> => {
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
    return {
      hash: null,
      result: null,
    };
  }
};

export const addLiquidity = async (
  reserve: ContractId | string,
  units: number
): Promise<{
  hash: TransactionId | null;
  result: ContractFunctionResult | null;
}> => {
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
    return {
      hash: null,
      result: null,
    };
  }
};

export const removeLiquidity = async (
  reserve: ContractId | string,
  lpAmount: number
): Promise<{
  hash: TransactionId | null;
  result: ContractFunctionResult | null;
}> => {
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
    return {
      hash: null,
      result: null,
    };
  }
};
