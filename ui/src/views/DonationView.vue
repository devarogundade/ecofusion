<script setup lang="ts">
import Button from '@/components/Button.vue';
import { getProject, incrementRaised } from '@/scripts/data';
import { useWalletConnect } from '@/scripts/wallet-connect-client';
import { useToast } from 'vue-toast-notification';
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { donateToProject } from '@/scripts/hedera';
import type { Project } from '@/types';
import Message from '@/components/Message.vue';
import { Hbar } from '@hashgraph/sdk';

const walletConnect = useWalletConnect();
const toast = useToast({ duration: 4000, position: "top" });

const route = useRoute();
const router = useRouter();

const project = ref<Project | null>(null);
const loading = ref(false);

const form = ref({
    amount: 0,
    message: ''
});

const donating = ref(false);

const donate = async () => {
    if (walletConnect.state.accountId == '') {
        toast.error('Please connect your wallet');
        return;
    }

    if (!project) {
        toast.error('Project is required');
        return;
    }

    if (form.value.amount == 0) {
        toast.error('Donation amount is required');
        return;
    }

    donating.value = true;

    const hash = await donateToProject(
        Number(route.params.id),
        new Hbar(form.value.amount),
        form.value.message
    );

    if (hash) {
        await incrementRaised(
            Number(route.params.id),
            form.value.amount
        );

        toast.success('Donation successful!');

        form.value.amount = 0;

        router.push('/projects');
    } else {
        toast.error('Something went wrong');
    }

    donating.value = false;
};

onMounted(async () => {
    loading.value = true;
    project.value = await getProject(Number(route.params.id));
    loading.value = false;
});
</script>

<template>
    <section>
        <div class="app_width">
            <Message :text="'Loading...'" v-if="loading" />
            <Message :text="'No project!'" v-else-if="!project" />

            <div class="donate" v-else-if="project">
                <div class="donation">
                    <div class="donation_title">
                        <h3>Make donation</h3>
                        <p>Support changemakers tackling climate change
                            with innovative solutions.Establish a donation with your unique preference!</p>
                    </div>

                    <div class="form">
                        <div class="input">
                            <label>Project name *</label>
                            <input type="text" disabled v-model="project.name">
                        </div>

                        <div class="input_spilt">
                            <div class="input">
                                <label>Choose a coin *</label>
                                <select>
                                    <option value="habr">Hbar</option>
                                </select>
                            </div>

                            <div class="input">
                                <label>Coin amount *</label>
                                <input type="number" v-model="form.amount">
                            </div>
                        </div>

                        <div class="input">
                            <label>Message to Global change maker</label>
                            <textarea rows="10" type="text" v-model="form.message" placeholder="(Optional)"></textarea>
                        </div>

                    </div>
                </div>

                <div class="summary">
                    <div class="summary_title">
                        <h3>Donation Summary</h3>
                    </div>

                    <div class="summary_text">
                        <p>Amount: </p>
                        <p>{{ form.amount }} Hbar</p>
                    </div>

                    <div class="summary_text">
                        <p>{{ project.name }} receives: </p>
                        <p>{{ form.amount }} Hbar</p>
                    </div>

                    <div class="summary_action">
                        <Button :text="'Continue'" @click="donate" :loading="donating" />

                        <span>
                            By selecting continue you agree to our <a href="">terms and conditions</a>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.donate {
    display: grid;
    grid-template-columns: 1fr 516px;
    gap: 100px;
}

.donation {
    padding-top: 20px;
}

.donation_title {
    text-align: center;
}

.donation_title h3 {
    color: #ACDCBD;
    text-align: center;
    font-size: 28px;
    font-weight: 500;
}

.donation_title p {
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

textarea {
    border-radius: 15px;
    border: 1px solid #31513E;
    background: rgba(4, 38, 16, 0.23);
    resize: none;
    outline: none;
    color: var(--tx-normal);
    font-size: 18px;
    font-weight: 500;
    padding: 20px;
}

.summary {
    margin-top: 100px;
    border-radius: 14px;
    border: 1px solid #31513E;
    background: #011608;
    box-shadow: 0px 3.6px 3.6px 0px rgba(0, 0, 0, 0.30);
    overflow: hidden;
    height: fit-content;
}

.summary_title {
    background: #011107;
    padding: 10px 20px;
}

.summary_title h3 {
    color: #CDD5CD;
    font-size: 21.6px;
    font-weight: 500;
}

.summary_text {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.summary_text p:first-child {
    color: #CDD5CD;
    font-size: 16px;
    font-weight: 500;
}

.summary_text p:last-child {
    color: #CDD5CD;
    font-size: 12px;
    font-weight: 400;
}

.summary_action {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
}

.summary_action span {
    color: #CDD5CD;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
}

.summary_action a {
    color: #2F6B06;
}
</style>