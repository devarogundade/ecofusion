<script setup lang="ts">
import { ref, onMounted } from "vue";
import { allAccounts, allProjects } from '@/scripts/data';
import type { Account, Project } from "@/types";

import Message from "@/components/Message.vue";
import { useAccountStore } from "@/stores/account";

const loading = ref(false);
const accounts = ref<Account[]>([]);
const projects = ref<Project[]>([]);
const accountStore = useAccountStore();

onMounted(async () => {
    loading.value = true;
    accounts.value = await allAccounts();
    projects.value = await allProjects();
    loading.value = false;
});
</script>

<template>
    <section>
        <div class="app_width">
            <Message v-if="loading" :text="'Loading...'" />
            <div class="board" v-else-if="accountStore.account">
                <div class="sidebar">
                    <div class="me">
                        <img :src="accountStore.account.image" alt="">
                        <h3>{{ accountStore.account.name }}</h3>
                        <p>{{ accountStore.account.address }}</p>
                    </div>

                    <div class="accounts">
                        <div class="account" v-for="account in accounts">
                            <img :src="account.image" alt="">
                            <p>{{ account.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
div {
    color: var(--tx-normal);
    margin-bottom: 30px;
}

img {
    border-radius: 50%;
}
</style>