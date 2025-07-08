# vue-async-component-provider

A Vue 3 component library providing a customizable Suspense replacement. Use `AsyncComponentProvider` as a wrapper component to manage the state of multiple async dependencies in a component tree.

## Installation

```bash
npm install vue-async-component-provider
```

## Usage

```vue
// Parent component
<script lang="ts">
import { AsyncComponentProvider } from 'vue-async-component-provider'

export default {
  components: {
    AsyncComponentProvider
  },
  methods: {
    onAsyncChildrenResolved() {
      console.log('all children are loaded')
    },
    onAsyncChildrenStartedLoading() {
      console.log('async children started loading')
    }
  }
}
</script>

<template>
  <AsyncComponentProvider @resolved="onAsyncChildrenResolved" @loading="onAsyncChildrenStartedLoading">
    <ChildComponentWithAsyncLoad v-for="item in items">

    <template #fallback>
      <div>Multiple Components Loading...</div>
    </template>
  </AsyncComponentProvider>
</template>
```

```vue
// Child component
<script lang="ts">
export default defineComponent({
  data() {
    return {
      content: 'Loading...'
    }
  },
  beforeMount() {
    // register to async provider before the component is mounted
    this.asyncComponentLoading(this)
  },
  methods: {
    async renderContent() {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      this.content = "Loaded component " + this.$.uid;
      // tell async provider this component has finished loading
      this.asyncComponentResolved(this)
    },
  },
})
</script>

<template>
  <div>{{ content }}</div>
</template>
```

## API

### Props

| Prop         | Type    | Default | Description                                                                 |
|--------------|---------|---------|-----------------------------------------------------------------------------|
| resolveOnce  | Boolean | false   | If true, the provider will ignore resolved dependencies after the initial resolution. Useful when you want to react to initial load only and ignore subsequent interactions. |

### Slots

- **default**: The content/components that may trigger async loading.
- **fallback**: (Named slot) Content to display while loading is in progress. If the fallback slot is not implemented, individual components are responsibile for rendering their loading state.

### Events

| Event     | Payload | Description                                 |
|-----------|---------|---------------------------------------------|
| loading   | —       | Emitted when the first dependency loading starts.                |
| resolved  | —       | Emitted when all registered async children are resolved. |

## How It Works

- Child components can call the injected methods to notify the provider when they start or finish loading:
  - `asyncComponentLoading(component)`
  - `asyncComponentResolved(component)`
  - `asyncComponentUnregistered(component)`

- The provider tracks all registered async children and their resolution state.
- When all registered children are resolved, the fallback is hidden and the `resolved` event is emitted.


## License

MIT

