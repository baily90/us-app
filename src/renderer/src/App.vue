<template>
  <el-config-provider :locale="en">
    <Router-view />
  </el-config-provider>
</template>

<script setup>
import en from 'element-plus/dist/locale/en.mjs'
</script>
