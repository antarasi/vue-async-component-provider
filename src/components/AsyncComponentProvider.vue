<script lang="ts">
import { defineComponent, type ComponentPublicInstance } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    asyncComponentLoading: (component: ComponentPublicInstance) => void
    asyncComponentResolved: (component: ComponentPublicInstance) => void
    asyncComponentUnregistered: (component: ComponentPublicInstance) => void
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
      asyncComponentUnregistered: this.asyncComponentUnregistered,
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
    asyncComponentResolved(component: ComponentPublicInstance): void {
      if (this.stopResolving) return

      this.resolvedComponentIds.add(component.$.uid)

      if (this.isResolved()) {
        this.loading = false

        if (this.resolveOnce) {
          this.stopResolving = true
        }
        this.$emit('resolved')
      }
    },
    asyncComponentUnregistered(component: ComponentPublicInstance): void {
      this.registeredComponentIds = this.registeredComponentIds.filter((id: number) => id !== component.$.uid)
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
