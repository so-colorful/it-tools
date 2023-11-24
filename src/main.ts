import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import VXETable from 'vxe-table'
import VueCookies from "vue-cookies";
import 'vxe-table/lib/style.css'
import { registerSW } from 'virtual:pwa-register';
import { plausible } from './plugins/plausible.plugin';

import 'virtual:uno.css';

import { naive } from './plugins/naive.plugin';

import App from './App.vue';
import router from './router';
import { i18nPlugin } from './plugins/i18n.plugin';

registerSW();

const app = createApp(App);
app.config.globalProperties.$cookies = VueCookies
app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);
app.use(router);
app.use(naive);
app.use(plausible);
app.use(VXETable);
app.mount('#app');
