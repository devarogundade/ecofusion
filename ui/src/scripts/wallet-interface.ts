import {
  AccountId,
  ContractFunctionResult,
  ContractId,
  Hbar,
  TokenId,
  TransactionId,
} from "@hashgraph/sdk";
import { ContractFunctionParameterBuilder } from "./contract-function-parameter-builder";

export interface WalletInterface {
  executeContractFunction: (
    contractId: ContractId,
    functionName: string,
    functionParameters: ContractFunctionParameterBuilder,
    gasLimit: number,
    payableAmount: Hbar
  ) => Promise<{
    hash: TransactionId | string | null;
    result: ContractFunctionResult | null;
  }>;

  disconnect: () => void;

  transferHBAR: (
    toAddress: AccountId,
    amount: number
  ) => Promise<TransactionId | string | null>;

  transferFungibleToken: (
    toAddress: AccountId,
    tokenId: TokenId,
    amount: number
  ) => Promise<TransactionId | string | null>;

  transferNonFungibleToken: (
    toAddress: AccountId,
    tokenId: TokenId,
    serialNumber: number
  ) => Promise<TransactionId | string | null>;

  associateToken: (tokenId: TokenId) => Promise<TransactionId | string | null>;
}
