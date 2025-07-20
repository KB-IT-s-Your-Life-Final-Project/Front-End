import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { usePWAStore } from './stores/pwa';

const app = createApp(App);

app.use(createPinia());
app.use(router);

// PWA 스토어 초기화
const pwaStore = usePWAStore();
pwaStore.initialize();

app.mount('#app');
