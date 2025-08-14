<template>
  <div class="container-quality">
    <div class="label">Image quality</div>
    <div class="quality">
      <div class="quality-bar-fill" :style="{ height: quality * 20 + '%' }"></div>
      <div class="quality-bar"></div>
      <div class="quality-bar"></div>
      <div class="quality-bar"></div>
      <div class="quality-bar"></div>
      <div class="quality-bar"></div>
    </div>
    <div class="mt-10px font-bold text-10px">{{ qualityDesc }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  quality: {
    type: Number,
    default: () => 0
  }
})

const qualityDesc = ref(null)
const gradientStartColor = ref('transparent')
const gradientEndColor = ref('transparent')

const gradientMap = {
  0: ['transparent', 'transparent'],
  1: ['#f4aeac', '#ff4848'],
  2: ['#f4aeac', '#ff4848'],
  3: ['#f0d6b2', '#eaa751'],
  4: ['#ddffbb', '#84d651'],
  5: ['#ddffbb', '#84d651']
}

const qualityMap = {
  0: '',
  1: 'Bad',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Perfect'
}

watch(
  () => props.quality,
  (newValue) => {
    gradientStartColor.value = gradientMap[newValue][0] || 'transparent'
    gradientEndColor.value = gradientMap[newValue][1] || 'transparent'
    qualityDesc.value = qualityMap[newValue]
  },
  {
    immediate: true
  }
)
</script>

<style lang="less" scoped>
.container-quality {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 40px 0;

  .label {
    position: absolute;
    bottom: 90px;
    left: 0;
    font-size: 9px;
    color: #4f5051;
    transform: rotate(-90deg);
    transform-origin: center center;
  }
}

.quality {
  position: relative;
  display: flex;
  flex-flow: column-reverse nowrap;
  align-items: center;
  justify-content: flex-start;
  width: 15px;
  height: 290px;
  background-color: rgba(79, 80, 81, 1);
  border-radius: 1px;
  overflow: hidden;

  .quality-bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 15px;
    background-image: linear-gradient(to top, v-bind(gradientStartColor), v-bind(gradientEndColor));
    z-index: 0;
    transition: all 0.2s ease-in-out;
  }

  .quality-bar {
    position: relative;
    width: 15px;
    height: 20%;
    border-top: 2px solid #000;
    background-color: transparent;

    &:last-child {
      border-top: 0;
    }
  }
}
</style>
