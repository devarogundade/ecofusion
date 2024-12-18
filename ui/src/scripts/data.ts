import { initializeApp } from "firebase/app";
import {
  doc,
  getFirestore,
  collection,
  query,
  getDocs,
  setDoc,
  getDoc,
  where,
} from "firebase/firestore";
import type {
  Account,
  Category,
  Project,
  Reserve,
  Resource,
  Transaction,
} from "@/types";
import type { ContractId } from "@hashgraph/sdk";

const RESERVE_COLLECTION: string = "reserves";
const PROJECT_COLLECTION: string = "projects";
const ACCOUNT_COLLECTION: string = "accounts";
const TRANSACTION_COLLECTION: string = "transactions";

const categories: Category[] = [
  { id: "fashion", name: "Fashion" },
  { id: "medical", name: "Medical" },
  { id: "gadget", name: "Gadget" },
  { id: "entertainment", name: "Entertainment" },
  { id: "technology", name: "Technology" },
];

export const ecoFusionId: ContractId | string = "0.0.5285990";

const resources: Resource[] = [
  {
    name: "Plastic",
    symbol: "PLS",
    image: "/images/plastic.png",
    address: "0xaE55a2f466c75713b05b18554CCAb87889CF77d6",
    token: "0.0.5285983",
  },
  {
    name: "Rubber",
    symbol: "RUB",
    image: "/images/rubber.png",
    address: "0xefE81a61Fe06b3FBfc1DdEEe03dD46409F4A8EFA",
    token: "0.0.5285986",
  },
];

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FS_API_KEY,
  authDomain: import.meta.env.VITE_FS_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FS_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FS_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FS_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FS_APP_ID,
  measurementId: import.meta.env.VITE_FS_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function newReserve(reserve: Reserve) {
  await setDoc(doc(db, RESERVE_COLLECTION, reserve.address), reserve, {
    merge: true,
  });
}

export async function newProject(project: Project) {
  await setDoc(doc(db, PROJECT_COLLECTION, project.id.toString()), project, {
    merge: true,
  });
}

export async function newAccount(account: Account) {
  await setDoc(doc(db, ACCOUNT_COLLECTION, account.address), account, {
    merge: true,
  });
}

export async function newTransaction(transaction: Transaction) {
  await setDoc(doc(db, TRANSACTION_COLLECTION, transaction.hash), transaction, {
    merge: true,
  });
}

export async function getProject(projectId: number): Promise<Project | null> {
  const result = await getDoc(
    doc(db, PROJECT_COLLECTION, projectId.toString())
  );

  if (!result.exists().valueOf()) return null;

  return result.data() as Project;
}

export async function getAccount(address: string): Promise<Account | null> {
  const result = await getDoc(doc(db, ACCOUNT_COLLECTION, address));
  if (!result.exists().valueOf()) return null;
  return result.data() as Account;
}

export function allResources(): Resource[] {
  return resources;
}

export function allCategories(): Category[] {
  return categories;
}

export async function allAccounts(): Promise<Account[]> {
  try {
    const ref = collection(db, ACCOUNT_COLLECTION);

    const q = query(ref);
    const querySnapshot = await getDocs(q);

    const accounts: Account[] = [];

    querySnapshot.forEach((doc) => {
      accounts.push(doc.data() as Account);
    });

    return accounts;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function allReserves(resource: string): Promise<Reserve[]> {
  try {
    const ref = collection(db, RESERVE_COLLECTION);

    const q = query(ref, where("resource", "==", resource));
    const querySnapshot = await getDocs(q);

    const reserves: Reserve[] = [];

    querySnapshot.forEach((doc) => {
      reserves.push(doc.data() as Reserve);
    });

    return reserves;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function allProjects(): Promise<Project[]> {
  try {
    const ref = collection(db, PROJECT_COLLECTION);

    const q = query(ref);
    const querySnapshot = await getDocs(q);

    const projects: Project[] = [];

    querySnapshot.forEach((doc) => {
      projects.push(doc.data() as Project);
    });

    return projects;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function allTransactions(reserve: string): Promise<Transaction[]> {
  try {
    const ref = collection(db, TRANSACTION_COLLECTION);

    const q = query(ref, where("reserve", "==", reserve));
    const querySnapshot = await getDocs(q);

    const transactions: Transaction[] = [];

    console.log("transactions", transactions);

    querySnapshot.forEach((doc) => {
      transactions.push(doc.data() as Transaction);
    });

    return transactions;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function decrementUnits(address: string, units: number) {
  try {
    const result = await getDoc(doc(db, RESERVE_COLLECTION, address));
    if (!result.exists().valueOf()) return;

    const reserve = result.data() as Reserve;

    await setDoc(
      doc(db, RESERVE_COLLECTION, address),
      { units: Math.max(0, reserve.units - units) },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function incrementUnits(address: string, units: number) {
  try {
    const result = await getDoc(doc(db, RESERVE_COLLECTION, address));
    if (!result.exists().valueOf()) return;

    const reserve = result.data() as Reserve;

    await setDoc(
      doc(db, RESERVE_COLLECTION, address),
      { units: reserve.units + units },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function incrementRaised(projectId: number, amount: number) {
  try {
    const result = await getDoc(
      doc(db, PROJECT_COLLECTION, projectId.toString())
    );
    if (!result.exists().valueOf()) return;

    const project = result.data() as Project;

    await setDoc(
      doc(db, PROJECT_COLLECTION, projectId.toString()),
      { raised: project.raised + amount },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
}
