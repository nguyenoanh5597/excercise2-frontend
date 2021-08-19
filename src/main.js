import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/index';
// import * as localstorageUtil from './utils/localstorage';
import axios from 'axios';

Vue.config.productionTip = false
Vue.prototype.$http = axios;

router.beforeEach((to, from, next) => {
  console.log(to, from, next)
  // if (to.matched.some(record => record.meta.auth)) {
  //   if (!localstorageUtil.getItem('token')) {
  //     console.log(to)
  //     next({
  //       path: '/login',
  //       params: { nextUrl: to.fullPath },
  //     });
  //   } else {
  //     next();
  //   }
  // } else {
  //   next();
  // }
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>',
//   vuetify,
// });
