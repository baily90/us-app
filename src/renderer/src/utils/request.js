import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.RENDERER_VITE_BASE_URL + import.meta.env.RENDERER_VITE_API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

request.interceptors.request.use((config) => {
  return config
})

request.interceptors.response.use(
  (response) => {
    if (response.status && response.status === 200) {
      const { status, message = '数据异常' } = response?.data
      if (status !== 0) {
        ElMessage({
          message: message,
          type: 'error'
        })
        return Promise.reject(message)
      }
      return response.data
    }
  },
  (err) => {
    ElMessage({
      message: err.message || '服务器异常',
      type: 'error'
    })
    return Promise.reject(err.message || '服务器异常')
  }
)

export default request
