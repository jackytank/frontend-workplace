<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Button, Table } from 'ant-design-vue';
import { userTableColumns } from './user-table-columns';
import { UserPagiType, UserType } from '../../types/global';
import { useCommonStore } from '../../store/common-store';

const commonStore = useCommonStore();
const users = ref<UserPagiType>();

onMounted(() => {

});

onUnmounted(() => {
    console.log('UserPage unmounted');
});
</script>
<template>
    <h1>UserPage {{ commonStore.isLoading }}</h1>
    <Table :columns="userTableColumns" :loading="commonStore.isLoading" :row-key="(record: UserType) => record.id" :data-source="users?.data">
        <template #bodyCell="{ column, }">
            <template v-if="column.key === 'action'">
                <Button size="small" :danger="true">X</Button>
            </template>
        </template>
    </Table>
</template>
<style scoped></style>../../store/common-store../../store/common-store