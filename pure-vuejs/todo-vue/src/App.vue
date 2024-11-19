<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem, Layout, LayoutContent, LayoutFooter, LayoutHeader, Menu, MenuItem } from 'ant-design-vue';
import { MenuTheme } from 'ant-design-vue/es/menu/src/interface';
import { onMounted, ref } from 'vue';
import { initDefaultSettingToSession } from './util/helper';
import { menuItems } from './routes/router';

const theme = ref<MenuTheme>('light');
const selectedKeys = ref<string[]>(['0']);

onMounted(() => {
  initDefaultSettingToSession();
})
</script>

<template>
  <Layout>
    <LayoutHeader :style="{ backgroundColor: theme === 'light' ? 'white' : theme }">
      <Menu v-model:selectedKeys="selectedKeys" mode="horizontal" :style="{ lineHeight: '64px' }" :theme="theme">
        <MenuItem v-for="item in menuItems" :key="item.path">
          <RouterLink :to="item.path">{{ item.path }}</RouterLink>
        </MenuItem>
      </Menu>
    </LayoutHeader>
    <LayoutContent style="padding: 0 20px">
      <Breadcrumb style="margin: 16px 0">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>{{ $route.path.replace('/', '') }}</BreadcrumbItem>
      </Breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '80vh' }">
        <RouterView />
      </div>
    </LayoutContent>
    <LayoutFooter style="text-align: center">
      Ant Design @2024
    </LayoutFooter>
  </Layout>
</template>

<style scoped></style>
