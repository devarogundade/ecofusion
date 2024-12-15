<script setup lang="ts">
import Button from '@/components/Button.vue';
import UserIcon from '@/components/icons/UserIcon.vue';

import type { Project } from '@/types';

import { allProjects } from '@/scripts/data';
import { onMounted, ref } from 'vue';
import Message from '@/components/Message.vue';

const loading = ref(false);
const projects = ref<Project[]>([]);

onMounted(async () => {
    loading.value = true;
    projects.value = await allProjects();
    loading.value = false;
});
</script>

<template>
    <section>
        <div class="app_width">
            <Message v-if="loading" :text="'Loading...'" />
            <Message v-else-if="!loading && projects.length == 0" :text="'No Projects Found.'" />
            <div class="projects" v-else>
                <div class="project" v-for="project in projects" :key="project.id">
                    <img :src="project.image" :alt="project.name">
                    <div class="project_text">
                        <div class="stats">
                            <div class="stat">
                                <p>Goal:</p>
                                <p>{{ project.goal }} Hbar</p>
                            </div>
                            <div class="stat">
                                <p>Raised:</p>
                                <p>{{ project.raised }} Hbar</p>
                            </div>
                            <div class="stat">
                                <p>To Go:</p>
                                <p>{{ project.goal - project.raised }} Hbar</p>
                            </div>
                        </div>
                        <h3 class="name">{{ project.name }}</h3>
                        <p class="description">{{ project.description }}</p>
                        <div class="about">
                            <div class="owner">
                                <UserIcon />
                                <p>{{ project.owner }}</p>
                            </div>

                            <RouterLink :to="`/donations/${project.id}`">
                                <Button :text="'Donate Now'" />
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.projects {
    display: flex;
    flex-wrap: wrap;
    gap: 80px;
}

.project {
    width: 348px;
    border-radius: 16px;
    overflow: hidden;
    background: #042610;
}

.project img {
    width: 100%;
    height: 169px;
    object-fit: cover;
}

.project_text {
    padding: 20px;
}

.stats {
    display: flex;
    align-items: center;
    gap: 20px;
}

.stat {
    border-radius: 6px;
    border: 0.5px solid #414C44;
    background: #022D11;
    padding: 4px 8px;
    width: 140px;
}

.stat p {
    color: #ABB0A8;
}

.stat p:first-child {
    font-size: 10px;
    font-weight: 400;
}

.stat p:last-child {
    font-size: 12px;
    font-weight: 400;
}

.name {
    margin-top: 16px;
    color: #E4E2E2;
    font-size: 14px;
    font-weight: 700;
}

.description {
    margin-top: 26px;
    color: #ABB0A8;
    font-size: 12px;
    font-weight: 600;
    text-overflow: hidden;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 50px;
}

.about {
    margin-top: 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.owner {
    display: flex;
    align-items: center;
    gap: 10px;
}

.owner p {
    color: #ABB0A8;
    font-size: 10px;
    font-weight: 600;
}

.about button {
    height: 36px;
    font-size: 12px;
    border-radius: 6px;
    padding: 0 16px;
}
</style>