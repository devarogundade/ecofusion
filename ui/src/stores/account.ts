import type { Account } from "@/types";
import { defineStore } from "pinia";

export const useAccountStore = defineStore("account", {
  state: () => ({
    account: null as Account | null,
  }),
  actions: {
    setAccount(account: Account | null) {
      this.account = account;
    },
  },
});
