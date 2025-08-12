export default function useWebSocket(url) {
  const isAlive = ref(false) // 用于判断心跳是否正常
  const reconnectAttempts = ref(0) // 重连尝试次数
  const MAX_RECONNECT_ATTEMPTS = ref(5) // 最大重连次数
  const HEARTBEAT_INTERVAL = ref(3000) // 心跳间隔时间 (3秒)
  const heartbeatTimer = ref(null)
  const reconnectTimer = ref(null)

  const message = ref(null)
  const isConnected = ref(false)
  const websocket = ref(null)

  const connect = () => {
    websocket.value = new WebSocket(url)
    websocket.value.onopen = () => {
      // 连接成功
      console.log('WebSocket connected')
      reconnectAttempts.value = 0 // 成功连接后重置重试次数
      startHeartbeat() // 开始心跳检测
      isConnected.value = true
    }

    websocket.value.onmessage = (event) => {
      // 处理接收到的消息
      message.value = event.data ? JSON.parse(event.data) : null
      if (event.data.includes('pong')) {
        receivePong()
      }
    }

    websocket.value.onclose = () => {
      console.log('WebSocket connection closed')
      isConnected.value = false
      stopHeartbeat()
      attemptReconnect()
    }

    websocket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  const startHeartbeat = () => {
    if (!heartbeatTimer.value) {
      heartbeatTimer.value = setInterval(() => {
        if (websocket.value.readyState === WebSocket.OPEN) {
          isAlive.value = false
          sendPing()
        }
      }, HEARTBEAT_INTERVAL.value)
    }
  }

  const stopHeartbeat = () => {
    if (heartbeatTimer.value) {
      clearInterval(heartbeatTimer.value)
      heartbeatTimer.value = null
    }
  }

  const attemptReconnect = () => {
    if (reconnectAttempts.value < MAX_RECONNECT_ATTEMPTS.value) {
      reconnectAttempts.value++
      console.log(`Attempting to reconnect (${reconnectAttempts.value})...`)
      reconnectTimer.value = setTimeout(() => {
        connect()
      }, 1000 * reconnectAttempts.value) // 指数退避算法
    } else {
      console.error('Max reconnect attempts reached')
    }
  }

  const sendPing = () => {
    websocket.value.send(JSON.stringify({ action: 'ping' }))
    setTimeout(() => {
      if (!isAlive.value) {
        console.warn('WebSocket heartbeat failed, attempting to reconnect...')
        websocket.value.close()
      }
    }, HEARTBEAT_INTERVAL.value / 2) // 如果没有pong响应，则关闭并重连
  }

  const receivePong = () => {
    isAlive.value = true
  }

  const sendMessage = (message) => {
    if (websocket.value?.readyState === WebSocket.OPEN) {
      websocket.value.send(JSON.stringify(message))
    }
  }

  const close = () => {
    stopHeartbeat()
    if (reconnectTimer.value) {
      clearTimeout(reconnectTimer.value)
      reconnectTimer.value = null
    }
    if (websocket.value) {
      websocket.value.close()
      websocket.value = null
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    close()
  })

  return { isConnected, message, sendMessage }
}
