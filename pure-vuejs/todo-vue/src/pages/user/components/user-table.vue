<script setup lang="ts">
import { Button, Table } from 'ant-design-vue';
import { useCommonStore } from '../../../store/common-store';
import { UserType } from '../../../types/global';
import { userTableColumns } from './user-table-columns';
import { useUsersStore } from '../../../store/users-store';

defineProps<{
    deleteBtnContent: string;
}>();

const { isLoading } = useCommonStore();
const { users, deleteUser } = useUsersStore();

const handleDeleteClick = (record: UserType) => {
    console.log('record', record);
    deleteUser(record)
}

</script>

<template>
    <Table :columns="userTableColumns" :loading="isLoading" :row-key="(record: UserType) => record.id" :data-source="users?.data">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <Button size="small" :danger="true" @click="handleDeleteClick(record as any)">{{ deleteBtnContent }}</Button>
            </template>
        </template>
    </Table>
</template>

<style scoped></style>