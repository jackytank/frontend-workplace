<script setup lang="ts">
import { FacebookOutlined } from '@ant-design/icons-vue';
import { Breadcrumb, BreadcrumbItem, Layout, LayoutContent, LayoutFooter, LayoutHeader, Menu, MenuItem } from 'ant-design-vue';
import { MenuTheme } from 'ant-design-vue/es/menu/src/interface';
import { ref } from 'vue';

const theme = ref<MenuTheme>('light');
const selectedKeys = ref<string[]>(['0']);
</script>

<template>
  <Layout>
    <LayoutHeader :style="{ backgroundColor: theme === 'light' ? 'white' : theme }">
      <Menu v-model:selectedKeys="selectedKeys" mode="horizontal" :style="{ lineHeight: '64px' }" :theme="theme">
        <MenuItem key="0">
        <RouterLink to="/">
          <FacebookOutlined style="font-size: 20px;" />
        </RouterLink>
        </MenuItem>
        <MenuItem key="1">
        <RouterLink to="/user">Go to User</RouterLink>
        </MenuItem>
        <MenuItem key="2">
        <RouterLink to="/employee">Go to Employee</RouterLink>
        </MenuItem>
        <MenuItem key="3">
        <RouterLink to="/todo">Todo</RouterLink>
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
      Ant Design ©2018 Created by Ant UED
    </LayoutFooter>
  </Layout>
</template>

<style scoped></style>
