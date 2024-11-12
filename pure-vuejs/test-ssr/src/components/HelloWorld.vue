<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

watchEffect(() => {
  console.log('count:', count.value)
  console.log('doubleCount:', doubleCount.value)
})

const handleClick = () => {
  count.value++
}

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}, double: {{ doubleCount }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
