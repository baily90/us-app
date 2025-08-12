import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from '@renderer/utils/progress'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@renderer/views/home/index.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@renderer/views/about/index.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  next()
  // const appStore = useAppStore()
  // const { isLogin } = storeToRefs(appStore)

  // if (isLogin.value) {
  //   if (to.path === '/login') {
  //     next('/')
  //   } else {
  //     next()
  //   }
  // } else {
  //   if (!to.meta?.noNeedsLogin) {
  //     next({ path: '/login', replace: true })
  //   } else {
  //     next()
  //   }
  // }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
