import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
// import router from './router/index';
// import * as localstorageUtil from './utils/localstorage';
import VueRouter from 'vue-router'
import axios from 'axios';

Vue.use(VueRouter);

Vue.config.productionTip = false
Vue.prototype.$http = axios;


import Login from './components/Login';
import Register from './components/Register';
// import HelloWorld from './components/HelloWorld';

const routes = [
  {path: '/login', component: Login},
  {path: '/register', component: Register},
  // {path: '/hello', component: HelloWorld},
  // { path: '/bar', component: Bar }
]
const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>',
//   vuetify,
// });
