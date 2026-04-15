import { createApp } from 'vue';
import ExpertApp from './ExpertApp.vue';
import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';
import './styles/main.css';

createApp(ExpertApp).mount('#app');