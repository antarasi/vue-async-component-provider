<script lang="ts">
import { defineComponent, type ComponentPublicInstance } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    asyncComponentLoading: (component: ComponentPublicInstance) => void
    asyncComponentResolved: (component: ComponentPublicInstance) => Promise<void>
  }
}

function createDebounce(delayMs: number) {
  let timeout: number | undefined = undefined
  return function (callback: () => void): void {
    clearTimeout(timeout)
    timeout = window.setTimeout(callback, delayMs)
  }
}

/**
 * AsyncComponentProvider.vue
 *
 * A Vue 3 component that acts as a customizable Suspense replacement.
 * Use as a wrapper to manage the state of multiple async dependencies in a component tree.
 *
 * @example
 * <AsyncComponentProvider>
 *   <AsyncChildComponent />
 *   <template #fallback>Loading...</template>
 * </AsyncComponentProvider>
 */
export default defineComponent({
  name: 'AsyncComponentProvider',
  provide() {
    return {
      asyncComponentLoading: this.asyncComponentLoading,
      asyncComponentResolved: this.asyncComponentResolved,
    }
  },
  props: {
    resolveOnce: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['loading', 'resolved'],
  data() {
    return {
      loading: false,
      stopResolving: false,
      registeredComponentIds: [] as number[],
      resolvedComponentIds: new Set() as Set<number>,
      resolvedDebounce: createDebounce(50),
    }
  },
  methods: {
    isResolved() {
      return this.registeredComponentIds.every((id: number) => this.resolvedComponentIds.has(id))
    },
    asyncComponentLoading(component: ComponentPublicInstance): void {
      if (this.stopResolving) return

      this.registeredComponentIds.push(component.$.uid)

      if (!this.loading) {
        this.loading = true
        this.$emit('loading')
      }
    },
    async asyncComponentResolved(component: ComponentPublicInstance): Promise<void> {
      if (this.stopResolving) return

      this.resolvedComponentIds.add(component.$.uid)

      // wait for the next tick to ensure all components are created before we start resolving
      // this.$nextTick() is not enough - when rendering many child async components the first batch may be resolved before the second batch is created
      this.resolvedDebounce(() => {
        if (this.isResolved()) {
          this.loading = false

          if (this.resolveOnce) {
            this.stopResolving = true
          }

          this.resolvedComponentIds.clear()
          this.registeredComponentIds.length = 0
          this.$emit('resolved')
        }
      })
    },
  },
})
</script>

<template>
  <div v-show="!loading || !$slots.fallback" v-bind="$attrs">
    <slot />
  </div>
  <slot v-if="loading" v-bind="$attrs" name="fallback" />
</template>
