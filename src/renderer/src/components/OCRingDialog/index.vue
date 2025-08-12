<template>
  <Transition>
    <div class="ocring-container" v-if="visible">
      <div class="btn position" @click="settingDialog.open('position')"></div>
      <div class="btn patient" @click="settingDialog.open('patient')"></div>
      <img src="@renderer/assets/images/bg_ocring.png" alt="">
      <SettingDialog ref="settingDialog" />
    </div>
  </Transition>
</template>

<script setup>
import SettingDialog from '@renderer/components/SettingDialog/index.vue'

const visible = ref(true)
const settingDialog = ref(null)

const open = () => {
  visible.value = true
}
const close = () => {
  visible.value = false
}

defineExpose({ open, close })
</script>

<style scoped lang="less">
.ocring-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  opacity: 1;
}

.btn {
  position: absolute;
  top: 0;
  width: 50px;
  height: 5%;
  z-index: 1;

  &.position {
    left: 0;
  }

  &.patient {
    right: 0;
  }
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  z-index: -1;
}
</style>
