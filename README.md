# vue-async-component-provider

A Vue 3 component providing a customizable Suspense replacement. 

Use `AsyncComponentProvider` when you have multiple child components that load data asynchronously and you want the parent component to wait until all child components resolve.

## Demo

TBD

## Installation

```bash
npm install vue-async-component-provider
```

## Usage

### Vue Options API

```vue
// Parent component
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

```vue
// Child component
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

