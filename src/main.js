
import Vue from 'vue'
import VueRouter from 'vue-router'
import Http from './utils/http'
import Utils from './utils/index'
import routes from './router'
import mixin from './mixins'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import 'font-awesome/css/font-awesome.min.css'


Vue.config.productionTip = false
Vue.use(Http);
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Utils)
Vue.mixin(mixin)
const router = new VueRouter({
  // mode: 'history',
  base: __dirname,
  routes: routes
})
Vue.$router = router

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(unescape(sessionStorage.getItem('user')));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')

window.eventBus = new Vue();

