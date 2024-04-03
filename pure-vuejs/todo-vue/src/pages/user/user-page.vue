<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Button, Table } from 'ant-design-vue';
import { userTableColumns } from './user-table-columns';
import { UserType } from '../../types/global';
import { useCommonStore } from '../../store/common-store';
import { useUsersStore } from '../../store/users-store';

const commonStore = useCommonStore();
const usersStore = useUsersStore();

onMounted(() => {
    usersStore.fetchUserApi({
        page: 1,
        perPage: 3,
    });
});

onUnmounted(() => {
    console.log('UserPage unmounted');
});
</script>
<template>
    <h1>UserPage {{ commonStore.isLoading }}</h1>
    <Table :columns="userTableColumns" :loading="commonStore.isLoading" :row-key="(record: UserType) => record.id" :data-source="usersStore.users?.data">
        <template #bodyCell="{ column, }">
            <template v-if="column.key === 'action'">
                <Button size="small" :danger="true">X</Button>
            </template>
        </template>
    </Table>
</template>
<style scoped></style>