<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    loading: {
        type: Boolean,
    }
});
</script>

<template>
    <button>{{ loading ? 'Loading..' : props.text }}</button>
</template>

<style scoped>
button {
    border-radius: 16px;
    border: 1px solid #414C44;
    background: var(--primary-gradient);
    height: 60px;
    padding: 0 20px;
    cursor: pointer;
    color: var(--tx-normal);
    font-size: 20px;
    font-weight: 500;
}
</style>