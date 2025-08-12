<template>
  <div class="container-progress">
    <div class='progress-item' :class="{ 'ed': item.status === 2, 'ing': item.status === 1 }" v-for="item in progress"
      :key="item">
      <Icon v-if="item.status === 2" icon="ep:success-filled" class="icon text-14px" />
      <Icon v-else icon="ic:baseline-radio-button-unchecked" class="icon text-14px" />
      {{ bodySectionMap[item.section_id] }}
    </div>
  </div>
</template>

<script setup>
import { bodySectionMap } from '@renderer/constants'
defineProps({
  progress: {
    type: Array,
    default: () => ([])
  },
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
    width: 100px;
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
      color: #00FFAE;
    }

    &.ing {
      color: #fff;

      .icon {
        color: #00FFAE;
      }

    }

    &:not(:first-child)::before {
      content: '';
      position: absolute;
      top: 25px;
      left: 0;
      width: calc(50% - 10px);
      height: 1px;
      border-top: 1px dashed var(--el-border-color);
    }

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 25px;
      right: 0;
      width: calc(50% - 1px);
      height: 1px;
      border-top: 1px dashed var(--el-border-color);
    }

  }
}
</style>
