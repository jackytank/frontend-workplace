<template>
  <Card title="Select Month" size="small" class="my-card">
    <select v-model="selectedMonth" style="width: 10rem; margin-right: 1rem;">
      <option v-for="month in months" :key="month" :value="month">
        {{ month }}
      </option>
    </select>
    <Button type="primary" @click="onClick">Change</Button>
  </Card>
  <Card title="Response Data API" size="small" class="my-card">
    <pre>{{ JSON.stringify(respData, null, 2) }}</pre>
  </Card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from 'ant-design-vue/es/button';
import { sessionKey } from '../../util/constant';
import { SettingType } from '../../types/global';
import { BaseResponse } from '../../rest-api/v1/hello';
import { Card, message } from 'ant-design-vue';
import { RequestBody } from '../../rest-api/v1/file';
const selectedMonth = ref(0);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const respData = ref<any>();

const onClick = async () => {
  console.log(`Selected month: ${selectedMonth.value}`);
  updateSession(selectedMonth.value);
  await updateStartMonthSettingFile('myuser', selectedMonth.value);
};

onMounted(() => {
  fetchHelloWorldApi();
});

const fetchHelloWorldApi = async () => {
  const resp = await fetch('/rest-api/v1/hello');
  const data = await resp.json() as BaseResponse;
  respData.value = data;
};

const updateSession = (month: number) => {
  const setting = JSON.parse(sessionStorage.getItem(sessionKey.settingOfCommonScreen) ?? '{}') as unknown as SettingType;
  const newSetting: SettingType = {
    ...setting,
    MyUserSetting: {
      ...setting.MyUserSetting,
      StartMonth: month ?? setting.MyUserSetting.StartMonth
    }
  };
  sessionStorage.setItem(sessionKey.settingOfCommonScreen, JSON.stringify(newSetting));
  message.success('Successfully updated session');
};

const updateStartMonthSettingFile = async (userId: string, month: number) => {
  const existingSettingResp = await fetch(`/public/resources/user/${userId}/setting.json`);
  const existingSetting = await existingSettingResp.json() as SettingType;
  let reqBody: RequestBody;
  if (existingSetting) {
    reqBody = {
      userId,
      content: {
        ...existingSetting,
        MyUserSetting: {
          ...existingSetting.MyUserSetting,
          StartMonth: month
        }
      }
    };
  } else {
    reqBody = {
      userId,
      content: {
        MyUserSetting: {
          name: 'My New User Setting',
          private: false,
          StartMonth: month
        }
      }
    };
  }
  const response = await fetch(`/rest-api/v1/file`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  });
  console.log('Response:', response);
  if (response.ok) {
    message.success('Successfully updated setting file');
  } else {
    message.error('Failed to update setting file');
  }
}

</script>

<style scoped lang="scss">
$border-radius: 0.5rem;

.container {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: $border-radius;
  display: flex;
  justify-content: left;
  align-items: start;
  flex-direction: column;
  margin-bottom: 2rem;

}
select {
  border-radius: $border-radius;
  padding: 0.5rem;
  font-size: 1rem;
  margin-right: 1rem;
  min-width: 10rem;
  margin-bottom: 1rem;
}

.my-card {
  margin-bottom: 1rem;
  border-radius: $border-radius;
}
</style>