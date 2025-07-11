# vue-async-component-provider

### Vue Composition API Example

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/antarasi/vue-async-component-provider/tree/main/examples/composition-api?file=src%2FApp.vue)

#### Parent Component

```vue
<script lang="ts">
import { AsyncComponentProvider } from 'vue-async-component-provider'
import Child from './components/Child.vue'
import { ref } from 'vue'

export default {
  name: 'App',
  components: {
    AsyncComponentProvider,
    Child,
  },
  setup() {
    function onAllResolved() {
      console.log('All resolved')
    }
    function onLoadingStarted() {
      console.log('Loading started')
    }

    return {
      onAllResolved,
      onLoadingStarted,
    }
  },
}
</script>

<template>
  <AsyncComponentProvider @resolved="onAllResolved" @loading="onLoadingStarted">
    <ul>
      <Child v-for="i in 20" :key="i" />
    </ul>
    
    <template #fallback>
      <div>Multiple Components Loading...</div>
    </template>    
  </AsyncComponentProvider>
</template>

```

#### Child Component

```vue
<template>
    <li>Child #{{ instance.uid }} - {{ content }}</li>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, getCurrentInstance } from 'vue'

// Inject the functions from the provider
const asyncComponentLoading = inject('asyncComponentLoading') as (component: any) => void
const asyncComponentResolved = inject('asyncComponentResolved') as (component: any) => void

// State
const content = ref('Loading...')
const resolveTime = Math.floor(Math.random() * 3000) + 1000 // 1-4 seconds

// Get the current component instance to access uid
const instance = getCurrentInstance()!

// Notify provider on creation
asyncComponentLoading(instance.proxy)

// Simulate async loading and notify provider on resolve
onMounted(() => {
  setTimeout(() => {
    content.value = 'Loaded in ' + resolveTime + 'ms'
    asyncComponentResolved(instance.proxy)
  }, resolveTime)
})
</script>
```