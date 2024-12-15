export type Resource = {
  name: string;
  symbol: string;
  image: string;
  address: string;
  token: string;
};

export type Transaction = {
  hash: string;
  account: string;
  type: boolean;
  reserve: string;
  price: number;
  uints: number;
  date: Date;
};

export enum AccountType {
  Company = "Company",
  Individual = "Individual",
}

export type Category = {
  id: string;
  name: string;
};

export type Reserve = {
  name: string;
  address: string;
  price: number;
  units: number;
  resource: string;
  lpToken: string;
};

export type Account = {
  address: string;
  type: string;
  name: string;
  description: string;
  image: string;
  attachment: string | undefined;
};

export type Project = {
  name: string;
  description: string;
  category: string;
  links: string[];
  image: string;
  owner: string;
  goal: number;
  raised: number;
  id: number;
  date: Date;
};

export type NetworkName = "testnet";
export type ChainId = "0x128";
export type NetworkConfig = {
  network: NetworkName;
  jsonRpcUrl: string;
  mirrorNodeUrl: string;
  chainId: ChainId;
};

// purpose of this file is to define the type of the config object
export type NetworkConfigs = {
  [key in NetworkName]: {
    network: NetworkName;
    jsonRpcUrl: string;
    mirrorNodeUrl: string;
    chainId: ChainId;
  };
};

export type AppConfig = {
  networks: NetworkConfigs;
};

export type FirmMetadata = {
  name: string;
};

export type ArtisanMetadata = {
  name: string;
};

export type ProjectMetadata = {
  name: string;
};
