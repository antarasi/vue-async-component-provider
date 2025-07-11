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
    const nonce = ref(0)
    const resolveOnce = ref(false)
    const allResolved = ref(false)

    function onAllResolved() {
      allResolved.value = true
      console.log('All resolved')
    }
    function onLoadingStarted() {
      allResolved.value = false
      console.log('Loading started')
    }
    function reloadAll() {
      nonce.value++
    }

    return {
      nonce,
      resolveOnce,
      allResolved,
      onAllResolved,
      onLoadingStarted,
      reloadAll,
    }
  },
}
</script>

<template>
  <div id="header">
    <div>
      <input type="checkbox" v-model="resolveOnce" /> Resolve once
    </div>
    <button @click="reloadAll">Reload All</button>
    <div>
      <div>Parent state:</div>
      <div class="icon">
        <div class="icon-check" v-if="allResolved" />
        <div class="icon-loading animate-spin" v-else />
      </div>
    </div>
  </div>
  <AsyncComponentProvider :resolve-once="resolveOnce" @resolved="onAllResolved" @loading="onLoadingStarted">
    <ul>
      <Child v-for="i in 20" :key="i + nonce" />
    </ul>

    <!-- uncomment to provide a fallback component while loading -->
    <!-- 
    <template #fallback>
      <div>Multiple Components Loading...</div>
    </template> 
    -->
  </AsyncComponentProvider>
</template>
