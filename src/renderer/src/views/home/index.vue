<template>
  <el-container class="w-100vw h-100vh bg-black">
    <el-header class="header">
      <div class="header-left">
        <div class="logo">
          <img class="icon-logo" src="@renderer/assets/images/icon_logo.png" mode="scaleToFill" />
          <div>Instant scan</div>
        </div>
        <div class="slogan">Every learner scan,in one place</div>
      </div>
      <div class="body">
        {{ bodyPartMap[info?.body_part]
        }}{{
          bodySectionMap[info?.current_scan_section]
            ? `--${bodySectionMap[info?.current_scan_section]}`
            : ''
        }}
      </div>
      <div class="header-right">
        <el-button link @click="settingDialog.open('ultrasound')">
          <Icon icon="lets-icons:setting-alt-line" class="text-30px" />
        </el-button>
      </div>
    </el-header>
    <el-container class="w-full">
      <el-main class="pos-relative w-[1160px] !px-9px !py-9px !pr-100px">
        <div id="mark-box" class="w-100% h-100%"></div>
        <ImageQuality class="pos-absolute pos-right-0 pos-top-0 w-100px h-100%" :quality="image_quality" />
      </el-main>
      <el-main class="w-[760px] !px-0 !pr-40px">
        <div class="container-info" :class="tips?.type">
          <Icon v-if="tips?.type === 'success'" class="icon icon-success mr-5px text-24px flex-shrink-0"
            icon="ep:success-filled" />
          <Icon v-if="tips?.type === 'error'" class="icon icon-error mr-5px text-24px flex-shrink-0"
            icon="ep:info-filled" />
          {{ tips?.msg }}
        </div>
        <div class="container-example">
          <!-- 教学示意图 -->
          <!-- :src="getAssetsFile(`./../../assets/images/gif_${info?.current_scan_section}.png`)" -->
          <img class="example-gif" :src="getAssetsFile(`./../../assets/images/gif_test.jpeg`)" alt="" />
          <!-- 影像示意图 -->
          <img class="example-image" :src="getAssetsFile(`./../../assets/images/img_${info?.current_scan_section}.png`)"
            alt="" />
          <!-- 指引箭头 -->
          <div v-if="info?.scan_progress?.probe_offset_direction !== 'none'" class="arrow"
            :class="info?.scan_progress?.probe_offset_direction"></div>
        </div>
        <el-scrollbar class="container-indicator">
          <ScanProgress :progress="scan_progress" />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
  <SettingDialog ref="settingDialog" />
  <OCRingDialog ref="ocringDialog" />
</template>

<script setup>
import CanvasMarkBoard from '@renderer/lib/canvas-mark-board/index.ts'
import useWebSocket from '@renderer/hooks/useWebSocket'
import SettingDialog from '@renderer/components/SettingDialog/index.vue'
import OCRingDialog from '@renderer/components/OCRingDialog/index.vue'
import ImageQuality from '@renderer/components/ImageQuality/index.vue'
import ScanProgress from '@renderer/components/ScanProgress/index.vue'
import { MarkDotObject } from './custom-mark.ts'
import { bodyPartMap, bodySectionMap, tipsMap } from '@renderer/constants'

const mark = ref(null)
const info = ref(null)
const settingDialog = ref(null)
const ocringDialog = ref(null)

const image_quality = computed(() => info.value?.image_quality)

const tips = computed(() => {
  if (!info.value?.current_scan_section) {
    // 未检测到切面 则提示失败信息
    return {
      type: 'error',
      msg: 'No section detected; please confirm the probe is placed as shown'
    }
  } else if (info.value?.current_scan_status === 1) {
    // 扫描中 提示对应提示
    return { type: 'scan', msg: tipsMap[info.value?.body_part]?.[info.value?.current_scan_section] }
  } else if (info.value?.current_scan_status === 2) {
    // 扫描完成 提示完成
    return { type: 'success', msg: 'Done' }
  }
})
const scan_progress = computed(() => {
  const key =
    info.value?.body_part === 1
      ? 'thyroid_scan_status'
      : info.value?.body_part === 2
        ? 'carotid_artery_scan_status'
        : ''
  return info.value?.scan_progress?.[key] || []
})

const { isConnected, sendMessage, message } = useWebSocket(import.meta.env.RENDERER_VITE_WS_URL)

const renderMark = async ({ image, contours }) => {
  mark.value?.clearMarkShapes()
  mark.value?.setBackground(image)
  if (contours) {
    mark.value?.setObjectData(contours)
  }
}
const renderStatus = async (data) => {
  info.value = data
}

const getAssetsFile = (url) => {
  console.log(url, import.meta.url, new URL(url, import.meta.url).href)

  return new URL(url, import.meta.url).href
}

watchEffect(() => {
  if (message.value) {
    const { action, data } = message.value
    if (action === 'update') {
      renderMark(data)
    } else if (action === 'status') {
      if (data?.body_part) {
        renderStatus(data)
        ocringDialog.value.close()
      } else {
        ocringDialog.value.open()
      }
    }
  }
})

onMounted(() => {
  mark.value = new CanvasMarkBoard({
    view: '#mark-box', // dom 选择器
    showIndex: true,
    disable: false,
    lineWidth: 1
  })
  mark.value.register('dot', MarkDotObject)
})
</script>

<style lang="less" scoped>
@import url(./index.less);
</style>
