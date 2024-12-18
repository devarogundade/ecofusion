import { reactive, onMounted, onUnmounted } from "vue";
import {
  AccountAllowanceApproveTransaction,
  AccountId,
  Client,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractId,
  Hbar,
  LedgerId,
  PrivateKey,
  TokenAssociateTransaction,
  TokenId,
  TransferTransaction,
} from "@hashgraph/sdk";
import {
  DAppConnector,
  HederaJsonRpcMethod,
  HederaSessionEvent,
  HederaChainId,
} from "@hashgraph/hedera-wallet-connect";
import { appConfig } from "./config";
import EventEmitter from "events";
import type { ContractFunctionParameterBuilder } from "./contract-function-parameter-builder";
import type { WalletInterface } from "./wallet-interface";

const refreshEvent = new EventEmitter();

const walletConnectProjectId = import.meta.env.VITE_PROJECT_ID;
const currentNetworkConfig = appConfig.networks.testnet;
const hederaNetwork = currentNetworkConfig.network;

export const hederaClient = Client.forTestnet();
hederaClient.setOperator(
  import.meta.env.VITE_OPERATOR_ID,
  PrivateKey.fromStringECDSA(import.meta.env.VITE_OPERATOR_KEY!)
);

const metadata = {
  name: "EcoFusion",
  description: "EcoFusion dApp",
  url: "#",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const dappConnector = new DAppConnector(
  metadata,
  LedgerId.fromString(hederaNetwork),
  walletConnectProjectId,
  Object.values(HederaJsonRpcMethod),
  [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
  [HederaChainId.Testnet]
);

export const openWalletConnectModal = async () => {
  await dappConnector.init({ logger: "error" });
  await dappConnector.openModal().then(() => {
    refreshEvent.emit("sync");
  });
};

class WalletConnectWallet implements WalletInterface {
  getSigner() {
    if (dappConnector.signers.length === 0) {
      throw new Error("No signers found!");
    }
    return dappConnector.signers[0];
  }

  getAccountId() {
    return AccountId.fromString(this.getSigner().getAccountId().toString());
  }

  async transferHBAR(toAddress: AccountId | string, amount: number) {
    try {
      const transferHBARTransaction = new TransferTransaction()
        .addHbarTransfer(this.getAccountId(), -amount)
        .addHbarTransfer(toAddress, amount);

      const signer = this.getSigner();
      await transferHBARTransaction.freezeWithSigner(signer);
      const txResult = await transferHBARTransaction.executeWithSigner(signer);
      return txResult ? txResult.transactionId : null;
    } catch (error) {
      return null;
    }
  }

  async transferFungibleToken(
    toAddress: AccountId | string,
    tokenId: TokenId | string,
    amount: number
  ) {
    try {
      const transferTokenTransaction = new TransferTransaction()
        .addTokenTransfer(tokenId, this.getAccountId(), -amount)
        .addTokenTransfer(tokenId, toAddress.toString(), amount);

      const signer = this.getSigner();
      await transferTokenTransaction.freezeWithSigner(signer);
      const txResult = await transferTokenTransaction.executeWithSigner(signer);
      return txResult ? txResult.transactionId : null;
    } catch (error) {
      return null;
    }
  }

  async transferNonFungibleToken(
    toAddress: AccountId | string,
    tokenId: TokenId | string,
    serialNumber: number
  ) {
    try {
      const transferTokenTransaction = new TransferTransaction().addNftTransfer(
        tokenId,
        serialNumber,
        this.getAccountId(),
        toAddress
      );

      const signer = this.getSigner();
      await transferTokenTransaction.freezeWithSigner(signer);
      const txResult = await transferTokenTransaction.executeWithSigner(signer);
      return txResult ? txResult.transactionId : null;
    } catch (error) {
      return null;
    }
  }

  async approveToken(
    tokenId: TokenId | string,
    spender: AccountId | ContractId | string,
    amount: number
  ) {
    try {
      const approveTokenTransaction =
        new AccountAllowanceApproveTransaction().approveTokenAllowance(
          tokenId,
          this.getAccountId(),
          spender,
          amount
        );

      const signer = this.getSigner();
      await approveTokenTransaction.freezeWithSigner(signer);
      const txResult = await approveTokenTransaction.executeWithSigner(signer);
      return txResult ? txResult.transactionId : null;
    } catch (error) {
      return null;
    }
  }

  async associateToken(tokenId: TokenId | string) {
    try {
      const associateTokenTransaction = new TokenAssociateTransaction()
        .setAccountId(this.getAccountId())
        .setTokenIds([tokenId]);

      const signer = this.getSigner();
      await associateTokenTransaction.freezeWithSigner(signer);
      const txResult = await associateTokenTransaction.executeWithSigner(
        signer
      );
      return txResult ? txResult.transactionId : null;
    } catch (error) {
      return null;
    }
  }

  async associateTokens(tokenIds: TokenId[] | string[]) {
    try {
      const associateTokenTransaction = new TokenAssociateTransaction()
        .setAccountId(this.getAccountId())
        .setTokenIds(tokenIds);

      const signer = this.getSigner();
      await associateTokenTransaction.freezeWithSigner(signer);
      const txResult = await associateTokenTransaction.executeWithSigner(
        signer
      );
      return txResult ? txResult.transactionId : null;
    } catch (error) {
      return null;
    }
  }

  async executeContractFunction(
    contractId: ContractId | string,
    functionName: string,
    functionParameters: ContractFunctionParameterBuilder,
    gasLimit: number,
    payableAmount: Hbar = new Hbar(0),
    hasResult: boolean = false,
    memo: string = ""
  ) {
    try {
      const tx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(gasLimit)
        .setPayableAmount(payableAmount)
        .setTransactionMemo(memo)
        .setFunction(functionName, functionParameters.buildHAPIParams());

      const signer = this.getSigner();
      await tx.freezeWithSigner(signer);
      const txResult = await tx.executeWithSigner(signer);

      console.log("txResult", txResult);

      const record = hasResult ? await txResult.getRecord(hederaClient) : null;

      return {
        hash: txResult ? txResult.transactionId : null,
        result: record ? record.contractFunctionResult : null,
      };
    } catch (error) {
      console.log("ContractExecuteTransaction error:", error);
      return {
        hash: null,
        result: null,
      };
    }
  }

  async viewContractFunction(
    contractId: ContractId | string,
    functionName: string,
    functionParameters: ContractFunctionParameterBuilder
  ) {
    const tx = new ContractCallQuery()
      .setContractId(contractId)
      .setFunction(functionName, functionParameters.buildHAPIParams());

    return tx.execute(hederaClient);
  }

  disconnect() {
    dappConnector.disconnectAll().then(() => {
      refreshEvent.emit("sync");
    });
  }
}

export const walletConnectWallet = new WalletConnectWallet();

export const useWalletConnect = () => {
  const state = reactive({
    accountId: "",
    isConnected: false,
  });

  const syncWithWalletConnectContext = () => {
    const accountId = dappConnector.signers[0]?.getAccountId()?.toString();
    if (accountId) {
      state.accountId = accountId;
      state.isConnected = true;
    } else {
      state.accountId = "";
      state.isConnected = false;
    }
  };

  onMounted(async () => {
    refreshEvent.addListener("sync", syncWithWalletConnectContext);

    await dappConnector.init();
    syncWithWalletConnectContext();
  });

  onUnmounted(() => {
    refreshEvent.removeListener("sync", syncWithWalletConnectContext);
  });

  return { state };
};
