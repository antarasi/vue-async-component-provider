# vue-async-component-provider

### Vue Options API Example

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/antarasi/vue-async-component-provider/tree/main/examples/options-api?file=src%2FApp.vue)

#### Parent Component
```vue
<script lang="ts">
import { AsyncComponentProvider } from 'vue-async-component-provider'
import Child from './components/Child.vue'
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    AsyncComponentProvider,
    Child,
  },
  methods: {
    onAllResolved() {
      console.log('All resolved')
    },
    onLoadingStarted() {
      console.log('Loading started')
    },
  },
})
</script>

<template>
  <AsyncComponentProvider :resolve-once="resolveOnce" @resolved="onAllResolved" @loading="onLoadingStarted">
    <ul>
      <Child v-for="i in 20" :key="i" />
    </ul>

    <template #fallback>
      <div>Multiple Components Loading...</div>
    </template> 
  </AsyncComponentProvider>
</template>

```

#### Child component
```vue
<template>
    <li>Child #{{ $.uid }} - {{ content }}</li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Child',
  data() {
    return {
      content: 'Loading...',
      resolveTime: Math.floor(Math.random() * 3000) + 1000, // 1-4 seconds
    }
  },
  inject: ['asyncComponentLoading', 'asyncComponentResolved'],
  created() {
      this.asyncComponentLoading(this)
  },
  mounted() {
    setTimeout(() => {
      this.content = 'Loaded in ' + this.resolveTime + 'ms'
      this.asyncComponentResolved(this)
    }, this.resolveTime)
  },
})
</script>
```