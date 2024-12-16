<script setup lang="ts">
import Button from '@/components/Button.vue';
import EcoFusionLogo from '@/components/icons/EcoFusionLogo.vue';
import { useWalletConnect } from '@/scripts/wallet-connect-client';
import { useAccountStore } from '@/stores/account';
import { AccountType } from '@/types';

const walletConnect = useWalletConnect();
const accountStore = useAccountStore();
</script>

<template>
    <section>
        <div class="app_width">
            <header>
                <RouterLink to="/">
                    <EcoFusionLogo />
                </RouterLink>

                <div class="tabs">
                    <RouterLink to="/">Home</RouterLink>
                    <RouterLink to="/marketplace">Market Place</RouterLink>
                    <RouterLink to="/projects">Projects</RouterLink>
                    <RouterLink v-if="accountStore.account?.type === AccountType.Individual" to="/submission">New
                        project
                    </RouterLink>
                    <RouterLink v-if="accountStore.account?.type === AccountType.Company" to="/new-reserve">New reserve
                    </RouterLink>
                    <RouterLink to="/login" v-if="!walletConnect.state.isConnected">
                        <Button :text="'LOGIN'" />
                    </RouterLink>
                    <Button v-else :text="walletConnect.state.accountId" />
                </div>
            </header>
        </div>
    </section>
</template>

<style scoped>
section {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
}

header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 140px;
}

.tabs {
    display: flex;
    align-items: center;
    gap: 40px;
}

.tabs a {
    color: var(--tx-normal);
    font-size: 20px;
    font-weight: 500;
    text-transform: uppercase;
}
</style>