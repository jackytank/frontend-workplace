<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useCommonStore } from '../../store/common-store';
import { useUsersStore } from '../../store/users-store';
import UserTable from './components/user-table.vue';

const { isLoading } = useCommonStore();
const { fetchUserApi } = useUsersStore();

onMounted(() => {
    fetchUserApi({
        page: 1,
        perPage: 10,
    });
});

onUnmounted(() => {
    console.log('UserPage unmounted');
});
</script>
<template>
    <h1>UserPage {{ isLoading }}</h1>
    <UserTable delete-btn-content="X" />
</template>
<style scoped></style>