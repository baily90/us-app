<template>
  <div class="container-progress">
    <div v-for="item in progress" :key="item" class="progress-item"
      :class="{ ed: item.status === 2, ing: item.status === 1 }">
      <Icon v-if="item.status === 2" icon="ep:success-filled" class="icon text-16px" />
      <Icon v-else icon="ic:baseline-radio-button-unchecked" class="icon text-16px" />
      {{ bodySectionMap[item.section_id] }}
    </div>
  </div>
</template>

<script setup>
import { bodySectionMap } from '@renderer/constants'
defineProps({
  progress: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="less" scoped>
.container-progress {
  display: flex;
  flex-wrap: nowrap;
  width: fit-content;
  height: 100px;

  .progress-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 130px;
    height: 100%;
    padding-top: 20px;
    flex-shrink: 0;
    font-size: 12px;
    color: #999;
    text-align: center;
    white-space: pre-line;

    .icon {
      position: absolute;
      top: 30px;
      left: 50%;
      margin: -12px -12px;
    }

    &.ed {
      color: #00ffae;
    }

    &.ing {
      color: #fff;

      .icon {
        color: #00ffae;
      }
    }

    &:not(:first-child)::before {
      content: '';
      position: absolute;
      top: 25px;
      left: 1px;
      width: calc(50% - 12px);
      height: 1px;
      border-top: 1px dashed var(--el-border-color);
    }

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 25px;
      right: 1px;
      width: calc(50% - 8px);
      height: 1px;
      border-top: 1px dashed var(--el-border-color);
    }
  }
}
</style>
