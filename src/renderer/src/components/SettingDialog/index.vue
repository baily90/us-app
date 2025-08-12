<template>
  <el-dialog v-model="visible" :title="`${type} setting`" width="80%" destroy-on-close center
    border="1px solid [var(--el-border-color)]">
    <canvas id="roi-box" class="roi-box w-full h-60vh"></canvas>
    <template #footer>
      <el-button type="primary" @click="onResetHandle" v-throttle :auto-insert-space="true" v-if="isResetButtonVisible"
        :loading="isResetLoading">重置初始值</el-button>
      <el-button type="primary" @click="onSubmitHandle" v-throttle :auto-insert-space="true"
        :loading="isSettingLoading">确定</el-button>
      <el-button @click="onCloseHandle" v-throttle :auto-insert-space="true">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import CanvasSelect from 'canvas-select'
import { getCoordinates, setCoordinates } from '@renderer/api/home.js'
import { getInitialData, transformToCanvas, transformToData } from './util'

const type = ref(null) // ultrasound-影像选区, position-部位选区, patient-患者选区
const label = ref(null)
const visible = ref(false)
const initialData = ref(null)
const isResetButtonVisible = computed(() => !!initialData.value && type.value === 'ultrasound')
const isSettingLoading = ref(false)
const isResetLoading = ref(false)
const onResetHandle = async () => {
  try {
    isResetLoading.value = true
    await ElMessageBox.confirm('确定要重置为初始值吗？', '提示', {
      type: 'warning',
    })
    const requestBody = transformToData('ultrasound', initialData.value)
    console.log(requestBody);
    const { status } = await setCoordinates(requestBody)
    if (status === 0) {
      onCloseHandle()
      ElMessage.success('重置成功')
    }
  } catch (error) {

  } finally {
    isResetLoading.value = false
  }
}

const onSubmitHandle = async () => {
  try {
    if (!label.value || !label.value?.length) {
      ElMessage.error('请设置选区')
      return
    }
    isSettingLoading.value = true
    const data = transformToData(type.value, label.value)
    let extraData = {}
    if (type.value === 'ultrasound' && !initialData.value) {
      extraData = transformToData('initial', label.value)
    }
    const requestBody = {
      ...data,
      ...extraData
    }
    console.log(requestBody);
    const { status } = await setCoordinates(requestBody)
    if (status === 0) {
      onCloseHandle()
      ElMessage.success('设置成功')
    }

  } catch (error) {

  } finally {
    isSettingLoading.value = false
  }
}

const onCloseHandle = () => {
  visible.value = false
}

const initCoordinate = async () => {
  try {
    const { data } = await getCoordinates()
    initialData.value = getInitialData(data)
    const canvasData = transformToCanvas(type.value, data)
    setTimeout(() => {
      const instance = new CanvasSelect("#roi-box")
      instance.setImage(data.frame_base64)
      instance.on('updated', (result) => {
        label.value = result
        if (result.length > 0) {
          instance.createType = 0
        } else {
          instance.createType = 1
        }
      })
      if (canvasData?.length > 0) {
        instance.setData(canvasData)
        instance.createType = 0
      } else {
        instance.createType = 1
      }
    }, 0)
  } catch (error) {
    console.log(error)
  }
}


const open = async (val) => {
  type.value = val
  visible.value = true
  isSettingLoading.value = false
  isResetLoading.value = false
  initCoordinate()
}
defineExpose({ open })
</script>
