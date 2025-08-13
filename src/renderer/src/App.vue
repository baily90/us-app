<template>
  <el-config-provider :locale="en">
    <div @click="onDebugHandle">
      <Router-view />
    </div>
    <DebugDialog ref="debugDialog" />
  </el-config-provider>
</template>

<script setup>
import en from 'element-plus/dist/locale/en.mjs'
import DebugDialog from '@renderer/components/DebugDialog/index.vue'

const debugDialog = ref(null)
const timerRef = ref(null)
const clickCount = ref(0)
const onDebugHandle = () => {
  clickCount.value++
  if (timerRef.value) {
    clearTimeout(timerRef.value)
  }
  timerRef.value = setTimeout(() => {
    if (clickCount.value >= 10) {
      debugDialog.value.open()
    }
    clickCount.value = 0
  }, 500)
}
</script>
