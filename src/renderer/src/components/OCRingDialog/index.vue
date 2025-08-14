<template>
  <Transition>
    <div v-if="visible" class="ocring-container">
      <img src="@renderer/assets/images/bg_ocring.png" alt="" />
    </div>
  </Transition>
</template>

<script setup>
const visible = ref(true)

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
