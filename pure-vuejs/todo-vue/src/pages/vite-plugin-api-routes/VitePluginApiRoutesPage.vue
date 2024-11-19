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
    <pre>{{ jsonData }}</pre>
    <Button size="small" type="dashed" @click="copyToClipboard(jsonData)"
    >Copy</Button>
  </Card>
  <Card title="Copy Image" size="small" class="my-card">
    <img :src="imageSrc" alt="Non Coi Male" />
    <Button size="small" type="dashed" @click="copyImageToClipboard(imageSrc)"
    >Copy</Button>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { sessionKey } from '../../util/constant';
import { SettingType } from '../../types/global';
import { BaseResponse } from '../../rest-api/v1/hello';
import { Card, message, Button } from 'ant-design-vue';
import { RequestBody } from '../../rest-api/v1/file';
const selectedMonth = ref(0);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const respData = ref<any>();
const imageSrc = 'data:image/jpeg;base64,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';

const onClick = async () => {
  console.log(`Selected month: ${selectedMonth.value}`);
  updateSession(selectedMonth.value);
  await updateStartMonthSettingFile('myuser', selectedMonth.value);
};

const jsonData = computed(() => JSON.stringify(respData.value, null, 2));

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  message.success('Copied to clipboard');
};

// copy jpeq image to clipboard
const copyImageToClipboard= async (src: string) => {
  const covertedPngImage = new Image();
  covertedPngImage.src = src;
  covertedPngImage.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = covertedPngImage.width;
    canvas.height = covertedPngImage.height;
    ctx?.drawImage(covertedPngImage, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]);
        message.success('Copied image to clipboard');
      } else {
        message.error('Failed to copy image to clipboard');
      }
    })
  }
}

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