<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
        required: true
    }
});
</script>

<template>
    <div>
        <p>{{ props.text }}</p>
    </div>
</template>

<style scoped>
div {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
}

p {
    color: var(--tx-normal);
    font-weight: 500;
    font-size: 20px;
}
</style>