# vue-async-component-provider

A Vue 3 component library providing a customizable Suspense replacement. Use `AsyncComponentProvider` as a wrapper component to manage the state of multiple async dependencies in a component tree.

## Installation

```bash
npm install vue-async-component-provider
```

## Usage

### Global Registration

```js
import { createApp } from 'vue'
import AsyncComponentProvider from 'vue-async-component-provider'

const app = createApp(App)
app.use(AsyncComponentProvider)
```

### Local Registration

```js
import { AsyncComponentProvider } from 'vue-async-component-provider'

export default {
  components: {
    AsyncComponentProvider
  }
}
```

## License

MIT

