# vue-async-component-provider

[![npm version](https://img.shields.io/npm/v/vue-async-component-provider)](https://npmjs.com/package/vue-async-component-provider)

A Vue 3 component providing a customizable Suspense replacement. 

Use `AsyncComponentProvider` when you have multiple child components that load data asynchronously and you want the parent component to wait until all child components resolve.

## Installation

```bash
npm install vue-async-component-provider
```

## Usage

### Vue Options API 

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

### Vue Composition API

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

## API

### Props

| Prop         | Type    | Default | Description                                                                 |
|--------------|---------|---------|-----------------------------------------------------------------------------|
| resolveOnce  | Boolean | false   | If true, the provider will ignore resolved dependencies after the initial resolution. Useful when you want to react to initial load only and ignore subsequent interactions. |

### Slots

- **default**: The components that may trigger async loading.
- **fallback**: (Named slot) Content to display while loading is in progress. If the fallback slot is not implemented, individual components are responsibile for rendering their loading state.

### Events

| Event     | Payload | Description                                 |
|-----------|---------|---------------------------------------------|
| loading   | —       | Emitted when the first dependency loading starts.                |
| resolved  | —       | Emitted when all registered async children are resolved. |

## How It Works

- Child components call the injected methods to notify the provider when they start or finish loading:
  - `asyncComponentLoading(component)`
  - `asyncComponentResolved(component)`

- The provider tracks all registered async children and their resolution state.
- When all registered children are resolved, the fallback is hidden and the `resolved` event is emitted.

## Contributing

PRs and suggestions welcome!

## License

MIT

