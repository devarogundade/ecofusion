<script setup lang="ts">
import Button from '@/components/Button.vue';
import { allResources, newReserve } from '@/scripts/data';
import { useWalletConnect } from '@/scripts/wallet-connect-client';
import { useToast } from 'vue-toast-notification';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { initReserve } from '@/scripts/hedera';

const walletConnect = useWalletConnect();
const toast = useToast({ duration: 4000, position: "top" });

const router = useRouter();

const form = ref({
    name: '',
    resource: '',
    price: 0
});
const submitting = ref(false);

const onResourceChange = (event: any) => {
    const value = event.target?.value;
    if (value) {
        form.value.resource = event.target?.value;
    }
};

const createReserve = async () => {
    if (walletConnect.state.accountId == '') {
        toast.error('Please connect your wallet');
        return;
    }

    if (form.value.name == '') {
        toast.error('Reserve name is required');
        return;
    }

    if (form.value.resource == '') {
        toast.error('Reserve resource is required');
        return;
    }

    if (form.value.price == 0) {
        toast.error('Reserve price is required');
        return;
    }

    submitting.value = true;

    const hash = await initReserve(
        form.value.resource,
        form.value.price
    );

    if (hash) {
        await newReserve({
            name: form.value.name,
            price: form.value.price,
            resource: form.value.resource,
            units: 0,
            address: "",
            lpToken: ""
        });

        toast.success('Resource created');

        form.value.name = '';
        form.value.resource = '';
        form.value.price = 0;

        router.push('/marketplace');
    } else {
        toast.error('Something went wrong');
    }

    submitting.value = false;
};
</script>

<template>
    <section>
        <div class="app_width">
            <div class="reserve">
                <div class="reserve_title">
                    <h3>Create new reserve</h3>
                    <p>Establish a reserve with your unique preference!</p>
                </div>

                <div class="form">
                    <div class="input">
                        <label>Name *</label>
                        <input type="text" v-model="form.name">
                    </div>

                    <div class="input">
                        <label>Resource type *</label>
                        <select @change="onResourceChange">
                            <option v-for="resource in allResources()" :value="resource.address">
                                {{ resource.name }}
                            </option>
                        </select>
                    </div>

                    <div class="input">
                        <label>Price (Hbar) *</label>
                        <input type="number" v-model="form.price">
                    </div>
                </div>

                <Button :loading="submitting" :text="'Create'" @click="createReserve" />
            </div>
        </div>
    </section>
</template>

<style scoped>
.reserve {
    padding-top: 20px;
}

.reserve_title {
    text-align: center;
}

.reserve_title h3 {
    color: #ACDCBD;
    text-align: center;
    font-size: 28px;
    font-weight: 500;
}

.reserve_title p {
    color: #FFF;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
}

.input_split {
    display: grid;
    grid-template-columns: repeat(2, 500px);
    gap: 40px;
}

.form label {
    color: #FFF;
    font-size: 18px;
    font-weight: 500;
    margin-top: 30px;
}

.form {
    margin-bottom: 30px;
}

.input {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input,
select {
    border-radius: 15px;
    border: 1px solid #31513E;
    background: rgba(4, 38, 16, 0.23);
    width: 750px;
    max-width: 100%;
    height: 68px;
    outline: none;
    color: #FFF;
    font-size: 18px;
    font-weight: 500;
    padding: 0 20px;
}

option {
    color: #000;
}

.input span {
    color: var(--tx-dimmed);
    font-size: 14px;
}
</style>