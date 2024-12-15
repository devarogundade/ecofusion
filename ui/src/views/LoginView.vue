<script setup lang="ts">
import CloseIcon from '@/components/icons/CloseIcon.vue';
import WalletConnect from '@/components/icons/WalletConnect.vue';

import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useWalletConnect, openWalletConnectModal } from '@/scripts/wallet-connect-client';
import { getAccount } from '@/scripts/data';
import { useAccountStore } from '@/stores/account';

const router = useRouter();
const walletConnect = useWalletConnect();
const accountStore = useAccountStore();

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
    <section>
        <div class="app_width">
            <div class="login">
                <div class="form">
                    <div class="form_header">
                        <p>Connect Wallet</p>
                        <RouterLink to="/">
                            <CloseIcon />
                        </RouterLink>
                    </div>
                    <div class="wallets">
                        <p>Available Wallet</p>
                        <div class="wallet" @click="openWalletConnectModal">
                            <WalletConnect />
                            <p>Wallet Connect</p>
                        </div>
                    </div>
                    <div class="learn">
                        <p>What is a wallet? <a href="">Learn more.</a></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.login {
    display: flex;
    justify-content: center;
}

.form {
    width: 570px;
    border-radius: 15px;
    border: 1px solid var(--Sec-stroke, #414C44);
    background: #011608;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.30);
    overflow: hidden;
}

.form_header {
    width: 100%;
    height: 95px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #011107;
    padding: 0 20px
}

.form_header p {
    color: var(--tx-normal);
    font-size: 24px;
    font-weight: 500;
}

.wallets {
    padding: 40px;
}

.wallets>p {
    color: var(--tx-dimmed);
    font-size: 18px;
    font-weight: 500;
}

.wallet {
    border-radius: 8px;
    border: 1px solid #1B231E;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    cursor: pointer;
    padding: 0 16px;
    height: 60px;
}

.wallet p {
    color: var(--tx-normal);
    font-size: 20px;
    font-weight: 500;
}

.learn {
    padding: 30px;
    text-align: center;
}

.learn p {
    color: #7A7A7A;
    font-size: 18px;
    font-weight: 500;
}

.learn p a {
    color: var(--primary);
}
</style>