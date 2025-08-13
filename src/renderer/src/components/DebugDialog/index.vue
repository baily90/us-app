<template>
  <el-dialog v-model="visible" title="settings" destroy-on-close center border="1px solid [var(--el-border-color)]">
    <el-button link @click="settingDialog.open('position')">
      <Icon icon="game-icons:trench-body-armor" class="mr-5px text-24px" />
      position
    </el-button>
    <el-button link @click="settingDialog.open('patient')">
      <Icon icon="fluent:patient-24-filled" class="mr-5px text-24px" />
      patient
    </el-button>
    <el-button link @click="settingDialog.open('imt')">
      <Icon icon="tabler:ruler-measure" class="mr-5px text-24px" />
      imt
    </el-button>
    <template #footer>
      <el-button v-throttle :auto-insert-space="true" @click="close">关闭</el-button>
    </template>
  </el-dialog>
  <SettingDialog ref="settingDialog" />
</template>

<script setup>
import SettingDialog from '@renderer/components/SettingDialog/index.vue'

const settingDialog = ref(null)
const visible = ref(false)

const close = () => {
  visible.value = false
}

const open = async (val) => {
  visible.value = true
}
defineExpose({ open })
</script>
