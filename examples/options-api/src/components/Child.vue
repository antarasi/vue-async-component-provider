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
    }
})
</script>