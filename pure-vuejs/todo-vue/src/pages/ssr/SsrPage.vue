<template>
    <div class="container">
    <select v-model="selectedMonth">
      <option v-for="month in months" :key="month" :value="month">
        {{ month }}
      </option>
    </select>
    <Button type="primary" @click="onClick">Change</Button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'ant-design-vue/es/button';
import { sessionKey } from '../../util/constant';
import { SettingType } from '../../types/global';
const selectedMonth = ref(0);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const onClick = () => {
  console.log(`Selected month: ${selectedMonth.value}`);
  updateSession(selectedMonth.value);
};

const updateSession = (month: number) => {
  const setting = JSON.parse(sessionStorage.getItem(sessionKey.settingOfCommonScreen) ?? '{}') as unknown as SettingType
  const newSetting: SettingType = {
    ...setting,
    StartMonth: month ?? setting.StartMonth
  };
  sessionStorage.setItem(sessionKey.settingOfCommonScreen, JSON.stringify(newSetting));
}

</script>

<style scoped lang="scss">
.container{
    display: flex;
    justify-content: left;
    align-items: start;
    flex-direction: column;
    
    select {
      padding: 0.5rem;
      font-size: 1rem;
      margin-right: 1rem;
      min-width: 10rem;
      margin-bottom: 1rem;
    }
}
</style>