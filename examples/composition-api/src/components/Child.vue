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