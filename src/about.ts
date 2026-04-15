import { createApp } from 'vue';
import AboutApp from './AboutApp.vue';
import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';
import './styles/main.css';

createApp(AboutApp).mount('#app');