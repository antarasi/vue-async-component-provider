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
  data() {
    return {
      nonce: 0,
      resolveOnce: false,
      allResolved: false,
    }
  },
  methods: {
    onAllResolved() {
      // when all children are resolved, we can change the global loading state
      this.allResolved = true
      console.log('All resolved')
    },
    onLoadingStarted() {
      // when a child component starts loading again, we can react to that change
      this.allResolved = false
      console.log('Loading started')
    },
    reloadAll() {
      this.nonce++
    }
  },
})
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
