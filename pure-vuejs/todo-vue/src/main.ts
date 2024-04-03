import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/router';
import { createPinia } from 'pinia';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
