<script setup lang="ts">
import { useCommonStore } from '../../../store/common-store';
import { UserType } from '../../../types/global';

const commonStore = useCommonStore();

</script>

<template>
    <Table :columns="userTableColumns" :loading="commonStore.isLoading" :row-key="(record: UserType) => record.id" :data-source="usersStore.users?.data">
        <template #bodyCell="{ column, }">
            <template v-if="column.key === 'action'">
                <Button size="small" :danger="true">X</Button>
            </template>
        </template>
    </Table>
</template>