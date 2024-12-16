import {
  Client,
  TokenAssociateTransaction,
  AccountAllowanceApproveTransaction,
  AccountId,
  TokenId,
  ContractId,
  PrivateKey,
} from "@hashgraph/sdk";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const { PRIVATE_KEY } = process.env;

const provideLiquidty = async (
  ecoFusionAddress: string,
  resourceAddress: string
): Promise<string | undefined | null> => {
  const wallet = (await ethers.getSigners())[0];

  const ecoFusion = await ethers.getContractAt(
    "EcoFusion",
    ecoFusionAddress,
    wallet
  );
  const resource = await ethers.getContractAt(
    "Resource",
    resourceAddress,
    wallet
  );

  const resourceToken = await resource.token();
  console.log("resourceToken", resourceToken);

  const reserves = await ecoFusion.getReserves(resourceAddress);
  console.log("reserves", reserves);

  const reserve = await ethers.getContractAt("Reserve", reserves[0], wallet);

  const lpToken = await reserve.lpToken();
  console.log("lpToken", lpToken);

  const operatorId = AccountId.fromString("0.0.5161370");
  const operatorKey = PrivateKey.fromStringECDSA(PRIVATE_KEY!);

  console.log("operatorId", operatorId.toString());
  console.log("operatorKey", operatorKey.toString());

  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  const tokenAssociate = new TokenAssociateTransaction()
    .setAccountId(AccountId.fromString("0.0.5161370"))
    .setTokenIds([
      TokenId.fromSolidityAddress(resourceToken),
      TokenId.fromSolidityAddress(lpToken),
    ])
    .freezeWith(client);

  const signedTokenAssociate = await tokenAssociate.sign(operatorKey);

  const responseTokenAssociate = await signedTokenAssociate.execute(client);

  const receiptTokenAssociate = await responseTokenAssociate.getReceipt(client);

  console.log("Association Status:", receiptTokenAssociate.status.toString());

  const mintTx = await resource.mint(ethers.parseUnits("100", 2), {
    gasLimit: 200000,
  });
  console.log("mintTx", mintTx.hash);

  const rv = await ContractId.fromEvmAddress(
    0,
    0,
    reserves[0]
  ).populateAccountNum(client);
  console.log("rv", `${rv.shard}.${rv.realm}.${rv.num}`);

  const accountAllowance = new AccountAllowanceApproveTransaction()
    .approveTokenAllowance(
      TokenId.fromSolidityAddress(resourceToken),
      AccountId.fromString("0.0.5161370"),
      ContractId.fromString(`${rv.shard}.${rv.realm}.${rv.num}`),
      Number(ethers.parseUnits("100", 2))
    )
    .freezeWith(client);

  const signedAccountAllowance = await accountAllowance.sign(operatorKey);

  const responseAccountAllowance = await signedAccountAllowance.execute(client);

  const receiptAccountAllowance = await responseAccountAllowance.getReceipt(
    client
  );

  console.log(
    "Account Allowance Status:",
    receiptAccountAllowance.status.toString()
  );

  const addLiquidityTx = await reserve.addLiquidity(
    ethers.parseUnits("50", 2),
    {
      gasLimit: 200000,
    }
  );
  console.log("addLiquidityTx", addLiquidityTx.hash);

  return reserves[0];
};

export default provideLiquidty;
