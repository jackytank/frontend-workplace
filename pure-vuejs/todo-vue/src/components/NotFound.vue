<script setup lang="ts">
</script>

<template>
    <a-result status="404" title="404" sub-title="Sorry, the page you looking for is not exist!">
        <template #extra>
            <a-button type="primary">
                <RouterLink to="/">Go to Home</RouterLink>
            </a-button>
        </template>
    </a-result>
</template>

<style scoped></style>
