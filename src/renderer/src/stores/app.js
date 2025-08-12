export default defineStore(
  'app',
  () => {
    const defaultRoi = ref(null)
    const currentRoi = ref(null)

    const setDefaultRoi = (roi) => {
      defaultRoi.value = roi
    }
    const setCurrentRoi = (roi) => {
      currentRoi.value = roi
    }

    return { defaultRoi, currentRoi, setDefaultRoi, setCurrentRoi }
  },
  {
    persist: true,
  },
)
