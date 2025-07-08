import type { App } from 'vue';
import AsyncComponentProvider from './components/AsyncComponentProvider.vue'

export { AsyncComponentProvider }

export default {
    install: (app: App) => {
      app.component('AsyncComponentProvider', AsyncComponentProvider);
    }
  };
  