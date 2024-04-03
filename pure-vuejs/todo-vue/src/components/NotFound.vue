<script setup lang="ts">
</script>

<template>
    <a-result status="404" title="404" sub-title="Sorry, the life you having is meaningless">
        <template #extra>
            <a-button type="primary">
                <RouterLink to="/user">Go to Home</RouterLink>
            </a-button>
        </template>
    </a-result>
</template>

<style scoped></style>
