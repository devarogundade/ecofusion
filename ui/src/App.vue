<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import 'vue-toast-notification/dist/theme-sugar.css';
import AppFooter from './components/AppFooter.vue';

import { useAccountStore } from '@/stores/account';
import { useWalletConnect } from '@/scripts/wallet-connect-client';
import { getAccount } from '@/scripts/data';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const walletConnect = useWalletConnect();
const accountStore = useAccountStore();

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

getAnalytics(app);

watch(walletConnect.state, async (newState) => {
  if (newState.isConnected) {
    const account = await getAccount(newState.accountId);

    if (account) {
      router.push('/marketplace');
    } else {
      router.push('/register');
    }

    accountStore.setAccount(account);
  }
});
</script>

<template>
  <main>
    <AppHeader />
    <RouterView class="view" />
    <AppFooter />
  </main>
</template>

<style scoped>
.view {
  padding-bottom: 100px;
}
</style>