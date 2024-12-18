<script setup lang="ts">
import Button from '@/components/Button.vue';
import ChartView from '@/components/ChartView.vue';
import FlagIcon from '@/components/icons/FlagIcon.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import SwapIcon from '@/components/icons/SwapIcon.vue';
import Message from '@/components/Message.vue';

import { allReserves, allResources, allTransactions, decrementUnits, incrementUnits, newTransaction } from '@/scripts/data';
import { useWalletConnect, walletConnectWallet } from '@/scripts/wallet-connect-client';
import { AccountType, type Reserve, type Resource, type Transaction } from '@/types';
import { addLiquidity, trade, mintToken } from '@/scripts/hedera';
import { MirrorNodeClient } from '@/scripts/mirror-node-client';
import { networkConfig } from '@/scripts/networks';
import { useAccountStore } from '@/stores/account';
import { useToast } from 'vue-toast-notification';
import { TokenId } from '@hashgraph/sdk';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const accountStore = useAccountStore();
const reserves = ref<Reserve[]>([]);
const transactions = ref<Transaction[]>([]);
const selectedReserve = ref<Reserve | null>(null);
const selectedResource = ref<Resource | null>(null);
const loading = ref(false);
const buying = ref(false);
const selling = ref(false);
const minting = ref(false);
const mirrorNode = new MirrorNodeClient(networkConfig.testnet);

const form = ref({
    units: 0,
    associateToken: false
});

const walletConnect = useWalletConnect();
const toast = useToast({ duration: 4000, position: "top" });

const onReserveChange = async (event: any) => {
    const value = event.target?.value;

    if (value) {
        const reserve = reserves.value.find(a => a.address == value);

        if (!reserve) return router.push('/');

        selectedReserve.value = reserve;
    }
};

const onResourceChange = async (event: any) => {
    const value = event.target?.value;

    if (value) {
        const resource = allResources().find(a => a.address == value);
        if (!resource) return router.push('/');

        selectedResource.value = resource;

        reserves.value = await allReserves(selectedResource.value.address);

        if (reserves.value.length > 0) selectedReserve.value = reserves.value[0];
    }
};

const mint = async () => {
    if (walletConnect.state.accountId == '') {
        toast.error('Please connect your wallet');
        return;
    }

    if (!selectedResource.value) {
        toast.error('Please select a resource');
        return;
    }

    minting.value = true;

    if (form.value.associateToken) {
        await walletConnectWallet.associateTokens(
            [TokenId.fromString(selectedResource.value.token)]
        );
    }

    const resource = await mirrorNode.getAccountInfo(selectedResource.value.address);

    const { hash } = await mintToken(resource.account, 1_000_000);

    if (hash) {
        toast.success('Token minted');
    } else {
        toast.error('Something went wrong');
    }

    minting.value = false;
};

const buy = async () => {
    if (walletConnect.state.accountId == '') {
        toast.error('Please connect your wallet');
        return;
    }

    if (form.value.units == 0) {
        toast.error('Please enter a valid amount');
        return;
    }

    if (!selectedResource.value) {
        toast.error('Please select a resource');
        return;
    }

    if (!selectedReserve.value) {
        toast.error('Please select a reserve');
        return;
    }

    buying.value = true;

    if (form.value.associateToken) {
        await walletConnectWallet.associateTokens(
            [TokenId.fromString(selectedResource.value.token)]
        );
    }

    const { hash } = await trade(
        selectedReserve.value.address,
        form.value.units * selectedReserve.value.price
    );

    if (hash) {
        newTransaction({
            hash: hash.toString(),
            account: walletConnect.state.accountId,
            type: true,
            reserve: selectedReserve.value.address,
            price: selectedReserve.value.price * form.value.units,
            uints: form.value.units,
            date: new Date(Date.now())
        });

        await decrementUnits(
            selectedReserve.value.address,
            form.value.units
        );

        form.value.units = 0;

        toast.success('Trade successful!');

        transactions.value = await allTransactions(selectedReserve.value.address);
    } else {
        toast.error('Something went wrong');
    }

    buying.value = false;
};

const sell = async () => {
    if (walletConnect.state.accountId == '') {
        toast.error('Please connect your wallet');
        return;
    }

    if (form.value.units == 0) {
        toast.error('Please enter a valid amount');
        return;
    }

    if (!selectedResource.value) {
        toast.error('Please select a resource');
        return;
    }

    if (!selectedReserve.value) {
        toast.error('Please select a reserve');
        return;
    }

    selling.value = true;

    if (form.value.associateToken) {
        await walletConnectWallet.associateTokens(
            [
                TokenId.fromSolidityAddress(selectedReserve.value.lpToken)
            ]
        );
    }

    const reserve = await mirrorNode.getAccountInfo(selectedReserve.value.address);

    await walletConnectWallet.approveToken(
        TokenId.fromString(selectedResource.value.token),
        reserve.account,
        form.value.units * 10 ** 2
    );

    const { hash } = await addLiquidity(reserve.account, form.value.units * 10 ** 2);

    if (hash) {
        newTransaction({
            hash: hash.toString(),
            account: walletConnect.state.accountId,
            type: false,
            reserve: selectedReserve.value.address,
            price: selectedReserve.value.price * form.value.units,
            uints: form.value.units,
            date: new Date(Date.now())
        });

        await incrementUnits(
            selectedReserve.value.address,
            form.value.units
        );

        form.value.units = 0;

        toast.success('Liquidity added successful!');

        transactions.value = await allTransactions(selectedReserve.value.address);
    } else {
        toast.error('Something went wrong');
    }

    selling.value = false;
};

onMounted(async () => {
    loading.value = true;

    if (!accountStore.account) return router.push('/login');

    if (allResources().length > 0) selectedResource.value = allResources()[0];
    if (!selectedResource.value) return router.push('/');

    reserves.value = await allReserves(selectedResource.value.address);

    if (reserves.value.length > 0) selectedReserve.value = reserves.value[0];

    loading.value = false;
});

watch(selectedReserve, async () => {
    if (selectedReserve.value) {
        transactions.value = await allTransactions(selectedReserve.value.address);
    }
});
</script>

<template>
    <section>
        <div class="app_width">
            <Message :text="'Loading...'" v-if="loading" />
            <Message :text="'No reserve!'" v-else-if="!selectedReserve" />

            <div class="marketplace" v-else-if="accountStore.account && selectedReserve && selectedResource">
                <div class="toolbar">
                    <select @change="onResourceChange">
                        <option v-for="resource in allResources()" :value="resource.address">
                            {{ resource.name }} / Hbar
                        </option>
                    </select>

                    <div class="search">
                        <SearchIcon />
                        <input type="text" placeholder="Search" />
                    </div>
                </div>

                <div class="trade">
                    <div class="trade_info">
                        <div class="chart">
                            <div class="chart_header">
                                <h3>
                                    {{ selectedReserve.price }}Hbar per Kg
                                    <span>Available: {{ selectedReserve.units }}Kg</span>
                                </h3>

                                <div class="tabs">
                                    <div class="tab">1D</div>
                                    <div class="tab tab_active">7D</div>
                                    <div class="tab">1M</div>
                                    <div class="tab">6M</div>
                                    <div class="tab">All</div>
                                </div>
                            </div>

                            <ChartView />

                            <div class="transactions">
                                <div class="transactions_header">
                                    <p>Recent Transactions</p>
                                </div>

                                <table>
                                    <thead>
                                        <tr>
                                            <td>Transaction</td>
                                            <td>Amount</td>
                                            <td>Price</td>
                                            <td>Type</td>
                                            <td>Date</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody v-for="transaction in transactions" :key="transaction.hash">
                                        <tr>
                                            <td>
                                                <div>
                                                    <img :src="selectedResource.image" :alt="selectedResource.name">
                                                    <p>{{ selectedReserve.name }}</p>
                                                </div>
                                            </td>
                                            <td>{{ transaction.uints }}Kg</td>
                                            <td>{{ transaction.price }}Hbar</td>
                                            <td>{{ transaction.type ? "Buy" : "Sell" }}</td>
                                            <td>{{ Intl.DateTimeFormat("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric"
                                            }).format(transaction.date) }}</td>
                                            <td>
                                                <a target="_blank"
                                                    :href="`https://hashscan.io/testnet/transaction/${transaction.hash}`">View
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="trade_action">
                        <div class="ass_token">
                            <label for="">First time? associate tokens</label>
                            <input type="checkbox" v-model="form.associateToken" value="Associate token">
                        </div>

                        <div class="swap">
                            <div class="tabs">
                                <div class="tab tab_active">
                                    <SwapIcon />
                                    <P>Market</P>
                                </div>
                                <RouterLink to="/new-reserve">
                                    <div class="tab" v-if="accountStore.account.type == AccountType.Company">
                                        <FlagIcon />
                                        <p>New</p>
                                    </div>
                                </RouterLink>
                            </div>

                            <div class="swap_inputs" v-if="accountStore.account.type == AccountType.Individual">
                                <label>Select a reserve</label>

                                <select @change="onReserveChange">
                                    <option v-for="reserve in reserves" :value="reserve.address">
                                        {{ reserve.name }} ({{ reserve.price }} Hbar) ~ {{ reserve.units }}kg
                                    </option>
                                </select>

                                <label>Quantity (Kg)</label>
                                <input type="number" placeholder="Amount" v-model="form.units" />

                                <label>Price (Hbar) per Kg</label>
                                <input type="number" placeholder="Hbar" :value="selectedReserve.price" disabled />

                                <Button :text="'Buy'" :loading="buying" @click="buy" />
                            </div>

                            <div class="swap_inputs" v-else>
                                <label>Select a reserve</label>

                                <select @change="onReserveChange">
                                    <option v-for="reserve in reserves" :value="reserve.address">
                                        {{ reserve.name }} ({{ reserve.price }}Hbar) ~ {{ reserve.units }}kg
                                    </option>
                                </select>

                                <label>Quantity (Kg)</label>
                                <input type="number" placeholder="Amount" v-model="form.units" />

                                <label>Price (Hbar) per Kg</label>
                                <input type="number" placeholder="Hbar" v-model="selectedReserve.price" disabled />

                                <div class="buttons">
                                    <Button :text="'Sell'" :loading="selling" @click="sell" />
                                    <Button :text="'Mint'" :loading="minting" @click="mint" />
                                </div>
                            </div>
                        </div>

                        <div class="reserves">
                            <div class="reserves_title">
                                <h3>Reserves</h3>
                            </div>

                            <div class="reserve" v-for="reserve in reserves" :key="reserve.address">
                                <p class="name">{{ reserve.name }}</p>
                                <p>{{ reserve.units }} Kg</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.toolbar select {
    background: transparent;
    border: 1px solid #414C44;
    padding: 10px 16px;
    color: var(--tx-dimmed);
    text-align: center;
    font-size: 18px;
    font-weight: 500;
}

.toolbar .search {
    width: 405px;
    height: 50px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-radius: 8px;
    background: #BAE0CD;
}

.toolbar input {
    color: #062D14;
    font-size: 18px;
    font-weight: 500;
    width: 100%;
    border: none;
    outline: none;
    background: none;
}

.trade {
    display: grid;
    grid-template-columns: 1fr 334px;
    gap: 45px;
    margin-top: 20px;
}

.chart_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.chart_header h3 {
    color: var(--tx-normal);
    font-size: 32px;
    font-weight: 500;
}

.chart_header h3 span {
    color: var(--primary);
    font-size: 14px;
    font-weight: 600;
}

.chart_header .tabs {
    display: flex;
    align-items: center;
    border-radius: 10px;
    border: 1px solid #414C44;
}

.chart_header .tab {
    border-radius: 8px;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--tx-dimmed);
    font-size: 18px;
    font-weight: 600;
    height: 50px;
}

.chart_header .tab_active {
    background: var(--primary-gradient);
}

.transactions {
    margin-top: 40px;
}

.transactions_header {
    padding: 16px 0;
    border-bottom: 1px solid #2B2D2A;
}

.transactions_header p {
    color: var(--tx-normal);
    font-size: 20px;
    font-weight: 600;
}

table {
    width: 100%;
}

thead {
    height: 60px;
}

thead td {
    color: var(--tx-normal);
    font-size: 18px;
    font-weight: 600;
}

tbody {
    height: 60px;
}

tbody div {
    display: flex;
    align-items: center;
    gap: 10px;
}

tbody div img {
    width: 24px;
    height: 24px;
}

tbody td {
    color: #ABB0A8;
    font-size: 16px;
    font-weight: 600;
}

option {
    color: #06190B;
}

.trade_action {
    border-radius: 15px;
    border: 1px solid #1D2616;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    padding: 20px;
    height: fit-content;
}

.ass_token {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    margin-bottom: 30px;
}

.ass_token label {
    color: #ABB0A8;
    text-wrap: nowrap;
}

.swap {
    border-radius: 10px;
    border: 1px solid #101411;
    background: #06190B;
    padding: 20px;

}

.trade_action .tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.trade_action .tab {
    border-radius: 8px;
    border: 1px solid #414C44;
    padding: 6px 16px;
    color: var(--tx-dimmed);
    font-size: 16px;
    font-weight: 400;
    gap: 10px;
    display: flex;
    align-items: center;
}

.trade_action .tab_active {
    background: var(--primary-gradient);
}

.trade_action input {
    color: var(--tx-normal);
    font-size: 12px;
    font-weight: 600;
    width: 100%;
    outline: none;
    padding: 10px;
    background: none;
    border-radius: 8px;
    border: 1px solid #243421;
}

.swap_inputs label {
    color: var(--tx-dimmed);
    font-size: 12px;
    font-weight: 600;
}

.swap_inputs select {
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #243421;
    background: none;
    color: var(--tx-normal);
}

.swap_inputs {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 30px;
}

.swap_inputs button {
    width: fit-content;
    margin-top: 20px;
}

.reserves {
    margin-top: 40px;
}

.buttons {
    display: flex;
    align-items: center;
    gap: 10px
}

.reserves_title {}

.reserves_title h3 {
    color: var(--tx-normal);
    font-size: 20px;
    font-weight: 500;
}

.reserve {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--tx-dimmed);
    font-size: 12px;
    font-weight: 600;
    margin-top: 10px;
}

td a {
    color: var(--primary);
    font-size: 14px;
    font-weight: 600;
}
</style>