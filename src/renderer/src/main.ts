import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'
import throttleClick from './directives'
import App from './App.vue'
import router from './router'
import store from './stores'
import '@renderer/assets/styles/main.less'
import 'virtual:uno.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import Vconsole from 'vconsole'

const app = createApp(App)

app.use(createPinia())
app.component('Icon', Icon)
app.use(store)
app.use(router)
app.use(throttleClick)

if (process.env.NODE_ENV === 'development') {
  new Vconsole()
}

app.mount('#app')
